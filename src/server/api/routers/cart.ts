import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { carts } from '../../db/schema';
import { z } from 'zod';

export const cartRouter = createTRPCRouter({
    // Hello World Procedure
    hello: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => {
      return {
        greeting: `Hello ${input.text}`,
      };
    }),

   // Create Cart Item Procedure
   create: publicProcedure
   .input(z.object({
     productId: z.number().int(),
     quantity: z.number().int().positive(),
   }))
   .mutation(async ({ ctx, input }) => {
     await ctx.db.insert(carts).values({
       productId: input.productId,
       quantity: input.quantity,
     });
     return { success: true };
   }),
});