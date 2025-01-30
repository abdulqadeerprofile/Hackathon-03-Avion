import * as React from "react";
import { useState, useEffect, Suspense } from "react";
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
        setTotalProducts(initialProducts.length); // Assuming all fetched products are shown here
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
        setTotalProducts(filteredProducts.length); // Update total products
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
      toast.success(`${product.name} added to wishlist!`, {
        position: "bottom-right",
      });
    }
  };

  const totalPages = Math.ceil(totalProducts / productsPerPage);

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Toaster />
      <Navbar />
      <div className="min-h-screen bg-white">
        <div className="relative h-[300px] w-full">
          <Image
            src="/Frame 143.png"
            alt="All Products"
            className="object-cover"
            fill
          />
          <div className="absolute bottom-5 left-8 text-white">
            <h1 className="text-4xl font-semibold">All Products</h1>
            <h2 className="text-xl">Explore Our Products</h2>
          </div>
        </div>

        <div className="flex flex-row gap-5 py-5 px-20">
          <div className="w-[300px]">
            <Accordion type="multiple">
              <AccordionItem value="item-1">
                <AccordionTrigger>Filter by</AccordionTrigger>
                <AccordionContent>
                  <div>
                    {Object.entries(filterConfig).map(([title, options]) => (
                      <div key={title} className="pb-4">
                        <h3 className="font-medium text-lg">{title}</h3>
                        <div className="space-y-2">
                          {options.map((option) => (
                            <label
                              key={option}
                              className="flex items-center space-x-2"
                            >
                              <Checkbox
                                checked={title === "Product type"
                                  ? selectedCategories.includes(option)
                                  : selectedPriceRange === option}
                                onChange={() =>
                                  title === "Product type"
                                    ? handleCategoryChange(option)
                                    : handlePriceChange(option)
                                }
                              />
                              <span>{option}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>

          <div className="flex-grow">
            <div className="grid grid-cols-4 gap-4">
              {isLoading ? (
                <div>Loading products...</div>
              ) : (
                products.map((product) => (
                  <div key={product._id} className="border p-4 rounded">
                    <Link href={`/product/${product._id}`}>
                      <img src={product.image} alt={product.name} className="w-full h-[200px] object-cover" />
                      <h3 className="text-lg">{product.name}</h3>
                      <p className="text-sm">{product.description}</p>
                      <div className="flex justify-between items-center">
                        <span className="text-xl font-semibold">{`$${product.price}`}</span>
                        <Button onClick={() => addToWishlist(product)}>Add to Wishlist</Button>
                      </div>
                    </Link>
                  </div>
                ))
              )}
            </div>

            <div className="flex justify-center mt-6">
              <nav>
                <ul className="flex space-x-2">
                  {Array.from({ length: totalPages }, (_, index) => (
                    <li
                      key={index}
                      className={`${
                        currentPage === index + 1
                          ? "text-blue-500"
                          : "text-gray-700"
                      }`}
                    >
                      <button onClick={() => setCurrentPage(index + 1)}>
                        {index + 1}
                      </button>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>
          </div>
        </div>

        <Footer2 />
      </div>
    </Suspense>
  );
}
