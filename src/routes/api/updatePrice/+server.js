import Stripe from "stripe";
import { json } from "@sveltejs/kit";
import { db } from "$lib/scripts/db";
import { SECRET_STRIPE_KEY } from "$env/static/private";

const stripe = new Stripe(SECRET_STRIPE_KEY);

export async function POST({ request }) {
  const data = await request.json();
  let search = [];

  //get cart item id's

  data.cart.items.map((item) => search.push(item.price.id));

  const prices = await db.price.findMany({
    where: {
      id: { in: search },
    },
  });

  function roundToTwoDecimalPlaces(value) {
    return Math.round(value * 100) / 100;
  }

  if (!prices) {
    data.error =
      "Couldnt find products, please try again, and if problem persist please contact us!";
    return json({
      data,
    });
  }

  if (data.promo.code) {
    let code = await db.promo.findUnique({
      where: {
        code: data.promo.code,
      },
    });

    if (code) {
      data.promo.discount = code.amount;
      data.promo.valid = true;
    } else {
      return json(data);
    }
  }

  data.total.with_tax = prices.reduce((prev, cur) => {
    return prev + cur.price;
  }, 0);

  if (data.shipping.type === "omniva") {
    data.shipping.cost = 5;

    if (data.promo.valid) {
      data.total.with_tax = roundToTwoDecimalPlaces(
        data.total.with_tax -
          data.total.with_tax * (data.promo.discount / 100) +
          data.shipping.cost
      ).toFixed(2);

      data.total.without_tax = roundToTwoDecimalPlaces(
        data.total.with_tax - data.total.with_tax * 0.21
      ).toFixed(2);
    } else {
      data.total.with_tax = roundToTwoDecimalPlaces(
        data.total.with_tax + data.shipping.cost
      ).toFixed(2);

      data.total.without_tax = roundToTwoDecimalPlaces(
        data.total.with_tax - data.total.with_tax * 0.21
      ).toFixed(2);
    }
  } else if (data.shipping.type === "post") {
    data.shipping.cost = 10;
    if (data.promo.valid) {
      data.total.with_tax = roundToTwoDecimalPlaces(
        data.total.with_tax -
          data.total.with_tax * (data.promo.discount / 100) +
          data.shipping.cost
      ).toFixed(2);

      data.total.without_tax = roundToTwoDecimalPlaces(
        data.total.with_tax - data.total.with_tax * 0.21
      ).toFixed(2);
    } else {
      data.total.with_tax = (data.total.with_tax + data.shipping.cost)
        .toFixed(2)
        .toFixed(2);

      data.total.without_tax = roundToTwoDecimalPlaces(
        data.total.with_tax - data.total.with_tax * 0.21
      ).toFixed(2);
    }
  }

  if (data.client.type === "private") {
    await stripe.paymentIntents.update(data.stripe.id, {
      amount: roundToTwoDecimalPlaces(data.total.with_tax * 100),
    });
  } else if (data.client.type === "legal") {
    await stripe.paymentIntents.update(data.stripe.id, {
      amount: roundToTwoDecimalPlaces(data.total.without_tax * 100),
    });
  }

  return json(data);
}
