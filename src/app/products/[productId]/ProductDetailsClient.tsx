'use client';

import { Button } from '~/components/ui/button';
import { Typography } from '~/components/ui/typography';
import { api } from '~/trpc/react';
import { toast } from 'sonner';
import { Spinner } from '~/components/ui/spinner';

export default function ProductDetailsClient({ productId }: { productId: number }) {

  const { data: product, isLoading, isError } = api.product.getById.useQuery(
    { id: productId }
  );

  const addItemMutation = api.cart.addItem.useMutation({
    onSuccess: () => {
      toast('Product added to cart successfully!');
    },
    onError: () => {
      toast('Failed to add product to cart.');
    },
  });

  const handleAddToCart = () => {
    if (product) {
      addItemMutation.mutate({ productId: product.id });
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner />
      </div>
    );
  }

  if (isError || !product) return <p>Product not found or failed to load.</p>;

  return (
    <div className="flex flex-col items-center p-4 max-w-full">
      <div className="w-full max-w-5xl bg-white shadow-lg rounded-lg p-6">
        <div className="flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-6 md:mb-0">
            <img src={product.imageUrl} alt={product.name} className="w-full h-auto rounded-lg" />
          </div>
          <div className="md:w-1/2 md:pl-6">
            <Typography variant="h1" className="text-3xl font-bold mb-4">
              {product.name}
            </Typography>
            <Typography variant="body1" className="text-gray-700 mb-4">
              {product.description || 'No description available'}
            </Typography>
            <Typography variant="h2" className="text-2xl font-semibold mb-4">
              Price: {product.price} lei
            </Typography>
            <Button className="w-full md:w-auto" onClick={handleAddToCart}>
              Add to Cart
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}