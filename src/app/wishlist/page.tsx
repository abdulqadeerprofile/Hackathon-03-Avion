"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/Navbar";
import NewsletterSection from "@/components/newsletter-section";
import Footer from "@/components/footer";
import Link from "next/link";
import { auth } from "../../../firebase/firebase"; // Import Firebase Auth instance
import { User } from "firebase/auth"; // Import Firebase User type

interface Dimensions {
  width: string;
  height: string;
  depth: string;
}

interface CategoryReference {
  _ref: string;
  _type: string;
}

interface Products {
  name: string;
  description: string;
  image: string;
  _id: string;
  features: string[];
  dimensions: Dimensions;
  category: CategoryReference;
  price: number;
  tags: string[];
}

export default function Wishlist() {
  const [wishlistItems, setWishlistItems] = useState<Products[]>([]); // Wishlist state
  const [loading, setLoading] = useState<boolean>(true); // Loading state
  const [user, setUser] = useState<User | null>(null); // Authentication state

  // Check authentication status
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser); // Set the user state based on auth status
      setLoading(false); // Set loading to false once the auth status is checked
    });

    return () => unsubscribe(); // Cleanup listener
  }, []);

  // Load wishlist items from localStorage when user is authenticated
  useEffect(() => {
    if (user) {
      const savedWishlist = localStorage.getItem(user.uid + "_wishlist");
      if (savedWishlist) {
        setWishlistItems(JSON.parse(savedWishlist));
      }
    }
  }, [user]); // Run this effect only when user is available

  // Remove item from wishlist
  const removeFromWishlist = (id: string) => {
    const updatedWishlist = wishlistItems.filter((item) => item._id !== id);
    setWishlistItems(updatedWishlist);
    if (user) {
      localStorage.setItem(user.uid + "_wishlist", JSON.stringify(updatedWishlist));
    }
  };

  if (loading) {
    // Show loading spinner while checking authentication state
    return (
      <>
        <Navbar />
        <div className="flex justify-center items-center min-h-screen">
          <div className="spinner-border animate-spin border-4 border-[#2A254B] border-t-transparent rounded-full w-12 h-12"></div>
        </div>
        <NewsletterSection />
        <Footer />
      </>
    );
  }

  if (!user) {
    // If user is not signed in, show SignIn/SignUp message
    return (
      <>
        <Navbar />
        <div className="mx-auto max-w-[1440px] px-4 py-16 sm:px-6 lg:px-8">
          <h1 className="mb-12 text-3xl font-normal font-clash">Your Wishlist</h1>
          <div className="text-center">
            <p className="text-gray-500 mb-4 font-clash">
              Please <strong>Sign In</strong> or <strong>Sign Up</strong> to view your wishlist.
            </p>
            <Link href="/acc-creation">
              <Button className="rounded-none bg-[#2A254B] px-8 hover:bg-[#2A254B]/90 font-clash">
                Sign In / Sign Up
              </Button>
            </Link>
          </div>
        </div>
        <NewsletterSection />
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="mx-auto max-w-[1440px] px-4 py-16 sm:px-6 lg:px-8">
        <h1 className="mb-12 text-3xl font-normal font-clash">Your Wishlist</h1>

        {wishlistItems.length === 0 ? (
          <p className="text-center text-gray-500 font-clash">
            Your wishlist is empty.
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {wishlistItems.map((item) => (
              <div key={item._id} className="border p-4 rounded-lg shadow-sm">
                <div className="relative h-48 w-full overflow-hidden bg-gray-100">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="mt-4">
                  <h3 className="text-lg font-medium font-clash">{item.name}</h3>
                  <p className="text-sm font-clash text-gray-500">£{item.price}</p>
                  <div className="mt-4 flex justify-between items-center">
                    <Button
                      variant="link"
                      className="text-red-500 p-0 font-clash"
                      onClick={() => removeFromWishlist(item._id)}
                    >
                      Remove
                    </Button>
                    <Link href={`/products/${item._id}`}>
                      <Button className="bg-[#2A254B] text-white hover:bg-[#2A254B]/90 font-clash">
                        View Product
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <NewsletterSection />
      <Footer />
    </>
  );
}
