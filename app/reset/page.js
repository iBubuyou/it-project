"use client";

import { useState } from "react";
import Link from "next/link"; // Import Link component for navigation
import Image from "next/image"; // Import Image component

export default function ResetPassword() {
  const [formData, setFormData] = useState({
    username: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // You can add your password reset logic here
    console.log(formData);
  };

  return (
    <div
      className="min-h-screen flex flex-col justify-center"
      style={{ backgroundImage: 'url("/d1.jpg")', backgroundSize: 'cover', backgroundPosition: 'center' }}
    >
      <div className="max-w-md w-full mx-auto bg-white p-8 border border-gray-300 bg-opacity-90 rounded-lg shadow-lg relative">
        {/* Image above the login heading */}
        <div className="flex justify-center mb-4"> {/* Centering the image */}
          <Image
            src="/itaw.png" // Replace with your image path
            width={200} // Adjusted width
            height={200} // Adjusted height
            className="rounded-lg" // Add rounding
          />
        </div>
        <h1 className="text-2xl font-bold text-center mb-8 text-black">Reset Password</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700">Username:</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded mt-1"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">New Password:</label>
            <input
              type="password"
              name="newPassword"
              value={formData.newPassword}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded mt-1"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Confirm Password:</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded mt-1"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-200"
          >
            Reset Password
          </button>
        </form>

        <div className="text-center mt-4">
          <p className="text-gray-600">
            Remembered your password?{" "}
            <Link href="/" className="text-blue-500 hover:underline">
              Login here
            </Link>
          </p>
        </div>

    
      </div>
    </div>
  );
}
