import React from 'react';
import { createRoot } from 'react-dom/client';
// Inter self-hosted: nessuna chiamata a Google Fonts
import '@fontsource-variable/inter';
import './styles/global.css';
import App from './App';

console.log('%c[Rush] build 2e110ac — 2026-08-31', 'color:#6366f1;font-weight:bold');
createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
