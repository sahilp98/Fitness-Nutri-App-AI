/**
 * Form validation rules and helper functions
 */

// Basic validation rules
export const rules = {
  required: (value) => {
    if (!value && value !== 0) return 'This field is required';
    if (typeof value === 'string' && value.trim() === '') return 'This field is required';
    return null;
  },
  
  minLength: (min) => (value) => {
    if (!value) return null;
    if (value.length < min) return `Must be at least ${min} characters`;
    return null;
  },
  
  maxLength: (max) => (value) => {
    if (!value) return null;
    if (value.length > max) return `Must be less than ${max} characters`;
    return null;
  },
  
  min: (min) => (value) => {
    if (value === '' || value === null || value === undefined) return null;
    if (Number(value) < min) return `Must be at least ${min}`;
    return null;
  },
  
  max: (max) => (value) => {
    if (value === '' || value === null || value === undefined) return null;
    if (Number(value) > max) return `Must be less than ${max}`;
    return null;
  },
  
  email: (value) => {
    if (!value) return null;
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!regex.test(value)) return 'Please enter a valid email address';
    return null;
  },
  
  numeric: (value) => {
    if (!value && value !== 0) return null;
    if (!/^-?\d+(\.\d+)?$/.test(value)) return 'Must be a number';
    return null;
  },
  
  integer: (value) => {
    if (!value && value !== 0) return null;
    if (!/^-?\d+$/.test(value)) return 'Must be an integer';
    return null;
  },
  
  positive: (value) => {
    if (!value && value !== 0) return null;
    if (Number(value) <= 0) return 'Must be positive';
    return null;
  },
  
  pattern: (regex, message) => (value) => {
    if (!value) return null;
    if (!regex.test(value)) return message || 'Invalid format';
    return null;
  }
};

// Complex validation functions
export const validate = {
  // Validate a field with multiple rules
  field: (value, fieldRules) => {
    for (const rule of fieldRules) {
      const error = rule(value);
      if (error) return error;
    }
    return null;
  },
  
  // Validate an entire form
  form: (values, formRules) => {
    const errors = {};
    
    for (const field in formRules) {
      if (formRules.hasOwnProperty(field)) {
        const fieldValue = values[field];
        const fieldRules = formRules[field];
        
        const error = validate.field(fieldValue, fieldRules);
        if (error) {
          errors[field] = error;
        }
      }
    }
    
    return errors;
  }
};

// Preset validation schemas for common forms
export const schemas = {
  profile: {
    name: [rules.required, rules.maxLength(50)],
    age: [rules.required, rules.numeric, rules.min(13), rules.max(120)],
    height: [rules.required, rules.numeric, rules.min(50), rules.max(300)],
    weight: [rules.required, rules.numeric, rules.min(20), rules.max(500)],
    targetWeight: [rules.numeric, rules.min(20), rules.max(500)],
  },
  
  nutritionPlan: {
    calorieTarget: [rules.required, rules.numeric, rules.min(1000), rules.max(10000)],
  },
  
  workoutPlan: {
    timePerSession: [rules.required, rules.numeric, rules.min(5), rules.max(300)],
  },
  
  measurement: {
    weight: [rules.numeric, rules.min(20), rules.max(500)],
    bodyFat: [rules.numeric, rules.min(1), rules.max(60)],
    chest: [rules.numeric, rules.min(30), rules.max(200)],
    waist: [rules.numeric, rules.min(30), rules.max(200)],
    hips: [rules.numeric, rules.min(30), rules.max(200)],
    thighs: [rules.numeric, rules.min(10), rules.max(100)],
    arms: [rules.numeric, rules.min(10), rules.max(100)],
  }
};
