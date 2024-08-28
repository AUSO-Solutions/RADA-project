import { createSlice } from '@reduxjs/toolkit';

export const setupSlice = createSlice({
    name: 'setup',
    initialState: {

    },
    reducers: {
        setSetupData: (state, { payload }) => {
            if (payload?.value !== undefined) {
                // console.log(payload)
                state[payload.name] = payload.value
            }
        },
        setWholeSetup: (state, { payload }) => {
            state = payload
            return state
        },
        clearSetup: (state) => {
            state = {}
            return state
        }

    }
});

// this is for dispatch
export const { setSetupData, clearSetup, setWholeSetup } = setupSlice.actions;

// this is for configureStore
export default setupSlice.reducer;
