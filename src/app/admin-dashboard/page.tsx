"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import sanityClient from "@sanity/client";
import { AdminInsights } from "./admin-insights";
import ProductAnalytics from "./product-analytics";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { getUserType, signUpWithEmail } from "../../../firebase/auth";
import { auth } from "../../../firebase/firebase";
import {
  getFirestore,
  collection,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  query,
  where,
} from "firebase/firestore";
import { updateProfile } from "firebase/auth";
import { ProductDialog } from "./product-dialog";
import { UserDialog } from "./user-dialog";
import { updatePassword } from "firebase/auth";

interface Category {
  _id: string;
  name: string;
  slug: string;
}

interface Dimensions {
  width: string;
  height: string;
  depth: string;
}

interface Product {
  name: string;
  description: string;
  image: string;
  _id: string;
  features: string[];
  dimensions: Dimensions;
  category: {
    _id: string;
    name: string;
    slug: string;
  };
  price: number;
  tags: string[];
  quantity: number;
}

interface User {
  uid: string;
  displayName: string;
  email: string;
  userType: string;
  password?: string; // Added password field
}

const sanity = sanityClient({
  projectId: "ah48gcwm",
  dataset: "production",
  apiVersion: "2024-01-04",
  useCdn: false,
  token:
    "skcDgazOaH2vEBorUmcZ5y5WZdPueznbbM1pqNAVdlxhPT8cbvjN1S5m3IVRcbY0vwaax9kg0lIDUcEsumP6r1Wj5A7S4vrt9js8kPiZzyOSycGW25Tw5gMO2bAPaA0UQHq1CL6SxdCzrDQrKZJE8cW5a9ThbaCuBp9QOYbGkSa5tlktcDhg",
});

const db = getFirestore();

export default function AdminDashboard() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState<boolean>(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState<boolean>(false);
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [selectedProductForAnalytics, setSelectedProductForAnalytics] =
    useState<Product | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isUserDialogOpen, setIsUserDialogOpen] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    const checkAuthorization = async () => {
      const user = auth.currentUser;
      if (user) {
        const userType = await getUserType(user);
        if (userType === "admin") {
          setIsAuthorized(true);
          sessionStorage.setItem("isAdmin", "true");
        } else {
          setIsAuthorized(false);
          sessionStorage.removeItem("isAdmin");
          router.push("/");
        }
      } else {
        setIsAuthorized(false);
        sessionStorage.removeItem("isAdmin");
        router.push("/");
      }
    };

    const isAdmin = sessionStorage.getItem("isAdmin");
    if (isAdmin === "true") {
      setIsAuthorized(true);
    } else {
      checkAuthorization();
    }
  }, [router]);

  const fetchData = useCallback(async () => {
    try {
      const fetchedCategories = await sanity.fetch(
        `*[_type == "category"]{_id, name, slug}`
      );
      setCategories(fetchedCategories);

      const fetchedProducts = await sanity.fetch(
        `*[_type == "product"]{
          _id, name, "image": image.asset->url, price, features,
          dimensions, category->, tags, quantity
        }`
      );
      setProducts(fetchedProducts);

      // Fetch users with manager and admin roles
      const usersQuery = query(
        collection(db, "users"),
        where("userType", "==", "manager")
      );
      const userSnapshot = await getDocs(usersQuery);
      const fetchedUsers = userSnapshot.docs.map(
        (doc) => ({ uid: doc.id, ...doc.data() }) as User
      );
      setUsers(fetchedUsers);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }, []);

  useEffect(() => {
    if (isAuthorized) {
      fetchData();
    }
  }, [fetchData, isAuthorized]);

  if (isAuthorized === null)
    return (
      <div className="flex justify-center items-center h-screen">
        Checking authorization...
      </div>
    );
  if (!isAuthorized)
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-xl text-gray-700">
          You are not authorized to view this page.
        </p>
      </div>
    );

  const handleDelete = async (productId: string): Promise<void> => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await sanity.delete(productId);
        setProducts(products.filter((p) => p._id !== productId));
      } catch (error) {
        console.error("Error deleting product:", error);
      }
    }
  };

  const handleEdit = (product: Product): void => {
    setSelectedProduct(product);
    setIsEditDialogOpen(true);
  };

  const handleSave = async (updatedProduct: Product): Promise<void> => {
    try {
      let imageAsset;
      if (imageFile) {
        imageAsset = await sanity.assets.upload("image", imageFile);
      }

      const updatedFields = {
        ...updatedProduct,
        category: {
          _type: "reference",
          _ref: updatedProduct.category._id,
        },
        ...(imageAsset && {
          image: {
            _type: "image",
            asset: { _type: "reference", _ref: imageAsset._id },
          },
        }),
      };

      await sanity.patch(updatedProduct._id).set(updatedFields).commit();
      await fetchData(); // Refetch data to get updated products
      setIsEditDialogOpen(false);
      setImageFile(null);
    } catch (error) {
      console.error("Error updating product:", error);
    }
  };

  const handleAdd = async (newProduct: Omit<Product, "_id">): Promise<void> => {
    try {
      let imageAsset;
      if (imageFile) {
        imageAsset = await sanity.assets.upload("image", imageFile);
      }

      const productToCreate = {
        _type: "product",
        ...newProduct,
        category: {
          _type: "reference",
          _ref: newProduct.category._id,
        },
        ...(imageAsset && {
          image: {
            _type: "image",
            asset: { _type: "reference", _ref: imageAsset._id },
          },
        }),
      };

      await sanity.create(productToCreate);
      await fetchData(); // Refetch data to get updated products
      setIsAddDialogOpen(false);
      setImageFile(null);
    } catch (error) {
      console.error("Error adding product:", error);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleEditUser = (user: User): void => {
    setSelectedUser(user);
    setIsUserDialogOpen(true);
  };

  const handleCloseUserDialog = () => {
    setIsUserDialogOpen(false);
    setSelectedUser(null);
  };

  const handleSaveUser = async (
    updatedUser: Partial<User> & { password?: string }
  ): Promise<void> => {
    try {
      if (updatedUser.uid) {
        const userRef = doc(db, "users", updatedUser.uid);
        const updateData: Partial<User> = {
          displayName: updatedUser.displayName,
          email: updatedUser.email,
        };
        await updateDoc(userRef, updateData);

        if (updatedUser.password) {
          const user = auth.currentUser;
          if (user) {
            await updatePassword(user, updatedUser.password);
          }
        }

        await fetchData(); // Refetch data to get updated users
        setIsUserDialogOpen(false);
      } else {
        console.error("User ID is missing");
      }
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  const handleDeleteUser = async (userId: string): Promise<void> => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await deleteDoc(doc(db, "users", userId));
        setUsers(users.filter((u) => u.uid !== userId));
      } catch (error) {
        console.error("Error deleting user:", error);
      }
    }
  };

  const handleAddUser = async (
    newUser: Partial<User> & { password?: string }
  ): Promise<void> => {
    try {
      if (!newUser.displayName || !newUser.email || !newUser.password) {
        throw new Error("Please fill in all fields");
      }

      // Use the signUpWithEmail function from auth.ts
      const user = await signUpWithEmail(
        newUser.displayName,
        "", // address (not used for managers)
        newUser.email, // using email as username
        "", // phone (not used for managers)
        newUser.email,
        newUser.password,
        "manager"
      );

      if (user) {
        await updateProfile(user, { displayName: newUser.displayName });
      }

      await fetchData(); // Refetch data to get updated users
      setIsUserDialogOpen(false);
    } catch (error) {
      console.error("Error adding user:", error);
      alert(error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 font-clash">
      <nav className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <h1 className="text-2xl font-bold text-gray-800">
                  Admin Dashboard
                </h1>
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
          <AdminInsights />
          <div className="mt-8 mb-4 flex justify-between">
            <button
              onClick={() => setIsAddDialogOpen(true)}
              className="px-4 py-2 font-medium text-white bg-green-600 rounded-md hover:bg-green-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              Add New Product
            </button>
            <button
              onClick={() => setIsUserDialogOpen(true)}
              className="px-4 py-2 font-medium text-white bg-blue-600 rounded-md hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Add New Manager
            </button>
          </div>
          <div className="overflow-x-auto">
            <h2 className="text-2xl font-bold mb-4">Products</h2>
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
                          <div className="text-sm font-medium text-gray-900">
                            {product.name}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {product.category?.name}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        £{product.price}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {product.quantity}
                      </div>
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
                      <Drawer>
                        <DrawerTrigger asChild>
                          <Button
                            onClick={() =>
                              setSelectedProductForAnalytics(product)
                            }
                            variant="outline"
                            size="sm"
                          >
                            Analytics
                          </Button>
                        </DrawerTrigger>
                        <DrawerContent>
                          <DrawerHeader>
                            <DrawerTitle>Product Analytics</DrawerTitle>
                          </DrawerHeader>
                          {selectedProductForAnalytics && (
                            <ProductAnalytics
                              productId={selectedProductForAnalytics._id}
                              productName={selectedProductForAnalytics.name}
                            />
                          )}
                        </DrawerContent>
                      </Drawer>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-8 overflow-x-auto">
            <h2 className="text-2xl font-bold mb-4">Managers</h2>
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Name
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Email
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
                {users.map((user) => (
                  <tr key={user.uid}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {user.displayName}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{user.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleEditUser(user)}
                        className="text-indigo-600 hover:text-indigo-900 mr-4"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteUser(user.uid)}
                        className="text-red-600 hover:text-red-900"
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

      {isUserDialogOpen && (
        <UserDialog
          isOpen={isUserDialogOpen}
          onClose={handleCloseUserDialog} // Use the new close handler
          onSave={selectedUser ? handleSaveUser : handleAddUser}
          user={
            selectedUser || {
              displayName: "",
              email: "",
              userType: "manager",
              password: "",
            }
          }
          mode={selectedUser ? "edit" : "add"}
        />
      )}
    </div>
  );
}
