import React from 'react';
import { Link } from 'react-router';

const LandingPage: React.FC = () => {
    return (
        <div className="min-h-screen bg-gray-100 flex flex-col">
            {/* Navigation Bar */}
            <nav className="bg-white shadow-md p-4">
                <div className="container mx-auto flex justify-between items-center">
                    <div className="text-xl font-bold text-gray-800">CarTrack</div>
                    <div>
                        <Link
                            to="/app"
                            className="text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium"
                        >
                            App
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <div className="flex-grow flex items-center justify-center">
                <div className="text-center p-8">
                    <h1 className="text-4xl font-bold text-gray-800 mb-4">
                        Welcome to CarTrack
                    </h1>
                    <p className="text-xl text-gray-600 mb-8">
                        A simple saas to track your trips and fuel economy
                    </p>
                    <div className="space-x-4">
                        <Link
                            to="/app"
                            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-md"
                        >
                            Go to App
                        </Link>
                    </div>
                </div>
            </div>

            {/* Footer (Optional) */}
            <footer className="bg-gray-800 text-white p-4 text-center">
                <p>&copy; 2025 CarTrack. All rights reserved.</p>
            </footer>
        </div>
    );
};

export default LandingPage;
