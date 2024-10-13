import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { datadogRum } from '@datadog/browser-rum';
import App from './App';
import './styles/index.css';

datadogRum.init({
  applicationId: import.meta.env.VITE_DATADOG_APPLICATION_ID,
  clientToken: import.meta.env.VITE_DATADOG_CLIENT_TOKEN,
  site: import.meta.env.VITE_DATADOG_SITE,
  service: import.meta.env.VITE_DATADOG_SERVICE,
  env: import.meta.env.MODE,
  version: __APP_VERSION__,
  sessionSampleRate: 100,
  sessionReplaySampleRate: 20,
  trackUserInteractions: true,
  trackResources: true,
  trackLongTasks: true,
  defaultPrivacyLevel: 'mask-user-input',
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);