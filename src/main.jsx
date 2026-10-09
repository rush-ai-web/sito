import React from 'react';
// Inter self-hosted: nessuna chiamata a Google Fonts
import '@fontsource-variable/inter';
import './styles/global.css';
import { mount } from './lib/boot';
import App from './App';

console.log('%c[Rush] build 2e110ac - 2026-08-31', 'color:#6366f1;font-weight:bold');
mount(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
