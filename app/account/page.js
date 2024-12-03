"use client";

import { useState, useEffect } from 'react';
import Navbar from '../navbar';
import Footer from '../footer';
import axios from 'axios';

export default function Account() {
    const [isEditing, setIsEditing] = useState(false);
    const [accountData, setAccountData] = useState({
        CustomerName: '',
        CustomerLastname: '',
        CustomerPhone: '',
        CustomerMail: ''
    });
    const [bookingData, setBookingData] = useState([]);
    const [isPopupVisible, setIsPopupVisible] = useState(false);
    const [isDeleteConfirmationVisible, setIsDeleteConfirmationVisible] = useState(false);
    const [reservationToDelete, setReservationToDelete] = useState(null);
    

    const handleInputChange = (e) => {
        const { name, value } = e.target;
    
        if (name === "CustomerPhone") {
            setAccountData(prevData => ({
                ...prevData,
                [name]: value
            }));
    
        } else {
            setAccountData(prevData => ({
                ...prevData,
                [name]: value
            }));
        }
    };

    const handleEditClick = () => {
        setIsEditing(true);
    };

    const handleSaveClick = async () => {
        if (!/^\d{10}$/.test(accountData.CustomerPhone)) {
            alert("Phone number must be exactly 10 digits and numeric.");
            return;
        }

        try {
            const user = JSON.parse(localStorage.getItem('user'));
            await axios.put(`http://localhost:8000/customer/${user.CustomerID}`, accountData, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json',
                },
            });
            console.log('Saved data:', accountData);
            fetchAccountData(user.CustomerID);
            setIsEditing(false);
        } catch (error) {
            console.error('Error saving account data:', error);
            alert(`Error saving data: ${error.message}`);  // Display error to user
        }
    };
    

    const fetchAccountData = async (customerId) => {
        try {
            const res = await fetch(`http://localhost:8000/customer/${customerId}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json',
                },
            });
            if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
            const data = await res.json();
            setAccountData(data);
        } catch (err) {
            console.error('Error fetching account data:', err);
        }
    };

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'));
        if (user && user.CustomerID) {
            fetchAccountData(user.CustomerID);
            fetchReservationData(user.CustomerID);
        } else {
            console.error('No user found or CustomerID is missing');
        }
    }, []);

    const fetchReservationData = async (customerId) => {
        try {
            const res = await fetch(`http://localhost:8000/reserve/${customerId}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json',
                },
            });
            if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
            const data = await res.json();
            console.log(data)
            setBookingData(data);
        } catch (err) {
            console.error('Error fetching reservations:', err);
        }
    };

    const handleDeleteReservation = (appointId, reservationDate) => {
        setReservationToDelete({ appointId, reservationDate });
        setIsDeleteConfirmationVisible(true);
    };

    const confirmDeleteReservation = async (appointId) => {
        const reservationDateObj = new Date(reservationToDelete.reservationDate);
        const currentDate = new Date();

        reservationDateObj.setHours(0, 0, 0, 0);
        currentDate.setHours(0, 0, 0, 0);

        const differenceInTime = reservationDateObj - currentDate;
        const differenceInDays = differenceInTime / (1000 * 3600 * 24);

        if (differenceInDays <= 2) {
            alert("You can only delete reservations that are more than 3 days away.");
            return;
        }

        try {
            const response = await axios.delete(`http://localhost:8000/reserve/${appointId}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
            });
            alert(response.data.message);
            setBookingData(bookingData.filter((booking) => booking.AppointID !== appointId));
        } catch (error) {
            alert(error.response ? error.response.data.message : 'Error deleting reservation');
        } finally {
            setIsDeleteConfirmationVisible(false);
            setReservationToDelete(null);
        }
    };

    const cancelDeleteReservation = () => {
        setIsDeleteConfirmationVisible(false);
        setReservationToDelete(null);
    };

    const togglePopup = () => {
        setIsPopupVisible(!isPopupVisible);
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}-${month}-${year}`;
    };

    return (
        <div className="flex flex-col min-h-screen bg-cover bg-no-repeat" style={{ backgroundColor: "#FAEEE7" }}>
            <Navbar />
            {/* Notification Icon */}
            <div className="absolute top-2 right-2 z-20 cursor-pointer border-2 border-white rounded-full p-2 bg-black bg-opacity-50" onClick={togglePopup}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="white" viewBox="0 0 24 24">
                    <path d="M12 24c1.657 0 3-1.343 3-3H9c0 1.657 1.343 3 3 3zm10-7v-6c0-5.523-4.477-10-10-10S2 5.477 2 11v6l-2 2v1h20v-1l-2-2z" />
                </svg>
            </div>
            {/* Popup Notification */}
            {isPopupVisible && (
                        <div className='absolute top-12 right-2 '>
                            <div className="absolute top-2 right-2 cursor-pointer text-xl text-gray-700" onClick={togglePopup}>
                                &times;
                            </div>
                            {bookingData.length > 0 ? (
                                <div className='flex flex-col gap-2'>
                                    {bookingData.map((reservation) => (
                                        <div key={reservation.AppointID} className="bg-white bg-opacity-90 rounded-lg shadow-lg p-4 z-20 w-72">
                                            <h3 className="text-gray-700">Notifications</h3>
                                            <div className="absolute top-2 right-2 cursor-pointer text-xl text-gray-700" onClick={togglePopup}>
                                                &times;
                                            </div>
                                            <li className="text-gray-600">
                                                {reservation.ServiceName} - {formatDate(reservation.AppointDate)}
                                            </li>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p>No reservations found.</p>
                            )}
                        </div>
                    )}
            {/* Delete Confirmation Popup */}
            {isDeleteConfirmationVisible && (
                <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-90 z-40">
                    <div className="bg-white rounded-lg shadow-lg p-5 text-center">
                        <h2 className="text-lg font-bold text-black mb-4">Do you want to cancel your reservation?</h2>
                        <div className="flex justify-center">
                            <button 
                                className="bg-teal-500 text-white px-4 py-2 rounded hover:bg-teal-600 mr-2" 
                                onClick={() => confirmDeleteReservation(reservationToDelete.appointId)}>
                                Yes
                            </button>
                            <button 
                                className="bg-teal-500 text-white px-4 py-2 rounded hover:bg-teal-600" 
                                onClick={cancelDeleteReservation}>
                                No
                            </button>
                        </div>
                    </div>
                </div>
            )}
            <div className="flex-grow flex justify-center items-center">
                <main className="flex-grow p-5 text-black min-h-[calc(100vh-100px)] relative mx-auto max-w-2xl">
                    {/* Account Heading */}
                    <h1 className="my-5 text-3xl font-bold text-gray-700">Account</h1>
                    {/* Account Details */}
                    <div className="text-left text-lg text-gray-700 mb-5 border border-gray-300 rounded-lg bg-white p-5 w-full max-w-md relative">
                        <p className="mb-4">
                            Name:
                            <input
                                type="text"
                                name="CustomerName"
                                value={accountData.CustomerName}
                                onChange={handleInputChange}
                                disabled={!isEditing}
                                className="bg-transparent border-b border-gray-300 focus:outline-none w-full text-left"
                            />
                        </p>
                        <p className="mb-4">
                            Lastname:
                            <input
                                type="text"
                                name="CustomerLastname"
                                value={accountData.CustomerLastname}
                                onChange={handleInputChange}
                                disabled={!isEditing}
                                className="bg-transparent border-b border-gray-300 focus:outline-none w-full text-left"
                            />
                        </p>
                        <p className="mb-4">
                            Phone:
                            <input
                                type="text"
                                name="CustomerPhone"
                                value={accountData.CustomerPhone}
                                onChange={handleInputChange}
                                disabled={!isEditing}
                                className="bg-transparent border-b border-gray-300 focus:outline-none w-full text-left"
                            />
                        </p>
                        <p className="mb-4">
                            Email:
                            <input
                                type="text"
                                name="CustomerMail"
                                value={accountData.CustomerMail}
                                onChange={handleInputChange}
                                disabled={!isEditing}
                                className="bg-transparent border-b border-gray-300 focus:outline-none w-full text-left"
                            />
                        </p>
                        {isEditing ? (
                            <div className="flex justify-between">
                                <button className="bg-teal-500 text-white px-4 py-2 rounded hover:bg-teal-600" onClick={handleSaveClick}>
                                    Save
                                </button>
                                <button className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600" onClick={() => setIsEditing(false)}>
                                    Cancel
                                </button>
                            </div>
                        ) : (
                            <button className="bg-teal-500 text-white px-4 py-2 rounded hover:bg-teal-600" onClick={handleEditClick}>
                                Edit
                            </button>
                        )}
                    </div>
                    {/* Booking History */}
                    <h2 className="my-5 text-3xl font-bold text-gray-700">Reservation History</h2>
                    <div className="w-full max-w-2xl mb-4 text-gray-700 border border-gray-300 rounded-lg bg-white p-5">
                        <table className="w-full border-collapse bg-white">
                            <thead>
                                <tr>
                                    <th className="p-2 border-b">Date</th>
                                    <th className="p-2 border-b">Time</th>
                                    <th className="p-2 border-b">Service</th>
                                    <th className="p-2 border-b">Operation</th>
                                </tr>
                            </thead>
                            <tbody>
                                {bookingData.map((booking) => (
                                    <tr key={booking.AppointID}>
                                        <td className="p-2 border-b text-center">{formatDate(booking.AppointDate)}</td>
                                        <td className="p-2 border-b text-center">{booking.AppointTime}</td>
                                        <td className="p-2 border-b text-center">{booking.ServiceName}</td>
                                        <td className="p-2 border-b text-center">
                                            <button className="text-red-500" onClick={() => handleDeleteReservation(booking.AppointID, booking.AppointDate)}>
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </main>
            </div>
            <Footer />
        </div>
    );
}