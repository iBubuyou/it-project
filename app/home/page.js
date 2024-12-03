"use client";

import { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../navbar';
import Footer from '../footer';

export default function Home({ customerId }) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isPopupVisible, setIsPopupVisible] = useState(false);
    const [reservations, setReservations] = useState([]);
    const images = [
        { src: '/1.png' },
        { src: '/2.png' },
        { src: '/3.png' },
        { src: '/4.png' },
        { src: '/5.png' },
    ];

    const togglePopup = () => {
        setIsPopupVisible(!isPopupVisible);
    };

    const handleSlide = (direction) => {
        setCurrentIndex((prevIndex) => {
            const newIndex = prevIndex + direction;
            if (newIndex < 0) return images.length - 1;
            if (newIndex >= images.length) return 0;
            return newIndex;
        });
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

    // Fetch reservations when the page starts
    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'));

        fetchReservationData(user.CustomerID);
    }, []); // Only depend on customerId

    // Auto slide effect
    useEffect(() => {
        const interval = setInterval(() => {
            handleSlide(1);
        }, 3000);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="flex flex-col min-h-screen bg-cover bg-no-repeat" style={{ backgroundColor: "#FAEEE7" }}>
            <Navbar />

            <div className="relative w-full overflow-hidden">
                <img src="/pic.webp" className="w-full h-[150px] object-cover" alt="Top Image" />
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white text-3xl lg:text-5xl font-bold text-shadow-lg text-center">
                    WELCOME TO I TAW CLINIC
                </div>

                <div className="absolute top-2 right-2 z-10 cursor-pointer border-2 border-white rounded-full p-2 bg-black bg-opacity-50" onClick={togglePopup}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="white" viewBox="0 0 24 24">
                        <path d="M12 24c1.657 0 3-1.343 3-3H9c0 1.657 1.343 3 3 3zm10-7v-6c0-5.523-4.477-10-10-10S2 5.477 2 11v6l-2 2v1h20v-1l-2-2z" />
                    </svg>
                </div>
            </div>

            <div className="flex flex-grow flex-col lg:flex-row">
                <aside className="hidden lg:block w-52 bg-gray-800 text-white p-4">
                    <p>Sidebar content (if any)</p>
                </aside>

                <main className="flex-grow p-4 text-black flex flex-col">
                    <h2 className="ml-12 mb-4 my-5 text-2xl lg:text-3xl font-bold text-gray-700 border-b-4 border-gray-300 pb-2">Info</h2>

                    <div className="relative flex items-center justify-center my-5 w-full">
                        <div className="flex justify-center w-full">
                            <div className="w-[90%] md:w-[700px] h-[300px] md:h-[400px] bg-cover bg-center rounded-lg relative" style={{ backgroundImage: `url(${images[currentIndex].src})` }}></div>
                        </div>
                    </div>

                    <div className="flex justify-center mt-2">
                        {images.map((_, index) => (
                            <span
                                key={index}
                                className={`h-2 w-2 mx-1 rounded-full ${index === currentIndex ? 'bg-[#1d7581]' : 'bg-gray-500'}`}
                                onClick={() => setCurrentIndex(index)}
                            />
                        ))}
                    </div>

                    {isPopupVisible && (
                        <div className='absolute top-12 right-2'>
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


                    <h2 className="ml-12 mb-4 my-5 text-2xl lg:text-3xl font-bold text-gray-700 border-b-4 border-gray-300 pb-2">Terms of Use</h2>
                    <div className="ml-12 mt-2 text-gray-700">
                        <ul className="list-none">
                            <li>💡 Reservations can be canceled 3 days in advance of the appointment date.</li>
                        </ul>
                    </div>
                </main>
            </div>

            <Footer />
        </div>
    );
}
