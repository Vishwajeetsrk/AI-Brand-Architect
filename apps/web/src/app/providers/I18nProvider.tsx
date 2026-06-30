"use client";
import { createContext, useContext, useState, useCallback, useEffect } from "react";
import { t, type Lang } from "../i18n/translations";

interface I18nContextValue {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: string, params?: Record<string, string>) => string;
}

const I18nContext = createContext<I18nContextValue>({
  lang: "en",
  setLang: () => {},
  t: (key: string) => key,
});

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en");

  useEffect(() => {
    const stored = localStorage.getItem("nexora-lang") as Lang | null;
    if (stored) setLangState(stored);
  }, []);

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    localStorage.setItem("nexora-lang", l);
    document.documentElement.lang = l;
  }, []);

  const translate = useCallback((key: string, params?: Record<string, string>) => {
    return t(key, lang, params);
  }, [lang]);

  return (
    <I18nContext.Provider value={{ lang, setLang, t: translate }}>
      {children}
    </I18nContext.Provider>
  );
}

export const useTranslation = () => useContext(I18nContext);
