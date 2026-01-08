import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './styles/typography-root.css'; // Global typography system (MUST load first)
import './index.css'; // Application styles

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);