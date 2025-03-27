import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import service from '../appwrite/config';
import PlaceholderImage from '../components/PlaceholderImage';
import SalesReport from './SalesReport';
import QRCodeModal from '../components/QRCodeModal';

export default function AdminDashboard() {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [activeTab, setActiveTab] = useState('products');
  const navigate = useNavigate();
  const [showSalesReport, setShowSalesReport] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showQRModal, setShowQRModal] = useState(false);

  useEffect(() => {
    fetchProducts();
    fetchAllOrders();
    fetchUsers();
  }, []);

  const fetchProducts = async () => {
    const products = await service.getProducts();
    setProducts(products);
  };

  const fetchAllOrders = async () => {
    try {
      const response = await service.getAllOrders();
      setOrders(response);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await service.getAllUsers();
      setUsers(response);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleUpdateUserRole = async (userId, newRole) => {
    try {
      await service.updateUserRole(userId, newRole);
      fetchUsers();
    } catch (error) {
      console.error('Error updating user role:', error);
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      await service.deleteProduct(productId);
      fetchProducts();
    }
  };

  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      await service.updateOrderStatus(orderId, newStatus);
      fetchAllOrders();
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

      {/* Tab Navigation */}
      <div className="flex mb-6 space-x-4 border-b">
        <button
          className={`py-2 px-4 ${activeTab === 'products' ? 'border-b-2 border-gift-primary text-gift-primary' : 'text-gray-500'}`}
          onClick={() => { setActiveTab('products'); setShowSalesReport(false); }}
        >
          Products
        </button>
        <button
          className={`py-2 px-4 ${activeTab === 'orders' ? 'border-b-2 border-gift-primary text-gift-primary' : 'text-gray-500'}`}
          onClick={() => { setActiveTab('orders'); setShowSalesReport(false); }}
        >
          Orders
        </button>
        <button
          className={`py-2 px-4 ${activeTab === 'users' ? 'border-b-2 border-gift-primary text-gift-primary' : 'text-gray-500'}`}
          onClick={() => { setActiveTab('users'); setShowSalesReport(false); }}
        >
          Users
        </button>
        <button
          className={`py-2 px-4 ${showSalesReport ? 'border-b-2 border-gift-primary text-gift-primary' : 'text-gray-500'}`}
          onClick={() => { setShowSalesReport(true); setActiveTab(''); }}
        >
          Sales Reports
        </button>
        <Link
          to="/admin/pos"
          className="py-2 px-4 text-gray-500 hover:text-gift-primary"
        >
          POS System
        </Link>
      </div>

      {showQRModal && (
        <QRCodeModal
          product={selectedProduct}
          onClose={() => {
            setShowQRModal(false);
            setSelectedProduct(null);
          }}
        />
      )}

      {showSalesReport ? (
        <SalesReport />
      ) : activeTab === 'products' && (
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold">Products Management</h2>
            <Link
              to="/admin/add-product"
              className="bg-gift-primary text-white px-4 py-2 rounded-lg hover:bg-opacity-90"
            >
              Add New Product
            </Link>
          </div>

          <div className="grid gap-6">
            {products.map((product) => (
              <div key={product.$id} className="bg-white p-4 rounded-lg shadow-md flex justify-between items-center">
                <div className="flex items-center space-x-4">
                  {product.image ? (
                    <img
                      src={service.getImagePreview(product.image)}
                      alt={product.name}
                      className="w-16 h-16 object-cover rounded"
                      onError={(e) => {
                          e.target.target = null;
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                  ) : (
                    <PlaceholderImage size="small" />
                  )}
                  <div>
                    <h3 className="font-semibold">{product.name}</h3>
                    <p className="text-gray-600">Rs. {product.price}</p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => navigate(`/admin/edit-product/${product.$id}`)}
                    className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => {
                      setSelectedProduct(product);
                      setShowQRModal(true);
                    }}
                    className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 mr-2"
                  >
                    Generate QR
                  </button>
                  <button
                    onClick={() => handleDeleteProduct(product.$id)}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Orders Tab */}
      {activeTab === 'orders' && (
        <div>
          <h2 className="text-2xl font-semibold mb-6">Orders Management</h2>
          <div className="grid gap-6">
            {orders && orders.length > 0 ? (
              orders.map((order) => (
                <div key={order.$id} className="bg-white p-6 rounded-lg shadow-md">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-semibold">Order #{order.$id}</h3>
                      <p className="text-gray-600">
                        Date: {new Date(order.$createdAt).toLocaleDateString()}
                      </p>
                      <p className="text-gray-600">
                        Customer: {order.shippingDetails && JSON.parse(order.shippingDetails).fullName}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">Total: Rs. {order.total}</p>
                      <select
                        value={order.status || 'pending'}
                        onChange={(e) => handleUpdateOrderStatus(order.$id, e.target.value)}
                        className="mt-2 border rounded p-1"
                      >
                        <option value="pending">Pending</option>
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </div>
                  </div>
                  <div className="mt-4">
                    <h4 className="font-semibold mb-2">Order Items:</h4>
                    <div className="space-y-2">
                      {order.products && JSON.parse(order.products).map((item, index) => (
                        <div key={index} className="flex justify-between text-sm">
                          <span>{item.name}</span>
                          <span>x{item.quantity}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center text-gray-500 py-8">
                No orders found
              </div>
            )}
          </div>
        </div>
      )}

      {/* Users Tab */}
      {activeTab === 'users' && (
        <div>
          <h2 className="text-2xl font-semibold mb-6">Users Management</h2>
          <div className="grid gap-6">
            {users && users.length > 0 ? (
              users.map((user) => (
                <div key={user.$id} className="bg-white p-6 rounded-lg shadow-md">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-semibold">{user.name}</h3>
                      <p className="text-gray-600">{user.email}</p>
                      <p className="text-sm text-gray-500">
                        Joined: {new Date(user.$createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center space-x-4">
                      <p className="text-sm text-gray-600">Role:</p>
                      <select
                        value={user.role || 'customer'}
                        onChange={(e) => handleUpdateUserRole(user.$id, e.target.value)}
                        className="border rounded p-1"
                      >
                        <option value="customer">Customer</option>
                        <option value="admin">Admin</option>
                      </select>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center text-gray-500 py-8">
                No users found
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
