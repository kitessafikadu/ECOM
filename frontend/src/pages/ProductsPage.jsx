import React, { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard"; // Import the ProductCard component

const ProductsPage = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    // Fetch products from the backend
    fetch("http://localhost:8000/api/products/")
      .then((response) => response.json())
      .then((data) => setProducts(data))
      .catch((error) => console.error("Error fetching products:", error));
  }, []);

  const handleRatingChange = (productId, newRating) => {
    // Update rating on the backend
    fetch(`http://localhost:8000/api/products/${productId}/rate/`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ rating: newRating }),
    })
      .then((response) => response.json())
      .then((updatedProduct) => {
        setProducts((prevProducts) =>
          prevProducts.map((product) =>
            product.id === updatedProduct.id ? updatedProduct : product
          )
        );
      })
      .catch((error) => console.error("Error updating rating:", error));
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-semibold mb-6">Products</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onRatingChange={handleRatingChange}
          />
        ))}
      </div>
    </div>
  );
};

export default ProductsPage;
