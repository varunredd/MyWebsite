// src/contexts/SettingsContext.tsx
import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { ACCENTS } from "@/theme/palette";

/* ======================
   Types & Defaults
====================== */

export interface Settings {
  version: number;
  general: {
    language: string;
    timeFormat: "12h" | "24h";
  };
  appearance: {
    theme: "dark" | "light" | "system";
    accent: "cyan" | "purple" | "pink" | "green";
    /** normalized multiplier (0.8–1.6). 1.0 = 100% */
    fontScale: number;
    highContrast: boolean;
  };
  audio: {
    uiSounds: boolean;
    bgm: {
      enabled: boolean;
      volume: number; // 0..1
    };
  };
  motion: {
    reduceMotion: "system" | "enabled" | "disabled";
    keyboardAid: boolean;
    colorblindAid: boolean;
  };
  game: {
    showHud: boolean;
  };
  notifications: {
    toasts: boolean;
    blogReminders: "off" | "daily" | "weekly";
  };
}

const defaultSettings: Settings = {
  version: 1,
  general: { language: "en", timeFormat: "24h" },
  appearance: {
    theme: "system",
    accent: "green",
    fontScale: 1.0, // normalized
    highContrast: false,
  },
  audio: {
    uiSounds: false,
    bgm: { enabled: false, volume: 0.4 },
  },
  motion: {
    reduceMotion: "system",
    keyboardAid: true,
    colorblindAid: false,
  },
  game: { showHud: true },
  notifications: { toasts: true, blogReminders: "off" },
};

interface SettingsContextType {
  settings: Settings;
  updateSettings: (path: string, value: any) => void;
  resetSettings: () => void;
  exportSettings: () => string;
  importSettings: (data: string) => boolean;
}

const SettingsContext = createContext<SettingsContextType | undefined>(
  undefined
);

const STORAGE_KEY = "vrg.settings.v1";

/* ======================
   Helpers
====================== */

const clamp = (v: number, min: number, max: number) =>
  Math.min(max, Math.max(min, v));

const migrateAccent = (a: string): Settings["appearance"]["accent"] => {
  // If it's already one of the new tokens, keep it.
  if (a === "cyan" || a === "purple" || a === "pink" || a === "green") {
    return a;
  }
  // Map old tokens to the new set.
  if (a === "teal") return "cyan";
  if (a === "red") return "pink";
  if (a === "lime") return "green";
  if (a === "violet") return "purple";
  // Fallback
  return "green";
};

// old integer scale (-1..2) → normalized (0.8..1.6). If already normalized, just clamp
const normalizeFontScale = (raw: unknown): number => {
  const n = Number(raw);
  if (!Number.isFinite(n)) return 1.0;
  // if looks like the old integer scale, convert
  if (n >= -1 && n <= 2 && Number.isInteger(n)) {
    return clamp(1 + n * 0.1, 0.8, 1.6);
  }
  // assume normalized already
  return clamp(n, 0.8, 1.6);
};

const hexToRgb = (h: string) => {
  const s = h.replace("#", "");
  const n =
    s.length === 3
      ? s
          .split("")
          .map((c) => c + c)
          .join("")
      : s;
  const r = parseInt(n.slice(0, 2), 16);
  const g = parseInt(n.slice(2, 4), 16);
  const b = parseInt(n.slice(4, 6), 16);
  return { r, g, b };
};

const rgbToHsl = (r: number, g: number, b: number) => {
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b),
    min = Math.min(r, g, b);
  let h = 0,
    s = 0,
    l = (max + min) / 2;
  const d = max - min;
  if (d) {
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h *= 60;
  }
  return { h: Math.round(h), s: Math.round(s * 100), l: Math.round(l * 100) };
};

/* ======================
   Apply settings to DOM
====================== */

const applySettingsToDOM = (settings: Settings) => {
  const root = document.documentElement;

  // Theme (respect system)
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const effective =
    settings.appearance.theme === "system"
      ? prefersDark
        ? "dark"
        : "light"
      : settings.appearance.theme;

  if (effective === "dark") {
    // root.classList.toggle("dark", effective === "dark");
    root.classList.add("dark");
  } else {
    // root.setAttribute("data-theme", effective);
    root.classList.remove("dark");
  }

  console.log("[THEME]", {
    selected: settings.appearance.theme,
    effective,
    htmlClass: root.className,
  });

  // Accent → shadcn primary tokens
  const hex = ACCENTS[settings.appearance.accent];
  const { r, g, b } = hexToRgb(hex);
  const { h, s, l } = rgbToHsl(r, g, b);

  root.setAttribute("data-accent", settings.appearance.accent);
  root.style.setProperty("--accent", `${h} ${s}% ${l}%`);
  root.style.setProperty(
    "--accent-foreground",
    l < 55 ? "0 0% 100%" : "222.2 84% 4.9%"
  );

  root.style.setProperty("--accent-rgb", `${r} ${g} ${b}`);
  root.style.setProperty("--primary", `${h} ${s}% ${l}%`);

  root.style.setProperty(
    "--primary-foreground",
    l < 55 ? "0 0% 100%" : "222.2 84% 4.9%"
  );

  // Font scale (normalized multiplier)
  const mult = clamp(settings.appearance.fontScale || 1, 0.8, 1.6);
  root.style.setProperty("font-size", `${16 * mult}px`);
  root.style.setProperty("--font-scale", String(mult));

  // Accessibility flags
  root.setAttribute(
    "data-high-contrast",
    String(settings.appearance.highContrast)
  );

  const reduceMotion =
    settings.motion.reduceMotion === "enabled" ||
    (settings.motion.reduceMotion === "system" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  root.setAttribute("data-reduce-motion", String(reduceMotion));
  root.setAttribute("data-keyboard-aid", String(settings.motion.keyboardAid));
  root.setAttribute(
    "data-colorblind-aid",
    String(settings.motion.colorblindAid)
  );
};

/* ======================
   Provider
====================== */

export const SettingsProvider = ({ children }: { children: ReactNode }) => {
  const [settings, setSettings] = useState<Settings>(defaultSettings);

  // Initial load & migration
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) || {};
        // Migrate/normalize BEFORE merge
        if (parsed.appearance) {
          if (parsed.appearance.accent) {
            parsed.appearance.accent = migrateAccent(parsed.appearance.accent);
          }
          if (parsed.appearance.fontScale !== undefined) {
            parsed.appearance.fontScale = normalizeFontScale(
              parsed.appearance.fontScale
            );
          }
        }
        // Deep merge with defaults
        const merged: Settings = {
          ...defaultSettings,
          ...parsed,
          general: { ...defaultSettings.general, ...parsed.general },
          appearance: { ...defaultSettings.appearance, ...parsed.appearance },
          audio: {
            ...defaultSettings.audio,
            ...parsed.audio,
            bgm: {
              ...defaultSettings.audio.bgm,
              ...(parsed.audio?.bgm || {}),
            },
          },
          motion: { ...defaultSettings.motion, ...parsed.motion },
          game: { ...defaultSettings.game, ...parsed.game },
          notifications: {
            ...defaultSettings.notifications,
            ...parsed.notifications,
          },
        };

        setSettings(merged);
        applySettingsToDOM(merged);
      } else {
        applySettingsToDOM(defaultSettings);
      }
    } catch (error) {
      console.warn("Failed to load settings, using defaults:", error);
      applySettingsToDOM(defaultSettings);
    }
  }, []);

  // Re-apply on system theme change if user chose system
  useEffect(() => {
    if (settings.appearance.theme !== "system") return;
    const mql = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = () => applySettingsToDOM(settings);
    mql.addEventListener?.("change", handler);
    return () => mql.removeEventListener?.("change", handler);
  }, [settings]);

  useEffect(() => {
    applySettingsToDOM(settings);
  }, [
    settings.appearance.theme,
    settings.appearance.accent,
    settings.appearance.fontScale,
    settings.appearance.highContrast,
    settings.motion.reduceMotion,
    settings.motion.keyboardAid,
    settings.motion.colorblindAid,
  ]);

  const updateSettings = (path: string, value: any) => {
    setSettings((prev) => {
      // deep clone (shallow is enough for our structure)
      const next: Settings = JSON.parse(JSON.stringify(prev));
      const keys = path.split(".");
      let curr: any = next;
      for (let i = 0; i < keys.length - 1; i++) {
        curr = curr[keys[i]];
      }
      curr[keys[keys.length - 1]] = value;

      // normalize if we updated known fields
      if (path === "appearance.accent") {
        next.appearance.accent = migrateAccent(value);
      }
      if (path === "appearance.fontScale") {
        next.appearance.fontScale = normalizeFontScale(value);
      }

      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      applySettingsToDOM(next);
      return next;
    });
  };

  const resetSettings = () => {
    setSettings(defaultSettings);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultSettings));
    applySettingsToDOM(defaultSettings);
  };

  const exportSettings = (): string => JSON.stringify(settings, null, 2);

  const importSettings = (data: string): boolean => {
    try {
      const imported = JSON.parse(data);
      if (!imported || typeof imported !== "object" || !imported.version) {
        return false;
      }
      // migrate & normalize
      if (imported.appearance?.accent) {
        imported.appearance.accent = migrateAccent(imported.appearance.accent);
      }
      if (imported.appearance?.fontScale !== undefined) {
        imported.appearance.fontScale = normalizeFontScale(
          imported.appearance.fontScale
        );
      }
      // deep merge
      const merged: Settings = {
        ...defaultSettings,
        ...imported,
        general: { ...defaultSettings.general, ...imported.general },
        appearance: { ...defaultSettings.appearance, ...imported.appearance },
        audio: {
          ...defaultSettings.audio,
          ...imported.audio,
          bgm: {
            ...defaultSettings.audio.bgm,
            ...(imported.audio?.bgm || {}),
          },
        },
        motion: { ...defaultSettings.motion, ...imported.motion },
        game: { ...defaultSettings.game, ...imported.game },
        notifications: {
          ...defaultSettings.notifications,
          ...imported.notifications,
        },
      };

      setSettings(merged);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
      applySettingsToDOM(merged);
      return true;
    } catch {
      return false;
    }
  };

  return (
    <SettingsContext.Provider
      value={{
        settings,
        updateSettings,
        resetSettings,
        exportSettings,
        importSettings,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

/* ======================
   Hook
====================== */

export const useSettings = () => {
  const ctx = useContext(SettingsContext);
  if (!ctx)
    throw new Error("useSettings must be used within a SettingsProvider");
  return ctx;
};
