"use client";
import { createContext, useContext, useEffect, useState, useCallback } from "react";

export type Theme = "dark" | "light";
type AccentColor = "violet" | "blue" | "emerald" | "amber" | "rose";

interface ThemeContextValue {
  theme: Theme;
  accent: AccentColor;
  setTheme: (t: Theme) => void;
  setAccent: (c: AccentColor) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue>({
  theme: "dark",
  accent: "violet",
  setTheme: () => {},
  setAccent: () => {},
  toggleTheme: () => {},
});

export function ThemeProvider({ children, defaultTheme = "dark" }: { children: React.ReactNode; defaultTheme?: Theme }) {
  const [theme, setThemeState] = useState<Theme>(defaultTheme);
  const [accent, setAccentState] = useState<AccentColor>("violet");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const stored = localStorage.getItem("nexora-theme") as Theme | null;
    if (stored) setThemeState(stored);
    const storedAccent = localStorage.getItem("nexora-accent") as AccentColor | null;
    if (storedAccent) setAccentState(storedAccent);
  }, []);

  const setTheme = useCallback((t: Theme) => {
    setThemeState(t);
    localStorage.setItem("nexora-theme", t);
  }, []);

  const setAccent = useCallback((c: AccentColor) => {
    setAccentState(c);
    localStorage.setItem("nexora-accent", c);
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme(theme === "dark" ? "light" : "dark");
  }, [theme, setTheme]);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove("dark", "light");
    root.classList.add(theme);
    root.setAttribute("data-accent", accent);
  }, [theme, accent]);

  if (!mounted) return <>{children}</>;

  return (
    <ThemeContext.Provider value={{ theme, accent, setTheme, setAccent, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useThemeContext = () => useContext(ThemeContext);
