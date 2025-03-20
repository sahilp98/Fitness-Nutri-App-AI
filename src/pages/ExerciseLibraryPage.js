import React, { useState, useMemo } from 'react';
import styled from 'styled-components';
import { FaSearch, FaBookmark, FaRegBookmark, FaFilter, FaPlay } from 'react-icons/fa';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { useDispatch, useSelector } from 'react-redux';
import { toggleFavoriteExercise } from '../store/slices/exerciseSlice';
import { 
    FaDumbbell, 
  } from 'react-icons/fa';
const PageContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const SearchFilterContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 2rem;
  
  @media (max-width: ${props => props.theme.breakpoints.md}) {
    flex-direction: column;
  }
`;

const SearchContainer = styled.div`
  flex: 1;
  position: relative;
`;

const SearchIcon = styled.div`
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: ${props => props.theme.colors.muted};
`;

const SearchInput = styled(Input)`
  padding-left: 2.5rem;
  width: 100%;
`;

const FiltersContainer = styled.div`
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
`;

const FilterButton = styled(Button)`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const FilterDrawer = styled.div`
  background: ${props => props.theme.colors.background};
  box-shadow: ${props => props.theme.shadows.neuInset};
  border-radius: ${props => props.theme.radii.md};
  padding: 1rem;
  margin-bottom: 1.5rem;
  display: ${props => props.isOpen ? 'block' : 'none'};
`;

const FilterSection = styled.div`
  margin-bottom: 1rem;
`;

const FilterTitle = styled.h4`
  margin: 0 0 0.5rem 0;
`;

const FilterOptions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
`;

const FilterOption = styled.div`
  padding: 0.5rem 1rem;
  border-radius: ${props => props.theme.radii.md};
  background: ${props => props.selected ? props.theme.colors.primary + '20' : props.theme.colors.background};
  box-shadow: ${props => props.selected ? props.theme.shadows.neuPressed : props.theme.shadows.neuFlat};
  color: ${props => props.selected ? props.theme.colors.primary : props.theme.colors.text};
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    transform: translateY(-2px);
  }
`;

const ExerciseGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
`;

const ExerciseCard = styled(Card)`
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: ${props => props.theme.shadows.neuFloating};
  }
`;

const ExerciseImage = styled.div`
  height: 180px;
  background-color: ${props => props.theme.colors.background};
  border-radius: ${props => props.theme.radii.md} ${props => props.theme.radii.md} 0 0;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
`;

const ImagePlaceholder = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${props => props.theme.colors.muted + '30'};
  color: ${props => props.theme.colors.muted};
  font-size: 2rem;
`;

const FavoriteButton = styled.button`
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  background: ${props => props.theme.colors.background};
  border: none;
  border-radius: 50%;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: ${props => props.theme.shadows.neuFloating};
  color: ${props => props.isFavorite ? props.theme.colors.warning : props.theme.colors.muted};
  transition: all 0.2s ease;
  
  &:hover {
    transform: scale(1.1);
  }
`;

const ExerciseDetails = styled.div`
  padding: 1rem;
`;

const ExerciseName = styled.h3`
  margin: 0 0 0.5rem 0;
  font-size: ${props => props.theme.fontSizes.lg};
`;

const ExerciseTags = styled.div`
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
  margin-bottom: 0.5rem;
`;

const ExerciseTag = styled.span`
  font-size: ${props => props.theme.fontSizes.xs};
  padding: 0.25rem 0.5rem;
  border-radius: ${props => props.theme.radii.sm};
  background-color: ${props => props.theme.colors.primary + '15'};
  color: ${props => props.theme.colors.primary};
`;

const ExerciseDescription = styled.p`
  margin: 0.5rem 0 0;
  font-size: ${props => props.theme.fontSizes.sm};
  color: ${props => props.theme.colors.text + 'cc'};
`;

const EmptyStateContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  text-align: center;
`;

const EmptyStateIcon = styled.div`
  font-size: 4rem;
  color: ${props => props.theme.colors.muted};
  margin-bottom: 1rem;
`;

const EmptyStateText = styled.p`
  color: ${props => props.theme.colors.muted};
  margin: 0;
`;

// Sample exercise data (in a real app, you would import this)
const exerciseData = [
  {
    id: 'ex001',
    name: 'Barbell Bench Press',
    description: 'A compound exercise that targets the chest, shoulders, and triceps.',
    muscleGroups: ['Chest', 'Shoulders', 'Triceps'],
    equipment: 'Barbell',
    difficulty: 'Intermediate',
    type: 'Strength',
    image: null
  },
  {
    id: 'ex002',
    name: 'Pull-up',
    description: 'A bodyweight exercise that works the muscles of the upper back, arms and core.',
    muscleGroups: ['Back', 'Biceps', 'Shoulders'],
    equipment: 'Pull-up Bar',
    difficulty: 'Intermediate',
    type: 'Strength',
    image: null
  },
  {
    id: 'ex003',
    name: 'Bodyweight Squat',
    description: 'A fundamental compound movement that targets the quadriceps, hamstrings, and glutes.',
    muscleGroups: ['Legs', 'Glutes'],
    equipment: 'Bodyweight',
    difficulty: 'Beginner',
    type: 'Strength',
    image: null
  },
  {
    id: 'ex004',
    name: 'Deadlift',
    description: 'A powerful compound exercise that targets the posterior chain, including the hamstrings, glutes, and back.',
    muscleGroups: ['Back', 'Legs', 'Glutes'],
    equipment: 'Barbell',
    difficulty: 'Intermediate',
    type: 'Strength',
    image: null
  },
  {
    id: 'ex005',
    name: 'Plank',
    description: 'A core stabilizing exercise that engages multiple muscle groups to maintain a rigid position.',
    muscleGroups: ['Abs', 'Shoulders'],
    equipment: 'Bodyweight',
    difficulty: 'Beginner',
    type: 'Strength',
    image: null
  },
  {
    id: 'ex006',
    name: 'Dumbbell Shoulder Press',
    description: 'An upper-body exercise targeting the deltoid muscles of the shoulders along with the triceps.',
    muscleGroups: ['Shoulders', 'Triceps'],
    equipment: 'Dumbbell',
    difficulty: 'Intermediate',
    type: 'Strength',
    image: null
  }
];

const ExerciseLibraryPage = () => {
  const dispatch = useDispatch();
  const favoriteExercises = useSelector(state => state.exercise?.favoriteExercises || []);
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    muscleGroups: [],
    equipment: [],
    difficulty: [],
    type: [],
    favorites: false
  });
  
  // Filter exercises based on selected filters and search query
  const filteredExercises = useMemo(() => {
    let filtered = [...exerciseData];
    
    // Apply search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(exercise => 
        exercise.name.toLowerCase().includes(query) ||
        exercise.description.toLowerCase().includes(query) ||
        exercise.muscleGroups.some(muscle => muscle.toLowerCase().includes(query))
      );
    }
    
    // Apply muscle group filter
    if (filters.muscleGroups.length > 0) {
      filtered = filtered.filter(exercise => 
        exercise.muscleGroups.some(muscle => 
          filters.muscleGroups.includes(muscle)
        )
      );
    }
    
    // Apply equipment filter
    if (filters.equipment.length > 0) {
      filtered = filtered.filter(exercise => 
        filters.equipment.includes(exercise.equipment)
      );
    }
    
    // Apply difficulty filter
    if (filters.difficulty.length > 0) {
      filtered = filtered.filter(exercise => 
        filters.difficulty.includes(exercise.difficulty)
      );
    }
    
    // Apply type filter
    if (filters.type.length > 0) {
      filtered = filtered.filter(exercise => 
        filters.type.includes(exercise.type)
      );
    }
    
    // Apply favorites filter
    if (filters.favorites) {
      filtered = filtered.filter(exercise => 
        favoriteExercises.includes(exercise.id)
      );
    }
    
    return filtered;
  }, [searchQuery, filters, favoriteExercises]);
  
  // Toggle filter selection
  const toggleFilter = (category, value) => {
    setFilters(prevFilters => {
      const currentValues = prevFilters[category] || [];
      const newValues = currentValues.includes(value)
        ? currentValues.filter(v => v !== value)
        : [...currentValues, value];
      
      return {
        ...prevFilters,
        [category]: newValues
      };
    });
  };
  
  // Toggle favorites only filter
  const toggleFavoritesFilter = () => {
    setFilters(prevFilters => ({
      ...prevFilters,
      favorites: !prevFilters.favorites
    }));
  };
  
  // Clear all filters
  const clearFilters = () => {
    setFilters({
      muscleGroups: [],
      equipment: [],
      difficulty: [],
      type: [],
      favorites: false
    });
    setSearchQuery('');
  };
  
  // Handle favorite toggle
  const handleFavoriteToggle = (e, exerciseId) => {
    e.stopPropagation();
    dispatch(toggleFavoriteExercise(exerciseId));
  };
  
  // Extract unique values for filter options
  const muscleGroupOptions = ['Chest', 'Back', 'Shoulders', 'Biceps', 'Triceps', 'Legs', 'Abs', 'Glutes'];
  const equipmentOptions = ['Bodyweight', 'Barbell', 'Dumbbell', 'Machine', 'Cable', 'Pull-up Bar'];
  const difficultyOptions = ['Beginner', 'Intermediate', 'Advanced'];
  const typeOptions = ['Strength', 'Cardio', 'Flexibility', 'Balance'];
  
  return (
    <PageContainer>
      <h1>Exercise Library</h1>
      <p>Browse our collection of exercises to find the perfect ones for your workout routine.</p>
      
      <SearchFilterContainer>
        <SearchContainer>
          <SearchIcon>
            <FaSearch />
          </SearchIcon>
          <SearchInput 
            placeholder="Search exercises..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </SearchContainer>
        
        <FiltersContainer>
          <FilterButton 
            variant="secondary" 
            onClick={() => setIsFilterDrawerOpen(!isFilterDrawerOpen)}
          >
            <FaFilter />
            Filters
          </FilterButton>
          
          <FilterButton 
            variant={filters.favorites ? "primary" : "secondary"}
            onClick={toggleFavoritesFilter}
          >
            {filters.favorites ? <FaBookmark /> : <FaRegBookmark />}
            Favorites
          </FilterButton>
          
          {(filters.muscleGroups.length > 0 || 
           filters.equipment.length > 0 || 
           filters.difficulty.length > 0 || 
           filters.type.length > 0 || 
           filters.favorites) && (
            <FilterButton 
              variant="warning"
              onClick={clearFilters}
            >
              Clear Filters
            </FilterButton>
          )}
        </FiltersContainer>
      </SearchFilterContainer>
      
      <FilterDrawer isOpen={isFilterDrawerOpen}>
        <FilterSection>
          <FilterTitle>Muscle Groups</FilterTitle>
          <FilterOptions>
            {muscleGroupOptions.map(muscle => (
              <FilterOption 
                key={muscle}
                selected={filters.muscleGroups.includes(muscle)}
                onClick={() => toggleFilter('muscleGroups', muscle)}
              >
                {muscle}
              </FilterOption>
            ))}
          </FilterOptions>
        </FilterSection>
        
        <FilterSection>
          <FilterTitle>Equipment</FilterTitle>
          <FilterOptions>
            {equipmentOptions.map(equipment => (
              <FilterOption 
                key={equipment}
                selected={filters.equipment.includes(equipment)}
                onClick={() => toggleFilter('equipment', equipment)}
              >
                {equipment}
              </FilterOption>
            ))}
          </FilterOptions>
        </FilterSection>
        
        <FilterSection>
          <FilterTitle>Difficulty</FilterTitle>
          <FilterOptions>
            {difficultyOptions.map(difficulty => (
              <FilterOption 
                key={difficulty}
                selected={filters.difficulty.includes(difficulty)}
                onClick={() => toggleFilter('difficulty', difficulty)}
              >
                {difficulty}
              </FilterOption>
            ))}
          </FilterOptions>
        </FilterSection>
        
        <FilterSection>
          <FilterTitle>Exercise Type</FilterTitle>
          <FilterOptions>
            {typeOptions.map(type => (
              <FilterOption 
                key={type}
                selected={filters.type.includes(type)}
                onClick={() => toggleFilter('type', type)}
              >
                {type}
              </FilterOption>
            ))}
          </FilterOptions>
        </FilterSection>
      </FilterDrawer>
      
      {filteredExercises.length > 0 ? (
        <ExerciseGrid>
          {filteredExercises.map((exercise) => (
            <ExerciseCard key={exercise.id}>
              <ExerciseImage>
                {exercise.image ? (
                  <img src={exercise.image} alt={exercise.name} />
                ) : (
                  <ImagePlaceholder>
                    <FaDumbbell />
                  </ImagePlaceholder>
                )}
                <FavoriteButton 
                  isFavorite={favoriteExercises.includes(exercise.id)}
                  onClick={(e) => handleFavoriteToggle(e, exercise.id)}
                >
                  {favoriteExercises.includes(exercise.id) ? 
                    <FaBookmark /> : <FaRegBookmark />}
                </FavoriteButton>
              </ExerciseImage>
              <ExerciseDetails>
                <ExerciseName>{exercise.name}</ExerciseName>
                <ExerciseTags>
                  {exercise.muscleGroups.map(muscle => (
                    <ExerciseTag key={muscle}>{muscle}</ExerciseTag>
                  ))}
                  <ExerciseTag>{exercise.difficulty}</ExerciseTag>
                </ExerciseTags>
                <ExerciseDescription>
                  {exercise.description}
                </ExerciseDescription>
              </ExerciseDetails>
            </ExerciseCard>
          ))}
        </ExerciseGrid>
      ) : (
        <EmptyStateContainer>
          <EmptyStateIcon>🔍</EmptyStateIcon>
          <h2>No exercises found</h2>
          <EmptyStateText>Try adjusting your search or filters to find exercises.</EmptyStateText>
          <Button 
            variant="primary"
            onClick={clearFilters}
            margin="2rem 0 0"
          >
            Clear Filters
          </Button>
        </EmptyStateContainer>
      )}
    </PageContainer>
  );
};

export default ExerciseLibraryPage;
