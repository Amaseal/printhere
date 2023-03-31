import Stripe from "stripe";
import { json } from "@sveltejs/kit";
import { db } from "$lib/scripts/db";
import { SECRET_STRIPE_KEY } from "$env/static/private";

const stripe = new Stripe(SECRET_STRIPE_KEY);

let total;
let promo = 0;
let paymentIntent;

export async function PUT({ request }) {
  const data = await request.json();

  paymentIntent = data.paymentIntent;

  console.log({ data });
  let search = [];
  data.$cart.items.map((item) => search.push(item.price.id));

  const prices = await db.price.findMany({
    where: {
      id: { in: search },
    },
  });

  let error;
  let discount = 0;

  const promo = await db.promo.findUnique({
    where: {
      code: data.formProps.promo,
    },
  });

  if (promo) {
    discount = promo.amount;
  } else {
    discount = 0;
    error = "Wrong Promocode";
  }

  total =
    prices.reduce((prev, cur) => {
      return prev + cur.price;
    }, 0) * (discount > 0 ? (100 - discount) / 100 : 1);

  paymentIntent = await stripe.paymentIntents.update(paymentIntent.id, {
    amount: ((total + data.shippingCost) * 100).toFixed(0),
  });

  return json({
    clientSecret: paymentIntent.client_secret,
    id: paymentIntent.id,
    promo: discount,
    total: ((total + data.shippingCost) * 100).toFixed(0),
    error,
  });
}
