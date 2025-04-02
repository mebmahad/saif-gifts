import React, { useState } from 'react';
import { QrScanner } from 'react-qr-scanner';
import service from '../appwrite/config';
import QRCodeGenerator from './QRCodeGenerator';
import { useCart } from '../context/CartContext';

const POSScanner = () => {
  const { addToCart } = useCart();
  const [scannedProduct, setScannedProduct] = useState(null);
  const [error, setError] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [isEditing, setIsEditing] = useState(false);
  const [editedProduct, setEditedProduct] = useState(null);

  const handleScan = async (result) => {
    if (result) {
      const data = result?.text;
      try {
        const productCode = data;
        const product = await service.getProductByCode(productCode);
        if (product) {
          setScannedProduct(product);
          setEditedProduct(product);
          setError('');
        } else {
          setError('Product not found');
        }
      } catch (err) {
        setError('Error fetching product details');
        console.error(err);
      }
    }
  };

  const handleError = (error) => {
    setError('Error accessing camera');
    console.error(error);
  };

  const handleQuantityChange = (value) => {
    setQuantity(Math.max(1, value));
  };

  const handleAddToCart = () => {
    if (scannedProduct) {
      addToCart({ ...scannedProduct, quantity });
      setScannedProduct(null);
      setQuantity(1);
    }
  };

  const handleGenerateQR = () => {
    if (scannedProduct) {
      return <QRCodeGenerator productData={scannedProduct} quantity={quantity} />;
    }
    return null;
  };

  return (
    <div className="max-w-lg mx-auto p-4">
      <div className="mb-8">
        <QrScanner
          onDecode={handleScan}
          onError={handleError}
          constraints={{ facingMode: 'environment' }}
          className="w-full aspect-square"
          ViewFinder={({ children }) => <div className="border-2 border-gift-primary rounded-lg p-2">{children}</div>}
        />
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {scannedProduct && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold mb-4">Product Details</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name
              </label>
              <p className="text-lg">{scannedProduct.name}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Price
              </label>
              <p className="text-lg">₹{scannedProduct.price}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Quantity
              </label>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleQuantityChange(quantity - 1)}
                  className="bg-gray-200 text-gray-700 px-3 py-1 rounded-lg hover:bg-gray-300"
                >
                  -
                </button>
                <span className="text-lg font-medium w-12 text-center">
                  {quantity}
                </span>
                <button
                  onClick={() => handleQuantityChange(quantity + 1)}
                  className="bg-gray-200 text-gray-700 px-3 py-1 rounded-lg hover:bg-gray-300"
                >
                  +
                </button>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Total
              </label>
              <p className="text-xl font-bold text-gift-primary">
                ₹{(scannedProduct.price * quantity).toFixed(2)}
              </p>
            </div>
            <div className="flex gap-4 mt-6">
              <button
                onClick={handleAddToCart}
                className="bg-gift-primary text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors flex-1"
              >
                Add to Cart
              </button>
              {handleGenerateQR()}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default POSScanner;