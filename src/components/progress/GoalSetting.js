import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import Card from '../ui/Card';
import Input from '../ui/Input';
import Button from '../ui/Button';
import { setGoals } from '../../store/slices/progressSlice';

const FormSection = styled.div`
  margin-bottom: 1rem;
`;

const ProgressBar = styled.div`
  height: 12px;
  background: ${props => props.theme.colors.background};
  border-radius: ${props => props.theme.radii.full};
  margin: 1rem 0;
  overflow: hidden;
  box-shadow: ${props => props.theme.shadows.neuInset};
  position: relative;
`;

const Progress = styled.div`
  height: 100%;
  background: ${props => props.theme.colors.primary};
  border-radius: ${props => props.theme.radii.full};
  transition: width 0.3s ease;
  width: ${props => props.percent}%;
`;

const ProgressLabel = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: ${props => props.theme.fontSizes.sm};
  color: rgba(45, 55, 72, 0.7);
  margin-top: 0.5rem;
`;

const GoalSetting = () => {
  const dispatch = useDispatch();
  const { measurements, goals } = useSelector(state => state.progress);
  const [localGoals, setLocalGoals] = useState({
    weightGoal: goals?.weightGoal || '',
    targetDate: goals?.targetDate || '',
    bodyFatGoal: goals?.bodyFatGoal || ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLocalGoals(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const saveGoals = () => {
    dispatch(setGoals(localGoals));
  };

  // Calculate progress towards weight goal
  const calculateWeightProgress = () => {
    if (!localGoals.weightGoal || measurements?.length === 0) return 0;
    
    // Get latest weight measurement
    const latestMeasurement = [...measurements]
      .filter(m => m.weight !== null)
      .sort((a, b) => new Date(b.date) - new Date(a.date))[0];
    
    if (!latestMeasurement) return 0;
    
    // Get first weight measurement
    const firstMeasurement = [...measurements]
      .filter(m => m.weight !== null)
      .sort((a, b) => new Date(a.date) - new Date(b.date))[0];
    
    if (!firstMeasurement) return 0;

    const startWeight = firstMeasurement.weight;
    const currentWeight = latestMeasurement.weight;
    const goalWeight = parseFloat(localGoals.weightGoal);
    
    // Calculate progress percentage
    const totalChange = Math.abs(startWeight - goalWeight);
    const currentChange = Math.abs(startWeight - currentWeight);
    
    if (totalChange === 0) return 100; // Goal already achieved
    
    const percentComplete = (currentChange / totalChange) * 100;
    return Math.min(100, Math.max(0, percentComplete));
  };

  // Days remaining until target date
  const daysRemaining = localGoals.targetDate 
    ? Math.max(0, Math.ceil((new Date(localGoals.targetDate) - new Date()) / (1000 * 60 * 60 * 24)))
    : null;

  return (
    <Card title="Fitness Goals">
      <FormSection>
        <Input
          label="Weight Goal (kg)"
          name="weightGoal"
          type="number"
          step="0.1"
          value={localGoals.weightGoal}
          onChange={handleChange}
          placeholder="Target weight in kg"
        />
      </FormSection>
      
      <FormSection>
        <Input
          label="Body Fat Goal (%)"
          name="bodyFatGoal"
          type="number"
          step="0.1"
          value={localGoals.bodyFatGoal}
          onChange={handleChange}
          placeholder="Target body fat percentage"
        />
      </FormSection>
      
      <FormSection>
        <Input
          label="Target Date"
          name="targetDate"
          type="date"
          value={localGoals.targetDate}
          onChange={handleChange}
          min={new Date().toISOString().split('T')[0]}
        />
      </FormSection>
      
      {localGoals.weightGoal && measurements?.length > 0 && (
        <>
          <h4>Weight Goal Progress</h4>
          <ProgressBar>
            <Progress percent={calculateWeightProgress()} />
          </ProgressBar>
          <ProgressLabel>
            <span>0%</span>
            <span>{Math.round(calculateWeightProgress())}% Complete</span>
            <span>100%</span>
          </ProgressLabel>
        </>
      )}
      
      {daysRemaining !== null && (
        <p>
          <strong>{daysRemaining}</strong> days remaining to reach your goal.
        </p>
      )}
      
      <Button 
        variant="primary" 
        onClick={saveGoals} 
        fullWidth
      >
        Save Goals
      </Button>
    </Card>
  );
};

export default GoalSetting;
