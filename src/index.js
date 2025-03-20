import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { store } from './store/store';
import { ThemeProvider } from 'styled-components';
import { theme } from './styles/theme/theme';
import GlobalStyles from './styles/global/globalStyles';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          <GlobalStyles />
          <App />
        </ThemeProvider>
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);
