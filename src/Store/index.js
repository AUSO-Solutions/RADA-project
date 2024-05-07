import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import apiSlice from './slices/api';
import authSlice from './slices/auth';
import modalSlice from './slices/modalSlice';

const persistConfig = {
  key: 'root',
  storage,
  // Specify the reducers you want to persist
  // whitelist: ['user'], // In this example, we persist the 'user' reducer
};

const reducers = combineReducers({
  api: apiSlice,
  auth: authSlice,
  modal:modalSlice
})

const persistedReducer = persistReducer(persistConfig, reducers);
export const store = configureStore({
  reducer: persistedReducer
});
export const persistor = persistStore(store);