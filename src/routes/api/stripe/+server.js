import Stripe from "stripe";
import { json } from "@sveltejs/kit";
import { db } from "$lib/scripts/db";
import { SECRET_STRIPE_KEY } from "$env/static/private";

const stripe = new Stripe(SECRET_STRIPE_KEY);

let total;
let error;
let paymentIntent;

export async function POST({ request }) {
  const data = await request.json();
  let search = [];

  data.$cart.items.map((item) => search.push(item.price.id));

  const prices = await db.price.findMany({
    where: {
      id: { in: search },
    },
  });

  total = prices.reduce((prev, cur) => {
    return prev + cur.price;
  }, 0);

  paymentIntent = await stripe.paymentIntents.create({
    amount: (total + Number(data.shippingCost)) * 100,
    currency: "eur",
    automatic_payment_methods: {
      enabled: true,
    },
  });

  return json({
    paymentIntent: {
      paymentIntentId: paymentIntent.id,
      clientSecret: paymentIntent.client_secret,
    },
    total: (total + data.shippingCost) * 100,
    error,
  });
}
