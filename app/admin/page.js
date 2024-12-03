"use client";

import { useState } from 'react';
import Navbar from '../navbar'; // Import the Navbar component
import Footer from '../footer'; // Import the Footer component
import { FaEdit } from 'react-icons/fa'; // Importing the edit icon

export default function Account() {
    const [isEditing, setIsEditing] = useState(false);
    const [accountData, setAccountData] = useState({
        name: '',
        lastname: '',
        phone: '',
        email: '',
        role: '' // Ensure the role field is included
    });

    const [bookingData, setBookingData] = useState([
        {
            id: 1, // Adding an ID for each booking
            name: 'John',
            lastname: 'Doe',
            phone: '123-456-7890',
            email: 'john.doe@example.com',
            date: '05 / 09 / 67',
            schedule: 'Vaccination',
            status: 'Confirmed'
        }
    ]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setAccountData(prevData => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleEditClick = () => {
        setIsEditing(true);
    };

    const handleSaveClick = () => {
        console.log('Saved data:', accountData);
        setIsEditing(false);
    };

    const handleBookingEditClick = () => {
        // Functionality for editing bookings can be added here
    };

    const handleBookingDeleteClick = () => {
        console.log('Booking deleted.'); // Placeholder for delete functionality
    };

    const handleBookingInputChange = (e, index) => {
        const { name, value } = e.target;
        const updatedBookings = [...bookingData];
        updatedBookings[index][name] = value;
        setBookingData(updatedBookings);
    };

    const [isPopupVisible, setIsPopupVisible] = useState(false);

    const togglePopup = () => {
        setIsPopupVisible(!isPopupVisible);
    };

    return (
        <div className="flex flex-col min-h-screen bg-cover bg-no-repeat" style={{ backgroundColor: "#FAEEE7" }}>
            <Navbar />

            {/* Notification Icon */}
            <div className="absolute top-2 right-2 z-20 cursor-pointer border-2 border-white rounded-full p-2 bg-black bg-opacity-50" onClick={togglePopup}>
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    fill="white"
                    viewBox="0 0 24 24"
                >
                    <path d="M12 24c1.657 0 3-1.343 3-3H9c0 1.657 1.343 3 3 3zm10-7v-6c0-5.523-4.477-10-10-10S2 5.477 2 11v6l-2 2v1h20v-1l-2-2z" />
                </svg>
            </div>

            {/* Popup Notification */}
            {isPopupVisible && (
                <div className="absolute top-12 right-2 bg-white bg-opacity-90 rounded-lg shadow-md text-gray-800 p-5 z-30 w-80">
                    <h3 className="font-semibold text-lg">Notifications</h3>
                    <p>Your notification content goes here.</p>
                    <div className="absolute top-2 right-2 cursor-pointer text-xl" onClick={togglePopup}>
                        &times;
                    </div>
                </div>
            )}

            <div className="flex-grow flex justify-center items-center">
                <main className="flex-grow p-5 text-black min-h-[calc(100vh-100px)] relative mx-auto max-w-2xl">
                    {/* Account Heading */}
                    <h1 className="my-5 text-3xl font-bold text-gray-700">Admin</h1>

                    {/* Account Details */}
                    <div className="text-left text-lg text-gray-700 mb-5 border border-gray-300 rounded-lg bg-white p-5 w-full max-w-md relative">
                        <div className="flex justify-between items-start mb-4">
                            <div className="flex-1 mr-4">
                                <label>Email:</label>
                                <input
                                    type="email" // Changed to email input type
                                    name="email"
                                    value={accountData.email}
                                    onChange={handleInputChange}
                                    disabled={!isEditing}
                                    className="bg-transparent border-b border-gray-300 focus:outline-none w-full"
                                />
                            </div>
                            <div className="flex-1 mr-4">
                                <label>Role:</label>
                                <input
                                    type="text"
                                    name="role"
                                    value={accountData.role}
                                    onChange={handleInputChange}
                                    disabled={!isEditing}
                                    className="bg-transparent border-b border-gray-300 focus:outline-none w-full"
                                />
                            </div>
                        </div>

                        {/* Edit Icon in the Top Right Corner */}
                        <div className="absolute top-2 right-2">
                            <FaEdit className="text-gray-600 cursor-pointer" onClick={handleEditClick} />
                        </div>
                    </div>

                    {/* Booking History */}
                    <h2 className="my-5 text-3xl font-bold text-gray-700">All Customer</h2>
                    <div className="mb-4 text-gray-700 border border-gray-300 rounded-lg bg-white p-5">
    {/* Wrapper for horizontal scrolling */}
    <div className="overflow-x-auto">
        <table className="min-w-full border-collapse bg-white rounded-lg border border-gray-300">
            <thead>
                <tr>
                    <th className="p-2 border-b border-gray-300 text-center text-gray-600">ID</th>
                    <th className="p-2 border-b border-gray-300 text-center text-gray-600">Name</th>
                    <th className="p-2 border-b border-gray-300 text-center text-gray-600">Lastname</th>
                    <th className="p-2 border-b border-gray-300 text-center text-gray-600">Phone</th>
                    <th className="p-2 border-b border-gray-300 text-center text-gray-600">Email</th>
                    <th className="p-2 border-b border-gray-300 text-center text-gray-600">Operation</th>
                </tr>
            </thead>
            <tbody>
                {bookingData.map((booking, index) => (
                    <tr key={index}>
                        <td className="p-3 border-b border-gray-300 text-center">{booking.id}</td>
                        <td className="p-3 border-b border-gray-300 text-center">{booking.name}</td>
                        <td className="p-3 border-b border-gray-300 text-center">{booking.lastname}</td>
                        <td className="p-3 border-b border-gray-300 text-center truncate">{booking.phone}</td>
                        <td className="p-3 border-b border-gray-300 text-center truncate">{booking.email}</td>
                        <td className="p-3 border-b border-gray-300 text-center">
                            <div className="flex space-x-2 justify-center">
                                <button className="bg-teal-600 py-1 px-3 rounded text-white hover:bg-teal-700 transition duration-200">
                                    Edit
                                </button>
                                <button className="bg-red-600 py-1 px-3 rounded text-white hover:bg-red-700 transition duration-200">
                                    Delete
                                </button>
                            </div>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
</div>



                    

                </main>
            </div>

            <Footer />
        </div>
    );
}
