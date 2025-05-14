import { FaTachometerAlt, FaGasPump, FaUser, FaCar, /*FaTable*/ } from "react-icons/fa";
import { NavLink, type NavLinkRenderProps } from 'react-router'

const ResponsiveNav: React.FC = () => {
    // Example navigation links
    const navLinks = [
        { href: '/app', name: 'Dashboard', icon: <FaTachometerAlt /> },
        { href: '/app/trip', name: 'Trip', icon: <FaCar /> },
        { href: '/app/fillup', name: 'Fill-up', icon: <FaGasPump /> },
        //{ href: '/app/data', name: 'Data', icon: <FaTable /> },
        { href: '/app/account', name: 'Account', icon: <FaUser /> },
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
                                <NavLink
                                    to={link.href} // Use link.path for the navigation target
                                    end={link.href === '/app'}
                                    className={({ isActive }: NavLinkRenderProps) =>
                                        `w-full text-left px-4 py-2 rounded transition-colors duration-200 cursor-pointer flex items-center ${isActive ? 'bg-gray-700 text-white' : 'hover:bg-gray-700 text-gray-300'}`
                                    }
                                >
                                    <span className="flex items-center">
                                        {link.icon && <span className="mr-2">{link.icon}</span>}
                                        {link.name}
                                    </span>
                                </NavLink>
                            </li>
                        ))}
                    </ul>
                </nav>
                {/* Account Tab at the bottom */}
                <div className="mt-auto">
                    <NavLink
                        to='/app/account'
                        className={({ isActive }: NavLinkRenderProps) =>
                            `w-full text-left px-4 py-2 rounded transition-colors duration-200 cursor-pointer flex items-center ${isActive ? 'bg-gray-700 text-white' : 'hover:bg-gray-700 text-gray-300'}`
                        }
                    >
                        <span className="flex items-center">
                            <div className="mr-2">
                                <FaUser />
                            </div>
                            Account
                        </span>
                    </NavLink>
                </div>
            </div>

            {/* Bottom Bar for smaller screens (below sm) */}
            <div className="sm:hidden fixed bottom-0 left-0 w-full h-16 bg-gray-900 text-white flex justify-around items-center px-4">
                <nav className="w-full">
                    <ul className="flex justify-around w-full">
                        {navLinks.map((link) => (
                            <li key={link.name}>
                                <NavLink
                                    to={link.href} // Use the link.path for navigation
                                    end={link.href === '/app'} // Add 'end' if '/app' is your exact dashboard path
                                    className={({ isActive }: NavLinkRenderProps) =>
                                        // Combine base classes with active classes conditionally
                                        //` cursor-pointer text-gray-700 hover:text-blue-400 ${isActive ? 'text-blue-400' : ''}`
                                        `flex flex-col items-center text-xs transition-colors duration-200 cursor-pointer flex items-center ${isActive ? 'text-blue-400' : ''}`
                                    }
                                >
                                    {/* Content remains the same as it was inside the button */}
                                    <span className="flex items-center">
                                        {link.icon && <span className="mr-2">{link.icon}</span>}
                                        {link.name}
                                    </span>
                                </NavLink>
                            </li>

                        ))}
                    </ul>
                </nav>
            </div>
        </>
    );
};

export default ResponsiveNav;
