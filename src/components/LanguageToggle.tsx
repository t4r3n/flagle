import { useTranslation } from 'react-i18next';

export function LanguageToggle() {
  const { i18n } = useTranslation();
  const currentLang = i18n.language;

  const toggleLanguage = () => {
    const newLang = currentLang === 'fi' ? 'en' : 'fi';
    i18n.changeLanguage(newLang);
  };

  return (
    <button
      onClick={toggleLanguage}
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#3a3a3c] hover:bg-[#4a4a4c] transition-colors text-sm font-medium text-[#d7dadc]"
      aria-label={`Switch to ${currentLang === 'fi' ? 'English' : 'Finnish'}`}
    >
      <span className={currentLang === 'fi' ? 'opacity-100' : 'opacity-50'}>🇫🇮</span>
      <span className="text-[#565758]">/</span>
      <span className={currentLang === 'en' ? 'opacity-100' : 'opacity-50'}>🇺🇸</span>
    </button>
  );
}
