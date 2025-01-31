"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, ArcElement, Title, Tooltip, Legend } from "chart.js";

// Register the necessary Chart.js components
ChartJS.register(CategoryScale, LinearScale, ArcElement, Title, Tooltip, Legend);

// Types for reviews, orders, and cart items
interface Review {
  rating: number;
  comment: string;
  date: string;
  userId: string;
  userName: string;
  userEmail: string;
}

interface Product {
  _id: string;
  name: string;
  price: number;
  quantity: number;
}

interface Order extends Product {
  date: string;
}

const ProductAnalytics = ({ productId, productName }: { productId: string, productName: string }) => {
  const [reviews, setReviews] = useState<{ [key: string]: Review[] }>({});
  const [orders, setOrders] = useState<Order[]>([]);
  const [cartItems, setCartItems] = useState<Product[]>([]);

  useEffect(() => {
    // Fetch reviews from localStorage
    const allReviews: { [key: string]: Review[] } = {};
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith("reviews_")) {
        const productId = key.split("_")[1];
        allReviews[productId] = JSON.parse(localStorage.getItem(key) || "[]");
      }
    }
    setReviews(allReviews);

    // Fetch orders from localStorage
    const allOrders: Order[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.endsWith("_orders")) {
        const userOrders: Order[] = JSON.parse(localStorage.getItem(key) || "[]");
        allOrders.push(...userOrders);
      }
    }
    setOrders(allOrders);

    // Fetch cart items from localStorage
    const allCartItems: Product[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.endsWith("_cart")) {
        const userCart: Product[] = JSON.parse(localStorage.getItem(key) || "[]");
        allCartItems.push(...userCart);
      }
    }
    setCartItems(allCartItems);
  }, [productId]);

  // Aggregate data
  const productReviews = reviews[productId] || [];
  const totalReviews = productReviews.length;

  const productOrders = orders.filter((order) => order._id === productId);
  const totalOrders = productOrders.length;
  const totalRevenue = productOrders.reduce((sum, order) => sum + order.price * order.quantity, 0);

  const productCartItems = cartItems.filter((item) => item._id === productId);
  const totalCartItems = productCartItems.length;

  // Prepare chart data
  const chartData = {
    labels: ["Reviews", "Orders", "Cart Additions"],
    datasets: [
      {
        data: [totalReviews, totalOrders, totalCartItems],
        backgroundColor: [
          "rgba(255, 99, 132, 0.5)",
          "rgba(53, 162, 235, 0.5)",
          "rgba(75, 192, 192, 0.5)",
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(53, 162, 235, 1)",
          "rgba(75, 192, 192, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: `${productName} Performance`,
      },
    },
  };

  return (
    <div className="space-y-4 font-clash">
      <Card>
        <CardHeader>
          <CardTitle>Product Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <Doughnut options={chartOptions} data={chartData} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProductAnalytics;
