import {type FillupState, initialState } from "@fillup/fillup-types";

type FillUpAction =
    | { type: "RESET_FORM" }
    | { type: 'UPDATE_FIELD'; field: keyof FillupState; value: string }
    | { type: 'UPDATE_CHECKBOX'; field: keyof FillupState; value: boolean }
export default function fillUpReducer(state: FillupState, action: FillUpAction): FillupState {
    switch (action.type) {
        case 'UPDATE_FIELD':
            if (action.field === 'pricePerLiter')
            {
                return {
                    ...state,
                    [action.field]: action.value,
                    'totalCost': calculateTotalCost(state.fuelAmount, action.value)
                }
            }
            if (action.field === 'fuelAmount') {
                return {
                    ...state,
                    [action.field]: action.value,
                    'totalCost': calculateTotalCost(action.value, state.pricePerLiter)
                }
            }
            return { ...state, [action.field]: action.value };
        case 'UPDATE_CHECKBOX':
            return {
                ...state,
                [action.field]: action.value,
            };
        case 'RESET_FORM':
            return initialState;

        default:
            return state;
    }
}

function calculateTotalCost(fuelAmount: string, pricePerLiter: string): string {
    const fuel = parseFloat(fuelAmount);
    const price = parseFloat(pricePerLiter);
    return (!isNaN(fuel) && !isNaN(price)) ? (fuel * price).toFixed(2) : "0.00";
}