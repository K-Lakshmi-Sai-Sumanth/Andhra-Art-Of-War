"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { getTranslation, translations, defaultLanguage } from "@/i18n";

const LanguageContext = createContext({
  language: "en", // "en" | "te"
  setLanguage: () => { },
  toggleLanguage: () => { },
  isTelugu: false,
  t: (path, fallback) => fallback || path,
  dict: translations.en,
});

export function LanguageProvider({ children }) {
  const [language, setLanguageState] = useState("en");

  // Load language preference from localStorage on client mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem("andhra_art_of_war_lang");
      if (saved === "en" || saved === "te") {
        setLanguageState(saved);
      }
    } catch (e) {
      // Ignore localStorage errors
    }
  }, []);

  const setLanguage = (newLang) => {
    if (newLang === "en" || newLang === "te") {
      setLanguageState(newLang);
      try {
        localStorage.setItem("andhra_art_of_war_lang", newLang);
      } catch (e) { }
    }
  };

  const toggleLanguage = () => {
    setLanguageState((prev) => {
      const next = prev === "en" ? "te" : "en";
      try {
        localStorage.setItem("andhra_art_of_war_lang", next);
      } catch (e) { }
      return next;
    });
  };

  const t = useCallback(
    (path, fallback = "") => {
      return getTranslation(language, path, fallback);
    },
    [language]
  );

  const dict = translations[language] || translations[defaultLanguage];

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        toggleLanguage,
        isTelugu: language === "te",
        t,
        dict,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
