import Stripe from 'stripe'
import { SECRET_STRIPE_KEY } from '$env/static/private'
import { db } from "$lib/scripts/database";

const stripe = new Stripe(SECRET_STRIPE_KEY)

export async function POST({ request }) {

    const data = await request.json();


    data.$cart.items.map((item) => {
        search.push(item.quantity.id);
      });
    
  // create the payment intent
  const paymentIntent = await stripe.paymentIntents.create({
    amount: 2000,
    currency: 'EUR',
    // specify what payment methods are allowed
    // can be card, sepa_debit, ideal, etc...
    payment_method_types: ['card']
  })

  // return the clientSecret to the client
  return {
    body: {
      clientSecret: paymentIntent.client_secret
    }
  }
}