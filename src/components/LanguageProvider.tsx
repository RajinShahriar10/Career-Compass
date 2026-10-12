"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { Lang } from "@/lib/types";

interface LangContextValue {
  lang: Lang;
  setLang: (lang: Lang) => void;
  pick: (bn: string, en: string) => string;
}

const LangContext = createContext<LangContextValue | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("bn");

  useEffect(() => {
    const saved = window.localStorage.getItem("skillsetu_lang");
    if (saved === "bn" || saved === "en") setLangState(saved);
  }, []);

  const setLang = useCallback((next: Lang) => {
    setLangState(next);
    window.localStorage.setItem("skillsetu_lang", next);
  }, []);

  const pick = useCallback(
    (bn: string, en: string) => (lang === "bn" ? bn : en),
    [lang]
  );

  const value = useMemo(
    () => ({ lang, setLang, pick }),
    [lang, setLang, pick]
  );

  return <LangContext.Provider value={value}>{children}</LangContext.Provider>;
}

export function useLang() {
  const ctx = useContext(LangContext);
  if (!ctx) throw new Error("useLang must be used inside LanguageProvider");
  return ctx;
}
