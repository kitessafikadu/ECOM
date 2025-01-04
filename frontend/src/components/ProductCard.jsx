import React from "react";
import { useNavigate } from "react-router-dom";
import StarRating from "./StarRating";

const ProductCard = ({ product }) => {
  const navigate = useNavigate();

  const handleAddToCart = () => {
    navigate("/cart");
  };

  const handleViewDetails = () => {
    navigate(`/products/${product.product_id}`);
  };

  return (
    <div className="bg-white border rounded-lg shadow-md p-4 flex flex-col hover:shadow-lg transition-shadow duration-300">
      {/* Product Image */}
      <img
        src={
          product.image.startsWith("http")
            ? product.image
            : `http://localhost:8000/${product.image}`
        }
        alt={product.name}
        className="w-full h-48 object-cover rounded-t-lg"
      />

      {/* Product Info */}
      <div className="flex-grow flex flex-col justify-between">
        <div className="mt-4">
          <h2 className="text-lg font-semibold line-clamp-2">{product.name}</h2>
          <p className="text-gray-600 mt-2 line-clamp-3">
            {product.description}
          </p>
        </div>

        <div className="mt-4">
          <p className="text-xl font-bold text-blue-600">${product.price}</p>
          <div className="mt-2">
            <StarRating defaultRating={product.rating} />
          </div>
        </div>
      </div>

      <div className="mt-4 flex justify-between">
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
          onClick={handleAddToCart}
        >
          Add to Cart
        </button>
        <button
          className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300 transition"
          onClick={handleViewDetails}
        >
          View Details
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
