import './dev/whyDidYouRender';

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import { App } from '@/App';
import { registerServices } from '@/core/ServiceRegistration';
import '@/App.css';
import '@/styles/design-system.css';

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
