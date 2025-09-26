import { useEffect, useState } from "react";
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
  Smartphone,
  Brain,
  Zap,
  Star,
  ChevronDown,
  ChevronUp,
  Award,
} from "lucide-react";

export const Skills = () => {
  const { trackExploreAction, trackCriticalAction, level } = useGameState();
  const [expandedSkill, setExpandedSkill] = useState<string | null>(null);
  const [unlockedSkills, setUnlockedSkills] = useState<string[]>([]);
  const ui = useUiSounds();

  useEffect(() => {
    trackExploreAction("Skills");

    // keep your existing scroll logic
    const state = history.state as any;
    const scrollTargetId = state?.usr?.scrollTargetId || state?.scrollTargetId;

    if (scrollTargetId) {
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
      window.scrollTo(0, 0);
      setTimeout(() => {
        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;
        window.scrollTo({ top: 0, behavior: "smooth" });
      }, 50);

      if (state?.usr) {
        history.replaceState(
          { ...state, usr: { ...state.usr, scrollTargetId: null } },
          ""
        );
      } else {
        history.replaceState({ ...state, scrollTargetId: null }, "");
      }
    }
  }, [trackExploreAction]);

  // ---- Skills config (unchanged) ----
  const skillCategories = [
    {
      id: "frontend",
      title: "Frontend Development",
      description: "Creating beautiful, responsive user interfaces",
      icon: Code2,
      color: "primary",
      requiredLevel: 1,
      mastery: 90,
      skills: [
        { name: "React", level: 95, experience: "4+ years" },
        { name: "TypeScript", level: 90, experience: "3+ years" },
        { name: "JavaScript", level: 95, experience: "5+ years" },
        { name: "Tailwind CSS", level: 85, experience: "2+ years" },
        { name: "Next.js", level: 80, experience: "2+ years" },
        { name: "HTML/CSS", level: 95, experience: "5+ years" },
      ],
      projects: ["E-Commerce Platform", "MERN E-Commerce", "Portfolio Website"],
    },
    {
      id: "backend",
      title: "Backend Development",
      description: "Building robust server-side applications",
      icon: Database,
      color: "secondary",
      requiredLevel: 1,
      mastery: 85,
      skills: [
        { name: "Node.js", level: 90, experience: "4+ years" },
        { name: "Spring Boot", level: 85, experience: "3+ years" },
        { name: "Express.js", level: 90, experience: "4+ years" },
        { name: "REST APIs", level: 95, experience: "4+ years" },
        { name: "GraphQL", level: 75, experience: "2+ years" },
        { name: "Microservices", level: 80, experience: "2+ years" },
      ],
      projects: ["Hospital Management", "E-Commerce API", "Analytics Backend"],
    },
    {
      id: "database",
      title: "Database Management",
      description: "Designing and optimizing data storage solutions",
      icon: Database,
      color: "success",
      requiredLevel: 2,
      mastery: 80,
      skills: [
        { name: "PostgreSQL", level: 90, experience: "3+ years" },
        { name: "MongoDB", level: 85, experience: "3+ years" },
        { name: "Redis", level: 75, experience: "2+ years" },
        { name: "SQL Optimization", level: 80, experience: "3+ years" },
        { name: "Database Design", level: 85, experience: "3+ years" },
      ],
      projects: [
        "Hospital Management",
        "E-Commerce Platform",
        "Analytics Dashboard",
      ],
    },
    {
      id: "cloud",
      title: "Cloud & DevOps",
      description: "Deploying and scaling applications in the cloud",
      icon: Cloud,
      color: "warning",
      requiredLevel: 2,
      mastery: 75,
      skills: [
        { name: "AWS", level: 80, experience: "2+ years" },
        { name: "Docker", level: 85, experience: "3+ years" },
        { name: "Kubernetes", level: 70, experience: "1+ years" },
        { name: "CI/CD", level: 80, experience: "2+ years" },
        { name: "Terraform", level: 65, experience: "1+ years" },
      ],
      projects: ["Hospital Management", "E-Commerce Platform", "AI Analytics"],
    },
    {
      id: "mobile",
      title: "Mobile Development",
      description: "Creating native and cross-platform mobile apps",
      icon: Smartphone,
      color: "destructive",
      requiredLevel: 3,
      mastery: 70,
      skills: [
        { name: "React Native", level: 80, experience: "2+ years" },
        { name: "Android (Java)", level: 75, experience: "2+ years" },
        { name: "iOS (Swift)", level: 65, experience: "1+ years" },
        { name: "Flutter", level: 60, experience: "1+ years" },
      ],
      projects: ["Mobile E-Commerce", "Health Tracker App", "Task Manager"],
    },
    {
      id: "ai",
      title: "AI & Machine Learning",
      description: "Building intelligent systems and data-driven solutions",
      icon: Brain,
      color: "primary",
      requiredLevel: 3,
      mastery: 75,
      skills: [
        { name: "Python", level: 85, experience: "3+ years" },
        { name: "TensorFlow", level: 75, experience: "2+ years" },
        { name: "PyTorch", level: 70, experience: "1+ years" },
        { name: "Scikit-learn", level: 80, experience: "2+ years" },
        { name: "Data Analysis", level: 85, experience: "3+ years" },
      ],
      projects: ["AI Analytics Dashboard", "Prediction Engine", "NLP Chatbot"],
    },
  ];

  // ✅ Unlock policy: levels < 3 — everything unlocked; levels >= 3 — gate by requiredLevel
  useEffect(() => {
    const restrictionsActive = level >= 3;
    const unlocked = restrictionsActive
      ? skillCategories.filter((c) => level >= c.requiredLevel).map((c) => c.id)
      : skillCategories.map((c) => c.id);
    setUnlockedSkills(unlocked);
  }, [level]);

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
    setExpandedSkill(expandedSkill === skillId ? null : skillId);
  };

  const restrictionsActive = level >= 3;

  return (
    <div className="min-h-screen">
      {/* Hero Section (translucent) */}
      <section className="surface-strong pt-24 pb-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <Badge
              variant="secondary"
              className="neon-glow-green mb-6 px-4 py-2"
              onMouseEnter={() => ui.play("hover")}
            >
              <Star className="w-4 h-4 mr-2" />
              Skill Tree Accessed
            </Badge>

            <h1
              id="skills-title"
              tabIndex={-1}
              className="section-title text-fluid-xl font-bold mb-6"
            >
              Skill Tree
            </h1>

            <p className="text-fluid-md text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Navigate through my technical abilities and expertise. Each skill
              represents mastery gained through real-world projects and
              continuous learning.
            </p>

            <div className="mt-8 flex justify-center gap-8">
              <div
                className="text-center"
                onMouseEnter={() => ui.play("hover")}
              >
                <div className="text-2xl font-bold gradient-text-primary">
                  Level {level}
                </div>
                <div className="text-sm text-muted-foreground">
                  Current Rank
                </div>
              </div>
              <div
                className="text-center"
                onMouseEnter={() => ui.play("hover")}
              >
                <div className="text-2xl font-bold text-success">
                  {unlockedSkills.length}
                </div>
                <div className="text-sm text-muted-foreground">
                  Skills Unlocked
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Skill Tree (translucent) */}
      <section className="surface py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {skillCategories.map((category) => {
                const isLocked = restrictionsActive
                  ? level < category.requiredLevel
                  : false;

                const isUnlocked = unlockedSkills.includes(category.id);
                const isExpanded = expandedSkill === category.id;

                return (
                  <Card
                    key={category.id}
                    className={`card-game card-surface p-6 transition-all duration-300 ${
                      isLocked
                        ? "opacity-50 cursor-not-allowed"
                        : "hover:scale-105 cursor-pointer"
                    } ${isUnlocked ? "neon-glow-cyan" : ""}`}
                    onMouseEnter={() => ui.play("cardhover")}
                    onClick={() => {
                      if (!isLocked) toggleSkillExpansion(category.id);
                    }}
                  >
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div
                        className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                          isLocked ? "bg-muted" : `neon-glow-${category.color}`
                        }`}
                      >
                        <category.icon
                          className={`w-6 h-6 ${
                            isLocked ? "text-muted-foreground" : "text-primary"
                          }`}
                        />
                      </div>

                      <div className="flex flex-col items-end gap-2">
                        {isLocked && (
                          <Badge
                            variant="outline"
                            className="text-xs"
                            onMouseEnter={() => ui.play("hover")}
                          >
                            Level {category.requiredLevel} Required
                          </Badge>
                        )}
                        {isUnlocked && (
                          <Badge
                            variant="secondary"
                            className="text-xs"
                            onMouseEnter={() => ui.play("hover")}
                          >
                            <Award className="w-3 h-3 mr-1" />
                            Mastered
                          </Badge>
                        )}
                        {!isLocked && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="p-0 h-auto"
                            onClick={(e) => {
                              e.stopPropagation();
                              ui.play("click");
                              toggleSkillExpansion(category.id);
                            }}
                            onMouseEnter={() => ui.play("hover")}
                          >
                            {isExpanded ? (
                              <ChevronUp className="w-4 h-4" />
                            ) : (
                              <ChevronDown className="w-4 h-4" />
                            )}
                          </Button>
                        )}
                      </div>
                    </div>

                    {/* Body */}
                    <div className="space-y-4">
                      <div>
                        <h3
                          className={`text-lg font-semibold ${
                            isLocked
                              ? "text-muted-foreground"
                              : "text-foreground"
                          }`}
                        >
                          {category.title}
                        </h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          {category.description}
                        </p>
                      </div>

                      {!isLocked && (
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">
                              Mastery
                            </span>
                            <span className="text-foreground">
                              {category.mastery}%
                            </span>
                          </div>
                          <Progress value={category.mastery} className="h-2" />
                        </div>
                      )}

                      {isExpanded && !isLocked && (
                        <div className="space-y-3 pt-4 border-t border-card-border/60">
                          <h4 className="text-sm font-medium text-foreground">
                            Skills:
                          </h4>
                          {category.skills.map((skill, index) => (
                            <div key={index} className="space-y-1">
                              <div className="flex justify-between text-sm">
                                <span className="text-foreground">
                                  {skill.name}
                                </span>
                                <span className="text-muted-foreground">
                                  {skill.level}%
                                </span>
                              </div>
                              <Progress value={skill.level} className="h-1" />
                              <div className="text-xs text-muted-foreground">
                                {skill.experience}
                              </div>
                            </div>
                          ))}

                          <div className="pt-2">
                            <h5 className="text-xs font-medium text-foreground mb-2">
                              Used in:
                            </h5>
                            <div className="flex flex-wrap gap-1">
                              {category.projects.map((project, index) => (
                                <Badge
                                  key={index}
                                  variant="outline"
                                  className="text-xs"
                                  onMouseEnter={() => ui.play("hover")}
                                >
                                  {project}
                                </Badge>
                              ))}
                            </div>
                          </div>

                          {!isUnlocked && (
                            <Button
                              size="sm"
                              className="w-full mt-4"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleSkillUnlock(category.id);
                              }}
                              onMouseEnter={() => ui.play("hover")}
                            >
                              <Zap className="w-4 h-4 mr-2" />
                              Unlock Skill (+100 XP)
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

      {/* Legend (translucent) */}
      <section className="surface py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-2xl font-bold mb-8 gradient-text-secondary">
              Skill Tree Legend
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2" onMouseEnter={() => ui.play("hover")}>
                <div className="w-8 h-8 rounded bg-muted mx-auto" />
                <div className="text-sm font-medium">Locked</div>
                <div className="text-xs text-muted-foreground">
                  Level requirement not met
                </div>
              </div>
              <div className="space-y-2" onMouseEnter={() => ui.play("hover")}>
                <div className="w-8 h-8 rounded neon-glow-cyan mx-auto" />
                <div className="text-sm font-medium">Available</div>
                <div className="text-xs text-muted-foreground">
                  Can be explored
                </div>
              </div>
              <div className="space-y-2" onMouseEnter={() => ui.play("hover")}>
                <div className="w-8 h-8 rounded neon-glow-green mx-auto" />
                <div className="text-sm font-medium">Mastered</div>
                <div className="text-xs text-muted-foreground">
                  Skill unlocked & mastered
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
