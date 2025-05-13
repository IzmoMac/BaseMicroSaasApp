import { useState } from "react"
import { StatsBoard } from "./components/stats-board"
import CallApi from "./components/ApiHelper"
import { useAuth } from "./components/AuthContext";
//import { FaChevronDown } from 'react-icons/fa';
interface StatsMonth {
    TotalDistance: number;
    TotalFuelCost: number; // Using number for decimal
    AverageFuelEconomy: number; // Using number for decimal
    AveragePricePerLitre: number; // Using number for decimal
    WorkDistance: number; // Using number for decimal
    PersonalDistance: number; // Using number for decimal
}

interface DashBoard {
    Stats: {
        [key: string]: StatsMonth; // Represents Dictionary<(int, int), StatsMonth>
    };
}

export default function Dashboard() {

    //const [selectedYear, setSelectedYear] = useState("2025")
    //const [selectedMonth, setSelectedMonth] = useState("All")
    //const [showYearDropdown, setShowYearDropdown] = useState(false)
    //const [showMonthDropdown, setShowMonthDropdown] = useState(false)

    //const years = ["2025", "2024", "2023"]
    //const months = [
    //    "All",
    //    "January",
    //    "February",
    //    "March",
    //    "April",
    //    "May",
    //    "June",
    //    "July",
    //    "August",
    //    "September",
    //    "October",
    //    "November",
    //    "December",
    //]

    // Sample data - in a real app, this would come from your database
    const { setToken, token } = useAuth();
    CallApi("api/account/dashboard", 'GET', token)
        .then((data) => {
            if (token !== data.token) {
                setToken(data.token);
            }
            const stats = data.jsonData as DashBoard;
        });

    return (
        <div className="flex flex-col gap-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">Dashboard</h1>
            </div>

            {/* Filter Controls */}
            {/*<div className="flex gap-3">*/}
            {/*    */}{/* Year Dropdown */}
            {/*    <div className="relative flex-1">*/}
            {/*        <button*/}
            {/*            className="w-full flex items-center justify-between px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm"*/}
            {/*            onClick={() => setShowYearDropdown(!showYearDropdown)}*/}
            {/*        >*/}
            {/*            <span>{selectedYear}</span>*/}
            {/*            <FaChevronDown className="h-4 w-4" />*/}
            {/*        </button>*/}
            {/*        {showYearDropdown && (*/}
            {/*            <div className="absolute z-10 mt-1 w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-lg">*/}
            {/*                {years.map((year) => (*/}
            {/*                    <button*/}
            {/*                        key={year}*/}
            {/*                        className="block w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"*/}
            {/*                        onClick={() => {*/}
            {/*                            setSelectedYear(year)*/}
            {/*                            setShowYearDropdown(false)*/}
            {/*                        }}*/}
            {/*                    >*/}
            {/*                        {year}*/}
            {/*                    </button>*/}
            {/*                ))}*/}
            {/*            </div>*/}
            {/*        )}*/}
            {/*    </div>*/}

            {/*    */}{/* Month Dropdown */}
            {/*    <div className="relative flex-1">*/}
            {/*        <button*/}
            {/*            className="w-full flex items-center justify-between px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm"*/}
            {/*            onClick={() => setShowMonthDropdown(!showMonthDropdown)}*/}
            {/*        >*/}
            {/*            <span>{selectedMonth}</span>*/}
            {/*            <FaChevronDown className="h-4 w-4" />*/}
            {/*        </button>*/}
            {/*        {showMonthDropdown && (*/}
            {/*            <div className="absolute z-10 mt-1 w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-lg max-h-60 overflow-y-auto">*/}
            {/*                {months.map((month) => (*/}
            {/*                    <button*/}
            {/*                        key={month}*/}
            {/*                        className="block w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"*/}
            {/*                        onClick={() => {*/}
            {/*                            setSelectedMonth(month)*/}
            {/*                            setShowMonthDropdown(false)*/}
            {/*                        }}*/}
            {/*                    >*/}
            {/*                        {month}*/}
            {/*                    </button>*/}
            {/*                ))}*/}
            {/*            </div>*/}
            {/*        )}*/}
            {/*    </div>*/}
            {/*</div>*/}

            {/* TOTAL Stats Board */}
            <StatsBoard
                title="TOTAL"
                stats={[
                    { label: "Total Distance", value: stats[0,1], unit: "km" },
                    { label: "Avg. Fuel Economy", value: totalStats.economy, unit: "L/100km" },
                    { label: "Total Fuel Cost", value: totalStats.cost, unit: "" },
                    { label: "Avg. Price per Liter", value: totalStats.pricePerLiter, unit: "" },
                ]}
            />

            {/* PERSONAL Stats Board */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-5 shadow">
                <h2 className="text-lg font-bold mb-4 border-b border-gray-200 dark:border-gray-700 pb-2">PERSONAL</h2>
                <div className="flex flex-col gap-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                            <h3 className="text-xs text-gray-500 dark:text-gray-400 uppercase mb-1">Total Distance</h3>
                            <p className="text-xl font-semibold">
                                {personalStats.distance} <span className="text-sm">km</span>
                            </p>
                        </div>
                        <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                            <h3 className="text-xs text-gray-500 dark:text-gray-400 uppercase mb-1">Total Fuel Cost</h3>
                            <p className="text-xl font-semibold">{personalStats.cost}</p>
                        </div>
                    </div>

                    <div>
                        <h3 className="text-xs text-gray-500 dark:text-gray-400 uppercase mb-2">Monthly Cost ({selectedYear})</h3>
                        <MonthlyCarousel data={personalStats.monthlyData[selectedYear]} />
                    </div>
                </div>
            </div>

            {/* WORK Stats Board */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-5 shadow">
                <h2 className="text-lg font-bold mb-4 border-b border-gray-200 dark:border-gray-700 pb-2">WORK</h2>
                <div className="flex flex-col gap-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                            <h3 className="text-xs text-gray-500 dark:text-gray-400 uppercase mb-1">Total Distance</h3>
                            <p className="text-xl font-semibold">
                                {workStats.distance} <span className="text-sm">km</span>
                            </p>
                        </div>
                        <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                            <h3 className="text-xs text-gray-500 dark:text-gray-400 uppercase mb-1">Total Fuel Cost</h3>
                            <p className="text-xl font-semibold">{workStats.cost}</p>
                        </div>
                    </div>

                    <div>
                        <h3 className="text-xs text-gray-500 dark:text-gray-400 uppercase mb-2">Monthly Cost ({selectedYear})</h3>
                        <MonthlyCarousel data={workStats.monthlyData[selectedYear]} />
                    </div>
                </div>
            </div>
        </div>
    )
}
