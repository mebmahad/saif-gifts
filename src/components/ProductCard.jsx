import React from 'react';
import service from '../appwrite/config';
import { useCart } from '../context/CartContext';
import PlaceholderImage from './PlaceholderImage';

export default function ProductCard({ product }) {
    const { addToCart } = useCart();

    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="aspect-w-1 aspect-h-1">
                {product.image ? (
                    <img
                        src={service.getImagePreview(product.image)}
                        alt={product.name}
                        className="w-full h-64 object-cover"
                        onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.nextSibling.style.display = 'block';
                        }}
                    />
                ) : (
                    <PlaceholderImage size="large" />
                )}
            </div>
            <div className="p-4">
                <h3 className="text-lg font-semibold">{product.name}</h3>
                <p className="text-gray-600 mt-2">{product.description}</p>
                <div className="mt-4 flex justify-between items-center">
                    <span className="text-xl font-bold">Rs. {product.price}</span>
                    <button
                        onClick={() => addToCart(product)}
                        className="bg-gift-primary text-white px-4 py-2 rounded-lg hover:bg-opacity-90"
                    >
                        Add to Cart
                    </button>
                </div>
            </div>
        </div>
    );
}