// src/components/GameHUD.tsx
import { useState, useEffect, createContext, useContext } from "react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Trophy, Star, Zap } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useSettings } from "@/contexts/SettingsContext";
import {
  SessionProgress,
  loadProgress,
  saveProgress,
  resetSession,
  checkAndAwardBadges,
  initializeActivityTracking,
} from "@/utils/sessionProgress";

interface GameContextType {
  progress: SessionProgress;
  xp: number;
  level: number;
  badges: string[];
  resetProgress: () => void;
  trackExploreAction: (pageName: string) => void;
  trackCriticalAction: (actionName: string) => void;
  trackBlogRead: (slug: string) => void;
}

const GameContext = createContext<GameContextType | null>(null);

// ---- level constants/helpers ----
const XP_TO_NEXT = 1000;
const MAX_LEVEL = 10;
const levelFromXp = (xp: number) =>
  Math.min(Math.floor(xp / XP_TO_NEXT) + 1, MAX_LEVEL);

export const GameProvider = ({ children }: { children: React.ReactNode }) => {
  const { toast } = useToast();
  const { settings } = useSettings();
  const toastsEnabled = (settings as any)?.notifications?.toasts !== false; // default true

  const [progress, setProgress] = useState<SessionProgress>(() => {
    const initial = loadProgress();
    console.log("GameProvider: Loaded session progress:", initial);
    return initial;
  });

  // Initialize activity tracking once
  useEffect(() => {
    const cleanup = initializeActivityTracking();
    return cleanup;
  }, []);

  // Atomically update + persist
  const updateAndSave = (
    updater: (prev: SessionProgress) => SessionProgress
  ) => {
    setProgress((prev) => {
      const next = updater(prev);
      try {
        saveProgress(next);
      } catch (e) {
        console.warn("[Game] saveProgress failed", e);
      }
      return next;
    });
  };

  // Fire XP + optional level-up toast using a pre-update XP snapshot
  const fireXpToasts = (delta: number, reason: string, prevXp: number) => {
    if (!toastsEnabled) return;
    const before = levelFromXp(prevXp);
    const after = levelFromXp(prevXp + delta);

    toast({
      title: `+${delta} XP`,
      description: reason,
      duration: 2000,
    });

    if (after > before) {
      setTimeout(() => {
        toast({
          title: "🎉 Level Up!",
          description: `You've reached Level ${after}!`,
          duration: 4000,
        });
      }, 400);
    }
  };

  const trackExploreAction = (pageName: string) => {
    const key = `once.explore.${pageName.toLowerCase()}`;

    let awarded = false;
    let prevXpSnapshot = progress.xp;

    updateAndSave((prev) => {
      if ((prev.once as any)?.[key]) {
        console.log(`GameProvider: Already visited ${pageName} this session`);
        return prev;
      }

      awarded = true;
      prevXpSnapshot = prev.xp;

      const newXp = prev.xp + 25;
      const nextBase: SessionProgress = {
        ...prev,
        xp: newXp,
        level: levelFromXp(newXp),
        lastActivity: new Date().toISOString(),
        once: { ...prev.once, [key]: true },
      };

      console.log(`GameProvider: First visit to ${pageName}, awarded 25 XP`);
      return checkAndAwardBadges(nextBase);
    });

    if (awarded) fireXpToasts(25, `First visit to ${pageName}`, prevXpSnapshot);
  };

  const trackCriticalAction = (actionName: string) => {
    const key = `once.critical.${actionName
      .toLowerCase()
      .replace(/\s+/g, ".")}`;
    let reward = 100;
    const a = actionName.toLowerCase();
    if (a.includes("download")) reward = 150;
    if (a.includes("portal") || a.includes("contact")) reward = 200;

    let awarded = false;
    let prevXpSnapshot = progress.xp;

    updateAndSave((prev) => {
      if ((prev.once as any)?.[key]) {
        console.log(
          `GameProvider: Already performed ${actionName} this session`
        );
        return prev;
      }

      awarded = true;
      prevXpSnapshot = prev.xp;

      const newXp = prev.xp + reward;
      const nextBase: SessionProgress = {
        ...prev,
        xp: newXp,
        level: levelFromXp(newXp),
        lastActivity: new Date().toISOString(),
        once: { ...prev.once, [key]: true },
      };

      console.log(
        `GameProvider: First time performing ${actionName}, awarded ${reward} XP`
      );
      return checkAndAwardBadges(nextBase);
    });

    if (awarded)
      fireXpToasts(reward, `Critical action: ${actionName}`, prevXpSnapshot);
  };

  const trackBlogRead = (slug: string) => {
    let awarded = false;
    let prevXpSnapshot = progress.xp;

    updateAndSave((prev) => {
      if (prev.blogRead.includes(slug)) {
        return prev;
      }

      awarded = true;
      prevXpSnapshot = prev.xp;

      const newXp = prev.xp + 50;
      const nextBase: SessionProgress = {
        ...prev,
        blogRead: [...prev.blogRead, slug],
        xp: newXp,
        level: levelFromXp(newXp),
        lastActivity: new Date().toISOString(),
      };

      console.log(`GameProvider: Read blog post ${slug}, awarded 50 XP`);
      return checkAndAwardBadges(nextBase);
    });

    if (awarded) fireXpToasts(50, "Read blog post", prevXpSnapshot);
  };

  const resetProgress = () => {
    const fresh = resetSession();
    setProgress(fresh);
    saveProgress(fresh);
    console.log("GameProvider: Progress reset, new session created");
  };

  return (
    <GameContext.Provider
      value={{
        progress,
        xp: progress.xp,
        level: progress.level,
        badges: progress.badges,
        resetProgress,
        trackExploreAction,
        trackCriticalAction,
        trackBlogRead,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export const useGameState = () => {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error("useGameState must be used within a GameProvider");
  return ctx;
};

// ---------------- HUD ----------------

// ---------------- HUD ----------------

export const GameHUD = () => {
  const { progress, xp, level, badges } = useGameState();
  const [visible, setVisible] = useState(false);
  const [prevXp, setPrevXp] = useState(xp);

  // Show HUD for 4 seconds whenever XP changes
  useEffect(() => {
    if (xp !== prevXp) {
      setVisible(true);
      setPrevXp(xp);
      const timer = setTimeout(() => setVisible(false), 4000);
      return () => clearTimeout(timer);
    }
  }, [xp, prevXp]);

  const currentLevelXP = level >= MAX_LEVEL ? XP_TO_NEXT : xp % XP_TO_NEXT;
  const progressPct =
    level >= MAX_LEVEL ? 100 : (currentLevelXP / XP_TO_NEXT) * 100;

  return (
    <div
      className={`
        fixed top-3 sm:top-4 z-40
        transition-all duration-500 ease-in-out
        ${visible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8 pointer-events-none"}
      `}
      style={{ right: "max(0.75rem, calc((100vw - 1200px) / 2 - 200px))" }}
    >
      <div
        className="
          min-w-[180px] rounded-2xl
          border border-card-border/50
          bg-background/85 backdrop-blur-xl
          shadow-[0_12px_40px_rgba(0,0,0,.28)]
          px-3.5 py-3 space-y-2.5
        "
      >
        {/* Header */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Star className="w-4 h-4 text-warning" />
            <span className="text-[13px] font-mono font-semibold leading-none">
              Level {level}
            </span>
          </div>
          <div className="text-[11px] leading-none text-muted-foreground font-mono">
            #{progress.sessionId.slice(-4)}
          </div>
        </div>

        {/* Progress */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-[11px] font-mono text-muted-foreground">
            <span>XP</span>
            <span className="tabular-nums text-foreground/90">
              {level >= MAX_LEVEL ? "MAX" : `${currentLevelXP}/${XP_TO_NEXT}`}
            </span>
          </div>
          <Progress className="h-1.5 rounded-full" value={progressPct} />
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 gap-3 text-[12px]">
          <div className="flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-primary" />
            <span className="font-mono tabular-nums">{xp}</span>
          </div>
          <div className="flex items-center gap-1.5 justify-end">
            <Trophy className="w-3.5 h-3.5 text-warning" />
            <span className="font-mono tabular-nums">{badges.length}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
