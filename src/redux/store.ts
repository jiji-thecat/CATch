import { configureStore } from '@reduxjs/toolkit';
import catReducer from './catSlice';

export const store = configureStore({
  reducer: {
    catReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
