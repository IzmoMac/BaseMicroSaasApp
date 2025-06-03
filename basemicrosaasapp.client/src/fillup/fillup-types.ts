export interface Fillup {
    id: number;
    odometerReading: number;
    fuelAmount: number;
    pricePerLiter: number;
    isFullTank: boolean;
    skippedAFillUp: boolean;
    totalCost: number;
    date: string; // ISO string
}

export interface FillupState {
    odometerReading: string;
    fuelAmount: string;
    pricePerLiter: string;
    isFullTank: boolean;
    skippedAFillUp: boolean;
    totalCost: string;
    date: string; // ISO string
}

export const initialState: FillupState = {
    odometerReading: "",
    fuelAmount: "",
    pricePerLiter: "",
    isFullTank: false,
    skippedAFillUp: false,
    totalCost: "",
    date: new Date().toISOString().split("T")[0]
}