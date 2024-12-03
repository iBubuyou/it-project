"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '../navbar';
import Footer from '../footer';
import axios from 'axios';

export default function Reservation() {
    const router = useRouter();
    const [user, setUser] = useState(null); // State to hold user data
    const [reservations, setReservations] = useState([])

    // Use effect to load user data from localStorage
    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            setUser(JSON.parse(storedUser));
            console.log("user", JSON.parse(storedUser).CustomerID);
        } else {
            alert('User not found. Please log in.');
            router.push('/login');
        }
    }, [router]);

    const [formData, setFormData] = useState({
        petName: '',
        age: '',
        type: '',
        sex: '',
        breed: '',
        service: '',
        date: '',
        time: '', // Only hold hour value
        ampm: 'AM', // State for AM/PM
    });

    const [isPopupVisible, setIsPopupVisible] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;

        // Limit phone number to 10 digits
        if (name === "phone" && value.length > 10) {
            return; // prevent further input if the length is more than 10
        }

        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: value,
        }));
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}-${month}-${year}`;
    };

    const fetchReservationData = async (CustomerID) => {
        if (CustomerID) {
            try {
                const res = await axios.get(`http://localhost:8000/reserve/${CustomerID}`, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                        'Content-Type': 'application/json',
                    },
                });
                console.log(res)

                setReservations(res.data);
            } catch (error) {
                console.error("Failed to fetch reservation data:", error);
            }
        }
    };

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'));

        fetchReservationData(user.CustomerID);
    }, []); // Only depend on customerId

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        const petData = {
            PetName: formData.petName,
            PetType: formData.type,
            PetBreed: formData.breed,
            PetAge: formData.age,
            PetSex: formData.sex,
        };
        console.log("Pet Data:", petData); // Log pet data
    
        const token = localStorage.getItem('token'); // Read token from localStorage
    
        try {
            const petResponse = await fetch('http://localhost:8000/petadd', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`, // Attach token
                },
                body: JSON.stringify(petData),
            });
    
            if (petResponse.status === 401) {
                // Token expired or invalid
                alert('Session expired. Please log in again.');
                router.push('/login');
                return;
            }
    
            if (!petResponse.ok) {
                throw new Error('Failed to add pet');
            }
    
            const pet = await petResponse.json(); // Await pet data here for further use
            console.log('petid:', pet)
    
            const reservationData = {
                CustomerID: user.CustomerID,  // Using the fetched user
                PetID: pet.petId,             // PetID should come from `pet` response
                ServiceID: formData.service,  // Replace with actual ServiceID
                AppointDate: formData.date,
                AppointTime: `${formData.time}:00`, // Fixed format without AM/PM
            };
    
            console.log("Reservation Data:", reservationData); // Log reservation data
    
            const reservationResponse = await fetch('http://localhost:8000/reserve', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`, // Attach token
                },
                body: JSON.stringify(reservationData),
            });
    
            if (reservationResponse.status === 401) {
                // Token expired or invalid
                alert('Session expired. Please log in again.');
                router.push('/login');
                return;
            }
    
            if (!reservationResponse.ok) {
                throw new Error('Failed to make reservation');
            }
    
            const data = await reservationResponse.json();
            console.log('Success:', data);
            router.push('/schedule');
    
        } catch (error) {
            console.error('Error:', error);
        }
    };
    

    const togglePopup = () => {
        setIsPopupVisible(!isPopupVisible);
    };

    return (
        <div className="flex flex-col h-screen bg-cover bg-no-repeat" style={{ backgroundColor: "#FAEEE7" }}>
            <Navbar />

            <div className="flex flex-grow justify-center items-center">
                <main className="flex-grow p-5 text-black h-full flex flex-col items-center relative">
                    <div className="absolute top-2 right-2 z-20 cursor-pointer border-2 border-white rounded-full p-2 bg-black bg-opacity-50" onClick={togglePopup}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="white" viewBox="0 0 24 24">
                            <path d="M12 24c1.657 0 3-1.343 3-3H9c0 1.657 1.343 3 3 3zm10-7v-6c0-5.523-4.477-10-10-10S2 5.477 2 11v6l-2 2v1h20v-1l-2-2z" />
                        </svg>
                    </div>

                    {isPopupVisible && (
                        <div className='absolute top-12 right-2 '>
                            <div className="absolute top-2 right-2 cursor-pointer text-xl text-gray-700" onClick={togglePopup}>
                                &times;
                            </div>
                            {reservations.length > 0 ? (
                                <div className='flex flex-col gap-2'>
                                    {reservations.map((reservation) => (
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

                    <h1 className="text-center my-5 text-4xl text-gray-600 font-bold">Reservation</h1>

                    <form className="w-full max-w-lg p-5 rounded-lg bg-white shadow-lg flex flex-col gap-4" onSubmit={handleSubmit}>
                        <div className="flex justify-between gap-4">
                            <div className="flex flex-col flex-1">
                                <label className="font-bold mb-1">Pet Name:</label>
                                <input
                                    type="text"
                                    name="petName"
                                    value={formData.petName}
                                    onChange={handleChange}
                                    className="p-2 border border-gray-300 rounded"
                                />
                            </div>
                            <div className="flex flex-col flex-1">
                                <label className="font-bold mb-1">Age:</label>
                                <input
                                    type="text"
                                    name="age"
                                    value={formData.age}
                                    onChange={handleChange}
                                    className="p-2 border border-gray-300 rounded"
                                />
                            </div>
                        </div>
                        <div className="flex justify-between gap-4">
                            <div className="flex flex-col flex-1">
                                <label className="font-bold mb-1">Type:</label>
                                <input
                                    type="text"
                                    name="type"
                                    value={formData.type}
                                    onChange={handleChange}
                                    className="p-2 border border-gray-300 rounded"
                                />
                            </div>
                            <div className="flex flex-col flex-1">
                                <label className="font-bold mb-1">Sex:</label>
                                <select
                                    name="sex"
                                    value={formData.sex}
                                    onChange={handleChange}
                                    className="p-2 border border-gray-300 rounded"
                                >
                                    <option value="">Select sex</option>
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                </select>
                            </div>
                        </div>
                        <div className="flex justify-between gap-4">
                            <div className="flex flex-col flex-1">
                                <label className="font-bold mb-1">Breed:</label>
                                <input
                                    type="text"
                                    name="breed"
                                    value={formData.breed}
                                    onChange={handleChange}
                                    className="p-2 border border-gray-300 rounded"
                                />
                            </div>
                            <div className="flex flex-col flex-1">
                                <label className="font-bold mb-1">Service:</label>
                                <select
                                    name="service"
                                    value={formData.service}
                                    onChange={handleChange}
                                    className="p-2 border border-gray-300 rounded"
                                >
                                    <option value="">Select a service</option>
                                    <option value="1">General checkup</option>
                                    <option value="2">Vaccination</option>
                                    <option value="4">Sterilization</option>
                                    <option value="5">Ultrasound</option>
                                </select>
                            </div>
                        </div>
                        <div className="flex justify-between gap-4">
                            <div className="flex flex-col flex-1">
                                <label className="font-bold mb-1">Date:</label>
                                <input
                                    type="date"
                                    name="date"
                                    value={formData.date}
                                    onChange={handleChange}
                                    className="p-2 border border-gray-300 rounded"
                                />
                            </div>
                            <div className="flex flex-col flex-1">
                                <label className="font-bold mb-1">Time:</label>
                                <div className="flex">
                                    <select
                                        name="time"
                                        value={formData.time}
                                        onChange={handleChange}
                                        className="p-2 border border-gray-300 rounded flex-1"
                                    >
                                        <option value="">Hour</option>
                                        {/* Options for 9 - 11 */}
                                        {[...Array(3).keys()].map(hour => (
                                            <option key={`morning-${hour + 9}`} value={hour + 9}>{hour + 9}</option> // 9, 10, 11
                                        ))}
                                        {/* Options for 13 - 19 */}
                                        {[...Array(7).keys()].map(hour => (
                                            <option key={`afternoon-${hour + 13}`} value={hour + 13}>{hour + 13}</option> // 13 to 19
                                        ))}
                                    </select>
                                </div>
                            </div>

                        </div>
                        <button type="submit" className="mt-4 bg-teal-600 text-white p-2 rounded hover:bg-blue-600 transition">Reserve</button>
                    </form>
                </main>
            </div>

            <Footer />
        </div>
    );
}
