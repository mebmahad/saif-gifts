import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { useNavigate, useLocation } from 'react-router-dom';
import service from '../appwrite/config';
import { useAuth } from '../context/AuthContext';

const CheckoutPage = () => {
  const { cartItems, clearCart } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const [orderHistory, setOrderHistory] = useState([]);
  
  // Get product from navigation state if coming from "Buy Now"
  const buyNowProduct = location.state?.product;
  const displayItems = buyNowProduct ? [{ ...buyNowProduct, quantity: 1 }] : cartItems;

  useEffect(() => {
    const fetchOrderHistory = async () => {
      if (user) {
        try {
          const orders = await service.getUserOrders(user.$id);
          setOrderHistory(orders);
        } catch (error) {
          console.error('Error fetching order history:', error);
        }
      }
    };
    fetchOrderHistory();
  }, [user]);
  
  // Calculate total price with null check
  const subtotal = displayItems?.reduce((sum, item) => sum + (item.price * item.quantity), 0) || 0;
  const taxRate = 0.1;
  const tax = subtotal * taxRate;
  const total = subtotal + tax;

  const [shippingDetails, setShippingDetails] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setShippingDetails(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const orderDetails = {
      shippingDetails,
      cart: displayItems,
      subtotal,
      tax,
      totalAmount: total,
      orderId: `ORD-${Date.now()}`,
      orderDate: new Date().toISOString()
    };
    
    // Save to localStorage for invoice
    localStorage.setItem('currentOrder', JSON.stringify(orderDetails));
    
    // If user is logged in, save to Appwrite
    if (user) {
        await service.createOrder(user.$id, orderDetails);
    }

    clearCart();
    navigate('/invoice');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid md:grid-cols-2 gap-8">
        {/* Shipping Form */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-6">Shipping Details</h2>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label className="block mb-1">Full Name</label>
                <input
                  type="text"
                  name="fullName"
                  value={shippingDetails.fullName}
                  onChange={handleInputChange}
                  className="w-full border rounded p-2"
                  required
                />
              </div>
              <div>
                <label className="block mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  value={shippingDetails.email}
                  onChange={handleInputChange}
                  className="w-full border rounded p-2"
                  required
                />
              </div>
              <div>
                <label className="block mb-1">Phone</label>
                <input
                  type="tel"
                  name="phone"
                  value={shippingDetails.phone}
                  onChange={handleInputChange}
                  className="w-full border rounded p-2"
                  required
                />
              </div>
              <div>
                <label className="block mb-1">Address</label>
                <textarea
                  name="address"
                  value={shippingDetails.address}
                  onChange={handleInputChange}
                  className="w-full border rounded p-2"
                  required
                />
              </div>
              <div>
                <label className="block mb-1">City</label>
                <input
                  type="text"
                  name="city"
                  value={shippingDetails.city}
                  onChange={handleInputChange}
                  className="w-full border rounded p-2"
                  required
                />
              </div>
              <div>
                <label className="block mb-1">Postal Code</label>
                <input
                  type="text"
                  name="postalCode"
                  value={shippingDetails.postalCode}
                  onChange={handleInputChange}
                  className="w-full border rounded p-2"
                  required
                />
              </div>
            </div>
            <button
              type="submit"
              className="mt-6 w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
            >
              Place Order
            </button>
          </form>
        </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-6">Order Summary</h2>
            <div className="space-y-4">
              {displayItems.map((item, index) => (
                <div key={item.id || `item-${index}`} className="flex justify-between items-center">
                  <div>
                    <p className="font-semibold">{item.name}</p>
                    <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                  </div>
                  <p className="font-semibold">₹{item.price * item.quantity}</p>
                </div>
              ))}
              <div className="border-t pt-4 mt-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-semibold">₹{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax (10%)</span>
                  <span className="font-semibold">₹{tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold mt-2">
                  <span>Total:</span>
                  <span>₹{total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
  );
};

export default CheckoutPage;