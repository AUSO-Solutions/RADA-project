import { combineReducers, configureStore } from '@reduxjs/toolkit';
import apiSlice from './slices/api';
import  authSlice  from './slices/auth';


const reducers = combineReducers({
  api: apiSlice,
  auth: authSlice
})
export const store = configureStore({
  reducer: reducers,
});