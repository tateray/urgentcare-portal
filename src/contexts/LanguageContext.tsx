
import React, { createContext, useState, useContext, ReactNode } from 'react';

type Language = 'english' | 'shona' | 'ndebele';

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string) => string;
}

// Translations
const translations: Record<Language, Record<string, string>> = {
  english: {
    "profile": "Profile",
    "personalInfo": "Personal Information",
    "managePersonal": "Manage your personal details",
    "fullName": "Full Name",
    "emailAddress": "Email Address",
    "phoneNumber": "Phone Number",
    "nationalID": "National ID",
    "cancel": "Cancel",
    "saveChanges": "Save Changes",
    "editProfile": "Edit Profile",
    "profilePicture": "Profile Picture",
    "manageProfileImage": "Manage your profile image",
    "upload": "Upload",
    "takePhoto": "Take Photo",
    "languageSettings": "Language Settings",
    "chooseLanguage": "Choose your preferred language",
    "medicalInfo": "Medical Information",
    "importantHealth": "Important health information for emergencies",
    "bloodType": "Blood Type",
    "allergies": "Allergies",
    "medicalConditions": "Medical Conditions",
    "currentMedications": "Current Medications",
    "emergencyContact": "Emergency Contact",
    "viewFullMedical": "View Full Medical History",
    // Add more translations as needed
  },
  shona: {
    "profile": "Pfupiro",
    "personalInfo": "Mashoko Munhu",
    "managePersonal": "Chengetedza mashoko ako",
    "fullName": "Zita Rakazara",
    "emailAddress": "Kero yeEmail",
    "phoneNumber": "Nhamba yeFoni",
    "nationalID": "ID yeNyika",
    "cancel": "Kanzura",
    "saveChanges": "Chengetedza Shanduko",
    "editProfile": "Gadzirisa Pfupiro",
    "profilePicture": "Mufananidzo",
    "manageProfileImage": "Gadzirisa mufananidzo wako",
    "upload": "Isa Mufananidzo",
    "takePhoto": "Tora Mufananidzo",
    "languageSettings": "Sarudzo yeMitauro",
    "chooseLanguage": "Sarudza mutauro unoda",
    "medicalInfo": "Mashoko eUtano",
    "importantHealth": "Mashoko akakosha eUtano pakutambudzika",
    "bloodType": "Rudzi rweRopa",
    "allergies": "Zvinokonzera Kutemwa",
    "medicalConditions": "Zvirwere",
    "currentMedications": "Mishonga Yauri Kumwa",
    "emergencyContact": "Anofanirwa Kufonwa paKutambudzika",
    "viewFullMedical": "Ona Zvose Zvako ZveUtano",
    // Add more translations as needed
  },
  ndebele: {
    "profile": "Umbiko",
    "personalInfo": "Imininingwane Yakho",
    "managePersonal": "Phatha imininingwane yakho",
    "fullName": "Ibizo Eligcweleyo",
    "emailAddress": "Ikheli le-Email",
    "phoneNumber": "Inombolo Yocingo",
    "nationalID": "I-ID Yesizwe",
    "cancel": "Khansela",
    "saveChanges": "Gcina Utshintsho",
    "editProfile": "Hlela Umbiko",
    "profilePicture": "Isithombe",
    "manageProfileImage": "Phatha isithombe sakho",
    "upload": "Layisha Isithombe",
    "takePhoto": "Thatha Isithombe",
    "languageSettings": "Izilungiselelo Zolimi",
    "chooseLanguage": "Khetha ulimi olufunayo",
    "medicalInfo": "Imininingwane Yezempilo",
    "importantHealth": "Imininingwane ebalulekileyo yezempilo esimweni esiphuthumayo",
    "bloodType": "Uhlobo Lwegazi",
    "allergies": "Ukuzwela",
    "medicalConditions": "Izifo",
    "currentMedications": "Imithi Oyisebenzisayo",
    "emergencyContact": "Umuntu Wokuxhumana Naye Esimweni Esiphuthumayo",
    "viewFullMedical": "Bona Yonke Imininingwane Yakho Yezempilo",
    // Add more translations as needed
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>('english');

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
