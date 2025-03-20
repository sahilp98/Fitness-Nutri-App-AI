# Data Models

## User Profile
```javascript
{
  id: String,
  personalInfo: {
    name: String,
    email: String,
    age: Number,
    gender: String,
    height: Number, // in cm
    weight: Number, // in kg
    activityLevel: String, // sedentary, lightly active, moderately active, very active, extremely active
  },
  fitnessGoals: {
    primaryGoal: String, // weight loss, muscle gain, maintenance, endurance, etc.
    targetWeight: Number, // optional
    weeklyGoal: Number, // e.g., lose 0.5kg per week
    workoutFrequency: Number, // days per week
  },
  preferences: {
    availableEquipment: [String], // home, gym, bands, dumbbells, etc.
    dietaryPreferences: [String], // vegetarian, vegan, pescatarian, etc.
    dietaryRestrictions: [String], // gluten-free, dairy-free, nut allergies, etc.
    excludedExercises: [String], // exercises to avoid due to injuries, etc.
    excludedFoods: [String],
    preferredCuisines: [String],
  },
  measurements: [
    {
      date: Date,
      weight: Number,
      bodyFat: Number, // optional
      measurements: { // all optional
        chest: Number,
        waist: Number,
        hips: Number,
        thighs: Number,
        arms: Number,
      }
    }
  ]
}
```

## Workout Plan
```javascript
{
  id: String,
  userId: String,
  createdAt: Date,
  name: String,
  description: String,
  duration: Number, // in weeks
  caloriesBurnEstimate: Number,
  schedule: {
    monday: {
      focus: String, // e.g., "Upper Body", "Cardio"
      workouts: [
        {
          exercise: {
            name: String,
            muscleGroup: String,
            equipment: String,
            description: String,
            videoUrl: String, // optional
            imageUrl: String, // optional
          },
          sets: Number,
          reps: String, // can be range like "8-12" or time like "30 seconds"
          restBetweenSets: Number, // in seconds
          weight: String, // can be "bodyweight" or specific weight
          notes: String
        }
      ],
      restTime: Number, // in minutes
    },
    // other days of the week...
  }
}
```

## Nutrition Plan
```javascript
{
  id: String,
  userId: String,
  createdAt: Date,
  name: String,
  description: String,
  calorieTarget: Number,
  macroBreakdown: {
    protein: Number, // in grams
    carbs: Number, // in grams
    fats: Number, // in grams
  },
  meals: [
    {
      name: String, // e.g., "Breakfast"
      time: String, // e.g., "8:00 AM"
      calories: Number,
      macros: {
        protein: Number,
        carbs: Number,
        fats: Number,
      },
      foods: [
        {
          name: String,
          servingSize: String,
          calories: Number,
          protein: Number,
          carbs: Number,
          fats: Number,
          recipeUrl: String, // optional
          imageUrl: String, // optional
        }
      ]
    }
  ],
  shoppingList: [
    {
      category: String, // e.g., "Proteins", "Vegetables"
      items: [
        {
          name: String,
          quantity: String,
          notes: String, // optional
        }
      ]
    }
  ]
}
```

## Progress Log
```javascript
{
  id: String,
  userId: String,
  date: Date,
  type: String, // "workout" or "nutrition" or "measurement"
  data: {
    // For workout
    workoutCompleted: Boolean,
    exercises: [
      {
        name: String,
        sets: Number,
        reps: [Number], // actual reps performed in each set
        weight: [Number], // actual weight used in each set
        notes: String,
      }
    ],
    
    // For nutrition
    mealsLogged: [
      {
        name: String,
        foods: [
          {
            name: String,
            servingSize: String,
            calories: Number,
            macros: {
              protein: Number,
              carbs: Number,
              fats: Number,
            }
          }
        ],
        totalCalories: Number,
        totalMacros: {
          protein: Number,
          carbs: Number,
          fats: Number,
        },
      }
    ],
    
    // For measurement
    measurements: {
      weight: Number,
      bodyFat: Number, // optional
      other: Object, // other measurements
    }
  }
}
```
