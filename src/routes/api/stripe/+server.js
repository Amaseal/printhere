import Stripe from "stripe";
import { json } from "@sveltejs/kit";
import { db } from "$lib/scripts/db";
import { SECRET_STRIPE_KEY } from "$env/static/private";

const stripe = new Stripe(SECRET_STRIPE_KEY);

export async function POST({ request }) {
  const data = await request.json();
  let search = [];

  data.cart.items.map((item) => search.push(item.price.id));

  const prices = await db.price.findMany({
    where: {
      id: { in: search },
    },
  });

  if (!prices) {
    data.error =
      "Couldnt find products, please try again, and if problem persist please contact us!";
    return json({
      data,
    });
  }

  data.total.with_tax =
    prices.reduce((prev, cur) => {
      return prev + cur.price;
    }, 0) + 5;

  data.total.without_tax = data.total.with_tax - data.total.with_tax * 0.21;

  let paymentIntent = await stripe.paymentIntents.create({
    amount: (data.total.with_tax + Number(data.shipping.cost)) * 100,
    currency: "eur",
    automatic_payment_methods: {
      enabled: true,
    },
  });

  data.stripe.id = paymentIntent.id;
  data.stripe.clientSecret = paymentIntent.client_secret;

  return json(data);
}
