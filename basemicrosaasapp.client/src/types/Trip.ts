export default interface Trip {
    id: number;
    tripType: string;
    tripDistance: number;
    odometerReading: number;
    date: string; // ISO string
    notes: string;
}