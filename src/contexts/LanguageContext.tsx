
import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'english' | 'shona' | 'ndebele';

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  translations: Record<string, string>;
}

const translations = {
  english: {
    home: 'Home',
    profile: 'Profile',
    settings: 'Settings',
    logout: 'Logout',
    darkMode: 'Dark Mode',
    saveOffline: 'Save Offline',
    useOfflineMap: 'Use Offline Map',
    hospitals: 'Hospitals',
    emergencyContacts: 'Emergency Contacts',
    ambulance: 'Ambulance',
    fireEmergency: 'Fire Emergency',
    medicalHistory: 'Medical History',
    chat: 'Chat with Doctor',
  },
  shona: {
    home: 'Kumba',
    profile: 'Tsanangudzo',
    settings: 'Miseti',
    logout: 'Budai',
    darkMode: 'Magetsi',
    saveOffline: 'Chengetedza Memori',
    useOfflineMap: 'Shandisa Mepu Yemumemori',
    hospitals: 'Zvipatara',
    emergencyContacts: 'Manamba eKukasika',
    ambulance: 'Ambulansi',
    fireEmergency: 'Moto Mukuru',
    medicalHistory: 'Nhoroondo yeHutano',
    chat: 'Taura neMukoti',
  },
  ndebele: {
    home: 'Ekhaya',
    profile: 'Iprofile',
    settings: 'Izilungiselelo',
    logout: 'Phuma',
    darkMode: 'Ubumnyama',
    saveOffline: 'Londoloza',
    useOfflineMap: 'Sebenzisa Imap',
    hospitals: 'Izibhedlela',
    emergencyContacts: 'Amakhadi Osizo',
    ambulance: 'I-Ambulensi',
    fireEmergency: 'Umlilo Ongozini',
    medicalHistory: 'Imbali Yezempilo',
    chat: 'Khuluma loMelaphi',
  },
};

const getLanguageTranslations = (lang: Language) => {
  return translations[lang] || translations.english;
};

const LanguageContext = createContext<LanguageContextType>({
  language: 'english',
  setLanguage: () => {},
  translations: translations.english,
});

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>(() => {
    const savedLanguage = localStorage.getItem('language');
    return (savedLanguage as Language) || 'english';
  });
  
  const [currentTranslations, setCurrentTranslations] = useState(getLanguageTranslations(language));

  useEffect(() => {
    localStorage.setItem('language', language);
    setCurrentTranslations(getLanguageTranslations(language));
  }, [language]);

  return (
    <LanguageContext.Provider value={{ 
      language, 
      setLanguage, 
      translations: currentTranslations 
    }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
