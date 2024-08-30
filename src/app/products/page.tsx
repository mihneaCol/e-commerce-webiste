"use client"; // Ensure this component runs on the client side

import { useState } from "react";
import { api } from "~/trpc/react"; // Adjust the import based on your trpc client setup
import { Button } from "~/components/ui/button";
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
    <div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "1.5em", margin: "1em" }}>
        {products.map((product) => (
          <div
            key={product.id}
            style={{
              border: "1px solid #ccc",
              padding: "1em",
              width: "14.25em",
              textAlign: "center",
            }}
          >
            <h3>{product.name}</h3>
            <Link href={`/products/${product.id}`}>
              <img src={product.imageUrl}/>
            </Link>
            <p>{product.price} lei</p>
            <Button onClick={() => handleAddToCart(product.id)}>Add to Cart</Button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductsPage;
