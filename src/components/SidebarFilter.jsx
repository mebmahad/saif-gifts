import React, { useState } from "react";
import Slider from "rc-slider";

export default function SidebarFilter({ onPriceChange, onCategoryChange }) {
  const [priceRange, setPriceRange] = useState([0, 5000]);
  const [selectedCategory, setSelectedCategory] = useState("All");

  // Handle price range change
  const handlePriceChange = (value) => {
    setPriceRange(value);
    onPriceChange(value); // Pass the new price range to the parent component
  };

  // Handle category selection
  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    onCategoryChange(category); // Pass the selected category to the parent component
  };

  return (
    <div className="w-64 bg-white p-6 shadow-lg">
      {/* Price Range Slider */}
      <h3 className="text-lg font-bold mb-4 text-gray-800">Filter by Price</h3>
      <Slider
        range
        min={0}
        max={5000}
        value={priceRange}
        onChange={handlePriceChange}
        trackStyle={{ backgroundColor: "#6D28D9", height: "6px" }}
        handleStyle={{
          borderColor: "#6D28D9",
          backgroundColor: "white",
          boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
          border: "2px solid #6D28D9",
          width: "20px",
          height: "20px",
          marginTop: "-8px",
          cursor: "pointer"
        }}
        railStyle={{ backgroundColor: "#E5E7EB", height: "6px" }}
      />
      <div className="mt-2 text-sm text-gray-600">
        Price: ₹{priceRange[0]} - ₹{priceRange[1]}
      </div>

      {/* Categories */}
      <h3 className="text-lg font-bold mt-8 mb-4 text-gray-800">Categories</h3>
      <ul className="space-y-2">
        {["All", "Toys", "Home Decor", "Electronics", "Books"].map((category) => (
          <li
            key={category}
            className={`text-gray-600 hover:text-gift-secondary cursor-pointer ${
              selectedCategory === category ? "font-bold text-gift-secondary" : ""
            }`}
            onClick={() => handleCategoryChange(category)}
          >
            {category}
          </li>
        ))}
      </ul>
    </div>
  );
}