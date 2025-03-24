import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import service from "../appwrite/config";
import { useAuth } from "../context/AuthContext";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const { setUser } = useAuth();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        try {
            // First, try to logout any existing session
            await service.logout();
            
            // Then proceed with login
            const user = await service.login(email, password);
            if (user) {
                setUser(user);
                navigate('/');
            }
        } catch (error) {
            console.error('Login error:', error);
            if (error.message.includes('session is active')) {
                try {
                    // If session error occurs, try logging out and logging in again
                    await service.logout();
                    const user = await service.login(email, password);
                    if (user) {
                        setUser(user);
                        navigate('/');
                    }
                } catch (retryError) {
                    setError('An error occurred during login. Please try again.');
                }
            } else {
                setError(error.message || 'An error occurred during login');
            }
        }
    };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gift-primary"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gift-primary"
          />
          <button
            type="submit"
            className="w-full bg-gift-primary text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
          >
            Login
          </button>
        </form>
        <p className="mt-4 text-center">
          Don't have an account?{" "}
          <Link to="/signup" className="text-gift-primary hover:underline">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}