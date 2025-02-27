"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import sanityClient from "@sanity/client"
import { Button } from "@/components/ui/button"
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer"
import { getUserType } from "../../../firebase/auth"
import { auth } from "../../../firebase/firebase"
import ProductAnalytics from "./product-analytics"

interface Category {
  _id: string
  name: string
  slug: string
}

interface Dimensions {
  width: string
  height: string
  depth: string
}

interface Product {
  name: string
  description: string
  image: string
  _id: string
  features: string[]
  dimensions: Dimensions
  category: {
    _id: string
    name: string
    slug: string
  }
  price: number
  tags: string[]
  quantity: number
}

const sanity = sanityClient({
  projectId: "ah48gcwm",
  dataset: "production",
  apiVersion: "2024-01-04",
  useCdn: false,
  token:
    "skV4yXuqML3UXWhaMgP3OAcyGBTAoVuhpBLb7gtM9jbM6pBtlxFLmFl2oY1w9DaWCvdMcMr6dkpBzsOgAsnSMtbD5tscR0cU4Tis5Rhbvl3hYXZKVkMGlgiZ3Hvg4ZGCaZogaD3kiTaKn8G7HgogFJssJ6ammRzIbr3mjuXZrnSwCM33vmmJ",
})

export default function ManagerDashboard() {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState<boolean>(false)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState<boolean>(false)
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [selectedProductForAnalytics, setSelectedProductForAnalytics] = useState<Product | null>(null)
  const router = useRouter()

  useEffect(() => {
    const checkAuthorization = async () => {
      const userType = await getUserType(auth.currentUser)
      if (userType !== "manager" && userType !== "admin") {
        setIsAuthorized(false)
        if (userType === "buyer") {
          // If the user is a buyer, show the message
          return
        } else {
          // If the user is not logged in or not a manager/admin, redirect to home
          router.push("/")
        }
      } else {
        setIsAuthorized(true)
      }
    }

    checkAuthorization()
  }, [router])

  const fetchData = useCallback(async () => {
    try {
      const fetchedCategories = await sanity.fetch(`*[_type == "category"]{_id, name, slug}`)
      setCategories(fetchedCategories)

      const fetchedProducts = await sanity.fetch(
        `*[_type == "product"]{
          _id, name, "image": image.asset->url, price, features,
          dimensions, category->, tags, quantity
        }`,
      )
      setProducts(fetchedProducts)
    } catch (error) {
      console.error("Error fetching data:", error)
    }
  }, [])

  useEffect(() => {
    if (isAuthorized) {
      fetchData()
    }
  }, [fetchData, isAuthorized])

  const handleDelete = async (productId: string): Promise<void> => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await sanity.delete(productId)
        setProducts(products.filter((p) => p._id !== productId))
      } catch (error) {
        console.error("Error deleting product:", error)
      }
    }
  }

  const handleEdit = (product: Product): void => {
    setSelectedProduct(product)
    setIsEditDialogOpen(true)
  }

  const handleSave = async (updatedProduct: Product): Promise<void> => {
    try {
      let imageAsset
      if (imageFile) {
        imageAsset = await sanity.assets.upload("image", imageFile)
      }

      const updatedFields = {
        ...updatedProduct,
        category: {
          _type: "reference",
          _ref: updatedProduct.category._id,
        },
        ...(imageAsset && { image: { _type: "image", asset: { _type: "reference", _ref: imageAsset._id } } }),
      }

      await sanity.patch(updatedProduct._id).set(updatedFields).commit()
      await fetchData() // Refetch data to get updated products
      setIsEditDialogOpen(false)
      setImageFile(null)
    } catch (error) {
      console.error("Error updating product:", error)
    }
  }

  const handleAdd = async (newProduct: Omit<Product, "_id">): Promise<void> => {
    try {
      let imageAsset
      if (imageFile) {
        imageAsset = await sanity.assets.upload("image", imageFile)
      }

      const productToCreate = {
        _type: "product",
        ...newProduct,
        category: {
          _type: "reference",
          _ref: newProduct.category._id,
        },
        ...(imageAsset && { image: { _type: "image", asset: { _type: "reference", _ref: imageAsset._id } } }),
      }

      await sanity.create(productToCreate)
      await fetchData() // Refetch data to get updated products
      setIsAddDialogOpen(false)
      setImageFile(null)
    } catch (error) {
      console.error("Error adding product:", error)
    }
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0])
    }
  }

  if (isAuthorized === null)
    return <div className="flex justify-center items-center h-screen">Checking authorization...</div>
  if (!isAuthorized)
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-xl text-gray-700">Sign in as manager to see this information</p>
      </div>
    )

  return (
    <div className="min-h-screen bg-gray-100 font-clash">
      <nav className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <h1 className="text-2xl font-bold text-gray-800">Manager Dashboard</h1>
              </div>
            </div>
            <div className="flex items-center">
              <button
                onClick={() => router.push("/")}
                className="ml-4 px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
              >
                Back to Home
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8 font-clash">
        <div className="px-4 py-6 sm:px-0">
          <div className="mt-8 mb-4">
            <button
              onClick={() => setIsAddDialogOpen(true)}
              className="px-4 py-2 font-medium text-white bg-green-600 rounded-md hover:bg-green-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              Add New Product
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Product
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Category
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Price
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Quantity
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {products.map((product) => (
                  <tr key={product._id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <Image
                            className="h-10 w-10 rounded-full object-cover"
                            src={product.image || "/placeholder.svg"}
                            alt=""
                            width={40}
                            height={40}
                          />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{product.name}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{product.category?.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">£{product.price}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{product.quantity}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleEdit(product)}
                        className="text-indigo-600 hover:text-indigo-900 mr-4"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(product._id)}
                        className="text-red-600 hover:text-red-900 mr-4"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {isEditDialogOpen && selectedProduct && (
        <ProductDialog
          isOpen={isEditDialogOpen}
          onClose={() => setIsEditDialogOpen(false)}
          onSave={handleSave}
          product={selectedProduct}
          categories={categories}
          handleImageChange={handleImageChange}
          mode="edit"
        />
      )}

      {isAddDialogOpen && (
        <ProductDialog
          isOpen={isAddDialogOpen}
          onClose={() => setIsAddDialogOpen(false)}
          onSave={handleAdd}
          product={{
            name: "",
            description: "",
            image: "",
            features: [],
            dimensions: { width: "", height: "", depth: "" },
            category: { _id: "", name: "", slug: "" },
            price: 0,
            tags: [],
            quantity: 0,
          }}
          categories={categories}
          handleImageChange={handleImageChange}
          mode="add"
        />
      )}
    </div>
  )
}

interface ProductDialogProps {
  isOpen: boolean
  onClose: () => void
  onSave: (product: any) => Promise<void>
  product: Partial<Product>
  categories: Category[]
  handleImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  mode: "edit" | "add"
}

function ProductDialog({ isOpen, onClose, onSave, product, categories, handleImageChange, mode }: ProductDialogProps) {
  const [editedProduct, setEditedProduct] = useState({
    ...product,
    description:
      product.description ||
      "A timeless design, with premium materials features as one of our most popular and iconic pieces. The dandy chair is perfect for any stylish living space with beech legs and lambskin leather upholstery.",
    dimensions: {
      width: product.dimensions?.width || "",
      height: product.dimensions?.height || "",
      depth: product.dimensions?.depth || "",
    },
  })

  if (!isOpen) return null

  return (
    <div className="fixed z-10 inset-0 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>
        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
          &#8203;
        </span>
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
              {mode === "edit" ? "Edit Product" : "Add New Product"}
            </h3>
            <div className="mt-2 space-y-4">
              <input
                type="text"
                value={editedProduct.name}
                onChange={(e) => setEditedProduct({ ...editedProduct, name: e.target.value })}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Product Name"
              />
              <input
                type="number"
                value={editedProduct.price}
                onChange={(e) => setEditedProduct({ ...editedProduct, price: Number(e.target.value) })}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Price"
              />
              <input
                type="number"
                value={editedProduct.quantity}
                onChange={(e) => setEditedProduct({ ...editedProduct, quantity: Number(e.target.value) })}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Quantity"
              />
              <input
                type="text"
                value={editedProduct.description}
                onChange={(e) => setEditedProduct({ ...editedProduct, description: e.target.value })}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Description"
              />
              <input
                type="text"
                value={editedProduct.dimensions?.width || ""}
                onChange={(e) =>
                  setEditedProduct({
                    ...editedProduct,
                    dimensions: { ...editedProduct.dimensions, width: e.target.value },
                  })
                }
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Width"
              />
              <input
                type="text"
                value={editedProduct.dimensions?.height || ""}
                onChange={(e) =>
                  setEditedProduct({
                    ...editedProduct,
                    dimensions: { ...editedProduct.dimensions, height: e.target.value },
                  })
                }
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Height"
              />
              <input
                type="text"
                value={editedProduct.dimensions?.depth || ""}
                onChange={(e) =>
                  setEditedProduct({
                    ...editedProduct,
                    dimensions: { ...editedProduct.dimensions, depth: e.target.value },
                  })
                }
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Depth"
              />
              <select
                value={editedProduct.category?._id || ""}
                onChange={(e) => {
                  const selectedCategory = categories.find((c) => c._id === e.target.value)
                  setEditedProduct({
                    ...editedProduct,
                    category: selectedCategory || editedProduct.category,
                  })
                }}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              >
                <option value="">Select a category</option>
                {categories.map((category) => (
                  <option key={category._id} value={category._id}>
                    {category.name}
                  </option>
                ))}
              </select>
              <div>
                <label htmlFor="image-upload" className="block text-sm font-medium text-gray-700">
                  Product Image
                </label>
                <input
                  id="image-upload"
                  name="image-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
              {editedProduct.image && (
                <div className="mt-2">
                  <Image
                    src={editedProduct.image || "/placeholder.svg"}
                    alt="Current product image"
                    width={100}
                    height={100}
                    className="object-cover rounded-md"
                  />
                </div>
              )}
            </div>
          </div>
          <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              type="button"
              className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm"
              onClick={() => onSave(editedProduct)}
            >
              {mode === "edit" ? "Save" : "Add"}
            </button>
            <button
              type="button"
              className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
              onClick={onClose}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

