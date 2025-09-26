import React, { createContext, useContext, useMemo, useCallback } from "react";
import { useSettings } from "@/contexts/SettingsContext";
import { AccentToken } from "@/theme/palette";

type ThemeMode = "light" | "dark" | "system";

interface ThemeSettingsContextType {
  themeMode: ThemeMode;
  effectiveTheme: "light" | "dark";
  accent: AccentToken | string;
  fontScale: number;
  highContrast: boolean;
  setThemeMode: (m: ThemeMode) => void;
  setAccent: (v: AccentToken | string) => void;
  setFontScale: (v: number) => void;
  setHighContrast: (v: boolean) => void;
}

const ThemeSettingsContext = createContext<
  ThemeSettingsContextType | undefined
>(undefined);

export const ThemeSettingsProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { settings, updateSettings } = useSettings();

  const themeMode = settings.appearance.theme as ThemeMode;
  const accent = settings.appearance.accent as AccentToken | string;
  const fontScale = settings.appearance.fontScale ?? 1.0;
  const highContrast = settings.appearance.highContrast ?? false;

  const effectiveTheme: "light" | "dark" = useMemo(() => {
    if (themeMode !== "system") return themeMode;
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  }, [themeMode]);

  const setThemeMode = useCallback(
    (v: ThemeMode) => updateSettings("appearance.theme", v),
    [updateSettings]
  );
  const setAccent = useCallback(
    (v: AccentToken | string) => updateSettings("appearance.accent", v),
    [updateSettings]
  );
  const setFontScale = useCallback(
    (v: number) =>
      updateSettings("appearance.fontScale", Math.max(0.8, Math.min(1.6, v))),
    [updateSettings]
  );
  const setHighContrast = useCallback(
    (v: boolean) => updateSettings("appearance.highContrast", v),
    [updateSettings]
  );

  return (
    <ThemeSettingsContext.Provider
      value={{
        themeMode,
        effectiveTheme,
        accent,
        fontScale,
        highContrast,
        setThemeMode,
        setAccent,
        setFontScale,
        setHighContrast,
      }}
    >
      {children}
    </ThemeSettingsContext.Provider>
  );
};

export const useThemeSettings = () => {
  const ctx = useContext(ThemeSettingsContext);
  if (!ctx)
    throw new Error(
      "useThemeSettings must be used within a ThemeSettingsProvider"
    );
  return ctx;
};
