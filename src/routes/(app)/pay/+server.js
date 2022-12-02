import Stripe from "stripe";
import { db } from "$lib/scripts/database";

export async function POST({ request }) {
  const data = await request.json();

  let search = [];

  data.$cart.items.map((item) => {
    search.push(item.quantity.id);
  });

  const cart = await db.quantity.findMany({
    where: {
      id: { in: search },
    },
    include: {
      size: {
        include: {
          product: true,
        },
      },
    },
  });

  cart.map((item) => {
    item.image = data.$cart.items[0].image;
  });

  console.log(cart);

  let total =
    cart.reduce((prev, cur) => {
      return prev + cur.price;
    }, 0) + data.form.shippingOption;

  // try {
  //   await db.order.create({
  //     data: {
  //       customerData: {
  //         create: {
  //           name: data.name,
  //           surname: data.surname,
  //           email: data.email,
  //         },
  //       },
  //       items: {
  //         createMany: cart,
  //       },
  //       adress: data.form.adress.value,
  //       total: total,
  //     },
  //   });
  // } catch (e) {
  //   console.log(e);
  // }

  console.log(data);

  return new Response(200, { statuss: "OK" });
}
