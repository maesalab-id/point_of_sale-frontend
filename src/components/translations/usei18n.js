import { useCallback, useMemo } from "react";
import i18n from "./i18n";

export const useI18n = () => {
  const currentLang = i18n.language;

  const setLang = useCallback(async (newLanguage) => {
    await i18n.changeLanguage(newLanguage);
    window.localStorage.setItem("lang", newLanguage);
  }, []);

  const availableLang = useMemo(() => {
    return [
      { label: "Indonesia", value: "id" },
      { label: "English", value: "en" },
    ];
  }, []);

  return { setLang, currentLang, i18n, availableLang };
};
