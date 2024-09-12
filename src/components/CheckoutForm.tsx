"use client"

import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import { api } from "~/trpc/react";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { useState } from "react";

interface CheckoutFormProps {
  onClose: () => void;
  totalPrice: number;
}

const CheckoutForm = ({ onClose, totalPrice }: CheckoutFormProps) => {
  const stripe = useStripe();
  const elements = useElements();
  const { mutateAsync: createPaymentIntent } = api.payment.createPaymentIntent.useMutation();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsProcessing(true);

    try {
      // Create the payment intent
      const { clientSecret } = await createPaymentIntent({ amount: totalPrice * 100 });

      // Ensure that Stripe and Elements are loaded
      if (!stripe || !elements) {
        console.error("Stripe or Elements not loaded");
        return;
      }

      // Ensure clientSecret is not null
      if (!clientSecret) {
        console.error("Failed to retrieve client secret");
        return;
      }

      // Confirm the card payment
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement)!,
        },
      });

      if (result.error) {
        console.error(result.error.message);
        alert(`Payment failed: ${result.error.message}`);
      } else if (result.paymentIntent?.status === "succeeded") {
        alert("Payment succeeded!");
        onClose();
      }
    } catch (error) {
      console.error("Error processing payment:", error);
      alert("An error occurred while processing your payment. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Complete Your Purchase</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="card-element">Card Details</Label>
            <CardElement id="card-element" className="p-3 border rounded-md" />
          </div>
          <div>
            <Label htmlFor="amount">Amount to Pay</Label>
            <Input id="amount" value={`${totalPrice} lei`} disabled />
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={!stripe || isProcessing}>
            {isProcessing ? "Processing..." : "Pay Now"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default CheckoutForm;