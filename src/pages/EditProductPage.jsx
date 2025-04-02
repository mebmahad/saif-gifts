import React, { useEffect, useState } from "react";
import { useParams, useHistory } from "react-router-dom";
import service from "../appwrite/config";

export default function EditProductPage() {
  const { productId } = useParams();
  const history = useHistory();
  
  if (!productId) {
    history.push('/admin');
    return null;
  }

  const [formData, setFormData] = useState({
    name: "",
    price: "",
    costPrice: "",
    quantity: "",
    description: "",
    category: "",
    existingImages: [],
    newImages: [],
  });
  const [previewImages, setPreviewImages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const product = await service.getProductById(productId);
        if (!product) {
          throw new Error('Product not found');
        }
        
        // Parse existing images safely
        let existingImages = [];
        try {
          existingImages = product?.image_ids 
            ? JSON.parse(product.image_ids)
            : [];
        } catch (error) {
          console.error("Error parsing existing images:", error);
          existingImages = [];
        }

        if (product) {
          setFormData({
            name: product.name || '',
            price: product.price || '',
            costPrice: product.costPrice || "",
            quantity: product.quantity || "",
            description: product.description || "",
            category: product.category || "",
            existingImages,
            newImages: [],
          });
        }

        // Create previews for existing images
        const existingPreviews = existingImages?.length > 0 
          ? existingImages.map(id => service.getImagePreview(id))
          : [];
        setPreviewImages(existingPreviews);
      } catch (error) {
        console.error("Error fetching product:", error);
        history.push('/admin');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      // Create preview URLs for new images
      const newPreviews = files.map(file => URL.createObjectURL(file));
      
      setFormData(prev => ({
        ...prev,
        newImages: [...prev.newImages, ...files],
      }));
      
      setPreviewImages(prev => [...prev, ...newPreviews]);
    }
  };

  const removeImage = (index) => {
    // Check if it's an existing image or new upload
    if (index < formData.existingImages.length) {
      // Remove existing image
      setFormData(prev => ({
        ...prev,
        existingImages: prev.existingImages.filter((_, i) => i !== index)
      }));
    } else {
      // Remove new upload
      const newIndex = index - formData.existingImages.length;
      setFormData(prev => ({
        ...prev,
        newImages: prev.newImages.filter((_, i) => i !== newIndex)
      }));
    }
    
    setPreviewImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!productId) {
      history.push('/admin');
      return;
    }

    setLoading(true);

    try {
      let newImageIds = [];
      if (formData.newImages.length > 0) {
        newImageIds = await service.uploadImages(formData.newImages);
      }

      // Combine existing and new image IDs
      const allImageIds = [...formData.existingImages, ...newImageIds];

      await service.updateProduct(productId, {
        name: formData.name,
        price: parseFloat(formData.price),
        costPrice: parseFloat(formData.costPrice),
        quantity: parseInt(formData.quantity),
        description: formData.description,
        category: formData.category,
        image_ids: allImageIds
      });

      history.push("/admin");
    } catch (error) {
      console.error("Error updating product:", error);
      alert("Failed to update product. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gift-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8 bg-gray-50">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold mb-8 text-gray-800">Edit Product</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Product Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Product Name
            </label>
            <input
              type="text"
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gift-primary focus:border-transparent"
              required
            />
          </div>

          {/* Product Price */}
          <div>
            <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
              Selling Price
            </label>
            <input
              type="number"
              id="price"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              min="0"
              step="0.01"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gift-primary focus:border-transparent"
              required
            />
          </div>

          {/* Cost Price */}
          <div>
            <label htmlFor="costPrice" className="block text-sm font-medium text-gray-700 mb-1">
              Cost Price
            </label>
            <input
              type="number"
              id="costPrice"
              value={formData.costPrice}
              onChange={(e) => setFormData({ ...formData, costPrice: e.target.value })}
              min="0"
              step="0.01"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gift-primary focus:border-transparent"
              required
            />
          </div>

          {/* Quantity */}
          <div>
            <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-1">
              Quantity
            </label>
            <input
              type="number"
              id="quantity"
              value={formData.quantity}
              onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
              min="0"
              step="1"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gift-primary focus:border-transparent"
              required
            />
          </div>

          {/* Product Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gift-primary focus:border-transparent"
              required
            />
          </div>

          {/* Product Category */}
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <select
              id="category"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gift-primary focus:border-transparent"
              required
            >
              <option value="" disabled>Select a category</option>
              <option value="Electronics">Electronics</option>
              <option value="Clothing">Clothing</option>
              <option value="Books">Books</option>
              <option value="Home">Home</option>
              <option value="Toys">Toys</option>
            </select>
          </div>

          {/* Product Images */}
          <div>
            <label htmlFor="images" className="block text-sm font-medium text-gray-700 mb-1">
              Product Images
            </label>
            <input
              type="file"
              id="images"
              onChange={handleImageChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gift-primary focus:border-transparent"
              accept="image/*"
              multiple
            />
            
            {/* Image Previews */}
            {previewImages.length > 0 && (
              <div className="mt-4 grid grid-cols-3 gap-4">
                {previewImages.map((preview, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={preview}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-32 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gift-primary text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-70"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Updating Product...
                </span>
              ) : "Update Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}