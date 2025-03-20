import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { FaUtensils, FaTrashAlt } from 'react-icons/fa';
import { deleteNutritionPlan } from '../store/slices/nutritionSlice';

const PlanContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
`;

const PlanHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  
  @media (max-width: ${props => props.theme.breakpoints.md}) {
    flex-direction: column;
    align-items: flex-start;
    
    > div:last-child {
      margin-top: 1rem;
      align-self: flex-end;
    }
  }
`;

const MacroDisplay = styled.div`
  display: flex;
  justify-content: space-between;
  margin: 1.5rem 0;
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

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
`;

const NutritionPlanViewPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const currentPlan = useSelector(state => state.nutrition.currentPlan);
  
  if (!currentPlan) {
    navigate('/dashboard');
    return null;
  }
  
  const { nutritionPlan } = currentPlan;
  
  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this nutrition plan?')) {
      dispatch(deleteNutritionPlan(currentPlan.id));
      navigate('/dashboard');
    }
  };
  
  return (
    <PlanContainer>
      <PlanHeader>
        <div>
          <h1>{nutritionPlan.name}</h1>
          <p>Your personalized nutrition plan</p>
        </div>
        
        <ButtonGroup>
          <Button 
            variant="error"
            size="small"
            onClick={handleDelete}
          >
            <FaTrashAlt style={{ marginRight: '0.5rem' }} /> Delete Plan
          </Button>
          
          <Button 
            variant="secondary"
            size="small"
            onClick={() => navigate('/nutrition-planner')}
          >
            Create New Plan
          </Button>
        </ButtonGroup>
      </PlanHeader>
      
      <p><strong>Daily Calories:</strong> {nutritionPlan.dailyCalories}</p>
      
      <MacroDisplay>
        <MacroItem>
          <MacroValue>{nutritionPlan.macros.protein}g</MacroValue>
          <MacroLabel>Protein</MacroLabel>
        </MacroItem>
        <MacroItem>
          <MacroValue>{nutritionPlan.macros.carbs}g</MacroValue>
          <MacroLabel>Carbs</MacroLabel>
        </MacroItem>
        <MacroItem>
          <MacroValue>{nutritionPlan.macros.fats}g</MacroValue>
          <MacroLabel>Fats</MacroLabel>
        </MacroItem>
      </MacroDisplay>
      
      <h2>Daily Meals</h2>
      
      {nutritionPlan.meals.map((meal, index) => (
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
      
      <Button 
        variant="primary"
        onClick={() => navigate(-1)}
        margin="2rem 0"
      >
        Back
      </Button>
    </PlanContainer>
  );
};

export default NutritionPlanViewPage;
