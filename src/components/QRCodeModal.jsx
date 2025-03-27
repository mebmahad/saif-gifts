import React, { useState } from 'react';
import QRCodeGenerator from './QRCodeGenerator';

const QRCodeModal = ({ product, onClose }) => {
  const [quantity, setQuantity] = useState(1);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-2xl font-bold mb-4">Generate QR Codes</h2>
        <p className="mb-4">Product: {product.name}</p>
        
        <div className="mb-4">
          <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-1">
            Quantity
          </label>
          <input
            type="number"
            id="quantity"
            value={quantity}
            onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gift-primary focus:border-transparent"
            min="1"
          />
        </div>

        <div className="flex justify-between">
          <button
            onClick={onClose}
            className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
          >
            Cancel
          </button>
          <QRCodeGenerator productData={product} quantity={quantity} onSuccess={onClose} />
        </div>
      </div>
    </div>
  );
};

export default QRCodeModal;