import { json } from "@sveltejs/kit";
import { db } from "$lib/scripts/db";
import Stripe from "stripe";
import * as fs from "fs";
import { SECRET_MAIL_USER } from "$env/static/private";
import { SECRET_MAIL_PASS } from "$env/static/private";
import easyinvoice from "easyinvoice";
import { UPLOAD_PATH } from "$env/static/private";
import { SECRET_STRIPE_KEY } from "$env/static/private";

import { EntityType } from "@prisma/client";

const stripe = new Stripe(SECRET_STRIPE_KEY);

import { redirect } from "@sveltejs/kit";
import { render } from "svelte-email";

import Order from "$lib/components/app/emails/Order.svelte";
import nodemailer from "nodemailer";

export async function POST({ request }) {
  const data = Object.fromEntries(await request.formData());

  if (data.terms !== "on") {
    data.userdata.error = "You must agree to the terms to proceed";
    return json(data);
  }

  function parseAddress(address) {
    try {
      const obj = JSON.parse(address);
      return obj.value;
    } catch (error) {
      return address;
    }
  }

  let userdata = JSON.parse(data.userdata);

  let parsedAddress = parseAddress(data.shipping_address);
  let parsedCart = userdata.cart;

  parsedCart.items.forEach((item, index) => {
    fs.rename(
      `${item.file.file}`,
      `files/${item.file.file.slice(5)}`,
      (err) => {
        if (err) {
          console.log(err);
        }
      }
    );
    console.log("moved");
    parsedCart.items[index].file.file = `files/${item.file.file.slice(5)}`;
  });

  let search = [];

  parsedCart.items.map((item) => search.push(item.price.id));

  const prices = await db.price.findMany({
    where: {
      id: { in: search },
    },
  });

  userdata.total.with_tax = prices.reduce((prev, cur) => {
    return prev + cur.price;
  }, 0);

  if (userdata.promo.code) {
    let code = await db.promo.findUnique({
      where: {
        code: userdata.promo.code,
      },
    });

    if (code) {
      userdata.promo.discount = code.amount;
      userdata.promo.valid = true;
    } else {
      userdata.error = "Error validating promocode";
      return json(data);
    }
  }

  if (userdata.shipping.type === "omniva") {
    userdata.shipping.cost = 5;

    if (userdata.promo.valid) {
      userdata.total.with_tax = (
        userdata.total.with_tax * ((100 - userdata.promo.discount) / 100) +
        userdata.shipping.cost
      ).toFixed(2);

      userdata.total.without_tax = (
        userdata.total.with_tax -
        userdata.total.with_tax * 0.21
      ).toFixed(2);
    } else {
      userdata.total.with_tax = (
        userdata.total.with_tax + userdata.shipping.cost
      ).toFixed(2);

      userdata.total.without_tax = (
        userdata.total.with_tax -
        userdata.total.with_tax * 0.21
      ).toFixed(2);
    }
  } else if (userdata.shipping.type === "post") {
    userdata.shipping.cost = 10;
    if (userdata.promo.valid) {
      userdata.total.with_tax = (
        userdata.total.with_tax * ((100 - userdata.promo.discount) / 100) +
        userdata.shipping.cost
      ).toFixed(2);

      userdata.total.without_tax = (
        userdata.total.with_tax -
        userdata.total.with_tax * 0.21
      ).toFixed(2);
    } else {
      userdata.total.with_tax = (
        userdata.total.with_tax + userdata.shipping.cost
      ).toFixed(2);

      userdata.total.without_tax = (
        userdata.total.with_tax -
        userdata.total.with_tax * 0.21
      ).toFixed(2);
    }
  }

  const cartObjects = parsedCart.items.map((item, index) => ({
    product: {
      connect: { id: item.product.id },
    },
    size: {
      connect: { id: item.size.id },
    },
    quantity: {
      connect: { id: item.quantity.id },
    },
    file: parsedCart.items[index].file.file,
    price: {
      connect: { id: item.price.id },
    },
  }));

  const cartItems = await Promise.all(
    cartObjects.map(async (item) => {
      return await db.cartItem.create({
        data: item,
      });
    })
  );

  const itemIds = cartItems.map((item) => {
    return { id: item.id };
  });

  const order = await db.order.create({
    data: {
      shipping: userdata.shipping.type,
      shipping_address: parsedAddress,
      total:
        userdata.client.type === "legal"
          ? Number(userdata.total.without_tax)
          : Number(userdata.total.with_tax),
    },
  });

  const dbCart = await db.cart.create({
    data: {
      cartItems: {
        connect: itemIds,
      },
      order: {
        connect: { id: order.id },
      },
    },
  });

  let customerData = {};
  let client;

  let invoiceProducts;

  if (userdata.client.type === "private") {
    invoiceProducts = parsedCart.items.map((item) => {
      return {
        quantity: 1,
        description: `${item.product.title} - ${item.size.size} - ${item.quantity.quantity}`,
        "tax-rate": 21,
        price: (
          (item.price.price *
            (userdata.promo.discount > 0
              ? (100 - userdata.promo.discount) / 100
              : 1)) /
          (1 + 0.21)
        ).toFixed(2),
      };
    });

    invoiceProducts.push({
      quantity: 1,
      description: "Shipping",
      "tax-rate": 21,
      price: (Number(userdata.shipping.cost) / (1 + 0.21)).toFixed(2),
    });

    client = {
      company: data.name + " " + data.surname,
      address: data.address,
      city: data.city,
      country: data.country,
      zip: data.zip,
      custom1: `email: ${data.email}`,
      custom2: `phone: ${data.phone}`,
    };

    customerData = {
      data: {
        order: {
          connect: { id: order.id },
        },
        address: data.address,
        city: data.city,
        country: data.country,
        zip: data.zip,
        entity_type: EntityType.PRIVATE,
        privateEntity: {
          create: {
            name: data.name,
            surname: data.surname,
            email: data.email,
            phone: data.phone,
            entity_type: EntityType.PRIVATE,
          },
        },
      },
    };
    await stripe.paymentIntents.update(userdata.stripe.id, {
      amount: (userdata.total.with_tax * 100).toFixed(0),
    });
  } else if (userdata.client.type === "legal") {
    invoiceProducts = parsedCart.items.map((item) => {
      let productPrice = (
        item.price.price *
        (userdata.promo.discount > 0
          ? (100 - userdata.promo.discount) / 100
          : 1)
      ).toFixed(2);
      return {
        quantity: 1,
        description: `${item.product.title} - ${item.size.size} - ${item.quantity.quantity}`,
        "tax-rate": 0,
        price: (productPrice - productPrice * 0.21).toFixed(2),
      };
    });

    invoiceProducts.push({
      quantity: 1,
      description: "Shipping",
      "tax-rate": 0,
      price: (
        Number(userdata.shipping.cost) -
        Number(userdata.shipping.cost) * 0.21
      ).toFixed(2),
    });

    console.log(parsedAddress);

    client = {
      company: data.company,
      address: data.address,
      city: data.city,
      country: data.country,
      zip: data.zip,
      custom1: `email: ${data.email}`,
      custom3: `VAT Nr.: ${data.vat_nr}`,
      custom4: `Reg. Nr.: ${data.reg_nr}`,
    };

    customerData = {
      data: {
        order: {
          connect: { id: order.id },
        },
        address: data.address,
        city: data.city,
        country: data.country,
        zip: data.zip,
        entity_type: EntityType.LEGAL,
        legalEntity: {
          create: {
            company_name: data.company,
            registry_num: data.reg_nr,
            vat_num: data.vat_nr,
            email: data.email,
            phone: data.phone,
            entity_type: EntityType.LEGAL,
          },
        },
      },
    };
    await stripe.paymentIntents.update(userdata.stripe.id, {
      amount: (userdata.total.without_tax * 100).toFixed(0),
    });
  }

  const customer = await db.customer.create({
    data: customerData.data,
  });

  const now = new Date();
  const year = now.getFullYear();
  const day = now.getDate();
  const month = (now.getMonth() + 1).toString().padStart(2, "0"); // add leading zero if needed
  const monthYearString = `${year}-${month}`;

  const count = await db.orderCount.upsert({
    where: {
      month: monthYearString,
    },
    update: {
      count: { increment: 1 },
    },
    create: {
      month: monthYearString,
      count: 1,
    },
  });

  const invoice = {
    data: {
      images: {
        logo: "https://iili.io/HORsAue.png",
      },

      sender: {
        company: "Sia AttaPrint",
        address: "Berzu street 4-57",
        zip: "LV-5101",
        city: "Aizkraukle",
        country: "Latvia",
      },
      client: client,
      information: {
        number: `${day}-${year}-${order.id}`,
        date: `${day}-${month}-${year}`,
        "due-date": `${day}-${month}-${year}`,
      },
      products: invoiceProducts,
      "bottom-notice": "Thank you for choosing us!",
      settings: {
        currency: "EUR",
        "tax-notation": "VAT",
        "margin-top": 25,
        "margin-right": 25,
        "margin-left": 25,
        "margin-bottom": 25,
      },
    },
  };

  await easyinvoice.createInvoice(invoice.data, function (result) {
    fs.writeFile(
      `invoices/${month}-${year}-${order.id + ".pdf"}`,
      Buffer.from(result.pdf, "base64"),
      (err) => {
        if (err) {
          console.log(err);
        }
      }
    );
  });

  const transporter = nodemailer.createTransport({
    host: "printhere.eu",
    port: 465,
    // secure: true,
    tls: {
      rejectUnauthorized: false,
    },

    auth: {
      user: SECRET_MAIL_USER,
      pass: SECRET_MAIL_PASS,
    },
  });

  let total =
    userdata.client.type === "legal"
      ? userdata.total.without_tax
      : userdata.total.with_tax;

  const clientHtml = render({
    template: Order,
    props: {
      userdata: userdata,
      client,
    },
  });

  const orderOptions = {
    from: SECRET_MAIL_USER,
    to: data.email,
    subject: "Order Confirmation",
    html: clientHtml,
    attachments: [
      {
        filename: `${month}-${year}-${order.id + ".pdf"}`,
        path: `invoices/${month}-${year}-${order.id + ".pdf"}`,
        contentType: "application/pdf",
      },
    ],
  };

  const adminOptions = {
    from: SECRET_MAIL_USER,
    to: "zane@attaprint.lv",
    subject: "Jauns pasūtijums",
    text: `jauns pasūtijums`,
  };

  transporter.sendMail(orderOptions);
  transporter.sendMail(adminOptions);

  return json({ success: true, userdata });
}
