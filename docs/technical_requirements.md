# Technical Requirements Document

## Core Technologies

### Frontend
- **React**: For building the user interface
- **Redux Toolkit**: For state management
- **React Router**: For navigation
- **Styled Components**: For styling (with neumorphism design)
- **Chart.js**: For progress visualization

### APIs and Services
- **OpenAI API**: For generating workout and nutrition plans
- **Gemini API**: Alternative AI provider for plan generation
- **localStorage API**: For client-side data persistence

## Feature Requirements

### User Profile Management
- User should be able to create and edit their profile
- Profile should store personal information, fitness goals, and preferences
- System should calculate BMI, BMR, and TDEE based on user data

### Workout Plan Generation
- System should generate personalized workout plans based on user profile
- Plans should include specific exercises, sets, reps, and rest periods
- Plans should accommodate available equipment and fitness level
- User should be able to customize generated plans

### Nutrition Plan Generation
- System should calculate calorie needs based on user goals
- System should generate meal plans that meet calorie and macro targets
- Plans should respect dietary preferences and restrictions
- Each meal should include portion sizes and nutritional information

### Progress Tracking
- User should be able to log completed workouts
- User should be able to log meals consumed
- User should be able to track body measurements
- System should visualize progress over time

## Non-Functional Requirements

### Performance
- AI plan generation should complete in under 10 seconds
- UI should be responsive with no perceptible lag
- Application should function offline after initial load

### Security
- API keys should be secured and not exposed in client-side code
- User data should be stored securely
- Health disclaimers should be prominently displayed

### Usability
- UI should follow neumorphic design principles
- Forms should validate input in real-time
- Guidance and tooltips should be available for complex features
- Application should be fully responsive on mobile, tablet, and desktop

### Accessibility
- Application should be WCAG 2.1 AA compliant
- Color contrast should meet accessibility standards
- All functionality should be accessible via keyboard

## Neumorphic Design Guidelines

### Color Palette
- Background: #e0e5ec
- Shadow Light: #ffffff
- Shadow Dark: #a3b1c6
- Accent: #4d7cff

### UI Elements
- Buttons: Soft, rounded with subtle shadows
- Cards: Light elevation with soft shadows
- Inputs: Inset effect when focused
- Text: High contrast for readability

### Animation
- Subtle transitions for state changes
- Gentle feedback for user interactions
- No harsh or rapid movements
