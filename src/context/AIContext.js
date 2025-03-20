import React, { createContext, useState, useContext, useEffect } from 'react';
import { useSelector } from 'react-redux';
import OpenAIService from '../services/ai/OpenAIService';
import GeminiService from '../services/ai/GeminiService';

const AIContext = createContext();

export const useAI = () => useContext(AIContext);

export const AIProvider = ({ children }) => {
  const userSettings = useSelector(state => state.user?.settings?.appSettings);
  
  const [provider, setProvider] = useState(
    process.env.REACT_APP_DEFAULT_AI_PROVIDER || 'gemini'
  );
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Initialize AI service instances
  const openai = new OpenAIService();
  const gemini = new GeminiService();

  // Update provider based on user settings when they change
  useEffect(() => {
    if (userSettings && userSettings.aiProvider) {
      setProvider(userSettings.aiProvider);
    }
  }, [userSettings]);

  const changeProvider = (newProvider) => {
    if (['openai', 'gemini'].includes(newProvider)) {
      setProvider(newProvider);
    } else {
      setError('Invalid AI provider specified');
    }
  };

  const getCurrentService = () => {
    return provider === 'gemini' ? gemini : openai;
  };

  const generateWorkoutPlan = async (userDetails, preferences) => {
    setIsLoading(true);
    setError(null);
    try {
      const service = getCurrentService();
      const plan = await service.generateWorkoutPlan(userDetails, preferences);
      setIsLoading(false);
      return plan;
    } catch (err) {
      setError(err.message || 'Error generating workout plan');
      setIsLoading(false);
      throw err;
    }
  };

  const generateNutritionPlan = async (userDetails, preferences) => {
    setIsLoading(true);
    setError(null);
    try {
      const service = getCurrentService();
      const plan = await service.generateMealPlan(userDetails, preferences);
      setIsLoading(false);
      return plan;
    } catch (err) {
      setError(err.message || 'Error generating nutrition plan');
      setIsLoading(false);
      throw err;
    }
  };

  const generateRecipe = async (ingredients, preferences) => {
    setIsLoading(true);
    setError(null);
    try {
      const service = getCurrentService();
      const recipe = await service.generateRecipe(ingredients, preferences);
      setIsLoading(false);
      return recipe;
    } catch (err) {
      setError(err.message || 'Error generating recipe');
      setIsLoading(false);
      throw err;
    }
  };

  const value = {
    currentProvider: provider,
    changeProvider,
    isLoading,
    error,
    generateWorkoutPlan,
    generateNutritionPlan,
    generateRecipe
  };

  return <AIContext.Provider value={value}>{children}</AIContext.Provider>;
};
