import React, { useState } from 'react';
import styled from 'styled-components';
import { useDispatch } from 'react-redux';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import { useUser } from '../context/UserContext';
import { useAI } from '../context/AIContext';
import { addWorkoutPlan, setCurrentPlan } from '../store/slices/workoutSlice';
import { FaDumbbell, FaRunning, FaClock, FaExclamationTriangle } from 'react-icons/fa';

const WorkoutPlannerContainer = styled.div`
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
  max-height: 800px;
`;

const WorkoutDay = styled(Card)`
  margin-bottom: 1.5rem;
`;

const ExerciseItem = styled.div`
  padding: 1rem;
  margin-bottom: 1rem;
  border-radius: ${props => props.theme.radii.md};
  background: ${props => props.theme.colors.background};
  box-shadow: ${props => props.theme.shadows.neuInset};
`;

const ExerciseName = styled.h4`
  margin: 0 0 0.5rem;
`;

const ExerciseDetails = styled.p`
  margin: 0.25rem 0 0;
  font-size: ${props => props.theme.fontSizes.sm};
  color: rgba(45, 55, 72, 0.8);
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

const PlanOverview = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 1.5rem;
`;

const PlanStat = styled.div`
  display: flex;
  align-items: center;
  padding: 0.75rem 1rem;
  border-radius: ${props => props.theme.radii.md};
  background: ${props => props.theme.colors.background};
  box-shadow: ${props => props.theme.shadows.neuFlat};
`;

const PlanStatIcon = styled.div`
  margin-right: 0.75rem;
  color: ${props => props.theme.colors.primary};
`;

const PlanNote = styled.div`
  padding: 1rem;
  border-radius: ${props => props.theme.radii.md};
  background: ${props => props.theme.colors.background};
  box-shadow: ${props => props.theme.shadows.neuInset};
  margin: 1.5rem 0;
  font-style: italic;
`;

const WorkoutPlannerPage = () => {
  const dispatch = useDispatch();
  const { user } = useUser();
  const { generateWorkoutPlan, isLoading, error } = useAI();
  const [workoutPlan, setWorkoutPlan] = useState(null);
  
  const [preferences, setPreferences] = useState({
    goal: 'strength',
    daysPerWeek: '3',
    timePerSession: '45',
    level: 'intermediate',
    equipment: ['bodyweight', 'dumbbell'],
    targetAreas: [],
    excludeExercises: '',
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
      setWorkoutPlan(null); // Reset any existing plan
      const plan = await generateWorkoutPlan(user, preferences);
      
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
        if (!parsedPlan || !parsedPlan.workoutPlan || !parsedPlan.workoutPlan.schedule) {
          throw new Error('Invalid workout plan format');
        }
        
        setWorkoutPlan(parsedPlan);
        
      } catch (parseError) {
        console.error('Error parsing AI response:', parseError);
        console.log('Raw AI response:', plan);
        
        // Display an alert to the user
        window.alert(`Error parsing the AI response. Please try again. Error: ${parseError.message}`);
      }
    } catch (err) {
      console.error('Error generating workout plan:', err);
      window.alert(`Error generating workout plan: ${err.message}`);
    }
  };
  
  const savePlan = () => {
    if (workoutPlan) {
      const planToSave = {
        workoutPlan: workoutPlan.workoutPlan,
        preferences
      };
      dispatch(addWorkoutPlan(planToSave));
      dispatch(setCurrentPlan(planToSave));
      window.alert('Workout plan saved successfully!');
    }
  };
  
  return (
    <>
      <h1>Workout Planner</h1>
      <p>Generate a personalized workout plan based on your preferences and goals.</p>
      
      {error && <ErrorMessage>{error}</ErrorMessage>}
      
      <WorkoutPlannerContainer>
        <div>
          <Card title="Workout Preferences">
            <FormSection>
              <SectionTitle>Goals & Experience</SectionTitle>
              
              <Select
                label="Fitness Goal"
                name="goal"
                value={preferences.goal}
                onChange={handleInputChange}
                options={[
                  { value: 'strength', label: 'Build Strength' },
                  { value: 'muscle', label: 'Build Muscle' },
                  { value: 'endurance', label: 'Improve Endurance' },
                  { value: 'weight-loss', label: 'Weight Loss' },
                  { value: 'toning', label: 'Toning' },
                  { value: 'general', label: 'General Fitness' }
                ]}
              />
              
              <Select
                label="Fitness Level"
                name="level"
                value={preferences.level}
                onChange={handleInputChange}
                options={[
                  { value: 'beginner', label: 'Beginner' },
                  { value: 'intermediate', label: 'Intermediate' },
                  { value: 'advanced', label: 'Advanced' }
                ]}
              />
            </FormSection>
            
            <FormSection>
              <SectionTitle>Schedule</SectionTitle>
              
              <Select
                label="Days Per Week"
                name="daysPerWeek"
                value={preferences.daysPerWeek}
                onChange={handleInputChange}
                options={[
                  { value: '2', label: '2 Days' },
                  { value: '3', label: '3 Days' },
                  { value: '4', label: '4 Days' },
                  { value: '5', label: '5 Days' },
                  { value: '6', label: '6 Days' }
                ]}
              />
              
              <Input
                label="Minutes Per Session"
                name="timePerSession"
                type="number"
                value={preferences.timePerSession}
                onChange={handleInputChange}
                min="15"
                max="120"
              />
            </FormSection>
            
            <FormSection>
              <SectionTitle>Available Equipment</SectionTitle>
              
              <MultiSelect>
                {['bodyweight', 'dumbbell', 'barbell', 'kettlebell', 'resistance-band', 'cable-machine', 'smith-machine', 'cardio-equipment'].map(equipment => (
                  <Option
                    key={equipment}
                    selected={preferences.equipment.includes(equipment)}
                    onClick={() => handleMultiSelectToggle('equipment', equipment)}
                  >
                    {equipment.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                  </Option>
                ))}
              </MultiSelect>
            </FormSection>
            
            <FormSection>
              <SectionTitle>Target Areas (Optional)</SectionTitle>
              
              <MultiSelect>
                {['chest', 'back', 'shoulders', 'arms', 'core', 'legs', 'glutes'].map(area => (
                  <Option
                    key={area}
                    selected={preferences.targetAreas.includes(area)}
                    onClick={() => handleMultiSelectToggle('targetAreas', area)}
                  >
                    {area.charAt(0).toUpperCase() + area.slice(1)}
                  </Option>
                ))}
              </MultiSelect>
            </FormSection>
            
            <FormSection>
              <Input
                label="Exercises to Exclude"
                name="excludeExercises"
                value={preferences.excludeExercises}
                onChange={handleInputChange}
                placeholder="List any exercises to avoid (comma separated)"
              />
            </FormSection>
            
            <Button 
              variant="primary"
              onClick={generatePlan}
              fullWidth
              isLoading={isLoading}
              disabled={isLoading}
            >
              Generate Workout Plan
            </Button>
          </Card>
        </div>
        
        <div>
          {isLoading ? (
            <Card>
              <LoadingOverlay>
                <div>💪</div>
                <LoadingText>Creating your personalized workout plan...</LoadingText>
              </LoadingOverlay>
            </Card>
          ) : workoutPlan ? (
            <PlanDisplay>
              <Card 
                title={workoutPlan.workoutPlan.name}
                footer={
                  <Button variant="success" onClick={savePlan}>
                    Save Workout Plan
                  </Button>
                }
              >
                <PlanOverview>
                  <PlanStat>
                    <PlanStatIcon>
                      <FaDumbbell />
                    </PlanStatIcon>
                    <span><strong>Goal:</strong> {workoutPlan.workoutPlan.goal}</span>
                  </PlanStat>
                  
                  <PlanStat>
                    <PlanStatIcon>
                      <FaRunning />
                    </PlanStatIcon>
                    <span><strong>Level:</strong> {workoutPlan.workoutPlan.level}</span>
                  </PlanStat>
                  
                  <PlanStat>
                    <PlanStatIcon>
                      <FaClock />
                    </PlanStatIcon>
                    <span><strong>Duration:</strong> {workoutPlan.workoutPlan.duration}</span>
                  </PlanStat>
                </PlanOverview>
                
                <h3>Workout Schedule</h3>
                
                {Object.entries(workoutPlan.workoutPlan.schedule).map(([day, workout]) => (
                  <WorkoutDay key={day} title={`${day.charAt(0).toUpperCase() + day.slice(1)} - ${workout.focus}`}>
                    {workout.exercises.map((exercise, index) => (
                      <ExerciseItem key={index}>
                        <ExerciseName>{exercise.name}</ExerciseName>
                        <ExerciseDetails>
                          <strong>Muscle Group:</strong> {exercise.muscleGroup}
                        </ExerciseDetails>
                        <ExerciseDetails>
                          <strong>Sets:</strong> {exercise.sets} • 
                          <strong> Reps:</strong> {exercise.reps} • 
                          <strong> Rest:</strong> {exercise.rest}s
                        </ExerciseDetails>
                        {exercise.instructions && (
                          <ExerciseDetails>
                            <strong>Instructions:</strong> {exercise.instructions}
                          </ExerciseDetails>
                        )}
                      </ExerciseItem>
                    ))}
                  </WorkoutDay>
                ))}
                
                {workoutPlan.workoutPlan.warmup && (
                  <>
                    <h3>Warm-up</h3>
                    <PlanNote>{workoutPlan.workoutPlan.warmup}</PlanNote>
                  </>
                )}
                
                {workoutPlan.workoutPlan.cooldown && (
                  <>
                    <h3>Cool-down</h3>
                    <PlanNote>{workoutPlan.workoutPlan.cooldown}</PlanNote>
                  </>
                )}
                
                {workoutPlan.workoutPlan.notes && (
                  <>
                    <h3>Additional Notes</h3>
                    <PlanNote>{workoutPlan.workoutPlan.notes}</PlanNote>
                  </>
                )}
                
                <ErrorMessage>
                  <FaExclamationTriangle style={{ marginRight: '0.5rem' }} />
                  <span>Always consult with a healthcare professional before beginning any new exercise program.</span>
                </ErrorMessage>
              </Card>
            </PlanDisplay>
          ) : (
            <Card>
              <p>
                Your personalized workout plan will appear here after generation.
                Please fill out your workout preferences and click "Generate Workout Plan".
              </p>
            </Card>
          )}
        </div>
      </WorkoutPlannerContainer>
    </>
  );
};

export default WorkoutPlannerPage;
