import { z } from "zod";
import { and, eq } from "drizzle-orm";
import { createTRPCRouter, publicProcedure, } from "~/server/api/trpc";
import { carts, products } from "~/server/db/schema";
import { auth } from "@clerk/nextjs/server";


export const cartRouter = createTRPCRouter({
    // Hello World Procedure
    hello: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => {
      return {
        greeting: `Hello ${input.text}`,
      };
    }),

  // Add Item to Cart
  addItem: publicProcedure
    .input(z.object({
      productId: z.number().int().positive(),
    }))
    .mutation(async ({ ctx, input }) => {
      const user = auth();

      if (!user.userId) {
        throw new Error("User not authenticated");
      }

      const existingItems = await ctx.db
      .select({
        id: carts.id,
        productId: carts.productId,
        quantity: carts.quantity,
        userId: carts.userId,
      })
      .from(carts)
      .where(and(eq(carts.productId, input.productId), eq(carts.userId, user.userId)))
      .limit(1);

    // Access the first item from the array
    const existingItem = existingItems[0];

    if (existingItem) {
      await ctx.db
        .update(carts)
        .set({ quantity: existingItem.quantity + 1 })
        .where(eq(carts.id, existingItem.id));
    } else {
      await ctx.db.insert(carts).values({
        productId: input.productId,
        quantity: 1,
        userId: user.userId,
      });
    }

      return { success: true };
    }),

  // Modify Item Quantity in Cart
  updateQuantity: publicProcedure
    .input(z.object({
      cartItemId: z.number().int().positive(),
      quantity: z.number().int().positive(),
    }))
    .mutation(async ({ ctx, input }) => {
      const user = auth();

      if (!user.userId) {
        throw new Error("User not authenticated");
      }

      const existingItem = await ctx.db
        .select()
        .from(carts)
        .where(and(eq(carts.id, input.cartItemId), eq(carts.userId, user.userId)))
        .limit(1);

      if (!existingItem) {
        throw new Error("Item not found in cart");
      }

      await ctx.db
        .update(carts)
        .set({ quantity: input.quantity })
        .where(eq(carts.id, input.cartItemId));

      return { success: true };
    }),

  // Delete Item from Cart
  deleteItem: publicProcedure
    .input(z.object({
      cartItemId: z.number().int().positive(),
    }))
    .mutation(async ({ ctx, input }) => {
      const user = auth();

      if (!user.userId) {
        throw new Error("User not authenticated");
      }

      const result = await ctx.db
        .delete(carts)
        .where(and(eq(carts.id, input.cartItemId), eq(carts.userId, user.userId)));

      if (result.count === 0) {
        throw new Error("Item not found in cart");
      }

      return { success: true };
    }),

  // Get Cart Items
  getCart: publicProcedure
    .query(async ({ ctx }) => {
      const user = auth();

      if (!user.userId) {
        throw new Error("User not authenticated");
      }

      const cartItems = await ctx.db
        .select({
          id: carts.id,
          quantity: carts.quantity,
          product: {
            id: products.id,
            name: products.name,
            description: products.description,
            price: products.price,
            imageUrl: products.imageUrl,
          }
        })
        .from(carts)
        .leftJoin(products, eq(carts.productId, products.id))
        .where(eq(carts.userId, user.userId));

      return cartItems;
    }),

    clearCart: publicProcedure.mutation(async ({ ctx }) => {
      const user = auth();
    
      if (!user.userId) {
        throw new Error("User not authenticated");
      }
    
      // Delete all items in the cart for the authenticated user
      const result = await ctx.db
        .delete(carts)
        .where(eq(carts.userId, user.userId));
    
      // You can optionally check if any items were deleted
      if (result.count === 0) {
        throw new Error("No items found in cart");
      }
    
      return { success: true };
    }),
});
