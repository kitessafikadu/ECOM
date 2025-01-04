import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const ProductDetail = () => {
  const { id } = useParams(); // Ensure 'id' is coming from the route
  const [product, setProduct] = useState(null);
  const [cartMessage, setCartMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Fetch product details
  useEffect(() => {
    axios
      .get(`http://127.0.0.1:8000/api/products/${id}/`)
      .then((response) => {
        console.log("Product response:", response.data); // Debugging
        setProduct(response.data);
      })
      .catch((error) => console.error("Error fetching product:", error));
  }, [id]);

  // Add product to cart
  const handleAddToCart = async () => {
    setIsLoading(true);
    try {
      const response = await axios.post("http://127.0.0.1:8000/api/cart/", {
        product_id: product.product_id, // Use product_id from the API response
        quantity: 1,
      });

      if (response.status === 201) {
        setCartMessage(`${product.name} has been added to your cart.`);
      } else {
        throw new Error("Failed to add product to cart.");
      }
    } catch (error) {
      console.error("Error adding product to cart:", error);
      setCartMessage("Failed to add product to cart. Please try again.");
    } finally {
      setTimeout(() => setCartMessage(""), 3000); // Clear the message after 3 seconds
      setIsLoading(false);
    }
  };

  // Navigate to checkout
  const handleCheckout = () => {
    navigate(`/checkout`);
  };

  if (!product) return <p>Loading...</p>; // Handle loading state

  return (
    <div className="container mx-auto p-4">
      {/* Cart Confirmation Message */}
      {cartMessage && (
        <div className="bg-green-100 text-green-700 p-4 rounded-md mb-4">
          {cartMessage}
        </div>
      )}

      <div className="flex flex-col md:flex-row items-center bg-white rounded-lg shadow-md overflow-hidden">
        {/* Product Image */}
        <div className="w-full md:w-1/2">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-80 object-cover"
          />
        </div>

        {/* Product Details */}
        <div className="w-full md:w-1/2 p-6">
          <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
          <p className="text-gray-700 mb-4">{product.description}</p>
          <p className="text-2xl font-bold text-blue-600 mb-6">
            ${product.price}
          </p>

          {/* Buttons */}
          <div className="flex space-x-4">
            <button
              className={`bg-blue-600 text-white px-6 py-3 rounded-md transition ${
                isLoading
                  ? "cursor-not-allowed opacity-50"
                  : "hover:bg-blue-700"
              }`}
              onClick={handleAddToCart}
              disabled={isLoading}
            >
              {isLoading ? "Adding..." : "Add to Cart"}
            </button>
            <button
              className="bg-gray-200 text-gray-800 px-6 py-3 rounded-md hover:bg-gray-300 transition"
              onClick={handleCheckout}
            >
              Buy Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
