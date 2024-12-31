import React, { useState } from "react";

const UploadProductPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    rating: "",
    category_id: "",
    image: null,
  });

  const [categories, setCategories] = useState([]);
  const [message, setMessage] = useState(null); // For displaying success/error messages
  const [isError, setIsError] = useState(false); // To differentiate success or error

  // Fetch categories from the backend (assumed to be available)
  React.useEffect(() => {
    fetch("http://localhost:8000/api/categories/")
      .then((response) => response.json())
      .then((data) => setCategories(data))
      .catch((error) => console.error("Error fetching categories:", error));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "image" ? e.target.files[0] : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const form = new FormData();
    Object.keys(formData).forEach((key) => form.append(key, formData[key]));

    fetch("http://localhost:8000/api/products/", {
      method: "POST",
      body: form,
    })
      .then((response) => {
        if (response.ok) {
          setMessage("Product uploaded successfully!");
          setIsError(false);
          return response.json();
        } else {
          throw new Error("Failed to upload product");
        }
      })
      .then((data) => {
        console.log("Product uploaded:", data);
        setFormData({
          name: "",
          description: "",
          price: "",
          stock: "",
          rating: "",
          category_id: "",
          image: null,
        });
      })
      .catch((error) => {
        console.error("Error uploading product:", error);
        setMessage("Error uploading product. Please try again.");
        setIsError(true);
      });
  };

  return (
    <div className="container mx-auto px-64 py-8">
      <h1 className="text-2xl font-semibold mb-6">Upload Product</h1>

      {message && (
        <div
          className={`p-4 mb-4 rounded-md ${
            isError ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"
          }`}
        >
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-semibold">Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full p-2 border rounded-md"
            required
          />
        </div>

        <div>
          <label className="block font-semibold">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="w-full p-2 border rounded-md"
            required
          ></textarea>
        </div>

        <div>
          <label className="block font-semibold">Price</label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            className="w-full p-2 border rounded-md"
            required
          />
        </div>

        <div>
          <label className="block font-semibold">Stock</label>
          <input
            type="number"
            name="stock"
            value={formData.stock}
            onChange={handleChange}
            className="w-full p-2 border rounded-md"
            required
          />
        </div>

        <div>
          <label className="block font-semibold">Rating</label>
          <input
            type="number"
            name="rating"
            value={formData.rating}
            onChange={handleChange}
            className="w-full p-2 border rounded-md"
            max="5"
            min="0"
            step="0.1"
            required
          />
        </div>

        <div>
          <label className="block font-semibold">Category</label>
          <select
            name="category_id"
            value={formData.category_id}
            onChange={handleChange}
            className="w-full p-2 border rounded-md"
            required
          >
            <option value="">Select Category</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block font-semibold">Image</label>
          <input
            type="file"
            name="image"
            onChange={handleChange}
            className="w-full p-2 border rounded-md"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full p-2 bg-blue-500 text-white rounded-md"
        >
          Upload Product
        </button>
      </form>
    </div>
  );
};

export default UploadProductPage;
