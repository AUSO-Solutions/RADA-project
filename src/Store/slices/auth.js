import { createSlice } from '@reduxjs/toolkit';

export const authSlice = createSlice({
    name: 'todos',
    initialState: { user: {} },
    reducers: {
        setUser: (state, { payload }) => {
            console.log(payload)
            state.user = payload
        },
    }
});

// this is for dispatch
export const { setUser } = authSlice.actions;

// this is for configureStore
export default authSlice.reducer;
