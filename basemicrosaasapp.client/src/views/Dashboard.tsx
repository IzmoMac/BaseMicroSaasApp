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

// Dummy data to use when dashboardData is not available
const dummyDashboardData: DashBoard = {
    statsY: {
        "2024": {
            statsM: {
                "1": {
                    totalDistance: 1234,
                    totalFuelCost: 234.56,
                    averageFuelEconomy: 6.7,
                    averagePricePerLitre: 1.45,
                    workDistance: 800,
                    personalDistance: 434,
                }
            }
        }
    }
};

const Dashboard: React.FC = () => {
    const { setToken, token } = useAuth();
    const [dashboardData, setDashboardData] = useState<DashBoard | null>(null);
   /* const [usingDummy, setUsingDummy] = useState(false);*/

    useEffect(() => {
        const fetchData = async () => {
            const response = await CallApi("/api/account/dashboard", 'GET', token);
            if (token !== response.token) { setToken(response.token); }
            setDashboardData(response.jsonData as DashBoard);
        };
        fetchData();
    }, [token, setToken]);

    // Use dummy data if dashboardData is not available
    const dataToShow = dashboardData ?? dummyDashboardData;
    const showDummyBar = !dashboardData;

    // Get the first year and month keys
    const yearKey = Object.keys(dataToShow.statsY)[0];
    const monthKey = Object.keys(dataToShow.statsY[yearKey].statsM)[0];
    const stats = dataToShow.statsY[yearKey].statsM[monthKey];

    return (
        <div className="flex flex-col gap-6 m-2">
            {showDummyBar && (
                <div className="bg-yellow-200 text-yellow-800 px-4 py-2 rounded mb-2 font-semibold text-center shadow">
                    Dummy data
                </div>
            )}
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">Dashboard</h1>
            </div>

            {/* TOTAL Stats Board */}
            <StatsBoard
                title="TOTAL"
                stats={[
                    { label: "Total Distance", value: stats.totalDistance.toString(), unit: "km" },
                    { label: "Avg. Fuel Economy", value: stats.averageFuelEconomy.toFixed(1), unit: "L/100km" },
                    { label: "Total Fuel Cost", value: stats.totalFuelCost.toFixed(2), unit: '\u20AC' },
                    { label: "Avg. Price per Liter", value: stats.averagePricePerLitre.toString(), unit: "\u20AC/L" },
                ]}
            />

            {/* PERSONAL Stats Board */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-5 shadow">
                <h2 className="text-lg font-bold mb-4 border-b border-gray-200 dark:border-gray-700 pb-2">PERSONAL</h2>
                <div className="flex flex-col gap-4">
                    <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                        <h3 className="text-xs text-gray-500 dark:text-gray-400 uppercase mb-1">Total Distance</h3>
                        <p className="text-xl font-semibold">
                            {stats.personalDistance} <span className="text-sm">km</span>
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
                            {stats.workDistance} <span className="text-sm">km</span>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Dashboard;