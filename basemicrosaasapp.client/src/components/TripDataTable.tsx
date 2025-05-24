import { FaHome, FaBriefcase } from "react-icons/fa";

import { useState, useEffect } from "react";
import CallApi from "../api/ApiHelper";
import { useAuth } from "../context/AuthContext";
import React from "react";
import type Trip from "../types/Trip";

const TripDataTable: React.FC = () => {
    const [trips, setTrips] = useState<Trip[]>([]);
    const { token, setToken } = useAuth();
    //const [fillups, setFillups] = useState<Fillup[]>([]);
    //const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            // Replace with your actual API endpoints
            const tripRes = await CallApi("/api/trip", "GET", token);
            if (token !== tripRes.token) { setToken(tripRes.token); }
            setTrips(tripRes.jsonData);

            //const fillupRes = await CallApi("/api/fillup", "GET", token);
            //if (token !== fillupRes.token) { setToken(fillupRes.token); }

            //setFillups(fillupRes.jsonData);
            //setLoading(false);
        }

        fetchData();
    }, [token, setToken]);


    return (
        <div className="overflow-x-scroll dark:bg-gray-900">
            <table className="min-w-full divide-y-2 divide-gray-200 dark:divide-gray-700">
                <thead className="ltr:text-left rtl:text-right">
                    <tr className="*:font-medium *:text-gray-900 dark:*:text-white">
                        <th className="px-3 py-2 whitespace-nowrap">Type</th>
                        <th className="px-3 py-2 whitespace-nowrap">Km</th>
                        <th className="px-3 py-2 whitespace-nowrap">Odometer</th>
                        <th className="px-3 py-2 whitespace-nowrap">Date</th>
                        <th className="px-3 py-2 whitespace-nowrap">Notes</th>
                    </tr>
                </thead>

                <tbody className="divide-y divide-gray-200 *:even:bg-gray-50 dark:divide-gray-700 dark:*:even:bg-gray-800">
                    {trips.map(trip => (
                        <tr className="*:text-gray-900 *:first:font-medium dark:*:text-white" key={trip.id}>
                            <td className="px-3 py-2 whitespace-nowrap">
                                {trip.tripType === "personal" ? <FaHome /> : <FaBriefcase />}
                            </td>
                            <td className="px-3 py-2 whitespace-nowrap">{trip.tripDistance}</td>
                            <td className="px-3 py-2 whitespace-nowrap">{trip.odometerReading}</td>
                            <td className="px-3 py-2 whitespace-nowrap">{new Date(trip.date).toLocaleDateString()}</td>
                            <td className="px-3 py-2 whitespace-nowrap">{trip.notes}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export default TripDataTable;