// src/components/ui/CyberpunkBgVideo.tsx
import { useEffect, useRef } from "react";

type Props = {
  /** 1 = normal, 0.5 = half speed, 0.3 = slower cruise */
  rate?: number;
};

export default function CyberpunkBgVideo({ rate = 0.02 }: Props) {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;

    const applyRate = () => {
      try {
        if (v.playbackRate !== rate) v.playbackRate = rate;
      } catch {
        /* ignore */
      }
    };

    const onReady = () => {
      applyRate();
      // enforce briefly; some browsers reset right after play/HMR
      let n = 0;
      const id = window.setInterval(() => {
        applyRate();
        if (++n > 20) window.clearInterval(id); // ~2s
      }, 100);
    };

    v.addEventListener("loadedmetadata", onReady);
    v.addEventListener("loadeddata", onReady);
    v.addEventListener("play", applyRate);
    v.addEventListener("ratechange", applyRate);

    // if already buffered
    if (v.readyState >= 2) onReady();

    return () => {
      v.removeEventListener("loadedmetadata", onReady);
      v.removeEventListener("loadeddata", onReady);
      v.removeEventListener("play", applyRate);
      v.removeEventListener("ratechange", applyRate);
    };
  }, [rate]);

  return (
    <div className="absolute inset-0 z-0 overflow-hidden">
      <video
        ref={videoRef}
        className="w-full h-full object-cover"
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        poster="/assets/cyberpunk-track-poster.jpg"
        // brighten slightly, keep a touch of contrast/sat
        style={{ filter: "brightness(.72) contrast(1.06) saturate(1.04)" }}
      >
        <source src="/assets/cyberpunk-track.webm" type="video/webm" />
        <source src="/assets/cyberpunk-track.mp4" type="video/mp4" />
      </video>

      {/* NIGHT SCRIMS (softened vs last version) */}
      <div className="pointer-events-none absolute inset-0">
        {/* global blue-black tint (lighter) */}
        <div className="absolute inset-0 mix-blend-multiply bg-[#070b14]/55" />

        {/* sky darkener (ease up 0.85 → 0.65 mid) */}
        <div className="absolute inset-0 bg-[radial-gradient(85%_70%_at_50%_18%,rgba(0,0,0,.75)_0%,rgba(0,0,0,.65)_40%,rgba(0,0,0,.45)_60%,rgba(0,0,0,.2)_80%,rgba(0,0,0,0)_100%)]" />

        {/* side vignettes (reduce edges) */}
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,.45)_0%,rgba(0,0,0,.25)_14%,rgba(0,0,0,0)_28%,rgba(0,0,0,0)_72%,rgba(0,0,0,.25)_86%,rgba(0,0,0,.45)_100%)]" />

        {/* keep car area clear (open hole a bit more) */}
        <div className="absolute inset-0 bg-[radial-gradient(42%_24%_at_50%_78%,rgba(0,0,0,0)_0%,rgba(0,0,0,0)_70%,rgba(0,0,0,.45)_100%)]" />

        {/* top/bottom fades */}
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(0,0,0,.35),transparent_30%,transparent_70%,rgba(0,0,0,.45))]" />

        {/* faint grain */}
        <div
          className="absolute inset-0 mix-blend-overlay opacity-[0.045]"
          style={{ backgroundImage: "url(/assets/noise.png)" }}
        />
      </div>
    </div>
  );
}
