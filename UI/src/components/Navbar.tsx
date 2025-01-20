'use client'
import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { Search, Menu } from 'lucide-react'
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Input } from "@/components/ui/input"
import Image from 'next/image'
import sanityClient from '@sanity/client'

const sanity = sanityClient({
  projectId: 'ah48gcwm',
  dataset: 'production',
  apiVersion: '2024-01-04',
  useCdn: true,
})

interface Category {
  _id: string;
  name: string;
  slug: {
    current: string;
  };
}

export function Navbar() {
  const [navItems, setNavItems] = useState<Category[]>([])

  useEffect(() => {
    // Fetch navigation items from Sanity
    sanity.fetch('*[_type == "category"]{_id, name, slug}').then((data) => {
      setNavItems(data)
    }).catch((error) => {
      console.error('Error fetching navigation items:', error)
    })
  }, [])

  return (
    <nav className="border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Left side: Search Icon (hidden on small screens) */}
          <div className="hidden lg:flex items-center">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="text-gray-400 hover:text-gray-500">
                  <Search className="h-6 w-6" />
                  <span className="sr-only">Search</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-56">
                <div className="p-2">
                  <Input type="search" placeholder="Search..." className="w-full" />
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Center: Logo with custom font */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center">
              <span className="text-2xl" style={{ fontFamily: 'var(--font-clash-reg)' }}>Avion</span>
            </Link>
          </div>

          {/* Right side: Cart & Profile Icons (hidden on small screens) */}
          <div className="hidden lg:flex items-center">
            <a href="/cart">
              <Button variant="ghost" size="icon" className="ml-4 text-gray-400 hover:text-gray-500">
                <Image
                  src="/icons/Shopping--cart.svg"
                  alt="Shopping cart"
                  width={16}
                  height={16}
                />
                <span className="sr-only">Shopping cart</span>
              </Button>
            </a>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="ml-4 text-gray-400 hover:text-gray-500">
                  <Image
                    src="/icons/User--avatar.svg"
                    alt="User account"
                    width={16}
                    height={16}
                  />
                  <span className="sr-only">User account</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  <Link href="/signin">Sign In</Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link href="/login">Login</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Mobile menu and search (visible on small screens) */}
          <div className="flex lg:hidden items-center">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="text-gray-400 hover:text-gray-500">
                  <Search className="h-6 w-6" />
                  <span className="sr-only">Search</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="p-2">
                  <Input type="search" placeholder="Search..." className="w-full" />
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="ml-4 text-gray-400 hover:text-gray-500">
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right">
                <nav className="flex flex-col space-y-4 mt-4">
                  {navItems.map((item) => (
                    <Link
                      key={item._id}
                      href={`/products/${item.slug.current}`}
                      className="text-gray-500 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ease-in-out"
                      style={{ fontFamily: 'var(--font-clash-reg)' }} // Apply custom font to menu items
                    >
                      {item.name}
                    </Link>
                  ))}
                  <a href='/cart'>
                    <Button variant="ghost" size="sm" className="justify-start text-gray-400 hover:text-gray-500">
                      <Image
                        src="/icons/Shopping--cart.svg"
                        alt="Shopping cart"
                        width={16}
                        height={16}
                        className="mr-2"
                      />
                      <span>Cart</span>
                    </Button>
                  </a>
                  <Button variant="ghost" size="sm" className="justify-start text-gray-400 hover:text-gray-500">
                    <Image
                      src="/icons/User--avatar.svg"
                      alt="User account"
                      width={16}
                      height={16}
                      className="mr-2"
                    />
                    <span>Profile</span>
                  </Button>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        {/* Divider Line between the upper menu and navigation links */}
        <div className="border-t border-gray-200"></div>

        {/* Navigation Links (Desktop only) */}
        <div className="hidden lg:flex lg:items-center lg:justify-center flex-wrap gap-4 mt-4">
          {navItems.map((item) => (
            <Link
              key={item._id}
              href={`/products/${item.slug.current}`}
              className="text-gray-500 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ease-in-out"
              style={{ fontFamily: 'var(--font-clash-reg)' }} // Apply custom font to desktop navigation links
            >
              {item.name}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  )
}
