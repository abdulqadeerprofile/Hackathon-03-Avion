import { useState } from "react"
import Image from "next/image"
import { Category, Dimensions, Product } from "./types"

interface ProductDialogProps {
  isOpen: boolean
  onClose: () => void
  onSave: (product: any) => Promise<void>
  product: Partial<Product>
  categories: Category[]
  handleImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  mode: "edit" | "add"
}

export function ProductDialog({
  isOpen,
  onClose,
  onSave,
  product,
  categories,
  handleImageChange,
  mode,
}: ProductDialogProps) {
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
              <textarea
                value={editedProduct.description}
                onChange={(e) => setEditedProduct({ ...editedProduct, description: e.target.value })}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Description"
                rows={4}
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
