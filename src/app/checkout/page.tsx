"use client";

import React, { useEffect, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { auth } from "../../../firebase/firebase";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY!);

interface Products {
  name: string;
  description: string;
  image: string;
  _id: string;
  price: number;
  quantity: number;
}

export default function CheckoutPage() {
  const [cartItems, setCartItems] = useState<Products[]>([]);
  const [loading, setLoading] = useState(true);

  const total = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  useEffect(() => {
    async function fetchCartItems() {
      const user = auth.currentUser;

      if (!user) {
        setLoading(false); // If no user is logged in, stop loading
        return;
      }

      try {
        const savedCart = localStorage.getItem(user.uid + "_cart");
        if (savedCart) {
          setCartItems(JSON.parse(savedCart));
        }
      } catch (error) {
        console.error("Failed to fetch cart items:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchCartItems();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="spinner-border animate-spin border-4 border-[#2A254B] border-t-transparent rounded-full w-12 h-12"></div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1440px] px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="mb-12 text-3xl font-normal font-clash">Checkout</h1>

      {cartItems.length === 0 ? (
        <p className="text-center text-red-500 font-clash">Your cart is empty.</p>
      ) : (
        <Elements stripe={stripePromise}>
          <CheckoutContent total={total} cartItems={cartItems} />
        </Elements>
      )}
    </div>
  );
}

function CheckoutContent({
  total,
  cartItems,
}: {
  total: number;
  cartItems: Products[];
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) return;

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) return;

    setProcessing(true);
    setError(null);

    try {
      const simplifiedCartItems = cartItems.map((item) => ({
        id: item._id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
      }));

      const response = await fetch("/api/create-payment-intent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: Math.round(total * 100),
          currency: "usd",
          items: simplifiedCartItems,
        }),
      });

      const { clientSecret } = await response.json();

      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            name,
            email,
            address: {
              line1: address,
            },
          },
        },
      });

      if (result.error) {
        setError(result.error.message || "Payment failed.");
      } else if (result.paymentIntent?.status === "succeeded") {
        const user = auth.currentUser;
        if (user) {
          // Store orders in localStorage
          const orderKey = `${user.uid}_orders`;
          const existingOrders = JSON.parse(localStorage.getItem(orderKey) || "[]");
          const newOrders = [...existingOrders, ...cartItems.map((item) => ({
            ...item,
            date: new Date().toISOString(),
          }))];

          localStorage.setItem(orderKey, JSON.stringify(newOrders));
          localStorage.removeItem(user.uid + "_cart"); // Clear the cart for the logged-in user
        }
        window.location.href = "/order-confirmation";
      }
    } catch (err) {
      setError("An unexpected error occurred.");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="grid md:grid-cols-2 gap-8">
      {/* Order Summary */}
      <div>
        <h2 className="text-xl mb-4 font-clash">Order Summary</h2>
        {cartItems.map((item) => (
          <div
            key={item._id}
            className="flex justify-between items-center py-2 border-b"
          >
            <span className="font-clash">{item.name}</span>
            <span className="font-clash">
              ${(item.price * (item.quantity || 1)).toFixed(2)}
            </span>
          </div>
        ))}
        <div className="flex justify-between font-bold mt-4">
          <span className="font-clash">Total</span>
          <span className="font-clash">${total.toFixed(2)}</span>
        </div>
      </div>

      {/* Payment Details */}
      <div>
        <h2 className="text-xl mb-4 font-clash">Payment Details</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <InputField label="Name" value={name} setValue={setName} />
          <InputField label="Email" value={email} setValue={setEmail} type="email" />
          <InputField label="Address" value={address} setValue={setAddress} />
          <div>
            <label className="block mb-2 font-clash">Card Details</label>
            <CardElement />
          </div>

          {error && <p className="text-red-500">{error}</p>}

          <Button
            type="submit"
            disabled={processing}
            className="w-full bg-[#2A254B] text-white font-clash"
          >
            {processing ? "Processing..." : "Pay Now"}
          </Button>
        </form>
      </div>
    </div>
  );
}

function InputField({
  label,
  value,
  setValue,
  type = "text",
}: {
  label: string;
  value: string;
  setValue: (val: string) => void;
  type?: string;
}) {
  return (
    <div>
      <label className="block mb-2 font-clash">{label}</label>
      <Input
        type={type}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="w-full"
      />
    </div>
  );
}
