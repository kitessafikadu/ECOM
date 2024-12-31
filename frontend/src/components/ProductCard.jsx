import React from "react";
import StarRating from "./StarRating";

const ProductCard = ({ product, onRatingChange }) => {
  const handleRatingUpdate = (newRating) => {
    onRatingChange(product.id, newRating);
  };

  return (
    <div className="bg-white border rounded-lg shadow-md p-4">
      <img
        src={
          product.image.startsWith("http")
            ? product.image
            : `http://localhost:8000/${product.image}`
        }
        alt={product.name}
        className="w-full h-64 object-cover rounded-t-lg"
      />
      <h2 className="text-lg font-semibold mt-4">{product.name}</h2>
      <p className="text-gray-600 mt-2">{product.description}</p>
      <div className="mt-4">
        <p className="text-xl font-bold">${product.price}</p>
        {/* This div ensures the rating appears on a new line */}
        <div className="mt-2">
          <StarRating
            defaultRating={product.rating}
            onSetRating={handleRatingUpdate}
          />
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
