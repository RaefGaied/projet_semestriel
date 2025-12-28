import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import chambreReducer from './chambreSlice';
import reservationReducer from './reservationSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    chambres: chambreReducer,
    reservations: reservationReducer,
  },
});

export default store;
