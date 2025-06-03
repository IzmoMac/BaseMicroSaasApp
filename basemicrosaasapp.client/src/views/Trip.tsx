import TripDataTable from "@components/TripDataTable";
import { useAuth } from "@context/AuthContext";
import CallApi from "@utils/ApiHelper";
import React, { useState } from "react";
import { FaBriefcase, FaHome } from "react-icons/fa";
export default function Trip() {
    const [tripType, setTripType] = useState<"personal" | "work">("personal");
    const [tripDistance, setTripDistance] = useState("");
    const [odometerReading, setOdometerReading] = useState("");
    const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
    const [notes, setNotes] = useState("");
    const { token, setToken } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const formData = {
            tripType,
            tripDistance: parseFloat(tripDistance),
            odometerReading: parseFloat(odometerReading),
            date,
            notes
        };

        try {

            const response = await CallApi('/api/trip/record', 'POST', token, JSON.stringify(formData));
            if (token !== response.token) { setToken(response.token); }

            const result = response.jsonData;
            console.log(result.message);

            setTripDistance("");
            setOdometerReading("");
            setDate(new Date().toISOString().split("T")[0]);
            setNotes("");
            alert("Saved Succesfully");
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <div>
            <div className="flex flex-col gap-6 m-3">
                <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-bold">Trip</h1>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow">
                    <form className="flex flex-col gap-5" onSubmit={handleSubmit}>

                        {/* Trip Type Selector */}
                        <div className="flex flex-col gap-2 dark:text-gray-200">
                            <label className="text-sm font-medium">Trip Type</label>
                            <div className="flex p-1 bg-gray-100 dark:bg-gray-700 rounded-lg">
                                <button
                                    type="button"
                                    className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-md transition-all 
                                    ${tripType === "personal"
                                            ? "bg-white dark:bg-gray-600 shadow-sm cursor-default"
                                            : "text-gray-500 dark:text-gray-400 cursor-pointer"
                                        }`}
                                    onClick={() => setTripType("personal")}
                                >
                                    <div className="h-4 w-4">
                                        <FaHome />
                                    </div>
                                    <span >Personal</span>
                                </button>
                                <button
                                    type="button"
                                    className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-md transition-all 
                                ${tripType === "work"
                                            ? "bg-white dark:bg-gray-600 shadow-sm cursor-default"
                                            : "text-gray-500 dark:text-gray-400 cursor-pointer"
                                        }`}
                                    onClick={() => setTripType("work")}
                                >
                                    <div className="h-4 w-4">
                                        <FaBriefcase />  {/*Added Briefcase Icon*/}
                                    </div>
                                    <span>Work</span>
                                </button>
                            </div>
                        </div>


                        {/* Trip Distance */}
                        <div className="flex flex-col gap-2 dark:text-gray-200">
                            <label htmlFor="trip" className="text-sm font-medium">
                                Trip Distance
                            </label>
                            <input
                                type="number"
                                id="trip"
                                step="0.1"
                                placeholder="e.g. 100"
                                className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={tripDistance}
                                onChange={(e) => setTripDistance(e.target.value)}
                                required
                            />
                        </div>

                        {/* Odometer Reading */}
                        <div className="flex flex-col gap-2 dark:text-gray-200">
                            <label htmlFor="odometer" className="text-sm font-medium">
                                Odometer Reading (Optional)
                            </label>
                            <input
                                type="number"
                                id="odometer"
                                min="0"
                                placeholder="e.g. 12345"
                                className="px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={odometerReading}
                                onChange={(e) => setOdometerReading(e.target.value)}
                            />
                        </div>

                        {/* Date */}
                        <div className="flex flex-col gap-2 dark:text-gray-200">
                            <label htmlFor="date" className="text-sm font-medium">
                                Date
                            </label>
                            <div className="relative">
                                <input
                                    type="date"
                                    id="date"
                                    className="px-4 py-2 w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    value={date}
                                    onChange={(e) => setDate(e.target.value)}
                                    required
                                />
                                {/* Removed Calendar icon from lucide-react */}
                            </div>
                        </div>

                        {/*Notes Section */}
                        <div className="flex flex-col gap-2 dark:text-gray-200">
                            <label htmlFor="notes" className="text-sm font-medium">
                                Notes (Optional)
                            </label>
                            <textarea
                                id="notes"
                                placeholder="Add any additional notes here..."
                                className="px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[100px] resize-none"
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                            />
                        </div>

                        {/* Save button */}
                        <button
                            type="submit"
                            className="mt-2 w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition-colors duration-200"
                        >
                            Save Trip
                        </button>
                    </form>
                </div>
            </div>
            <TripDataTable />
        </div>
    );
}