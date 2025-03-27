import React, { useState } from 'react';
import { QrReader } from 'react-qr-reader';
import service from '../appwrite/config';

const QRScanner = () => {
  const [scannedProduct, setScannedProduct] = useState(null);
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editedProduct, setEditedProduct] = useState(null);

  const handleScan = async (result) => {
    if (result) {
      try {
        const productCode = result?.text;
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

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    try {
      await service.updateProduct(editedProduct.$id, editedProduct);
      setScannedProduct(editedProduct);
      setIsEditing(false);
      setError('');
    } catch (err) {
      setError('Error updating product');
      console.error(err);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedProduct(prev => ({
      ...prev,
      [name]: name === 'price' ? parseFloat(value) : value
    }));
  };

  return (
    <div className="max-w-lg mx-auto p-4">
      <div className="mb-8">
        <QrReader
          onResult={handleScan}
          onError={handleError}
          constraints={{ facingMode: 'environment' }}
          className="w-full aspect-square"
        />
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {scannedProduct && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold mb-4">
            {isEditing ? 'Edit Product' : 'Product Details'}
          </h2>

          {isEditing ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={editedProduct.name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Price
                </label>
                <input
                  type="number"
                  name="price"
                  value={editedProduct.price}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  name="description"
                  value={editedProduct.description}
                  onChange={handleInputChange}
                  rows="3"
                  className="w-full px-4 py-2 border rounded-lg"
                />
              </div>
              <div className="flex space-x-4">
                <button
                  onClick={handleSave}
                  className="bg-gift-primary text-white px-4 py-2 rounded-lg hover:bg-purple-700"
                >
                  Save Changes
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <p>
                <span className="font-medium">Name:</span> {scannedProduct.name}
              </p>
              <p>
                <span className="font-medium">Price:</span> Rs.{' '}
                {scannedProduct.price.toFixed(2)}
              </p>
              <p>
                <span className="font-medium">Description:</span>{' '}
                {scannedProduct.description}
              </p>
              <p>
                <span className="font-medium">Category:</span>{' '}
                {scannedProduct.category}
              </p>
              <button
                onClick={handleEdit}
                className="bg-gift-primary text-white px-4 py-2 rounded-lg hover:bg-purple-700"
              >
                Edit Product
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default QRScanner;