import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20",
});

export const paymentRouter = createTRPCRouter({
  createPaymentIntent: publicProcedure
    .input(z.object({ amount: z.number() }))
    .mutation(async ({ input }) => {
      try {
        const paymentIntent = await stripe.paymentIntents.create({
          amount: input.amount,
          currency: "usd",
        });

        return { clientSecret: paymentIntent.client_secret };
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Error creating payment intent",
        });
      }
    }),
});
