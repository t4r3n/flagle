import '@testing-library/jest-dom/vitest';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from '../i18n/locales/en.json';
import fi from '../i18n/locales/fi.json';

// Initialize i18n for tests with English as default
i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    fi: { translation: fi },
  },
  lng: 'en', // Use English for tests to match existing assertions
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
  },
});
