import React, { useState, useEffect } from "react";
import { useAuth } from "./AuthContext";
import CallApi from "./ApiHelper";
import Cookies from 'js-cookie';
const Account: React.FC = () => {
    const [accountInfo, setAccountInfo] = useState({
        username: "",
        email: "",
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const { token, setToken } = useAuth();
    // Fetch account information
    useEffect(() => {
        const fetchAccountInfo = async () => {
            try {
                setLoading(true);

                const response = await CallApi("/api/account/me", 'GET', token);
                if (token !== response.token) { setToken(response.token); }

                setAccountInfo(response.jsonData);
            } catch (err) {
                setError("Failed to fetch account information.");
            } finally {
                setLoading(false);
            }
        };

        fetchAccountInfo();
    }, [token, setToken]);

    // Handle logout
    const handleLogout = async () => {
        try {
            
            //Here we dont use a apihelper, we just logout
            const response = await fetch("/api/auth/logout", {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },

            });

            if (!response.ok) {
                throw new Error("Failed to log out.");
            }

        } catch (err) {
            setError("Failed to log out.");
        } finally {
            Cookies.remove('refreshToken');
            Cookies.remove('userId');
            setToken(null);
        }
    };

    //TODO WIP
    // Handle account deletion
    const handleDelete = async () => {
        try {
            alert("Account deleted successfully.");
        } catch (err) {
            setError("Failed to delete account.");
        }
    };

    //TODO WIP
    // Handle saving account updates
    const handleSave = async () => {
        try {
            alert("Account information updated successfully.");
        } catch (err) {
            setError("Failed to save account information.");
        }
    };

    // Handle input changes
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setAccountInfo((prev) => ({ ...prev, [name]: value }));
    };

    return (
        <div className="max-w-2xl mx-auto p-6 bg-white shadow-md rounded-lg">
            <h1 className="text-2xl font-bold text-gray-800 mb-4">Account</h1>
            {loading && <p className="text-blue-500">Loading...</p>}
            {error && <p className="text-red-500">{error}</p>}
            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        Username:
                    </label>
                    <input
                        type="text"
                        name="username"
                        value={accountInfo.username}
                        onChange={handleChange}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        Email:
                    </label>
                    <input
                        type="email"
                        name="email"
                        value={accountInfo.email}
                        onChange={handleChange}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                </div>
            </div>
            <div className="mt-6 flex space-x-4">
                <button
                    onClick={handleSave}
                    className="px-4 py-2 bg-blue-500 text-white rounded-md shadow hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    Save
                </button>
                <button
                    onClick={handleLogout}
                    className="px-4 py-2 bg-yellow-500 text-white rounded-md shadow hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                >
                    Logout
                </button>
                <button
                    onClick={handleDelete}
                    className="px-4 py-2 bg-red-500 text-white rounded-md shadow hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                    Delete Account
                </button>
            </div>
        </div>
    );
}

export default Account;
