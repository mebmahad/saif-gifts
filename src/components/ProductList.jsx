import React, { useState, useEffect } from 'react';
import ProductCard from './ProductCard';
import service from '../appwrite/config';
import SidebarFilter from './SidebarFilter';

export default function ProductList({ priceRange, selectedCategory }) {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await service.getProducts();
            
            // Ensure we always have an array
            const fetchedProducts = Array.isArray(response?.documents) 
                ? response.documents 
                : Array.isArray(response) 
                    ? response 
                    : [];
            
            setProducts(fetchedProducts);

        } catch (error) {
            console.error('Error fetching products:', error);
            setError('Failed to load products. Please try again later.');
            setProducts([]);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div className="text-center py-8">Loading products...</div>;
    }

    if (error) {
        return <div className="text-center py-8 text-red-500">{error}</div>;
    }

    if (!products || products.length === 0) {
        return <div className="text-center py-8">No products found.</div>;
    }

    const filteredProducts = products.filter(product => {
        const productPrice = parseFloat(product.price);
        const inPriceRange = productPrice >= priceRange[0] && productPrice <= priceRange[1];
        const inCategory = selectedCategory === "All" || product.category === selectedCategory;
        return inPriceRange && inCategory;
    });

    return (
        <div className="flex">
            <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 px-2">
                {filteredProducts.map(product => (
                    <ProductCard key={product.$id} product={product} />
                ))}
            </div>
        </div>
    );
}