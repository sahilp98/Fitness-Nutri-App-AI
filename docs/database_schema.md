# Database Schema Design

For our fitness and nutrition application, we'll use a combination of client-side storage (localStorage) for immediate data and user preferences, and potentially a backend database for user accounts and generated plans.

## Client-Side Storage Schema

### User Profile
```
{
  "userId": "unique-user-id",
  "personalInfo": {
    "name": "User Name",
    "email": "user@example.com",
    "age": 30,
    "gender": "female",
    "height": 165,
    "weight": 65,
    "activityLevel": "moderately active"
  },
  "fitnessGoals": {
    "primaryGoal": "weight loss",
    "targetWeight": 60,
    "workoutFrequency": 4
  },
  "preferences": {
    "availableEquipment": ["dumbbells", "resistance bands"],
    "dietaryPreferences": ["high protein", "mediterranean"],
    "dietaryRestrictions": ["gluten free"],
    "excludedExercises": ["barbell squat"]
  }
}
```

### Workout Plans
```
{
  "workoutPlans": [
    {
      "planId": "workout-plan-1",
      "createdAt": "2023-12-01T12:00:00Z",
      "name": "4-Week Weight Loss Plan",
      "description": "High intensity interval training with strength components",
      "schedule": {
        "monday": {
          "focus": "Upper Body",
          "exercises": [...]
        },
        "wednesday": {
          "focus": "Lower Body",
          "exercises": [...]
        },
        "friday": {
          "focus": "Full Body",
          "exercises": [...]
        },
        "saturday": {
          "focus": "Cardio",
          "exercises": [...]
        }
      }
    }
  ]
}
```

### Nutrition Plans
```
{
  "nutritionPlans": [
    {
      "planId": "nutrition-plan-1",
      "createdAt": "2023-12-01T12:00:00Z",
      "name": "Weight Loss Meal Plan",
      "calorieTarget": 1800,
      "macros": {
        "protein": 135,
        "carbs": 180,
        "fats": 60
      },
      "meals": [...]
    }
  ]
}
```

### Progress Logs
```
{
  "progressLogs": [
    {
      "date": "2023-12-05",
      "weight": 64.5,
      "measurements": {
        "waist": 80,
        "hips": 95
      },
      "completedWorkouts": ["workout-session-1"]
    }
  ]
}
```

### Workout Sessions
```
{
  "workoutSessions": [
    {
      "sessionId": "workout-session-1",
      "date": "2023-12-05",
      "planId": "workout-plan-1",
      "completed": true,
      "exercises": [
        {
          "name": "Push-ups",
          "sets": [
            {"reps": 12, "weight": "bodyweight"},
            {"reps": 10, "weight": "bodyweight"},
            {"reps": 8, "weight": "bodyweight"}
          ]
        }
      ]
    }
  ]
}
```

### Meal Logs
```
{
  "mealLogs": [
    {
      "date": "2023-12-05",
      "meals": [
        {
          "name": "Breakfast",
          "time": "08:30",
          "foods": [
            {
              "name": "Oatmeal with berries",
              "servingSize": "1 cup",
              "calories": 300,
              "protein": 10,
              "carbs": 45,
              "fats": 8
            }
          ]
        }
      ],
      "totalCalories": 1750,
      "totalMacros": {
        "protein": 130,
        "carbs": 175,
        "fats": 58
      }
    }
  ]
}
```

## Future Backend Database Considerations

When scaling the application, we'll consider implementing a proper backend database with the following collections/tables:

1. Users
2. WorkoutPlans
3. NutritionPlans
4. Exercises (reference collection)
5. FoodItems (reference collection)
6. WorkoutLogs
7. NutritionLogs
8. BodyMeasurements

The database will likely use MongoDB for flexibility or PostgreSQL for relational integrity, depending on scaling requirements.
