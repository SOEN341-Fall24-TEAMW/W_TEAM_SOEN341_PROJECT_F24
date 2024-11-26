import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.js';
import reportWebVitals from './reportWebVitals.js';
import { MantineProvider } from '@mantine/core';  // Import MantineProvider

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    {/* Wrap your App component with MantineProvider */}
    <MantineProvider theme={{ colorScheme: 'light' }}>
      <App />
    </MantineProvider>
  </React.StrictMode>
);

reportWebVitals();
