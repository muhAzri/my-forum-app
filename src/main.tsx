import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import { App } from './App';
import './App.css';
import './styles/design-system.css';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Root element not found');
}

createRoot(rootElement).render(
  process.env['NODE_ENV'] === 'development' ? (
    <StrictMode>
      <App />
    </StrictMode>
  ) : (
    <App />
  ),
);