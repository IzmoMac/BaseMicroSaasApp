export default interface Fillup {
    id: number;
    odometerReading: number;
    fuelAmount: number;
    pricePerLiter: number;
    isFullTank: boolean;
    skippedAFillUp: boolean;
    totalCost: number;
    date: string; // ISO string
}