import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    role: "user",
    first_name: "",
    last_name: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch("http://127.0.0.1:8000/api/users/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    if (response.ok) {
      alert("Registration successful!");
      navigate("/login");
    } else {
      alert("Registration failed!");
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-xl font-semibold text-center mb-4">Register</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <input
            type="text"
            id="first_name"
            name="first_name"
            placeholder="Enter first name"
            value={formData.first_name}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md"
            required
          />
        </div>
        <div className="mb-4">
          <input
            type="text"
            id="last_name"
            name="last_name"
            placeholder="Enter last name"
            value={formData.last_name}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md"
            required
          />
        </div>
        <div className="mb-4">
          <input
            type="text"
            id="username"
            name="username"
            placeholder="Enter username"
            value={formData.username}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md"
            required
          />
        </div>
        <div className="mb-4">
          <input
            type="password"
            id="password"
            name="password"
            placeholder="Enter password"
            value={formData.password}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md"
            required
          />
        </div>
        <div className="mb-4">
          <select
            id="role"
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md"
          >
            <option value="" disabled>
              Select user type
            </option>
            <option value="user">User</option>
            <option value="seller">Seller</option>
          </select>
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded-md"
        >
          Register
        </button>
      </form>

      <div className="text-center mt-4">
        <p>
          Already have an account?{" "}
          <Link to="/login" className="text-blue-500 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
