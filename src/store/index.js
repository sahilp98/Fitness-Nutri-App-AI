import { configureStore, combineReducers } from '@reduxjs/toolkit';
import userReducer from './slices/userSlice';
import workoutReducer from './slices/workoutSlice';
import nutritionReducer from './slices/nutritionSlice';
import exerciseReducer from './slices/exerciseSlice';

const rootReducer = combineReducers({
  user: userReducer,
  workout: workoutReducer,
  nutrition: nutritionReducer,
  exercise: exerciseReducer
});

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) => 
    getDefaultMiddleware({
      serializableCheck: false
    })
});

export default store;