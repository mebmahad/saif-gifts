import React, { useEffect, useState } from "react";
import service from "../appwrite/config";

export default function OrderHistory() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      const user = await service.getCurrentUser();
      if (user) {
        const orders = await service.getOrdersByUser(user.$id);
        setOrders(orders);
      }
      setLoading(false);
    };
    fetchOrders();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Order History</h1>
        {orders.length === 0 ? (
          <p className="text-gray-600">No orders found.</p>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order.$id} className="bg-white p-4 rounded-lg shadow-md">
                <p className="text-lg font-semibold">Order ID: {order.$id}</p>
                <p className="text-gray-600">Total: ₹{order.total}</p>
                <p className="text-gray-600">Status: {order.status}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}