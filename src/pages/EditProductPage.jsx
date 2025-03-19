import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import service from "../appwrite/config";

export default function EditProductPage() {
  const { productId } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    description: "",
    category: "",
    image: null,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const product = await service.getProductById(productId);
        setFormData({
          name: product.name,
          price: product.price,
          description: product.description,
          category: product.category,
          image: null,
        });
      } catch (error) {
        console.error("Error fetching product:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
        let imageId = undefined; // Use undefined instead of null
        if (formData.image) {
            const uploadedFile = await service.uploadImage(formData.image);
            imageId = uploadedFile.$id;
        }

        await service.updateProduct(productId, {
            name: formData.name,
            price: parseFloat(formData.price),
            description: formData.description,
            category: formData.category,
            image_id: imageId // Will preserve existing if undefined
        });

        navigate("/admin");
    } catch (error) {
        console.error("Error updating product:", error);
    } finally {
        setLoading(false);
    }
};

  if (loading) return <div>Loading...</div>;

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Edit Product</h1>
        {/* Form fields (same as AddProductPage) */}
      </div>
    </div>
  );
}