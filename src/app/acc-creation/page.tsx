"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { signUpWithEmail, signInWithEmail, getUserType } from "../../../firebase/auth"
import { auth } from "../../../firebase/firebase"

export default function Auth() {
  const [displayName, setName] = useState("")
  const [address, setAddress] = useState("")
  const [username, setUsername] = useState("")
  const [phone, setPhone] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [showSignUp, setShowSignUp] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        const currentUserType = await getUserType(user)
      }
    })

    return () => unsubscribe()
  }, [])

  const handleAuth = async (action: "signUp" | "signIn") => {
    setIsLoading(true)
    setError("")
    try {
      const user =
        action === "signUp"
          ? await signUpWithEmail(displayName, address, username, phone, email, password, "buyer")
          : await signInWithEmail(email, password)

      const currentUserType = await getUserType(user)

      console.log(`${action === "signUp" ? "Signed up" : "Signed in"}:`, user)

      if (currentUserType === "buyer") {
        router.push("/")
      } else if (currentUserType === "admin") {
        router.push("/admin-dashboard")
      } else if (currentUserType === "manager") {
        router.push("/manager-dashboard")
      }
    } catch (error: any) {
      setError(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  const closeSignUpModal = () => {
    setShowSignUp(false)
    setEmail("")
    setPassword("")
  }

  return (
    <div className="font-clash min-h-screen bg-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <h1 className="text-4xl font-bold text-primary mb-8 text-center">Sign In</h1>

        <div className="bg-white shadow-md rounded-lg p-8 mb-4">
          <h2 className="text-2xl font-medium text-primary mb-6">Email/Password</h2>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 mb-4 text-primary border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 mb-6 text-primary border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <div className="flex flex-col items-center">
            <button
              onClick={() => handleAuth("signIn")}
              className="w-full bg-primary text-white py-2 rounded-md hover:bg-opacity-90 transition duration-200 mb-4"
              disabled={isLoading}
            >
              Sign In
            </button>
            <p className="text-sm text-gray-600">
              Don't have an Account?{" "}
              <button className="text-primary underline" onClick={() => setShowSignUp(true)}>
                Sign Up
              </button>
            </p>
          </div>
        </div>
        {error && <p className="mt-4 text-red-500 text-center">{error}</p>}
        {isLoading && <p className="mt-4 text-primary text-center">Loading...</p>}
      </div>

      {/* Sign-Up Modal */}
      {showSignUp && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-8 w-full max-w-md shadow-lg">
            <h2 className="text-2xl font-medium text-primary mb-6 text-center">Create an Account</h2>
            <input
              type="text"
              placeholder="Name"
              value={displayName}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 mb-4 text-primary border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <input
              type="text"
              placeholder="Address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full px-3 py-2 mb-4 text-primary border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-3 py-2 mb-4 text-primary border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <input
              type="tel"
              placeholder="Phone Number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-3 py-2 mb-4 text-primary border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 mb-4 text-primary border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 mb-6 text-primary border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <div className="flex space-x-4">
              <button
                onClick={() => handleAuth("signUp")}
                className="flex-1 bg-primary text-white py-2 rounded-md hover:bg-opacity-90 transition duration-200"
                disabled={isLoading}
              >
                Sign Up
              </button>
              <button
                onClick={closeSignUpModal}
                className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-md hover:bg-gray-300 transition duration-200"
                disabled={isLoading}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

