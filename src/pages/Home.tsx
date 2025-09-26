import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useGameState } from "@/components/GameHUD";
import { useToast } from "@/hooks/use-toast";
import { navigateTo } from "@/utils/navigation";
import { useUiSounds } from "@/components/UiSounds";
import { LiquidButton } from "@/components/ui/LiquidButton";

import {
  Download,
  Mail,
  Github,
  Linkedin,
  Twitter,
  ArrowDown,
  Play,
  Sparkles,
} from "lucide-react";
import { MapPin, Calendar, Shield } from "lucide-react";

// particles toggle
const SHOW_PARTICLES = false;

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
         text-xs leading-5 backdrop-blur
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

export const Home = () => {
  const { trackExploreAction, trackCriticalAction } = useGameState();
  const navigate = useNavigate();
  const { toast } = useToast();
  const ui = useUiSounds();

  useEffect(() => {
    trackExploreAction("Home");
  }, [trackExploreAction]);

  const scrollToQuests = () => {
    const el = document.getElementById("quests");
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
    scrollToQuests();
  };

  const handleOpenPortal = () => {
    ui.play("click");
    trackCriticalAction("Portal opened - Contact navigation");
    navigate("/contact");
  };

  const handleDownloadArtifact = () => {
    ui.play("click");
    trackCriticalAction("Resume download");
    const link = document.createElement("a");
    link.href = "/assets/Varun_Reddy_Gutha_Resume.pdf";
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
      {/* Hero Section (no local video; global fixed video runs from App.tsx) */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Optional particles */}
        {SHOW_PARTICLES && (
          <div
            className="absolute inset-0 overflow-hidden pointer-events-none"
            aria-hidden
          >
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className="absolute w-1 h-1 bg-primary/30 rounded-full float-animation"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 3}s`,
                  animationDuration: `${3 + Math.random() * 2}s`,
                }}
              />
            ))}
          </div>
        )}

        {/* Hero Content */}
        <div className="relative z-10 container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto space-y-8">
            {/* Badge */}
            <div className="flex justify-center">
              <Badge
                variant="secondary"
                className="neon-glow-purple px-4 py-2 text-sm font-mono"
                onMouseEnter={() => ui.play("hover")}
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Available for New Quests
              </Badge>
            </div>

            {/* Main Heading */}
            <div className="space-y-4">
              <h1 className="text-fluid-xl font-bold leading-tight">
                <span className="gradient-text-primary">Varun Reddy Gutha</span>
                <br />
                <span className="text-foreground text-shadow-glow">
                  Full-Stack Developer & Digital Architect
                </span>
              </h1>

              <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
                <BadgePill icon="map-pin" label="Charlotte, NC" />
                <BadgePill
                  icon="calendar"
                  label="Internship Jan 2026 (OPT)"
                  emphasis
                />
                <BadgePill icon="shield" label="F-1 Visa (OPT-eligible)" />
              </div>

              <p className="text-fluid-md text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                I build software people use full-stack websites, mobile
                applications, and applied AI/ML systems.
              </p>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap justify-center gap-8 text-center">
              <div className="space-y-1">
                <div className="text-2xl font-bold gradient-text-primary">
                  2+
                </div>
                <div className="text-sm text-muted-foreground">
                  Years Experience
                </div>
              </div>
              <div className="space-y-1">
                <div className="text-2xl font-bold gradient-text-secondary">
                  10+
                </div>
                <div className="text-sm text-muted-foreground">
                  Projects Completed
                </div>
              </div>
              <div className="space-y-1">
                <div className="text-2xl font-bold text-success">15+</div>
                <div className="text-sm text-muted-foreground">
                  Technologies Mastered
                </div>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap justify-center gap-4">
              <LiquidButton
                variant="cyan"
                className="px-8"
                onClick={handleStartJourney}
                onMouseEnter={() => ui.play("hover")}
                ariaLabel="Start your development journey"
              >
                <Play className="w-5 h-5" />
                <span>Start Journey</span>
              </LiquidButton>

              <LiquidButton
                variant="violet"
                className="px-8"
                onClick={handleOpenPortal}
                onMouseEnter={() => ui.play("hover")}
                ariaLabel="Open contact portal"
              >
                <Mail className="w-5 h-5" />
                <span>Open Portal</span>
              </LiquidButton>

              <LiquidButton
                variant="lime"
                className="px-8"
                onClick={handleDownloadArtifact}
                onMouseEnter={() => ui.play("hover")}
                ariaLabel="Download resume artifact"
              >
                <Download className="w-5 h-5" />
                <span>Download Artifact</span>
              </LiquidButton>
            </div>

            {/* Social Links */}
            <div className="flex justify-center gap-4 pt-4">
              {[
                { icon: Github, href: "#", label: "GitHub" },
                { icon: Linkedin, href: "#", label: "LinkedIn" },
                { icon: Twitter, href: "#", label: "Twitter" },
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
          </div>
        </div>

        {/* Scroll Indicator */}
        <button
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce hover:scale-110 transition-transform focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background"
          onClick={() => {
            ui.play("click");
            scrollToQuests();
          }}
          onMouseEnter={() => ui.play("hover")}
          aria-label="Scroll to quests"
        >
          <ArrowDown className="w-6 h-6 text-primary" />
        </button>
      </section>

      {/* Quick Preview Section (translucent over global video) */}
      <section id="quests" className="py-20 surface">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold mb-4 gradient-text-primary">
                Ready to Embark on Your Next Quest?
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Explore my journey, discover completed quests, and learn about
                the technologies that power modern digital experiences.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  title: "Origin Story",
                  description:
                    "Discover my background, education, and the journey that led me to become a full-stack developer.",
                  href: "/about",
                  color: "primary",
                },
                {
                  title: "Completed Quests",
                  description:
                    "Explore my portfolio of projects, from e-commerce platforms to AI-powered applications.",
                  href: "/projects",
                  color: "secondary",
                },
                {
                  title: "Skill Tree",
                  description:
                    "Navigate through my technical skills and see my proficiency levels across different technologies.",
                  href: "/skills",
                  color: "success",
                },
              ].map((item, index) => (
                <div
                  key={index}
                  className="card-game card-surface p-6 rounded-lg hover:scale-105 transition-transform duration-200"
                  onMouseEnter={() => ui.play("cardhover")}
                >
                  <h3
                    className={`text-xl font-semibold mb-3 ${
                      item.color === "primary"
                        ? "gradient-text-primary"
                        : item.color === "secondary"
                        ? "gradient-text-secondary"
                        : "text-success"
                    }`}
                  >
                    {item.title}
                  </h3>
                  <p className="text-muted-foreground mb-4 leading-relaxed">
                    {item.description}
                  </p>
                  <Button
                    variant="outline"
                    className="w-full hover:neon-glow-cyan transition-all duration-200"
                    onClick={() => handleExploreClick(item.href)}
                    aria-label={`Explore ${item.title}`}
                  >
                    Explore
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
