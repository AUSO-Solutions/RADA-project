import { createSlice } from "@reduxjs/toolkit";

export const reconciledProductionSlice = createSlice({
  name: "reconciledProduction",
  initialState: {},
  reducers: {
    setReconciledProductionData: (state, { payload }) => {
      if (payload?.value !== undefined) {
        // console.log(payload)
        state[payload.name] = payload.value;
      }
    },
    setWholeSetup: (state, { payload }) => {
      state = payload;
      return state;
    },
    clearSetup: (state) => {
      state = {};
      return state;
    },
  },
});

// this is for dispatch
export const { setReconciledProductionData, clearSetup, setWholeSetup } =
  reconciledProductionSlice.actions;

// this is for configureStore
export default reconciledProductionSlice.reducer;
