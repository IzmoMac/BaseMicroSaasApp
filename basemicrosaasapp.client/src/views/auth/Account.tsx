import Cookies from 'js-cookie';
import { useEffect, useState } from "react";
import CallApi from "../../api/ApiHelper";
import { useAuth } from "../../context/AuthContext";

const Account: React.FC = () => {
    const [accountInfo, setAccountInfo] = useState({
        username: "",
        email: "",
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const { token, setToken } = useAuth();

    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [reNewPassword, setReNewPassword] = useState('');

    // Fetch account information
    useEffect(() => {
        const fetchAccountInfo = async () => {
            try {
                setLoading(true);

                const response = await CallApi("/api/auth/me", 'GET', token);
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
            if (confirm("Do you really want to delete your account permanently?")) {
                const response = await CallApi("/api/auth", 'delete', token);
                if (token !== response.token) { setToken(response.token); }



                Cookies.remove('refreshToken');
                Cookies.remove('userId');
                setToken(null);
                alert("Account deleted successfully.");
            }
        } catch (err) {
            setError("Failed to delete account.");
        }
    };

    //TODO WIP
    // Handle saving account updates
    const handleUpdatePassword = async () => {
        try {
            const formData: any = {
                oldPassword,
                newPassword,
                reNewPassword
            };
            const response = await CallApi("/api/auth/update-password", 'POST', token, JSON.stringify(formData));
            if (token !== response.token) { setToken(response.token); }

            alert("Your password was changed successfully, now you will need to login again.");

            Cookies.remove('refreshToken');
            Cookies.remove('userId');
            setToken(null);
        } catch (err) {
            const s = "Failed to save update your password."
            setError(s);
            alert(s);
        }
    };


    return (
        <div className="max-w-2xl mx-auto p-6 bg-white shadow-md rounded-lg">
            <h1 className="text-2xl font-bold text-gray-800 mb-4">Account</h1>
            {loading && <p className="text-blue-500">Loading...</p>}
            {error && <p className="text-red-500">{error}</p>}
            <div className="mb-6">
                <div className="flex">
                    <div className="text-md font-bold text-gray-700 mr-2">
                        Username/Email:
                    </div>
                    <div className="text-gray-800 text-md">
                        {accountInfo.username}
                    </div>
                </div>
            </div>

            <div>
                <h2 className="mb-4 text-md font-bold text-gray-700">Change Password</h2>
                <div className="mb-4">
                    <label htmlFor="oldPassword" className="block text-gray-700 text-sm font-medium mb-2">
                        Old Password
                    </label>
                    <input
                        type="password"
                        id="oldPassword"
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        placeholder="Enter your old password"
                        value={oldPassword}
                        onChange={(e) => setOldPassword(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="newPassword" className="block text-gray-700 text-sm font-medium mb-2">
                        New Password
                    </label>
                    <input
                        type="password"
                        id="newPassword"
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        placeholder="Enter your new password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="reNewPassword" className="block text-gray-700 text-sm font-medium mb-2">
                        New Password again
                    </label>
                    <input
                        type="password"
                        id="reNewPassword"
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        placeholder="Enter your new password again"
                        value={reNewPassword}
                        onChange={(e) => setReNewPassword(e.target.value)}
                        required
                    />
                </div>
            </div>
            <div className="mt-6 flex space-x-4">

                <button
                    onClick={handleUpdatePassword}
                    className="px-4 py-2 bg-blue-500 text-white rounded-md shadow hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    Change Password
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
