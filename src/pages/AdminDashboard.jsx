import React, { useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import service from "../appwrite/config";

export default function AdminDashboard() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [products, setProducts] = useState([]);
    const [users, setUsers] = useState([]);

    // Check if user is admin
    useEffect(() => {
        const checkAdmin = async () => {
            const currentUser = await service.getCurrentUser();
            setUser(currentUser);
            setLoading(false);
        };
        checkAdmin();
    }, []);

    // Fetch all products and users (admin-only)
    useEffect(() => {
        if (user?.labels?.includes("admin")) {
            const fetchData = async () => {
                const products = await service.getProducts();
                const users = await service.getAllUsers();
                setProducts(products);
                setUsers(users);
            };
            fetchData();
        }
    }, [user]);

    if (loading) {
        return <div>Loading...</div>;
    }

    // Redirect non-admin users
    if (!user?.labels?.includes("admin")) {
        return <Navigate to="/" />;
    }

    return (
        <div className="min-h-screen p-8">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
                
                {/* Tabs for Products/Users */}
                <div className="flex gap-4 mb-8">
                    <button className="bg-gift-primary text-white px-4 py-2 rounded-lg">
                        Manage Products
                    </button>
                    <button className="bg-gift-secondary text-white px-4 py-2 rounded-lg">
                        Manage Users
                    </button>
                </div>

                {/* Products Table */}
                <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
                    <h2 className="text-xl font-bold mb-4">Products</h2>
                    <Link to="/admin/add-product" className="bg-green-500 text-white px-4 py-2 rounded-lg mb-4 inline-block">
                        Add New Product
                    </Link>
                    <table className="w-full">
                        <thead>
                            <tr className="border-b">
                                <th className="text-left py-2">Name</th>
                                <th className="text-left py-2">Price</th>
                                <th className="text-left py-2">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map((product) => (
                                <tr key={product.$id} className="border-b">
                                    <td className="py-2">{product.name}</td>
                                    <td className="py-2">₹{product.price}</td>
                                    <td className="py-2">
                                        <Link 
                                            to={`/admin/edit-product/${product.$id}`} 
                                            className="text-blue-500 hover:underline mr-4"
                                        >
                                            Edit
                                        </Link>
                                        <button className="text-red-500 hover:underline">
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Users Table */}
                <div className="bg-white rounded-lg shadow-lg p-6">
                    <h2 className="text-xl font-bold mb-4">Users</h2>
                    <table className="w-full">
                        <thead>
                            <tr className="border-b">
                                <th className="text-left py-2">Name</th>
                                <th className="text-left py-2">Email</th>
                                <th className="text-left py-2">Role</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user) => (
                                <tr key={user.$id} className="border-b">
                                    <td className="py-2">{user.name}</td>
                                    <td className="py-2">{user.email}</td>
                                    <td className="py-2">
                                        <select 
                                            value={user.role || "customer"}
                                            onChange={(e) => service.updateUserRole(user.$id, e.target.value)}
                                            className="border rounded p-1"
                                        >
                                            <option value="admin">Admin</option>
                                            <option value="customer">Customer</option>
                                        </select>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}