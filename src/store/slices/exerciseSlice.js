import { createSlice } from '@reduxjs/toolkit';
import { loadFromLocalStorage, saveToLocalStorage } from '../../utils/localStorage';

// Load saved exercise data from localStorage if available
const savedExerciseData = loadFromLocalStorage('fitness_exerciseData');

const initialState = savedExerciseData || {
  favoriteExercises: [], // IDs of favorited exercises
  completedExercises: [], // History of completed exercises
  exerciseStats: {}, // Stats for each exercise (max weight, reps, etc.)
};

const exerciseSlice = createSlice({
  name: 'exercise',
  initialState,
  reducers: {
    toggleFavoriteExercise: (state, action) => {
      const exerciseId = action.payload;
      
      if (state.favoriteExercises.includes(exerciseId)) {
        state.favoriteExercises = state.favoriteExercises.filter(id => id !== exerciseId);
      } else {
        state.favoriteExercises.push(exerciseId);
      }
      
      saveToLocalStorage('fitness_exerciseData', state);
    },
    
    recordExerciseCompletion: (state, action) => {
      const { 
        exerciseId,
        date,
        sets,
        totalVolume,
        workoutId
      } = action.payload;
      
      state.completedExercises.push({
        id: `${exerciseId}_${Date.now()}`,
        exerciseId,
        date,
        sets,
        totalVolume,
        workoutId
      });
      
      saveToLocalStorage('fitness_exerciseData', state);
    }
  }
});

export const { 
  toggleFavoriteExercise, 
  recordExerciseCompletion
} = exerciseSlice.actions;

export default exerciseSlice.reducer;
