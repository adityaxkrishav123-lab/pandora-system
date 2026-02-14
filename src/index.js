import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// 1. Import Global CSS (This includes your Preloader and Pandora styles)
import './index.css';

// 2. Inject Google Fonts dynamically for the "Cinzel" aesthetic
const link = document.createElement('link');
link.href = 'https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700;900&family=Inter:wght@300;400;600;800&display=swap';
link.rel = 'stylesheet';
document.head.appendChild(link);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
