import React, { useState } from 'react';
import { Link } from 'react-router';
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router";


const Login: React.FC = () => {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const { setToken } = useAuth();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        //const response =  
        fetch("/api/auth/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ username, password }),
            credentials: "include",
        }).then((response: any) => {
            if (!response.ok) {
                //TODO Add proper status message
                console.log("Login failed");

            }
            return response.json();
        }).then((data: any) => {
            if (data.token) {
                setToken(data.token);
                navigate('/app');
            }
        });
        //console.log('Login attempt with:', { username });
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm">
                <h2 className="text-2xl font-bold text-center mb-6">Login</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        {/* Changed label and input for username */}
                        <label htmlFor="username" className="block text-gray-700 text-sm font-bold mb-2">
                            Username
                        </label>
                        <input
                            type="text" // Changed input type
                            id="username"
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            placeholder="Enter your username" // Changed placeholder
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-6">
                        <label htmlFor="password" className="block text-gray-700 text-sm font-bold mb-2">
                            Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-2">
                        <button
                            type="submit"
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                        >
                            Login
                        </button>

                    </div>
                    <div className="mb-2">
                        <Link to="/register" className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800">
                            Need to register?
                        </Link>
                    </div>
                    <div className="mb-2">

                        <Link to="/" className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800">
                            Home
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login;
