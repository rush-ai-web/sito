import React from 'react';
// Inter self-hosted: nessuna chiamata a Google Fonts
import './styles/fonts.css';
import './styles/global.css';
import { mount } from './lib/boot';
import AppRisto from './AppRisto';

mount(
  <React.StrictMode>
    <AppRisto />
  </React.StrictMode>
);
