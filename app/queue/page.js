"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FaEdit } from 'react-icons/fa';
import Navbar from '../navbar';
import Footer from '../footer';

export default function Schedule() {
    const [selectedYear, setSelectedYear] = useState('2023'); 
    const router = useRouter();
    const [selectedMonth, setSelectedMonth] = useState('January');
    const [selectedDate, setSelectedDate] = useState(1);
    const [daysInMonth, setDaysInMonth] = useState(getDaysInMonth(selectedMonth, selectedYear));
    const [isEditModalVisible, setIsEditModalVisible] = useState(false);

    const toggleEditModal = () => {
        setIsEditModalVisible(!isEditModalVisible);
    };

    const timeSlots = [];
    for (let hour = 9; hour < 19; hour++) {
        if (hour !== 12) {
            timeSlots.push(`${hour.toString().padStart(2, '0')}.00 - ${(hour + 1).toString().padStart(2, '0')}.00`);
        }
    }
    timeSlots.push("19.00 - 20.00");

    const bookingStatus = Array.from({ length: daysInMonth }, () =>
        Array.from({ length: timeSlots.length }, () => Math.random() < 0.5 ? 'booked' : 'available')
    );

    function getDaysInMonth(month, year) {
        const monthIndex = new Date(Date.parse(month + " 1, " + year)).getMonth();
        return new Date(year, monthIndex + 1, 0).getDate();
    }

    const handleMonthChange = (e) => {
        setSelectedMonth(e.target.value);
        setDaysInMonth(getDaysInMonth(e.target.value, selectedYear));
        setSelectedDate(1);
    };

    const handleDateChange = (e) => {
        setSelectedDate(e.target.value);
    };

    const handleYearChange = (e) => {
        const newYear = e.target.value;
        setSelectedYear(newYear);
        setDaysInMonth(getDaysInMonth(selectedMonth, newYear));
    };

    const handleReserveClick = () => {
        router.push('/reservation');
    };

    return (
        <div className="flex flex-col min-h-screen bg-cover bg-no-repeat" style={{ backgroundColor: "#FAEEE7" }}>
            <Navbar />

            <div className="flex flex-grow flex-col lg:flex-row">
                <aside className="hidden lg:w-52 lg:block bg-gray-800 p-4 text-white">
                    <p>Sidebar content (if any)</p>
                </aside>

                <main className="flex-grow p-4 text-black min-h-[calc(100vh-100px)] flex flex-col items-center relative">

                    <div className="flex flex-col lg:flex-row justify-between items-center my-5 w-full max-w-6xl">
                        <h2 className="text-3xl font-bold text-gray-700 mr-4 text-center lg:text-left">
                            Queue Table
                        </h2>

                        <div className="flex items-center mt-4 lg:mt-0">
                            <label htmlFor="month-dropdown" className="text-lg font-bold text-gray-700 mr-2">Select Month:</label>
                            <select 
                                id="month-dropdown" 
                                className="p-2 border rounded" 
                                value={selectedMonth} 
                                onChange={handleMonthChange}
                            >
                                {["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"].map((month, index) => (
                                    <option key={index} value={month}>{month}</option>
                                ))}
                            </select>

                            <FaEdit className="text-gray-600 cursor-pointer ml-4" onClick={toggleEditModal} />
                        </div>
                    </div>

                    {isEditModalVisible && (
                        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-40">
                            <div className="bg-white rounded-lg p-5 w-11/12 max-w-md">
                                <h3 className="text-lg font-semibold">Cancel Reservation</h3>
                                <p>Select an option:</p>
                                <div className="flex flex-col mt-3">
                                    <label htmlFor="year-dropdown-modal" className="text-lg font-bold mt-3">Select Year:</label>
                                    <select id="year-dropdown-modal" className="p-2 border rounded" value={selectedYear} onChange={handleYearChange}>
                                        {["2023", "2024", "2025", "2026"].map((year, index) => (
                                            <option key={index} value={year}>{year}</option>
                                        ))}
                                    </select>
                                    
                                    <label htmlFor="month-dropdown-modal" className="text-lg font-bold mt-3">Select Month:</label>
                                    <select id="month-dropdown-modal" className="p-2 border rounded" value={selectedMonth} onChange={handleMonthChange}>
                                        {["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"].map((month, index) => (
                                            <option key={index} value={month}>{month}</option>
                                        ))}
                                    </select>

                                    <label htmlFor="date-dropdown" className="text-lg font-bold mt-3">Select Day:</label>
                                    <select id="date-dropdown" className="p-2 border rounded" value={selectedDate} onChange={handleDateChange}>
                                        {[...Array(daysInMonth).keys()].map((day) => (
                                            <option key={day} value={day + 1}>{day + 1}</option>
                                        ))}
                                    </select>
                                    
                                    <button 
                                        className="mt-4 px-4 py-2 text-white bg-[#1d7581] rounded hover:bg-[#154f5a]"
                                        onClick={() => alert(`Cancel bookings for ${selectedDate} ${selectedMonth}, ${selectedYear}`)}
                                    >
                                        Confirm Cancellation for {selectedDate} {selectedMonth}, {selectedYear}
                                    </button>
                                    <button 
                                        className="mt-2 px-4 py-2 mb-2 text-white bg-gray-500 rounded hover:bg-gray-600"
                                        onClick={() => alert('Cancel all bookings for the month')}
                                    >
                                        Cancel All Reservations for the Month
                                    </button>
                                    <button 
                                        className="mt-2 text-gray-600 cursor-pointer text-right" 
                                        onClick={toggleEditModal}
                                    >
                                        Close
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="overflow-x-auto w-full mt-5">
                        <table className="border-collapse w-full max-w-6xl mx-auto">
                            <thead className="bg-teal-600 text-white">
                                <tr>
                                    <th className="border text-lg p-2">Date</th>
                                    {timeSlots.map((slot, index) => (
                                        <th key={index} className="border text-center text-sm p-2">
                                            <div className="flex flex-col items-center">
                                                <span>{slot}</span>
                                            </div>
                                        </th>
                                    ))}
                                </tr>
                            </thead>

                            <tbody className="bg-white">
                                {[...Array(daysInMonth).keys()].map((day) => (
                                    <tr key={day}>
                                        <td className="border text-center p-2 text-sm">{`${(day + 1).toString().padStart(2, '0')} / ${selectedMonth.substring(0, 3).toUpperCase()} / 67`}</td>
                                        {timeSlots.map((slot, index) => (
                                            <td key={index} className={`border text-center p-2 text-sm booking-cell ${bookingStatus[day][index]}`}></td>
                                        ))}
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
