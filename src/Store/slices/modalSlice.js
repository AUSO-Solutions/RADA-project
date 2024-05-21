import { createSlice } from '@reduxjs/toolkit';

export const modalSlice = createSlice({
    name: 'modal',
    initialState:
    {
        title: '',
        component: '',
        closeData: ""
    }
    ,
    reducers: {
        openModal: (state, { payload }) => {
            state.component = payload.component
            state.title = payload.title

        },
        closeModal: (state, payload) => {
            state.component = ''
            state.closeData = payload
        }

    }
});

// this is for dispatch
export const { openModal, closeModal } = modalSlice.actions;

// this is for configureStore
export default modalSlice.reducer;
