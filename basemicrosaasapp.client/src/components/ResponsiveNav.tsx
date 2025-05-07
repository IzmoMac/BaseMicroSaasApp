import React, { useState } from 'react';

const ResponsiveNav: React.FC = () => {
    // Example navigation links
    const navLinks = [
        { name: 'Dashboard', href: '#' },
        { name: 'Settings', href: '#' },
        { name: 'Profile', href: '#' },
    ];

    // State to track the active tab
    const [activeTab, setActiveTab] = useState(navLinks[0].name);

    return (
        <>
            {/* Sidebar for larger screens (sm and up) */}
            <div className="hidden sm:flex fixed top-0 left-0 h-screen w-64 bg-gray-800 text-white flex-col p-4">
                {/* Sidebar content */}
                <div className="text-2xl font-bold mb-6">Admin Panel</div>
                <nav>
                    <ul>
                        {navLinks.map((link) => (
                            <li key={link.name} className="mb-2">
                                <a
                                    href={link.href}
                                    onClick={() => setActiveTab(link.name)}
                                    className={`block px-4 py-2 rounded transition-colors duration-200 ${
                                        activeTab === link.name
                                            ? 'bg-gray-700'
                                            : 'hover:bg-gray-700'
                                    }`}
                                >
                                    {link.name}
                                </a>
                            </li>
                        ))}
                    </ul>
                </nav>
            </div>

            {/* Bottom Bar for smaller screens (below sm) */}
            <div className="sm:hidden fixed bottom-0 left-0 w-full h-16 bg-gray-900 text-white flex justify-around items-center px-4">
                {/* Bottom Bar content */}
                <nav className="w-full">
                    <ul className="flex justify-around w-full">
                        {navLinks.map((link) => (
                            <li key={link.name}>
                                <a
                                    href={link.href}
                                    onClick={() => setActiveTab(link.name)}
                                    className={`flex flex-col items-center text-xs ${
                                        activeTab === link.name
                                            ? 'text-blue-400'
                                            : ''
                                    }`}
                                >
                                    {/* You might add icons here */}
                                    <span>{link.name}</span>
                                </a>
                            </li>
                        ))}
                    </ul>
                </nav>
            </div>
        </>
    );
};

export default ResponsiveNav;
