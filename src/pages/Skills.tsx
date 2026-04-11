import { useEffect, useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useGameState } from "@/components/GameHUD";
import { useUiSounds } from "@/components/UiSounds";
import {
  Code2,
  Database,
  Cloud,
  Brain,
  Zap,
  Star,
  ChevronDown,
  ChevronUp,
  Award,
  Server,
  Sparkles,
  Lock,
} from "lucide-react";

type SkillCategory = {
  id: string;
  title: string;
  description: string;
  icon: any;
  requiredLevel: number;
  mastery: number;
  skills: { name: string; level: number; experience: string }[];
  projects: string[];
};

const skillCategories: SkillCategory[] = [
  {
    id: "backend",
    title: "Backend Development",
    description: "Building robust server-side applications and microservices",
    icon: Server,
    requiredLevel: 1,
    mastery: 90,
    skills: [
      { name: "Spring Boot", level: 90, experience: "2+ years" },
      { name: "Spring Security / OAuth 2.0", level: 85, experience: "2+ years" },
      { name: "FastAPI", level: 80, experience: "1+ years" },
      { name: "Node.js/Express", level: 80, experience: "2+ years" },
      { name: "REST / GraphQL APIs", level: 90, experience: "2+ years" },
      { name: "Microservices", level: 85, experience: "2+ years" },
    ],
    projects: ["E-Commerce Platform", "Duke Energy APIs", "Hospital Mgmt"],
  },
  {
    id: "frontend",
    title: "Frontend Development",
    description: "Creating responsive, interactive user interfaces",
    icon: Code2,
    requiredLevel: 1,
    mastery: 80,
    skills: [
      { name: "React.js", level: 85, experience: "2+ years" },
      { name: "TypeScript", level: 80, experience: "2+ years" },
      { name: "Redux Toolkit", level: 75, experience: "1+ years" },
      { name: "Tailwind CSS", level: 80, experience: "1+ years" },
      { name: "Next.js", level: 70, experience: "1+ years" },
    ],
    projects: ["E-Commerce Apps", "RAG Q&A Frontend", "Portfolio"],
  },
  {
    id: "ai",
    title: "AI & Machine Learning",
    description: "Building RAG pipelines, embedding search, and ML-powered tools",
    icon: Brain,
    requiredLevel: 1,
    mastery: 80,
    skills: [
      { name: "Python (ML)", level: 85, experience: "2+ years" },
      { name: "LangChain / RAG", level: 80, experience: "1+ years" },
      { name: "PyTorch", level: 75, experience: "1+ years" },
      { name: "Hugging Face / Transformers", level: 75, experience: "1+ years" },
      { name: "CLIP / FAISS", level: 75, experience: "1+ years" },
      { name: "Sentence Transformers", level: 75, experience: "1+ years" },
    ],
    projects: ["RAG Q&A Engine", "ML Video Extractor", "Duke Energy ML"],
  },
  {
    id: "database",
    title: "Data & Storage",
    description: "Designing and optimizing data storage solutions",
    icon: Database,
    requiredLevel: 1,
    mastery: 85,
    skills: [
      { name: "PostgreSQL", level: 90, experience: "2+ years" },
      { name: "MongoDB", level: 80, experience: "2+ years" },
      { name: "Redis", level: 80, experience: "2+ years" },
      { name: "Elasticsearch", level: 65, experience: "1+ years" },
      { name: "Apache Kafka", level: 60, experience: "<1 year" },
    ],
    projects: ["E-Commerce Platform", "Hospital Mgmt", "RAG Q&A Engine"],
  },
  {
    id: "cloud",
    title: "Cloud & DevOps",
    description: "Deploying and scaling applications in the cloud",
    icon: Cloud,
    requiredLevel: 1,
    mastery: 75,
    skills: [
      { name: "AWS (EC2, S3, Lambda, SageMaker)", level: 75, experience: "2+ years" },
      { name: "Docker", level: 80, experience: "2+ years" },
      { name: "GitHub Actions", level: 75, experience: "1+ years" },
      { name: "Jenkins", level: 70, experience: "1+ years" },
    ],
    projects: ["Brane Microservices", "E-Commerce Platform"],
  },
];

const accentStyles = [
  {
    iconWrap: "border-primary/25 bg-primary/10 group-hover:neon-glow-cyan",
    icon: "text-primary",
  },
  {
    iconWrap: "border-secondary/25 bg-secondary/10 group-hover:neon-glow-purple",
    icon: "text-secondary",
  },
  {
    iconWrap: "border-primary/25 bg-primary/10 group-hover:neon-glow-cyan",
    icon: "text-primary",
  },
  {
    iconWrap: "border-success/25 bg-success/10 group-hover:neon-glow-green",
    icon: "text-success",
  },
  {
    iconWrap: "border-warning/25 bg-warning/10",
    icon: "text-warning",
  },
] as const;

export const Skills = () => {
  const { trackExploreAction, trackCriticalAction, level } = useGameState();
  const [expandedSkill, setExpandedSkill] = useState<string | null>(null);
  const [unlockedSkills, setUnlockedSkills] = useState<string[]>([]);
  const ui = useUiSounds();

  useEffect(() => {
    trackExploreAction("Skills");
  }, [trackExploreAction]);

  const restrictionsActive = level >= 3;

  useEffect(() => {
    const unlocked = restrictionsActive
      ? skillCategories.filter((c) => level >= c.requiredLevel).map((c) => c.id)
      : skillCategories.map((c) => c.id);

    setUnlockedSkills(unlocked);
  }, [level, restrictionsActive]);

  const stats = useMemo(
    () => ({
      total: skillCategories.length,
      mastered: unlockedSkills.length,
      avgMastery: Math.round(
        skillCategories.reduce((acc, item) => acc + item.mastery, 0) /
          skillCategories.length
      ),
    }),
    [unlockedSkills]
  );

  const handleSkillUnlock = (skillId: string) => {
    ui.play("cardclick");

    if (!unlockedSkills.includes(skillId)) {
      const skillTitle = skillCategories.find((s) => s.id === skillId)?.title;
      trackCriticalAction(`Skill Unlocked: ${skillTitle}`);
      setUnlockedSkills((prev) => [...prev, skillId]);
    }
  };

  const toggleSkillExpansion = (skillId: string) => {
    ui.play("click");
    setExpandedSkill((prev) => (prev === skillId ? null : skillId));
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
              <Sparkles className="mr-2 h-4 w-4" />
              Technical Skills
            </Badge>

            <h1 className="mb-6 text-fluid-xl font-orbitron font-bold">
              <span
                className="glitch-text gradient-text-primary"
                data-text="Technical Skills"
              >
                Technical Skills
              </span>
            </h1>

            <p className="mx-auto max-w-3xl text-fluid-md leading-relaxed text-muted-foreground font-rajdhani">
              A comprehensive overview of my technical abilities, organized by domain.
              Each skill has been built through real-world projects and professional experience.
            </p>
          </div>
        </div>
      </section>

      {/* ═══════════ SKILLS GRID ═══════════ */}
      <section className="relative py-16 surface">
        <div className="circuit-border absolute left-0 top-0 w-full" />

        <div className="container relative z-10 mx-auto px-4">
          <div className="mx-auto max-w-7xl">
            <div className="grid items-start gap-6 md:grid-cols-2 xl:grid-cols-3">
              {skillCategories.map((category, index) => {
                const isUnlocked = unlockedSkills.includes(category.id);
                const isLocked =
                  restrictionsActive && level < category.requiredLevel;
                const isExpanded = expandedSkill === category.id;
                const accent = accentStyles[index % accentStyles.length];
                const Icon = category.icon;

                return (
                  <Card
                    key={category.id}
                    className={`group holo-card card-game card-surface rounded-2xl p-6 transition-all duration-300 ${
                      isLocked
                        ? "opacity-55 cursor-not-allowed"
                        : "hover:-translate-y-1 cursor-pointer"
                    }`}
                    onMouseEnter={() => ui.play("cardhover")}
                    onClick={() => {
                      if (!isLocked) toggleSkillExpansion(category.id);
                    }}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div
                        className={`flex h-12 w-12 items-center justify-center rounded-xl border transition-all duration-300 ${
                          isLocked
                            ? "border-white/10 bg-muted/40"
                            : accent.iconWrap
                        }`}
                      >
                        <Icon
                          className={`h-6 w-6 ${
                            isLocked ? "text-muted-foreground" : accent.icon
                          }`}
                        />
                      </div>

                      <div className="flex flex-col items-end gap-2">
                        {isLocked ? (
                          <Badge
                            variant="outline"
                            className="border-white/10 bg-background/30 px-3 py-1 text-xs font-rajdhani tracking-wide"
                          >
                            <Lock className="mr-1.5 h-3 w-3" />
                            Level {category.requiredLevel}
                          </Badge>
                        ) : (
                          <Badge
                            variant="secondary"
                            className="border border-white/10 bg-secondary/85 px-3 py-1 text-xs font-rajdhani tracking-wide text-secondary-foreground"
                          >
                            <Award className="mr-1.5 h-3 w-3" />
                            Mastered
                          </Badge>
                        )}

                        {!isLocked && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 p-0 text-muted-foreground hover:text-foreground"
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleSkillExpansion(category.id);
                            }}
                          >
                            {isExpanded ? (
                              <ChevronUp className="h-4 w-4" />
                            ) : (
                              <ChevronDown className="h-4 w-4" />
                            )}
                          </Button>
                        )}
                      </div>
                    </div>

                    <div className="mt-5 space-y-4">
                      <div className="min-h-[104px]">
                        <h3
                          className={`text-2xl font-orbitron font-semibold ${
                            isLocked ? "text-muted-foreground" : "text-foreground"
                          }`}
                        >
                          {category.title}
                        </h3>

                        <p className="mt-3 text-[1.05rem] leading-relaxed text-muted-foreground font-rajdhani">
                          {category.description}
                        </p>
                      </div>

                      {!isLocked && (
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm font-rajdhani">
                            <span className="text-muted-foreground">Mastery</span>
                            <span className="text-foreground">
                              {category.mastery}%
                            </span>
                          </div>
                          <Progress value={category.mastery} className="h-2" />
                        </div>
                      )}

                      {isExpanded && !isLocked && (
                        <div className="space-y-4 border-t border-card-border/60 pt-5">
                          <div className="space-y-3">
                            <h4 className="text-sm font-semibold uppercase tracking-wider text-foreground font-rajdhani">
                              Skills
                            </h4>

                            {category.skills.map((skill, skillIndex) => (
                              <div key={skillIndex} className="space-y-1.5">
                                <div className="flex items-center justify-between gap-3 text-sm font-rajdhani">
                                  <span className="text-foreground">
                                    {skill.name}
                                  </span>
                                  <span className="text-muted-foreground">
                                    {skill.level}%
                                  </span>
                                </div>

                                <Progress value={skill.level} className="h-1.5" />

                                <div className="text-xs text-muted-foreground font-rajdhani">
                                  {skill.experience}
                                </div>
                              </div>
                            ))}
                          </div>

                          <div className="pt-2">
                            <h5 className="mb-2 text-sm font-semibold uppercase tracking-wider text-foreground font-rajdhani">
                              Used In
                            </h5>

                            <div className="flex flex-wrap gap-2">
                              {category.projects.map((project, projectIndex) => (
                                <Badge
                                  key={projectIndex}
                                  variant="outline"
                                  className="rounded-full border-white/10 bg-background/30 px-3 py-1 text-xs font-rajdhani tracking-wide"
                                >
                                  {project}
                                </Badge>
                              ))}
                            </div>
                          </div>

                          {!isUnlocked && (
                            <Button
                              size="sm"
                              className="mt-2 w-full font-rajdhani tracking-wider uppercase"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleSkillUnlock(category.id);
                              }}
                            >
                              <Zap className="mr-2 h-4 w-4" />
                              Unlock Skill
                            </Button>
                          )}
                        </div>
                      )}
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════ LEGEND / STATS ═══════════ */}
      <section className="relative py-14 surface-strong">
        <div className="circuit-border absolute left-0 top-0 w-full opacity-70" />

        <div className="container relative z-10 mx-auto px-4">
          <div className="mx-auto max-w-5xl text-center">
            <h2 className="mb-10 text-3xl sm:text-4xl font-orbitron font-bold gradient-text-secondary neon-underline">
              Skills Overview
            </h2>

            <div className="mb-12 grid grid-cols-2 gap-6 max-w-lg mx-auto">
              <div className="space-y-2 hud-bracket px-3 py-2">
                <div className="text-3xl font-orbitron font-bold gradient-text-primary stat-glow">
                  {stats.total}
                </div>
                <div className="text-sm uppercase tracking-wider text-muted-foreground font-rajdhani">
                  Skill Domains
                </div>
              </div>
              
              <div className="space-y-2 hud-bracket px-3 py-2">
                <div className="text-3xl font-orbitron font-bold gradient-text-secondary stat-glow">
                  {stats.avgMastery}%
                </div>
                <div className="text-sm uppercase tracking-wider text-muted-foreground font-rajdhani">
                  Avg Mastery
                </div>
              </div>
            </div>
      
          </div>
        </div>
      </section>
    </div>
  );
};