import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import service from '../appwrite/config';
import { useAuth } from '../context/AuthContext';

export default function Profile() {
  const history = useHistory();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [orders, setOrders] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);

  useEffect(() => {
    if (!user) {
      history.push('/login');
      return;
    }
    fetchRecentOrders();
  }, [user, history]);

  const fetchRecentOrders = async () => {
    try {
      const userOrders = await service.getUserOrders(user.$id);
      setOrders(userOrders);
      setRecentOrders(userOrders.slice(0, 3)); // Get last 3 orders
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  return (
    <div className="container mx-auto p-8">
      <div className="grid md:grid-cols-3 gap-8">
        {/* User Info Card */}
        <div className="md:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-center mb-6">
              <div className="w-24 h-24 bg-gift-primary rounded-full flex items-center justify-center">
                <span className="text-4xl text-white">
                  {user?.name?.charAt(0) || 'U'}
                </span>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-500">Full Name</label>
                <p className="font-semibold">{user?.name}</p>
              </div>
              
              <div>
                <label className="text-sm text-gray-500">Email</label>
                <p className="font-semibold">{user?.email}</p>
              </div>
              
              <div>
                <label className="text-sm text-gray-500">Member Since</label>
                <p className="font-semibold">
                  {new Date(user?.$createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="md:col-span-2 space-y-6">
          {/* Quick Stats */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold mb-2">Total Orders</h3>
              <p className="text-3xl font-bold text-gift-primary">{orders.length}</p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold mb-2">Active Cart Items</h3>
              <p className="text-3xl font-bold text-gift-primary">
                {localStorage.getItem(`cart_${user?.$id}`) 
                  ? JSON.parse(localStorage.getItem(`cart_${user?.$id}`)).length 
                  : 0}
              </p>
            </div>
          </div>

          {/* Recent Orders */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Recent Orders</h2>
              <button
                onClick={() => history.push('/orders')}
                className="text-gift-primary hover:underline"
              >
                View All
              </button>
            </div>
            
            {recentOrders.length === 0 ? (
              <p className="text-gray-500">No orders yet</p>
            ) : (
              <div className="space-y-4">
                {recentOrders.map((order) => (
                  <div key={order.$id} className="border-b pb-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-semibold">Order #{order.$id}</p>
                        <p className="text-sm text-gray-500">
                          {new Date(order.$createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">Rs. {order.total}</p>
                        <p className="text-sm text-gray-500">{order.status}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => navigate('/cart')}
                className="bg-gift-primary text-white px-4 py-2 rounded-lg hover:bg-opacity-90"
              >
                View Cart
              </button>
              <button
                onClick={() => history.push('/orders')}
                className="bg-gift-secondary text-white px-4 py-2 rounded-lg hover:bg-opacity-90"
              >
                Order History
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}