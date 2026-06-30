"use client";
import { useThemeContext } from "./ThemeProvider";
import { Check } from "lucide-react";

const ACCENTS = [
  { value: "violet" as const, label: "Violet", class: "bg-violet-500" },
  { value: "blue" as const, label: "Blue", class: "bg-blue-500" },
  { value: "emerald" as const, label: "Emerald", class: "bg-emerald-500" },
  { value: "amber" as const, label: "Amber", class: "bg-amber-500" },
  { value: "rose" as const, label: "Rose", class: "bg-rose-500" },
];

export function AccentColorPicker() {
  const { accent, setAccent } = useThemeContext();

  return (
    <div className="flex gap-2">
      {ACCENTS.map((a) => (
        <button
          key={a.value}
          onClick={() => setAccent(a.value)}
          className={`w-8 h-8 rounded-full ${a.class} flex items-center justify-center transition-transform hover:scale-110 ${
            accent === a.value ? "ring-2 ring-white ring-offset-2 ring-offset-[#07081a]" : ""
          }`}
          title={a.label}
        >
          {accent === a.value && <Check size={14} className="text-white" />}
        </button>
      ))}
    </div>
  );
}
