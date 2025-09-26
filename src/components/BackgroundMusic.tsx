import { useEffect, useMemo, useRef } from "react";
import { useLocation } from "react-router-dom";
import { useAudioSettings } from "@/context/AudioSettingsContext";

type RouteRule = {
  /** Exact path or RegExp to match routes */
  match: string | RegExp;
  /** Audio URL for that route */
  url: string;
};

interface BackgroundMusicProps {
  /** Back-compat: default home track (used if `rules` not provided) */
  url?: string;
  /** Route-aware rules: if provided, overrides `url` mode */
  rules?: RouteRule[];
}

function pathMatches(pathname: string, match: string | RegExp): boolean {
  return typeof match === "string" ? pathname === match : match.test(pathname);
}

export default function BackgroundMusic({ url, rules }: BackgroundMusicProps) {
  const { pathname } = useLocation();
  const { bgmEnabled, bgmMuted, bgmVolume } = useAudioSettings();

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const currentUrlRef = useRef<string | null>(null);

  // Init once
  if (!audioRef.current) {
    const el = new Audio();
    el.loop = true;
    el.preload = "auto";
    audioRef.current = el;
    console.log("[AUDIO] init");
  }

  // Decide which track (if any) should play on this route
  const chosenUrl = useMemo(() => {
    if (rules && rules.length) {
      for (const r of rules) {
        if (pathMatches(pathname, r.match)) return r.url;
      }
      return null; // no rule for this route
    }
    // Back-compat mode: only play on "/" or "/home" using single `url`
    const isHome = pathname === "/" || pathname === "/home";
    return isHome ? url ?? null : null;
  }, [pathname, rules, url]);

  useEffect(() => {
    const el = audioRef.current!;
    const allowed = bgmEnabled && !bgmMuted && bgmVolume > 0 && !!chosenUrl;

    console.log("[AUDIO] gate", {
      pathname,
      chosenUrl,
      bgmEnabled,
      bgmMuted,
      bgmVolume,
      allowed,
    });

    if (!allowed) {
      if (!el.paused) {
        console.log("[AUDIO] stop");
        el.pause();
        el.currentTime = 0;
        currentUrlRef.current = null;
      }
      return;
    }

    // Ensure correct track is loaded
    if (currentUrlRef.current !== chosenUrl) {
      el.src = chosenUrl!;
      currentUrlRef.current = chosenUrl!;
      console.log("[AUDIO] track set", { src: chosenUrl });
    }

    // Apply settings
    el.volume = Math.max(0, Math.min(1, bgmVolume));
    el.muted = !!bgmMuted;

    // Play if paused
    if (el.paused) {
      el.play()
        .then(() =>
          console.log("[AUDIO] play", {
            pathname,
            vol: el.volume,
            muted: el.muted,
          })
        )
        .catch((e) => console.warn("[AUDIO] play blocked (autoplay)", e));
    } else {
      console.log("[AUDIO] volume/mute apply", {
        vol: el.volume,
        muted: el.muted,
      });
    }
  }, [pathname, chosenUrl, bgmEnabled, bgmMuted, bgmVolume]);

  useEffect(() => {
    return () => {
      try {
        audioRef.current?.pause();
      } catch {}
      console.log("[AUDIO] unmount");
    };
  }, []);

  return null;
}
