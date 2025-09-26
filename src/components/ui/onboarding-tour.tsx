import { useEffect, useMemo, useState, useCallback } from "react";
import Joyride, { STATUS, CallBackProps, Step, EVENTS } from "react-joyride";
import { useSettings } from "@/contexts/SettingsContext";

const STORAGE_KEY = "vrg.tour.seen.v1";

export default function OnboardingTour() {
  const { settings, updateSettings } = useSettings();
  const [run, setRun] = useState(false);

  // Respect "Reduce Motion"
  const reduceMotion =
    settings.motion.reduceMotion === "enabled" ||
    (settings.motion.reduceMotion === "system" &&
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches);

  // Show once per browser unless ?tour is present
  useEffect(() => {
    const seen =
      (typeof window !== "undefined" &&
        localStorage.getItem(STORAGE_KEY) === "1") ||
      settings?.general?.["tourSeen"] === true;

    const force =
      typeof window !== "undefined" &&
      new URLSearchParams(window.location.search).has("tour");

    // Do not auto-run the tour if user prefers reduced motion
    if (!reduceMotion && (!seen || force)) setRun(true);
  }, [settings, reduceMotion]);

  // Recruiter-friendly copy (explain the *why*/purpose)
  const steps: Step[] = useMemo(
    () => [
      {
        target: "header nav",
        content:
          "This top bar lets you jump between sections quickly — ideal if you’re scanning for projects, skills, or contact.",
        disableBeacon: true,
      },
      {
        target: ".hero-title",
        content:
          "A quick snapshot of who I am and what I focus on — a starting point before diving deeper.",
      },
      {
        target: ".xp-hud",
        content:
          "This HUD gamifies exploration. As you browse projects and content, XP and badges reflect your progress.",
      },
      {
        target: ".cta-start-journey",
        content:
          "Use this call-to-action to begin exploring highlights immediately.",
      },
      {
        target: ".settings-entry",
        content:
          "Personalize the experience: theme (light/dark/system), accent color, sounds, motion, and accessibility aids.",
      },
    ],
    []
  );

  const handle = useCallback(
    (data: CallBackProps) => {
      const { status, type } = data;

      // Mark as seen when finished or skipped
      if (status && (status === STATUS.FINISHED || status === STATUS.SKIPPED)) {
        try {
          localStorage.setItem(STORAGE_KEY, "1");
          updateSettings("general.tourSeen", true);
        } catch {}
        setRun(false);
      }

      // Optional debug
      if (type && type !== EVENTS.TOOLTIP) {
        // console.debug("[JOY]", type, data);
      }
    },
    [updateSettings]
  );

  return (
    <Joyride
      run={run}
      steps={steps}
      callback={handle}
      continuous
      showProgress
      showSkipButton
      scrollToFirstStep
      disableScrolling={false}
      disableOverlayClose
      spotlightPadding={6}
      styles={{
        options: {
          zIndex: 9999,
          primaryColor: "hsl(var(--primary))",
          textColor: "hsl(var(--foreground))",
          backgroundColor: "hsl(var(--card))",
          arrowColor: "hsl(var(--card))",
        },
        tooltip: { border: "1px solid hsl(var(--card-border))" },
      }}
    />
  );
}
