"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { signInWithEmail, getUserType } from "../../../firebase/auth"
import { auth } from "../../../firebase/firebase"
import type React from "react" // Added import for React

export default function Auth() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [userType, setUserType] = useState("buyer") // Default to buyer
  const router = useRouter()

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSignIn()
    }
  }

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        const currentUserType = getUserType(user)
      }
    })
    return () => unsubscribe()
  }, [])

  const handleSignIn = async () => {
    setIsLoading(true);
    setError("");
  
    try {
      if (userType === "admin") {
        if (email === "admin@avion.com" && password === "admin552922") {
          console.log("Admin signed in");
          localStorage.setItem("userType", "admin"); // Store user type
          router.push("/admin-dashboard");
        } else {
          throw new Error("Invalid admin credentials");
        }
      } else {
        const user = await signInWithEmail(email, password);
        const currentUserType = getUserType(user);
  
        if (currentUserType !== "buyer") {
          throw new Error(
            `This account is registered as a ${currentUserType}. Please use the correct login type.`
          );
        }
  
        console.log("Buyer signed in:", user);
        localStorage.setItem("userType", "buyer"); // Store user type
        router.push("/");
      }
    } catch (error: any) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };  

  return (
    <div className="font-clash min-h-screen bg-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <h1 className="text-4xl font-bold text-primary mb-8 text-center">
          {userType === "buyer" ? "Buyer" : "Admin"} Authentication
        </h1>

        <div className="flex justify-center mb-6">
          <div className="bg-gray-100 p-1 rounded-lg">
            <button
              className={`px-4 py-2 rounded-md ${userType === "buyer" ? "bg-primary text-white" : "text-gray-600"}`}
              onClick={() => setUserType("buyer")}
            >
              Buyer
            </button>
            <button
              className={`px-4 py-2 rounded-md ${userType === "admin" ? "bg-primary text-white" : "text-gray-600"}`}
              onClick={() => setUserType("admin")}
            >
              Admin
            </button>
          </div>
        </div>

        <div className="bg-white shadow-md rounded-lg p-8 mb-4">
          <h2 className="text-2xl font-medium text-primary mb-6">Email/Password</h2>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyPress={handleKeyPress}
            className="w-full px-3 py-2 mb-4 text-primary border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyPress={handleKeyPress}
            className="w-full px-3 py-2 mb-6 text-primary border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <div className="flex flex-col items-center">
            <button
              onClick={handleSignIn}
              className="w-full bg-primary text-white py-2 rounded-md hover:bg-opacity-90 transition duration-200 mb-4"
              disabled={isLoading}
            >
              Sign In as {userType === "buyer" ? "Buyer" : "Admin"}
            </button>
            {userType === "buyer" && (
              <p className="text-sm text-gray-600">
                Don't have an Account?{" "}
                <a href="/signup" className="text-primary underline">
                  Sign Up
                </a>
              </p>
            )}
          </div>
        </div>
        {error && <p className="mt-4 text-red-500 text-center">{error}</p>}
        {isLoading && <p className="mt-4 text-primary text-center">Loading...</p>}
      </div>
    </div>
  )
}

