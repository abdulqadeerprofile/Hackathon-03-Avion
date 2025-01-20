"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Search } from 'lucide-react';

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import sanityClient from '@sanity/client';

const sanity = sanityClient({
  projectId: 'ah48gcwm',
  dataset: 'production',
  apiVersion: '2024-01-04',
  useCdn: true,
});

export function Navbar2() {
  const [isOpen, setIsOpen] = useState(false);
  const [categories, setCategories] = useState<string[]>([]);

  // Fetch categories from Sanity
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const query = `*[_type == "category"]{name}`;
        const data = await sanity.fetch(query);
        setCategories(data.map((category: { name: string }) => category.name));
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []);

  return (
    <div className="w-full">
      {/* Top Banner */}
      <div className="w-full bg-[#2A254B] py-2 px-4 text-center text-white">
        <p className="text-sm" style={{ fontFamily: 'var(--font-clash-reg)' }}>
          {"Free delivery on all orders over £50 with code easter checkout"}
        </p>
      </div>

      {/* Main Navigation */}
      <div className="border-b">
        <div className="mx-auto flex h-16 max-w-[1440px] items-center justify-between px-4 sm:px-6">
          {/* Logo */}
          <Link href="/" className="font-serif text-2xl" style={{ fontFamily: 'var(--font-clash-reg)' }}>
            Avion
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden items-center space-x-6 md:flex">
            <Link href="/about" className="text-sm text-gray-600 hover:text-gray-900" style={{ fontFamily: 'var(--font-clash-reg)' }}>
              About us
            </Link>
            <Link href="/cart" className="text-sm text-gray-600 hover:text-gray-900" style={{ fontFamily: 'var(--font-clash-reg)' }}>
              Contact
            </Link>
            <Link href="/product-listing" className="text-sm text-gray-600 hover:text-gray-900" style={{ fontFamily: 'var(--font-clash-reg)' }}>
              Blog
            </Link>
            <Button variant="ghost" size="icon">
              <Search className="h-5 w-5 text-gray-600 hover:text-gray-900" />
            </Button>
            <a href="/cart">
              <Button variant="ghost" size="icon" className="relative">
                <img src="/icons/Shopping--cart.svg" alt="Shopping Cart" className="h-5 w-5 text-gray-600 hover:text-gray-900" />
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
                  <Link href="/about" className="text-sm" onClick={() => setIsOpen(false)} style={{ fontFamily: 'var(--font-clash-reg)' }}>
                    About us
                  </Link>
                  <Link href="/cart" className="text-sm" onClick={() => setIsOpen(false)} style={{ fontFamily: 'var(--font-clash-reg)' }}>
                    Contact
                  </Link>
                  <Link href="/product-listing" className="text-sm" onClick={() => setIsOpen(false)} style={{ fontFamily: 'var(--font-clash-reg)' }}>
                    Blog
                  </Link>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>

      {/* Categories Navigation */}
      <div className="border-b">
        <div className="mx-auto max-w-[1440px] px-4 sm:px-6">
          <nav className="mx-auto">
            <div className="hidden space-x-8 md:flex">
              {categories.length > 0 ? (
                categories.map((category) => (
                  <div key={category}>
                    <Link
                      href="/products"
                      className="group inline-flex h-14 w-max items-center justify-center text-sm font-medium transition-colors hover:text-gray-900 text-gray-600"
                    >
                      {category}
                    </Link>
                  </div>
                ))
              ) : (
                <span>Loading categories...</span>
              )}
            </div>
          </nav>

          {/* Mobile Categories */}
          <div className="scrollbar-none flex overflow-x-auto py-4 md:hidden">
            {categories.length > 0 ? (
              categories.map((category) => (
                <Link
                  key={category}
                  href="/products"
                  className="whitespace-nowrap px-4 text-sm text-gray-600 hover:text-gray-900"
                  style={{ fontFamily: 'var(--font-clash-reg)' }}
                >
                  {category}
                </Link>
              ))
            ) : (
              <span>Loading categories...</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
