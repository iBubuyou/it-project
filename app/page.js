"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import '../app/globals.css';

export default function Login() {
  const [formData, setFormData] = useState({
    Email: "",
    Password: "",
  });

  const [popupMessage, setPopupMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(null); // null, true, or false to track success or error
  const router = useRouter();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:8000/user/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ Email: formData.Email, Password: formData.Password }),
      });

      const result = await response.json();
      if (response.ok) {
        localStorage.setItem("token", result.token);
        localStorage.setItem("user", JSON.stringify(result.user));
        setPopupMessage("Successfully logged in");
        setIsSuccess(true);
        setTimeout(() => {
          setPopupMessage("");
          setIsSuccess(null);
          router.push("/home");
        }, 2000);
      } else {
        setPopupMessage("The login email or password was not found.");
        setIsSuccess(false);
      }
    } catch (error) {
      setPopupMessage("An error occurred while logging in");
      setIsSuccess(false);
    }
  };

  const closePopup = () => {
    setPopupMessage("");
    setIsSuccess(null);
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center lg:justify-end"
      style={{ backgroundImage: 'url("/pic.webp")', backgroundSize: 'cover', backgroundPosition: 'center' }}
    >
      <div className="max-w-md w-full mx-4 sm:mx-8 bg-white p-6 sm:p-8 border border-gray-300 rounded-lg shadow-lg relative">
        <div className="flex justify-center mb-4">
          <Image
            src="/itaw.png"
            width={200}
            height={200}
            alt="Logo of ITAW Clinic"
            priority={true}
            className="rounded-lg"
          />
        </div>

        <h1 className="text-2xl font-bold text-center mb-6 text-black sm:mb-8">Login</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700">Email:</label>
            <input
              type="email"
              name="Email"
              value={formData.Email}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded mt-1 text-black"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Password:</label>
            <input
              type="password"
              name="Password"
              value={formData.Password}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded mt-1 text-black"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-[#1d7581] text-white py-2 px-4 rounded-lg hover:bg-[#1d7581]/80 transition duration-200"
          >
            Submit
          </button>
        </form>

        <div className="text-center mt-4">
          <p className="text-gray-600">
            Don't have an account?{" "}
            <Link href="/signup" className="text-[#1d7581] hover:underline">
              Sign up here
            </Link>
          </p>
        </div>

        {/* Centered Popup for login status */}
        {popupMessage && (
  <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
    <div className="relative bg-white text-black p-6 rounded-lg shadow-lg max-w-xs text-center transition-opacity duration-300">
      {/* Close Button */}
      <button
        className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 focus:outline-none"
        onClick={closePopup}
      >
        ✕
      </button>

      {/* Icon and Message */}
      <div className="flex items-center justify-center mb-4">
        <div
          className={`${
            isSuccess ? "bg-green-500" : "bg-red-500"
          } rounded-full h-12 w-12 flex items-center justify-center text-2xl text-white font-bold`}
          style={{
            minWidth: "48px",  // Ensures a consistent circular shape
            minHeight: "48px",  // Ensures a consistent circular shape
          }}
        >
          {isSuccess ? "✓" : "✕"}
        </div>
      </div>
      <p className="text-lg font-semibold">{popupMessage}</p>
    </div>
  </div>
)}

      </div>
    </div>
  );
}