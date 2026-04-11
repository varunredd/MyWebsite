import { useEffect } from "react";
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
} from "lucide-react";
import { MapPin, Calendar, Shield } from "lucide-react";

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
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-28 sm:pt-32 lg:pt-36">
        <div className="relative z-10 container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto space-y-6">
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

            <div className="space-y-4">
              <h1 className="text-fluid-xl font-bold leading-tight">
                <span className="gradient-text-primary">{personal.name}</span>
                <br />
                <span className="text-foreground text-shadow-glow">
                  {personal.title}
                </span>
              </h1>

              <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
                <BadgePill icon="map-pin" label={personal.location} />
                <BadgePill
                  icon="calendar"
                  label={personal.availability}
                  emphasis
                />
                <BadgePill icon="shield" label={personal.visa} />
              </div>

              <p className="text-fluid-md text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                {personal.tagline}
              </p>
            </div>

            <div className="flex flex-wrap justify-center gap-8 text-center">
              <div className="space-y-1">
                <div className="text-2xl font-bold gradient-text-primary">
                  {stats.yearsExperience}
                </div>
                <div className="text-sm text-muted-foreground">
                  Years Experience
                </div>
              </div>

              <div className="space-y-1">
                <div className="text-2xl font-bold gradient-text-secondary">
                  {stats.projects}
                </div>
                <div className="text-sm text-muted-foreground">
                  Projects Built
                </div>
              </div>

              <div className="space-y-1">
                <div className="text-2xl font-bold text-success">
                  {stats.technologies}
                </div>
                <div className="text-sm text-muted-foreground">
                  Technologies Used
                </div>
              </div>
            </div>

            <div className="flex flex-wrap justify-center gap-4">
              <LiquidButton
                variant="cyan"
                className="px-8"
                onClick={handleStartJourney}
                onMouseEnter={() => ui.play("hover")}
                ariaLabel="Explore my work"
              >
                <Play className="w-5 h-5" />
                <span>Explore Work</span>
              </LiquidButton>

              <LiquidButton
                variant="violet"
                className="px-8"
                onClick={handleOpenPortal}
                onMouseEnter={() => ui.play("hover")}
                ariaLabel="Contact me"
              >
                <Mail className="w-5 h-5" />
                <span>Contact Me</span>
              </LiquidButton>

              <LiquidButton
                variant="lime"
                className="px-8"
                onClick={handleDownloadArtifact}
                onMouseEnter={() => ui.play("hover")}
                ariaLabel="Download resume"
              >
                <Download className="w-5 h-5" />
                <span>Download Resume</span>
              </LiquidButton>
            </div>

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
                  scrollToQuests();
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

      {/* Quick Preview Section */}
      <section id="quests" className="py-20 surface">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold mb-4 gradient-text-primary">
                What I Do
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Backend systems, AI/ML pipelines, and full-stack web
                applications — built to scale, tested to ship.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 items-stretch">
              {quickLinks.map((item, index) => (
                <div
                  key={index}
                  className="card-game card-surface p-6 rounded-lg hover:scale-105 transition-transform duration-200 h-full flex flex-col"
                  onMouseEnter={() => ui.play("cardhover")}
                >
                  <h3
                    className={`text-xl font-semibold mb-3 ${
                      index === 0
                        ? "gradient-text-primary"
                        : index === 1
                        ? "gradient-text-secondary"
                        : "text-success"
                    }`}
                  >
                    {item.title}
                  </h3>

                  <p className="text-muted-foreground leading-relaxed flex-1">
                    {item.description}
                  </p>

                  <Button
                    variant="outline"
                    className="w-full mt-6 hover:neon-glow-cyan transition-all duration-200"
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