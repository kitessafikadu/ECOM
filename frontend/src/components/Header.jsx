import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBars,
  faMagnifyingGlass,
  faUser,
  faShoppingCart,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";

const Header = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const [menuOpen, setMenuOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [orderCount, setOrderCount] = useState(0);
  const [userProfile, setUserProfile] = useState(null);

  // Fetch categories, cart count, order count, and user profile
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/api/categories/");
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    };

    const fetchCartCount = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/api/cart/");
        const data = await response.json();
        setCartCount(data.length || 0); // Assuming API returns a list of cart items
      } catch (error) {
        console.error("Failed to fetch cart count:", error);
      }
    };

    const fetchOrderCount = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/api/orders/");
        const data = await response.json();
        setOrderCount(data.length || 0); // Assuming API returns a list of orders
      } catch (error) {
        console.error("Failed to fetch order count:", error);
      }
    };

    const fetchUserProfile = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/api/user/");
        const data = await response.json();
        setUserProfile(data); // Assuming API returns user profile data
      } catch (error) {
        console.error("Failed to fetch user profile:", error);
      }
    };

    fetchCategories();
    fetchCartCount();
    fetchOrderCount();
    fetchUserProfile();
  }, []);

  const handleSearchChange = (e) => setSearchQuery(e.target.value);
  const handleCategoryChange = (e) => setSelectedCategory(e.target.value);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    console.log("Searching for:", searchQuery, "Category:", selectedCategory);
  };

  return (
    <header className="bg-gray-800 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo */}
        <div className="text-2xl font-bold">
          <Link to="/" className="hover:text-gray-400">
            Netrela
          </Link>
        </div>

        {/* Hamburger Menu for Mobile */}
        <button
          className="block md:hidden text-xl"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <FontAwesomeIcon icon={menuOpen ? faTimes : faBars} />
        </button>

        {/* Navigation Links */}
        <nav
          className={`${
            menuOpen ? "block" : "hidden"
          } absolute top-full left-0 w-full bg-gray-800 md:static md:w-auto md:flex md:items-center`}
        >
          <div className="flex flex-col md:flex-row md:space-x-6">
            <Link to="/orders" className="relative p-2 hover:text-gray-400">
              Orders
              {orderCount > 0 && (
                <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full px-1">
                  {orderCount}
                </span>
              )}
            </Link>
            <Link
              to="/cart"
              className="relative p-2 hover:text-gray-400"
              aria-label="View cart"
            >
              <FontAwesomeIcon icon={faShoppingCart} />
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full px-1">
                  {cartCount}
                </span>
              )}
            </Link>
            <Link
              to="/profile"
              className="p-2 hover:text-gray-400 flex items-center"
              aria-label="User profile"
            >
              {userProfile?.profile_picture ? (
                <img
                  src={userProfile.profile_picture}
                  alt="Profile"
                  className="w-8 h-8 rounded-full object-cover"
                />
              ) : (
                <FontAwesomeIcon icon={faUser} />
              )}
            </Link>
          </div>
        </nav>
      </div>

      {/* Search and Category Section */}
      <div className="mt-4 md:mt-0 md:flex md:justify-between md:items-center">
        <form
          onSubmit={handleSearchSubmit}
          className="relative flex items-center space-x-2 w-full md:w-auto"
        >
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="Search products"
            className="p-2 pl-10 rounded-md text-black w-full border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
          <FontAwesomeIcon
            icon={faMagnifyingGlass}
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
            size="lg"
          />
          <button
            type="submit"
            className="hidden md:block bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            Search
          </button>
        </form>
        <div className="mt-4 md:mt-0">
          <select
            value={selectedCategory}
            onChange={handleCategoryChange}
            className="p-2 rounded-md text-black border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600 w-full md:w-auto"
          >
            <option value="">All</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
      </div>
    </header>
  );
};

export default Header;
