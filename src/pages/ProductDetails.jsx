import React, { useEffect, useState } from "react";
import { useParams, useHistory } from "react-router-dom";
import service from "../appwrite/config";
import { useCart } from "../context/CartContext";
import PlaceholderImage from "../components/PlaceholderImage";

export default function ProductDetails() {
  const { productId } = useParams();
  const history = useHistory();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [imageIds, setImageIds] = useState([]);

  // Fetch product details
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const product = await service.getProductById(productId);
        setProduct(product);
        
        // Safely parse image_ids
        try {
          let ids = [];
          if (product.image_ids) {
            // Handle case where it might already be an array
            if (Array.isArray(product.image_ids)) {
              ids = product.image_ids;
            } 
            // Handle case where it's a JSON string
            else if (typeof product.image_ids === 'string') {
              const parsed = JSON.parse(product.image_ids);
              ids = Array.isArray(parsed) ? parsed : [parsed];
            }
            // Handle case where it's a single ID
            else {
              ids = [product.image_ids];
            }
          }
          setImageIds(ids);
        } catch (error) {
          console.error("Error parsing image IDs:", error);
          setImageIds([]);
        }
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
    history.push("/cart");
  };

  // Safe image error handler
  const handleImageError = (e) => {
    if (e.target) {
      e.target.style.display = 'none';
      if (e.target.nextSibling) {
        e.target.nextSibling.style.display = 'block';
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gift-primary"></div>
      </div>
    );
  }
  
  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl font-semibold text-gray-700">Product not found.</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white p-8 rounded-xl shadow-lg">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Product Images Carousel */}
            <div className="bg-gray-100 rounded-lg overflow-hidden relative">
              {imageIds.length > 0 ? (
                <>
                  <div className="relative aspect-square w-full mb-4 overflow-hidden">
                    {imageIds.map((imageId, index) => (
                      <div key={imageId} className="absolute inset-0 h-full w-full transform transition-opacity duration-500 ease-in-out">
                        <img
                          src={service.getImagePreview(imageId)}
                          alt={`${product.name} - Image ${index + 1}`}
                          className={`w-full h-full object-contain ${index === currentImageIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
                          onError={handleImageError}
                          loading="lazy"
                        />
                        <PlaceholderImage 
                          size="large" 
                          className={`absolute inset-0 w-full h-full ${index === currentImageIndex ? 'hidden' : 'block'}`}
                        />
                      </div>
                    ))}
                    {imageIds.length > 1 && (
                      <>
                        <button
                          onClick={() => setCurrentImageIndex(prev => prev === 0 ? imageIds.length - 1 : prev - 1)}
                          className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition-colors z-20"
                        >
                          ←
                        </button>
                        <button
                          onClick={() => setCurrentImageIndex(prev => prev === imageIds.length - 1 ? 0 : prev + 1)}
                          className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition-colors z-20"
                        >
                          →
                        </button>
                      </>
                    )}
                  </div>
                  {imageIds.length > 1 && (
                    <div className="flex justify-center space-x-2 overflow-x-auto py-2">
                      {imageIds.map((imageId, index) => (
                        <button
                          key={index}
                          onClick={() => setCurrentImageIndex(index)}
                          className={`relative w-16 h-16 rounded-lg overflow-hidden focus:outline-none ${index === currentImageIndex ? 'ring-2 ring-gift-primary' : 'opacity-70'}`}
                        >
                          <img
                            src={service.getImagePreview(imageId)}
                            alt={`Thumbnail ${index + 1}`}
                            className="w-full h-full object-cover"
                            loading="lazy"
                          />
                        </button>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <PlaceholderImage size="large" />
              )}
            </div>

            {/* Product Details */}
            <div className="space-y-6">
              <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
              <div className="text-2xl font-bold text-gift-primary">
                Rs. {product.price}
              </div>
              
              <div className="space-y-4">
                <h2 className="text-xl font-semibold">Product Description</h2>
                <p className="text-gray-600">
                  {product.description || 'No description available'}
                </p>
              </div>

              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <span className="text-green-600">✓</span>
                  <span>Cash on Delivery Available</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-green-600">✓</span>
                  <span>Free Shipping on orders above Rs. 999</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-gray-600">
                    Standard Shipping Charges: Rs. 99
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-6">
                <button
                  onClick={handleAddToCart}
                  className="w-full bg-gift-primary text-white px-6 py-3 rounded-lg hover:bg-opacity-90 transition-colors duration-200"
                >
                  Add to Cart
                </button>
                <button
                  onClick={() => history.push('/checkout', { state: { product } })}
                  className="w-full bg-gift-primary text-white px-6 py-3 rounded-lg hover:bg-opacity-90 transition-colors duration-200"
                >
                  Buy Now
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}