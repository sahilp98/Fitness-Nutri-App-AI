import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { FaDumbbell, FaRunning, FaClock, FaTrashAlt } from 'react-icons/fa';
import { deleteWorkoutPlan } from '../store/slices/workoutSlice';

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

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
`;

const WorkoutPlanViewPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const currentPlan = useSelector(state => state.workout.currentPlan);
  
  if (!currentPlan) {
    navigate('/dashboard');
    return null;
  }
  
  const { workoutPlan } = currentPlan;
  
  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this workout plan?')) {
      dispatch(deleteWorkoutPlan(currentPlan.id));
      navigate('/dashboard');
    }
  };
  
  return (
    <PlanContainer>
      <PlanHeader>
        <div>
          <h1>{workoutPlan.name}</h1>
          <p>Your personalized workout routine</p>
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
            onClick={() => navigate('/workout-planner')}
          >
            Create New Plan
          </Button>
        </ButtonGroup>
      </PlanHeader>
      
      <PlanOverview>
        <PlanStat>
          <PlanStatIcon>
            <FaDumbbell />
          </PlanStatIcon>
          <span><strong>Goal:</strong> {workoutPlan.goal}</span>
        </PlanStat>
        
        <PlanStat>
          <PlanStatIcon>
            <FaRunning />
          </PlanStatIcon>
          <span><strong>Level:</strong> {workoutPlan.level}</span>
        </PlanStat>
        
        <PlanStat>
          <PlanStatIcon>
            <FaClock />
          </PlanStatIcon>
          <span><strong>Duration:</strong> {workoutPlan.duration}</span>
        </PlanStat>
      </PlanOverview>
      
      <h2>Weekly Schedule</h2>
      
      {workoutPlan.warmup && (
        <>
          <h3>Warm-up</h3>
          <PlanNote>{workoutPlan.warmup}</PlanNote>
        </>
      )}
      
      {Object.entries(workoutPlan.schedule).map(([day, workout]) => (
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
      
      {workoutPlan.cooldown && (
        <>
          <h3>Cool-down</h3>
          <PlanNote>{workoutPlan.cooldown}</PlanNote>
        </>
      )}
      
      {workoutPlan.notes && (
        <>
          <h3>Additional Notes</h3>
          <PlanNote>{workoutPlan.notes}</PlanNote>
        </>
      )}
      
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

export default WorkoutPlanViewPage;
