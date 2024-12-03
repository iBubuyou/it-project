"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import Navbar from '../navbar';
import Footer from '../footer';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export default function Schedule() {
    const router = useRouter();
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const currentMonth = monthNames[new Date().getMonth()];

    const [selectedMonth, setSelectedMonth] = useState(currentMonth);
    const [daysInMonth, setDaysInMonth] = useState(getDaysInMonth(currentMonth));
    const [reservations, setReservations] = useState([]);
    const [notifications, setNotifications] = useState([]);
    const [isPopupVisible, setIsPopupVisible] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [notificationss, setNotificationss] = useState([]);

    const timeSlots = generateTimeSlots();

    useEffect(() => {
        async function fetchReservations() {
            setIsLoading(true);
            try {
                const response = await axios.get(`${BASE_URL}/reservation`, {
                    params: { month: selectedMonth }
                });
                setReservations(response.data.reservations);
                console.log('Fetched Reservations: ', response.data.reservations); // Check the fetched data
                setErrorMessage('');
            } catch (error) {
                console.error("Failed to fetch reservations:", error);
                setErrorMessage(error.response ? `Error: ${error.response.data.message}` : 'Network error, please try again later.');
            } finally {
                setIsLoading(false);
            }
        }
        fetchReservations();
    }, [selectedMonth]);
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}-${month}-${year}`;
    };

    const fetchNotificationss = async (CustomerID) => {
        if (CustomerID) {
            try {
                const res = await axios.get(`http://localhost:8000/reserve/${CustomerID}`, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                        'Content-Type': 'application/json',
                    },
                });
                console.log(res)

                setNotificationss(res.data);
            } catch (error) {
                console.error("Failed to fetch reservation data:", error);
            }
        }
    };

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'));

        fetchNotificationss(user.CustomerID);
    }, []); // Only depend on customerId
    


    const togglePopup = async () => {
        setIsPopupVisible(!isPopupVisible);
    };

    const handleMonthChange = (e) => {
        const month = e.target.value;
        setSelectedMonth(month);
        setDaysInMonth(getDaysInMonth(month));
    };

    const currentYear = new Date().getFullYear();

    const isSlotBooked = (day, slot) => {
        const monthIndex = monthNames.indexOf(selectedMonth) + 1; // Month index (1-12)
        const formattedDate = new Date(currentYear, monthIndex - 1, day); // Create a date object
        const formattedDateString = formattedDate.toISOString().split('T')[0]; // Format to YYYY-MM-DD
    
        return reservations.some(reservation => {
            const reservationDate = new Date(reservation.AppointDate);
            const reservationDateString = reservationDate.toISOString().split('T')[0]; // Format reservation date
    
            // Format reservation time
            const reservationTime = reservation.AppointTime.split(':').slice(0, 2).join(':') + ' - ' + 
                (parseInt(reservation.AppointTime.split(':')[0]) + 1).toString().padStart(2, '0') + ':00';
    
            const isBooked = reservationDateString === formattedDateString && slot === reservationTime;
    
            if (isBooked) {
                console.log(`Booked: ${reservation.AppointDate} at ${reservation.AppointTime}`); // Log if booked
            }
    
            return isBooked;
        });
    };
    
    



    return (
        <div className="flex flex-col min-h-screen bg-cover bg-no-repeat" style={{ backgroundColor: "#FAEEE7" }}>
            <Navbar />
            <div className="flex flex-grow relative">
                <aside className="hidden lg:block w-52 bg-gray-800 p-4 text-white">
                    <p>Sidebar content (if any)</p>
                </aside>
                <main className="flex-grow p-4 text-black min-h-[calc(100vh-100px)] flex flex-col items-center">
                    <div className="absolute top-2 right-2 cursor-pointer p-2 bg-black bg-opacity-50 rounded-full" onClick={togglePopup} aria-label="Toggle notifications">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="white" viewBox="0 0 24 24">
                            <path d="M12 24c1.657 0 3-1.343 3-3H9c0 1.657 1.343 3 3 3zm10-7v-6c0-5.523-4.477-10-10-10S2 5.477 2 11v6l-2 2v1h20v-1l-2-2z" />
                        </svg>
                    </div>

                    {isPopupVisible && (
                        <div className='absolute top-12 right-2 '>
                            <div className="absolute top-2 right-2 cursor-pointer text-xl text-gray-700" onClick={togglePopup}>
                                &times;
                            </div>
                            {notificationss.length > 0 ? (
                                <div className='flex flex-col gap-2'>
                                    {notificationss.map((reservation) => (
                                        
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

                    <h2 className="text-center my-5 text-2xl md:text-3xl font-bold text-gray-700">Queue Table</h2>

                    {errorMessage && <p className="text-red-500">{errorMessage}</p>}
                    {isLoading && <p>Loading reservations...</p>}

                    <div className="flex items-center mt-5">
                        <label htmlFor="month-dropdown" className="mr-2 text-lg font-bold text-gray-600">Select Month:</label>
                        <select id="month-dropdown" aria-label="Select Month" className="p-2 text-lg border rounded" value={selectedMonth} onChange={handleMonthChange}>
                            {monthNames.map((month, index) => (
                                <option key={index} value={month}>{month}</option>
                            ))}
                        </select>
                    </div>

                    <div className="overflow-x-auto w-full mt-5">
                        <table className="border-collapse w-full max-w-6xl mx-auto">
                            <thead className="bg-teal-600 text-white">
                                <tr>
                                    <th className="border text-lg p-2">Date</th>
                                    {timeSlots.map((slot, index) => (
                                        <th key={index} className="border text-lg p-2">{slot}</th> // Use <th> for slot headers
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {[...Array(daysInMonth).keys()].map(day => (
                                    <tr key={day} className="bg-white">
                                        <td className="border text-center p-2 text-sm">
                                            {`${(day + 1).toString().padStart(2, '0')} / ${selectedMonth.substring(0, 3).toUpperCase()} / ${currentYear}`}
                                        </td>
                                        {timeSlots.map((slot, index) => (
                                            <td key={index} className={`border text-center p-2 ${isSlotBooked(day + 1, slot) ? 'bg-red-500' : ''}`}></td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>


                    </div>

                    <div className="mt-5">
                        <button className="px-4 py-2 mb-4 text-white bg-teal-600 rounded hover:bg-teal-700" onClick={() => router.push('/reservation')}>Reserve</button>
                    </div>
                </main>
            </div>
            <Footer />
        </div>
    );
}

function generateTimeSlots() {
    const slots = [];
    for (let hour = 9; hour < 19; hour++) {
        if (hour !== 12) {
            slots.push(`${hour.toString().padStart(2, '0')}:00 - ${(hour + 1).toString().padStart(2, '0')}:00`);
        }
    }
    slots.push("19:00 - 20:00"); // Ensure formatting is consistent
    return slots;
}


function getDaysInMonth(month) {
    const currentYear = new Date().getFullYear();
    const monthIndex = new Date(Date.parse(month + " 1, " + currentYear)).getMonth();
    if (isNaN(monthIndex)) {
        console.error("Invalid month:", month);
        return 30;
    }
    return new Date(currentYear, monthIndex + 1, 0).getDate();
}
