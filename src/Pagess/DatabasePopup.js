// src/Pagess/DatabasePopup.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const DatabasePopup = ({ onClose }) => {
  const [form, setForm] = useState({ dbName: "", dbId: "" });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.dbName || !form.dbId) {
      alert("Please fill all fields!");
      return;
    }

    console.log("Database form submitted:", form);

    // ✅ Close popup
    onClose();

    // ✅ Redirect to dashboard page
    navigate("/dashboard");
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
      <div className="bg-white rounded-lg shadow-lg w-96 p-6 relative">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
        >
          ✕
        </button>

        <h2 className="text-xl font-bold mb-4 text-center">
          Connect to Database
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* DB Name */}
          <input
            type="text"
            name="dbName"
            placeholder="Enter Database Name"
            value={form.dbName}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none"
          />

          {/* DB ID */}
          <input
            type="text"
            name="dbId"
            placeholder="Enter Database ID"
            value={form.dbId}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none"
          />

          {/* Buttons inline */}
          <div className="flex justify-between gap-4 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2 bg-gray-400 text-white rounded-md hover:bg-gray-500 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DatabasePopup;
