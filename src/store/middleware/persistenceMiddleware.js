import { saveToLocalStorage } from '../../utils/localStorage';

// Middleware to automatically save specific slices of state to localStorage
const persistenceMiddleware = store => next => action => {
  const result = next(action);
  const state = store.getState();
  
  // Save user data when it changes
  if (action.type.startsWith('user/')) {
    saveToLocalStorage('fitness_user', state.user);
  }
  
  // Save workout plans when they change
  if (action.type.startsWith('workout/')) {
    saveToLocalStorage('fitness_workoutPlans', state.workout);
  }
  
  // Save nutrition plans when they change
  if (action.type.startsWith('nutrition/')) {
    saveToLocalStorage('fitness_nutritionPlans', state.nutrition);
  }
  
  // Save progress data when it changes
  if (action.type.startsWith('progress/')) {
    saveToLocalStorage('fitness_progress', state.progress);
  }
  
  return result;
};

export default persistenceMiddleware;
