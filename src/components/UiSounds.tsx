import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  PropsWithChildren,
} from "react";
import { useSettings } from "@/contexts/SettingsContext";

export type UiSoundKey = "click" | "hover" | "nav" | "cardhover" | "cardclick";

type UiSoundsContextType = {
  play: (key: UiSoundKey) => void;
  enabled: boolean;
  volume: number; // 0..1
};

type SoundsMap = Partial<Record<UiSoundKey, string>>;

interface UiSoundsProps {
  sounds?: SoundsMap; // optional overrides
  poolSize?: number; // default 4
  masterGain?: number;
}

const DEFAULT_SOUNDS: Record<UiSoundKey, string> = {
  click: "/audio/click.wav",
  hover: "/audio/hover.wav",
  nav: "/audio/nav.wav",
  cardhover: "/audio/hover.wav",
  cardclick: "/audio/xp.wav",
};

const UiSoundsContext = createContext<UiSoundsContextType | null>(null);

export default function UiSounds({
  children,
  sounds,
  poolSize = 4,
  masterGain = 0.05,
}: PropsWithChildren<UiSoundsProps>) {
  const { settings } = useSettings();

  // tolerate different settings shapes
  const audio: any = (settings as any)?.audio ?? {};
  const enabled: boolean =
    typeof audio?.ui?.enabled === "boolean"
      ? audio.ui.enabled
      : typeof audio?.uiSounds === "boolean"
      ? audio.uiSounds
      : true;

  const rawVol =
    typeof audio?.ui?.volume === "number"
      ? audio.ui.volume
      : typeof audio?.uiVolume === "number"
      ? audio.uiVolume
      : 1;

  const volume = Math.max(0, Math.min(1, rawVol * masterGain));
  const resolved = useMemo(
    () => ({ ...DEFAULT_SOUNDS, ...(sounds ?? {}) }),
    [sounds]
  );

  // pools for overlap + indices
  const poolsRef = useRef<Record<UiSoundKey, HTMLAudioElement[]>>({} as any);
  const idxRef = useRef<Record<UiSoundKey, number>>({} as any);
  const interactedRef = useRef(false);

  // (re)build pools
  useEffect(() => {
    Object.values(poolsRef.current).forEach((arr) =>
      arr?.forEach((a) => {
        try {
          a.pause();
        } catch {}
      })
    );
    poolsRef.current = {} as any;
    idxRef.current = {} as any;

    (Object.keys(resolved) as UiSoundKey[]).forEach((k) => {
      const src = resolved[k];
      if (!src) return;
      const pool: HTMLAudioElement[] = [];
      for (let i = 0; i < poolSize; i++) {
        const a = new Audio(src);
        a.preload = "auto";
        pool.push(a);
      }
      poolsRef.current[k] = pool;
      idxRef.current[k] = 0;
    });

    console.log("[AUDIO][UI] pools init", {
      keys: Object.keys(resolved),
      poolSize,
    });
    return () => {
      Object.values(poolsRef.current).forEach((arr) =>
        arr?.forEach((a) => {
          try {
            a.pause();
          } catch {}
        })
      );
    };
  }, [resolved, poolSize]);

  // unlock after first user interaction (autoplay policy)
  useEffect(() => {
    const unlock = () => {
      interactedRef.current = true;
      window.removeEventListener("pointerdown", unlock);
      window.removeEventListener("keydown", unlock);
      console.log("[AUDIO][UI] unlocked");
    };
    window.addEventListener("pointerdown", unlock, { once: true });
    window.addEventListener("keydown", unlock, { once: true });
    return () => {
      window.removeEventListener("pointerdown", unlock);
      window.removeEventListener("keydown", unlock);
    };
  }, []);

  const play = useCallback(
    (key: UiSoundKey) => {
      if (!enabled || volume <= 0) return;
      if (!interactedRef.current) return;

      const pool = poolsRef.current[key];
      if (!pool || pool.length === 0) return;

      const next = (idxRef.current[key] =
        (idxRef.current[key] + 1) % pool.length);
      const el = pool[next];

      try {
        el.pause();
        el.currentTime = 0;
        el.volume = volume;
        el.play().catch(() => {});
      } catch {}
    },
    [enabled, volume]
  );

  const value = useMemo<UiSoundsContextType>(
    () => ({ play, enabled, volume }),
    [play, enabled, volume]
  );

  // IMPORTANT: wrap children so the whole app is inside the provider
  return (
    <UiSoundsContext.Provider value={value}>
      {children}
    </UiSoundsContext.Provider>
  );
}

export function useUiSounds(): UiSoundsContextType {
  const ctx = useContext(UiSoundsContext);
  if (!ctx) throw new Error("useUiSounds must be used within UiSounds");
  return ctx;
}
