import React from 'react';
import styled from 'styled-components';
import Card from '../ui/Card';
import { FaDumbbell, FaRunning, FaRegClock, FaBullseye } from 'react-icons/fa';

const ExerciseContainer = styled.div`
  margin-bottom: 2rem;
`;

const ExerciseHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
`;

const ExerciseName = styled.h3`
  margin: 0;
`;

const ExerciseCategory = styled.span`
  margin-left: 1rem;
  padding: 0.25rem 0.75rem;
  border-radius: ${props => props.theme.radii.full};
  background: ${props => props.theme.colors.primary + '20'};
  color: ${props => props.theme.colors.primary};
  font-size: ${props => props.theme.fontSizes.sm};
`;

const ExerciseDetailsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 1.5rem;
`;

const DetailItem = styled.div`
  display: flex;
  align-items: center;
`;

const DetailIcon = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: ${props => props.theme.colors.background};
  box-shadow: ${props => props.theme.shadows.neuFlat};
  margin-right: 0.75rem;
  color: ${props => props.theme.colors.primary};
`;

const DetailLabel = styled.span`
  font-weight: 500;
`;

const DetailValue = styled.span`
  margin-left: 0.5rem;
`;

const InstructionsContainer = styled.div`
  padding: 1rem;
  border-radius: ${props => props.theme.radii.md};
  background: ${props => props.theme.colors.background};
  box-shadow: ${props => props.theme.shadows.neuInset};
`;

const ExerciseDetail = ({ exercise }) => {
  if (!exercise) return null;
  
  return (
    <ExerciseContainer>
      <Card>
        <ExerciseHeader>
          <ExerciseName>{exercise.name}</ExerciseName>
          <ExerciseCategory>{exercise.muscleGroup}</ExerciseCategory>
        </ExerciseHeader>
        
        <ExerciseDetailsGrid>
          <DetailItem>
            <DetailIcon>
              <FaDumbbell size={14} />
            </DetailIcon>
            <DetailLabel>Sets:</DetailLabel>
            <DetailValue>{exercise.sets}</DetailValue>
          </DetailItem>
          
          <DetailItem>
            <DetailIcon>
              <FaRunning size={14} />
            </DetailIcon>
            <DetailLabel>Reps:</DetailLabel>
            <DetailValue>{exercise.reps}</DetailValue>
          </DetailItem>
          
          <DetailItem>
            <DetailIcon>
              <FaRegClock size={14} />
            </DetailIcon>
            <DetailLabel>Rest:</DetailLabel>
            <DetailValue>{exercise.rest}s</DetailValue>
          </DetailItem>
          
          <DetailItem>
            <DetailIcon>
              <FaBullseye size={14} />
            </DetailIcon>
            <DetailLabel>Target:</DetailLabel>
            <DetailValue>{exercise.muscleGroup}</DetailValue>
          </DetailItem>
        </ExerciseDetailsGrid>
        
        {exercise.instructions && (
          <>
            <h4>Instructions</h4>
            <InstructionsContainer>
              {exercise.instructions}
            </InstructionsContainer>
          </>
        )}
      </Card>
    </ExerciseContainer>
  );
};

export default ExerciseDetail;
