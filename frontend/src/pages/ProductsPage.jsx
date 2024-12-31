import React, { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard";
import Footer from "../components/Footer";
import Header from "../components/Header";

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true); // Loading state

  useEffect(() => {
    fetch("http://localhost:8000/api/products/")
      .then((response) => response.json())
      .then((data) => {
        setProducts(data);
        setLoading(false); // Set loading to false after data fetch
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
        setLoading(false); // Stop loading even if there's an error
      });
  }, []);

  const handleRatingChange = (productId, newRating) => {
    fetch(`http://localhost:8000/api/products/${product_id}/rate/`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ rating: newRating }),
    })
      .then((response) => response.json())
      .then((updatedProduct) => {
        // Update the product in the state with the new rating
        setProducts((prevProducts) =>
          prevProducts.map((product) =>
            product.id === updatedProduct.id ? updatedProduct : product
          )
        );
      })
      .catch((error) => console.error("Error updating rating:", error));
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-semibold mb-6">Products</h1>
        <p>Loading products...</p>
      </div>
    );
  }

  return (
    <div className="">
      <Header />
      <div className="container mx-auto px-8 py-8">
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

      {/* Footer is placed here */}
      <Footer />
    </div>
  );
};

export default ProductsPage;
