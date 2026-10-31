import en from "./locales/en.json";
import te from "./locales/te.json";

export const translations = {
  en,
  te,
};

export const defaultLanguage = "en";
export const supportedLanguages = ["en", "te"];

/**
 * Look up nested translation key (e.g., 'home.hero.title')
 * Gracefully falls back to English, then to provided fallback or key path.
 */
export function getTranslation(lang, path, fallback = "") {
  if (!path) return fallback;
  const keys = path.split(".");

  // 1. Try specified language
  let current = translations[lang] || translations[defaultLanguage];
  let found = true;
  for (const k of keys) {
    if (current && typeof current === "object" && k in current) {
      current = current[k];
    } else {
      found = false;
      break;
    }
  }
  if (found && current !== undefined) {
    return current;
  }

  // 2. Fall back to English
  if (lang !== "en") {
    let fallbackCurrent = translations.en;
    let fallbackFound = true;
    for (const fk of keys) {
      if (fallbackCurrent && typeof fallbackCurrent === "object" && fk in fallbackCurrent) {
        fallbackCurrent = fallbackCurrent[fk];
      } else {
        fallbackFound = false;
        break;
      }
    }
    if (fallbackFound && fallbackCurrent !== undefined) {
      return fallbackCurrent;
    }
  }

  return fallback || path;
}
