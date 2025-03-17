// src/App.jsx
import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Header from "./components/Header";
import SidebarFilter from "./components/SidebarFilter";
import ProductCard from "./components/ProductCard";
import ProductDetails from "./pages/ProductDetails";
import AdminDashboard from "./pages/AdminDashboard";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import service from "./appwrite/config";

export default function App() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [priceRange, setPriceRange] = useState([0, 5000]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [user, setUser] = useState(null); // Move user state here

  // Fetch products and user
  useEffect(() => {
    const fetchData = async () => {
      // Fetch products
      const products = await service.getProducts();
      setProducts(products);
      setFilteredProducts(products);

      // Fetch current user
      try {
        const currentUser = await service.getCurrentUser();
        setUser(currentUser);
      } catch (error) {
        setUser(null);
      }

      setLoading(false);
    };

    fetchData();
  }, []);

  // Handle login/logout globally
  const handleLogin = async (email, password) => {
    await service.login({ email, password });
    const currentUser = await service.getCurrentUser();
    setUser(currentUser);
  };

  const handleLogout = async () => {
    await service.logout();
    setUser(null);
  };

  // Handle search
  const handleSearch = (query) => {
    setSearchQuery(query);
    applyFilters(query, priceRange, selectedCategories);
  };

  // Handle price range change
  const handlePriceChange = (range) => {
    setPriceRange(range);
    applyFilters(searchQuery, range, selectedCategories);
  };

  // Handle category change
  const handleCategoryChange = (categories) => {
    setSelectedCategories(categories);
    applyFilters(searchQuery, priceRange, categories);
  };

  // Apply all filters (search, price, category)
  const applyFilters = (query, range, categories) => {
    let filtered = products;

    // Filter by search query
    if (query) {
      filtered = filtered.filter((product) =>
        product.name.toLowerCase().includes(query.toLowerCase())
      );
    }

    // Filter by price range
    filtered = filtered.filter(
      (product) => product.price >= range[0] && product.price <= range[1]
    );

    // Filter by categories
    if (categories.length > 0 && !categories.includes("All")) {
      filtered = filtered.filter((product) =>
        categories.includes(product.category)
      );
    }

    setFilteredProducts(filtered);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Loading products...</p>
      </div>
    );
  }

  return (
    <Router>
      <div className="min-h-screen">
        <Header
          onSearch={handleSearch}
          user={user}
          onLogout={handleLogout}
        />
        <div className="flex">
          <SidebarFilter
            onPriceChange={handlePriceChange}
            onCategoryChange={handleCategoryChange}
          />
          <main className="flex-1 p-8">
            <Routes>
              <Route
                path="/"
                element={
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredProducts.length > 0 ? (
                      filteredProducts.map((product) => (
                        <ProductCard key={product.$id} product={product} />
                      ))
                    ) : (
                      <p className="text-gray-600 col-span-full text-center mt-8">
                        No products found. Try adjusting your filters.
                      </p>
                    )}
                  </div>
                }
              />
              <Route path="/product/:productId" element={<ProductDetails />} />
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
}