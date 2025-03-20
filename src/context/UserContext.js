import React, { createContext, useState, useContext } from 'react';

const UserContext = createContext();

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState({
    personalInfo: {
      name: 'Fitness Enthusiast',
      age: 30,
      gender: 'male',
      height: 175, // cm
      weight: 75,  // kg
      activityLevel: 'moderately_active'
    },
    fitnessGoals: {
      primaryGoal: 'build_muscle',
      targetWeight: 80,
      workoutFrequency: 4
    },
    preferences: {
      availableEquipment: ['dumbbell', 'bodyweight'],
      dietaryPreferences: ['high-protein'],
      dietaryRestrictions: [],
      excludedExercises: []
    }
  });

  const updateUser = (updates) => {
    setUser(prevUser => ({
      ...prevUser,
      ...updates
    }));
  };

  const updatePersonalInfo = (updates) => {
    setUser(prevUser => ({
      ...prevUser,
      personalInfo: {
        ...prevUser.personalInfo,
        ...updates
      }
    }));
  };

  const updateFitnessGoals = (updates) => {
    setUser(prevUser => ({
      ...prevUser,
      fitnessGoals: {
        ...prevUser.fitnessGoals,
        ...updates
      }
    }));
  };

  const updatePreferences = (updates) => {
    setUser(prevUser => ({
      ...prevUser,
      preferences: {
        ...prevUser.preferences,
        ...updates
      }
    }));
  };

  const calculateBMI = () => {
    const { height, weight } = user.personalInfo;
    if (!height || !weight) return null;
    
    // BMI = weight(kg) / height(m)²
    const heightInMeters = height / 100;
    const bmi = weight / (heightInMeters * heightInMeters);
    return Math.round(bmi * 10) / 10; // Round to 1 decimal place
  };

  const calculateTDEE = () => {
    const { age, gender, height, weight, activityLevel } = user.personalInfo;
    if (!age || !gender || !height || !weight || !activityLevel) return null;

    // Calculate BMR using Mifflin-St Jeor Equation
    let bmr;
    if (gender === 'male') {
      bmr = 10 * weight + 6.25 * height - 5 * age + 5;
    } else {
      bmr = 10 * weight + 6.25 * height - 5 * age - 161;
    }

    // Apply activity level multiplier
    const activityMultipliers = {
      sedentary: 1.2,
      lightly_active: 1.375,
      moderately_active: 1.55,
      very_active: 1.725,
      extremely_active: 1.9
    };

    const tdee = bmr * (activityMultipliers[activityLevel] || 1.2);
    return Math.round(tdee);
  };

  const calculateCalorieTarget = () => {
    const { primaryGoal } = user.fitnessGoals;
    const tdee = calculateTDEE();
    if (!tdee) return null;

    // Adjust based on goal
    switch (primaryGoal) {
      case 'weight_loss':
        return Math.round(tdee * 0.8); // 20% deficit
      case 'build_muscle':
        return Math.round(tdee * 1.1); // 10% surplus
      case 'maintain':
      default:
        return tdee;
    }
  };

  const calculateMacros = () => {
    const { primaryGoal } = user.fitnessGoals;
    const { weight } = user.personalInfo;
    const calorieTarget = calculateCalorieTarget();
    
    if (!calorieTarget || !weight) return null;

    let proteinPerKg, fatPercentage;

    switch (primaryGoal) {
      case 'weight_loss':
        proteinPerKg = 2.2; // Higher protein for weight loss
        fatPercentage = 0.3;
        break;
      case 'build_muscle':
        proteinPerKg = 2.0;
        fatPercentage = 0.25;
        break;
      case 'maintain':
      default:
        proteinPerKg = 1.8;
        fatPercentage = 0.3;
    }

    // Calculate macros in grams
    const protein = Math.round(weight * proteinPerKg);
    const fat = Math.round((calorieTarget * fatPercentage) / 9); // 9 calories per gram of fat
    
    // Remaining calories go to carbs
    const remainingCalories = calorieTarget - (protein * 4) - (fat * 9);
    const carbs = Math.round(remainingCalories / 4); // 4 calories per gram of carbs

    return {
      protein,
      carbs,
      fats: fat
    };
  };

  const value = {
    user,
    updateUser,
    updatePersonalInfo,
    updateFitnessGoals,
    updatePreferences,
    calculateBMI,
    calculateTDEE,
    calculateCalorieTarget,
    calculateMacros
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export default UserContext;
