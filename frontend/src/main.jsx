import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';

const rootElement = document.getElementById('root');

// Add a slight artificial delay (3.5s) to ensure the startup animation 
// is visible and the app feels premium during boot up
setTimeout(() => {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}, 3500);
