import React, { useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import { useUser } from '../context/UserContext';
import { neuBox } from '../styles/neumorphism';

const ProfileSetupContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
`;

const Title = styled.h1`
  font-size: ${props => props.theme.fontSizes['3xl']};
  margin-bottom: 2rem;
  text-align: center;
`;

const StepIndicator = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 2rem;
`;

const StepDot = styled.div`
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background-color: ${props => props.active ? props.theme.colors.primary : props.completed ? props.theme.colors.success : props.theme.colors.background};
  position: relative;
  ${neuBox}
  
  &::after {
    content: '';
    position: absolute;
    height: 2px;
    background-color: ${props => props.completed ? props.theme.colors.success : props.theme.colors.background};
    width: 100%;
    left: 100%;
    top: 50%;
    transform: translateY(-50%);
    ${neuBox}
  }
  
  &:last-child::after {
    display: none;
  }
`;

const StepContent = styled.div`
  margin-bottom: 2rem;
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 2rem;
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

const ProfileSetupPage = () => {
  const navigate = useNavigate();
  const { 
    user, 
    updatePersonalInfo, 
    updateFitnessGoals, 
    updatePreferences,
    setProfileComplete 
  } = useUser();
  
  const [currentStep, setCurrentStep] = useState(1);
  const [form, setForm] = useState({
    // Personal Info
    name: user.personalInfo.name || '',
    email: user.personalInfo.email || '',
    age: user.personalInfo.age || '',
    gender: user.personalInfo.gender || '',
    height: user.personalInfo.height || '',
    weight: user.personalInfo.weight || '',
    activityLevel: user.personalInfo.activityLevel || '',
    
    // Fitness Goals
    primaryGoal: user.fitnessGoals.primaryGoal || '',
    targetWeight: user.fitnessGoals.targetWeight || '',
    workoutFrequency: user.fitnessGoals.workoutFrequency || '',
    
    // Preferences
    availableEquipment: user.preferences.availableEquipment || [],
    dietaryPreferences: user.preferences.dietaryPreferences || [],
    dietaryRestrictions: user.preferences.dietaryRestrictions || []
  });
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: value
    });
  };
  
  const handleMultiSelectToggle = (field, value) => {
    setForm(prevForm => {
      const currentValues = prevForm[field] || [];
      const newValues = currentValues.includes(value)
        ? currentValues.filter(v => v !== value)
        : [...currentValues, value];
      
      return {
        ...prevForm,
        [field]: newValues
      };
    });
  };
  
  const nextStep = () => {
    if (currentStep === 1) {
      updatePersonalInfo({
        name: form.name,
        email: form.email,
        age: parseInt(form.age, 10),
        gender: form.gender,
        height: parseInt(form.height, 10),
        weight: parseInt(form.weight, 10),
        activityLevel: form.activityLevel
      });
    } else if (currentStep === 2) {
      updateFitnessGoals({
        primaryGoal: form.primaryGoal,
        targetWeight: form.targetWeight ? parseInt(form.targetWeight, 10) : null,
        workoutFrequency: form.workoutFrequency ? parseInt(form.workoutFrequency, 10) : null
      });
    }
    
    setCurrentStep(currentStep + 1);
  };
  
  const prevStep = () => {
    setCurrentStep(currentStep - 1);
  };
  
  const finalSubmit = () => {
    updatePreferences({
      availableEquipment: form.availableEquipment,
      dietaryPreferences: form.dietaryPreferences,
      dietaryRestrictions: form.dietaryRestrictions
    });
    
    setProfileComplete(true);
    navigate('/dashboard');
  };
  
  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <StepContent>
            <h2>Personal Information</h2>
            <p>Let's start with some basic information about you.</p>
            
            <Input
              label="Name"
              name="name"
              value={form.name}
              onChange={handleInputChange}
              placeholder="Your name"
              required
            />
            
            <Input
              label="Email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleInputChange}
              placeholder="Your email"
              required
            />
            
            <Input
              label="Age"
              name="age"
              type="number"
              min="18"
              max="100"
              value={form.age}
              onChange={handleInputChange}
              placeholder="Your age"
              required
            />
            
            <Select
              label="Gender"
              name="gender"
              value={form.gender}
              onChange={handleInputChange}
              options={[
                { value: '', label: 'Select gender', disabled: true },
                { value: 'male', label: 'Male' },
                { value: 'female', label: 'Female' },
                { value: 'other', label: 'Other' },
                { value: 'prefer-not-to-say', label: 'Prefer not to say' }
              ]}
              required
            />
            
            <Input
              label="Height (cm)"
              name="height"
              type="number"
              min="100"
              max="250"
              value={form.height}
              onChange={handleInputChange}
              placeholder="Your height in centimeters"
              required
            />
            
            <Input
              label="Weight (kg)"
              name="weight"
              type="number"
              min="30"
              max="300"
              value={form.weight}
              onChange={handleInputChange}
              placeholder="Your weight in kilograms"
              required
            />
            
            <Select
              label="Activity Level"
              name="activityLevel"
              value={form.activityLevel}
              onChange={handleInputChange}
              options={[
                { value: '', label: 'Select activity level', disabled: true },
                { value: 'sedentary', label: 'Sedentary (little or no exercise)' },
                { value: 'lightly', label: 'Lightly active (light exercise 1-3 days/week)' },
                { value: 'moderately', label: 'Moderately active (moderate exercise 3-5 days/week)' },
                { value: 'very', label: 'Very active (hard exercise 6-7 days/week)' },
                { value: 'extremely', label: 'Extremely active (very hard exercise & physical job)' }
              ]}
              required
            />
          </StepContent>
        );
        
      case 2:
        return (
          <StepContent>
            <h2>Fitness Goals</h2>
            <p>Tell us about your fitness goals so we can create the best plan for you.</p>
            
            <Select
              label="Primary Goal"
              name="primaryGoal"
              value={form.primaryGoal}
              onChange={handleInputChange}
              options={[
                { value: '', label: 'Select your primary goal', disabled: true },
                { value: 'weight loss', label: 'Weight Loss' },
                { value: 'muscle gain', label: 'Muscle Gain' },
                { value: 'maintenance', label: 'Maintenance' },
                { value: 'endurance', label: 'Endurance' },
                { value: 'strength', label: 'Strength' },
                { value: 'flexibility', label: 'Flexibility' }
              ]}
              required
            />
            
            {form.primaryGoal === 'weight loss' && (
              <Input
                label="Target Weight (kg)"
                name="targetWeight"
                type="number"
                min="30"
                max="300"
                value={form.targetWeight}
                onChange={handleInputChange}
                placeholder="Your target weight in kilograms"
              />
            )}
            
            <Select
              label="Workout Days per Week"
              name="workoutFrequency"
              value={form.workoutFrequency}
              onChange={handleInputChange}
              options={[
                { value: '', label: 'Select days per week', disabled: true },
                { value: '2', label: '2 days' },
                { value: '3', label: '3 days' },
                { value: '4', label: '4 days' },
                { value: '5', label: '5 days' },
                { value: '6', label: '6 days' },
                { value: '7', label: '7 days' }
              ]}
              required
            />
          </StepContent>
        );
        
      case 3:
        return (
          <StepContent>
            <h2>Preferences</h2>
            <p>Let us know your preferences to better customize your plans.</p>
            
            <h3>Available Equipment</h3>
            <MultiSelect>
              {['bodyweight', 'dumbbells', 'barbell', 'kettlebell', 'resistance bands', 'machine', 'full gym'].map(equipment => (
                <Option
                  key={equipment}
                  selected={form.availableEquipment.includes(equipment)}
                  onClick={() => handleMultiSelectToggle('availableEquipment', equipment)}
                >
                  {equipment.charAt(0).toUpperCase() + equipment.slice(1)}
                </Option>
              ))}
            </MultiSelect>
            
            <h3>Dietary Preferences</h3>
            <MultiSelect>
              {['balanced', 'high-protein', 'low-carb', 'vegetarian', 'vegan', 'pescatarian', 'paleo', 'keto'].map(pref => (
                <Option
                  key={pref}
                  selected={form.dietaryPreferences.includes(pref)}
                  onClick={() => handleMultiSelectToggle('dietaryPreferences', pref)}
                >
                  {pref.charAt(0).toUpperCase() + pref.slice(1)}
                </Option>
              ))}
            </MultiSelect>
            
            <h3>Dietary Restrictions</h3>
            <MultiSelect>
              {['gluten-free', 'dairy-free', 'nut-free', 'shellfish-free', 'soy-free', 'egg-free'].map(restriction => (
                <Option
                  key={restriction}
                  selected={form.dietaryRestrictions.includes(restriction)}
                  onClick={() => handleMultiSelectToggle('dietaryRestrictions', restriction)}
                >
                  {restriction.charAt(0).toUpperCase() + restriction.slice(1)}
                </Option>
              ))}
            </MultiSelect>
          </StepContent>
        );
        
      default:
        return null;
    }
  };
  
  return (
    <ProfileSetupContainer>
      <Title>Set Up Your Profile</Title>
      
      <StepIndicator>
        <StepDot active={currentStep === 1} completed={currentStep > 1} />
        <StepDot active={currentStep === 2} completed={currentStep > 2} />
        <StepDot active={currentStep === 3} completed={currentStep > 3} />
      </StepIndicator>
      
      <Card>
        {renderStep()}
        
        <ButtonGroup>
          {currentStep > 1 && (
            <Button variant="secondary" onClick={prevStep}>
              Back
            </Button>
          )}
          
          {currentStep < 3 ? (
            <Button variant="primary" onClick={nextStep}>
              Next
            </Button>
          ) : (
            <Button variant="success" onClick={finalSubmit}>
              Complete Setup
            </Button>
          )}
        </ButtonGroup>
      </Card>
    </ProfileSetupContainer>
  );
};

export default ProfileSetupPage;
