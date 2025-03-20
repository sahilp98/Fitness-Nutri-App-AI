import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import { AIProvider } from './context/AIContext';
import { UserProvider } from './context/UserContext';
import { NotificationProvider } from './context/NotificationContext';
import Layout from './components/layout/Layout';
import HomePage from './pages/HomePage';
import DashboardPage from './pages/DashboardPage';
import WorkoutPlannerPage from './pages/WorkoutPlannerPage';
import WorkoutPlanViewPage from './pages/WorkoutPlanViewPage';
import WorkoutLogPage from './pages/WorkoutLogPage';
import NutritionPlannerPage from './pages/NutritionPlannerPage';
import NutritionPlanViewPage from './pages/NutritionPlanViewPage';
import RecipeBrowserPage from './pages/RecipeBrowserPage';
import ProgressTrackingPage from './pages/ProgressTrackingPage';
import ExerciseLibraryPage from './pages/ExerciseLibraryPage';
import ProfilePage from './pages/ProfilePage';
import SettingsPage from './pages/SettingsPage';
import theme from './theme';
import './styles/App.css';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <NotificationProvider>
        <UserProvider>
          <AIProvider>
            <Layout>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/workout-planner" element={<WorkoutPlannerPage />} />
                <Route path="/workout-plan-view" element={<WorkoutPlanViewPage />} />
                <Route path="/workout-log" element={<WorkoutLogPage />} />
                <Route path="/nutrition-planner" element={<NutritionPlannerPage />} />
                <Route path="/nutrition-plan-view" element={<NutritionPlanViewPage />} />
                <Route path="/recipes" element={<RecipeBrowserPage />} />
                <Route path="/progress" element={<ProgressTrackingPage />} />
                <Route path="/exercise-library" element={<ExerciseLibraryPage />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/settings" element={<SettingsPage />} />
              </Routes>
            </Layout>
          </AIProvider>
        </UserProvider>
      </NotificationProvider>
    </ThemeProvider>
  );
}

export default App;
