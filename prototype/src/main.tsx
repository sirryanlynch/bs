import React from 'react';
import { createRoot } from 'react-dom/client';
import '@sb/lib/fonts.css';
import '@sb/tokens/tokens.css';
import '@sb/components/prism.css';
import './app.css';
import { App } from './App';

if (new URLSearchParams(location.search).has('embed')) document.documentElement.classList.add('is-embed');

createRoot(document.getElementById('root')!).render(<App />);
