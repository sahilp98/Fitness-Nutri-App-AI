import React, { useState } from 'react';
import styled from 'styled-components';
import { useDispatch } from 'react-redux';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import { useUser } from '../context/UserContext';
import { updatePersonalInfo, updateFitnessGoals, updatePreferences } from '../store/slices/userSlice';

const ProfileContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
  
  @media (min-width: ${props => props.theme.breakpoints.lg}) {
    grid-template-columns: 1fr 1fr;
  }
`;

const FormSection = styled.div`
  margin-bottom: 1.5rem;
`;

const SectionTitle = styled.h3`
  margin-bottom: 1rem;
`;

const FormGroup = styled.div`
  margin-bottom: 1rem;
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

const SuccessMessage = styled.div`
  padding: 1rem;
  background-color: rgba(72, 187, 120, 0.1);
  color: ${props => props.theme.colors.success};
  border-radius: ${props => props.theme.radii.md};
  margin-bottom: 1rem;
  text-align: center;
`;

const ProfilePage = () => {
  const dispatch = useDispatch();
  const { user } = useUser();
  const [successMessage, setSuccessMessage] = useState('');
  
  const [personalInfo, setPersonalInfo] = useState({
    name: user.personalInfo.name || '',
    age: user.personalInfo.age || '',
    gender: user.personalInfo.gender || 'male',
    height: user.personalInfo.height || '',
    weight: user.personalInfo.weight || '',
    activityLevel: user.personalInfo.activityLevel || 'moderately_active',
  });
  
  const [fitnessGoals, setFitnessGoals] = useState({
    primaryGoal: user.fitnessGoals.primaryGoal || 'build_muscle',
    targetWeight: user.fitnessGoals.targetWeight || '',
    workoutFrequency: user.fitnessGoals.workoutFrequency || '4',
  });
  
  const [preferences, setPreferences] = useState({
    availableEquipment: user.preferences.availableEquipment || [],
    dietaryPreferences: user.preferences.dietaryPreferences || [],
    dietaryRestrictions: user.preferences.dietaryRestrictions || [],
    excludedExercises: user.preferences.excludedExercises || [],
  });
  
  const handlePersonalInfoChange = (e) => {
    const { name, value } = e.target;
    setPersonalInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleFitnessGoalsChange = (e) => {
    const { name, value } = e.target;
    setFitnessGoals(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleMultiSelectToggle = (field, section, value) => {
    if (section === 'preferences') {
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
    }
  };
  
  const savePersonalInfo = () => {
    dispatch(updatePersonalInfo(personalInfo));
    setSuccessMessage('Personal information saved successfully!');
    setTimeout(() => setSuccessMessage(''), 3000);
  };
  
  const saveFitnessGoals = () => {
    dispatch(updateFitnessGoals(fitnessGoals));
    setSuccessMessage('Fitness goals saved successfully!');
    setTimeout(() => setSuccessMessage(''), 3000);
  };
  
  const savePreferences = () => {
    dispatch(updatePreferences(preferences));
    setSuccessMessage('Preferences saved successfully!');
    setTimeout(() => setSuccessMessage(''), 3000);
  };
  
  return (
    <>
      <h1>Your Profile</h1>
      <p>Update your personal information to get more accurate recommendations.</p>
      
      {successMessage && <SuccessMessage>{successMessage}</SuccessMessage>}
      
      <ProfileContainer>
        <div>
          <Card title="Personal Information">
            <FormSection>
              <FormGroup>
                <Input
                  label="Name"
                  name="name"
                  value={personalInfo.name}
                  onChange={handlePersonalInfoChange}
                  placeholder="Your name"
                />
              </FormGroup>
              
              <FormGroup>
                <Input
                  label="Age"
                  name="age"
                  type="number"
                  value={personalInfo.age}
                  onChange={handlePersonalInfoChange}
                  placeholder="Your age"
                  min="18"
                  max="100"
                />
              </FormGroup>
              
              <FormGroup>
                <Select
                  label="Gender"
                  name="gender"
                  value={personalInfo.gender}
                  onChange={handlePersonalInfoChange}
                  options={[
                    { value: 'male', label: 'Male' },
                    { value: 'female', label: 'Female' },
                    { value: 'other', label: 'Other' }
                  ]}
                />
              </FormGroup>
            </FormSection>
            
            <FormSection>
              <SectionTitle>Body Metrics</SectionTitle>
              
              <FormGroup>
                <Input
                  label="Height (cm)"
                  name="height"
                  type="number"
                  value={personalInfo.height}
                  onChange={handlePersonalInfoChange}
                  placeholder="Your height in cm"
                  min="100"
                  max="250"
                />
              </FormGroup>
              
              <FormGroup>
                <Input
                  label="Weight (kg)"
                  name="weight"
                  type="number"
                  step="0.1"
                  value={personalInfo.weight}
                  onChange={handlePersonalInfoChange}
                  placeholder="Your weight in kg"
                  min="30"
                  max="300"
                />
              </FormGroup>
              
              <FormGroup>
                <Select
                  label="Activity Level"
                  name="activityLevel"
                  value={personalInfo.activityLevel}
                  onChange={handlePersonalInfoChange}
                  options={[
                    { value: 'sedentary', label: 'Sedentary (little or no exercise)' },
                    { value: 'lightly_active', label: 'Lightly active (light exercise 1-3 days/week)' },
                    { value: 'moderately_active', label: 'Moderately active (moderate exercise 3-5 days/week)' },
                    { value: 'very_active', label: 'Very active (hard exercise 6-7 days/week)' },
                    { value: 'extremely_active', label: 'Extremely active (very hard exercise & physical job)' }
                  ]}
                />
              </FormGroup>
            </FormSection>
            
            <Button 
              variant="primary"
              onClick={savePersonalInfo}
              fullWidth
            >
              Save Personal Info
            </Button>
          </Card>
          
          <Card title="Fitness Goals" margin="2rem 0 0">
            <FormGroup>
              <Select
                label="Primary Goal"
                name="primaryGoal"
                value={fitnessGoals.primaryGoal}
                onChange={handleFitnessGoalsChange}
                options={[
                  { value: 'weight_loss', label: 'Weight Loss' },
                  { value: 'build_muscle', label: 'Build Muscle' },
                  { value: 'maintain', label: 'Maintain Weight & Tone' },
                  { value: 'increase_endurance', label: 'Increase Endurance' },
                  { value: 'improve_strength', label: 'Improve Strength' }
                ]}
              />
            </FormGroup>
            
            <FormGroup>
              <Input
                label="Target Weight (kg)"
                name="targetWeight"
                type="number"
                step="0.1"
                value={fitnessGoals.targetWeight}
                onChange={handleFitnessGoalsChange}
                placeholder="Your target weight in kg"
                min="30"
                max="300"
              />
            </FormGroup>
            
            <FormGroup>
              <Select
                label="Workout Frequency"
                name="workoutFrequency"
                value={fitnessGoals.workoutFrequency}
                onChange={handleFitnessGoalsChange}
                options={[
                  { value: '2', label: '2 days per week' },
                  { value: '3', label: '3 days per week' },
                  { value: '4', label: '4 days per week' },
                  { value: '5', label: '5 days per week' },
                  { value: '6', label: '6 days per week' },
                  { value: '7', label: '7 days per week' }
                ]}
              />
            </FormGroup>
            
            <Button 
              variant="primary"
              onClick={saveFitnessGoals}
              fullWidth
            >
              Save Fitness Goals
            </Button>
          </Card>
        </div>
        
        <div>
          <Card title="Preferences">
            <FormSection>
              <SectionTitle>Available Equipment</SectionTitle>
              
              <MultiSelect>
                {['bodyweight', 'dumbbell', 'barbell', 'kettlebell', 'resistance-band', 'cable-machine', 'smith-machine', 'cardio-equipment'].map(equipment => (
                  <Option
                    key={equipment}
                    selected={preferences.availableEquipment.includes(equipment)}
                    onClick={() => handleMultiSelectToggle('availableEquipment', 'preferences', equipment)}
                  >
                    {equipment.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                  </Option>
                ))}
              </MultiSelect>
            </FormSection>
            
            <FormSection>
              <SectionTitle>Dietary Preferences</SectionTitle>
              
              <MultiSelect>
                {['balanced', 'high-protein', 'low-carb', 'vegetarian', 'vegan', 'pescatarian', 'paleo', 'keto', 'mediterranean'].map(pref => (
                  <Option
                    key={pref}
                    selected={preferences.dietaryPreferences.includes(pref)}
                    onClick={() => handleMultiSelectToggle('dietaryPreferences', 'preferences', pref)}
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
                    onClick={() => handleMultiSelectToggle('dietaryRestrictions', 'preferences', restriction)}
                  >
                    {restriction.charAt(0).toUpperCase() + restriction.slice(1)}
                  </Option>
                ))}
              </MultiSelect>
            </FormSection>
            
            <Button 
              variant="primary"
              onClick={savePreferences}
              fullWidth
            >
              Save Preferences
            </Button>
          </Card>
        </div>
      </ProfileContainer>
    </>
  );
};

export default ProfilePage;
