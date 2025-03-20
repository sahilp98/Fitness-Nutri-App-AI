import { configureStore } from '@reduxjs/toolkit';
import userReducer from './slices/userSlice';
import workoutReducer from './slices/workoutSlice';
import nutritionReducer from './slices/nutritionSlice';
import progressReducer from './slices/progressSlice';
import persistenceMiddleware from './middleware/persistenceMiddleware';
import { loadFromLocalStorage } from '../utils/localStorage';

// Load initial state from localStorage
const preloadedState = {
  user: loadFromLocalStorage('fitness_user'),
  workout: loadFromLocalStorage('fitness_workoutPlans'),
  nutrition: loadFromLocalStorage('fitness_nutritionPlans'),
  progress: loadFromLocalStorage('fitness_progress'),
};

// Filter out undefined values (slices that weren't in localStorage)
const filteredPreloadedState = Object.entries(preloadedState).reduce((acc, [key, value]) => {
  if (value !== undefined) {
    acc[key] = value;
  }
  return acc;
}, {});

export const store = configureStore({
  reducer: {
    user: userReducer,
    workout: workoutReducer,
    nutrition: nutritionReducer,
    progress: progressReducer,
  },
  preloadedState: filteredPreloadedState,
  middleware: (getDefaultMiddleware) => 
    getDefaultMiddleware().concat(persistenceMiddleware),
});
