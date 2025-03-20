import { createSlice } from '@reduxjs/toolkit';
import { loadFromLocalStorage, saveToLocalStorage } from '../../utils/localStorage';

// Load user data from localStorage if available
const savedUser = loadFromLocalStorage('fitness_user');

const initialState = savedUser || {
  personalInfo: {
    name: '',
    age: '',
    gender: '',
    height: '',
    weight: '',
  },
  fitnessGoals: {
    primaryGoal: '',
    weightGoal: '',
    targetDate: '',
    milestones: []
  },
  preferences: {
    dietaryPreferences: [],
    dietaryRestrictions: [],
    workoutPreferences: [],
  },
  settings: {
    notifications: {
      enabled: true,
      workoutReminders: true,
      progressUpdates: true,
      nutritionReminders: true,
      achievementAlerts: true
    },
    appSettings: {
      darkMode: false,
      aiProvider: 'gemini',
      measurementSystem: 'metric'
    },
    privacy: {
      shareWorkoutData: false,
      allowAnonymousDataCollection: true
    },
    sync: {
      autoSyncEnabled: true,
      syncFrequency: 'daily'
    }
  },
  bodyMeasurements: [],
  progressPhotos: [],
  achievements: []
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    updateUser: (state, action) => {
      Object.assign(state, action.payload);
      saveToLocalStorage('fitness_user', state);
    },
    updateUserSettings: (state, action) => {
      state.settings = {
        ...state.settings,
        ...action.payload
      };
      saveToLocalStorage('fitness_user', state);
    },
    updatePersonalInfo: (state, action) => {
      state.personalInfo = { ...state.personalInfo, ...action.payload };
      saveToLocalStorage('fitness_user', state);
    },
    updateFitnessGoals: (state, action) => {
      state.fitnessGoals = { ...state.fitnessGoals, ...action.payload };
      saveToLocalStorage('fitness_user', state);
    },
    updatePreferences: (state, action) => {
      state.preferences = { ...state.preferences, ...action.payload };
      saveToLocalStorage('fitness_user', state);
    },
    addBodyMeasurement: (state, action) => {
      if (!state.bodyMeasurements) {
        state.bodyMeasurements = [];
      }
      
      // Create a measurement object with an ID
      const newMeasurement = {
        ...action.payload,
        id: `measurement_${Date.now()}`
      };
      
      // Check if there's already a measurement for this date
      const existingIndex = state.bodyMeasurements.findIndex(
        m => m.date === action.payload.date
      );
      
      if (existingIndex >= 0) {
        // Update existing measurement
        state.bodyMeasurements[existingIndex] = {
          ...state.bodyMeasurements[existingIndex],
          ...newMeasurement
        };
      } else {
        // Add new measurement
        state.bodyMeasurements.push(newMeasurement);
      }
      
      // Save to localStorage
      saveToLocalStorage('fitness_user', state);
    },
    addProgressPhoto: (state, action) => {
      if (!state.progressPhotos) {
        state.progressPhotos = [];
      }
      
      // Add the new photo to the beginning of the array for chronological display
      state.progressPhotos.unshift(action.payload);
      saveToLocalStorage('fitness_user', state);
      
      // Add achievement for first progress photo if it doesn't exist
      if (state.progressPhotos.length === 1) {
        if (!state.achievements) state.achievements = [];
        
        const photoAchievement = {
          id: `first-photo-${Date.now()}`,
          type: 'progress-photo',
          title: 'Visual Progress Tracker',
          description: 'You uploaded your first progress photo!',
          date: new Date().toISOString(),
          icon: '📸'
        };
        
        // Check if this achievement already exists
        if (!state.achievements.some(a => a.type === 'progress-photo')) {
          state.achievements.push(photoAchievement);
        }
      }
    },
    removeProgressPhoto: (state, action) => {
      if (!state.progressPhotos) return;
      
      state.progressPhotos = state.progressPhotos.filter(
        photo => photo.id !== action.payload
      );
      
      saveToLocalStorage('fitness_user', state);
    },
    addAchievement: (state, action) => {
      if (!state.achievements) {
        state.achievements = [];
      }
      
      // Check if achievement with same ID already exists
      if (!state.achievements.some(a => a.id === action.payload.id)) {
        state.achievements.push({
          ...action.payload,
          date: action.payload.date || new Date().toISOString()
        });
        
        saveToLocalStorage('fitness_user', state);
      }
    },
    addMilestone: (state, action) => {
      if (!state.fitnessGoals.milestones) {
        state.fitnessGoals.milestones = [];
      }
      
      state.fitnessGoals.milestones.push({
        ...action.payload,
        id: `milestone-${Date.now()}`,
        date: action.payload.date || new Date().toISOString(),
        completed: action.payload.completed || false
      });
      
      saveToLocalStorage('fitness_user', state);
    },
    completeMilestone: (state, action) => {
      if (!state.fitnessGoals.milestones) return;
      
      const milestoneIndex = state.fitnessGoals.milestones.findIndex(
        m => m.id === action.payload
      );
      
      if (milestoneIndex >= 0) {
        state.fitnessGoals.milestones[milestoneIndex].completed = true;
        state.fitnessGoals.milestones[milestoneIndex].completedDate = new Date().toISOString();
        
        saveToLocalStorage('fitness_user', state);
      }
    }
  }
});

export const { 
  updateUser,
  updateUserSettings,
  updatePersonalInfo,
  updateFitnessGoals,
  updatePreferences,
  addBodyMeasurement,
  addProgressPhoto,
  removeProgressPhoto,
  addAchievement,
  addMilestone,
  completeMilestone
} = userSlice.actions;

export default userSlice.reducer;
