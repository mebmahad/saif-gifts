import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Header from "./components/Header";
import SidebarFilter from "./components/SidebarFilter";
import ProductCard from "./components/ProductCard";
import ProductDetails from "./pages/ProductDetails";
import AdminDashboard from "./pages/AdminDashboard";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import service from "./appwrite/config";
import AddProductPage from "./pages/AddProductPage";
import EditProductPage from "./pages/EditProductPage";
import { CartProvider } from "./context/CartContext";
import CartPage from "./pages/CartPage";
import OrderHistory from "./pages/OrderHistory";
import ErrorBoundary from "./components/ErrorBoundary";

export default function App() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [priceRange, setPriceRange] = useState([0, 5000]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [user, setUser] = useState(null); // User state

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
    <CartProvider>
      <Router>
        <div className="min-h-screen">
          <Header user={user} setUser={setUser} />
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
                <Route path="/login" element={<Login setUser={setUser} />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/admin/add-product" element={<AddProductPage />} />
                <Route
                  path="/admin/edit-product/:productId"
                  element={<EditProductPage />}
                />
                <Route path="/cart" element={<CartPage />} />
                <Route path="/orders" element={<OrderHistory />} />
              </Routes>
            </main>
          </div>
        </div>
      </Router>
    </CartProvider>
  );
}