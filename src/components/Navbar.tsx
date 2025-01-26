"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Search, Menu, Heart, User } from "lucide-react"; // Import User icon for profile
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { auth } from "../../firebase/firebase"; // Import your Firebase auth instance
import { signOut } from "firebase/auth"; // Import signOut function
import { User as fbUser } from "firebase/auth"

export function Navbar() {
  const [isModalOpen, setModalOpen] = useState(false);
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false); // State for mobile menu
  const [searchTerm, setSearchTerm] = useState("");
  const [user, setUser] = useState<fbUser | null>(null); // State to track signed-in user
  const router = useRouter();

  // Listen for authentication state changes
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe(); // Cleanup listener
  }, []);

  const handleSearch = () => {
    if (searchTerm.trim()) {
      const encodedSearchTerm = encodeURIComponent(searchTerm.trim());
      router.push(`/product-listing?search=${encodedSearchTerm}`);
      setModalOpen(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      if (user) {
        const userWishlistKey = `wishlist_${user.uid}`;
        localStorage.removeItem(userWishlistKey); // Clear wishlist for this user
      }
      router.push("/"); // Redirect to the homepage after sign-out
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <nav className="border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Left side: Search Icon */}
          <div>
            <Button
              variant="ghost"
              size="icon"
              className="text-gray-400 hover:text-gray-500"
              onClick={() => setModalOpen(true)}
            >
              <Search className="h-6 w-6" />
              <span className="sr-only">Search</span>
            </Button>
          </div>

          {/* Center: Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center">
              <span
                className="text-2xl"
                style={{ fontFamily: "var(--font-clash-reg)" }}
              >
                Avion
              </span>
            </Link>
          </div>

          {/* Right side: Cart, Wishlist, Profile/Sign-In */}
          <div className="lg:hidden">
            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="text-gray-400 hover:text-gray-500"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
            >
              <Menu className="h-6 w-6" />
              <span className="sr-only">Open menu</span>
            </Button>
          </div>

          <div className="hidden lg:flex items-center">
            {/* Wishlist Button */}
            <a href="/wishlist">
              <Button
                variant="ghost"
                size="icon"
                className="ml-4 text-gray-400 hover:text-gray-500"
              >
                <Heart className="h-6 w-6" />
                <span className="sr-only">Wishlist</span>
              </Button>
            </a>

            {/* Cart Button */}
            <a href="/cart">
              <Button
                variant="ghost"
                size="icon"
                className="ml-4 text-gray-400 hover:text-gray-500"
              >
                <Image
                  src="/icons/Shopping--cart.svg"
                  alt="Shopping cart"
                  width={16}
                  height={16}
                />
                <span className="sr-only">Shopping cart</span>
              </Button>
            </a>

            {/* User Profile or Sign-In Button */}
            {user ? (
              <div className="flex items-center ml-4">
                {/* Profile Icon */}
                <Link href="/profile">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-gray-400 hover:text-gray-500"
                  >
                    <User className="h-6 w-6" />
                    <span className="sr-only">Profile</span>
                  </Button>
                </Link>
                {/* Sign-Out Button */}
                <Button
                  variant="ghost"
                  size="sm"
                  className="ml-2 text-gray-700 hover:bg-gray-100"
                  onClick={handleSignOut}
                >
                  Sign Out
                </Button>
              </div>
            ) : (
              <Link href="/acc-creation">
                <Button
                  variant="ghost"
                  size="sm"
                  className="ml-4 text-gray-700 hover:bg-gray-100"
                >
                  Sign In
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-white shadow-md">
          <div className="p-4">
            <Link href="/wishlist">
              <Button
                variant="ghost"
                size="sm"
                className="w-full text-left text-gray-700 hover:bg-gray-100"
              >
                Wishlist
              </Button>
            </Link>
            <Link href="/cart">
              <Button
                variant="ghost"
                size="sm"
                className="w-full text-left text-gray-700 hover:bg-gray-100"
              >
                Cart
              </Button>
            </Link>
          </div>
        </div>
      )}

      {/* Search Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
          onClick={() => setModalOpen(false)}
        >
          <div
            className="bg-white p-6 w-4/5 max-w-xl relative z-60"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
              onClick={() => setModalOpen(false)}
            >
              &times;
            </button>
            <h2 className="text-xl font-semibold text-gray-700 mb-4 font-clash">
              Looking for something?
            </h2>
            <p className="text-gray-600 mb-4 font-clash">
              Input the name of the product and find out if we have it.
            </p>
            <div className="items-center space-y-2 font-clash">
              <Input
                type="search"
                placeholder="Search..."
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={handleKeyPress}
                className="flex-grow border-gray-300"
              />
              <Button
                onClick={handleSearch}
                style={{
                  backgroundColor: "#2A254B",
                  color: "white",
                }}
                className="px-4 py-2"
              >
                Search
              </Button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
