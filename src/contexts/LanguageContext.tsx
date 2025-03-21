
import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';

type Language = 'en' | 'sn' | 'nd';

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Default translations for English
const translations: Record<Language, Record<string, string>> = {
  en: {
    // Navigation
    'home': 'Home',
    'profile': 'Profile',
    'medical_history': 'Medical History',
    'emergency_contacts': 'Emergency Contacts',
    'ambulance': 'Ambulance',
    'hospital_locator': 'Hospital Locator',
    'chat': 'Chat with Doctor',
    'fire_emergency': 'Fire Emergency',
    
    // Profile page
    'my_profile': 'My Profile',
    'profile_picture': 'Profile Picture',
    'manage_profile_image': 'Manage your profile image',
    'upload': 'Upload',
    'take_photo': 'Take Photo',
    'language_settings': 'Language Settings',
    'choose_language': 'Choose your preferred language',
    'english': 'English',
    'shona': 'Shona',
    'ndebele': 'Ndebele',
    'personal_information': 'Personal Information',
    'manage_personal_details': 'Manage your personal details',
    'full_name': 'Full Name',
    'email_address': 'Email Address',
    'phone_number': 'Phone Number',
    'national_id': 'National ID',
    'edit_profile': 'Edit Profile',
    'save_changes': 'Save Changes',
    'cancel': 'Cancel',
    'medical_information': 'Medical Information',
    'important_health_info': 'Important health information for emergencies',
    'blood_type': 'Blood Type',
    'allergies': 'Allergies',
    'medical_conditions': 'Medical Conditions',
    'current_medications': 'Current Medications',
    'emergency_contact': 'Emergency Contact',
    'view_medical_history': 'View Full Medical History',
    'language_changed': 'Language Changed',
    'language_set_to': 'Language set to',
    
    // Emergency contacts
    'add_new_contact': 'Add New Contact',
    'contact_name': 'Contact Name',
    'add_contact': 'Add Contact',
    'favorites': 'Favorites',
    'all_contacts': 'All Contacts',
    'default': 'Default',
    'calling': 'Calling',
    'dialing': 'Dialing',

    // Settings
    'settings': 'Settings',
    'customize_experience': 'Customize your experience',
    'appearance': 'Appearance',
    'language': 'Language',
    'accessibility': 'Accessibility',
    'theme': 'Theme',
    'dark_mode': 'Dark Mode',
    'light_mode': 'Light Mode',
    'system': 'System',
    'high_contrast': 'High Contrast',
    'large_text': 'Large Text',
    'reduce_motion': 'Reduce Motion',
    'done': 'Done',
    'language_and_region': 'Language & Region',
    'region': 'Region',
    'display_language': 'Display Language'
  },
  
  sn: {
    // Navigation
    'home': 'Kumba',
    'profile': 'Zvemunhu',
    'medical_history': 'Zvekurwara',
    'emergency_contacts': 'Vanhu Vekudana Panguva Yekutambudzika',
    'ambulance': 'Ambulance',
    'hospital_locator': 'Kutsvaga Chipatara',
    'chat': 'Taura naDhokota',
    'fire_emergency': 'Mukana Wemoto',
    
    // Profile page
    'my_profile': 'Zvandiri',
    'profile_picture': 'Mufananidzo',
    'manage_profile_image': 'Chengetedza mufananidzo wako',
    'upload': 'Isa',
    'take_photo': 'Tora Mufananidzo',
    'language_settings': 'Sarudzo Yemitauro',
    'choose_language': 'Sarudza mutauro waunoda',
    'english': 'Chirungu',
    'shona': 'Shona',
    'ndebele': 'Ndebele',
    'personal_information': 'Ruzivo Rwemunhu',
    'manage_personal_details': 'Chengetedza ruzivo rwako',
    'full_name': 'Zita Rakazara',
    'email_address': 'Email',
    'phone_number': 'Nhamba yeFoni',
    'national_id': 'ID yeNyika',
    'edit_profile': 'Chinja Zvandiri',
    'save_changes': 'Chengetedza Shanduko',
    'cancel': 'Kanzura',
    'medical_information': 'Zvekurwara',
    'important_health_info': 'Ruzivo rwakakosha rwehutano hwako munguva dzekutambura',
    'blood_type': 'Mhando yeRopa',
    'allergies': 'Zvinokonzera Allergy',
    'medical_conditions': 'Zvirwere Zviripo',
    'current_medications': 'Mishonga Yaurikumwa',
    'emergency_contact': 'Munhu Anodaiwa Pakutambura',
    'view_medical_history': 'Ongorora Zvekurwara Zvako Zvose',
    'language_changed': 'Mutauro Washandurwa',
    'language_set_to': 'Mutauro waita',
    
    // Emergency contacts
    'add_new_contact': 'Wedzera Munhu Mutsva',
    'contact_name': 'Zita Remunhu',
    'add_contact': 'Wedzera Munhu',
    'favorites': 'Vadiwa',
    'all_contacts': 'Vanhu Vose',
    'default': 'Anokosha',
    'calling': 'Kudana',
    'dialing': 'Kudaira',

    // Settings
    'settings': 'Zvirimodeterwa',
    'customize_experience': 'Ita kuti zviite nenzira yako',
    'appearance': 'Kuonekwa',
    'language': 'Mutauro',
    'accessibility': 'Kuwanisa',
    'theme': 'Muvari',
    'dark_mode': 'Muvari Wesviba',
    'light_mode': 'Muvari Wechena',
    'system': 'Mashini',
    'high_contrast': 'Kuoneka Kwakasimba',
    'large_text': 'Manyorero Makuru',
    'reduce_motion': 'Deredza Kutenderera',
    'done': 'Zvaita',
    'language_and_region': 'Mutauro neNharaunda',
    'region': 'Nharaunda',
    'display_language': 'Mutauro Wekuratidza'
  },
  
  nd: {
    // Navigation
    'home': 'Ikhaya',
    'profile': 'Imininingwane Yakho',
    'medical_history': 'Umlando Wezempilo',
    'emergency_contacts': 'Izinombolo Zokusiza',
    'ambulance': 'Ambulensi',
    'hospital_locator': 'Ukudinga isiBhedlela',
    'chat': 'Xoxa noDokotela',
    'fire_emergency': 'Usizo Ngomlilo',
    
    // Profile page
    'my_profile': 'Imininingwane Yami',
    'profile_picture': 'Isithombe Sakho',
    'manage_profile_image': 'Phatha isithombe sakho',
    'upload': 'Layisha',
    'take_photo': 'Thatha Isithombe',
    'language_settings': 'Izilungiselelo Zolimi',
    'choose_language': 'Khetha ulimi oluthandayo',
    'english': 'IsiNgisi',
    'shona': 'IsiShona',
    'ndebele': 'IsiNdebele',
    'personal_information': 'Imininingwane Yomuntu',
    'manage_personal_details': 'Phatha imininingwane yakho',
    'full_name': 'Ibizo Eligcwele',
    'email_address': 'Ikheli le-imeyili',
    'phone_number': 'Inombolo Yocingo',
    'national_id': 'I-ID Yesizwe',
    'edit_profile': 'Hlela Imininingwane',
    'save_changes': 'Londoloza Izinguquko',
    'cancel': 'Khansela',
    'medical_information': 'Imininingwane Yezempilo',
    'important_health_info': 'Ulwazi olubalulekile lwezempilo lwesimo esiphuthumayo',
    'blood_type': 'Uhlobo Lwegazi',
    'allergies': 'Ama-Allergy',
    'medical_conditions': 'Izimo Zezempilo',
    'current_medications': 'Imithi Yamanje',
    'emergency_contact': 'Othintwa Ngesikhathi Esiphuthumayo',
    'view_medical_history': 'Buka Umlando Wezempilo Ogcwele',
    'language_changed': 'Ulimi Lushintshiwe',
    'language_set_to': 'Ulimi lusethe ku',
    
    // Emergency contacts
    'add_new_contact': 'Engeza Umuntu Omusha',
    'contact_name': 'Igama Lomuntu',
    'add_contact': 'Engeza Umuntu',
    'favorites': 'Abathandekayo',
    'all_contacts': 'Bonke Abantu',
    'default': 'Okubalulekile',
    'calling': 'Uyafona',
    'dialing': 'Uyakhipa',

    // Settings
    'settings': 'Izilungiselelo',
    'customize_experience': 'Customiza isipiliyoni sakho',
    'appearance': 'Ukubukeka',
    'language': 'Ulimi',
    'accessibility': 'Ukufinyelela',
    'theme': 'Indlela yokubukeka',
    'dark_mode': 'Indlela emnyama',
    'light_mode': 'Indlela ekhanyayo',
    'system': 'Isistimu',
    'high_contrast': 'Okubonakala kakhulu',
    'large_text': 'Umbhalo omkhulu',
    'reduce_motion': 'Nciphisa ukuhamba',
    'done': 'Kwenziwe',
    'language_and_region': 'Ulimi nesiFunda',
    'region': 'IsiFunda',
    'display_language': 'Ulimi lokubonisa'
  }
};

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Initialize language from localStorage or default to 'en'
  const [language, setLanguage] = useState<Language>(() => {
    const savedLanguage = localStorage.getItem('language');
    return (savedLanguage as Language) || 'en';
  });
  
  // Save language to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);
  
  // Translation function
  const t = (key: string): string => {
    return translations[language][key] || key;
  };
  
  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

// Hook to use the language context
export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
