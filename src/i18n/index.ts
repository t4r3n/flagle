import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import fi from './locales/fi.json';
import en from './locales/en.json';

const LANGUAGE_KEY = 'flagle-language';

// Get saved language or default to Finnish
const getSavedLanguage = (): string => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem(LANGUAGE_KEY) || 'fi';
  }
  return 'fi';
};

i18n.use(initReactI18next).init({
  resources: {
    fi: { translation: fi },
    en: { translation: en },
  },
  lng: getSavedLanguage(),
  fallbackLng: 'fi',
  interpolation: {
    escapeValue: false, // React already escapes
  },
});

// Save language preference when changed
i18n.on('languageChanged', (lng) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(LANGUAGE_KEY, lng);
  }
});

export default i18n;
