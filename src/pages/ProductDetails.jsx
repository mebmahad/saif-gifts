import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import service from "../appwrite/config";
import { useCart } from "../context/CartContext";

export default function ProductDetails() {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch product details
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const product = await service.getProductById(productId);
        setProduct(product);
      } catch (error) {
        console.error("Error fetching product:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  // Handle Add to Cart
  const handleAddToCart = () => {
    addToCart(product);
    navigate("/cart"); // Navigate to cart page
  };

  if (loading) return <div>Loading...</div>;
  if (!product) return <div>Product not found.</div>;

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">{product.name}</h1>
        <div className="bg-white p-8 rounded-lg shadow-lg">
          {/* Product Image */}
          <div className="bg-gray-100 h-96 rounded-lg mb-8 flex items-center justify-center">
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
          <p className="text-gray-600 text-lg mb-4">{product.description}</p>
          <p className="text-gift-primary text-2xl font-bold mb-4">
            ₹{product.price}
          </p>

          {/* Add to Cart Button */}
          <button
            onClick={handleAddToCart}
            className="bg-gift-secondary text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}