// import React from "react";
import ProductCard from "./components/ProductCard";

const App = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Products</h1>
      <div className="grid grid-cols-3 gap-4">
        <ProductCard name="Product 1" price="19.99" />
        <ProductCard name="Product 2" price="29.99" />
        <ProductCard name="Product 3" price="39.99" />
      </div>
    </div>
  );
};

export default App;
