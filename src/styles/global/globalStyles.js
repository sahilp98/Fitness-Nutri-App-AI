import { createGlobalStyle } from 'styled-components';

const GlobalStyles = createGlobalStyle`
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }
  
  body {
    background-color: ${props => props.theme.colors.background};
    color: ${props => props.theme.colors.text};
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
      'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
      sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
  
  /* Animation for loading states */
  @keyframes pulse {
    0% { opacity: 0.6; }
    50% { opacity: 1; }
    100% { opacity: 0.6; }
  }

  .pulse {
    animation: pulse 1.5s infinite ease-in-out;
  }

  /* Utility classes */
  .text-center {
    text-align: center;
  }

  .mt-1 {
    margin-top: 1rem;
  }

  .mb-1 {
    margin-bottom: 1rem;
  }

  .p-1 {
    padding: 1rem;
  }

  /* Accessibility focus styles */
  :focus {
    outline: 2px solid ${props => props.theme.colors.primary};
    outline-offset: 2px;
  }
  
  .app {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
  }
`;

export default GlobalStyles;
