import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"; // Import the FontAwesomeIcon component
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons"; // Import the magnifying glass icon
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { faShoppingCart } from "@fortawesome/free-solid-svg-icons";

const Header = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const categories = ["Electronics", "Fashion", "Home", "Sports", "Beauty"]; // Example categories

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    // Handle search logic (navigate or filter products)
    console.log("Searching for:", searchQuery, "Category:", selectedCategory);
  };

  return (
    <header className="bg-gray-800 text-white p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        {/* Website logo and name */}
        <div className="text-2xl font-bold">
          <Link to="/">My E-Commerce</Link>
        </div>

        {/* Search form */}
        <form
          onSubmit={handleSearchSubmit}
          className="relative flex items-center space-x-2"
        >
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="Search products"
            className="p-3 pl-10 rounded-md text-black w-full max-w-xs border-2 border-gray-300 focus:outline-none focus:border-blue-600"
          />
          {/* Magnifying glass icon inside the input */}
          <FontAwesomeIcon
            icon={faMagnifyingGlass} // Use the imported icon reference
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
            size="lg"
          />
        </form>

        {/* Category dropdown */}
        <div className="relative">
          <select
            value={selectedCategory}
            onChange={handleCategoryChange}
            className="p-2 rounded-md text-black border-2 border-gray-300 focus:outline-none focus:border-blue-600"
          >
            <option value="">Select Category</option>
            {categories.map((category, index) => (
              <option key={index} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        {/* Navigation links */}
        <div className="flex space-x-6">
          <Link to="/orders" className="hover:text-gray-400">
            Orders
          </Link>
          <Link to="/cart" className="hover:text-gray-400">
            <FontAwesomeIcon icon={faShoppingCart} />
          </Link>
          <Link to="/account" className="hover:text-gray-400">
            <FontAwesomeIcon icon={faUser} />
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
