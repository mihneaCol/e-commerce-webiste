"use client";

import { useState } from "react";
import { api } from "~/trpc/react"; // Adjust the import based on your trpc client setup

const CartComponent = () => {
  const [productId, setProductId] = useState<number | null>(null);
  const [quantity, setQuantity] = useState(1);

  // Fetch all cart items
  const { data: cartItems, refetch } = api.cart.getCart.useQuery();

  // Add an item to the cart
  const addItemMutation = api.cart.addItem.useMutation({
    onSuccess: () => {
      refetch(); // Refetch cart items after adding an item
    },
  });

  // Update an item's quantity in the cart
  const updateQuantityMutation = api.cart.updateQuantity.useMutation({
    onSuccess: () => {
      refetch(); // Refetch cart items after updating quantity
    },
  });

  // Remove an item from the cart
  const deleteItemMutation = api.cart.deleteItem.useMutation({
    onSuccess: () => {
      refetch(); // Refetch cart items after deleting an item
    },
  });

  const handleAddItem = () => {
    if (productId !== null) {
      addItemMutation.mutate({ productId, quantity });
    }
  };

  const handleUpdateQuantity = (cartItemId: number, newQuantity: number) => {
    updateQuantityMutation.mutate({ cartItemId, quantity: newQuantity });
  };

  const handleDeleteItem = (cartItemId: number) => {
    deleteItemMutation.mutate({ cartItemId });
  };

  return (
    <div>
      <h1>Shopping Cart</h1>

      {/* Add Item to Cart */}
      <div>
        <h2>Add Item to Cart</h2>
        <input
          type="number"
          placeholder="Product ID"
          value={productId ?? ""}
          onChange={(e) => setProductId(Number(e.target.value))}
        />
        <input
          type="number"
          placeholder="Quantity"
          value={quantity}
          onChange={(e) => setQuantity(Number(e.target.value))}
        />
        <button onClick={handleAddItem}>Add to Cart</button>
      </div>

      {/* Cart Items List */}
      <div>
        <h2>Cart Items</h2>
        {cartItems?.length ? (
            cartItems.map((item) => (
                <div key={item.id}>
                {item.product ? (
                    <>
                    <p>Product: {item.product.name}</p>
                    <p>Description: {item.product.description ?? "No description available"}</p>
                    <p>Price: ${item.product.price}</p>
                    <p>Quantity: {item.quantity}</p>
                    <button
                        onClick={() =>
                        handleUpdateQuantity(item.id, item.quantity + 1)
                        }
                    >
                        Increase Quantity
                    </button>
                    <button
                        onClick={() =>
                        handleUpdateQuantity(item.id, item.quantity - 1)
                        }
                        disabled={item.quantity <= 1}
                    >
                        Decrease Quantity
                    </button>
                    <button onClick={() => handleDeleteItem(item.id)}>
                        Remove from Cart
                    </button>
                    </>
                ) : (
                    <p>Product information is not available.</p>
                )}
                </div>
            ))
        ) : (
            <p>Your cart is empty.</p>
        )}
      </div>
    </div>
  );
};

export default CartComponent;
