import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { createTheme, ThemeProvider, responsiveFontSizes } from '@mui/material';
import { buildAppTheme } from './utils';
import { store } from './redux/store.ts';
import App from './App.tsx';
import './index.css';

const theme = () => {
  const creation = createTheme(buildAppTheme());
  return responsiveFontSizes(creation);
};

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <ThemeProvider theme={theme()}>
          <App />
        </ThemeProvider>
      </BrowserRouter>
    </Provider>
  </React.StrictMode>,
);
