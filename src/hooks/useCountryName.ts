import { useTranslation } from 'react-i18next';

export function useCountryName() {
  const { t } = useTranslation();

  const getCountryName = (code: string, fallbackName: string): string => {
    const translated = t(`countries.${code}`, { defaultValue: '' });
    return translated || fallbackName;
  };

  return { getCountryName };
}
