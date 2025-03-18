import React from "react";
import { Link } from "react-router-dom";
import service from "../appwrite/config";
import { useNavigate } from "react-router-dom";

export default function Header({ user, setUser }) {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await service.logout();
      setUser(null); // Update user state to null
      navigate('/')
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <header className="bg-gift-primary text-white p-4 flex justify-between items-center shadow-lg">
      {/* Logo */}
      <h1 className="text-2xl font-bold">Saif Gifts 🎁</h1>

      {/* Admin Dashboard Link (for admins) */}
      {user?.labels?.includes("admin") && (
        <Link to="/admin" className="bg-yellow-500 text-white px-4 py-2 rounded-lg">
          Admin Dashboard
        </Link>
      )}

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
    </header>
  );
}