import React, { useState } from 'react';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import { useAI } from '../context/AIContext';
import { saveRecipe } from '../store/slices/nutritionSlice';
import { FaSearch, FaHeart, FaClock, FaFire, FaUtensils } from 'react-icons/fa';

const RecipeBrowserContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
  
  @media (min-width: ${props => props.theme.breakpoints.lg}) {
    grid-template-columns: 1fr 2fr;
  }
`;

const SearchContainer = styled.div`
  margin-bottom: 2rem;
`;

const SearchInput = styled.div`
  position: relative;
  margin-bottom: 1rem;
`;

const SearchIcon = styled.span`
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: rgba(45, 55, 72, 0.6);
`;

const IngredientsContainer = styled.div`
  margin-top: 1rem;
`;

const IngredientTag = styled.div`
  display: inline-flex;
  align-items: center;
  margin: 0.25rem;
  padding: 0.5rem 1rem;
  background: ${props => props.theme.colors.background};
  box-shadow: ${props => props.theme.shadows.neuFlat};
  border-radius: ${props => props.theme.radii.full};
  font-size: ${props => props.theme.fontSizes.sm};
`;

const RemoveIngredient = styled.span`
  margin-left: 0.5rem;
  cursor: pointer;
  width: 18px;
  height: 18px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: rgba(45, 55, 72, 0.1);
  
  &:hover {
    background: rgba(245, 101, 101, 0.2);
    color: ${props => props.theme.colors.error};
  }
`;

const RecipeGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
  margin-top: 1rem;
`;

const RecipeCard = styled(Card)`
  cursor: pointer;
  transition: all 0.3s ease;
  height: 100%;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: ${props => props.theme.shadows.neuFloating};
  }
`;

const RecipeImagePlaceholder = styled.div`
  height: 160px;
  width: 100%;
  background: linear-gradient(120deg, #e0e5ec, #d1d9e6);
  border-radius: ${props => props.theme.radii.md} ${props => props.theme.radii.md} 0 0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgba(45, 55, 72, 0.6);
  font-size: ${props => props.theme.fontSizes['3xl']};
  margin: -1.5rem -1.5rem 1rem;
`;

const RecipeName = styled.h3`
  margin-top: 0;
  margin-bottom: 0.75rem;
`;

const RecipeMeta = styled.div`
  display: flex;
  justify-content: space-between;
  color: rgba(45, 55, 72, 0.7);
  font-size: ${props => props.theme.fontSizes.sm};
  margin-bottom: 0.75rem;
`;

const RecipeMetaItem = styled.div`
  display: flex;
  align-items: center;
  
  svg {
    margin-right: 0.25rem;
  }
`;

const MacroBadges = styled.div`
  display: flex;
  margin: 0.5rem 0;
`;

const MacroBadge = styled.span`
  display: inline-block;
  margin-right: 0.75rem;
  padding: 0.25rem 0.5rem;
  border-radius: ${props => props.theme.radii.md};
  background: ${props => props.color || props.theme.colors.background};
  color: white;
  font-size: ${props => props.theme.fontSizes.xs};
  font-weight: 600;
  white-space: nowrap;
`;

const DetailSection = styled.div`
  margin-bottom: 1.5rem;
`;

const DetailTitle = styled.h3`
  margin-bottom: 1rem;
`;

const IngredientList = styled.ul`
  padding-left: 1.5rem;
  margin: 0;
  
  li {
    margin-bottom: 0.5rem;
  }
`;

const InstructionList = styled.ol`
  padding-left: 1.5rem;
  margin: 0;
  
  li {
    margin-bottom: 1rem;
  }
`;

const FavoriteButton = styled(Button)`
  position: absolute;
  top: 1rem;
  right: 1rem;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
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

const RecipeBrowserPage = () => {
  const dispatch = useDispatch();
  const { generateRecipe, isLoading, error } = useAI();
  const savedRecipes = useSelector(state => state.nutrition.savedRecipes || []);
  
  const [searchInput, setSearchInput] = useState('');
  const [ingredients, setIngredients] = useState([]);
  const [dietaryPreferences, setDietaryPreferences] = useState({
    dietType: 'balanced',
    restrictions: '',
  });
  const [recipe, setRecipe] = useState(null);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  
  const handleSearchInput = (e) => {
    setSearchInput(e.target.value);
  };
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setDietaryPreferences(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const addIngredient = (e) => {
    e.preventDefault();
    if (!searchInput.trim()) return;
    
    const trimmed = searchInput.trim();
    if (!ingredients.includes(trimmed)) {
      setIngredients([...ingredients, trimmed]);
    }
    setSearchInput('');
  };
  
  const removeIngredient = (ingredient) => {
    setIngredients(ingredients.filter(ing => ing !== ingredient));
  };
  
  const findRecipe = async () => {
    if (ingredients.length === 0) {
      window.alert('Please add at least one ingredient');
      return;
    }
    
    try {
      setRecipe(null);
      setSelectedRecipe(null);
      const generatedRecipe = await generateRecipe(ingredients, dietaryPreferences);
      
      try {
        // Parse the JSON response
        let parsedRecipe = null;
        
        try {
          parsedRecipe = JSON.parse(generatedRecipe);
        } catch (directParseError) {
          // If direct parsing fails, try to extract JSON from text
          const jsonMatch = generatedRecipe.match(/\{[\s\S]*\}/);
          if (jsonMatch) {
            parsedRecipe = JSON.parse(jsonMatch[0]);
          } else {
            throw new Error('Could not extract JSON from response');
          }
        }

        // Validate the parsed recipe has the expected structure
        if (!parsedRecipe || !parsedRecipe.recipe) {
          throw new Error('Invalid recipe format');
        }
        
        setRecipe(parsedRecipe);
        
      } catch (parseError) {
        console.error('Error parsing AI response:', parseError);
        console.log('Raw AI response:', generatedRecipe);
        window.alert(`Error parsing the AI response. Please try again.`);
      }
    } catch (err) {
      console.error('Error generating recipe:', err);
      window.alert(`Error generating recipe: ${err.message}`);
    }
  };
  
  const saveRecipeToFavorites = () => {
    if (recipe) {
      dispatch(saveRecipe({
        ...recipe,
        id: Date.now().toString(),
        savedAt: new Date().toISOString(),
      }));
      window.alert('Recipe saved to favorites!');
    }
  };
  
  const handleRecipeClick = (recipe) => {
    setSelectedRecipe(recipe);
  };
  
  const closeRecipeDetail = () => {
    setSelectedRecipe(null);
  };
  
  return (
    <>
      <h1>Recipe Browser</h1>
      <p>Find and create recipes that match your nutritional goals and preferences.</p>
      
      <RecipeBrowserContainer>
        <div>
          <Card title="Recipe Search">
            <SearchContainer>
              <form onSubmit={addIngredient}>
                <SearchInput>
                  <SearchIcon>
                    <FaSearch />
                  </SearchIcon>
                  <Input
                    placeholder="Enter ingredients"
                    value={searchInput}
                    onChange={handleSearchInput}
                    style={{ paddingLeft: '2.5rem' }}
                  />
                </SearchInput>
                <Button 
                  type="submit"
                  variant="primary" 
                  fullWidth
                >
                  Add Ingredient
                </Button>
              </form>
            </SearchContainer>
            
            <IngredientsContainer>
              <h4>Ingredients:</h4>
              {ingredients.length === 0 ? (
                <p>No ingredients added yet.</p>
              ) : (
                ingredients.map((ingredient, index) => (
                  <IngredientTag key={index}>
                    {ingredient}
                    <RemoveIngredient onClick={() => removeIngredient(ingredient)}>×</RemoveIngredient>
                  </IngredientTag>
                ))
              )}
            </IngredientsContainer>
            
            <h4>Dietary Preferences</h4>
            <Select
              label="Diet Type"
              name="dietType"
              value={dietaryPreferences.dietType}
              onChange={handleInputChange}
              options={[
                { value: 'balanced', label: 'Balanced' },
                { value: 'high-protein', label: 'High Protein' },
                { value: 'low-carb', label: 'Low Carb' },
                { value: 'vegetarian', label: 'Vegetarian' },
                { value: 'vegan', label: 'Vegan' },
                { value: 'keto', label: 'Keto' },
                { value: 'paleo', label: 'Paleo' }
              ]}
            />
            
            <Input
              label="Restrictions"
              name="restrictions"
              value={dietaryPreferences.restrictions}
              onChange={handleInputChange}
              placeholder="e.g. gluten-free, no nuts"
            />
            
            <Button 
              variant="primary"
              onClick={findRecipe}
              fullWidth
              isLoading={isLoading}
              disabled={isLoading || ingredients.length === 0}
              margin="1.5rem 0 0"
            >
              Find Recipe
            </Button>
          </Card>
          
          {savedRecipes.length > 0 && (
            <Card title="Saved Recipes" margin="2rem 0 0">
              {savedRecipes.map(savedRecipe => (
                <IngredientTag key={savedRecipe.id} onClick={() => handleRecipeClick(savedRecipe.recipe)}>
                  {savedRecipe.recipe.name}
                </IngredientTag>
              ))}
            </Card>
          )}
        </div>
        
        <div>
          {isLoading ? (
            <Card>
              <LoadingOverlay>
                <div>🍳</div>
                <LoadingText>Cooking up a recipe...</LoadingText>
              </LoadingOverlay>
            </Card>
          ) : selectedRecipe ? (
            <Card>
              <Button 
                variant="secondary" 
                size="small" 
                onClick={closeRecipeDetail}
                margin="0 0 1rem"
              >
                Back to Recipe
              </Button>
              
              <RecipeImagePlaceholder>
                <FaUtensils />
              </RecipeImagePlaceholder>
              
              <RecipeName>{selectedRecipe.name}</RecipeName>
              
              <MacroBadges>
                <MacroBadge color="#4d7cff">{selectedRecipe.macros.protein}g Protein</MacroBadge>
                <MacroBadge color="#48bb78">{selectedRecipe.macros.carbs}g Carbs</MacroBadge>
                <MacroBadge color="#ed8936">{selectedRecipe.macros.fats}g Fats</MacroBadge>
              </MacroBadges>
              
              <RecipeMeta>
                <RecipeMetaItem>
                  <FaClock /> {selectedRecipe.prepTime} prep
                </RecipeMetaItem>
                <RecipeMetaItem>
                  <FaUtensils /> {selectedRecipe.cookTime} cook
                </RecipeMetaItem>
                <RecipeMetaItem>
                  <FaFire /> {selectedRecipe.calories} calories
                </RecipeMetaItem>
              </RecipeMeta>
              
              <DetailSection>
                <DetailTitle>Ingredients</DetailTitle>
                <IngredientList>
                  {selectedRecipe.ingredients.map((ingredient, index) => (
                    <li key={index}>{ingredient.amount} {ingredient.name}</li>
                  ))}
                </IngredientList>
              </DetailSection>
              
              <DetailSection>
                <DetailTitle>Instructions</DetailTitle>
                <InstructionList>
                  {selectedRecipe.instructions.map((step, index) => (
                    <li key={index}>{step}</li>
                  ))}
                </InstructionList>
              </DetailSection>
              
              {selectedRecipe.tips && (
                <DetailSection>
                  <DetailTitle>Tips</DetailTitle>
                  <p>{selectedRecipe.tips}</p>
                </DetailSection>
              )}
            </Card>
          ) : recipe ? (
            <Card>
              <RecipeImagePlaceholder>
                <FaUtensils />
              </RecipeImagePlaceholder>
              
              <FavoriteButton 
                variant="primary" 
                onClick={saveRecipeToFavorites}
                title="Save to favorites"
              >
                <FaHeart />
              </FavoriteButton>
              
              <RecipeName>{recipe.recipe.name}</RecipeName>
              
              <MacroBadges>
                <MacroBadge color="#4d7cff">{recipe.recipe.macros.protein}g Protein</MacroBadge>
                <MacroBadge color="#48bb78">{recipe.recipe.macros.carbs}g Carbs</MacroBadge>
                <MacroBadge color="#ed8936">{recipe.recipe.macros.fats}g Fats</MacroBadge>
              </MacroBadges>
              
              <RecipeMeta>
                <RecipeMetaItem>
                  <FaClock /> {recipe.recipe.prepTime} prep
                </RecipeMetaItem>
                <RecipeMetaItem>
                  <FaUtensils /> {recipe.recipe.cookTime} cook
                </RecipeMetaItem>
                <RecipeMetaItem>
                  <FaFire /> {recipe.recipe.calories} calories
                </RecipeMetaItem>
              </RecipeMeta>
              
              <DetailSection>
                <DetailTitle>Ingredients</DetailTitle>
                <IngredientList>
                  {recipe.recipe.ingredients.map((ingredient, index) => (
                    <li key={index}>{ingredient.amount} {ingredient.name}</li>
                  ))}
                </IngredientList>
              </DetailSection>
              
              <DetailSection>
                <DetailTitle>Instructions</DetailTitle>
                <InstructionList>
                  {recipe.recipe.instructions.map((step, index) => (
                    <li key={index}>{step}</li>
                  ))}
                </InstructionList>
              </DetailSection>
              
              {recipe.recipe.tips && (
                <DetailSection>
                  <DetailTitle>Tips</DetailTitle>
                  <p>{recipe.recipe.tips}</p>
                </DetailSection>
              )}
            </Card>
          ) : (
            <Card>
              <p>
                Your generated recipe will appear here. Enter ingredients and preferences to get started.
              </p>
            </Card>
          )}
        </div>
      </RecipeBrowserContainer>
    </>
  );
};

export default RecipeBrowserPage;
