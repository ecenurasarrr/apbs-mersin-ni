"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { translations, Language } from "../config/translations";

interface LanguageContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  // A simple translation function. Use 'section.key' formatting
  t: (keyPath: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Language>("tr");

  // Load language from localStorage if available
  useEffect(() => {
    const savedLang = localStorage.getItem("apbs-lang");
    if (savedLang === "en" || savedLang === "tr") {
      setLangState(savedLang);
    }
  }, []);

  const setLang = (newLang: Language) => {
    setLangState(newLang);
    localStorage.setItem("apbs-lang", newLang);
  };

  const t = (keyPath: string): string => {
    try {
      const keys = keyPath.split(".");
      let current: any = translations[lang];
      for (const key of keys) {
        if (current[key] === undefined) {
          // Fallback to TR if missing
          let fallback: any = translations["tr"];
          for (const k of keys) fallback = fallback[k];
          return fallback || keyPath;
        }
        current = current[key];
      }
      return current;
    } catch {
      return keyPath;
    }
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
