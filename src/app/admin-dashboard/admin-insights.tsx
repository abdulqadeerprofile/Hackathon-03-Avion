"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Bar } from "react-chartjs-2"
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js"

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

interface Review {
  rating: number
  comment: string
  date: string
  userId: string
  userName: string
  userEmail: string
}

interface Product {
  _id: string
  name: string
  price: number
  quantity: number
}

interface Order extends Product {
  date: string
}

export function AdminInsights() {
  const [reviews, setReviews] = useState<{ [key: string]: Review[] }>({})
  const [orders, setOrders] = useState<Order[]>([])
  const [cartItems, setCartItems] = useState<Product[]>([])

  useEffect(() => {
    // Fetch reviews for all products
    const allReviews: { [key: string]: Review[] } = {}
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key && key.startsWith("reviews_")) {
        const productId = key.split("_")[1]
        allReviews[productId] = JSON.parse(localStorage.getItem(key) || "[]")
      }
    }
    setReviews(allReviews)

    // Fetch orders
    const allOrders: Order[] = []
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key && key.endsWith("_orders")) {
        const userOrders: Order[] = JSON.parse(localStorage.getItem(key) || "[]")
        allOrders.push(...userOrders)
      }
    }
    setOrders(allOrders)

    // Fetch cart items
    const allCartItems: Product[] = []
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key && key.endsWith("_cart")) {
        const userCart: Product[] = JSON.parse(localStorage.getItem(key) || "[]")
        allCartItems.push(...userCart)
      }
    }
    setCartItems(allCartItems)
  }, [])

  const totalReviews = Object.values(reviews).flat().length
  const averageRating =
    Object.values(reviews)
      .flat()
      .reduce((sum, review) => sum + review.rating, 0) / totalReviews || 0
  const totalOrders = orders.length
  const totalRevenue = orders.reduce((sum, order) => sum + order.price * order.quantity, 0)
  const totalCartItems = cartItems.length

  const productPerformance = Object.entries(reviews).map(([productId, productReviews]) => {
    const productOrders = orders.filter((order) => order._id === productId)
    const productCartItems = cartItems.filter((item) => item._id === productId)
    return {
      productId,
      reviews: productReviews.length,
      averageRating: productReviews.reduce((sum, review) => sum + review.rating, 0) / productReviews.length || 0,
      orders: productOrders.length,
      cartAdditions: productCartItems.length,
    }
  })

  // Log the productPerformance data for debugging
  console.log("Product Performance:", productPerformance)

  const chartData = {
    labels: productPerformance.map((p) => p.productId), // Ensure all products are listed here
    datasets: [
      {
        label: "Reviews",
        data: productPerformance.map((p) => p.reviews),
        backgroundColor: "rgba(255, 99, 132, 0.5)",
      },
      {
        label: "Orders",
        data: productPerformance.map((p) => p.orders),
        backgroundColor: "rgba(53, 162, 235, 0.5)",
      },
      {
        label: "Cart Additions",
        data: productPerformance.map((p) => p.cartAdditions),
        backgroundColor: "rgba(75, 192, 192, 0.5)",
      },
    ],
  }

  // Log the final chartData for debugging
  console.log("Chart Data:", chartData)

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: "Product Performance",
      },
    },
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold font-clash">Insights</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="font-clash">Total Reviews</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold font-clash">{totalReviews}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="font-clash">Average Rating</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold font-clash">{averageRating.toFixed(1)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="font-clash">Total Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold font-clash">{totalOrders}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="font-clash">Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold font-clash">£{totalRevenue.toFixed(2)}</p>
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="font-clash">Products Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <Bar options={chartOptions} data={chartData} />
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="font-clash">Cart Items</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-xl font-bold font-clash">Total Items in Carts: {totalCartItems}</p>
        </CardContent>
      </Card>
    </div>
  )
}