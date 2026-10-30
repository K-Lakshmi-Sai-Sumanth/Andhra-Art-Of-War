"use client";

import React, { createContext, useContext, useState } from "react";

const LanguageContext = createContext({
  language: "en", // "en" | "te"
  toggleLanguage: () => {},
  isTelugu: false,
});

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState("en");

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === "en" ? "te" : "en"));
  };

  return (
    <LanguageContext.Provider
      value={{
        language,
        toggleLanguage,
        isTelugu: language === "te",
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
