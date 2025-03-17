export default function ProductCard({ product }) {
    return (
      <div className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow">
        {/* Product Image */}
        <div className="bg-gray-100 h-48 rounded-lg mb-4"></div>
        
        {/* Product Details */}
        <h3 className="text-lg font-semibold text-gray-800">{product.name}</h3>
        <p className="text-gray-600 text-sm mt-2">{product.description}</p>
        
        {/* Price and Add to Cart */}
        <div className="mt-4 flex justify-between items-center">
          <span className="text-gift-primary font-bold">₹{product.price}</span>
          <button className="bg-gift-secondary text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors">
            Add to Cart
          </button>
        </div>
      </div>
    );
  }