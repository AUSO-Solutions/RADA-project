import { createSlice } from '@reduxjs/toolkit';

export const modalSlice = createSlice({
    name: 'modal',
    initialState:
    {
        title: '',
        component: null
    }
    ,
    reducers: {
        openModal: (state, { payload }) => {
            state.component = payload.component
            // console.log(payload)
        },
        closeModal: (state) => {
            state.component = null
        }

    }
});

// this is for dispatch
export const { openModal, closeModal } = modalSlice.actions;

// this is for configureStore
export default modalSlice.reducer;
