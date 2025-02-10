import React, { createContext, useState, useContext, useEffect } from 'react';

const LanguageContext = createContext();

const translations = {
  en: {
    dashboard: "Dashboard",
    profile: "Profile",
    logout: "Logout",
    email: "Email",
    phone: "Phone",
    role: "Role",
    editProfile: "Edit Profile",
    deleteProfile: "Delete Profile",
    close: "Close",
    saveChanges: "Save Changes",
    cancel: "Cancel",
    adminOptions: "Admin Options",
    language: "Language",
  },
  hi: {
    dashboard: "डैशबोर्ड",
    profile: "प्रोफ़ाइल",
    logout: "लॉग आउट",
    email: "ईमेल",
    phone: "फ़ोन",
    role: "भूमिका",
    editProfile: "प्रोफ़ाइल संपादित करें",
    deleteProfile: "प्रोफ़ाइल हटाएं",
    close: "बंद करें",
    saveChanges: "परिवर्तन सहेजें",
    cancel: "रद्द करें",
    adminOptions: "व्यवस्थापक विकल्प",
    language: "भाषा",
  },
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(localStorage.getItem("appLanguage") || "en");

  useEffect(() => {
    localStorage.setItem("appLanguage", language);
  }, [language]);

  const toggleLanguage = () => {
    setLanguage((prevLang) => (prevLang === "en" ? "hi" : "en"));
  };

  return (
    <LanguageContext.Provider value={{ language, translations: translations[language], toggleLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
