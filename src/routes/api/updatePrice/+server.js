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

  // if no products are found then return error

  if (!prices) {
    data.error =
      "Couldnt find products, please try again, and if problem persist please contact us!";
    return json({
      data,
    });
  }

  //calculate price based on client options if promo code is set, client is a private entity and shipping option is set as omniva

  if (
    data.promo.code &&
    data.client.type === "private" &&
    data.shipping.type === "omniva"
  ) {
    //find the promo code in db
    console.log("got promo code, private entity and omniva shipping");
    let code = await db.promo.findUnique({
      where: {
        code: data.promo.code,
      },
    });

    //calculate price based on promo code
    if (code) {
      //set code
      data.promo.discount = code.amount;
      data.promo.valid = true;

      //calculate total price with tax

      data.total.with_tax = (
        prices.reduce((prev, cur) => {
          return prev + cur.price;
        }, 0) *
          ((100 - data.promo.discount) / 100) +
        5
      ).toFixed(2);
      data.total.without_tax = (
        data.total.with_tax -
        data.total.with_tax * 0.21 +
        (5 - 5 * 0.21)
      ).toFixed(2);

      //if code is not found return error
    } else {
      data.error = "Error validating promocode";
      return json(data);
    }

    //set shipping cost
    data.shipping.cost = 5;

    //set price withoput tax
    data.total.without_tax = (
      data.total.with_tax -
      data.total.with_tax * 0.21 +
      5
    ).toFixed(2);

    //update payment intent
    await stripe.paymentIntents.update(data.stripe.id, {
      amount: data.total.with_tax * 100,
    });

    //calculate price based on client options if promo code is set, client is a private entity and shipping option is set as regular post
  } else if (
    data.promo.code &&
    data.client.type === "private" &&
    data.shipping.type === "post"
  ) {
    console.log("got promo code, private entity and post shipping");
    //find the promo code in db
    let code = await db.promo.findUnique({
      where: {
        code: data.promo.code,
      },
    });
    //calculate price based on promo code
    if (code) {
      //set code
      data.promo.discount = code.amount;
      data.promo.valid = true;

      //calculate total price with tax

      data.total.with_tax = (
        prices.reduce((prev, cur) => {
          return prev + cur.price;
        }, 0) *
          ((100 - data.promo.discount) / 100) +
        10
      ).toFixed(2);

      //if code is not found return error
    } else {
      data.error = "Error validating promocode";
      return json(data);
    }

    //set shipping cost
    data.shipping.cost = 10;

    //set price withoput tax
    data.total.without_tax = (
      data.total.with_tax -
      data.total.with_tax * 0.21 +
      5
    ).toFixed(2);

    //update payment intent
    await stripe.paymentIntents.update(data.stripe.id, {
      amount: data.total.with_tax * 100,
    });

    //calculate price based on client options if promo code is set, client is a legal entity and shipping option is set as regular ominva
  } else if (
    data.promo.code &&
    data.client.type === "legal" &&
    data.shipping.type === "omniva"
  ) {
    console.log("got promo code, legal entity and omniva shipping");
    //find the promo code in db
    let code = await db.promo.findUnique({
      where: {
        code: data.promo.code,
      },
    });

    //calculate price based on promo code
    if (code) {
      //set code
      data.promo.discount = code.amount;
      data.promo.valid = true;
      //calculate total price with tax
      data.total.with_tax = (
        prices.reduce((prev, cur) => {
          return prev + cur.price;
        }, 0) *
          ((100 - data.promo.discount) / 100) +
        (5 - 5 * 0.21)
      ).toFixed(2);

      //if code is not found return error
    } else {
      data.error = "Error validating promocode";
      return json(data);
    }
    //set shipping cost - tax
    data.shipping.cost = 5 - 5 * 0.21;
    //set price withoput tax
    data.total.without_tax = (
      data.total.with_tax -
      data.total.with_tax * 0.21 +
      5
    ).toFixed(2);
    //update payment intent without tax
    await stripe.paymentIntents.update(data.stripe.id, {
      amount: data.total.without_tax * 100,
    });

    //calculate price based on client options if promo code is set, client is a legal entity and shipping option is set as regular post
  } else if (
    data.promo.code &&
    data.client.type === "legal" &&
    data.shipping.type === "post"
  ) {
    console.log("got promo code, legal entity and post shipping");
    //find the promo code in db
    let code = await db.promo.findUnique({
      where: {
        code: data.promo.code,
      },
    });
    //calculate price based on promo code
    if (code) {
      //set code
      data.promo.discount = code.amount;
      data.promo.valid = true;
      //set price withoput tax
      data.total.with_tax = (
        prices.reduce((prev, cur) => {
          return prev + cur.price;
        }, 0) *
          ((100 - data.promo.discount) / 100) +
        (10 - 10 * 0.21)
      ).toFixed(2);

      //if code is not found return error
    } else {
      data.error = "Error validating promocode";
      return json(data);
    }
    //set shipping cost - tax
    data.shipping.cost = 10 - 10 * 0.21;
    //set price withoput tax
    data.total.without_tax = (
      data.total.with_tax -
      data.total.with_tax * 0.21 +
      5
    ).toFixed(2);
    //update payment intent without tax
    await stripe.paymentIntents.update(data.stripe.id, {
      amount: data.total.without_tax * 100,
    });

    //calculate price based on client options if promo code is not set, client is a legal entity and shipping option is set as regular post
  } else if (data.client.type === "legal" && data.shipping.type === "post") {
    console.log("didnt get promo code, legal entity and post shipping");
    //set price withoput tax
    data.total.with_tax = (
      prices.reduce((prev, cur) => {
        return prev + cur.price;
      }, 0) +
      (10 - 10 * 0.21)
    ).toFixed(2);

    //set price withoput tax
    data.total.without_tax = (
      data.total.with_tax -
      data.total.with_tax * 0.21
    ).toFixed(2);

    //set shipping cost - tax

    data.shipping.cost = 10 - 10 * 0.21;

    //update payment intent without tax
    await stripe.paymentIntents.update(data.stripe.id, {
      amount: data.total.without_tax * 100,
    });

    //calculate price based on client options if promo code is not set, client is a legal entity and shipping option is set as omniva
  } else if (data.client.type === "legal" && data.shipping.type === "omniva") {
    console.log("didnt get promo code, legal entity and omniva shipping");
    //set price withoput tax
    data.total.with_tax = (
      prices.reduce((prev, cur) => {
        return prev + cur.price;
      }, 0) +
      (5 - 5 * 0.21)
    ).toFixed(2);

    //set price withoput tax
    data.total.without_tax = (
      data.total.with_tax -
      data.total.with_tax * 0.21
    ).toFixed(2);

    //set shipping cost - tax
    data.shipping.cost = 5 - 5 * 0.21;

    //update payment intent without tax
    await stripe.paymentIntents.update(data.stripe.id, {
      amount: data.total.without_tax * 100,
    });

    //calculate price based on client options if promo code is not set, client is a private entity and shipping option is set as regular post
  } else if (data.client.type === "private" && data.shipping.type === "post") {
    console.log("didnt get promo code, private entity and post shipping");
    //set price withoput tax
    data.total.with_tax = (
      prices.reduce((prev, cur) => {
        return prev + cur.price;
      }, 0) + 10
    ).toFixed(2);

    //set price withoput tax
    data.total.without_tax = (
      data.total.with_tax -
      data.total.with_tax * 0.21
    ).toFixed(2);

    //set shipping cost
    data.shipping.cost = 10;

    //update payment intent with tax
    await stripe.paymentIntents.update(data.stripe.id, {
      amount: data.total.with_tax * 100,
    });

    //calculate price based on client options if promo code is not set, client is a private entity and shipping option is set as omniva
  } else if (
    data.client.type === "private" &&
    data.shipping.type === "omniva"
  ) {
    console.log("didnt get promo code, private entity and omniva shipping");
    //set price withoput tax
    data.total.with_tax = (
      prices.reduce((prev, cur) => {
        return prev + cur.price;
      }, 0) + 5
    ).toFixed(2);

    //set price withoput tax
    data.total.without_tax = (
      data.total.with_tax -
      data.total.with_tax * 0.21
    ).toFixed(2);

    //set shipping cost
    data.shipping.cost = 5;

    //update payment intent with tax
    await stripe.paymentIntents.update(data.stripe.id, {
      amount: data.total.with_tax * 100,
    });
  }

  console.log(data);
  return json(data);
}
