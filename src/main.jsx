import React from 'react';
import { createRoot } from 'react-dom/client';
// Inter self-hosted: nessuna chiamata a Google Fonts
import '@fontsource-variable/inter';
import './styles/global.css';
import App from './App';

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
