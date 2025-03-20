/**
 * LocalStorage utility functions for persistent data storage
 */

// Save data to localStorage
export const saveToLocalStorage = (key, data) => {
  try {
    const serializedData = JSON.stringify(data);
    localStorage.setItem(key, serializedData);
    return true;
  } catch (error) {
    console.error('Error saving to localStorage:', error);
    return false;
  }
};

// Load data from localStorage
export const loadFromLocalStorage = (key) => {
  try {
    const serializedData = localStorage.getItem(key);
    if (serializedData === null) return undefined;
    return JSON.parse(serializedData);
  } catch (error) {
    console.error('Error loading from localStorage:', error);
    return undefined;
  }
};

// Remove data from localStorage
export const removeFromLocalStorage = (key) => {
  try {
    localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error('Error removing from localStorage:', error);
    return false;
  }
};

// Clear all app-related data from localStorage
export const clearAppData = () => {
  try {
    const appKeys = ['fitness_user', 'fitness_workoutPlans', 'fitness_nutritionPlans', 'fitness_progress'];
    appKeys.forEach(key => localStorage.removeItem(key));
    return true;
  } catch (error) {
    console.error('Error clearing app data from localStorage:', error);
    return false;
  }
};
