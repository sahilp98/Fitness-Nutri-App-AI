import { createSlice } from '@reduxjs/toolkit';
import { v4 as uuidv4 } from 'uuid';
import { loadFromLocalStorage, saveToLocalStorage } from '../../utils/localStorage';

// Load saved workout data from localStorage if available
const savedWorkoutData = loadFromLocalStorage('fitness_workoutPlans');

const initialState = savedWorkoutData || {
  workoutPlans: [],
  currentPlan: null,
  completedWorkouts: []
};

const workoutSlice = createSlice({
  name: 'workout',
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    addWorkoutPlan: (state, action) => {
      const newPlan = {
        id: uuidv4(),
        createdAt: new Date().toISOString(),
        ...action.payload
      };
      
      state.workoutPlans.push(newPlan);
      saveToLocalStorage('fitness_workoutPlans', state);
    },
    setCurrentPlan: (state, action) => {
      state.currentPlan = action.payload;
      saveToLocalStorage('fitness_workoutPlans', state);
    },
    updateWorkoutPlan: (state, action) => {
      const { id, ...updates } = action.payload;
      const planIndex = state.workoutPlans.findIndex(plan => plan.id === id);
      
      if (planIndex !== -1) {
        state.workoutPlans[planIndex] = {
          ...state.workoutPlans[planIndex],
          ...updates,
        };
        
        if (state.currentPlan && state.currentPlan.id === id) {
          state.currentPlan = {
            ...state.currentPlan,
            ...updates,
          };
        }
      }
    },
    deleteWorkoutPlan: (state, action) => {
      state.workoutPlans = state.workoutPlans.filter(plan => plan.id !== action.payload);
      
      if (state.currentPlan && state.currentPlan.id === action.payload) {
        state.currentPlan = null;
      }
      saveToLocalStorage('fitness_workoutPlans', state);
    },
    logCompletedWorkout: (state, action) => {
      const completedWorkout = {
        id: uuidv4(),
        date: new Date().toISOString(),
        ...action.payload
      };
      
      if (!state.completedWorkouts) {
        state.completedWorkouts = [];
      }
      
      state.completedWorkouts.push(completedWorkout);
      saveToLocalStorage('fitness_workoutPlans', state);
    },
    deleteWorkoutLog: (state, action) => {
      if (state.completedWorkouts) {
        state.completedWorkouts = state.completedWorkouts.filter(
          workout => workout.id !== action.payload
        );
        saveToLocalStorage('fitness_workoutPlans', state);
      }
    },
    updateWorkoutLog: (state, action) => {
      if (state.completedWorkouts) {
        const { id, ...updates } = action.payload;
        const workoutIndex = state.completedWorkouts.findIndex(w => w.id === id);
        
        if (workoutIndex !== -1) {
          state.completedWorkouts[workoutIndex] = {
            ...state.completedWorkouts[workoutIndex],
            ...updates
          };
          saveToLocalStorage('fitness_workoutPlans', state);
        }
      }
    },
    clearWorkoutHistory: (state) => {
      state.workoutHistory = [];
    },
  },
});

export const {
  setLoading,
  setError,
  addWorkoutPlan,
  setCurrentPlan,
  updateWorkoutPlan,
  deleteWorkoutPlan,
  logCompletedWorkout,
  deleteWorkoutLog,
  updateWorkoutLog,
  clearWorkoutHistory,
} = workoutSlice.actions;

export default workoutSlice.reducer;
