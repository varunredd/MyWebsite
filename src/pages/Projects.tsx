import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useGameState } from "@/components/GameHUD";
import { useUiSounds } from "@/components/UiSounds";
import { projects as projectData } from "@/data/resumeData";
import {
  ExternalLink,
  Github,
  Trophy,
  Zap,
  Brain,
  Code,
  Smartphone,
} from "lucide-react";

const iconMap: Record<string, any> = {
  "rag-qa-engine": Brain,
  "ml-video-extractor": Brain,
  "ecommerce-spring": Code,
  "mern-ecommerce": Smartphone,
};

const accentStyles = [
  {
    iconWrap:
      "border-primary/25 bg-primary/10 group-hover:neon-glow-cyan",
    icon: "text-primary",
    title: "group-hover:text-primary",
  },
  {
    iconWrap:
      "border-secondary/25 bg-secondary/10 group-hover:neon-glow-purple",
    icon: "text-secondary",
    title: "group-hover:text-secondary",
  },
  {
    iconWrap:
      "border-primary/25 bg-primary/10 group-hover:neon-glow-cyan",
    icon: "text-primary",
    title: "group-hover:text-primary",
  },
  {
    iconWrap:
      "border-success/25 bg-success/10 group-hover:neon-glow-green",
    icon: "text-success",
    title: "group-hover:text-success",
  },
] as const;

type Project = (typeof projectData)[0];

export const Projects = () => {
  const { trackExploreAction, trackCriticalAction, level } = useGameState();
  const [viewedProjects, setViewedProjects] = useState<string[]>([]);
  const ui = useUiSounds();

  useEffect(() => {
    trackExploreAction("Projects");
  }, [trackExploreAction]);

  const getDifficulty = (project: Project) =>
    project.featured ? "Master" : "Adept";

  const getXp = (project: Project) => (project.featured ? 200 : 150);

  const getDifficultyClasses = (difficulty: string) => {
    switch (difficulty) {
      case "Master":
        return "border-destructive/40 bg-destructive/5 text-destructive";
      case "Adept":
        return "border-warning/40 bg-warning/5 text-warning";
      default:
        return "border-secondary/30 bg-secondary/10 text-secondary";
    }
  };

  const handleProjectView = (projectId: string) => {
    ui.play("cardclick");

    if (!viewedProjects.includes(projectId)) {
      setViewedProjects((prev) => [...prev, projectId]);
      const projectTitle = projectData.find((p) => p.id === projectId)?.title;
      trackCriticalAction(`Viewed project: ${projectTitle}`);
    }
  };

  return (
    <div className="min-h-screen">
      {/* ═══════════ HERO ═══════════ */}
      <section className="relative overflow-hidden pt-28 sm:pt-32 lg:pt-36 surface-strong">
        <div className="scanline-overlay" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(0,245,255,0.08),transparent_38%),radial-gradient(circle_at_bottom,rgba(217,70,239,0.07),transparent_34%)]" />

        <div className="container relative z-10 mx-auto px-4 py-20">
          <div className="mx-auto max-w-4xl text-center">
            <Badge
              variant="secondary"
              className="neon-glow-purple mb-6 px-5 py-2 text-sm font-rajdhani tracking-wider uppercase"
              onMouseEnter={() => ui.play("hover")}
            >
              <Trophy className="mr-2 h-4 w-4" />
              Projects
            </Badge>

            <h1
              id="projects-title"
              tabIndex={-1}
              className="mb-6 text-fluid-xl font-orbitron font-bold"
            >
              <span
                className="glitch-text gradient-text-primary"
                data-text="Projects"
              >
                Projects
              </span>
            </h1>

            <p className="mx-auto max-w-3xl text-fluid-md leading-relaxed text-muted-foreground font-rajdhani">
            Each project represents a unique challenge, deliberate engineering choices,
            and practical lessons learned while building production-ready software.
            </p>
          </div>
        </div>
      </section>

      {/* ═══════════ PROJECT GRID ═══════════ */}
      <section className="relative py-20 surface">
        <div className="circuit-border absolute left-0 top-0 w-full" />

        <div className="container relative z-10 mx-auto px-4">
          <div className="mx-auto max-w-7xl">
            <div className="grid items-stretch gap-8 md:grid-cols-2">
              {projectData.map((project, index) => {
                const IconComp = iconMap[project.id] || Code;
                const difficulty = getDifficulty(project);
                const xp = getXp(project);
                const accent = accentStyles[index % accentStyles.length];

                return (
                  <Card
                    key={project.id}
                    className="group holo-card card-game card-surface h-full rounded-2xl p-6 sm:p-7 transition-all duration-300 hover:-translate-y-1 flex flex-col"
                    onMouseEnter={() => ui.play("cardhover")}
                  >
                    {/* Header */}
                    <div className="flex items-start justify-between gap-4">
                      <div
                        className={`flex h-12 w-12 items-center justify-center rounded-xl border transition-all duration-300 ${accent.iconWrap}`}
                      >
                        <IconComp className={`h-6 w-6 ${accent.icon}`} />
                      </div>

                      <div className="flex flex-wrap justify-end gap-2">
                        <Badge
                          variant="outline"
                          className={`px-3 py-1 font-rajdhani tracking-wide ${getDifficultyClasses(
                            difficulty
                          )}`}
                          onMouseEnter={() => ui.play("hover")}
                        >
                          {difficulty}
                        </Badge>

                        <Badge
                          variant="secondary"
                          className="border border-white/10 bg-secondary/85 px-3 py-1 text-xs font-rajdhani tracking-wide text-secondary-foreground"
                          onMouseEnter={() => ui.play("hover")}
                        >
                          <Zap className="mr-1.5 h-3.5 w-3.5" />+{xp} XP
                        </Badge>
                      </div>
                    </div>

                    {/* Body */}
                    <div className="mt-5 flex flex-1 flex-col">
                      <h3
                        className={`text-2xl font-orbitron font-semibold text-foreground transition-colors duration-300 ${accent.title}`}
                      >
                        {project.title}
                      </h3>

                      <p className="mt-4 text-[1.05rem] leading-relaxed text-muted-foreground font-rajdhani">
                        {project.description}
                      </p>

                      {/* Tech stack */}
                      <div className="mt-5 flex min-h-[72px] flex-wrap content-start gap-2">
                        {project.tech.map((tag, tagIndex) => (
                          <Badge
                            key={tagIndex}
                            variant="outline"
                            className="rounded-full border-white/10 bg-background/30 px-3 py-1 text-xs font-rajdhani tracking-wide text-foreground/95"
                            onMouseEnter={() => ui.play("hover")}
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>

                      {/* Key features */}
                      <div className="mt-5 min-h-[104px] space-y-3">
                        <h4 className="text-sm font-semibold uppercase tracking-wider text-foreground font-rajdhani">
                          Key Features
                        </h4>

                        <div className="grid grid-cols-1 gap-x-8 gap-y-2 text-sm text-muted-foreground sm:grid-cols-2">
                          {project.features.slice(0, 4).map((feature, featureIndex) => (
                            <div
                              key={featureIndex}
                              className="flex items-start gap-2 font-rajdhani"
                            >
                              <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0" />
                              <span>{feature}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Footer / Actions */}
                      <div className="mt-auto flex gap-3 pt-6">
                        <Button
                          size="sm"
                          className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90 font-rajdhani tracking-wider uppercase shadow-[0_0_22px_hsl(var(--primary)/0.30)]"
                          onClick={() => handleProjectView(project.id)}
                          onMouseEnter={() => ui.play("hover")}
                          aria-label={`Explore project ${project.title}`}
                        >
                          <ExternalLink className="mr-2 h-4 w-4" />
                          Explore Project
                        </Button>

                        {project.github ? (
                          <Button
                            variant="outline"
                            size="sm"
                            className="border-white/10 bg-background/35 hover:bg-background/60"
                            onClick={() => ui.play("click")}
                            onMouseEnter={() => ui.play("hover")}
                            asChild
                          >
                            <a
                              href={project.github}
                              target="_blank"
                              rel="noopener noreferrer"
                              aria-label={`Open source for ${project.title}`}
                            >
                              <Github className="h-4 w-4" />
                            </a>
                          </Button>
                        ) : (
                          <Button
                            variant="outline"
                            size="sm"
                            className="border-white/10 bg-background/35 opacity-50"
                            onMouseEnter={() => ui.play("hover")}
                            disabled
                            aria-label={`Source unavailable for ${project.title}`}
                          >
                            <Github className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════ STATS ═══════════ */}
      <section className="relative py-20 surface-strong">
        <div className="circuit-border absolute left-0 top-0 w-full opacity-70" />

        <div className="container relative z-10 mx-auto px-4">
          <div className="mx-auto max-w-5xl text-center">
            <h2 className="mb-12 text-3xl sm:text-4xl font-orbitron font-bold gradient-text-secondary neon-underline">
              Project Stats
            </h2>

              <div className="grid grid-cols-2 gap-6 max-w-md mx-auto">
                <div className="space-y-2 hud-bracket px-3 py-2">
                <div className="text-3xl font-orbitron font-bold gradient-text-primary stat-glow">
                  {projectData.length}
                </div>
                <div className="text-sm uppercase tracking-wider text-muted-foreground font-rajdhani">
                  Projects
                </div>
              </div>

              <div className="space-y-2 hud-bracket px-3 py-2">
                <div className="text-3xl font-orbitron font-bold text-success stat-glow">
                  20+
                </div>
                <div className="text-sm uppercase tracking-wider text-muted-foreground font-rajdhani">
                  Technologies Used
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};