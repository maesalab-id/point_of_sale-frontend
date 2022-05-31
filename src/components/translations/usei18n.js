import { useCallback, useMemo } from "react";
import i18n from "./i18n";

export const useI18n = () => {
  const currentLang = useMemo(() => {

    return i18n.language;
  }, [i18n.language]);

  const setLang = useCallback(async (newLanguage) => {
    await i18n.changeLanguage(newLanguage);
    window.localStorage.setItem("lang", newLanguage);
  }, []);

  return { setLang, currentLang, i18n };
};
