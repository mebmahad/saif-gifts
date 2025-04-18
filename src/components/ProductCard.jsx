import React from 'react';
import service from '../appwrite/config';
import { useCart } from '../context/CartContext';
import { useHistory } from 'react-router-dom';
import { Link } from 'react-router-dom';

export default function ProductCard({ product }) {
    const history = useHistory();
    const { addToCart } = useCart();

    // Get the first image URL or use default
    const imageUrl = service.getImagePreview(product.image_ids ? JSON.parse(product.image_ids)[0] : null);
    
    // Check if product is out of stock
    const isOutOfStock = product.quantity <= 0;
    

    const handleImageError = (e) => {
        e.target.style.display = 'none';
        const placeholder = e.target.nextElementSibling;
        if (placeholder) {
            placeholder.style.display = 'block';
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden relative group hover:shadow-lg transition-shadow duration-200">
            <div className="relative h-64 overflow-hidden">
                <Link to={`/product/${product.$id}`} className="block h-full">
                    <div className="relative h-full w-full">
                        {imageUrl && (
                            <img
                                src={imageUrl}
                                alt={product.name}
                                className="w-full h-full object-cover"
                                onError={handleImageError}
                                loading="lazy"
                            />
                        )}
                    </div>
                    
                    <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent">
                        <h3 className="text-lg font-semibold text-white line-clamp-1">{product.name}</h3>
                        <div className="text-xl font-bold text-gift-primary">Rs. {product.price}</div>
                    </div>
                </Link>
            </div>

            <div className="p-4 grid grid-cols-2 gap-3">
                {isOutOfStock ? (
                    <div className="col-span-2 text-red-500 font-semibold text-lg text-center">Sold Out</div>
                ) : (
                    <>
                        <button
                            onClick={() => addToCart(product)}
                            className="w-full bg-gift-primary text-white px-4 py-2.5 rounded-lg hover:bg-opacity-90 transition-colors duration-200"
                        >
                            Add to Cart
                        </button>
                        <button
                            onClick={() => history.push('/checkout', { state: { product } })}
                            className="w-full bg-gift-primary text-white px-4 py-2.5 rounded-lg hover:bg-opacity-90 transition-colors duration-200"
                        >
                            Buy Now
                        </button>
                    </>
                )}
            </div>
        </div>
    );
}