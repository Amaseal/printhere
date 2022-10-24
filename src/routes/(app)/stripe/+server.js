import Stripe from "stripe";

import { db } from "$lib/scripts/database";

// initialize Stripe
const stripe = new Stripe(process.env["STRIPE_SECRET_KEY"]);

export async function POST({ request }) {
  const data = await request.json();

  let total = data.items.reduce((prev, cur) => {
    return prev + cur.price;
  }, 0);

  console.log(data.items.quantity);

  const paymentIntent = await stripe.paymentIntents.create({
    amount: total * 1000,
    // note, for some EU-only payment methods it must be EUR
    currency: "eur",
    // specify what payment methods are allowed
    // can be card, sepa_debit, ideal, etc...
    automatic_payment_methods: {
      enabled: true,
    },
  });

  if (paymentIntent) {
    return new Response(JSON.stringify(paymentIntent));
  }

  throw error(494, "Something went wrong");
}
