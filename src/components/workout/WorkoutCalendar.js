import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { 
  format, 
  startOfMonth, 
  endOfMonth, 
  eachDayOfInterval, 
  isSameMonth, 
  isSameDay, 
  addMonths, 
  subMonths,
  parseISO,
  isToday
} from 'date-fns';
import { FaChevronLeft, FaChevronRight, FaDumbbell, FaUtensils, FaCheck } from 'react-icons/fa';
import Card from '../ui/Card';
import Button from '../ui/Button';

const CalendarContainer = styled.div`
  padding: 1rem;
`;

const CalendarHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
`;

const MonthTitle = styled.h2`
  margin: 0;
  font-size: ${props => props.theme.fontSizes['2xl']};
`;

const MonthNavigation = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const NavButton = styled.button`
  background: ${props => props.theme.colors.background};
  box-shadow: ${props => props.theme.shadows.neuFlat};
  border: none;
  border-radius: ${props => props.theme.radii.md};
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    box-shadow: ${props => props.theme.shadows.neuFloating};
  }
  
  &:active {
    box-shadow: ${props => props.theme.shadows.neuPressed};
  }
`;

const WeekdaysRow = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  text-align: center;
  font-weight: 600;
  margin-bottom: 1rem;
`;

const Weekday = styled.div`
  padding: 0.5rem;
`;

const DaysGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 0.5rem;
`;

const DayCell = styled.div`
  aspect-ratio: 1;
  border-radius: ${props => props.theme.radii.md};
  background: ${props => props.isCurrentMonth ? props.theme.colors.background : 'transparent'};
  box-shadow: ${props => props.isCurrentMonth ? props.theme.shadows.neuFlat : 'none'};
  cursor: ${props => props.isCurrentMonth ? 'pointer' : 'default'};
  position: relative;
  overflow: hidden;
  
  ${props => props.isToday && `
    border: 2px solid ${props.theme.colors.primary};
  `}
  
  &:hover {
    ${props => props.isCurrentMonth && `
      transform: translateY(-2px);
      box-shadow: ${props.theme.shadows.neuFloating};
    `}
  }
`;

const DayNumber = styled.div`
  position: absolute;
  top: 0.25rem;
  left: 0.5rem;
  font-weight: ${props => props.isToday ? '600' : '400'};
  font-size: ${props => props.theme.fontSizes.sm};
`;

const EventIndicators = styled.div`
  position: absolute;
  bottom: 0.25rem;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  gap: 0.25rem;
`;

const EventIndicator = styled.div`
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background-color: ${({ type, theme }) => 
    type === 'workout' ? theme.colors.primary : 
    type === 'nutrition' ? theme.colors.success : 
    theme.colors.warning};
`;

const EventsList = styled.div`
  margin-top: 2rem;
`;

const EventItem = styled.div`
  padding: 1rem;
  border-radius: ${props => props.theme.radii.md};
  background: ${props => props.theme.colors.background};
  box-shadow: ${props => props.theme.shadows.neuFlat};
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const EventIcon = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: ${({ type, theme }) => 
    type === 'workout' ? theme.colors.primary : 
    type === 'nutrition' ? theme.colors.success : 
    theme.colors.warning};
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const EventContent = styled.div`
  flex: 1;
`;

const EventTitle = styled.h4`
  margin: 0 0 0.25rem 0;
`;

const EventTime = styled.div`
  font-size: ${props => props.theme.fontSizes.sm};
  color: rgba(45, 55, 72, 0.7);
`;

const NoEventsMessage = styled.p`
  text-align: center;
  color: rgba(45, 55, 72, 0.7);
  padding: 1rem;
`;

const WorkoutCalendar = ({ workouts = [], mealLogs = [] }) => {
  const navigate = useNavigate();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  
  // Generate calendar days
  const daysInMonth = useMemo(() => {
    const start = startOfMonth(currentMonth);
    const end = endOfMonth(currentMonth);
    
    // Get all days in the month
    return eachDayOfInterval({ start, end });
  }, [currentMonth]);
  
  // Handle next month
  const nextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };
  
  // Handle previous month
  const prevMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
  };
  
  // Get events for selected date
  const selectedDateEvents = useMemo(() => {
    const events = [];
    
    // Add workouts
    workouts.forEach(workout => {
      if (isSameDay(parseISO(workout.date), selectedDate)) {
        events.push({
          id: workout.id,
          type: 'workout',
          title: workout.exercises ? `Workout: ${workout.exercises.length} exercises` : 'Workout',
          time: workout.duration ? `${workout.duration} min` : 'No duration set',
          icon: <FaDumbbell />,
          onClick: () => navigate('/workout-log-view', { state: { workoutId: workout.id } })
        });
      }
    });
    
    // Add meal logs
    mealLogs.forEach(meal => {
      if (isSameDay(parseISO(meal.date), selectedDate)) {
        events.push({
          id: meal.id,
          type: 'nutrition',
          title: `Meal: ${meal.mealName || 'Logged meal'}`,
          time: meal.time || 'No time set',
          icon: <FaUtensils />,
          onClick: () => navigate('/nutrition-log-view', { state: { mealId: meal.id } })
        });
      }
    });
    
    return events;
  }, [selectedDate, workouts, mealLogs, navigate]);
  
  // Get events for a specific day (for indicators)
  const getEventsForDay = (day) => {
    const events = {
      workout: false,
      nutrition: false
    };
    
    // Check workouts
    workouts.forEach(workout => {
      if (isSameDay(parseISO(workout.date), day)) {
        events.workout = true;
      }
    });
    
    // Check meal logs
    mealLogs.forEach(meal => {
      if (isSameDay(parseISO(meal.date), day)) {
        events.nutrition = true;
      }
    });
    
    return events;
  };
  
  // Calendar weekday headers
  const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  
  return (
    <Card title="Workout Calendar">
      <CalendarContainer>
        <CalendarHeader>
          <MonthTitle>{format(currentMonth, 'MMMM yyyy')}</MonthTitle>
          <MonthNavigation>
            <NavButton onClick={prevMonth}>
              <FaChevronLeft />
            </NavButton>
            <NavButton onClick={() => setCurrentMonth(new Date())}>
              Today
            </NavButton>
            <NavButton onClick={nextMonth}>
              <FaChevronRight />
            </NavButton>
          </MonthNavigation>
        </CalendarHeader>
        
        <WeekdaysRow>
          {weekdays.map(day => (
            <Weekday key={day}>{day}</Weekday>
          ))}
        </WeekdaysRow>
        
        <DaysGrid>
          {/* Fill in any days from the previous month */}
          {Array.from({ length: daysInMonth[0].getDay() }).map((_, index) => (
            <DayCell key={`prev-${index}`} isCurrentMonth={false} />
          ))}
          
          {/* Current month days */}
          {daysInMonth.map(day => {
            const events = getEventsForDay(day);
            const dayNumber = day.getDate();
            
            return (
              <DayCell 
                key={dayNumber}
                isCurrentMonth={true}
                isToday={isToday(day)}
                onClick={() => setSelectedDate(day)}
                style={{ 
                  opacity: isSameMonth(day, currentMonth) ? 1 : 0.5,
                  border: isSameDay(day, selectedDate) ? `2px solid ${theme.colors.primary}` : ''
                }}
              >
                <DayNumber isToday={isToday(day)}>{dayNumber}</DayNumber>
                
                <EventIndicators>
                  {events.workout && <EventIndicator type="workout" />}
                  {events.nutrition && <EventIndicator type="nutrition" />}
                </EventIndicators>
              </DayCell>
            );
          })}
        </DaysGrid>
        
        <div>
          <h3>Events for {format(selectedDate, 'MMMM d, yyyy')}</h3>
          
          <EventsList>
            {selectedDateEvents.length > 0 ? (
              selectedDateEvents.map(event => (
                <EventItem key={event.id} onClick={event.onClick}>
                  <EventIcon type={event.type}>
                    {event.icon}
                  </EventIcon>
                  <EventContent>
                    <EventTitle>{event.title}</EventTitle>
                    <EventTime>{event.time}</EventTime>
                  </EventContent>
                </EventItem>
              ))
            ) : (
              <NoEventsMessage>No events scheduled for this day.</NoEventsMessage>
            )}
          </EventsList>
          
          <Button
            variant="primary"
            onClick={() => navigate('/workout-log')}
            fullWidth
            margin="1rem 0 0"
          >
            Log New Workout
          </Button>
        </div>
      </CalendarContainer>
    </Card>
  );
};

export default WorkoutCalendar;
