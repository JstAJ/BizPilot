import * as React from "react";
import { useLiveQuery } from "dexie-react-hooks";
import { db } from "@/lib/db";
import type { ThemeMode } from "@/types/settings";

interface ThemeContextValue {
  theme: ThemeMode;
  resolvedTheme: "light" | "dark";
  setTheme: (theme: ThemeMode) => Promise<void>;
}

const ThemeContext = React.createContext<ThemeContextValue | undefined>(undefined);

function applyTheme(theme: "light" | "dark") {
  const root = document.documentElement;
  root.classList.toggle("dark", theme === "dark");
  const meta = document.querySelector('meta[name="theme-color"]');
  meta?.setAttribute("content", theme === "dark" ? "#0A0A0A" : "#FAFAF7");
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const settings = useLiveQuery(() => db.appSettings.get(1), []);
  const theme = settings?.theme ?? "dark";

  const getSystemTheme = (): "light" | "dark" =>
    window.matchMedia?.("(prefers-color-scheme: dark)").matches ? "dark" : "light";

  const resolvedTheme = theme === "system" ? getSystemTheme() : theme;

  React.useEffect(() => {
    applyTheme(resolvedTheme);
  }, [resolvedTheme]);

  React.useEffect(() => {
    if (theme !== "system") return;
    const mql = window.matchMedia("(prefers-color-scheme: dark)");
    const listener = () => applyTheme(getSystemTheme());
    mql.addEventListener("change", listener);
    return () => mql.removeEventListener("change", listener);
  }, [theme]);

  const setTheme = React.useCallback(async (next: ThemeMode) => {
    await db.appSettings.update(1, { theme: next, updatedAt: Date.now() });
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, resolvedTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextValue {
  const ctx = React.useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}
