import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import SidebarFilter from '../components/SidebarFilter';
import ProductList from '../components/ProductList';

export default function Home() {
    const location = useLocation();
    const isAdminRoute = location.pathname.startsWith('/admin');
    const [priceRange, setPriceRange] = useState([0, 5000]);
    const [selectedCategory, setSelectedCategory] = useState("All");

    const handlePriceChange = (range) => {
        setPriceRange(range);
    };

    const handleCategoryChange = (category) => {
        setSelectedCategory(category);
    };

    return (
        <div className="container mx-auto py-6">
            <div className="flex flex-col md:flex-row md:space-x-4">
                {!isAdminRoute && (
                    <div className="md:w-1/4 mb-4 md:mb-0">
                        <SidebarFilter
                            onPriceChange={handlePriceChange}
                            onCategoryChange={handleCategoryChange}
                        />
                    </div>
                )}
                <div className={`${isAdminRoute ? 'w-full' : 'md:w-3/4'}`}>
                    <ProductList 
                        priceRange={priceRange}
                        selectedCategory={selectedCategory}
                    />
                </div>
            </div>
        </div>
    );
}