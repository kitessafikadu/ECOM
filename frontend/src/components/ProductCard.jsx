import React from "react";
import StarRating from "./StarRating"; // Import StarRating component

const ProductCard = ({ product, onRatingChange }) => {
  const handleRatingUpdate = (newRating) => {
    // Call the parent function to update the rating
    onRatingChange(product.id, newRating);
  };

  return (
    <div className="bg-white border rounded-lg shadow-md p-4">
      <img
        src={`http://localhost:8000${product.image}`} // Assuming image URL from API
        alt={product.name}
        className="w-full h-64 object-cover rounded-t-lg"
      />
      <h2 className="text-lg font-semibold mt-4">{product.name}</h2>
      <p className="text-gray-600 mt-2">{product.description}</p>
      <div className="flex justify-between items-center mt-4">
        <span className="text-xl font-bold">${product.price}</span>
        <div className="flex items-center">
          {/* Pass the current rating to the StarRating component */}
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
