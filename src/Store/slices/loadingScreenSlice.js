import { createSlice } from '@reduxjs/toolkit';

export const loadingScreenSlice = createSlice({
    name: 'loadingScreen',
    initialState:
    {
        message: "",
        isOpen: false
    }
    ,
    reducers: {
        setLoadingScreen: (state, { payload }) => {
            state.message = payload.message
            state.isOpen = payload.open 
        }

    }
});

export const { setLoadingScreen } = loadingScreenSlice.actions;
export default loadingScreenSlice.reducer;
