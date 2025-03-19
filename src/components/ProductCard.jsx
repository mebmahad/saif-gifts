import React from "react";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import service from "../appwrite/config";

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const navigate = useNavigate();

  // Handle product card click (navigate to product details)
  const handleProductClick = () => {
    navigate(`/product/${product.$id}`);
  };

  // Handle "Add to Cart" button click
  const handleAddToCart = (e) => {
    e.stopPropagation(); // Prevent triggering the parent click
    addToCart(product);
    navigate("/cart"); // Navigate to cart page
  };

  return (
    <div
      onClick={handleProductClick} // Entire card is clickable
      className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer"
    >
      {/* Product Image */}
      <div className="bg-gray-100 h-48 rounded-lg mb-4 flex items-center justify-center">
        {product.image_id ? (
          <img
            src={service.getImagePreview(product.image_id)}
            alt={product.name}
            className="h-full w-full object-cover rounded-lg"
          />
        ) : (
          <span className="text-gray-500">No Image</span>
        )}
      </div>

      {/* Product Details */}
      <h3 className="text-lg font-semibold text-gray-800">{product.name}</h3>
      <p className="text-gray-600 text-sm mt-2">{product.description}</p>

      {/* Price and Add to Cart */}
      <div className="mt-4 flex justify-between items-center">
        <span className="text-gift-primary font-bold">₹{product.price}</span>
        <button
          onClick={handleAddToCart}
          className="bg-gift-secondary text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
}