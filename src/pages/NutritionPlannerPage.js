import React, { useState } from 'react';
import styled from 'styled-components';
import { useDispatch } from 'react-redux';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import { useUser } from '../context/UserContext';
import { useAI } from '../context/AIContext';
import { addNutritionPlan, setCurrentPlan } from '../store/slices/nutritionSlice';

const NutritionPlannerContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
  
  @media (min-width: ${props => props.theme.breakpoints.lg}) {
    grid-template-columns: 1fr 2fr;
  }
`;

const MultiSelect = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 0.5rem;
`;

const Option = styled.div`
  ${({ selected, theme }) => selected ? theme.shadows.neuPressed : theme.shadows.neuFlat}
  padding: 0.5rem 1rem;
  border-radius: ${props => props.theme.radii.md};
  background-color: ${props => props.selected ? props.theme.colors.primary + '20' : props.theme.colors.background};
  color: ${props => props.selected ? props.theme.colors.primary : props.theme.colors.text};
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background-color: ${props => props.theme.colors.primary + '10'};
  }
`;

const FormSection = styled.div`
  margin-bottom: 1.5rem;
`;

const SectionTitle = styled.h3`
  margin-bottom: 1rem;
`;

const PlanDisplay = styled.div`
  overflow-y: auto;
  max-height: 600px;
`;

const MealCard = styled(Card)`
  margin-bottom: 1.5rem;
`;

const FoodItem = styled.div`
  padding: 1rem;
  margin-bottom: 1rem;
  border-radius: ${props => props.theme.radii.md};
  background: ${props => props.theme.colors.background};
  box-shadow: ${props => props.theme.shadows.neuInset};
`;

const FoodName = styled.h4`
  margin: 0 0 0.5rem;
`;

const FoodDetails = styled.p`
  margin: 0;
  font-size: ${props => props.theme.fontSizes.sm};
  color: rgba(45, 55, 72, 0.8);
`;

const MacroDisplay = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 1rem;
  padding: 1rem;
  border-radius: ${props => props.theme.radii.md};
  background: ${props => props.theme.colors.background};
  box-shadow: ${props => props.theme.shadows.neuInset};
`;

const MacroItem = styled.div`
  text-align: center;
`;

const MacroValue = styled.div`
  font-weight: bold;
  font-size: ${props => props.theme.fontSizes.lg};
  color: ${props => props.theme.colors.primary};
`;

const MacroLabel = styled.div`
  font-size: ${props => props.theme.fontSizes.xs};
  text-transform: uppercase;
  letter-spacing: 1px;
`;

const LoadingOverlay = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem;
  text-align: center;
`;

const LoadingText = styled.p`
  margin-top: 1rem;
  font-size: ${props => props.theme.fontSizes.lg};
`;

const ErrorMessage = styled.div`
  padding: 1rem;
  background-color: #fff5f5;
  color: ${props => props.theme.colors.error};
  border-radius: ${props => props.theme.radii.md};
  margin-bottom: 1rem;
`;

const NutritionPlannerPage = () => {
  const dispatch = useDispatch();
  const { user, calculateCalorieTarget, calculateMacros } = useUser();
  const { generateNutritionPlan, isLoading, error } = useAI();
  const [nutritionPlan, setNutritionPlan] = useState(null);
  
  const defaultCalories = calculateCalorieTarget() || 2000;
  const defaultMacros = calculateMacros() || { protein: 150, carbs: 200, fats: 70 };
  
  const [preferences, setPreferences] = useState({
    calorieTarget: defaultCalories,
    macros: defaultMacros,
    mealsPerDay: '3',
    dietaryPreferences: user.preferences.dietaryPreferences || [],
    dietaryRestrictions: user.preferences.dietaryRestrictions || [],
    allergies: '',
  });
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPreferences({
      ...preferences,
      [name]: value
    });
  };
  
  const handleMultiSelectToggle = (field, value) => {
    setPreferences(prev => {
      const currentValues = prev[field] || [];
      const newValues = currentValues.includes(value)
        ? currentValues.filter(v => v !== value)
        : [...currentValues, value];
      
      return {
        ...prev,
        [field]: newValues
      };
    });
  };
  
  const generatePlan = async () => {
    try {
      setNutritionPlan(null); // Reset any existing plan
      const plan = await generateNutritionPlan(user, preferences);
      
      // Parse the JSON response from the AI
      try {
        // First try to parse the response directly as JSON
        let parsedPlan = null;
        
        try {
          parsedPlan = JSON.parse(plan);
        } catch (directParseError) {
          // If direct parsing fails, try to extract JSON from text
          const jsonMatch = plan.match(/\{[\s\S]*\}/);
          if (jsonMatch) {
            parsedPlan = JSON.parse(jsonMatch[0]);
          } else {
            throw new Error('Could not extract JSON from response');
          }
        }

        // Validate the parsed plan has the expected structure
        if (!parsedPlan || !parsedPlan.nutritionPlan || !parsedPlan.nutritionPlan.meals) {
          throw new Error('Invalid nutrition plan format');
        }
        
        setNutritionPlan(parsedPlan);
        
      } catch (parseError) {
        console.error('Error parsing AI response:', parseError);
        console.log('Raw AI response:', plan);
        
        // Display an alert to the user
        window.alert(`Error parsing the AI response. Please try again. Error: ${parseError.message}`);
      }
    } catch (err) {
      console.error('Error generating nutrition plan:', err);
      window.alert(`Error generating nutrition plan: ${err.message}`);
    }
  };
  
  const savePlan = () => {
    if (nutritionPlan) {
      const planToSave = {
        nutritionPlan: nutritionPlan.nutritionPlan,
        preferences
      };
      dispatch(addNutritionPlan(planToSave));
      dispatch(setCurrentPlan(planToSave));
    }
  };
  
  return (
    <>
      <h1>Nutrition Planner</h1>
      <p>Generate a personalized meal plan based on your preferences and goals.</p>
      
      {error && <ErrorMessage>{error}</ErrorMessage>}
      
      <NutritionPlannerContainer>
        <div>
          <Card title="Nutrition Preferences">
            <FormSection>
              <SectionTitle>Calorie & Macro Goals</SectionTitle>
              
              <Input
                label="Daily Calorie Target"
                name="calorieTarget"
                type="number"
                value={preferences.calorieTarget}
                onChange={handleInputChange}
                min="1200"
                max="5000"
              />
              
              <Select
                label="Meals Per Day"
                name="mealsPerDay"
                value={preferences.mealsPerDay}
                onChange={handleInputChange}
                options={[
                  { value: '2', label: '2 Meals' },
                  { value: '3', label: '3 Meals' },
                  { value: '4', label: '4 Meals' },
                  { value: '5', label: '5 Meals' },
                  { value: '6', label: '6 Meals' }
                ]}
              />
            </FormSection>
            
            <FormSection>
              <SectionTitle>Dietary Preferences</SectionTitle>
              
              <MultiSelect>
                {['balanced', 'high-protein', 'low-carb', 'vegetarian', 'vegan', 'pescatarian', 'paleo', 'keto', 'mediterranean'].map(pref => (
                  <Option
                    key={pref}
                    selected={preferences.dietaryPreferences.includes(pref)}
                    onClick={() => handleMultiSelectToggle('dietaryPreferences', pref)}
                  >
                    {pref.charAt(0).toUpperCase() + pref.slice(1)}
                  </Option>
                ))}
              </MultiSelect>
            </FormSection>
            
            <FormSection>
              <SectionTitle>Dietary Restrictions</SectionTitle>
              
              <MultiSelect>
                {['gluten-free', 'dairy-free', 'nut-free', 'shellfish-free', 'soy-free', 'egg-free'].map(restriction => (
                  <Option
                    key={restriction}
                    selected={preferences.dietaryRestrictions.includes(restriction)}
                    onClick={() => handleMultiSelectToggle('dietaryRestrictions', restriction)}
                  >
                    {restriction.charAt(0).toUpperCase() + restriction.slice(1)}
                  </Option>
                ))}
              </MultiSelect>
            </FormSection>
            
            <FormSection>
              <Input
                label="Food Allergies"
                name="allergies"
                value={preferences.allergies}
                onChange={handleInputChange}
                placeholder="List any food allergies"
              />
            </FormSection>
            
            <Button 
              variant="primary"
              onClick={generatePlan}
              fullWidth
              isLoading={isLoading}
              disabled={isLoading}
            >
              Generate Meal Plan
            </Button>
          </Card>
        </div>
        
        <div>
          {isLoading ? (
            <Card>
              <LoadingOverlay>
                <div>🍽️</div>
                <LoadingText>Preparing your personalized meal plan...</LoadingText>
              </LoadingOverlay>
            </Card>
          ) : nutritionPlan ? (
            <PlanDisplay>
              <Card 
                title={nutritionPlan.nutritionPlan.name}
                footer={
                  <Button variant="success" onClick={savePlan}>
                    Save Meal Plan
                  </Button>
                }
              >
                <p><strong>Daily Calories:</strong> {nutritionPlan.nutritionPlan.dailyCalories}</p>
                
                <MacroDisplay>
                  <MacroItem>
                    <MacroValue>{nutritionPlan.nutritionPlan.macros.protein}g</MacroValue>
                    <MacroLabel>Protein</MacroLabel>
                  </MacroItem>
                  <MacroItem>
                    <MacroValue>{nutritionPlan.nutritionPlan.macros.carbs}g</MacroValue>
                    <MacroLabel>Carbs</MacroLabel>
                  </MacroItem>
                  <MacroItem>
                    <MacroValue>{nutritionPlan.nutritionPlan.macros.fats}g</MacroValue>
                    <MacroLabel>Fats</MacroLabel>
                  </MacroItem>
                </MacroDisplay>
                
                <h3>Daily Meals</h3>
                
                {nutritionPlan.nutritionPlan.meals.map((meal, index) => (
                  <MealCard key={index} title={`${meal.name} (${meal.time})`}>
                    <p>
                      <strong>Calories:</strong> {meal.calories} • 
                      <strong> Protein:</strong> {meal.protein}g • 
                      <strong> Carbs:</strong> {meal.carbs}g • 
                      <strong> Fats:</strong> {meal.fats}g
                    </p>
                    
                    <h4>Foods</h4>
                    {meal.items.map((food, i) => (
                      <FoodItem key={i}>
                        <FoodName>{food.food}</FoodName>
                        <FoodDetails>
                          <strong>Portion:</strong> {food.amount}
                        </FoodDetails>
                        <FoodDetails>
                          <strong>Calories:</strong> {food.calories} • 
                          <strong> Protein:</strong> {food.protein}g • 
                          <strong> Carbs:</strong> {food.carbs}g • 
                          <strong> Fats:</strong> {food.fats}g
                        </FoodDetails>
                        {food.recipe && (
                          <FoodDetails>
                            <strong>Recipe:</strong> {food.recipe}
                          </FoodDetails>
                        )}
                      </FoodItem>
                    ))}
                  </MealCard>
                ))}
              </Card>
            </PlanDisplay>
          ) : (
            <Card>
              <p>
                Your personalized meal plan will appear here after generation.
                Please fill out your nutrition preferences and click "Generate Meal Plan".
              </p>
            </Card>
          )}
        </div>
      </NutritionPlannerContainer>
    </>
  );
};

export default NutritionPlannerPage;
