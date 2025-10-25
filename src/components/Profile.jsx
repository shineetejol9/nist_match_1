// src/components/Profile.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

// Dynamically use backend URL depending on environment
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";


const Profile = () => {
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    age: "",
    gender: "",
    location: "",
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("https://your-backend.com/api/me", {
          method: "GET",
          credentials: "include",
        });

        if (!res.ok) throw new Error("Unauthorized");

        const data = await res.json();
        setUser(data);
        setFormData({
          age: data.age || "",
          gender: data.gender || "",
          location: data.location || "",
        });
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError(err.message);
        navigate("/login");
      }
    };

    fetchUser();
  }, [navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      const res = await fetch(`${API_URL}/api/saveProfile`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, _id: user._id }),
      });

      if (!res.ok) throw new Error("Failed to save profile");

      const data = await res.json();
      setUser(data.user);
      alert("Profile saved successfully!");
    } catch (err) {
      console.error(err);
      alert("Error saving profile: " + err.message);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-gray-900 text-white rounded-xl shadow-md">
      <h2 className="text-2xl font-bold mb-4">Welcome, {user.name}</h2>
      <img
        src={user.profilePic}
        alt="Profile"
        className="w-24 h-24 rounded-full mb-4"
      />
      <p className="text-sm mb-2">Email: {user.email}</p>

      <div className="space-y-3 mt-4">
        <input
          type="text"
          name="age"
          placeholder="Age"
          value={formData.age}
          onChange={handleChange}
          className="w-full p-2 rounded bg-gray-800 text-white"
        />
        <input
          type="text"
          name="gender"
          placeholder="Gender"
          value={formData.gender}
          onChange={handleChange}
          className="w-full p-2 rounded bg-gray-800 text-white"
        />
        <input
          type="text"
          name="location"
          placeholder="Location"
          value={formData.location}
          onChange={handleChange}
          className="w-full p-2 rounded bg-gray-800 text-white"
        />
      </div>

      <button
        onClick={handleSave}
        className="mt-4 w-full bg-purple-600 hover:bg-purple-700 transition-colors p-2 rounded font-bold"
      >
        Save Profile
      </button>
    </div>
  );
};

export default Profile;
