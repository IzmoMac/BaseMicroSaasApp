import React from 'react';
import { FaTachometerAlt, FaGasPump, FaUser, FaCar } from "react-icons/fa";

interface ResponsiveNavProps {
    activeTab: string;
    setActiveTab: (tabName: string) => void;
}

const ResponsiveNav: React.FC<ResponsiveNavProps> = ({ activeTab, setActiveTab }) => {
    // Example navigation links
    const navLinks = [
        { name: 'Dashboard', icon: <FaTachometerAlt /> },
        { name: 'Trip', icon: <FaCar /> },
        { name: 'Fill-up', icon: <FaGasPump /> },
        { name: 'Account', icon: <FaUser /> },
    ];

    return (
        <>
            {/* Sidebar for larger screens (sm and up) */}
            <div className="hidden sm:flex fixed top-0 left-0 h-screen w-64 bg-gray-800 text-white flex-col p-4">
                {/* Sidebar content */}
                <div className="text-2xl font-bold mb-6">Admin Panel</div>
                <nav className="flex-1">
                    <ul>
                        {navLinks.filter(link => link.name !== 'Account').map((link) => (
                            <li key={link.name} className="mb-2">
                                <button
                                    onClick={() => setActiveTab(link.name)}
                                    className={`w-full text-left px-4 py-2 rounded transition-colors duration-200 cursor-pointer ${activeTab === link.name
                                        ? 'bg-gray-700'
                                        : 'hover:bg-gray-700'
                                        }`}
                                >
                                    <span className="flex items-center">
                                        {link.icon && <span className="mr-2">{link.icon}</span>}
                                        {link.name}
                                    </span>
                                </button>
                            </li>
                        ))}
                    </ul>
                </nav>
                {/* Account Tab at the bottom */}
                <div className="mt-auto">
                    <button
                        onClick={() => setActiveTab('Account')}
                        className={`w-full text-left px-4 py-2 rounded transition-colors duration-200 cursor-pointer ${activeTab === 'Account'
                            ? 'bg-gray-700'
                            : 'hover:bg-gray-700'
                            }`}
                    >
                        <span className="flex items-center">
                            <FaUser className="mr-2" />
                            Account
                        </span>
                    </button>
                </div>
            </div>

            {/* Bottom Bar for smaller screens (below sm) */}
            <div className="sm:hidden fixed bottom-0 left-0 w-full h-16 bg-gray-900 text-white flex justify-around items-center px-4">
                <nav className="w-full">
                    <ul className="flex justify-around w-full">
                        {navLinks.map((link) => (
                            <li key={link.name}>
                                <button
                                    onClick={() => setActiveTab(link.name)}
                                    className={`flex flex-col items-center text-xs cursor-pointer ${activeTab === link.name
                                        ? 'text-blue-400'
                                        : ''
                                        }`}
                                >
                                    <span className="flex items-center">
                                        {link.icon && <span className="mr-2">{link.icon}</span>}
                                        {link.name}
                                    </span>
                                </button>
                            </li>
                        ))}
                    </ul>
                </nav>
            </div>
        </>
    );
};

export default ResponsiveNav;
