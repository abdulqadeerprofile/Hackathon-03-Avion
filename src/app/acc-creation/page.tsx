'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signUpWithEmail, signInWithEmail, signInWithGoogle } from "../../../firebase/auth";

export default function Auth() {
  const [displayName, setName] = useState("")
  const [address, setAddress] = useState("")
  const [username, setUsername] = useState("")
  const [phone, setPhone] = useState("")
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showSignUp, setShowSignUp] = useState(false);
  const router = useRouter();

  const handleAuth = async (action: "signUp" | "signIn") => {
    setIsLoading(true);
    setError("");
    try {
      const user =
        action === "signUp"
          ? await signUpWithEmail(displayName, address, username, phone, email, password)
          : await signInWithEmail(email, password);
      console.log(`${action === "signUp" ? "Signed up" : "Signed in"}:`, user);
      closeSignUpModal()
      
      // Only navigate to the homepage after successful sign-in
      if (action === "signIn") {
        router.push("/"); // Navigate to localhost:3000 after sign-in
      }
    } catch (error: any) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setError("");
    try {
      const user = await signInWithGoogle();
      console.log("Google Sign-In:", user);
      router.push("/");
    } catch (error: any) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const closeSignUpModal = () => {
    setShowSignUp(false);
    setEmail("");
    setPassword("");
  };

  return (
    <div className={`font-clash min-h-screen bg-white flex items-center justify-center p-4`}>
      <div className="w-full max-w-md">
        <h1 className="text-4xl font-bold text-primary mb-8 text-center">Authentication</h1>
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
              Not have an Account?{" "}
              <button
                className="text-primary underline"
                onClick={() => setShowSignUp(true)}
              >
                Sign Up
              </button>
            </p>
          </div>
        </div>
        <div className="bg-white shadow-md rounded-lg p-8">
          <h2 className="text-2xl font-medium text-primary mb-6">Google Sign-In</h2>
          <button
            onClick={handleGoogleSignIn}
            className="w-full bg-primary text-white py-2 rounded-md hover:bg-opacity-90 transition duration-200"
            disabled={isLoading}
          >
            Sign in with Google
          </button>
        </div>
        {error && <p className="mt-4 text-red-500 text-center">{error}</p>}
        {isLoading && <p className="mt-4 text-primary text-center">Loading...</p>}
      </div>

      {/* Sign-Up Modal */}
      {showSignUp && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-8 w-full max-w-md shadow-lg">
            <h2 className="text-2xl font-medium text-primary mb-6 text-center">
              Create an Account
            </h2>
            <input
              type="name"
              placeholder="Name"
              value={displayName}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 mb-4 text-primary border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <input
              type="address"
              placeholder="address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full px-3 py-2 mb-4 text-primary border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <input
              type="username"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-3 py-2 mb-4 text-primary border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <input
              type="phone"
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
            {error && <p className="mt-4 text-red-500 text-center">{error}</p>}
          </div>
        </div>
      )}
    </div>
  );
}
