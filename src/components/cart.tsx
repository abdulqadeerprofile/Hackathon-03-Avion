"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { auth } from "../../firebase/firebase"; // Import Firebase Auth instance
import { User } from "firebase/auth"; // Import Firebase User type

interface Category {
  name: string;
  slug: string;
}

interface Dimensions {
  width: string;
  height: string;
  depth: string;
}

interface Products {
  name: string;
  description: string;
  image: string;
  _id: string;
  features: string[];
  dimensions: Dimensions;
  category: Category;
  price: number;
  tags: string[];
  quantity: number;
}

export default function ShoppingCart() {
  const [cartItems, setCartItems] = useState<Products[]>([]); 
  const [loading, setLoading] = useState<boolean>(true);  // To show loading spinner
  const [user, setUser] = useState<User | null>(null);  // For storing the user state

  // Check the authentication status once component is mounted
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);  // Set user state based on authentication status
      setLoading(false); // Stop loading once the auth state is known
    });

    return () => unsubscribe(); // Cleanup listener
  }, []);

  // Fetch the cart items from localStorage when user is logged in
  useEffect(() => {
    if (user) {
      const savedCart = localStorage.getItem(user.uid + "_cart");
      if (savedCart) {
        setCartItems(JSON.parse(savedCart));
      }
    }
  }, [user]); // Run this effect only when user is available

  const updateQuantity = (id: string, newQuantity: number) => {
    const updatedCart = cartItems.map((item) =>
      item._id === id ? { ...item, quantity: newQuantity } : item
    );
    setCartItems(updatedCart);
    if (user) {
      localStorage.setItem(user.uid + "_cart", JSON.stringify(updatedCart));
    }
  };

  const removeItem = (id: string) => {
    const updatedCart = cartItems.filter((item) => item._id !== id);
    setCartItems(updatedCart);
    if (user) {
      localStorage.setItem(user.uid + "_cart", JSON.stringify(updatedCart));
    }
  };

  const calculateTotal = () => {
    return cartItems.reduce(
      (total, item) => total + item.price * (item.quantity || 1),
      0
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="spinner-border animate-spin border-4 border-[#2A254B] border-t-transparent rounded-full w-12 h-12"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="mx-auto max-w-[1440px] px-4 py-16 sm:px-6 lg:px-8">
        <h1 className="mb-12 text-3xl font-normal font-clash">Your shopping cart</h1>
        <div className="text-center">
          <p className="text-gray-500 mb-4 font-clash">
            Please <strong>Sign In</strong> or <strong>Sign Up</strong> to add items to your cart.
          </p>
          <Link href="/acc-creation">
            <Button className="rounded-none bg-[#2A254B] px-8 hover:bg-[#2A254B]/90 font-clash">
              Sign In / Sign Up
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1440px] px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="mb-12 text-3xl font-normal font-clash">Your shopping cart</h1>
      {cartItems.length === 0 ? (
        <p className="text-center text-gray-500 font-clash">Your cart is empty</p>
      ) : (
        <>
          <div className="divide-y">
            {cartItems.map((item) => (
              <div key={item._id} className="grid grid-cols-1 gap-4 py-8 md:grid-cols-[2fr,1fr,1fr]">
                <div className="flex gap-4">
                  <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden bg-gray-100">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <h2 className="font-clash text-lg">{item.name}</h2>
                    <p className="text-sm font-clash">Price: £{item.price}</p>
                    <Button onClick={() => removeItem(item._id)} className="text-red-500 font-clash bg-transparent hover:underline hover:bg-transparent">
                      Remove
                    </Button>
                  </div>
                </div>
                <div className="flex flex-col justify-center items-center">
                  <Input
                    type="number"
                    value={item.quantity || 1}
                    min="1"
                    onChange={(e) => updateQuantity(item._id, parseInt(e.target.value))}
                    className="w-20 text-center"
                  />
                </div>
                <div className="flex flex-col justify-center items-center">
                  <p className="font-clash">£{item.price * (item.quantity || 1)}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-8 space-y-4 border-t pt-8">
            <div className="flex justify-end gap-4 text-lg font-clash">
              <span>Subtotal</span>
              <span>£{calculateTotal().toFixed(2)}</span>
            </div>
            <div className="flex justify-end">
              <Link href={'/checkout'}>
              <Button className="rounded-none bg-[#2A254B] px-8 hover:bg-[#2A254B]/90 font-clash">
                Go to checkout
              </Button>
              </Link>
            </div>
          </div>
        </>
      )}
    </div>
  );
}