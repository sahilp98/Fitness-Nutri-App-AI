import OpenAIService from './OpenAIService.js';
import GeminiService from './GeminiService.js';

class AIFactory {
  constructor() {
    this.providers = {
      openai: new OpenAIService(),
      gemini: new GeminiService()
    };
    
    this.defaultProvider = process.env.REACT_APP_DEFAULT_AI_PROVIDER || 'gemini';
  }

  getProvider(providerName = null) {
    const provider = providerName || this.defaultProvider;
    
    if (!this.providers[provider]) {
      console.error(`AI provider "${provider}" not found. Using default.`);
      return this.providers[this.defaultProvider];
    }
    
    return this.providers[provider];
  }

  async generateWorkoutPlan(userDetails, preferences) {
    const provider = this.getProvider();
    return provider.generateWorkoutPlan(userDetails, preferences);
  }

  async generateMealPlan(userDetails, preferences) {
    const provider = this.getProvider();
    return provider.generateMealPlan(userDetails, preferences);
  }

  async generateRecipe(ingredients, preferences) {
    const provider = this.getProvider();
    return provider.generateRecipe(ingredients, preferences);
  }
}

export default new AIFactory();
