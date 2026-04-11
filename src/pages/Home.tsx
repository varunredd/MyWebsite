import { useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useGameState } from "@/components/GameHUD";
import { useToast } from "@/hooks/use-toast";
import { navigateTo } from "@/utils/navigation";
import { useUiSounds } from "@/components/UiSounds";
import { LiquidButton } from "@/components/ui/LiquidButton";
import { personal, stats, quickLinks } from "@/data/resumeData";

import {
  Download,
  Mail,
  Github,
  Linkedin,
  ArrowDown,
  Play,
  Sparkles,
  Terminal,
  Cpu,
  Layers,
} from "lucide-react";
import { MapPin, Calendar, Shield } from "lucide-react";

/* ── Neon Rain ── */
function NeonRain() {
  const drops = useMemo(
    () =>
      Array.from({ length: 24 }, (_, i) => {
        const zone = Math.random();
        const left =
          zone < 0.35
            ? Math.random() * 28
            : zone < 0.65
            ? 32 + Math.random() * 36
            : 72 + Math.random() * 28;

        return {
          id: i,
          left: `${left}%`,
          height: `${14 + Math.random() * 10}px`,
          delay: `${Math.random() * 6}s`,
          duration: `${2.8 + Math.random() * 1.4}s`,
          opacity: 0.28 + Math.random() * 0.22,
        };
      }),
    []
  );

  return (
    <div className="rain-container">
      {drops.map((d) => (
        <div
          key={d.id}
          className="raindrop"
          style={{
            left: d.left,
            height: d.height,
            animationDelay: d.delay,
            animationDuration: d.duration,
            opacity: d.opacity,
          }}
        />
      ))}
    </div>
  );
}

/* ── Badge Pill ── */
function BadgePill({
  icon,
  label,
  emphasis = false,
}: {
  icon: "map-pin" | "calendar" | "shield";
  label: string;
  emphasis?: boolean;
}) {
  const Icon =
    icon === "map-pin" ? MapPin : icon === "calendar" ? Calendar : Shield;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1
         text-xs leading-5 backdrop-blur font-rajdhani tracking-wide uppercase
         ${
           emphasis
             ? "border-primary/50 bg-primary/10 text-foreground"
             : "border-card-border/60 bg-background/20 text-muted-foreground"
         }`}
      aria-label={label}
    >
      <Icon className="h-3.5 w-3.5 opacity-80" />
      {label}
    </span>
  );
}

/* ── Quick-link card icons ── */
const cardIcons = [Terminal, Layers, Cpu];

export const Home = () => {
  const { trackExploreAction, trackCriticalAction } = useGameState();
  const navigate = useNavigate();
  const { toast } = useToast();
  const ui = useUiSounds();

  useEffect(() => {
    trackExploreAction("Home");
  }, [trackExploreAction]);

  const scrollToWork = () => {
    const el = document.getElementById("work");
    if (!el) return;
    el.scrollIntoView({ behavior: "auto", block: "start" });

    setTimeout(() => {
      const rect = el.getBoundingClientRect();
      const targetY = window.scrollY + rect.top - 80;
      window.scrollTo({ top: targetY, behavior: "smooth" });
    }, 100);
  };

  const handleStartJourney = () => {
    ui.play("click");
    scrollToWork();
  };

  const handleOpenPortal = () => {
    ui.play("click");
    trackCriticalAction("Portal opened - Contact navigation");
    navigate("/contact");
  };

  const handleDownloadResume = () => {
    ui.play("click");
    trackCriticalAction("Resume download");
    const link = document.createElement("a");
    link.href = personal.resumePath;
    link.download = "Varun_Reddy_Gutha_Resume.pdf";
    link.rel = "noopener noreferrer";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExploreClick = (route: string) => {
    ui.play("click");
    const targetMap: Record<string, "about" | "projects" | "skills"> = {
      "/about": "about",
      "/projects": "projects",
      "/skills": "skills",
    };

    const target = targetMap[route];
    if (target) navigateTo(target, navigate);
    else navigate(route);
  };

  return (
    <div className="min-h-screen">
      {/* ═══════════ HERO ═══════════ */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-28 sm:pt-32 lg:pt-36">
        {/* Neon rain behind everything */}
        <NeonRain />

        {/* Scanline CRT overlay */}
        <div className="scanline-overlay" />

        {/* Content */}
        <div className="relative z-10 container mx-auto px-4 text-center crt-flicker">
          <div className="max-w-4xl mx-auto space-y-6">
            {/* Availability badge */}
            <div className="flex justify-center">
              <Badge
                variant="secondary"
                className="neon-glow-purple px-4 py-2 text-sm font-mono"
                onMouseEnter={() => ui.play("hover")}
              >
                <Sparkles className="w-4 h-4 mr-2" />
                {personal.availability}
              </Badge>
            </div>

            {/* Name + Title */}
            <div className="space-y-4">
              <h1 className="font-orbitron font-bold leading-tight text-fluid-xl">
                <span
                  className="glitch-text gradient-text-primary"
                  data-text={personal.name}
                >
                  {personal.name}
                </span>
                <br />
                <span className="text-foreground text-shadow-glow font-rajdhani font-semibold tracking-wide">
                  {personal.title}
                </span>
              </h1>

              {/* Info pills */}
              <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
                <BadgePill icon="map-pin" label={personal.location} />
                <BadgePill
                  icon="calendar"
                  label={personal.availability}
                  emphasis
                />
                <BadgePill icon="shield" label={personal.visa} />
              </div>

              {/* Tagline with typing cursor */}
              <p className="text-fluid-md text-muted-foreground max-w-2xl mx-auto leading-relaxed typing-cursor font-rajdhani">
                {personal.tagline}
              </p>
            </div>

            {/* Stats with glow */}
            <div className="flex flex-wrap justify-center gap-8 text-center">
              {[
                {
                  value: stats.yearsExperience,
                  label: "Years Experience",
                  colorClass: "text-[hsl(var(--primary))]",
                },
                {
                  value: stats.projects,
                  label: "Projects Built",
                  colorClass: "text-[hsl(var(--secondary))]",
                },
                {
                  value: stats.technologies,
                  label: "Technologies Used",
                  colorClass: "text-[hsl(var(--success))]",
                },
              ].map((stat) => (
                <div key={stat.label} className="space-y-1 hud-bracket px-3 py-2">
                  <div
                    className={`text-2xl font-orbitron font-bold stat-glow ${stat.colorClass}`}
                  >
                    {stat.value}
                  </div>
                  <div className="text-sm text-muted-foreground font-rajdhani tracking-wider uppercase">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>

            {/* CTA buttons */}
            <div className="flex flex-wrap justify-center gap-4">
              <LiquidButton
                variant="cyan"
                className="px-8"
                onClick={handleStartJourney}
                onMouseEnter={() => ui.play("hover")}
                ariaLabel="Explore my work"
              >
                <Play className="w-5 h-5" />
                <span className="font-rajdhani font-semibold tracking-wide">Explore Work</span>
              </LiquidButton>

              <LiquidButton
                variant="violet"
                className="px-8"
                onClick={handleOpenPortal}
                onMouseEnter={() => ui.play("hover")}
                ariaLabel="Contact me"
              >
                <Mail className="w-5 h-5" />
                <span className="font-rajdhani font-semibold tracking-wide">Contact Me</span>
              </LiquidButton>

              <LiquidButton
                variant="lime"
                className="px-8"
                onClick={handleDownloadResume}
                onMouseEnter={() => ui.play("hover")}
                ariaLabel="Download resume"
              >
                <Download className="w-5 h-5" />
                <span className="font-rajdhani font-semibold tracking-wide">Download Resume</span>
              </LiquidButton>
            </div>

            {/* Social links */}
            <div className="flex flex-col items-center gap-6 pt-4">
              <div className="flex justify-center gap-4">
                {[
                  {
                    icon: Github,
                    href: personal.github,
                    label: "GitHub",
                  },
                  {
                    icon: Linkedin,
                    href: personal.linkedin,
                    label: "LinkedIn",
                  },
                ].map(({ icon: Icon, href, label }) => (
                  <Button
                    key={label}
                    variant="ghost"
                    size="sm"
                    className="w-10 h-10 p-0 hover:neon-glow-cyan"
                    asChild
                    onMouseEnter={() => ui.play("hover")}
                    onClick={() => ui.play("click")}
                  >
                    <a href={href} target="_blank" rel="noopener noreferrer">
                      <Icon className="w-5 h-5" />
                      <span className="sr-only">{label}</span>
                    </a>
                  </Button>
                ))}
              </div>

              <button
                className="animate-bounce hover:scale-110 transition-transform focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background"
                onClick={() => {
                  ui.play("click");
                  scrollToWork();
                }}
                onMouseEnter={() => ui.play("hover")}
                aria-label="Scroll down"
              >
                <ArrowDown className="w-6 h-6 text-primary" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════ WHAT I DO ═══════════ */}
      <section id="work" className="py-20 surface relative">
        {/* Circuit trace animated top border */}
        <div className="circuit-border absolute top-0 left-0 w-full" />

        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-orbitron font-bold mb-4 gradient-text-primary neon-underline">
                What I Do
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto mt-8 font-rajdhani tracking-wide">
                Backend systems, AI/ML pipelines, and full-stack web
                applications — built to scale, tested to ship.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 items-stretch">
              {quickLinks.map((item, index) => {
                const IconComp = cardIcons[index] || Terminal;

                return (
                  <div
                    key={index}
                    className="holo-card card-game card-surface p-6 rounded-lg hover:scale-105 transition-transform duration-200 h-full flex flex-col group"
                    onMouseEnter={() => ui.play("cardhover")}
                  >
                    {/* Card icon */}
                    <div className="mb-4 w-10 h-10 rounded-lg flex items-center justify-center bg-primary/10 border border-primary/20 group-hover:neon-glow-cyan transition-all duration-300">
                      <IconComp className="w-5 h-5 text-primary" />
                    </div>

                    <h3
                      className={`text-xl font-orbitron font-semibold mb-3 ${
                        index === 0
                          ? "gradient-text-primary"
                          : index === 1
                          ? "gradient-text-secondary"
                          : "text-success"
                      }`}
                    >
                      {item.title}
                    </h3>

                    <p className="text-muted-foreground leading-relaxed flex-1 font-rajdhani">
                      {item.description}
                    </p>

                    <Button
                      variant="outline"
                      className="w-full mt-6 hover:neon-glow-cyan transition-all duration-200 font-rajdhani tracking-wider uppercase"
                      onClick={() => handleExploreClick(item.href)}
                      aria-label={`Explore ${item.title}`}
                    >
                      Explore
                    </Button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
