import React from 'react';

export default function Sidebar() {
    return (
        <div className="bg-white p-4 rounded-lg shadow">
            <div className="mb-6">
                <h3 className="text-lg font-semibold mb-3">Price Range</h3>
                <div className="space-y-2">
                    <label className="flex items-center">
                        <input type="radio" name="price" className="mr-2" />
                        Under Rs. 500
                    </label>
                    <label className="flex items-center">
                        <input type="radio" name="price" className="mr-2" />
                        Rs. 500 - Rs. 1000
                    </label>
                    <label className="flex items-center">
                        <input type="radio" name="price" className="mr-2" />
                        Rs. 1000 - Rs. 2000
                    </label>
                    <label className="flex items-center">
                        <input type="radio" name="price" className="mr-2" />
                        Above Rs. 2000
                    </label>
                </div>
            </div>

            <div>
                <h3 className="text-lg font-semibold mb-3">Categories</h3>
                <div className="space-y-2">
                    <label className="flex items-center">
                        <input type="checkbox" className="mr-2" />
                        Birthday
                    </label>
                    <label className="flex items-center">
                        <input type="checkbox" className="mr-2" />
                        Anniversary
                    </label>
                    <label className="flex items-center">
                        <input type="checkbox" className="mr-2" />
                        Wedding
                    </label>
                    <label className="flex items-center">
                        <input type="checkbox" className="mr-2" />
                        General
                    </label>
                </div>
            </div>
        </div>
    );
}