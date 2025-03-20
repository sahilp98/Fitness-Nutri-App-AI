import React, { useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import { Line, Bar } from 'react-chartjs-2';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  BarElement,
  PointElement, 
  LineElement, 
  Title, 
  Tooltip, 
  Legend
} from 'chart.js';
import { format, subMonths, parseISO } from 'date-fns';
import Card from '../ui/Card';

// Register Chart.js components
ChartJS.register(
  CategoryScale, 
  LinearScale, 
  BarElement,
  PointElement, 
  LineElement, 
  Title, 
  Tooltip, 
  Legend
);

const AnalyticsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const ChartContainer = styled.div`
  height: 300px;
  width: 100%;
`;

const StatGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;
  margin: 1.5rem 0;
`;

const StatCard = styled.div`
  padding: 1rem;
  border-radius: ${props => props.theme.radii.md};
  background: ${props => props.theme.colors.background};
  box-shadow: ${props => props.theme.shadows.neuFlat};
  text-align: center;
`;

const StatValue = styled.div`
  font-size: ${props => props.theme.fontSizes['2xl']};
  font-weight: bold;
  color: ${props => props.theme.colors.primary};
  margin-bottom: 0.25rem;
`;

const StatLabel = styled.div`
  font-size: ${props => props.theme.fontSizes.sm};
  color: rgba(45, 55, 72, 0.7);
`;

const ProgressListTitle = styled.h3`
  margin: 1.5rem 0 1rem;
`;

const ProgressList = styled.div`
  margin-top: 1rem;
`;

const ProgressItem = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 0.75rem;
  border-radius: ${props => props.theme.radii.md};
  background: ${props => props.theme.colors.background};
  box-shadow: ${props => props.theme.shadows.neuFlat};
  margin-bottom: 0.75rem;
`;

const ExerciseName = styled.span`
  font-weight: 500;
`;

const ProgressValue = styled.span`
  color: ${props => props.increase ? props.theme.colors.success : props.theme.colors.error};
  font-weight: 500;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 2rem;
  color: rgba(45, 55, 72, 0.7);
`;

const TimeframeSelector = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
  flex-wrap: wrap;
`;

const TimeframeOption = styled.button`
  padding: 0.5rem 1rem;
  border: none;
  border-radius: ${props => props.theme.radii.md};
  background: ${props => props.active ? props.theme.colors.primary : props.theme.colors.background};
  color: ${props => props.active ? 'white' : props.theme.colors.text};
  box-shadow: ${props => props.active ? 'none' : props.theme.shadows.neuFlat};
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: ${props => props.active ? props.theme.colors.primaryDark : props.theme.colors.background};
    box-shadow: ${props => props.active ? 'none' : props.theme.shadows.neuFloating};
  }
`;

const WorkoutAnalytics = () => {
  const [timeframe, setTimeframe] = useState('month'); // 'week', 'month', '3months', '6months', 'year'
  const completedWorkouts = useSelector(state => state.workout?.completedWorkouts || []);
  
  // Calculate time range based on selected timeframe
  const dateRange = useMemo(() => {
    const now = new Date();
    let start;
    
    switch (timeframe) {
      case 'week':
        start = new Date(now);
        start.setDate(now.getDate() - 7);
        break;
      case '3months':
        start = subMonths(now, 3);
        break;
      case '6months':
        start = subMonths(now, 6);
        break;
      case 'year':
        start = new Date(now);
        start.setFullYear(now.getFullYear() - 1);
        break;
      case 'month':
      default:
        start = subMonths(now, 1);
    }
    
    return { start, end: now };
  }, [timeframe]);
  
  // Filter workouts based on selected timeframe
  const filteredWorkouts = useMemo(() => {
    return completedWorkouts.filter(workout => {
      const workoutDate = new Date(workout.date);
      return workoutDate >= dateRange.start && workoutDate <= dateRange.end;
    }).sort((a, b) => new Date(a.date) - new Date(b.date));
  }, [completedWorkouts, dateRange]);
  
  // Calculate workout statistics
  const workoutStats = useMemo(() => {
    if (filteredWorkouts.length === 0) {
      return {
        totalWorkouts: 0,
        totalDuration: 0,
        avgDuration: 0,
        mostFrequentDay: 'N/A'
      };
    }
    
    const totalDuration = filteredWorkouts.reduce((sum, workout) => sum + (workout.duration || 0), 0);
    
    // Calculate most frequent day of the week
    const dayCount = { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 };
    filteredWorkouts.forEach(workout => {
      const day = new Date(workout.date).getDay();
      dayCount[day]++;
    });
    
    const maxDay = Object.entries(dayCount).reduce((max, [day, count]) => 
      count > max.count ? { day: Number(day), count } : max
    , { day: 0, count: 0 });
    
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    
    return {
      totalWorkouts: filteredWorkouts.length,
      totalDuration: totalDuration,
      avgDuration: Math.round(totalDuration / filteredWorkouts.length),
      mostFrequentDay: maxDay.count > 0 ? days[maxDay.day] : 'N/A'
    };
  }, [filteredWorkouts]);
  
  // Calculate workout frequency data (workouts per day)
  const frequencyData = useMemo(() => {
    if (filteredWorkouts.length === 0) return { labels: [], datasets: [] };
    
    const dateMap = {};
    
    // Group by date
    filteredWorkouts.forEach(workout => {
      const date = format(new Date(workout.date), 'MMM d');
      if (!dateMap[date]) {
        dateMap[date] = 0;
      }
      dateMap[date]++;
    });
    
    // Sort dates
    const dates = Object.keys(dateMap).sort(
      (a, b) => new Date(a) - new Date(b)
    );
    
    return {
      labels: dates,
      datasets: [
        {
          label: 'Workouts',
          data: dates.map(date => dateMap[date]),
          backgroundColor: 'rgba(77, 124, 255, 0.7)',
          borderColor: '#4d7cff',
          borderWidth: 1
        }
      ]
    };
  }, [filteredWorkouts]);
  
  // Calculate workout duration data
  const durationData = useMemo(() => {
    if (filteredWorkouts.length === 0) return { labels: [], datasets: [] };
    
    return {
      labels: filteredWorkouts.map(workout => format(new Date(workout.date), 'MMM d')),
      datasets: [
        {
          label: 'Duration (minutes)',
          data: filteredWorkouts.map(workout => workout.duration || 0),
          borderColor: '#48bb78',
          backgroundColor: 'rgba(72, 187, 120, 0.1)',
          tension: 0.4,
          fill: true
        }
      ]
    };
  }, [filteredWorkouts]);
  
  // Calculate exercise progress
  const exerciseProgress = useMemo(() => {
    if (filteredWorkouts.length < 2) return [];
    
    const exerciseData = {};
    
    // Collect exercise data across workouts
    filteredWorkouts.forEach(workout => {
      if (workout.exercises) {
        workout.exercises.forEach(exercise => {
          if (!exerciseData[exercise.name]) {
            exerciseData[exercise.name] = [];
          }
          
          // Find the max weight and rep combo for this exercise in this workout
          const maxSet = exercise.sets.reduce((max, set) => {
            const setScore = (set.weight || 0) * (set.reps || 0);
            return setScore > max.score ? { weight: set.weight, reps: set.reps, score: setScore } : max;
          }, { weight: 0, reps: 0, score: 0 });
          
          exerciseData[exercise.name].push({
            date: workout.date,
            weight: maxSet.weight,
            reps: maxSet.reps
          });
        });
      }
    });
    
    // Calculate progress for each exercise
    const progress = [];
    
    Object.entries(exerciseData).forEach(([name, data]) => {
      if (data.length >= 2) {
        data.sort((a, b) => new Date(a.date) - new Date(b.date));
        
        const first = data[0];
        const latest = data[data.length - 1];
        
        // Calculate weighted total (weight * reps) as a simple volume metric
        const firstVolume = (first.weight || 0) * (first.reps || 0);
        const latestVolume = (latest.weight || 0) * (latest.reps || 0);
        
        if (firstVolume > 0 && latestVolume > 0) {
          const percentChange = ((latestVolume - firstVolume) / firstVolume) * 100;
          
          progress.push({
            exercise: name,
            percentChange: percentChange.toFixed(1),
            increase: percentChange > 0,
            initialWeight: first.weight,
            initialReps: first.reps,
            latestWeight: latest.weight,
            latestReps: latest.reps
          });
        }
      }
    });
    
    // Sort by progress percentage (descending)
    return progress.sort((a, b) => Math.abs(parseFloat(b.percentChange)) - Math.abs(parseFloat(a.percentChange)));
  }, [filteredWorkouts]);
  
  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Workout Frequency',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1
        }
      }
    }
  };
  
  const lineOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Workout Duration',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Minutes'
        }
      }
    }
  };
  
  return (
    <AnalyticsContainer>
      <Card title="Workout Analytics">
        <TimeframeSelector>
          <TimeframeOption 
            active={timeframe === 'week'}
            onClick={() => setTimeframe('week')}
          >
            Last 7 Days
          </TimeframeOption>
          <TimeframeOption 
            active={timeframe === 'month'}
            onClick={() => setTimeframe('month')}
          >
            Last 30 Days
          </TimeframeOption>
          <TimeframeOption 
            active={timeframe === '3months'}
            onClick={() => setTimeframe('3months')}
          >
            3 Months
          </TimeframeOption>
          <TimeframeOption 
            active={timeframe === '6months'}
            onClick={() => setTimeframe('6months')}
          >
            6 Months
          </TimeframeOption>
          <TimeframeOption 
            active={timeframe === 'year'}
            onClick={() => setTimeframe('year')}
          >
            Year
          </TimeframeOption>
        </TimeframeSelector>
        
        <StatGrid>
          <StatCard>
            <StatValue>{workoutStats.totalWorkouts}</StatValue>
            <StatLabel>Total Workouts</StatLabel>
          </StatCard>
          
          <StatCard>
            <StatValue>{workoutStats.totalDuration}</StatValue>
            <StatLabel>Total Minutes</StatLabel>
          </StatCard>
          
          <StatCard>
            <StatValue>{workoutStats.avgDuration}</StatValue>
            <StatLabel>Avg. Duration</StatLabel>
          </StatCard>
          
          <StatCard>
            <StatValue>{workoutStats.mostFrequentDay}</StatValue>
            <StatLabel>Most Active Day</StatLabel>
          </StatCard>
        </StatGrid>
        
        {filteredWorkouts.length > 0 ? (
          <>
            <ChartContainer>
              <Bar options={barOptions} data={frequencyData} />
            </ChartContainer>
            
            <ChartContainer>
              <Line options={lineOptions} data={durationData} />
            </ChartContainer>
            
            {exerciseProgress.length > 0 && (
              <>
                <ProgressListTitle>Exercise Progress</ProgressListTitle>
                <ProgressList>
                  {exerciseProgress.slice(0, 5).map((progress, index) => (
                    <ProgressItem key={index}>
                      <ExerciseName>{progress.exercise}</ExerciseName>
                      <ProgressValue increase={progress.increase}>
                        {progress.increase ? '+' : ''}{progress.percentChange}%
                      </ProgressValue>
                    </ProgressItem>
                  ))}
                </ProgressList>
              </>
            )}
          </>
        ) : (
          <EmptyState>
            No workout data available for the selected time period.
            Log your workouts to see analytics.
          </EmptyState>
        )}
      </Card>
    </AnalyticsContainer>
  );
};

export default WorkoutAnalytics;
