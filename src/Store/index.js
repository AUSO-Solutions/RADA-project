import { combineReducers, configureStore } from '@reduxjs/toolkit';
import  apiSlice from './slices/api';


const reducers = combineReducers({
  api: apiSlice
})
export const store = configureStore({
  reducer: reducers,
});