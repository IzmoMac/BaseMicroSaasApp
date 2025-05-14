import { useEffect, useState } from "react";
import CallApi from "../api/ApiHelper";
import { useAuth } from "../context/AuthContext";
// TypeScript interfaces matching your C# models (excluding UserId and User)
interface Trip {
    id: number;
    tripType: string;
    tripDistance: number;
    odometerReading: number;
    date: string; // ISO string
    notes: string;
}

interface Fillup {
    id: number;
    odometerReading: number;
    fuelAmount: number;
    pricePerLiter: number;
    isFullTank: boolean;
    skippedAFillUp: boolean;
    totalCost: number;
    date: string; // ISO string
}

const Data: React.FC = () => {
    const { setToken, token } = useAuth();

    const [trips, setTrips] = useState<Trip[]>([]);
    const [fillups, setFillups] = useState<Fillup[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            // Replace with your actual API endpoints
            const tripRes = await CallApi("/api/trip", "GET", token);
            if (token !== tripRes.token) { setToken(tripRes.token); }

            const fillupRes = await CallApi("/api/fillup", "GET", token);
            if (token !== fillupRes.token) { setToken(fillupRes.token); }

            setTrips(tripRes.jsonData);
            setFillups(fillupRes.jsonData);
            setLoading(false);
        }

        fetchData();
    }, [token, setToken]);

    if (loading) return <div>Loading...</div>;

    return (
        <div className="p-4 flex flex-col gap-8">
            <div>
                <h2 className="text-xl font-bold mb-2">Trips</h2>
                <table className="min-w-full border">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Type</th>
                            <th>Distance (km)</th>
                            <th>Odometer</th>
                            <th>Date</th>
                            <th>Notes</th>
                        </tr>
                    </thead>
                    <tbody>
                        {trips.map(trip => (
                            <tr key={trip.id}>
                                <td>{trip.id}</td>
                                <td>{trip.tripType}</td>
                                <td>{trip.tripDistance}</td>
                                <td>{trip.odometerReading}</td>
                                <td>{new Date(trip.date).toLocaleDateString()}</td>
                                <td>{trip.notes}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div>
                <h2 className="text-xl font-bold mb-2">Fillups</h2>
                <table className="min-w-full border">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Odometer</th>
                            <th>Fuel Amount (L)</th>
                            <th>Price/Liter (€)</th>
                            <th>Full Tank</th>
                            <th>Skipped Fill</th>
                            <th>Total Cost (€)</th>
                            <th>Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {fillups.map(fillup => (
                            <tr key={fillup.id}>
                                <td>{fillup.id}</td>
                                <td>{fillup.odometerReading}</td>
                                <td>{fillup.fuelAmount}</td>
                                <td>{fillup.pricePerLiter.toFixed(2)}</td>
                                <td>{fillup.isFullTank ? "Yes" : "No"}</td>
                                <td>{fillup.skippedAFillUp ? "Yes" : "No"}</td>
                                <td>{fillup.totalCost.toFixed(2)}</td>
                                <td>{new Date(fillup.date).toLocaleDateString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
export default Data;