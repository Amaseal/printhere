import Stripe from "stripe";
import { json } from "@sveltejs/kit";
import { db } from "$lib/scripts/db";
import { SECRET_STRIPE_KEY } from "$env/static/private";

const stripe = new Stripe(SECRET_STRIPE_KEY);

let total;
let error;
let paymentIntent;
let discount = 0;

export async function POST({ request }) {
  const data = await request.json();

  //get initial values from frontend
  paymentIntent = data.paymentIntent;
  discount = data.discount;

  //Search for products in db based on product id's in cart
  let search = [];
  data.$cart.items.map((item) => search.push(item.price.id));

  let prices = await db.price.findMany({
    where: {
      id: { in: search },
    },
  });


  if (!prices) {
    error =
      "Couldnt find products, please try again, and if problem persist please contact us!";
    return json({
      paymentIntent,
      discount,
      error,
      total: 0
    });
  }

  total = prices.reduce((prev, cur) => {
    return prev + cur.price;
  }, 0);

  let discountAmount = await db.discount.findUnique({
    where: {
        code: discount
    }
  })

  if (!discountAmount) {
    error = "Wrong code"
    return json({
        paymentIntent,
        discount,
        error,
        total: 0
      });
  }


  if (data.entity === "legal") {
    totalPrice = prices.reduce((prev, cur) => {
        return prev + cur.price;
      }, 0) * (discountAmount > 0 ? (100 - discountAmount) / 100 : 1);

      total = totalPrice - (totalPrice * 0.21)
  } else{
    total = prices.reduce((prev, cur) => {
        return prev + cur.price;
      }, 0) * (discountAmount > 0 ? (100 - discountAmount) / 100 : 1);
  }


  paymentIntent = await stripe.paymentIntents.update(paymentIntent.paymentIntentId, {
    amount: ((total + data.shippingCost) * 100).toFixed(0),
  });

  return json({
    clientSecret: paymentIntent.client_secret,
    id: paymentIntent.id,
    total: (total + data.shippingCost) * 100,
    error,
  });
}
