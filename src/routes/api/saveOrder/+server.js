import { json } from "@sveltejs/kit";
import { db } from "$lib/scripts/db";
import * as fs from "fs";
import { SECRET_MAIL_USER } from "$env/static/private";
import { SECRET_MAIL_PASS } from "$env/static/private";
import { UPLOAD_PATH } from "$env/static/private";

import { redirect } from "@sveltejs/kit";
import { render } from "svelte-email";

import Order from "$lib/components/app/emails/Order.svelte";
import nodemailer from "nodemailer";

export async function POST({ request }) {
  const data = await request.formData();
  const cart = await data.get("cart");
  const name = await data.get("name");
  const surname = await data.get("surname");
  const phone = await data.get("phone");
  const email = await data.get("email");
  const shippingOption = await data.get("shipping");
  const address = await data.get("address");
  const terms = await data.get("terms");
  const shippingCost = await data.get("shippingCost");

  if (terms !== "on") {
    return json({ terms: false });
  }

  function parseAddress(address) {
    let string;
    if (typeof address === "string") {
      try {
        const obj = JSON.parse(address);
        string = obj.value;
      } catch (error) {
        string = address;
      }
    }

    if (!string) {
      string = address;
    }

    return string;
  }

  let parsedAddress = parseAddress(address);
  let parsedCart = JSON.parse(cart);

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

  let total = prices.reduce((prev, cur) => {
    return prev + cur.price;
  }, 0);

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
      shipping: shippingOption,
      address: parsedAddress,
      total: total + Number(shippingCost),
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

  const customer = await db.customer.create({
    data: {
      order: {
        connect: { id: order.id },
      },
      name: name,
      surname: surname,
      email: email,
      phone: phone,
    },
  });

  const transporter = nodemailer.createTransport({
    host: "cinevillaevent.lv",
    port: 465,
    secure: true,

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
      total: total + Number(shippingCost),
      shipping: shippingOption,
      address: parsedAddress,
    },
  });

  const orderOptions = {
    from: SECRET_MAIL_USER,
    to: email,
    subject: "Order Confirmation",
    html: clientHtml,
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
