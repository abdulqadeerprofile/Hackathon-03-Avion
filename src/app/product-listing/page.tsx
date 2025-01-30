"use client";
import * as React from "react";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
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
import sanityClient from "@sanity/client";
import Link from "next/link";
import toast, { Toaster } from "react-hot-toast";
import { auth } from "../../../firebase/firebase";
import { User } from "firebase/auth";

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
  quantity: number;
}

interface FilterOptions {
  categories: string[];
  priceRange: string;
  page: number;
  productsPerPage: number;
}

async function fetchCategories() {
  const categories = await sanity.fetch(
    `*[_type == "category"]{
      name,
      slug
    }`
  );
  return categories;
}

async function fetchProducts(
  filterOptions: FilterOptions,
  searchTerm?: string
) {
  const { categories, priceRange, page, productsPerPage } = filterOptions;

  let priceFilter = "";
  if (priceRange) {
    if (priceRange === "250+") {
      priceFilter = "price >= 250";
    } else {
      const [min, max] = priceRange.split(" - ").map(Number);
      priceFilter = `price >= ${min} && price <= ${max}`;
    }
  }

  const categoryFilter =
    categories.length > 0
      ? `category->name in [${categories.map((c) => `"${c}"`).join(", ")}]`
      : "";

  const queryFilters = [
    `_type == "product"`,
    categoryFilter,
    priceFilter,
    searchTerm ? `name match "${searchTerm}*"` : "",
  ]
    .filter(Boolean)
    .join(" && ");

  const query = `*[${queryFilters}]{
      _id,
      name,
      "image": image.asset->url,
      price,
      features,
      dimensions,
      category->,
      tags,
      quantity
    }[${(page - 1) * productsPerPage}...${page * productsPerPage}]`;

  const products = await sanity.fetch(query);
  return products;
}

export default function ProductListing() {
  const searchParams = useSearchParams();
  const searchTerm = searchParams.get("search") || "";

  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedPriceRange, setSelectedPriceRange] = useState<string>("");
  const [products, setProducts] = useState<Products[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(12);
  const [totalProducts, setTotalProducts] = useState(0);
  const [isModalOpen, setModalOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [userWishlist, setUserWishlist] = useState<Products[]>([]);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser); // Set the user state based on auth status
    });

    return () => unsubscribe(); // Cleanup listener
  }, []);

  useEffect(() => {
    async function loadInitialData() {
      try {
        setIsLoading(true);
        const categoriesData = await fetchCategories();
        const uniqueCategories = Array.from(
          new Set(categoriesData.map((cat: Category) => cat.name))
        ).map((name) =>
          categoriesData.find((cat: Category) => cat.name === name)
        );
        setCategories(uniqueCategories);

        const initialProducts = await fetchProducts(
          {
            categories: [],
            priceRange: "",
            page: currentPage,
            productsPerPage,
          },
          searchTerm ? decodeURIComponent(searchTerm) : undefined
        );
        setProducts(initialProducts);
      } catch (error) {
        console.error("Error loading initial data:", error);
      } finally {
        setIsLoading(false);
      }
    }
    loadInitialData();
  }, [searchTerm, currentPage]);

  useEffect(() => {
    async function loadFilteredProducts() {
      try {
        setIsLoading(true);
        const filteredProducts = await fetchProducts(
          {
            categories: selectedCategories,
            priceRange: selectedPriceRange,
            page: currentPage,
            productsPerPage,
          },
          searchTerm ? decodeURIComponent(searchTerm) : undefined
        );
        setProducts(filteredProducts);
      } catch (error) {
        console.error("Error loading filtered products:", error);
      } finally {
        setIsLoading(false);
      }
    }
    loadFilteredProducts();
  }, [selectedCategories, selectedPriceRange, searchTerm, currentPage]);

  const handleCategoryChange = (categoryName: string) => {
    setSelectedCategories((prev) => {
      if (prev.includes(categoryName)) {
        return prev.filter((cat) => cat !== categoryName);
      } else {
        return [...prev, categoryName];
      }
    });
  };

  const handlePriceChange = (priceRange: string) => {
    setSelectedPriceRange((prev) => (prev === priceRange ? "" : priceRange));
  };

  const filterConfig = {
    "Product type": categories.map((category) => category.name),
    Price: ["0 - 100", "101 - 250", "250+"],
  };

  useEffect(() => {
    if (user) {
      // Fetch the user's wishlist from localStorage if available
      const wishlist = JSON.parse(
        localStorage.getItem(user.uid + "_wishlist") || "[]"
      );
      console.log("Fetched wishlist from localStorage:", wishlist); // Debugging log
      setUserWishlist(wishlist);
    }
  }, [user]);

  const addToWishlist = (product: Products) => {
    if (!user) {
      setModalOpen(true); // Show modal for unauthenticated users
      return;
    }

    const wishlist = JSON.parse(
      localStorage.getItem(user.uid + "_wishlist") || "[]"
    );

    const isInWishlist = wishlist.some(
      (item: Products) => item._id === product._id
    );
    if (isInWishlist) {
      toast.error(`${product.name} is already in your wishlist!`, {
        position: "bottom-right",
      });
    } else {
      wishlist.push(product);
      localStorage.setItem(user.uid + "_wishlist", JSON.stringify(wishlist)); // Update localStorage
      setUserWishlist(wishlist); // Update the local state to reflect changes
      console.log("Updated wishlist in localStorage:", wishlist); // Debugging log
      toast.success(`${product.name} added to wishlist!`, {
        position: "bottom-right",
      });
    }
  };

  const totalPages = Math.ceil(3);

  return (
    <>
      <Toaster />
      <Navbar />
      <div className="min-h-screen bg-white">
        <div className="relative h-[300px] w-full">
          <Image
            src="/Frame 143.png"
            alt="All Products"
            fill
            className="object-cover brightness-75"
          />
          <h1 className="font-clash absolute bottom-8 left-4 text-3xl font-normal text-white sm:left-8 lg:left-12">
            {searchTerm
              ? `Search Results for "${decodeURIComponent(searchTerm)}" (${products.length})`
              : `All products (${products.length})`}
          </h1>
        </div>

        <div className="mx-auto max-w-[1440px] px-4 py-8 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-[240px,1fr] lg:gap-x-8">
            <div className="hidden lg:block">
              <Accordion type="single" collapsible className="w-full">
                {Object.entries(filterConfig).map(([category, options]) => (
                  <AccordionItem key={category} value={category}>
                    <AccordionTrigger className="text-base font-normal">
                      {category}
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-4">
                        {options.map((option) => (
                          <div
                            key={`${category}-${option}`}
                            className="flex items-center space-x-2"
                          >
                            <Checkbox
                              id={`${category}-${option}`}
                              checked={
                                category === "Product type"
                                  ? selectedCategories.includes(option)
                                  : selectedPriceRange === option
                              }
                              onCheckedChange={() =>
                                category === "Product type"
                                  ? handleCategoryChange(option)
                                  : handlePriceChange(option)
                              }
                            />
                            <label
                              htmlFor={`${category}-${option}`}
                              className="text-sm font-normal leading-none"
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

            <div className="mt-6 lg:mt-0">
              {isLoading ? (
                <div className="flex justify-center items-center">
                  <div className="spinner-border animate-spin border-4 border-[#2A254B] border-t-transparent rounded-full w-12 h-12"></div>
                </div>
              ) : (
                <div>
                  {products.length > 0 ? (
                    <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:gap-x-6 md:grid-cols-3 lg:gap-x-8">
                      {products.map((product) => (
                        <div key={product._id} className="group">
                          <div className="w-[300px] h-[300px] mx-auto aspect-h-1 aspect-w-1 overflow-hidden bg-gray-100">
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
                              <h3 className="font-clash text-xl font-extrabold text-gray-900">
                                {product.name}
                              </h3>
                              <p className="text-sm font-clash text-gray-500">
                                €{product.price}
                              </p>
                              <p className="text-sm font-clash text-gray-500">
                                {product.quantity} Pieces
                              </p>
                            </div>
                          </div>
                          {product._id ? (
                            <>
                              <Link href={`/products/${product._id}`}>
                                <Button
                                  className="w-full transition-transform duration-200 hover:scale-105 active:scale-95 mt-1"
                                  variant="outline"
                                  style={{
                                    fontFamily: "var(--font-clash-reg)",
                                  }}
                                >
                                  View Details
                                </Button>
                              </Link>
                              <Button
                                className="w-full transition-transform duration-200  hover:scale-105 active:scale-95 mt-1 bg-[#2A254B] hover:bg-[#2A254B]/90 text-white font-clash"
                                onClick={() => addToWishlist(product)}
                              >
                                Add to Wishlist
                              </Button>
                            </>
                          ) : (
                            <Button
                              disabled
                              className="w-full mt-1"
                              variant="outline"
                            >
                              No Details
                            </Button>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <h2 className="text-2xl font-semibold text-gray-700 mb-4">
                        No Products Found
                      </h2>
                      {searchTerm && (
                        <p className="text-gray-500 mb-6">
                          We couldn't find any products matching "
                          {decodeURIComponent(searchTerm)}".
                        </p>
                      )}
                      <p>Try adjusting your search or filters.</p>
                    </div>
                  )}
                  <div className="flex justify-center mt-8 font-clash">
                    <Button
                      disabled={currentPage === 1}
                      onClick={() => setCurrentPage(currentPage - 1)}
                    >
                      Previous
                    </Button>
                    <span className="mx-4">
                      Page {currentPage} of {totalPages}
                    </span>
                    <Button
                      disabled={currentPage === 2} // Disable the "Next" button after the second page
                      onClick={() => setCurrentPage(currentPage + 1)}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer2 />

      {!user && isModalOpen && (
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
            <div className="text-center">
              <p className="text-gray-500 mb-4 font-clash">
                Please <strong>Sign In</strong> or <strong>Sign Up</strong> to
                add this item to your wishlist.
              </p>
              <Link href="/acc-creation">
                <Button className="rounded-none bg-[#2A254B] px-8 hover:bg-[#2A254B]/90 font-clash">
                  Sign In / Sign Up
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
