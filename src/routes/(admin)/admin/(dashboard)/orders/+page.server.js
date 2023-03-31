import { db } from "$lib/scripts/db";
import { SECRET_MAIL_USER } from "$env/static/private";
import { SECRET_MAIL_PASS } from "$env/static/private";

import { render } from "svelte-email";

import Shipped from "$lib/components/app/emails/Shipped.svelte";
import nodemailer from "nodemailer";

export async function load() {
  const orders = await db.order.findMany({
    include: {
      cart: {
        include: {
          cartItems: {
            include: {
              product: true,
              size: true,
              quantity: true,
              price: true,
            },
          },
        },
      },
      customer: true,
    },
  });
  if (orders) {
    return { orders };
  } else {
    return { orders: false };
  }
}

const remove = async ({ request }) => {
  const data = await request.formData();
  const id = data.get("id");

  const order = await db.order.findUnique({
    where: {
      id: Number(id),
    },
    include: {
      cart: {
        include: {
          cartItems: true,
        },
      },
    },
  });

  order.cart.cartItems.forEach((item) => {
    fs.unlink(item.file, (err) => {
      if (err) {
        console.log(err);
      }
    });
  });

  await db.order.delete({
    where: {
      id: Number(id),
    },
  });
};

const save = async ({ request }) => {
  const data = await request.formData();
  const id = data.get("id");
  const done = data.get("done");
  const shipped = data.get("shipped");
  const code = data.get("code");

  const shippedTrue = shipped === "on" ? true : false;
  const doneTrue = done === "on" ? true : false;

  const orderUpdate = await db.order.update({
    where: {
      id: Number(id),
    },
    data: {
      done: doneTrue,
      shipped: shippedTrue,
    },
  });

  if (shippedTrue === true) {
    const order = await db.order.findUnique({
      where: {
        id: Number(id),
      },
      select: {
        customer: true,
      },
    });
    const transporter = nodemailer.createTransport({
      host: "printhere.eu",
      port: 465,
      secure: true,

      auth: {
        user: SECRET_MAIL_USER,
        pass: SECRET_MAIL_PASS,
      },
    });

    const clientHtml = render({
      template: Shipped,
      props: {
        client: order.customer,
        code: code,
      },
    });

    const shippedOptions = {
      from: SECRET_MAIL_USER,
      to: order.customer.email,
      subject: "Order shipped",
      html: clientHtml,
    };

    transporter.sendMail(shippedOptions);
  }
};

export const actions = { remove, save };
