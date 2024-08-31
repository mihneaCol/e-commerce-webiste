'use client';

import { api } from "~/trpc/react"; 
import { Card } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Typography } from "~/components/ui/typography";
import { toast } from "sonner";
import { Spinner } from "~/components/ui/spinner";

const CartPage = () => {
    
  const { data: cartItems, isLoading, isError, refetch } = api.cart.getCart.useQuery();
  
  const updateQuantityMutation = api.cart.updateQuantity.useMutation({
    onSuccess: () => {
      refetch();
      toast.success('Cart item quantity updated successfully!');
    },
    onError: () => {
      toast.error('Failed to update cart item quantity.');
    }
  });

  const deleteItemMutation = api.cart.deleteItem.useMutation({
    onSuccess: () => {
      refetch();
      toast.success('Item removed from cart successfully!');
    },
    onError: () => {
      toast.error('Failed to remove item from cart.');
    }
  });

  const handleUpdateQuantity = (cartItemId: number, newQuantity: number) => {
    if (newQuantity >= 0) {
      updateQuantityMutation.mutate({ cartItemId, quantity: newQuantity });
    }
  };

  const handleDeleteItem = (cartItemId: number) => {
    deleteItemMutation.mutate({ cartItemId });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner />
      </div>
    );
  }

  if (isError || !cartItems) {
    return <p>Failed to load cart items. Please try again later.</p>;
  }

  const totalPrice = cartItems.reduce((acc, item) => 
    item.product ? acc + (item.product.price * item.quantity) : acc, 0);

  return (
    <div className="p-6">
      <div className="flex flex-col gap-6">
        {cartItems.length > 0 ? (
          <>
            {cartItems.map((item) => (
              <Card key={item.id} className="flex flex-col p-4 shadow-lg">
                {item.product ? (
                  <>
                    <div className="flex items-center gap-4">
                      <img
                        src={item.product.imageUrl}
                        alt={item.product.name}
                        className="w-24 h-24 object-cover rounded-md"
                      />
                      <div className="flex flex-col flex-grow">
                        <Typography variant="h3" className="text-lg font-semibold mb-2">
                          {item.product.name}
                        </Typography>
                        <Typography variant="body1" className="text-gray-700 mb-2">
                          Price: {item.product.price} lei
                        </Typography>
                        <div className="flex items-center gap-4">
                          <Button
                            onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                            variant="outline"
                          >
                            -
                          </Button>
                          <Typography variant="body1" className="text-gray-700">
                            Quantity: {item.quantity}
                          </Typography>
                          <Button
                            onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                            variant="outline"
                          >
                            +
                          </Button>
                        </div>
                      </div>
                      <Button
                        onClick={() => handleDeleteItem(item.id)}
                        variant="outline"
                        className="mt-auto"
                      >
                        Remove
                      </Button>
                    </div>
                  </>
                ) : (
                  <Typography variant="body1" className="text-center">
                    Product details not available.
                  </Typography>
                )}
              </Card>
            ))}
            <div className="mt-6 text-right">
              <Typography variant="h3" className="text-xl font-bold">
                Total: {totalPrice} lei
              </Typography>
            </div>
          </>
        ) : (
          <Typography variant="body1" className="text-center">
            Your cart is empty.
          </Typography>
        )}
      </div>
    </div>
  );
};

export default CartPage;