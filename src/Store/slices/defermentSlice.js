import { createSlice } from "@reduxjs/toolkit";

export const defermentSlice = createSlice({
  name: "deferment",
  initialState: {},
  reducers: {
    setDefermentData: (state, { payload }) => {
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
export const { setDefermentData, clearSetup, setWholeSetup } =
  defermentSlice.actions;

// this is for configureStore
export default defermentSlice.reducer;
