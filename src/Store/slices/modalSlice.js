import { createSlice } from '@reduxjs/toolkit';

export const modalSlice = createSlice({
    name: 'modal',
    initialState:
    {
        title: '',
        component: '',
        closeData: "", 
        isOpen: false,
        
    }
    ,
    reducers: {
        openModal: (state, { payload }) => {
            state.component = payload.component
            state.title = payload.title
            state.isOpen =  true

        },
        closeModal: (state, payload) => {
            state.component = ''
            state.closeData = payload
            state.isOpen = false
        }

    }
});

// this is for dispatch
export const { openModal, closeModal } = modalSlice.actions;

// this is for configureStore
export default modalSlice.reducer;
