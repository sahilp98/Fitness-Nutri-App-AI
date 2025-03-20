import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useUser } from '../context/UserContext';
import { useNotification } from '../context/NotificationContext';
import { setCurrentPlan as setCurrentWorkoutPlan } from '../store/slices/workoutSlice';
import { setCurrentPlan as setCurrentNutritionPlan } from '../store/slices/nutritionSlice';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import WorkoutAnalytics from '../components/workout/WorkoutAnalytics';
import styled from 'styled-components';

const DashboardContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
  
  @media (min-width: ${props => props.theme.breakpoints.lg}) {
    grid-template-columns: 2fr 1fr;
  }
`;

const LeftColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const RightColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const GreetingSection = styled.div`
  margin-bottom: 2rem;
`;

const GreetingTitle = styled.h1`
  font-size: ${props => props.theme.fontSizes['3xl']};
  margin-bottom: 0.5rem;
`;

const GreetingSubtitle = styled.p`
  font-size: ${props => props.theme.fontSizes.lg};
  color: rgba(45, 55, 72, 0.8);
`;

const SectionTitle = styled.h2`
  font-size: ${props => props.theme.fontSizes['2xl']};
  margin-bottom: 1rem;
`;

const StatGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 1rem;
`;

const StatCard = styled.div`
  background: ${props => props.theme.colors.background};
  box-shadow: ${props => props.theme.shadows.neuFlat};
  border-radius: ${props => props.theme.radii.lg};
  padding: 1rem;
  text-align: center;
`;

const StatValue = styled.div`
  font-size: ${props => props.theme.fontSizes['2xl']};
  font-weight: bold;
  margin-bottom: 0.5rem;
  color: ${props => props.theme.colors.primary};
`;

const StatLabel = styled.div`
  font-size: ${props => props.theme.fontSizes.sm};
  color: rgba(45, 55, 72, 0.8);
`;

const PlanPreview = styled.div`
  margin-top: 1rem;
`;

const PlanItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border-radius: ${props => props.theme.radii.md};
  background: ${props => props.theme.colors.background};
  box-shadow: ${props => props.theme.shadows.neuFlat};
  margin-bottom: 1rem;
`;

const PlanInfo = styled.div``;

const PlanName = styled.h4`
  margin: 0;
  font-size: ${props => props.theme.fontSizes.md};
`;

const PlanDetails = styled.p`
  margin: 0.25rem 0 0;
  font-size: ${props => props.theme.fontSizes.sm};
  color: rgba(45, 55, 72, 0.8);
`;

const NoPlansMessage = styled.p`
  text-align: center;
  padding: 2rem;
  color: rgba(45, 55, 72, 0.8);
`;

const RecentWorkoutsSection = styled.div`
  margin-top: 1rem;
`;

const WorkoutLogItem = styled.div`
  display: flex;
  align-items: center;
  padding: 0.75rem;
  border-radius: ${props => props.theme.radii.md};
  background: ${props => props.theme.colors.background};
  box-shadow: ${props => props.theme.shadows.neuFlat};
  margin-bottom: 0.5rem;
  cursor: pointer;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: ${props => props.theme.shadows.neuFloating};
  }
`;

const LogDate = styled.div`
  font-weight: 500;
  flex: 1;
`;

const LogDetails = styled.div`
  font-size: ${props => props.theme.fontSizes.sm};
  color: rgba(45, 55, 72, 0.8);
`;

const TabsContainer = styled.div`
  display: flex;
  margin-bottom: 1.5rem;
  border-radius: ${props => props.theme.radii.md};
  background: ${props => props.theme.colors.background};
  box-shadow: ${props => props.theme.shadows.neuInset};
  padding: 0.25rem;
`;

const Tab = styled.button`
  flex: 1;
  padding: 0.75rem;
  border: none;
  background: ${({ active, theme }) => active ? theme.colors.background : 'transparent'};
  box-shadow: ${({ active, theme }) => active ? theme.shadows.neuFlat : 'none'};
  border-radius: ${props => props.theme.radii.md};
  font-weight: ${({ active }) => active ? '600' : '400'};
  color: ${({ active, theme }) => active ? theme.colors.primary : theme.colors.text};
  cursor: pointer;
  transition: all 0.3s ease;
`;

const DashboardPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const notify = useNotification();
  const { user, calculateBMI, calculateTDEE, calculateCalorieTarget } = useUser();
  const workoutPlans = useSelector(state => state.workout.workoutPlans || []);
  const nutritionPlans = useSelector(state => state.nutrition.nutritionPlans || []);
  const completedWorkouts = useSelector(state => state.workout.completedWorkouts || []);
  
  const [activeTab, setActiveTab] = React.useState('overview'); // 'overview' or 'analytics'
  
  // Show welcome notification when component mounts
  useEffect(() => {
    if (user && user.personalInfo && user.personalInfo.name) {
      notify.success(
        `Welcome back to your fitness dashboard!`,
        `Hello, ${user.personalInfo.name}`,
        { duration: 3000 }
      );
    }
  }, []);
  
  // Schedule workout reminder if there's an active plan
  useEffect(() => {
    if (workoutPlans.length > 0) {
      const now = new Date();
      const reminderTime = new Date();
      
      // Schedule for tomorrow at 8 AM if current time is past 8 AM,
      // otherwise schedule for today at 8 AM
      if (now.getHours() >= 8) {
        reminderTime.setDate(now.getDate() + 1);
      }
      
      reminderTime.setHours(8, 0, 0, 0);
      
      notify.schedule(
        "Don't forget your workout today! Keep up the great work.",
        "Workout Reminder",
        reminderTime,
        { duration: 0 } // Persist until dismissed
      );
    }
  }, [workoutPlans]);
  
  const bmi = calculateBMI();
  const tdee = calculateTDEE();
  const calorieTarget = calculateCalorieTarget();
  
  // Sort completed workouts by date (most recent first)
  const recentWorkouts = [...(completedWorkouts || [])]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 3); // Get only the 3 most recent
  
  const viewWorkoutPlan = (plan) => {
    dispatch(setCurrentWorkoutPlan(plan));
    navigate('/workout-plan-view');
    notify.info(
      `Viewing your ${plan.workoutPlan.name} workout plan`,
      'Workout Plan'
    );
  };
  
  const viewNutritionPlan = (plan) => {
    dispatch(setCurrentNutritionPlan(plan));
    navigate('/nutrition-plan-view');
    notify.info(
      `Viewing your ${plan.nutritionPlan.name} nutrition plan`,
      'Nutrition Plan'
    );
  };
  
  return (
    <>
      <GreetingSection>
        <GreetingTitle>Welcome back, {user.personalInfo.name || 'Fitness Enthusiast'}!</GreetingTitle>
        <GreetingSubtitle>Here's an overview of your fitness journey.</GreetingSubtitle>
      </GreetingSection>
      
      <TabsContainer>
        <Tab 
          active={activeTab === 'overview'} 
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </Tab>
        <Tab 
          active={activeTab === 'analytics'} 
          onClick={() => setActiveTab('analytics')}
        >
          Analytics
        </Tab>
      </TabsContainer>
      
      {activeTab === 'overview' ? (
        <DashboardContainer>
          <LeftColumn>
            <Card title="Current Plans">
              <SectionTitle>Workout Plan</SectionTitle>
              <PlanPreview>
                {workoutPlans.length > 0 ? (
                  workoutPlans.slice(0, 1).map(plan => (
                    <PlanItem key={plan.id}>
                      <PlanInfo>
                        <PlanName>{plan.workoutPlan.name}</PlanName>
                        <PlanDetails>
                          {plan.workoutPlan.frequency} • {plan.workoutPlan.level} level
                        </PlanDetails>
                      </PlanInfo>
                      <Button 
                        onClick={() => viewWorkoutPlan(plan)}
                        variant="secondary"
                        size="small"
                      >
                        View Plan
                      </Button>
                    </PlanItem>
                  ))
                ) : (
                  <NoPlansMessage>
                    You don't have any workout plans yet.
                    <br />
                    <Button 
                      as={Link} 
                      to="/workout-planner" 
                      variant="primary"
                      size="small"
                      margin="1rem 0 0"
                      onClick={() => notify.info('Creating a new workout plan', 'Workout Planner')}
                    >
                      Create Workout Plan
                    </Button>
                  </NoPlansMessage>
                )}
              </PlanPreview>
              
              <SectionTitle>Nutrition Plan</SectionTitle>
              <PlanPreview>
                {nutritionPlans.length > 0 ? (
                  nutritionPlans.slice(0, 1).map(plan => (
                    <PlanItem key={plan.id}>
                      <PlanInfo>
                        <PlanName>{plan.nutritionPlan.name}</PlanName>
                        <PlanDetails>
                          {plan.nutritionPlan.dailyCalories} calories • {plan.nutritionPlan.meals.length} meals
                        </PlanDetails>
                      </PlanInfo>
                      <Button 
                        onClick={() => viewNutritionPlan(plan)}
                        variant="secondary"
                        size="small"
                      >
                        View Plan
                      </Button>
                    </PlanItem>
                  ))
                ) : (
                  <NoPlansMessage>
                    You don't have any nutrition plans yet.
                    <br />
                    <Button 
                      as={Link} 
                      to="/nutrition-planner" 
                      variant="primary"
                      size="small"
                      margin="1rem 0 0"
                      onClick={() => notify.info('Creating a new nutrition plan', 'Nutrition Planner')}
                    >
                      Create Nutrition Plan
                    </Button>
                  </NoPlansMessage>
                )}
              </PlanPreview>
            </Card>
            
            <Card title="Recent Activity">
              <SectionTitle>Recent Workouts</SectionTitle>
              <RecentWorkoutsSection>
                {recentWorkouts.length > 0 ? (
                  recentWorkouts.map(workout => (
                    <WorkoutLogItem 
                      key={workout.id} 
                      onClick={() => navigate('/workout-log-view', { state: { workoutId: workout.id } })}
                    >
                      <LogDate>
                        {new Date(workout.date).toLocaleDateString()}
                      </LogDate>
                      <LogDetails>
                        {workout.exercises?.length || 0} exercises • {workout.duration} min
                      </LogDetails>
                    </WorkoutLogItem>
                  ))
                ) : (
                  <NoPlansMessage>No workouts logged yet.</NoPlansMessage>
                )}
              </RecentWorkoutsSection>
              
              <Button 
                as={Link}
                to="/workout-log"
                variant="primary"
                size="small"
                fullWidth
                margin="1rem 0 0"
                onClick={() => notify.info('Logging a new workout', 'Workout Logger')}
              >
                Log New Workout
              </Button>
            </Card>
          </LeftColumn>
          
          <RightColumn>
            <Card title="Your Stats">
              <StatGrid>
                <StatCard>
                  <StatValue>{bmi || '-'}</StatValue>
                  <StatLabel>BMI</StatLabel>
                </StatCard>
                
                <StatCard>
                  <StatValue>{user.personalInfo.weight || '-'}</StatValue>
                  <StatLabel>Weight (kg)</StatLabel>
                </StatCard>
                
                <StatCard>
                  <StatValue>{tdee || '-'}</StatValue>
                  <StatLabel>TDEE (cal)</StatLabel>
                </StatCard>
                
                <StatCard>
                  <StatValue>{calorieTarget || '-'}</StatValue>
                  <StatLabel>Target (cal)</StatLabel>
                </StatCard>
              </StatGrid>
              
              <Button 
                as={Link}
                to="/progress"
                variant="secondary"
                size="small"
                fullWidth
                margin="1rem 0 0"
                onClick={() => notify.info('Viewing your progress tracking', 'Progress')}
              >
                View Full Progress
              </Button>
            </Card>
            
            <Card title="Quick Actions">
              <Button 
                as={Link}
                to="/workout-planner"
                variant="primary"
                fullWidth
                margin="0 0 1rem"
              >
                Create Workout Plan
              </Button>
              
              <Button 
                as={Link}
                to="/nutrition-planner"
                variant="primary"
                fullWidth
                margin="0 0 1rem"
              >
                Create Nutrition Plan
              </Button>
              
              <Button 
                as={Link}
                to="/progress"
                variant="secondary"
                fullWidth
              >
                Log Today's Weight
              </Button>
            </Card>
          </RightColumn>
        </DashboardContainer>
      ) : (
        <WorkoutAnalytics />
      )}
    </>
  );
};

export default DashboardPage;
