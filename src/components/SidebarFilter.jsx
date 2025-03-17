import React, { useState } from "react";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";

export default function SidebarFilter({ onPriceChange, onCategoryChange }) {
  const [priceRange, setPriceRange] = useState([0, 5000]);
  const [selectedCategories, setSelectedCategories] = useState([]);

  // Handle price range change
  const handlePriceChange = (value) => {
    setPriceRange(value);
    onPriceChange(value); // Pass the new price range to the parent component
  };

  // Handle category selection
  const handleCategoryChange = (category) => {
    const updatedCategories = selectedCategories.includes(category)
      ? selectedCategories.filter((cat) => cat !== category) // Deselect if already selected
      : [...selectedCategories, category]; // Add to selection
    setSelectedCategories(updatedCategories);
    onCategoryChange(updatedCategories); // Pass the updated categories to the parent component
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
        trackStyle={{ backgroundColor: "#6D28D9", height: "4px" }}
        handleStyle={{
          borderColor: "#6D28D9",
          backgroundColor: "#6D28D9",
          boxShadow: "none",
          width: "16px",
          height: "16px",
          marginTop: "-6px",
        }}
        railStyle={{ backgroundColor: "#E5E7EB", height: "4px" }}
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
              selectedCategories.includes(category) ? "font-bold text-gift-secondary" : ""
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