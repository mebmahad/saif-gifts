import React from "react";
import Slider from "rc-slider";
import "rc-slider/assets/index.css"; // Import default CSS

export default function SidebarFilter() {
  // State for price range (optional)
  const [priceRange, setPriceRange] = React.useState([0, 5000]);

  return (
    <div className="w-64 bg-white p-6 shadow-lg">
      {/* Price Range Slider */}
      <h3 className="text-lg font-bold mb-4 text-gray-800">Filter by Price</h3>
      <Slider
        range
        min={0}
        max={5000}
        defaultValue={[0, 5000]}
        value={priceRange}
        onChange={(value) => setPriceRange(value)}
        trackStyle={{ backgroundColor: "#6D28D9", height: "4px" }} // Your theme color
        handleStyle={{
          borderColor: "#6D28D9",
          backgroundColor: "#6D28D9",
          boxShadow: "none",
          width: "16px",
          height: "16px",
          marginTop: "-6px",
        }}
        railStyle={{ backgroundColor: "#E5E7EB", height: "4px" }} // Gray color
      />
      <div className="mt-2 text-sm text-gray-600">
        Price: ₹{priceRange[0]} - ₹{priceRange[1]}
      </div>

      {/* Categories (unchanged) */}
      <h3 className="text-lg font-bold mt-8 mb-4 text-gray-800">Categories</h3>
      <ul className="space-y-2">
        <li className="text-gray-600 hover:text-gift-secondary cursor-pointer">All</li>
        <li className="text-gray-600 hover:text-gift-secondary cursor-pointer">Toys</li>
        <li className="text-gray-600 hover:text-gift-secondary cursor-pointer">Home Decor</li>
      </ul>
    </div>
  );
}