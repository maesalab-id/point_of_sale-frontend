import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "./resources/en";
import id from "./resources/id";

i18n.use(initReactI18next).init({
  // debug: true,
  lng: window.localStorage.getItem("lang"),
  // fallbackLng: "en",
  interpolation: {
    escapeValue: false,
  },
  resources: {
    en,
    id,
  },
});

export default i18n;
