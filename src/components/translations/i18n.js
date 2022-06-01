import i18n from "i18next";
import Backend from "i18next-http-backend";
import { initReactI18next } from "react-i18next";
import en from "./resources/en";
import id from "./resources/id";

const isDev = process.env.NODE_ENV === "development";

i18n
  .use(Backend)
  .use(initReactI18next)
  .init({
    debug: isDev,
    lng: window.localStorage.getItem("lang") || "en",
    fallbackLng: isDev ? undefined : "en",
    interpolation: {
      escapeValue: false,
    },
    resources: {
      en,
      id,
    },
  });

export default i18n;
