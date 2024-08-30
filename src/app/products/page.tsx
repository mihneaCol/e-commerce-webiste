'use client'; // Ensure this component runs on the client side

import { useState } from "react";
import { api } from "~/trpc/react"; // Adjust the import based on your trpc client setup
import { Card } from "~/components/ui/card"; // Adjust the path if necessary
import { Button } from '~/components/ui/button';
import { Typography } from '~/components/ui/typography';
import Link from "next/link";

const ProductsPage = () => {
  // Fetch all products
  const { data: products, isLoading, isError } = api.product.getAll.useQuery();

  // Add an item to the cart
  const addItemMutation = api.cart.addItem.useMutation({
    onSuccess: () => {
      alert('Product added to cart successfully!');
    },
    onError: () => {
      alert('Failed to add product to cart.');
    }
  });

  const handleAddToCart = (productId: number) => {
    if (productId) {
      addItemMutation.mutate({ productId });
    }
  };

  if (isLoading) {
    return <p>Loading products...</p>;
  }

  if (isError || !products) {
    return <p>Failed to load products. Please try again later.</p>;
  }

  return (
    <div className="flex justify-center p-6">
      <div className="flex flex-wrap gap-6 max-w-5xl w-full">
        {products.map((product) => (
          <Card
            key={product.id}
            className="flex flex-col w-full max-w-xs p-4 shadow-lg"
          >
            <Link href={`/products/${product.id}`}>
              <img
                src={product.imageUrl}
                alt={product.name}
                className="w-full h-auto rounded-lg"
              />
            </Link>
            <div className="flex flex-col flex-grow mt-4">
              <Typography variant="h3" className="text-xl font-semibold mb-2">
                {product.name}
              </Typography>
              <Typography variant="body1" className="text-gray-700 mb-4">
                {product.price} lei
              </Typography>
              <div className="mt-auto">
                <Button
                  onClick={() => handleAddToCart(product.id)}
                  className="w-full"
                >
                  Add to Cart
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ProductsPage;