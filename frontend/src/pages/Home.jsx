import { useState, useEffect } from "react";
import axios from "axios";
import CategoryCard from "../components/CategoryCard";
import ProductCard from "../components/ProductCard";

const Home = () => {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:8000/api/categories/").then((response) => {
      setCategories(response.data);
    });
    axios.get("http://localhost:8000/api/products/").then((response) => {
      setProducts(response.data);
    });
  }, []);

  return (
    <div className="p-4">
      {/* <h1 className="text-2xl font-bold mb-4">Categories</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {categories.map((category) => (
          <CategoryCard key={category.id} category={category} />
        ))}
      </div> */}

      <h1 className="text-2xl font-bold mt-8 mb-4">Products</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default Home;
