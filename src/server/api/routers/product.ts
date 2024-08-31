import { z } from "zod";
import { and, eq } from "drizzle-orm";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { products } from "~/server/db/schema";

export const productRouter = createTRPCRouter({
  hello: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => {
      return {
        greeting: `Hello ${input.text}`,
      };
    }),

  create: publicProcedure
    .input(z.object({
      name: z.string().min(1),
      description: z.string().min(1),
      price: z.number().positive(),
      imageUrl: z.string().url(),
      stock: z.number().nonnegative(), 
      category: z.string().min(1),
    }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.insert(products).values({
        name: input.name,
        description: input.description,
        price: input.price,
        imageUrl: input.imageUrl,
        stock: input.stock,
        category: input.category,
      });
      return { success: true };
    }),

  getAll: publicProcedure.query(async ({ ctx }) => {
    const result = await ctx.db.select().from(products);
    return result;
  }),

  getById: publicProcedure
    .input(z.object({
      id: z.number().int().positive(),
    }))
    .query(async ({ ctx, input }) => {
      const [result] = await ctx.db
        .select()
        .from(products)
        .where(eq(products.id, input.id));
      
      if (!result) {
        throw new Error('Product not found');
      }

      return result;
    }),

  update: publicProcedure
    .input(z.object({
      id: z.number().int().positive(),
      name: z.string().min(1).optional(),
      description: z.string().min(1).optional(),
      price: z.number().positive().optional(),
      imageUrl: z.string().url().optional(),
      stock: z.number().nonnegative().optional(),
      category: z.string().min(1).optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const updateValues: Partial<typeof input> = {};
      if (input.name) updateValues.name = input.name;
      if (input.description) updateValues.description = input.description;
      if (input.price) updateValues.price = input.price;
      if (input.imageUrl) updateValues.imageUrl = input.imageUrl;
      if (input.stock !== undefined) updateValues.stock = input.stock; 
      if (input.category !== undefined) updateValues.category = input.category;

      const [result] = await ctx.db
        .update(products)
        .set(updateValues)
        .where(eq(products.id, input.id))
        .returning();

      if (!result) {
        throw new Error('Product not found');
      }

      return result;
    }),

  delete: publicProcedure
    .input(z.object({
      id: z.number().int().positive(),
    }))
    .mutation(async ({ ctx, input }) => {
      const result = await ctx.db
        .delete(products)
        .where(eq(products.id, input.id));

      if (result.count === 0) {
        throw new Error('Product not found');
      }

      return { success: true };
    }),
});
