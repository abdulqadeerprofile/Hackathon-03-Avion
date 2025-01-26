"use client";

import React, { useEffect, useState } from "react";
import { auth } from "../../../firebase/firebase"; // Replace with your auth setup

interface Order {
  _id: string;
  name: string;
  price: number;
  quantity: number;
  date: string;
}

export default function ProfilePage() {
  const [userOrders, setUserOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserOrders = () => {
      const user = auth.currentUser;
      if (!user) return;

      // Get user orders from localStorage
      const userOrdersKey = `${user.uid}_orders`;
      const storedOrders = JSON.parse(localStorage.getItem(userOrdersKey) || "[]");
      setUserOrders(storedOrders);
      setLoading(false);
    };

    fetchUserOrders();
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  const user = auth.currentUser;
  if (!user) return <p>No user found</p>;

  return (
    <div>
      <h1>Profile</h1>
      <h2>User Information</h2>
      <p><strong>Name:</strong> {user.displayName}</p>
      <p><strong>Email:</strong> {user.email}</p>

      <h2>Order History</h2>
      {userOrders.length === 0 ? (
        <p>No orders yet</p>
      ) : (
        userOrders.map((order) => (
          <div key={order._id}>
            <p><strong>{order.name}</strong></p>
            <p>Quantity: {order.quantity}</p>
            <p>Price: ${order.price}</p>
            <p>Ordered On: {new Date(order.date).toLocaleDateString()}</p>
          </div>
        ))
      )}
    </div>
  );
}
