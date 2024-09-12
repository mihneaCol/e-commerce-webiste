import { NextApiRequest, NextApiResponse } from 'next';
import { buffer } from "micro";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20",
});

// Disable the body parser to handle raw body from Stripe
export const config = {
    api: {
      bodyParser: false,
    },
  };
  
  export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
      res.setHeader("Allow", ["POST"]);
      return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  
    let event;
  
    try {
      // Ensure STRIPE_WEBHOOK_SECRET is a string
      const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
      if (!webhookSecret) {
        throw new Error("Stripe webhook secret is not defined in environment variables");
      }
  
      // Buffer the request body to read the raw content
      const buf = await buffer(req);
      const sig = req.headers["stripe-signature"];
  
      if (!sig) {
        return res.status(400).send("Missing Stripe signature header");
      }
  
      // Construct the event using the webhook secret
      event = stripe.webhooks.constructEvent(buf, sig, webhookSecret);
  
    } catch (err) {
      // Handle error (cast `err` to StripeError or Error)
      if (err instanceof Stripe.errors.StripeSignatureVerificationError) {
        return res.status(400).send(`Webhook Error: ${err.message}`);
      } else if (err instanceof Error) {
        return res.status(400).send(`Webhook Error: ${err.message}`);
      }
      return res.status(400).send(`Webhook Error`);
    }
  
    // Handle the webhook event
    if (event.type === "payment_intent.succeeded") {
      const paymentIntent = event.data.object;
      // Handle successful payment intent
      console.log(`PaymentIntent for ${paymentIntent.amount} was successful!`);
    }
  
    res.json({ received: true });
  }
