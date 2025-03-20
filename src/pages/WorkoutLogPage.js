import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { format } from 'date-fns';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import { FaDumbbell, FaCheck, FaPlus, FaMinus } from 'react-icons/fa';
import { logCompletedWorkout } from '../store/slices/workoutSlice';
import { v4 as uuidv4 } from 'uuid';

const PageContainer = styled.div`
  max-width: 900px;
  margin: 0 auto;
`;

const WorkoutHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  
  @media (max-width: ${props => props.theme.breakpoints.md}) {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
`;

const WorkoutTypeSelector = styled(Card)`
  margin-bottom: 2rem;
`;

const WorkoutOptions = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
`;

const WorkoutOption = styled.div`
  padding: 1rem;
  border-radius: ${props => props.theme.radii.md};
  background: ${props => props.theme.colors.background};
  box-shadow: ${({ selected, theme }) => 
    selected ? theme.shadows.neuPressed : theme.shadows.neuFlat};
  cursor: pointer;
  transition: all 0.2s ease;
  border: ${({ selected, theme }) => 
    selected ? `2px solid ${theme.colors.primary}` : 'none'};
  
  &:hover {
    transform: translateY(-2px);
  }
`;

const ExerciseList = styled.div`
  margin-top: 1.5rem;
`;

const ExerciseItem = styled.div`
  padding: 1.5rem;
  border-radius: ${props => props.theme.radii.md};
  background: ${props => props.theme.colors.background};
  box-shadow: ${props => props.theme.shadows.neuFlat};
  margin-bottom: 1rem;
`;

const ExerciseHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

const ExerciseName = styled.h3`
  margin: 0;
  font-size: ${props => props.theme.fontSizes.lg};
`;

const SetsList = styled.div`
  margin-top: 1rem;
`;

const SetRow = styled.div`
  display: grid;
  grid-template-columns: auto 1fr 1fr 1fr auto;
  gap: 1rem;
  margin-bottom: 0.5rem;
  align-items: center;
  
  @media (max-width: ${props => props.theme.breakpoints.sm}) {
    grid-template-columns: auto 1fr 1fr;
    row-gap: 0.75rem;
  }
`;

const SetLabel = styled.div`
  font-weight: 600;
  color: ${props => props.theme.colors.primary};
`;

const SetInput = styled(Input)`
  width: 100%;
`;

const AddSetButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem;
  border: none;
  border-radius: ${props => props.theme.radii.md};
  background: ${props => props.theme.colors.background};
  box-shadow: ${props => props.theme.shadows.neuFlat};
  color: ${props => props.theme.colors.primary};
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: ${props => props.theme.shadows.neuFloating};
  }
`;

const RemoveSetButton = styled(AddSetButton)`
  color: ${props => props.theme.colors.error};
`;

const NotesSection = styled.div`
  margin-top: 2rem;
`;

const FeelingSelector = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
  flex-wrap: wrap;
`;

const FeelingOption = styled.div`
  padding: 0.5rem 1rem;
  border-radius: ${props => props.theme.radii.md};
  background: ${props => props.theme.colors.background};
  box-shadow: ${({ selected, theme }) => 
    selected ? theme.shadows.neuPressed : theme.shadows.neuFlat};
  cursor: pointer;
  transition: all 0.2s ease;
  border: ${({ selected, theme }) => 
    selected ? `2px solid ${theme.colors.primary}` : 'none'};
  
  &:hover {
    transform: translateY(-2px);
  }
`;

const WorkoutComplete = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem;
  text-align: center;
`;

const CompleteIcon = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: ${props => props.theme.colors.success};
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2.5rem;
  margin-bottom: 1.5rem;
`;

const WorkoutLogPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const workoutPlans = useSelector(state => state.workout?.workoutPlans || []);
  const currentPlan = useSelector(state => state.workout?.currentPlan);
  
  const [selectedWorkoutType, setSelectedWorkoutType] = useState('plan');
  const [selectedPlan, setSelectedPlan] = useState(currentPlan?.id || '');
  const [selectedDay, setSelectedDay] = useState('');
  const [currentExercises, setCurrentExercises] = useState([]);
  const [workoutDate, setWorkoutDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [workoutDuration, setWorkoutDuration] = useState('');
  const [notes, setNotes] = useState('');
  const [feeling, setFeeling] = useState('good');
  const [isCompleted, setIsCompleted] = useState(false);
  
  // Load workout days when a plan is selected
  useEffect(() => {
    if (selectedPlan) {
      const plan = workoutPlans.find(p => p.id === selectedPlan);
      if (plan && plan.workoutPlan && plan.workoutPlan.schedule) {
        // If we have a day already selected, keep it if valid
        const days = Object.keys(plan.workoutPlan.schedule);
        if (!days.includes(selectedDay) && days.length > 0) {
          setSelectedDay(days[0]);
        }
      }
    }
  }, [selectedPlan, workoutPlans, selectedDay]);
  
  // Load exercises when a day is selected
  useEffect(() => {
    if (selectedPlan && selectedDay) {
      const plan = workoutPlans.find(p => p.id === selectedPlan);
      if (plan && plan.workoutPlan && plan.workoutPlan.schedule && plan.workoutPlan.schedule[selectedDay]) {
        const daySchedule = plan.workoutPlan.schedule[selectedDay];
        // Initialize exercises with tracking data
        const exercisesWithSets = daySchedule.exercises.map(exercise => ({
          ...exercise,
          id: uuidv4(),
          sets: [{ id: uuidv4(), weight: '', reps: '', completed: false }]
        }));
        setCurrentExercises(exercisesWithSets);
      }
    }
  }, [selectedPlan, selectedDay, workoutPlans]);
  
  const handleAddSet = (exerciseIndex) => {
    const updatedExercises = [...currentExercises];
    updatedExercises[exerciseIndex].sets.push({
      id: uuidv4(),
      weight: '',
      reps: '',
      completed: false
    });
    setCurrentExercises(updatedExercises);
  };
  
  const handleRemoveSet = (exerciseIndex, setIndex) => {
    const updatedExercises = [...currentExercises];
    updatedExercises[exerciseIndex].sets.splice(setIndex, 1);
    setCurrentExercises(updatedExercises);
  };
  
  const handleSetChange = (exerciseIndex, setIndex, field, value) => {
    const updatedExercises = [...currentExercises];
    updatedExercises[exerciseIndex].sets[setIndex][field] = value;
    setCurrentExercises(updatedExercises);
  };
  
  const toggleSetCompleted = (exerciseIndex, setIndex) => {
    const updatedExercises = [...currentExercises];
    updatedExercises[exerciseIndex].sets[setIndex].completed = 
      !updatedExercises[exerciseIndex].sets[setIndex].completed;
    setCurrentExercises(updatedExercises);
  };
  
  const handleCompleteWorkout = () => {
    const workoutLog = {
      date: workoutDate,
      duration: parseInt(workoutDuration) || 0,
      planId: selectedWorkoutType === 'plan' ? selectedPlan : null,
      day: selectedDay,
      exercises: currentExercises.map(ex => ({
        name: ex.name,
        sets: ex.sets.map(set => ({
          weight: set.weight ? parseFloat(set.weight) : 0,
          reps: set.reps ? parseInt(set.reps) : 0,
          completed: set.completed
        }))
      })),
      notes: notes,
      feeling: feeling
    };
    
    dispatch(logCompletedWorkout(workoutLog));
    setIsCompleted(true);
  };
  
  // Get available days for selected plan
  const getAvailableDays = () => {
    if (selectedPlan) {
      const plan = workoutPlans.find(p => p.id === selectedPlan);
      if (plan && plan.workoutPlan && plan.workoutPlan.schedule) {
        return Object.keys(plan.workoutPlan.schedule).map(day => ({
          value: day,
          label: day.charAt(0).toUpperCase() + day.slice(1)
        }));
      }
    }
    return [];
  };
  
  if (isCompleted) {
    return (
      <PageContainer>
        <Card>
          <WorkoutComplete>
            <CompleteIcon>
              <FaCheck />
            </CompleteIcon>
            <h2>Workout Completed!</h2>
            <p>Great job! Your workout has been logged successfully.</p>
            <Button 
              variant="primary"
              onClick={() => navigate('/dashboard')}
              margin="1rem 0 0"
            >
              Return to Dashboard
            </Button>
          </WorkoutComplete>
        </Card>
      </PageContainer>
    );
  }
  
  return (
    <PageContainer>
      <WorkoutHeader>
        <div>
          <h1>Log Your Workout</h1>
          <p>Track your progress by logging your workout details below.</p>
        </div>
        
        <div>
          <Input
            type="date"
            value={workoutDate}
            onChange={(e) => setWorkoutDate(e.target.value)}
            label="Workout Date"
          />
        </div>
      </WorkoutHeader>
      
      <WorkoutTypeSelector>
        <h3>Select Workout Type</h3>
        <WorkoutOptions>
          <WorkoutOption 
            selected={selectedWorkoutType === 'plan'}
            onClick={() => setSelectedWorkoutType('plan')}
          >
            <h4>From My Plan</h4>
            <p>Use one of your saved workout plans</p>
          </WorkoutOption>
          
          <WorkoutOption
            selected={selectedWorkoutType === 'quick'}
            onClick={() => setSelectedWorkoutType('quick')}
          >
            <h4>Quick Log</h4>
            <p>Log exercises without a plan</p>
          </WorkoutOption>
        </WorkoutOptions>
        
        {selectedWorkoutType === 'plan' && workoutPlans.length > 0 && (
          <>
            <Select
              label="Select Workout Plan"
              value={selectedPlan}
              onChange={(e) => setSelectedPlan(e.target.value)}
              options={workoutPlans.map(plan => ({
                value: plan.id,
                label: plan.workoutPlan.name
              }))}
              margin="1.5rem 0 1rem"
            />
            
            {selectedPlan && (
              <Select
                label="Select Workout Day"
                value={selectedDay}
                onChange={(e) => setSelectedDay(e.target.value)}
                options={getAvailableDays()}
              />
            )}
          </>
        )}
        
        {selectedWorkoutType === 'plan' && workoutPlans.length === 0 && (
          <p>You don't have any workout plans yet. Create a plan first or use Quick Log.</p>
        )}
        
        {selectedWorkoutType === 'quick' && (
          <p>Quick logging feature coming soon. Please select "From My Plan" for now.</p>
        )}
      </WorkoutTypeSelector>
      
      {currentExercises.length > 0 && (
        <Card title="Exercises">
          <Input
            label="Workout Duration (minutes)"
            type="number"
            value={workoutDuration}
            onChange={(e) => setWorkoutDuration(e.target.value)}
            placeholder="How long was your workout?"
            min="1"
            max="300"
          />
          
          <ExerciseList>
            {currentExercises.map((exercise, exerciseIndex) => (
              <ExerciseItem key={exercise.id}>
                <ExerciseHeader>
                  <ExerciseName>{exercise.name}</ExerciseName>
                  <div>{exercise.muscleGroup}</div>
                </ExerciseHeader>
                
                <p>Target: {exercise.reps}, Rest: {exercise.rest}s</p>
                
                <SetsList>
                  <SetRow>
                    <div>#</div>
                    <div>Weight (kg)</div>
                    <div>Reps</div>
                    <div>Completed</div>
                    <div></div>
                  </SetRow>
                  
                  {exercise.sets.map((set, setIndex) => (
                    <SetRow key={set.id}>
                      <SetLabel>{setIndex + 1}</SetLabel>
                      <SetInput
                        type="number"
                        value={set.weight}
                        onChange={(e) => handleSetChange(exerciseIndex, setIndex, 'weight', e.target.value)}
                        placeholder="kg"
                        min="0"
                        max="999"
                      />
                      <SetInput
                        type="number"
                        value={set.reps}
                        onChange={(e) => handleSetChange(exerciseIndex, setIndex, 'reps', e.target.value)}
                        placeholder="reps"
                        min="0"
                        max="999"
                      />
                      <div>
                        <Button 
                          variant={set.completed ? "success" : "secondary"}
                          size="small"
                          onClick={() => toggleSetCompleted(exerciseIndex, setIndex)}
                        >
                          {set.completed ? "Done" : "Mark Done"}
                        </Button>
                      </div>
                      <div>
                        {exercise.sets.length > 1 && (
                          <RemoveSetButton onClick={() => handleRemoveSet(exerciseIndex, setIndex)}>
                            <FaMinus />
                          </RemoveSetButton>
                        )}
                      </div>
                    </SetRow>
                  ))}
                </SetsList>
                
                <div style={{ marginTop: "1rem", textAlign: "center" }}>
                  <AddSetButton onClick={() => handleAddSet(exerciseIndex)}>
                    <FaPlus /> Add Set
                  </AddSetButton>
                </div>
              </ExerciseItem>
            ))}
          </ExerciseList>
          
          <NotesSection>
            <h3>How was your workout?</h3>
            <FeelingSelector>
              {["great", "good", "okay", "tough", "exhausted"].map((option) => (
                <FeelingOption 
                  key={option}
                  selected={feeling === option}
                  onClick={() => setFeeling(option)}
                >
                  {option.charAt(0).toUpperCase() + option.slice(1)}
                </FeelingOption>
              ))}
            </FeelingSelector>
            
            <Input
              label="Notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add notes about your workout..."
              multiline
              rows={3}
              margin="1.5rem 0 0"
            />
          </NotesSection>
          
          <Button 
            variant="primary"
            onClick={handleCompleteWorkout}
            fullWidth
            margin="2rem 0 0"
          >
            Complete Workout
          </Button>
        </Card>
      )}
    </PageContainer>
  );
};

export default WorkoutLogPage;
