"use client"; // Ensure this is at the top of the file

import { useState } from "react";
import axios from "axios";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation"; // Use 'next/navigation' for app directory

export default function Signup() {
  const router = useRouter(); // Create router instance
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    phone: "",
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(null); // null, true, or false

  const handleChange = (e) => {
    const { name, value } = e.target;
    // Update formData without restricting input
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Final validation for phone number before submission
    if (formData.phone.length !== 10) {
      setError("Phone number must be exactly 10 digits.");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post("http://localhost:8000/user/register", {
        FirstName: formData.firstname,
        LastName: formData.lastname,
        Phone: formData.phone,
        Email: formData.email,
        Password: formData.password,
      }, {
        withCredentials: true,
      });

      console.log("Registration successful:", response.data);
      setFormData({
        firstname: "",
        lastname: "",
        phone: "",
        email: "",
        password: "",
      });
      setError("");

      // Set success message for popup
      setPopupMessage("Successfully registered into the system.");
      setIsSuccess(true);

      // Redirect to login page after 3 seconds
      setTimeout(() => {
        setPopupMessage("");
        setIsSuccess(null);
        router.push("/"); // Redirect to the login page
      }, 3000);

    } catch (error) {
      console.error("Error during registration:", error);
      setError("Registration failed. Please try again.");

      // Set error message for popup
      setPopupMessage("Unable to register into the system.");
      setIsSuccess(false);
    } finally {
      setLoading(false);
    }
  };
  
  // Close popup function
  const closePopup = () => {
    setPopupMessage("");
    setIsSuccess(null);
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{ backgroundImage: 'url("/pic.webp")', backgroundSize: 'cover', backgroundPosition: 'center' }}
    >
      <div className="hidden md:block w-1/2 h-full bg-cover bg-center" style={{ backgroundImage: 'url("/pic.webp")' }}></div>

      <div className="max-w-md w-full mx-6 my-8 bg-white p-6 border border-gray-300 rounded-lg shadow-lg relative md:mr-[-8rem] lg:mr-[-10rem]">
        <div className="flex justify-center mb-4">
          <Image
            src="/itaw.png"
            width={200}
            height={200}
            className="rounded-lg"
            alt="Logo"
            priority
          />
        </div>
        <h1 className="text-2xl font-bold text-center mb-8 text-black">Sign Up</h1>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700">First Name:</label>
            <input
              type="text"
              name="firstname"
              value={formData.firstname}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded mt-1 text-black"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Last Name:</label>
            <input
              type="text"
              name="lastname"
              value={formData.lastname}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded mt-1 text-black"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Phone:</label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded mt-1 text-black"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Email:</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded mt-1 text-black"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Password:</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded mt-1 text-black"
              required
            />
          </div>
          <button
            type="submit"
            className={`w-full py-2 px-4 rounded-lg transition duration-200 ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#1d7581] text-white hover:bg-[#1d7581]/80'}`}
            disabled={loading}
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </form>

        <div className="text-center mt-4">
          <p className="text-gray-600">
            Already have an account?{" "}
            <Link href="/" className="text-[#1d7581] hover:underline">
              Login here
            </Link>
          </p>
        </div>

        {popupMessage && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="relative bg-white text-black p-6 rounded-lg shadow-lg max-w-sm w-full text-center transition-opacity duration-300">
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
