

class GeminiService {
  constructor() {
    this.apiKey = process.env.REACT_APP_GEMINI_API_KEY;
    this.baseURL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';
  }

  async makeRequest(prompt) {
    try {
      const response = await fetch(`${this.baseURL}?key=${this.apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 2000,
          }
        })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error?.message || 'Error calling Gemini API');
      }

      return data.candidates[0].content.parts[0].text;
    } catch (error) {
      console.error('Gemini API error:', error);
      throw error;
    }
  }

  // The same prompt creation and generation methods as OpenAIService
  async generateWorkoutPlan(userDetails, preferences) {
    const prompt = this.createWorkoutPrompt(userDetails, preferences);
    return this.makeRequest(prompt);
  }

  async generateMealPlan(userDetails, preferences) {
    const prompt = this.createMealPrompt(userDetails, preferences);
    return this.makeRequest(prompt);
  }

  async generateRecipe(ingredients, preferences) {
    const prompt = this.createRecipePrompt(ingredients, preferences);
    return this.makeRequest(prompt);
  }

  createWorkoutPrompt(userDetails, preferences) {
    // Create a simplified template with only the structure, removing comments
    const templateStr = JSON.stringify({
      workoutPlan: {
        name: "Name of workout plan",
        goal: preferences.goal,
        level: preferences.level,
        frequency: `${preferences.daysPerWeek} days per week`,
        duration: `${preferences.timePerSession} minutes per session`,
        schedule: {
          day1: {
            focus: "Target area",
            exercises: [{
              name: "Exercise name",
              muscleGroup: "Primary muscle group",
              sets: 3,
              reps: "8-12",
              rest: 60,
              instructions: "Brief instructions"
            }]
          }
        },
        notes: "Additional notes",
        warmup: "Warmup instructions",
        cooldown: "Cooldown instructions"
      }
    }, null, 2);

    return `You are a fitness expert creating a personalized workout plan. Your response MUST be a valid JSON object.

USER DETAILS:
- Age: ${userDetails.personalInfo.age} years
- Gender: ${userDetails.personalInfo.gender}
- Height: ${userDetails.personalInfo.height} cm
- Weight: ${userDetails.personalInfo.weight} kg
- Fitness goal: ${preferences.goal}
- Available equipment: ${preferences.equipment.join(', ')}
- Workout days per week: ${preferences.daysPerWeek}
- Time per session: ${preferences.timePerSession} minutes
- Fitness level: ${preferences.level}
- Target areas: ${preferences.targetAreas.length > 0 ? preferences.targetAreas.join(', ') : 'All muscle groups'}

Your response MUST follow this EXACT JSON structure:
${templateStr}

Generate a complete workout plan with the correct number of days based on the user's preferred frequency (${preferences.daysPerWeek} days per week).
Include appropriate exercises for each day with proper sets, reps and rest times.
RETURN ONLY THE JSON OBJECT, with no additional text before or after it.`;
  }

  createMealPrompt(userDetails, preferences) {
    // Create a simplified template with only the structure, removing comments
    const templateStr = JSON.stringify({
      nutritionPlan: {
        name: "Name of the meal plan",
        dailyCalories: parseInt(preferences.calorieTarget),
        macros: {
          protein: Math.round(preferences.calorieTarget * 0.3 / 4), // 30% protein
          carbs: Math.round(preferences.calorieTarget * 0.4 / 4),   // 40% carbs
          fats: Math.round(preferences.calorieTarget * 0.3 / 9)     // 30% fats
        },
        meals: [
          {
            name: "Meal name (e.g. Breakfast)",
            time: "Time (e.g. 8:00 AM)",
            calories: 0,
            protein: 0,
            carbs: 0,
            fats: 0,
            items: [
              {
                food: "Food name",
                amount: "Serving size",
                calories: 0,
                protein: 0,
                carbs: 0, 
                fats: 0,
                recipe: "Preparation instructions (optional)"
              }
            ]
          }
        ]
      }
    }, null, 2);

    return `You are a nutrition expert creating a personalized meal plan. Your response MUST be a valid JSON object.

USER DETAILS:
- Age: ${userDetails.personalInfo.age} years
- Gender: ${userDetails.personalInfo.gender}
- Height: ${userDetails.personalInfo.height} cm
- Weight: ${userDetails.personalInfo.weight} kg
- Daily caloric target: ${preferences.calorieTarget}
- Dietary preferences: ${preferences.dietaryPreferences.join(', ')}
- Dietary restrictions: ${preferences.dietaryRestrictions.join(', ')}
- Allergies: ${preferences.allergies}
- Meals per day: ${preferences.mealsPerDay}

Your response MUST follow this EXACT JSON structure:
${templateStr}

Create exactly ${preferences.mealsPerDay} meals in the plan, with appropriate distribution of calories throughout the day.
Include nutritionally balanced meals that match the user's preferences and restrictions.
All nutritional values should be realistic and add up correctly.
RETURN ONLY THE JSON OBJECT, with no additional text before or after it.`;
  }

  createRecipePrompt(ingredients, preferences) {
    // Create a simplified template with only the structure, removing comments
    const templateStr = JSON.stringify({
      recipe: {
        name: "Recipe name",
        calories: 0,
        macros: {
          protein: 0,
          carbs: 0,
          fats: 0
        },
        prepTime: "Preparation time",
        cookTime: "Cooking time",
        servings: 0,
        ingredients: [
          {
            name: "Ingredient name",
            amount: "Amount needed"
          }
        ],
        instructions: [
          "Step 1: Instruction",
          "Step 2: Instruction"
        ],
        tips: "Additional tips or variations"
      }
    }, null, 2);

    return `You are a culinary expert creating a recipe based on available ingredients. Your response MUST be a valid JSON object.

INGREDIENTS: ${ingredients.join(', ')}

DIETARY PREFERENCES:
- Diet type: ${preferences.dietType}
- Restrictions: ${preferences.restrictions}

Your response MUST follow this EXACT JSON structure:
${templateStr}

Create a recipe that uses the provided ingredients while respecting the dietary preferences.
Include realistic nutritional information and clear step-by-step instructions.
RETURN ONLY THE JSON OBJECT, with no additional text before or after it.`;
  }
}

export default GeminiService;
