"use client";
import { useEffect, useState } from 'react';
import { Truck } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Link from 'next/link';
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
    *[_type == "product"][0..3] {
      _id,
      name,
      "image": image.asset->url,
      price,
      description,
      "features": features[0..4], // Limit to first 4 features
      dimensions,
      category,
      tags
    }
  `);
  return products;
}

export default function FeaturesSection() {
  const [products, setProducts] = useState<Products[]>([]);
  const [isVisible, setIsVisible] = useState(false);

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

  return (
    <section className="py-16 px-4 md:px-6 lg:px-8 max-w-7xl mx-auto">
      <h2
        className={`text-3xl md:text-4xl font-serif text-center mb-16 font-clash transition-all duration-700 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}
        style={{ fontFamily: 'var(--font-clash-reg)' }}
      >
        What makes our brand different
      </h2>

      {/* Features section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-24">
        {products.length === 0 ? (
          <p className="col-span-full text-center">No features available at the moment.</p>
        ) : (
          products.map((product) => (
            product.features.slice(0, 4).map((feature, index) => ( // Limit to first 4 features
              <div
                key={`${product._id}-${index}`}
                className={`space-y-3 p-6 rounded-lg transition-all duration-500 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
                style={{ backgroundColor: 'white', transitionDelay: `${index * 100}ms` }}
              >
                <div className="transition-transform duration-300 ease-in-out hover:scale-110">
                </div>
                <h3 className="text-xl font-semibold" style={{ fontFamily: 'var(--font-clash-reg)' }}>
                  {feature}
                </h3>
                <p className="text-muted-foreground" style={{ fontFamily: 'var(--font-clash-reg)' }}>
                  {product.description}
                </p>
              </div>
            ))
          ))
        )}
      </div>

      {/* Products section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.length === 0 ? (
          <p className="col-span-full text-center">No products available at the moment.</p>
        ) : (
          products.map((product, index) => (
            <div
              key={product._id}
              className={`transition-all duration-500 ease-out ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <Card className="border-0 shadow-none group">
                <div className="aspect-square relative overflow-hidden mb-3">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <h3 className="font-clash font-medium text-lg" style={{ fontFamily: 'var(--font-clash-reg)' }}>
                  {product.name}
                </h3>
                <p className="text-muted-foreground mb-3" style={{ fontFamily: 'var(--font-clash-reg)' }}>
                  £{product.price}
                </p>
                <Link href="/products">
                  <Button
                    className="w-full transition-transform duration-200 hover:scale-105 active:scale-95"
                    variant="outline"
                    style={{ fontFamily: 'var(--font-clash-reg)' }}
                  >
                    View Details
                  </Button>
                </Link>
              </Card>
            </div>
          ))
        )}
      </div>

      {/* View collection button */}
      <div
        className={`text-center mt-12 transition-all duration-700 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
        style={{ transitionDelay: '500ms' }}
      >
        <Link href="/product-listing">
          <Button
            variant="outline"
            size="lg"
            className="font-clash transition-transform duration-200 hover:scale-105 active:scale-95"
            style={{ fontFamily: 'var(--font-clash-reg)' }}
          >
            View collection
          </Button>
        </Link>
      </div>
    </section>
  );
}