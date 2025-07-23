import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import { registerServices } from '../core/ServiceRegistration';

import { App } from './App';
import '../App.css';
import '../styles/design-system.css';

registerServices();

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Root element not found');
}

createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>,
);