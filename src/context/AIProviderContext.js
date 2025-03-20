import React, { createContext, useState, useContext } from 'react';
import aiFactory from '../services/ai/aiFactory';

const AIContext = createContext();

export const useAI = () => useContext(AIContext);

export const AIProvider = ({ children }) => {
  const [provider, setProvider] = useState(
    process.env.REACT_APP_DEFAULT_AI_PROVIDER || 'gemini'
  );
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const changeProvider = (newProvider) => {
    if (['openai', 'gemini'].includes(newProvider)) {
      setProvider(newProvider);
    } else {
      setError('Invalid AI provider specified');
    }
  };

  const generateWorkoutPlan = async (userDetails, preferences) => {
    setIsLoading(true);
    setError(null);
    try {
      const plan = await aiFactory.generateWorkoutPlan(userDetails, preferences);
      setIsLoading(false);
      return plan;
    } catch (err) {
      setError(err.message);
      setIsLoading(false);
      throw err;
    }
  };

  const generateMealPlan = async (userDetails, preferences) => {
    setIsLoading(true);
    setError(null);
    try {
      const plan = await aiFactory.generateMealPlan(userDetails, preferences);
      setIsLoading(false);
      return plan;
    } catch (err) {
      setError(err.message);
      setIsLoading(false);
      throw err;
    }
  };

  const generateRecipe = async (ingredients, preferences) => {
    setIsLoading(true);
    setError(null);
    try {
      const recipe = await aiFactory.generateRecipe(ingredients, preferences);
      setIsLoading(false);
      return recipe;
    } catch (err) {
      setError(err.message);
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
    generateMealPlan,
    generateRecipe
  };

  return <AIContext.Provider value={value}>{children}</AIContext.Provider>;
};
