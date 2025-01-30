'use client'
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import sanityClient from "@sanity/client";
import toast, { Toaster } from "react-hot-toast";
import { auth } from "../../firebase/firebase";
import { User } from "firebase/auth";
import Image from "next/image"; // Import Next.js Image component

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

async function fetchProducts() {
  const products = await sanity.fetch(`
    *[_type == "product"][0..3] {
      _id,
      name,
      "image": image.asset->url,
      price,
      description,
      "features": features[0..4],
      dimensions,
      category,
      tags,
      quantity
    }
  `);
  return products;
}

export default function FeaturesSection() {
  const [products, setProducts] = useState<Products[]>([]);
  const [isVisible, setIsVisible] = useState(false);
  const [isModalOpen, setModalOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser); // Set the user state based on auth status
    });

    return () => unsubscribe(); // Cleanup listener
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const productData = await fetchProducts();
        console.log("Products:", productData); // Debugging log
        setProducts(productData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
    setIsVisible(true);
  }, []);

  const addToWishlist = (product: Products) => {
    if (!user) {
      setModalOpen(true); // Show modal for unauthenticated users
      return;
    }

    const wishlist = JSON.parse(localStorage.getItem(user.uid + "_wishlist") || "[]");

    const isInWishlist = wishlist.some((item: Products) => item._id === product._id);
    if (isInWishlist) {
      toast.error(`${product.name} is already in your wishlist!`, { position: "bottom-right" });
    } else {
      wishlist.push(product);
      localStorage.setItem(user.uid + "_wishlist", JSON.stringify(wishlist)); // Update localStorage
      toast.success(`${product.name} added to wishlist!`, { position: "bottom-right" });
    }
  };

  return (
    <>
      <Toaster />
      <section className="py-16 px-4 md:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Section Title */}
        <h2 className={`text-3xl md:text-4xl font-serif text-center mb-16 font-clash transition-all duration-700 ease-out ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"}`} style={{ fontFamily: "var(--font-clash-reg)" }}>
          What makes our brand different
        </h2>

        {/* Products Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.length === 0 ? (
            <p className="col-span-full text-center">No products available at the moment.</p>
          ) : (
            products.map((product, index) => (
              <div key={product._id} className={`transition-all duration-500 ease-out ${isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95"}`} style={{ transitionDelay: `${index * 100}ms` }}>
                <Card className="border-0 shadow-none group">
                  <div className="aspect-square relative overflow-hidden mb-3">
                    {/* Replaced <img> with <Image> from Next.js */}
                    <Image
                      src={product.image}
                      alt={product.name}
                      width={400}  // Adjust as per your needs
                      height={400} // Adjust as per your needs
                      className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                  <h3 className="font-clash text-xl font-extrabold text-gray-900">{product.name}</h3>
                  <p className="text-sm font-clash text-gray-500">£{product.price}</p>
                  <p className="text-sm font-clash text-gray-500">{product.quantity} Pieces</p>
                  <Link href={`/products/${product._id}`}>
                    <Button className="w-full transition-transform duration-200 hover:scale-105 active:scale-95" variant="outline" style={{ fontFamily: "var(--font-clash-reg)" }}>
                      View Details
                    </Button>
                  </Link>
                  <Button className="w-full transition-transform duration-200 hover:scale-105 active:scale-95 mt-1 bg-[#2A254B] hover:bg-[#2A254B]/90 text-white font-clash" onClick={() => addToWishlist(product)}>
                    Add to Wishlist
                  </Button>
                </Card>
              </div>
            ))
          )}
        </div>

        {/* View collection button */}
        <div className={`text-center mt-12 transition-all duration-700 ease-out ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`} style={{ transitionDelay: "500ms" }}>
          <Link href="/product-listing">
            <Button variant="outline" size="lg" className="font-clash transition-transform duration-200 hover:scale-105 active:scale-95" style={{ fontFamily: "var(--font-clash-reg)" }}>
              View collection
            </Button>
          </Link>
        </div>
      </section>

      {/* Modal for unauthenticated users */}
      {!user && isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50" onClick={() => setModalOpen(false)}>
          <div className="bg-white p-6 w-4/5 max-w-xl relative z-60" onClick={(e) => e.stopPropagation()}>
            <button className="absolute top-4 right-4 text-gray-500 hover:text-gray-700" onClick={() => setModalOpen(false)}>&times;</button>
            <div className="text-center">
              <p className="text-gray-500 mb-4 font-clash">Please <strong>Sign In</strong> or <strong>Sign Up</strong> to add this item to your wishlist.</p>
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