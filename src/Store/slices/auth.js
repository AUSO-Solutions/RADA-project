import { createSlice } from '@reduxjs/toolkit';

export const authSlice = createSlice({
    name: 'todos',
    initialState: { user: {} },
    reducers: {
        setUser: (state, { payload }) => {
           if (payload) {
            console.log(payload)
            state.user = payload
         state.user.data.name =  payload.data?.firstName +  " "  +  payload.data?.lastName
   
           }  
           },
    }
});

// this is for dispatch
export const { setUser } = authSlice.actions;

// this is for configureStore
export default authSlice.reducer;