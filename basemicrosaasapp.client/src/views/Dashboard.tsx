import { useState, useEffect } from "react";
import { StatsBoard } from "../components/stats-board";
import CallApi from "../api/ApiHelper";
import { useAuth } from "../context/AuthContext";
import "./dashboard.css"

interface DashBoard {
    statsY: {
        [year: string]: {
            statsM: {
                [month: string]: {
                    totalDistance: number;
                    totalFuelCost: number;
                    averageFuelEconomy: number;
                    averagePricePerLitre: number;
                    workDistance: number;
                    personalDistance: number;
                };
            };
        };
    };
}
const Dashboard: React.FC = () => {
    const { setToken, token } = useAuth();
    const [dashboardData, setDashboardData] = useState<DashBoard | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            const response = await CallApi("/api/account/dashboard", 'GET', token);
            if (token !== response.token) { setToken(response.token); }
            // Assuming response.jsonData contains the dashboard data
            setDashboardData(response.jsonData as DashBoard);
        };
        fetchData();
    }, [token, setToken]);

    if (!dashboardData) {
        return (
        <div className="flex flex-col gap-6 m-2">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">Dashboard</h1>
            </div>
            <div>Not enough data to show the dasboard, please fill data</div>
        </div>
        )
    }

    return (
        <div className="flex flex-col gap-6 m-2">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">Dashboard</h1>
            </div>

            {/* TOTAL Stats Board */}
            <StatsBoard
                title="TOTAL"
                stats={[
                    { label: "Total Distance", value: dashboardData?.statsY[0]?.statsM[0].totalDistance.toString(), unit: "km" },
                    { label: "Avg. Fuel Economy", value: dashboardData?.statsY[0]?.statsM[0].averageFuelEconomy.toFixed(1), unit: "L/100km" },
                    { label: "Total Fuel Cost", value: dashboardData?.statsY[0]?.statsM[0].totalFuelCost.toFixed(2), unit: '\u20AC' },
                    { label: "Avg. Price per Liter", value: dashboardData?.statsY[0]?.statsM[0].averagePricePerLitre.toString(), unit: "\u20AC/L" },
                ]}
            />

            {/* PERSONAL Stats Board */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-5 shadow">
                <h2 className="text-lg font-bold mb-4 border-b border-gray-200 dark:border-gray-700 pb-2">PERSONAL</h2>
                <div className="flex flex-col gap-4">
                    <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                        <h3 className="text-xs text-gray-500 dark:text-gray-400 uppercase mb-1">Total Distance</h3>
                        <p className="text-xl font-semibold">
                            {dashboardData?.statsY[0]?.statsM[0].personalDistance} <span className="text-sm">km</span>
                        </p>
                    </div>
                </div>
            </div>

            {/* WORK Stats Board */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-5 shadow">
                <h2 className="text-lg font-bold mb-4 border-b border-gray-200 dark:border-gray-700 pb-2">WORK</h2>
                <div className="flex flex-col gap-4">
                    <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                        <h3 className="text-xs text-gray-500 dark:text-gray-400 uppercase mb-1">Total Distance</h3>
                        <p className="text-xl font-semibold">
                            {dashboardData?.statsY[0]?.statsM[0].workDistance} <span className="text-sm">km</span>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Dashboard;