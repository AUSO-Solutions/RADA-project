import { createSlice } from '@reduxjs/toolkit';

export const decimalPlacesSlice = createSlice({
    name: 'decimalPlaces',
    initialState: 3,
    reducers: {
        setDecimalPlaces: (state, action) => {
            return action.payload;
        },
    },
});

// export const { setDecimalPlaces } = decimalPlacesSlice.actions;

export const { setDecimalPlaces } = decimalPlacesSlice.actions;

export default decimalPlacesSlice.reducer;
