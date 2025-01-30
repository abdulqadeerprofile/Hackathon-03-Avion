'use client';

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { signUpWithEmail, signInWithEmail, getUserType } from "../../../firebase/auth";
import { auth } from "../../../firebase/firebase";

export default function Auth() {
  const [displayName, setName] = useState("");
  const [address, setAddress] = useState("");
  const [username, setUsername] = useState("");
  const [phone, setPhone] = useState("");
  const [email1, setEmail1] = useState("");
  const [password1, setPassword1] = useState("");
  const [email2, setEmail2] = useState("");
  const [password2, setPassword2] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showSignUp, setShowSignUp] = useState(false);
  const [userType, setUserType] = useState("buyer"); // Default to buyer
  const router = useRouter();

  useEffect(() => {
    // Check if user is already logged in
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        const currentUserType = getUserType(user);
        if (currentUserType) {
          setError(`You are already logged in as a ${currentUserType}. Please log out first.`);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  const handleAuth = async (action: "signUp" | "signIn") => {
    setIsLoading(true);
    setError("");
    try {
      const user = action === "signUp"
        ? await signUpWithEmail(displayName, address, username, phone, email2, password2, userType)
        : await signInWithEmail(email1, password1);

      const currentUserType = getUserType(user);
      
      if (action === "signIn" && currentUserType !== userType) {
        setError(`This account is registered as a ${currentUserType}. Please use the correct login type.`);
        return;
      }

      console.log(`${action === "signUp" ? "Signed up" : "Signed in"}:`, user);
      closeSignUpModal();
      
      if (action === "signIn") {
        router.push("/");
      }
    } catch (error: any) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };
  
  const closeSignUpModal = () => {
    setShowSignUp(false);
    setEmail2("");
    setPassword2("");
  };

  return (
    <div className="font-clash min-h-screen bg-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <h1 className="text-4xl font-bold text-primary mb-8 text-center">
          {userType === "buyer" ? "Buyer" : "Seller"} Authentication
        </h1>
        
        {/* User Type Toggle */}
        <div className="flex justify-center mb-6">
          <div className="bg-gray-100 p-1 rounded-lg">
            <button
              className={`px-4 py-2 rounded-md ${
                userType === "buyer"
                  ? "bg-primary text-white"
                  : "text-gray-600"
              }`}
              onClick={() => setUserType("buyer")}
            >
              Buyer
            </button>
            <button
              className={`px-4 py-2 rounded-md ${
                userType === "seller"
                  ? "bg-primary text-white"
                  : "text-gray-600"
              }`}
              onClick={() => setUserType("seller")}
            >
              Seller
            </button>
          </div>
        </div>

        <div className="bg-white shadow-md rounded-lg p-8 mb-4">
          <h2 className="text-2xl font-medium text-primary mb-6">Email/Password</h2>
          <input
            type="email"
            placeholder="Email"
            value={email1}
            onChange={(e) => setEmail1(e.target.value)}
            className="w-full px-3 py-2 mb-4 text-primary border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <input
            type="password"
            placeholder="Password"
            value={password1}
            onChange={(e) => setPassword1(e.target.value)}
            className="w-full px-3 py-2 mb-6 text-primary border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <div className="flex flex-col items-center">
            <button
              onClick={() => handleAuth("signIn")}
              className="w-full bg-primary text-white py-2 rounded-md hover:bg-opacity-90 transition duration-200 mb-4"
              disabled={isLoading}
            >
              Sign In as {userType === "buyer" ? "Buyer" : "Seller"}
            </button>
            <p className="text-sm text-gray-600">
              Don't have an Account?{" "}
              <button
                className="text-primary underline"
                onClick={() => setShowSignUp(true)}
              >
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
            <h2 className="text-2xl font-medium text-primary mb-6 text-center">
              Create a {userType === "buyer" ? "Buyer" : "Seller"} Account
            </h2>
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
              value={email2}
              onChange={(e) => setEmail2(e.target.value)}
              className="w-full px-3 py-2 mb-4 text-primary border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <input
              type="password"
              placeholder="Password"
              value={password2}
              onChange={(e) => setPassword2(e.target.value)}
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