import { json } from "@sveltejs/kit";
import { db } from "$lib/scripts/db";
import * as fs from "fs";
import { SECRET_MAIL_USER } from "$env/static/private";
import { SECRET_MAIL_PASS } from "$env/static/private";
import easyinvoice from "easyinvoice";
import { UPLOAD_PATH } from "$env/static/private";

import { redirect } from "@sveltejs/kit";
import { render } from "svelte-email";

import Order from "$lib/components/app/emails/Order.svelte";
import nodemailer from "nodemailer";

export async function POST({ request }) {
  const data = Object.fromEntries(await request.formData());

  console.log(data);
  if (data.terms !== "on") {
    return json({ terms: false });
  }

  function parseAddress(address) {
    try {
      const obj = JSON.parse(address);
      return obj.value;
    } catch (error) {
      return address;
    }
  }

  let parsedAddress = parseAddress(data.address);
  let parsedCart = JSON.parse(data.cart);

  console.log(parsedAddress);

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

  let total = 0

  if (data.entity === "private") {
    total =
    prices.reduce((prev, cur) => {
      return prev + cur.price;
    }, 0) * (data.discount > 0 ? (100 - data.discount) / 100 : 1);
  } else{
    total =
    prices.reduce((prev, cur) => {
      return prev + cur.price;
    }, 0) * (data.discount > 0 ? (100 - data.discount) / 100 : 1);
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
      shipping: data.shippingOption,
      address: parsedAddress,
      total: total + Number(data.shippingCost),
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

  if (data.entity === "private") {
    customerData = {
      data: {
        order: {
          connect: { id: order.id },
        },
        entityType: "PRIVATE",
        privateEntity: {
          create: {
            name: data.name,
            surname: data.surname,
            email: email,
            phone: phone,
          },
        },
      },
    };
  } else {
    customerData = {
      data: {
        order: {
          connect: { id: order.id },
        },
        entityType: "LEGAL",
        legalEntity: {
          create: {
            company_name: data.company,
            registry_num: data.reg_nr,
            vat_num: data.vat_nr,
            email: data.email,
            phone: data.phone,
          },
        },
      },
    };
  }

  const customer = await db.customer.create({
    data: {
      order: {
        connect: { id: order.id },
      },
      name: data.name,
      surname: data.surname,
      email: email,
      phone: phone,
    },
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

  console.log(parsedCart);

  let invoiceProducts = parsedCart.items.map((item) => {
    return {
      quantity: 1,
      description: `${item.product.title} - ${item.size.size} - ${item.quantity.quantity}`,
      "tax-rate": 0,
      price: item.price.price * (discount > 0 ? (100 - discount) / 100 : 1),
    };
  });

  invoiceProducts.push({
    quantity: 1,
    description: "shipping",
    "tax-rate": 0,
    price: Number(shippingCost),
  });

  console.log(invoiceProducts);

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
      client: {
        company: customer.name + " " + customer.surname,
        address: parsedAddress,
        email: customer.email,
        phone: customer.phone,
      },
      information: {
        number: `${year}-${order.id}`,
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
    // The response will contain a base64 encoded PDF file

    // Please review the documentation below on how to do this
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

  const clientHtml = render({
    template: Order,
    props: {
      products: parsedCart.items,
      client: customer,
      total:
        total * (discount > 0 ? (100 - discount) / 100 : 1) +
        Number(shippingCost),
      shipping: shippingOption,
      address: parsedAddress,
    },
  });

  const orderOptions = {
    from: SECRET_MAIL_USER,
    to: email,
    subject: "Order Confirmation",
    html: clientHtml,
    attachments: [
      {
        filename: `${year}-${order.id + ".pdf"}`,
        path: `invoices/${year}-${order.id + ".pdf"}`,
        contentType: "application/pdf",
      },
    ],
  };

  const adminOptions = {
    from: SECRET_MAIL_USER,
    to: "bardainaisarturs@gmail.com",
    subject: "Jauns pasūtijums",
    text: `jauns pasūtijums`,
  };

  transporter.sendMail(orderOptions);
  transporter.sendMail(adminOptions);

  return json({ ok: true });
}
