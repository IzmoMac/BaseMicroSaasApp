import type React from "react";

import { useState, useEffect } from "react";
import { FaCheck } from "react-icons/fa";
import api from './components/api';
//import { HiHome, HiBriefcase } from 'react-icons/hi';
export default function FillUp() {
    const [odometerReading, setOdometerReading] = useState("");
    const [fuelAmount, setFuelAmount] = useState("");
    const [pricePerLiter, setPricePerLiter] = useState("");
    const [isFullTank, setIsFullTank] = useState(false);
    const [skippedLastFillUp, setSkippedLastFillUp] = useState(false)
    const [totalCost, setTotalCost] = useState("0.00");
    const [date, setDate] = useState(new Date().toISOString().split("T")[0]);


    // Calculate total cost whenever fuel amount or price changes
    useEffect(() => {
        if (fuelAmount && pricePerLiter) {
            const total = (
                Number.parseFloat(fuelAmount) * Number.parseFloat(pricePerLiter)
            ).toFixed(2);
            setTotalCost(total);
        } else {
            setTotalCost("0.00");
        }
    }, [fuelAmount, pricePerLiter]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const formData = {
            odometerReading: parseFloat(odometerReading),
            fuelAmount: parseFloat(fuelAmount),
            pricePerLiter: parseFloat(pricePerLiter),
            isFullTank,
            skippedLastFillUp,
            totalCost: parseFloat(totalCost),
            date,
        };

        try {
            // Assuming your axios instance is exported as 'api'
            const response = await api.post('/api/fillup/record', formData);

            // Axios considers any status code within the 2xx range as successful by default
            // If you need to handle specific status codes differently, you can check response.status
            // For this case, a successful Axios request means the request completed without network errors
            // and the server responded. The success of the operation is usually determined by the server's
            // response data or status code if you need to check beyond the 2xx range.

            // If the request was successful (status in the 2xx range)
            // Axios response data is directly available in response.data
            const result = response.data;
            console.log(result.message);

            // Reset the form
            setOdometerReading("");
            setFuelAmount("");
            setPricePerLiter("");
            setIsFullTank(false);
            setSkippedLastFillUp(false);
            setTotalCost("0.00");
            setDate(new Date().toISOString().split("T")[0]);
        } catch (error) {
            console.error('Error:', error);
        }
    };
    return (
        <div className="flex flex-col gap-6 m-3">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">Fill-up</h1>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow">
                <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
                    {/* Odometer Reading */}
                    <div className="flex flex-col gap-2">
                        <label htmlFor="odometer" className="text-sm font-medium">
                            Odometer Reading
                        </label>
                        <input
                            type="number"
                            id="odometer"
                            min="0"
                            placeholder="e.g. 12345"
                            className="px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={odometerReading}
                            onChange={(e) => setOdometerReading(e.target.value)}
                            required
                        />
                    </div>


                    {/* Fuel Amount */}
                    <div className="flex flex-col gap-2">
                        <label htmlFor="fuelAmount" className="text-sm font-medium">
                            Fuel Amount (Liters)
                        </label>
                        <input
                            type="number"
                            id="fuelAmount"
                            step="0.01"
                            placeholder="e.g. 45.5"
                            className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={fuelAmount}
                            onChange={(e) => setFuelAmount(e.target.value)}
                            required
                        />
                        {/* Checkboxes */}
                        <div className="flex flex-wrap gap-3 mt-2">
                            <label
                                htmlFor="fullTank"
                                className={`flex items-center gap-2 px-3 py-2 rounded-md cursor-pointer transition-colors ${isFullTank
                                    ? "bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800"
                                    : "bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600"
                                    }`}
                            >
                                <div
                                    className={`w-5 h-5 flex items-center justify-center rounded border ${isFullTank
                                        ? "bg-blue-500 border-blue-500 dark:bg-blue-600 dark:border-blue-600"
                                        : "border-gray-300 dark:border-gray-500"
                                        }`}
                                >
                                    {isFullTank && <FaCheck className="w-3.5 h-3.5 text-white" />}
                                </div>
                                <input
                                    type="checkbox"
                                    id="fullTank"
                                    className="sr-only"
                                    checked={isFullTank}
                                    onChange={(e) => setIsFullTank(e.target.checked)}
                                />
                                <span className={`text-sm ${isFullTank ? "text-blue-700 dark:text-blue-300" : ""}`}>Full Tank</span>
                            </label>

                            <label
                                htmlFor="skippedLastFillUp"
                                className={`flex items-center gap-2 px-3 py-2 rounded-md cursor-pointer transition-colors ${skippedLastFillUp
                                    ? "bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800"
                                    : "bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600"
                                    }`}
                            >
                                <div
                                    className={`w-5 h-5 flex items-center justify-center rounded border ${skippedLastFillUp
                                        ? "bg-blue-500 border-blue-500 dark:bg-blue-600 dark:border-blue-600"
                                        : "border-gray-300 dark:border-gray-500"
                                        }`}
                                >
                                    {skippedLastFillUp && <FaCheck className="w-3.5 h-3.5 text-white" />}
                                </div>
                                <input
                                    type="checkbox"
                                    id="skippedLastFillUp"
                                    className="sr-only"
                                    checked={skippedLastFillUp}
                                    onChange={(e) => setSkippedLastFillUp(e.target.checked)}
                                />
                                <span className={`text-sm ${skippedLastFillUp ? "text-blue-700 dark:text-blue-300" : ""}`}>
                                    Skipped last Fill-up
                                </span>
                            </label>
                        </div>
                    </div>


                    {/* Price Per Liter and Total Cost */}
                    <div className="flex flex-col gap-2">
                        <label htmlFor="pricePerLiter" className="text-sm font-medium">
                            Price
                        </label>
                        <div className="flex gap-3">
                            <div className="flex-1 relative">
                                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                                    &euro;
                                </span>
                                <input
                                    type="number"
                                    id="pricePerLiter"
                                    min="0"
                                    step="0.001"
                                    placeholder="Price per liter"
                                    className="pl-8 pr-4 py-2 w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    value={pricePerLiter}
                                    onChange={(e) => setPricePerLiter(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="relative w-1/3">
                                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                                    &euro;
                                </span>
                                <input
                                    type="text"
                                    id="totalCost"
                                    className="pl-8 pr-4 py-2 w-full rounded-md border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-600 text-gray-700 dark:text-gray-300 cursor-not-allowed"
                                    value={totalCost}
                                    readOnly
                                />
                            </div>
                        </div>
                    </div>

                    {/* Date */}
                    <div className="flex flex-col gap-2">
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

                    {/* Save button */}
                    <button
                        type="submit"
                        className="mt-2 w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition-colors duration-200"
                    >
                        Save Fill-up
                    </button>
                </form>
            </div>
        </div>
    );
}