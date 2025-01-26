"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";

export function Navbar2() {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();

  const handleSearch = () => {
    if (searchTerm.trim()) {
      // Encode the search term to handle special characters
      const encodedSearchTerm = encodeURIComponent(searchTerm.trim());
      // Redirect to the product listing page with the search query
      router.push(`/product-listing?search=${encodedSearchTerm}`);
      setSearchTerm(""); // Clear the search term
      setIsOpen(false); // Close mobile menu if open
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="w-full">
      {/* Top Banner */}
      <div className="w-full bg-[#2A254B] py-2 px-4 text-center text-white">
        <p className="text-sm" style={{ fontFamily: "var(--font-clash-reg)" }}>
          Free delivery on all orders over £50 with code easter checkout
        </p>
      </div>

      {/* Main Navigation */}
      <div className="border-b">
        <div className="mx-auto flex h-16 max-w-[1440px] items-center justify-between px-4 sm:px-6">
          {/* Logo */}
          <Link href="/" className="font-serif text-2xl" style={{ fontFamily: "var(--font-clash-reg)" }}>
            Avion
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden items-center space-x-6 md:flex">
            <Link href="/about" className="text-sm text-gray-600 hover:text-gray-900" style={{ fontFamily: "var(--font-clash-reg)" }}>
              About us
            </Link>
            <Link href="/cart" className="text-sm text-gray-600 hover:text-gray-900" style={{ fontFamily: "var(--font-clash-reg)" }}>
              Contact
            </Link>
            <Link href="/product-listing" className="text-sm text-gray-600 hover:text-gray-900" style={{ fontFamily: "var(--font-clash-reg)" }}>
              Blog
            </Link>
            <Link href="/products" className="text-sm text-gray-600 hover:text-gray-900" style={{ fontFamily: "var(--font-clash-reg)" }}>
              All Products
            </Link>

            {/* Search Input */}
            <div className="flex items-center">
              <Input
                type="search"
                placeholder="Search..."
                className="border-gray-300 text-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={handleKeyPress}
              />
              <Button onClick={handleSearch} variant="ghost" size="icon" className="ml-2">
                <Search className="h-5 w-5 text-gray-600 hover:text-gray-900" />
              </Button>
            </div>

            {/* Cart */}
            <a href="/cart">
              <Button variant="ghost" size="icon" className="relative">
                <img
                  src="/icons/Shopping--cart.svg"
                  alt="Shopping Cart"
                  className="h-5 w-5 text-gray-600 hover:text-gray-900"
                />
              </Button>
            </a>
          </div>

          {/* Mobile Navigation */}
          <div className="flex items-center md:hidden">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Search className="h-5 w-5 text-gray-600 hover:text-gray-900" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right">
                <nav className="flex flex-col space-y-4">
                  <Input
                    type="search"
                    placeholder="Search..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="border-gray-300 text-sm"
                  />
                  <Button onClick={handleSearch} style={{ backgroundColor: "#2A254B", color: "white" }}>
                    Search
                  </Button>
                  <Link href="/about" className="text-sm" onClick={() => setIsOpen(false)} style={{ fontFamily: "var(--font-clash-reg)" }}>
                    About us
                  </Link>
                  <Link href="/cart" className="text-sm" onClick={() => setIsOpen(false)} style={{ fontFamily: "var(--font-clash-reg)" }}>
                    Contact
                  </Link>
                  <Link href="/product-listing" className="text-sm" onClick={() => setIsOpen(false)} style={{ fontFamily: "var(--font-clash-reg)" }}>
                    Blog
                  </Link>
                  <Link href="/products" className="text-sm" onClick={() => setIsOpen(false)} style={{ fontFamily: "var(--font-clash-reg)" }}>
                    All Products
                  </Link>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </div>
  );
}
