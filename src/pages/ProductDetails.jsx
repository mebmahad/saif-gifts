import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import service from "../appwrite/config";

export default function ProductDetails() {
  const { productId } = useParams(); // Get product ID from the URL
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Loading product details...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Product not found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8">
      <Link to="/" className="text-gift-primary hover:underline">
        &larr; Back to Home
      </Link>
      <div className="max-w-4xl mx-auto mt-8 bg-white p-8 rounded-lg shadow-lg">
        {/* Product Image */}
        <div className="w-full h-96 bg-gray-100 rounded-lg mb-8 flex items-center justify-center">
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
        <h1 className="text-3xl font-bold text-gray-800 mb-4">{product.name}</h1>
        <p className="text-gray-600 text-lg mb-4">{product.description}</p>
        <p className="text-gift-primary text-2xl font-bold mb-4">
          ₹{product.price}
        </p>

        {/* Add to Cart Button */}
        <button className="bg-gift-secondary text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors">
          Add to Cart
        </button>
      </div>
    </div>
  );
}