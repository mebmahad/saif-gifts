import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useAuth } from './context/AuthContext';  // Add this import
import CartPage from './pages/CartPage';
import service from './appwrite/config';
import { CartProvider } from './context/CartContext';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import AdminDashboard from './pages/AdminDashboard';
import EditProductPage from './pages/EditProductPage';
import Header from './components/Header';
import Footer from './components/Footer';
import CheckoutPage from './pages/CheckoutPage';
import InvoicePage from './pages/InvoicePage';
import OrderHistory from './pages/OrderHistory';
import Profile from './pages/Profile';
import AddProductPage from './pages/AddProductPage';
import ProductDetails from './pages/ProductDetails';
import POSPage from './pages/POSPage';
import { AuthProvider } from './context/AuthContext';
import { PrivateRoute, PublicRoute, AdminRoute } from './components/ProtectedRoutes';

function App() {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-grow">
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/" element={<Home />} />
                <Route path="/cart" element={<CartPage />} />
                <Route path="/checkout" element={<CheckoutPage />} />
                <Route path="/invoice" element={<InvoicePage />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/orders" element={<OrderHistory />} />
                <Route path="/admin/*" element={<PrivateRoute><AdminDashboard /></PrivateRoute>} />
                <Route path="/admin/edit-product/:id" element={<PrivateRoute><EditProductPage /></PrivateRoute>} />
                <Route path="/admin/add-product" element={<PrivateRoute><AddProductPage /></PrivateRoute>} />
                <Route path="/admin/pos" element={<PrivateRoute><POSPage /></PrivateRoute>} />
                <Route path="/product/:productId" element={<ProductDetails />} />
              </Routes>
            </main>
            <Footer />
            <ToastContainer
              position="top-right"
              autoClose={3000}
              hideProgressBar={false}
              newestOnTop
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
            />
          </div>
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;