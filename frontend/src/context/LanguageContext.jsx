import React, { createContext, useState, useEffect, useContext } from 'react';
import { storageService } from '../services/storage';
import enTranslations from '../locales/en.json';
import knTranslations from '../locales/kn.json';

export const LanguageContext = createContext();

const translations = {
  english: enTranslations,
  kannada: knTranslations
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState('english');

  useEffect(() => {
    const storedLanguage = storageService.getLanguage();
    if (storedLanguage) {
      setLanguage(storedLanguage);
    }
  }, []);

  const changeLanguage = (lang) => {
    setLanguage(lang);
    storageService.setLanguage(lang);
  };

  const translate = (key) => {
    const keys = key.split('.');
    let translation = translations[language];
    
    for (const k of keys) {
      if (translation && translation[k]) {
        translation = translation[k];
      } else {
        return key; // Return key if translation not found
      }
    }
    
    return translation;
  };

  const t = translate; // Shorthand

  return (
    <LanguageContext.Provider value={{ language, changeLanguage, translate, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

// Custom hook for easy usage
export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
};
