import { useAuth } from "@context/AuthContext";
import formReducer from "@fillup/fillup-reducer";
import { type Fillup, type FillupState, initialState } from "@fillup/fillup-types";
import CallApi from "@utils/ApiHelper";
import type React from "react";
import { useReducer } from "react";
import { FaCheck } from "react-icons/fa";

function convertToPostData(form: FillupState): Partial<Fillup> {
    return {
        odometerReading: parseFloat(form.odometerReading),
        fuelAmount: parseFloat(form.fuelAmount),
        pricePerLiter: parseFloat(form.pricePerLiter),
        isFullTank: form.isFullTank,
        skippedAFillUp: form.skippedAFillUp,
        totalCost: parseFloat(form.totalCost),
        date: form.date,
    };
}

export default function FillUp() {
    const [form, dispatchForm] = useReducer(formReducer, initialState);
    const { token, setToken } = useAuth();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        dispatchForm({
            type: 'UPDATE_FIELD',
            field: e.target.name as keyof FillupState,
            value: e.target.value,
        });
    };
    const handleChangeCheckBox = (e: React.ChangeEvent<HTMLInputElement>) => {
        dispatchForm({
            type: 'UPDATE_CHECKBOX',
            field: e.target.name as keyof FillupState,
            value: e.target.checked,
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const formData = convertToPostData(form);

        try {
            const response = await CallApi('/api/fillup/record', 'POST', token, JSON.stringify(formData));
            if (token !== response.token) { setToken(response.token); }

            const result = response.jsonData;
            console.log(result.message);

            dispatchForm({ type: 'RESET_FORM' });
            alert("Saved Succesfully");
        } catch (error) {
            console.error('Error:', error);
        }
    };
    return (
        <div className="flex flex-col gap-6 m-3">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">Fill-up</h1>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow dark:text-gray-200">
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
                            name="odometerReading"
                            value={form.odometerReading}
                            onChange={handleChange}
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
                            name="fuelAmount"
                            value={form.fuelAmount}
                            onChange={handleChange}
                            required
                        />
                        {/* Checkboxes */}
                        <div className="flex flex-wrap gap-3 mt-2">
                            <label
                                htmlFor="fullTank"
                                className={`flex items-center gap-2 px-3 py-2 rounded-md cursor-pointer transition-colors ${form.isFullTank
                                    ? "bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800"
                                    : "bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600"
                                    }`}
                            >
                                <div
                                    className={`w-5 h-5 flex items-center justify-center rounded border ${form.isFullTank
                                        ? "bg-blue-500 border-blue-500 dark:bg-blue-600 dark:border-blue-600"
                                        : "border-gray-300 dark:border-gray-500"
                                        }`}
                                >
                                    {form.isFullTank && <div className="w-3.5 h-3.5 text-white" > <FaCheck /> </div>}
                                </div>
                                <input
                                    type="checkbox"
                                    id="fullTank"
                                    className="sr-only"
                                    name="isFullTank"
                                    checked={form.isFullTank}
                                    onChange={handleChangeCheckBox}
                                />
                                <span className={`text-sm ${form.isFullTank ? "text-blue-700 dark:text-blue-300" : ""}`}>Full Tank</span>
                            </label>

                            <label
                                htmlFor="skippedAFillUp"
                                className={`flex items-center gap-2 px-3 py-2 rounded-md cursor-pointer transition-colors ${form.skippedAFillUp
                                    ? "bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800"
                                    : "bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600"
                                    }`}
                            >
                                <div
                                    className={`w-5 h-5 flex items-center justify-center rounded border ${form.skippedAFillUp
                                        ? "bg-blue-500 border-blue-500 dark:bg-blue-600 dark:border-blue-600"
                                        : "border-gray-300 dark:border-gray-500"
                                        }`}
                                >
                                    {form.skippedAFillUp && <div className="w-3.5 h-3.5 text-white" > <FaCheck /> </div>}
                                </div>
                                <input
                                    type="checkbox"
                                    id="skippedAFillUp"
                                    className="sr-only"
                                    name="skippedAFillUp"
                                    checked={form.skippedAFillUp}
                                    onChange={handleChangeCheckBox}
                                />
                                <span className={`text-sm ${form.skippedAFillUp ? "text-blue-700 dark:text-blue-300" : ""}`}>
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
                                    name="pricePerLiter"
                                    value={form.pricePerLiter}
                                    onChange={handleChange}
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
                                    value={form.totalCost}
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
                                name="date"
                                value={form.date}
                                onChange={handleChange}
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