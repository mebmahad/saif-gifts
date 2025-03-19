import React from "react";
import { useCart } from "../context/CartContext";
import { Link } from "react-router-dom";

export default function CartPage() {
  const { cart, removeFromCart, clearCart, increaseQuantity, decreaseQuantity } =
    useCart();

  // Calculate subtotal
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  // Calculate taxes (assuming 10% tax rate)
  const taxRate = 0.1; // 10%
  const tax = subtotal * taxRate;

  // Calculate total
  const total = subtotal + tax;

  // Function to handle clear cart with confirmation
  const handleClearCart = () => {
    const isConfirmed = window.confirm("Are you sure you want to clear your cart?");
    if (isConfirmed) {
      clearCart();
    }
  };

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Your Cart</h1>
        {cart.length === 0 ? (
          <p className="text-gray-600">
            Your cart is empty.{" "}
            <Link to="/" className="text-gift-primary hover:underline">
              Browse products
            </Link>
          </p>
        ) : (
          <>
            <div className="space-y-4">
              {cart.map((item) => (
                <div key={item.$id} className="bg-white p-4 rounded-lg shadow-md">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-lg font-semibold">{item.name}</h3>
                      <p className="text-gray-600">
                        ₹{item.price} x {item.quantity}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => decreaseQuantity(item.$id)}
                        className="bg-gray-200 text-gray-700 px-2 py-1 rounded-lg hover:bg-gray-300"
                      >
                        -
                      </button>
                      <span>{item.quantity}</span>
                      <button
                        onClick={() => increaseQuantity(item.$id)}
                        className="bg-gray-200 text-gray-700 px-2 py-1 rounded-lg hover:bg-gray-300"
                      >
                        +
                      </button>
                      <button
                        onClick={() => removeFromCart(item.$id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary Section */}
            <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-bold mb-4">Order Summary</h2>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-semibold">₹{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax (10%)</span>
                  <span className="font-semibold">₹{tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between border-t pt-2">
                  <span className="text-gray-600 font-bold">Total</span>
                  <span className="font-bold text-gift-primary">₹{total.toFixed(2)}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-6">
                <button
                  onClick={handleClearCart}
                  className="bg-red-500 text-white px-4 py-2 rounded-lg mt-4"
                >
                  Clear Cart
                </button>
                <Link
                  to="/"
                  className="bg-gift-primary text-white px-4 py-2 rounded-lg mt-4 ml-4 hover:bg-purple-700"
                >
                  Continue Shopping
                </Link>
                <button
                  onClick={() => alert("Proceeding to checkout...")} // Placeholder for checkout functionality
                  className="bg-green-500 text-white px-4 py-2 rounded-lg mt-4 ml-4 hover:bg-green-600"
                >
                  Proceed to Checkout
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}