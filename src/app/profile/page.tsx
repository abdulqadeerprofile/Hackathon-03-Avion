"use client"

import React, { useEffect, useState } from "react"
import { auth } from "../../../firebase/firebase" // Replace with your auth setup
import { Navbar } from "@/components/Navbar"
import NewsletterSection from "@/components/newsletter-section"
import Footer from "@/components/footer"

interface Order {
  _id: string
  name: string
  price: number
  quantity: number
  date: string
}

export default function ProfilePage() {
  const [userOrders, setUserOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchUserOrders = () => {
      const user = auth.currentUser
      if (!user) return

      // Get user orders from localStorage
      const userOrdersKey = `${user.uid}_orders`
      const storedOrders = JSON.parse(localStorage.getItem(userOrdersKey) || "[]")
      setUserOrders(storedOrders)
      setLoading(false)
    }

    fetchUserOrders()
  }, [])

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-primary text-xl">Loading...</p>
      </div>
    )
  }

  const user = auth.currentUser
  if (!user) return <p className="text-primary text-xl text-center mt-8">No user found</p>

  const totalOrders = userOrders.length
  const totalSpent = userOrders.reduce((sum, order) => sum + order.price * order.quantity, 0)

  return (
    <>
    <Navbar/>
    <div className={`font-clash min-h-screen bg-white text-primary p-4 md:p-8`}>
      <h1 className="text-3xl md:text-4xl font-bold mb-6 md:mb-8 text-center">Profile</h1>

      <div className="max-w-4xl mx-auto space-y-6 md:space-y-8">
        <div className="bg-gray-100 rounded-lg p-4 md:p-6 shadow-md">
          <h2 className="text-xl md:text-2xl font-semibold mb-4">User Information</h2>
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 md:w-24 md:h-24 bg-primary text-white rounded-full flex items-center justify-center text-2xl md:text-4xl font-bold">
              {user.displayName ? user.displayName[0].toUpperCase() : "U"}
            </div>
            <div>
              <p className="font-semibold text-lg md:text-xl">{user.displayName}</p>
              <p className="text-sm md:text-base text-gray-600">{user.email}</p>
            </div>
          </div>
        </div>

        <div className="bg-gray-100 rounded-lg p-4 md:p-6 shadow-md">
          <h2 className="text-xl md:text-2xl font-semibold mb-4">Order Summary</h2>
          <div className="flex justify-between items-center mb-2">
            <p className="font-semibold">Total Orders:</p>
            <p className="text-xl md:text-2xl font-bold">{totalOrders}</p>
          </div>
          <div className="flex justify-between items-center">
            <p className="font-semibold">Total Spent:</p>
            <p className="text-xl md:text-2xl font-bold">${totalSpent.toFixed(2)}</p>
          </div>
        </div>

        <div className="bg-gray-100 rounded-lg p-4 md:p-6 shadow-md">
          <h2 className="text-xl md:text-2xl font-semibold mb-4">Order History</h2>
          {userOrders.length === 0 ? (
            <p className="text-center text-gray-600">No orders yet</p>
          ) : (
            <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
              {userOrders.map((order) => (
                <div key={order._id} className="bg-white p-4 rounded-lg shadow">
                  <div className="flex justify-between items-center mb-2">
                    <p className="font-semibold text-lg">{order.name}</p>
                    <p className="text-sm text-gray-600">{new Date(order.date).toLocaleDateString()}</p>
                  </div>
                  <div className="flex justify-between items-center">
                    <p>Quantity: {order.quantity}</p>
                    <p className="font-semibold">${(order.price * order.quantity).toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
    <NewsletterSection/>
    <Footer/>
    </>
  )
}

