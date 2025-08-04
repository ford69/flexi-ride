import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { AuthProvider } from './contexts/AuthContext';
import { AlertProvider } from './contexts/AlertContext';
import { LoadScript } from '@react-google-maps/api';
import App from './App';
import './index.css';

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

const libraries: ('places')[] = ['places'];

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <LoadScript
      googleMapsApiKey={GOOGLE_MAPS_API_KEY}
      libraries={libraries}
    >
      <Router>
        <HelmetProvider>
          <AuthProvider>
            <AlertProvider>
              <App />
            </AlertProvider>
          </AuthProvider>
        </HelmetProvider>
      </Router>
    </LoadScript>
  </React.StrictMode>
);
