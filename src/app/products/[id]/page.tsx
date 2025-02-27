"use client"
import { useEffect, useState } from "react"
import { Toaster, toast } from "react-hot-toast"
import sanityClient from "@sanity/client"
import { Navbar } from "@/components/Navbar"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import Footer from "@/components/footer"
import News from "@/components/newsletter-section"
import Link from "next/link"
import { auth } from "../../../../firebase/firebase"
import type { User } from "firebase/auth"
import { RatingsAndReviews } from "@/components/RatingsAndReviews"

// Sanity client initialization
const sanity = sanityClient({
  projectId: "ah48gcwm",
  dataset: "production",
  apiVersion: "2024-01-04",
  useCdn: true,
})

// Type definitions for the product and dimensions
interface Dimensions {
  width: string
  height: string
  depth: string
}

interface CategoryReference {
  _ref: string
  _type: string
}

interface Products {
  name: string
  description: string
  image: string
  _id: string
  features: string[]
  dimensions: Dimensions
  category: CategoryReference
  price: number
  tags: string[]
  quantity: number
}

// Fetch product by ID function
async function fetchProductById(id: string) {
  const product = await sanity.fetch(
    `
    *[_type == "product" && _id == $id][0] {
      _id,
      name,
      "image": image.asset->url,
      price,
      description,
      features,
      dimensions,
      category,
      tags,
      quantity
    }
    `,
    { id },
  )
  return product
}

// Fetch related products based on category
async function fetchRelatedProducts(categoryId: string, currentProductId: string) {
  const relatedProducts = await sanity.fetch(
    `
    *[_type == "product" && category._ref == $categoryId && _id != $currentProductId][0...4] {
      _id,
      name,
      "image": image.asset->url,
      price,
      quantity
    }
    `,
    { categoryId, currentProductId },
  )
  return relatedProducts
}

export default function ProductDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const [product, setProduct] = useState<Products | null>(null)
  const [relatedProducts, setRelatedProducts] = useState<Products[]>([])
  const [id, setId] = useState<string | null>(null)
  const [isModalOpen, setModalOpen] = useState(false)
  const [user, setUser] = useState<User | null>(null)

  // Fetch product ID from URL params
  useEffect(() => {
    const getId = async () => {
      const resolvedParams = await params
      setId(resolvedParams.id)
    }
    getId()
  }, [params])

  // Fetch product and related products
  useEffect(() => {
    if (id) {
      const fetchProduct = async () => {
        const fetchedProduct = await fetchProductById(id)
        setProduct(fetchedProduct)
        if (fetchedProduct) {
          const relatedProducts = await fetchRelatedProducts(fetchedProduct.category._ref, fetchedProduct._id)
          setRelatedProducts(relatedProducts)
        }
      }
      fetchProduct()
    }
  }, [id])

  // Listen to user authentication state change
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser) // Set the user state based on auth status
    })

    return () => unsubscribe() // Cleanup listener
  }, [])

  // Handle adding to cart
  const addToCart = (product: Products) => {
    if (!user) {
      setModalOpen(true) // Show modal for unauthenticated users
      return
    }

    // Retrieve the cart for the current user from localStorage
    const cart = JSON.parse(localStorage.getItem(user.uid + "_cart") || "[]")

    // Check if the product is already in the cart
    const existingProductIndex = cart.findIndex((item: Products) => item._id === product._id)

    if (existingProductIndex > -1) {
      // Update the quantity of the existing product
      cart[existingProductIndex].quantity += 1

      toast.success(`Increased quantity of ${product.name} to ${cart[existingProductIndex].quantity}`, {
        position: "bottom-right",
      })
    } else {
      // Add the product to the cart with quantity set to 1
      cart.push({ ...product, quantity: 1 })

      toast.success(`${product.name} added to cart!`, {
        position: "bottom-right",
      })
    }

    // Save the updated cart to localStorage
    localStorage.setItem(user.uid + "_cart", JSON.stringify(cart))
  }

  if (!product) return <div>Loading...</div>

  return (
    <>
      <Toaster />
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <div className="bg-gray-100">
            <Image
              src={product.image || "/placeholder.svg"}
              alt={product.name}
              width={600}
              height={600}
              className="w-[500px] h-[500px] mx-auto"
            />
          </div>

          <div className="self-start mt-6">
            <h1 className="font-clash text-4xl font-medium mb-2">{product.name}</h1>
            <p className="text-2xl font-medium mb-6 font-clash">£{product.price}</p>
            <div className="mb-6">
              <h2 className="font-medium mb-2 font-clash">Description</h2>
              <p className="text-gray-600 font-clash">{product.description}</p>
            </div>
            <ul className="list-disc list-inside mb-6 text-gray-600 font-clash">
              {product.features.map((feature, index) => (
                <li key={index}>{feature}</li>
              ))}
            </ul>
            <div className="mb-6">
              <h2 className="font-medium mb-2 font-clash">Dimensions</h2>
              <div className="grid grid-cols-3 gap-4 text-gray-600 font-clash">
                <div>
                  <p className="font-medium font-clash">Height</p>
                  <p>{product.dimensions.height}</p>
                </div>
                <div>
                  <p className="font-medium font-clash">Width</p>
                  <p>{product.dimensions.width}</p>
                </div>
                <div>
                  <p className="font-medium font-clash">Depth</p>
                  <p>{product.dimensions.depth}</p>
                </div>
              </div>
            </div>
            <Button
              onClick={() => addToCart(product)}
              className="w-auto bg-[#2A254B] hover:bg-[#2A254B]/90 text-white font-clash"
            >
              Add to cart
            </Button>
          </div>
        </div>

        {product && <RatingsAndReviews productId={product._id} />}

        {relatedProducts.length > 0 && (
          <div className="mt-16">
            <h2 className="font-clash text-3xl font-medium mb-8 text-center">Related Products</h2>
            <div className="flex justify-center">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 justify-self-center">
                {relatedProducts.map((relatedProduct) => (
                  <div key={relatedProduct._id}>
                    <div className="border-0 shadow-none group">
                      <div className="aspect-square relative overflow-hidden mb-3">
                        <Image
                          src={relatedProduct.image || "/placeholder.svg"}
                          alt={relatedProduct.name}
                          width={300}
                          height={300}
                          className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
                        />
                      </div>
                      <h3 className="font-clash text-xl font-extrabold text-gray-900">{relatedProduct.name}</h3>
                      <p className="text-sm font-clash text-gray-500">£{relatedProduct.price}</p>
                      <p className="text-sm font-clash text-gray-500">{relatedProduct.quantity} Pieces</p>
                      <Link href={`/products/${relatedProduct._id}`}>
                        <Button className="w-full transition-transform duration-200 hover:scale-105 active:scale-95">
                          View Details
                        </Button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
      <News />
      <Footer />

      {!user && isModalOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
          onClick={() => setModalOpen(false)}
        >
          <div className="bg-white p-6 w-4/5 max-w-xl relative z-60" onClick={(e) => e.stopPropagation()}>
            <button
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
              onClick={() => setModalOpen(false)}
            >
              &times;
            </button>
            <div className="text-center">
              <p className="text-gray-500 mb-4 font-clash">
                Please <strong>Sign In</strong> or <strong>Sign Up</strong> to add this item to your cart.
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
  )
}

