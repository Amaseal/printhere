import Stripe from "stripe";
import { db } from "$lib/scripts/database";

const stripe = new Stripe(process.env["STRIPE_SECRET_KEY"]);

export async function POST({ request }) {
  const data = await request.json();

  console.log(data);
  let search = [];

  data.$cart.items.map((item) => {
    search.push(item.quantity.id);
  });

  const quantities = await db.quantity.findMany({
    where: {
      id: { in: search },
    },
  });

  let paymentIntent = null;

  if (!data.paymentIntent) {
    let total =
      quantities.reduce((prev, cur) => {
        return prev + cur.price;
      }, 0) + data.shippingOption;

    paymentIntent = await stripe.paymentIntents.create({
      amount: total * 100,
      currency: "eur",
      automatic_payment_methods: {
        enabled: true,
      },
    });

    console.log(paymentIntent);

    return new Response(JSON.stringify(paymentIntent));
  } else {
    let total =
      quantities.reduce((prev, cur) => {
        return prev + cur.price;
      }, 0) + data.shippingOption;

    paymentIntent = await stripe.paymentIntents.update(data.paymentIntent.id, {
      amount: total * 100,
    });

    console.log(paymentIntent);

    return new Response(JSON.stringify(paymentIntent));
  }

  throw error(494, "Something went wrong");
}
