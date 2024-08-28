import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { products } from "~/server/db/schema";

export const productRouter = createTRPCRouter({
  // Hello World Procedure
  hello: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => {
      return {
        greeting: `Hello ${input.text}`,
      };
    }),

  // Create Product Procedure
  create: publicProcedure
    .input(z.object({
      name: z.string().min(1),
      description: z.string().min(1),
      price: z.number().positive(),
      imageUrl: z.string().url(),
    }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.insert(products).values({
        name: input.name,
        description: input.description,
        price: input.price,
        imageUrl: input.imageUrl,
      });
      return { success: true };
    }),
});
