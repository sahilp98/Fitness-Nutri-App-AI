import { createSlice } from '@reduxjs/toolkit';
import { v4 as uuidv4 } from 'uuid';
import { loadFromLocalStorage, saveToLocalStorage } from '../../utils/localStorage';

// Load saved nutrition data from localStorage if available
const savedNutritionData = loadFromLocalStorage('fitness_nutritionPlans');

const initialState = savedNutritionData || {
  nutritionPlans: [],
  currentPlan: null,
  savedRecipes: [],
  mealLogs: [],
  loading: false,
  error: null,
};

const nutritionSlice = createSlice({
  name: 'nutrition',
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    addNutritionPlan: (state, action) => {
      const newPlan = {
        id: uuidv4(),
        createdAt: new Date().toISOString(),
        ...action.payload
      };
      
      state.nutritionPlans.push(newPlan);
      saveToLocalStorage('fitness_nutritionPlans', state);
    },
    setCurrentPlan: (state, action) => {
      state.currentPlan = action.payload;
      saveToLocalStorage('fitness_nutritionPlans', state);
    },
    updateNutritionPlan: (state, action) => {
      const { id, ...updates } = action.payload;
      const planIndex = state.nutritionPlans.findIndex(plan => plan.id === id);
      
      if (planIndex !== -1) {
        state.nutritionPlans[planIndex] = {
          ...state.nutritionPlans[planIndex],
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
    deleteNutritionPlan: (state, action) => {
      state.nutritionPlans = state.nutritionPlans.filter(plan => plan.id !== action.payload);
      
      if (state.currentPlan && state.currentPlan.id === action.payload) {
        state.currentPlan = null;
      }
      saveToLocalStorage('fitness_nutritionPlans', state);
    },
    logMeal: (state, action) => {
      if (state.currentPlan) {
        if (!state.currentPlan.mealLogs) {
          state.currentPlan.mealLogs = [];
        }
        
        state.currentPlan.mealLogs.push({
          id: uuidv4(),
          date: new Date().toISOString(),
          ...action.payload
        });
      }
      saveToLocalStorage('fitness_nutritionPlans', state);
    },
    clearMealLogs: (state) => {
      state.mealLogs = [];
    },
    saveRecipe: (state, action) => {
      // Check if recipe already exists to avoid duplicates
      const exists = state.savedRecipes.some(r => 
        r.recipe.name.toLowerCase() === action.payload.recipe.name.toLowerCase()
      );
      
      if (!exists) {
        state.savedRecipes.push(action.payload);
        saveToLocalStorage('fitness_nutritionPlans', state);
      }
    },
    deleteRecipe: (state, action) => {
      state.savedRecipes = state.savedRecipes.filter(recipe => recipe.id !== action.payload);
      saveToLocalStorage('fitness_nutritionPlans', state);
    }
  },
});

export const {
  setLoading,
  setError,
  addNutritionPlan,
  setCurrentPlan,
  updateNutritionPlan,
  deleteNutritionPlan,
  logMeal,
  clearMealLogs,
  saveRecipe,
  deleteRecipe,
} = nutritionSlice.actions;

export default nutritionSlice.reducer;
