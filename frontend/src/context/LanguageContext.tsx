import React, { createContext, useState, useEffect, useContext } from 'react';

// Define the available languages
export const SUPPORTED_LANGUAGES = ['English', 'Hindi', 'Bengali', 'Marathi', 'Punjabi', 'Haryanvi'];

type LanguageContextType = {
  language: string;
  setLanguage: (lang: string) => void;
};

// Default context
const LanguageContext = createContext<LanguageContextType>({ 
  language: 'Hindi', 
  setLanguage: () => {} 
});

export const LanguageProvider = ({ children }: { children: React.ReactNode }) => {
  const [language, setLanguageState] = useState('Hindi');

  // On initial load, check if they have a saved preference
  useEffect(() => {
    const storedLang = localStorage.getItem('preferredLanguage');
    if (storedLang && SUPPORTED_LANGUAGES.includes(storedLang)) {
      setLanguageState(storedLang);
    }
  }, []);

  // Update state AND local storage simultaneously
  const setLanguage = (lang: string) => {
    setLanguageState(lang);
    localStorage.setItem('preferredLanguage', lang);
    
    // OPTIONAL: If you want to sync this with your MongoDB backend right away:
    /*
    const token = localStorage.getItem('af_token');
    if (token) {
      fetch('/api/user/language', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ preferredLanguage: lang })
      });
    }
    */
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

// Custom hook for easy access in any component
export const useLanguage = () => useContext(LanguageContext);