import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

// Get the root element
const container = document.getElementById('root');

if (!container) {
  throw new Error('Root element not found');
}

// Create React root
const root = createRoot(container);

// Render the app
root.render(<App />);

// Hot module replacement for development
if (module.hot) {
  module.hot.accept('./App', () => {
    const NextApp = require('./App').default;
    root.render(<NextApp />);
  });
}
