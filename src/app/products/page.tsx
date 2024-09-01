'use client';

import { useState, useEffect, useRef } from 'react';
import { toast } from 'sonner';
import { api } from '~/trpc/react';
import { Card } from '~/components/ui/card';
import { Button } from '~/components/ui/button';
import { Typography } from '~/components/ui/typography';
import Link from 'next/link';
import { Spinner } from '~/components/ui/spinner';

const ProductsPage = () => {
  const { data: products, isLoading, isError } = api.product.getAll.useQuery();
  const [visibleCount, setVisibleCount] = useState(9);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  const loadMore = () => {
    setVisibleCount((prevCount) => prevCount + 9);
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        console.log("Observer triggered:", entries[0]?.isIntersecting);
        if (entries[0]?.isIntersecting) {
          loadMore();
        }
      },
      { threshold: 1.0 }
    );
  
    if (loadMoreRef.current) {
      console.log("Observer attached");
      observer.observe(loadMoreRef.current);
    }
  
    return () => {
      if (loadMoreRef.current) {
        observer.unobserve(loadMoreRef.current);
        console.log("Observer detached");
      }
    };
  }, []);  // Empty dependency array

  const addItemMutation = api.cart.addItem.useMutation({
    onSuccess: () => {
      toast('Product added to cart successfully!');
    },
    onError: () => {
      toast('Failed to add product to cart.');
    },
  });

  const handleAddToCart = (productId: number) => {
    if (productId) {
      addItemMutation.mutate({ productId });
    }
  };

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
    <div className="flex flex-col items-center p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-5xl w-full">
        {products.slice(0, visibleCount).map((product) => (
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
      {visibleCount < products.length && (
        <div ref={loadMoreRef} className="h-16 w-full"></div>
      )}
    </div>
  );
};

export default ProductsPage;
