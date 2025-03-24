import React from 'react';
import { useLocation } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import ProductList from '../components/ProductList';

export default function Home() {
    const location = useLocation();
    const isAdminRoute = location.pathname.startsWith('/admin');

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col md:flex-row gap-6">
                {!isAdminRoute && (
                    <div className="md:w-1/4">
                        <Sidebar />
                    </div>
                )}
                <div className={`${isAdminRoute ? 'w-full' : 'md:w-3/4'}`}>
                    <ProductList />
                </div>
            </div>
        </div>
    );
}