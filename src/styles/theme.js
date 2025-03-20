export const theme = {
  colors: {
    background: '#e0e5ec',
    text: '#2d3748',
    primary: '#4d7cff',
    secondary: '#38b2ac',
    accent: '#ed8936',
    error: '#e53e3e',
    success: '#38a169',
    lightShadow: '#ffffff',
    darkShadow: '#a3b1c6',
  },
  
  fontSizes: {
    xs: '0.75rem',
    sm: '0.875rem',
    md: '1rem',
    lg: '1.125rem',
    xl: '1.25rem',
    '2xl': '1.5rem',
    '3xl': '1.875rem',
    '4xl': '2.25rem',
  },
  
  space: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    '2xl': '3rem',
    '3xl': '4rem',
  },
  
  radii: {
    sm: '0.125rem',
    md: '0.375rem',
    lg: '0.5rem',
    xl: '1rem',
    full: '9999px',
  },
  
  shadows: {
    // Neumorphic shadows
    neuFlat: `
      3px 3px 6px #a3b1c6,
      -3px -3px 6px #ffffff
    `,
    neuPressed: `
      inset 3px 3px 6px #a3b1c6,
      inset -3px -3px 6px #ffffff
    `,
    neuFloating: `
      6px 6px 12px #a3b1c6,
      -6px -6px 12px #ffffff
    `,
  },
  
  breakpoints: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
  },
};
