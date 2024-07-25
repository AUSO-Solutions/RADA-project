import { createSlice } from '@reduxjs/toolkit';

export const setupSlice = createSlice({
    name: 'setup',
    initialState: { },
    reducers: {
        setSetupData: (state, { payload }) => {
            // console.log(payload)
          if(payload?.value !== undefined)  state[payload.name] = payload.value
        }

    }
});

// this is for dispatch
export const { setSetupData } = setupSlice.actions;

// this is for configureStore
export default setupSlice.reducer;
