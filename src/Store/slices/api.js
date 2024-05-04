import { createSlice } from '@reduxjs/toolkit';

export const apiSlice = createSlice({
    name: 'todos',
    initialState: [],
    reducers: {
        resolve: (state, action) => {
            console.log(action.payload)
            // const todo = {
            //     id: uuid(),
            //     text: action.payload,
            // };

            // state.push(todo);
        },
    }
});

// this is for dispatch
export const { resolve } = apiSlice.actions;

// this is for configureStore
export default apiSlice.reducer;
