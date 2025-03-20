/**
 * This file contains the JSON structure templates for AI responses
 * These templates define how we want the AI models to format their responses
 * for consistent parsing in our application.
 */

// Workout Plan response template
export const workoutPlanTemplate = {
  "workoutPlan": {
    "name": "4-Week Progressive Strength Program",
    "goal": "build_muscle", // One of: build_muscle, weight_loss, strength, endurance, general_fitness
    "level": "intermediate", // One of: beginner, intermediate, advanced
    "frequency": "4 days per week",
    "duration": "45 minutes per session",
    "schedule": {
      "day1": {
        "focus": "Upper Body",
        "exercises": [
          {
            "name": "Bench Press",
            "muscleGroup": "Chest",
            "sets": 4,
            "reps": "8-10",
            "rest": 90, // seconds
            "instructions": "Keep shoulders back and down, feet planted firmly on the floor"
          },
          // More exercises...
        ]
      },
      "day2": {
        "focus": "Lower Body",
        "exercises": [
          // Exercises for this day...
        ]
      }
      // More days based on frequency...
    },
    "notes": "Increase weights by 5% when you can complete all sets and reps with good form",
    "warmup": "5 minutes of light cardio followed by dynamic stretches",
    "cooldown": "Static stretching for each major muscle group, hold each stretch for 15-30 seconds"
  }
};

// Nutrition Plan response template
export const nutritionPlanTemplate = {
  "nutritionPlan": {
    "name": "High Protein Fat Loss Plan",
    "dailyCalories": 2000,
    "macros": {
      "protein": 150, // grams
      "carbs": 175, // grams
      "fats": 65 // grams
    },
    "meals": [
      {
        "name": "Breakfast",
        "time": "8:00 AM",
        "calories": 450,
        "protein": 35,
        "carbs": 45,
        "fats": 15,
        "items": [
          {
            "food": "Greek Yogurt",
            "amount": "1 cup (227g)",
            "calories": 150,
            "protein": 20,
            "carbs": 8,
            "fats": 0,
            "recipe": null
          },
          {
            "food": "Mixed Berries",
            "amount": "1 cup (150g)",
            "calories": 85,
            "protein": 1,
            "carbs": 20,
            "fats": 0,
            "recipe": null
          }
          // More food items...
        ]
      }
      // More meals...
    ],
    "waterIntake": "3-4 liters per day",
    "supplementRecommendations": "Consider a daily multivitamin and 5g creatine monohydrate",
    "notes": "Adjust portion sizes based on hunger levels while maintaining calorie target"
  }
};

// Recipe response template
export const recipeTemplate = {
  "recipe": {
    "name": "Quick Protein Stir Fry",
    "calories": 450,
    "macros": {
      "protein": 40,
      "carbs": 35,
      "fats": 15
    },
    "prepTime": "10 minutes",
    "cookTime": "15 minutes",
    "servings": 2,
    "ingredients": [
      {
        "name": "Chicken Breast",
        "amount": "300g"
      },
      {
        "name": "Broccoli",
        "amount": "1 head, chopped"
      },
      {
        "name": "Bell Pepper",
        "amount": "1 medium, sliced"
      }
      // More ingredients...
    ],
    "instructions": [
      "Heat a large pan or wok over medium-high heat and add 1 tbsp olive oil",
      "Add chicken and cook until golden brown, about 5-7 minutes",
      "Add vegetables and continue stirring for 3-5 minutes until crisp-tender",
      "Add sauce ingredients and toss to coat"
      // More steps...
    ],
    "tips": "For a vegetarian option, substitute chicken with firm tofu or tempeh",
    "dietaryInfo": {
      "glutenFree": true,
      "dairyFree": true,
      "vegetarian": false,
      "vegan": false
    }
  }
};

// Comprehensive fitness assessment response template
export const fitnessAssessmentTemplate = {
  "fitnessAssessment": {
    "currentStatus": {
      "strengths": ["Good upper body strength", "Above average cardiovascular endurance"],
      "weaknesses": ["Limited mobility in shoulders", "Core stability needs improvement"],
      "recommendations": ["Focus on shoulder mobility exercises", "Include planks and core exercises"]
    },
    "recommendations": {
      "trainingFrequency": "4-5 days per week",
      "cardioRecommendation": "150 minutes moderate intensity or 75 minutes high intensity per week",
      "strengthTrainingFocus": ["Progressive overload", "Compound movements", "Core stabilization"]
    }
  }
};

/**
 * Instructions for AI prompt crafting:
 * 
 * 1. Always request ONLY valid JSON in responses
 * 2. Specify the exact structure needed using these templates
 * 3. Add clear instructions to NOT include any explanatory text
 * 4. Add validation rules for specific fields (e.g., calorie ranges)
 * 5. Request consistent naming conventions for workout days and meal times
 */
