import Stripe from "stripe";
import { json } from "@sveltejs/kit";
import { db } from "$lib/scripts/db";
import { SECRET_STRIPE_KEY } from "$env/static/private";

const stripe = new Stripe(SECRET_STRIPE_KEY);

let total;
let error;
let paymentIntent;
let discount;

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
    clientSecret: paymentIntent.client_secret,
    id: paymentIntent.id,
    total: (total + data.shippingCost) * 100,
    error,
  });
}

export async function PUT({ request }) {
  const data = await request.json();

  if (data.discount !== 0) {
    promo = await db.promo.findUnique({
      where: {
        code: data.discount,
      },
    });
  }

  if (promo) {
    discount = promo.amount;
  } else {
    discount = 0;
    error = "Wrong Promocode";
  }

  let search = [];

  data.$cart.items.map((item) => search.push(item.price.id));

  const prices = await db.price.findMany({
    where: {
      id: { in: search },
    },
  });

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
