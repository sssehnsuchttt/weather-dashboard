import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import ru from "./locales/ru_RU.json";
import en from "./locales/en_US.json";
import de from "./locales/de_DE.json";
import es from "./locales/es_ES.json";
import fr from "./locales/fr_FR.json";
import zh from "./locales/zh_CN.json";
// import ar from "./locales/ar_SA.json";

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      ru: { translation: ru },
      en: { translation: en },
      de: { translation: de },
      es: { translation: es },
      fr: { translation: fr },
      zh: { translation: zh },
      // ar: { translation: ar },
    },
    fallbackLng: "en",
    detection: {
      order: ["localStorage", "navigator"],
      caches: ["localStorage"],
    },
    interpolation: { escapeValue: false },
  });

export default i18n;
