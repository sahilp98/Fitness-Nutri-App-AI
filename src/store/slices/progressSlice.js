import { createSlice } from '@reduxjs/toolkit';
import { v4 as uuidv4 } from 'uuid';

const initialState = {
  measurements: [],
  goals: {
    weightGoal: null,
    targetDate: null
  }
};

const progressSlice = createSlice({
  name: 'progress',
  initialState,
  reducers: {
    addMeasurement: (state, action) => {
      const newMeasurement = {
        id: uuidv4(),
        date: new Date().toISOString(),
        ...action.payload
      };
      
      state.measurements.push(newMeasurement);
      
      // Sort measurements by date
      state.measurements.sort((a, b) => 
        new Date(b.date).getTime() - new Date(a.date).getTime()
      );
    },
    updateMeasurement: (state, action) => {
      const { id, ...updates } = action.payload;
      const measurementIndex = state.measurements.findIndex(m => m.id === id);
      
      if (measurementIndex !== -1) {
        state.measurements[measurementIndex] = {
          ...state.measurements[measurementIndex],
          ...updates
        };
      }
    },
    deleteMeasurement: (state, action) => {
      state.measurements = state.measurements.filter(m => m.id !== action.payload);
    },
    setGoals: (state, action) => {
      state.goals = {
        ...state.goals,
        ...action.payload
      };
    }
  }
});

export const { 
  addMeasurement, 
  updateMeasurement,
  deleteMeasurement,
  setGoals
} = progressSlice.actions;

export default progressSlice.reducer;
