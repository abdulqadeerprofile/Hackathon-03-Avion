"use client";

import * as React from "react";
import Image from "next/image";
import { ChevronDown } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import Footer2 from "@/components/footer2";

import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import sanityClient from "@sanity/client";

const sanity = sanityClient({
  projectId: "ah48gcwm",
  dataset: "production",
  apiVersion: "2024-01-04",
  useCdn: true,
});

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
}

async function fetchProducts() {
  const products = await sanity.fetch(`
    *[_type == "product"]{
      _id,
      name,
      "image": image.asset->url,
      price,
      description,
      features,
      dimensions,
      category,
      tags
    }
  `);
  return products;
}

// Filter data
const filters = {
  "Product type": ["Furniture", "Homeware", "Sofas", "Light fittings", "Accessories"],
  Price: ["0 - 100", "101 - 250", "250 +"],
  Designer: ["Robert Smith", "Liam Gallagher", "Biggie Smalls", "Thom Yorke"],
};

export default async function ProductListing() {
  
  const products: Products[] = await fetchProducts();

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-white">
        {/* Hero Section */}
        <div className="relative h-[300px] w-full">
          <Image
            src="/Frame 143.png"
            alt="All Products"
            fill
            className="object-cover brightness-75"
          />
          <h1 className="absolute bottom-8 left-4 text-3xl font-normal text-white sm:left-8 lg:left-12">
            All products
          </h1>
        </div>

        {/* Main Content */}
        <div className="mx-auto max-w-[1440px] px-4 py-8 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-[240px,1fr] lg:gap-x-8">
            {/* Filters - Desktop */}
            <div className="hidden lg:block">
              <Accordion type="single" collapsible className="w-full">
                {Object.entries(filters).map(([category, options]) => (
                  <AccordionItem key={category} value={category}>
                    <AccordionTrigger className="text-base font-normal">
                      {category}
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-4">
                        {options.map((option) => (
                          <div key={option} className="flex items-center space-x-2">
                            <Checkbox id={option} />
                            <label
                              htmlFor={option}
                              className="text-sm font-normal leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                              {option}
                            </label>
                          </div>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>

            {/* Filters - Mobile */}
            <div className="flex items-center justify-between gap-4 lg:hidden">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" className="w-full">
                    Filters
                    <ChevronDown className="ml-2 h-4 w-4" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left">
                  <SheetHeader>
                    <SheetTitle>Filters</SheetTitle>
                  </SheetHeader>
                  <Accordion type="single" collapsible className="w-full">
                    {Object.entries(filters).map(([category, options]) => (
                      <AccordionItem key={category} value={category}>
                        <AccordionTrigger className="text-base font-normal">
                          {category}
                        </AccordionTrigger>
                        <AccordionContent>
                          <div className="space-y-4">
                            {options.map((option) => (
                              <div key={option} className="flex items-center space-x-2">
                                <Checkbox id={`mobile-${option}`} />
                                <label
                                  htmlFor={`mobile-${option}`}
                                  className="text-sm font-normal leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                >
                                  {option}
                                </label>
                              </div>
                            ))}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </SheetContent>
              </Sheet>
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" className="w-full">
                    Sorting
                    <ChevronDown className="ml-2 h-4 w-4" />
                  </Button>
                </SheetTrigger>
                <SheetContent>
                  <SheetHeader>
                    <SheetTitle>Sort by</SheetTitle>
                  </SheetHeader>
                  {/* Add sorting options here */}
                </SheetContent>
              </Sheet>
            </div>

            {/* Product Grid */}
            <div className="mt-6 lg:mt-0">
              <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:gap-x-6 md:grid-cols-3 lg:gap-x-8">
                {products.map((product) => (
                  <div key={product._id} className="group">
                    <div className=" w-[300px] h-[300px] mx-auto aspect-h-1 aspect-w-1 overflow-hidden bg-gray-100">
                      <Image
                        src={product.image}
                        alt={product.name}
                        width={500}
                        height={500}
                        className="w-full h-full object-cover object-center"
                      />
                    </div>
                    <div className="mt-4 flex justify-between">
                      <div>
                        <h3 className="text-sm font-normal text-gray-900">
                          {product.name}
                        </h3>
                        <p className="mt-1 text-sm text-gray-500">€{product.price}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-8 text-center lg:hidden">
                <Button variant="outline" className="w-full">
                  View collection
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Footer2 component */}
      <Footer2 />
    </>
  );
}
