"use client";
import { Languages } from "lucide-react";
import { useTranslation } from "./I18nProvider";
import type { Lang } from "../i18n/translations";

const LANGUAGES: { code: Lang; label: string }[] = [
  { code: "en", label: "EN" },
  { code: "es", label: "ES" },
  { code: "fr", label: "FR" },
  { code: "de", label: "DE" },
  { code: "ja", label: "JA" },
  { code: "zh", label: "ZH" },
];

export function LanguageSwitcher() {
  const { lang, setLang } = useTranslation();

  return (
    <div className="flex items-center gap-1">
      <Languages size={13} className="text-slate-500" />
      {LANGUAGES.map((l) => (
        <button
          key={l.code}
          onClick={() => setLang(l.code)}
          className={`px-1.5 py-0.5 rounded text-[10px] font-semibold transition-all ${
            lang === l.code ? "text-violet-400 bg-violet-500/10" : "text-slate-600 hover:text-slate-400"
          }`}
        >
          {l.label}
        </button>
      ))}
    </div>
  );
}
