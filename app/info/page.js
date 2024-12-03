"use client";

import { useState, useEffect, useRef } from 'react';
import Navbar from '../navbar';
import Footer from '../footer';

export default function Home() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isPopupVisible, setIsPopupVisible] = useState(false);
    const [images, setImages] = useState([
        { src: '/12.jpg' },
        { src: '/13.jpg' },
        { src: '/14.jpg' },
    ]);
    
    // Ref for file input to simulate click
    const fileInputRef = useRef(null);

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

    // Auto slide effect
    useEffect(() => {
        const interval = setInterval(() => {
            handleSlide(1); // Automatically move to the next slide
        }, 3000); // Change slide every 3 seconds

        return () => clearInterval(interval); // Cleanup on unmount
    }, []);

    // Handle image upload and update the current image in the slider
    const handleImageChange = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('image', file);

        try {
            const res = await fetch('/api/upload', {
                method: 'POST',
                body: formData,
            });

            if (!res.ok) {
                throw new Error('Failed to upload image');
            }

            const data = await res.json();

            // Update the current image in the slider
            setImages((prevImages) => {
                const updatedImages = [...prevImages];
                updatedImages[currentIndex].src = data.path;
                return updatedImages;
            });
        } catch (error) {
            console.error('Error uploading image:', error);
        }
    };

    // Function to trigger file input click
    const handleUploadClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    // Handle deleting the current image from the slider
    const handleDeleteImage = () => {
        setImages((prevImages) => {
            if (prevImages.length === 1) return prevImages; // Prevent deleting the last image
            const updatedImages = prevImages.filter((_, index) => index !== currentIndex);
            setCurrentIndex((prevIndex) => (prevIndex === updatedImages.length ? 0 : prevIndex)); // Reset index if necessary
            return updatedImages;
        });
    };

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
                            <div className="w-[90%] md:w-[700px] h-[300px] md:h-[400px] bg-cover bg-center rounded-lg relative" style={{ backgroundImage: `url(${images[currentIndex].src})` }}>
                                {/* Upload and Delete Buttons */}
                                <div className="absolute bottom-2 right-2 z-10 flex items-center space-x-2">
                                    <button 
                                        onClick={handleUploadClick} 
                                        className="bg-black text-white px-4 py-1 rounded-lg cursor-pointer"
                                    >
                                        Upload
                                    </button>
                                    <input 
                                        type="file" 
                                        ref={fileInputRef} 
                                        onChange={handleImageChange} 
                                        className="hidden"
                                    />

                                    <button 
                                        onClick={handleDeleteImage} 
                                        className="bg-black text-white px-4 py-1 rounded-lg cursor-pointer"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Dots indicator below the slider */}
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
                        <div className="absolute top-12 right-2 bg-white bg-opacity-90 rounded-lg shadow-lg p-4 z-20 w-72">
                            <h3 className="text-gray-700">Notifications</h3>
                            <p>Your notification content goes here.</p>
                            <div className="absolute top-2 right-2 cursor-pointer text-xl text-gray-700" onClick={togglePopup}>
                                &times;
                            </div>
                        </div>
                    )}

                    <h2 className="ml-12 mb-4 my-5 text-2xl lg:text-3xl font-bold text-gray-700 border-b-4 border-gray-300 pb-2">Terms of Use</h2>
                    <div className="ml-12 mt-2 text-gray-700">
                        <ul className="list-none">
                            <li>💡 Reservations can be edited 1 day before the appointment.</li>
                            <li>💡 Reservations can be canceled 1 day in advance of the appointment date.</li>
                        </ul>
                    </div>
                </main>
            </div>

            <Footer />
        </div>
    );
}
