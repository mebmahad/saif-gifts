import React from "react";
import { Link, useNavigate } from "react-router-dom";
import service from "../appwrite/config";
import { useCart } from "../context/CartContext";

export default function Header({ user, setUser }) {
  const navigate = useNavigate();
  const { cartTotalItems } = useCart();

  const handleLogout = async () => {
    try {
      await service.logout();
      setUser(null);
      navigate("/");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <header className="bg-gift-primary text-white p-4 flex justify-between items-center shadow-lg">
      {/* Logo */}
      <h1 className="text-2xl font-bold">Saif Gifts 🎁</h1>

      <div className="flex items-center gap-6">
        {/* Admin Dashboard Link */}
        {user?.labels?.includes("admin") && (
          <Link
            to="/admin"
            className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600"
          >
            Admin Dashboard
          </Link>
        )}

        {/* Cart Icon */}
        <Link to="/cart" className="relative hover:opacity-80 transition-opacity">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-8 w-8"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </svg>
          {cartTotalItems > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-xs w-5 h-5 flex items-center justify-center rounded-full">
              {cartTotalItems}
            </span>
          )}
        </Link>

        {/* Login/Signup or Logout */}
        <div className="flex gap-4">
          {user ? (
            <button
              onClick={handleLogout}
              className="bg-gift-secondary px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors"
            >
              Logout
            </button>
          ) : (
            <>
              <Link
                to="/login"
                className="bg-gift-secondary px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="bg-white text-gift-primary px-6 py-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}