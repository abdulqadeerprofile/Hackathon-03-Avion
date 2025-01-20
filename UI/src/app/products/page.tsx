import { Navbar } from "@/components/Navbar";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Footer from "@/components/footer";
import News from "@/components/newsletter-section";
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
    *[_type == "product"][0..4]{
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

export default async function ProductPage() {
  const products: Products[] = await fetchProducts();

  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {/* Product Section */}
          {products.length > 0 && (
            <>
              <div className="bg-gray-100">
                <Image
                  src={products[0].image}
                  alt={products[0].name}
                  width={600}
                  height={600}
                  className="w-[500px] h-[500px] mx-auto"
                />
              </div>

              {/* Text Section */}
              <div className="self-start mt-6">
                <h1 className="font-clash text-4xl font-medium mb-2">
                  {products[0].name}
                </h1>
                <p className="text-2xl font-medium mb-6">
                  £{products[0].price}
                </p>
                <div className="mb-6">
                  <h2 className="font-medium mb-2">Description</h2>
                  <p className="text-gray-600">{products[0].description}</p>
                </div>
                <ul className="list-disc list-inside mb-6 text-gray-600">
                  {products[0].features.map((feature, index) => (
                    <li key={index}>{feature}</li>
                  ))}
                </ul>
                <div className="mb-6">
                  <h2 className="font-medium mb-2">Dimensions</h2>
                  <div className="grid grid-cols-3 gap-4 text-gray-600">
                    <div>
                      <p className="font-medium">Height</p>
                      <p>{products[0].dimensions.height}</p>
                    </div>
                    <div>
                      <p className="font-medium">Width</p>
                      <p>{products[0].dimensions.width}</p>
                    </div>
                    <div>
                      <p className="font-medium">Depth</p>
                      <p>{products[0].dimensions.depth}</p>
                    </div>
                  </div>
                </div>
                <Button className="w-auto bg-[#2A254B] hover:bg-[#2A254B]/90 text-white">
                  Add to cart
                </Button>
              </div>
            </>
          )}
        </div>

        <div>
          <h2 className="font-clash text-2xl font-medium mb-6">
            You might also like
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
  {products.slice(1).map((product) => (
    <div key={product._id} className="group">
      <div className="mb-4 w-[300px] h-[300px] mx-auto bg-gray-100 overflow-hidden">
        <Image
          src={product.image}
          alt={product.name}
          width={300}
          height={300}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>
      <h3 className="font-medium mb-1 text-center">{product.name}</h3>
      <p className="text-gray-600 text-center">£{product.price}</p>
    </div>
  ))}
</div>

        </div>
        <div className="text-center mt-12">
          <Button variant="outline" className="font-clash">
            View collection
          </Button>
        </div>
      </div>
      <News />
      <Footer />
    </>
  );
}
