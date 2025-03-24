import React, { useEffect, useState } from 'react';
import service from '../appwrite/config';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

export default function OrderHistory() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchOrders = async () => {
      if (user) {
        try {
          const userOrders = await service.getUserOrders(user.$id);
          setOrders(userOrders);
        } catch (error) {
          console.error('Error fetching orders:', error);
        }
      }
      setLoading(false);
    };

    fetchOrders();
  }, [user]);

  if (loading) {
    return <div className="p-8">Loading orders...</div>;
  }

  if (!user) {
    return (
      <div className="p-8">
        Please <Link to="/login" className="text-gift-primary hover:underline">login</Link> to view your order history.
      </div>
    );
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Order History</h1>
      {orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order.$id}
              className="bg-white p-6 rounded-lg shadow-md"
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-semibold">Order ID: {order.$id}</p>
                  <p className="text-gray-600">
                    Date: {new Date(order.$createdAt).toLocaleDateString()}
                  </p>
                  <p className="text-gray-600">Status: {order.status}</p>
                  <p className="font-semibold mt-2">
                    Total Amount: Rs. {order.total}
                  </p>
                </div>
                <div className="text-right">
                  <button
                    onClick={() => window.open(`/invoice/${order.$id}`, '_blank')}
                    className="text-gift-primary hover:underline"
                  >
                    View Invoice
                  </button>
                </div>
              </div>
              <div className="mt-4">
                <h3 className="font-semibold mb-2">Products:</h3>
                <div className="space-y-2">
                  {JSON.parse(order.products).map((product, index) => (
                    <div key={index} className="flex justify-between">
                      <span>{product.name}</span>
                      <span>x{product.quantity}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}