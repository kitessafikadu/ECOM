import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/api/users/me", {
          withCredentials: true, // Include credentials for authentication
        });
        setUser(response.data);
      } catch (err) {
        console.error("Error fetching profile:", err);
        setError(
          err.response?.status === 401
            ? "You are not authorized. Please log in."
            : "Failed to load profile. Please try again."
        );
      }
    };

    fetchProfile();
  }, []);

  const handleEditProfile = () => {
    navigate("/profile/edit");
  };

  if (!user) {
    return error ? (
      <p className="text-red-600 text-center mt-4">{error}</p>
    ) : (
      <p className="text-center mt-4">Loading...</p>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="bg-white shadow-md rounded-lg p-6">
        {/* Profile Picture */}
        <div className="flex justify-center mb-4">
          <img
            src={user.profile_picture || "/placeholder-avatar.png"} // Fallback to placeholder
            alt={`${user.username}'s profile`}
            className="w-32 h-32 rounded-full object-cover"
          />
        </div>

        {/* User Details */}
        <h1 className="text-3xl font-bold text-center mb-4">{user.username}</h1>
        <p className="text-gray-600 text-center mb-2">
          <strong>Email:</strong> {user.email}
        </p>
        <p className="text-gray-600 text-center mb-2">
          <strong>Role:</strong> {user.role || "User"}
        </p>
        {/* Action Buttons */}
        <div className="flex justify-center mt-4">
          <button
            onClick={handleEditProfile}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            Edit Profile
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
