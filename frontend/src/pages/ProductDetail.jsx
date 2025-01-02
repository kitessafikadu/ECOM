import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    axios.get(`http://localhost:8000/api/products/${id}/`).then((response) => {
      setProduct(response.data);
    });
  }, [id]);

  if (!product) return <p>Loading...</p>;

  return (
    <div className="p-4">
      <img
        src={product.image}
        alt={product.name}
        className="w-full max-h-96 object-cover rounded-lg"
      />
      <h1 className="text-2xl font-bold mt-4">{product.name}</h1>
      <p className="mt-2 text-gray-700">{product.description}</p>
      <p className="mt-2 font-bold text-xl">${product.price}</p>
    </div>
  );
};

export default ProductDetail;
