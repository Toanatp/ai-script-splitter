
import React, { createContext, useState, useContext, useEffect, useCallback, ReactNode } from 'react';
import translations from '../i18n/locales';

export type Language = 'vi' | 'en' | 'zh' | 'ja' | 'ko';

interface I18nContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string) => string;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

const getInitialLanguage = (): Language => {
    if (typeof window !== 'undefined') {
        const savedLang = localStorage.getItem('appLanguage') as Language;
        if (savedLang && translations[savedLang]) {
            return savedLang;
        }
        const browserLang = navigator.language.split('-')[0];
        if (browserLang in translations) {
            return browserLang as Language;
        }
    }
    return 'vi'; // Default to Vietnamese
};


export const I18nProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>(getInitialLanguage());

  useEffect(() => {
    localStorage.setItem('appLanguage', language);
  }, [language]);

  const t = useCallback((key: string): string => {
      const langWithFallback = language || 'vi';
      return translations[langWithFallback]?.[key] || translations['en']?.[key] || key;
  }, [language]);

  return (
    <I18nContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </I18nContext.Provider>
  );
};

export const useI18n = (): I18nContextType => {
  const context = useContext(I18nContext);
  if (context === undefined) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return context;
};
