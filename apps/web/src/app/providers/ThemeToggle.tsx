"use client";
import { Moon, Sun } from "lucide-react";
import { useThemeContext } from "./ThemeProvider";

export function ThemeToggle() {
  const { theme, toggleTheme } = useThemeContext();

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-lg text-slate-500 hover:text-slate-300 hover:bg-white/5 transition-all"
      title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
    >
      {theme === "dark" ? <Sun size={15} /> : <Moon size={15} />}
    </button>
  );
}
