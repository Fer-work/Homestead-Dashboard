// App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import { store } from './app/store.js';
import AquaponicsPage from './features/aquaponics/pages/AquaponicsPage.jsx';

// Create a dark theme for the dashboard
const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#2196f3',
      light: '#64b5f6',
      dark: '#1976d2',
    },
    secondary: {
      main: '#4caf50',
      light: '#81c784',
      dark: '#388e3c',
    },
    background: {
      default: '#121212',
      paper: '#1e1e1e',
    },
  },
  typography: {
    h1: {
      fontSize: '2.5rem',
      fontWeight: 600,
    },
    h3: {
      fontSize: '2rem',
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 12,
  },
});

function App() {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router 
          future={{
            v7_startTransition: true,
            v7_relativeSplatPath: true,
          }}
        >
          <Routes>
            <Route path="/" element={<Navigate to="/aquaponics" replace />} />
            <Route path="/aquaponics" element={<AquaponicsPage />} />
            {/* Add more routes here as you develop other features */}
          </Routes>
        </Router>
      </ThemeProvider>
    </Provider>
  );
}

export default App;
