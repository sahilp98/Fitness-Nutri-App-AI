/**
 * Utility functions for handling measurements throughout the application
 */

/**
 * Returns the appropriate unit label for a given measurement type
 * @param {string} type - The measurement type (e.g., 'weight', 'bodyFat', etc.)
 * @returns {string} The unit symbol for the measurement
 */
export const getUnitForMeasurement = (type) => {
  switch (type) {
    case 'weight':
      return 'kg';
    case 'bodyFat':
      return '%';
    case 'bmi':
      return '';
    case 'tdee':
    case 'calories':
    case 'calorieTarget':
      return 'cal';
    case 'water':
      return 'L';
    case 'steps':
      return 'steps';
    default:
      // All body measurements use cm by default
      return 'cm';
  }
};

/**
 * Formats a measurement value with its appropriate unit
 * @param {string} type - The measurement type
 * @param {number} value - The measurement value
 * @returns {string} Formatted measurement with unit
 */
export const formatMeasurement = (type, value) => {
  if (value === null || value === undefined) return '-';
  
  const unit = getUnitForMeasurement(type);
  return `${value}${unit ? ' ' + unit : ''}`;
};

/**
 * Calculate BMI (Body Mass Index)
 * @param {number} weightKg - Weight in kilograms
 * @param {number} heightCm - Height in centimeters
 * @returns {number} BMI value rounded to 1 decimal place
 */
export const calculateBMI = (weightKg, heightCm) => {
  if (!weightKg || !heightCm) return null;
  
  const heightM = heightCm / 100;
  const bmi = weightKg / (heightM * heightM);
  return Math.round(bmi * 10) / 10;
};

/**
 * Get BMI classification based on BMI value
 * @param {number} bmi - BMI value
 * @returns {object} Classification with category and color code
 */
export const getBMIClassification = (bmi) => {
  if (!bmi) return { category: 'Unknown', color: '#718096' };
  
  if (bmi < 18.5) {
    return { category: 'Underweight', color: '#4299E1' }; // Blue
  } else if (bmi >= 18.5 && bmi < 25) {
    return { category: 'Normal', color: '#48BB78' }; // Green
  } else if (bmi >= 25 && bmi < 30) {
    return { category: 'Overweight', color: '#ECC94B' }; // Yellow
  } else {
    return { category: 'Obese', color: '#F56565' }; // Red
  }
};

/**
 * Calculate ideal weight range based on height
 * @param {number} heightCm - Height in centimeters
 * @param {string} gender - 'male' or 'female'
 * @returns {object} Min and max ideal weight
 */
export const calculateIdealWeightRange = (heightCm, gender) => {
  if (!heightCm) return { min: null, max: null };
  
  // Using BMI range of 18.5-24.9 as healthy weight
  const heightM = heightCm / 100;
  const minWeight = Math.round(18.5 * heightM * heightM);
  const maxWeight = Math.round(24.9 * heightM * heightM);
  
  return { min: minWeight, max: maxWeight };
};

/**
 * Get weight change recommendation based on current and goal metrics
 * @param {number} currentWeight - Current weight in kg
 * @param {number} goalWeight - Goal weight in kg
 * @param {string} primaryGoal - User's primary goal (weight_loss, build_muscle, etc.)
 * @returns {object} Recommendation with weekly change and timeframe
 */
export const getWeightChangeRecommendation = (currentWeight, goalWeight, primaryGoal) => {
  if (!currentWeight || !goalWeight) return null;
  
  const difference = goalWeight - currentWeight;
  
  // If the goal is maintenance or the difference is minimal
  if (primaryGoal === 'maintain' || Math.abs(difference) < 1) {
    return {
      weeklyChange: 0,
      timeframe: 0,
      message: 'Focus on maintaining your current weight.'
    };
  }
  
  // For weight loss, recommend losing 0.5-1kg per week (healthier pace)
  // For muscle gain, recommend gaining 0.25-0.5kg per week (realistic muscle gain)
  const weeklyChange = primaryGoal === 'weight_loss' 
    ? -0.75 // Lose 0.75kg per week
    : 0.4;  // Gain 0.4kg per week
  
  const timeframe = Math.ceil(Math.abs(difference / weeklyChange));
  
  return {
    weeklyChange,
    timeframe,
    message: `${difference < 0 ? 'Lose' : 'Gain'} ${Math.abs(weeklyChange)} kg per week for approximately ${timeframe} weeks.`
  };
};
