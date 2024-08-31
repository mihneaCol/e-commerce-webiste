'use client'; // Ensure this component runs on the client side

import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { api } from '~/trpc/react'; // Adjust the import based on your trpc client setup
import { Card } from '~/components/ui/card'; // Adjust the path if necessary
import { Button } from '~/components/ui/button';
import { Typography } from '~/components/ui/typography';
import Link from 'next/link';
import { Spinner } from '~/components/ui/spinner';
import { useRouter, useSearchParams } from 'next/navigation';

const ProductsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredProducts, setFilteredProducts] = useState<any[]>([]);
  const router = useRouter();
  const searchParams = useSearchParams();

  // Fetch all products
  const { data: products, isLoading, isError } = api.product.getAll.useQuery();

  // Add an item to the cart
  const addItemMutation = api.cart.addItem.useMutation({
    onSuccess: () => {
      toast('Product added to cart successfully!');
    },
    onError: () => {
      toast('Failed to add product to cart.');
    }
  });

  const handleAddToCart = (productId: number) => {
    if (productId) {
      addItemMutation.mutate({ productId });
    }
  };

  // Update search term from URL query
  useEffect(() => {
    const querySearchTerm = searchParams.get('search') || '';
    setSearchTerm(querySearchTerm);
  }, [searchParams]);

  // Filter products based on search term
  useEffect(() => {
    if (products) {
      const filtered = products.filter((product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredProducts(filtered);
    }
  }, [searchTerm, products]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner />
      </div>
    );
  }

  if (isError || !products) {
    return <p>Failed to load products. Please try again later.</p>;
  }

  return (
    <div className="p-6">
      <div className="flex justify-center mb-6">
        {/* Optionally, you can keep a search bar here if you want to show it in the page */}
      </div>
      <div className="flex justify-center">
        <div className="flex flex-wrap gap-6 max-w-5xl w-full">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
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
            ))
          ) : (
            <Typography variant="body1" className="text-center">
              No products found.
            </Typography>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;
