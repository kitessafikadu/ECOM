import React from "react";

const CategoryCard = ({ category }) => {
  return (
    <div className="bg-white border rounded-lg shadow-md p-4 flex flex-col items-center hover:shadow-lg transition-shadow duration-300">
      {/* Category Image */}
      {/* Category Name */}
      <h2 className="text-lg font-bold mt-4">{category.name}</h2>

      {/* Category Description */}
      <p className="text-gray-600 mt-2 text-center line-clamp-3">
        {category.description || "Explore our wide range of products."}
      </p>

      {/* CTA Button */}
      <button
        className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
        onClick={() => console.log(`Viewing products in ${category.name}`)}
      >
        Explore
      </button>
    </div>
  );
};

export default CategoryCard;
