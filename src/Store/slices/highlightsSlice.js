import { createSlice } from '@reduxjs/toolkit';
// import { updateStatus } from 'utils/updateUserStatus';  

export const highlightsSlice = createSlice({
    name: 'highlights',
    initialState: {},
    reducers: {
        setHighlights: (state, { payload }) => {
            const { flowstation, highlightType, highlight } = payload
            if (payload) {
                // console.log(state.data )
                state.data = {
                    ...state.data,
                    [flowstation]: {
                        ...state.data?.[flowstation],
                        [highlightType]: highlight
                    }
                }
            }
        },
        setDefaultHighlights: (state, { payload }) => {
            state.data = payload
        }
    }
});

export const { setHighlights , setDefaultHighlights} = highlightsSlice.actions;

export default highlightsSlice.reducer;
