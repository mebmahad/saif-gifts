import React from "react";
import { Link } from "react-router-dom";

export default function Header({ onSearch, user, onLogout }) {
  return (
    <header className="bg-gift-primary text-white p-4 flex justify-between items-center shadow-lg">
      {/* Logo/Brand */}
      <h1 className="text-2xl font-bold">Saif Gifts 🎁</h1>

      {/* Search Bar */}
      <form onSubmit={(e) => e.preventDefault()} className="flex-1 max-w-2xl mx-4">
        <input
          type="text"
          placeholder="Search gifts..."
          onChange={(e) => onSearch(e.target.value)}
          className="w-full px-4 py-2 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-gift-secondary"
        />
      </form>

      {/* Admin Dashboard Link (for admins only) */}
      {user?.labels?.includes("admin") && (
        <Link to="/admin" className="bg-yellow-500 text-white px-4 py-2 rounded-lg">
          Admin Dashboard
        </Link>
      )}

      {/* Login/Signup or Logout */}
      <div className="flex gap-4">
        {user ? (
          <button
            onClick={onLogout}
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
    </header>
  );
}