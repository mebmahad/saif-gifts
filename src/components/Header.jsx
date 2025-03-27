import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import service from '../appwrite/config';

export default function Header() {
    const navigate = useNavigate();
    const { user, updateUser } = useAuth();
    const { cartTotalItems } = useCart();
    const [showProfileMenu, setShowProfileMenu] = useState(false);

    const handleLogout = async () => {
        try {
            await service.logout();
            updateUser();
            navigate('/');
        } catch (error) {
            console.error("Logout failed:", error);
            navigate('/login');
        }
    };

    return (
        <header className="bg-gift-primary text-white p-4 flex justify-between items-center shadow-lg">
            <Link to="/" className="text-2xl font-bold">
                Saif Gifts 🎁
            </Link>

            <div className="flex items-center gap-6">
            {user?.labels?.includes('admin') && (
    <Link
        to="/admin"
        className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors duration-200 flex items-center gap-2"
        aria-label="Admin Dashboard"
    >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
        </svg>
        Admin Dashboard
    </Link>
)}

                <Link to="/cart" className="relative hover:opacity-80">
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

                <div className="relative">
                    {user ? (
                        <>
                            <button
                                onClick={() => setShowProfileMenu(!showProfileMenu)}
                                className="flex items-center gap-2 hover:opacity-80"
                            >
                                <div className="w-8 h-8 bg-gift-secondary rounded-full flex items-center justify-center">
                                    {user.name?.charAt(0) || 'U'}
                                </div>
                                <span>{user.name || 'User'}</span>
                            </button>

                            {showProfileMenu && (
                                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl py-2 z-50">
                                    <button
                                        onClick={() => {
                                            setShowProfileMenu(false);
                                            navigate('/profile');
                                        }}
                                        className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100"
                                    >
                                        Profile
                                    </button>
                                    <button
                                        onClick={() => {
                                            setShowProfileMenu(false);
                                            navigate('/orders');
                                        }}
                                        className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100"
                                    >
                                        Order History
                                    </button>
                                    <button
                                        onClick={() => {
                                            setShowProfileMenu(false);
                                            handleLogout();
                                        }}
                                        className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100"
                                    >
                                        Logout
                                    </button>
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="flex gap-4">
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
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}