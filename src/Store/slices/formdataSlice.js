import { createSlice } from '@reduxjs/toolkit';

export const formdataSlice = createSlice({
    name: 'formdata',
    initialState: {

    },
    reducers: {
        setFormdata: (state, { payload }) => {
            if (payload?.value !== undefined) {
                // console.log(payload)
                state[payload.name] = payload.value
            }
        },
        setWholeFormdata: (state, { payload }) => {
            state = payload
            return state
        },
        clearFormdata: (state) => {
            state = {}
            return state
        }

    }
});

// this is for dispatch
export const { setFormdata, clearFormdata, setWholeFormdata } = formdataSlice.actions;

// this is for configureStore
export default formdataSlice.reducer;

