"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";

const Navbar = () => {
    const [isClient, setIsClient] = useState(false);
    const [isOpen, setIsOpen] = useState(false); // State to toggle the sidebar
    const pathname = usePathname();

    useEffect(() => {
        setIsClient(true);
    }, [pathname]);

    const toggleNavbar = () => {
        setIsOpen(!isOpen);
    };

    return (
        <>
            {/* Hamburger Menu Button for mobile view */}
            <div className="flex items-center justify-between p-4 bg-teal-700 md:hidden">
                <img 
                    src="/w.png" 
                    className="logo w-12 h-12 cursor-pointer" 
                    alt="Logo" 
                    onClick={toggleNavbar} // Click on the logo to toggle the navbar
                />
            </div>

            {/* Sidebar */}
            <aside className={`sidebar w-64 bg-teal-700 text-white p-5 h-screen fixed left-0 z-10 flex flex-col items-center shadow-lg transition-transform duration-300 transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}>
                {!isClient ? (
                    <p></p> // Display this until the component is ready
                ) : (
                    <>
                        <img src="/w.png" className="logo w-44 h-44 mb-2 hidden md:block" alt="Logo" />
                        <nav>
                            <ul className="w-full text-center">
                                <li className={`mb-6 ${(pathname === "/home" || pathname === "/info") ? "active" : ""}`}>
                                    <Link href="/home" className={`block text-lg font-bold py-2 px-5 rounded-lg transition duration-300 ${(pathname === "/home" || pathname === "/info") ? "bg-white text-teal-700 border-2 border-teal-700" : "text-white"}`}>
                                        Home
                                    </Link>
                                </li>

                                <li className={`mb-6 ${(pathname === "/schedule" || pathname === "/queue" || pathname === "/reservation") ? "active" : ""}`}>
                                    <Link href="/schedule" className={`block text-lg font-bold py-2 px-5 rounded-lg transition duration-300 ${(pathname === "/schedule" || pathname === "/queue" || pathname === "/reservation") ? "bg-white text-teal-700 border-2 border-teal-700" : "text-white"}`}>
                                        Schedule
                                    </Link>
                                </li>
                                <li className={`mb-6 ${(pathname === "/account" || pathname === "/admin") ? "active" : ""}`}>
                                    <Link href="/account" className={`block text-lg font-bold py-2 px-5 rounded-lg transition duration-300 ${(pathname === "/account" || pathname === "/admin") ? "bg-white text-teal-700 border-2 border-teal-700" : "text-white"}`}>
                                        Account
                                    </Link>
                                </li>
                                <li className={`mb-6 ${pathname === "/" ? "active" : ""}`}>
                                    <Link href="/" className={`block text-lg font-bold py-2 px-5 rounded-lg transition duration-300 ${pathname === "/" ? "bg-white text-teal-700 border-2 border-teal-700" : "text-white"}`}>
                                        Logout
                                    </Link>
                                </li>
                            </ul>
                        </nav>
                    </>
                )}
            </aside>
        </>
    );
};

export default Navbar;
