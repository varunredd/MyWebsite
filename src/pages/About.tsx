import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { useGameState } from "@/components/GameHUD";
import { useUiSounds } from "@/components/UiSounds";
import {
  GraduationCap,
  Briefcase,
  Award,
  MapPin,
  Calendar,
} from "lucide-react";

export const About = () => {
  const { trackExploreAction } = useGameState();
  const location = useLocation();
  const ui = useUiSounds();

  useEffect(() => {
    trackExploreAction("About");

    // (your existing scroll logic, unchanged)
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
  }, [trackExploreAction, location]);

  const experiences = [
    {
      title: "Software Engineer",
      company: "Brane Enterprises Pvt. Ltd.",
      period: "2022 — 2024 (2 yrs)",
      description:
        "Built and shipped end to end features, including APIs, CI/CD, and documentation, and kept the product fast and reliable in production.",
      skills: [
        "React",
        "TypeScript",
        "Node.js",
        "Spring Boot",
        ".NET Core",
        ".NET Framework",
        "Asp.Net",
        "C#",
        "Java",
        "PostgreSQL",
        "MongoDB",
        "Docker",
        "CI/CD",
        "AWS",
      ],
      icon: Briefcase,
      color: "primary",
    },
  ];

  const education = [
    {
      degree: "Master of Science in Computer Science",
      school: "University of North Carolina at Charlotte",
      period: "Jan 2025 — Present (ETA  May  2026)",
      description:
        "Graduate study focused on building reliable, user-centered software. Coursework: Software Development—Design & Implementation, Data Structures & Algorithms, Machine Learning, Computer Communication & Networks, Mobile Application Development, Artificial Intelligence, and Data Mining.",
      icon: GraduationCap,
      color: "primary",
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section — translucent & slightly stronger for readability */}
      <section className="py-20 pt-24 surface-strong">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <Badge
              variant="secondary"
              className="neon-glow-purple mb-6 px-4 py-2"
              onMouseEnter={() => ui.play("hover")}
            >
              <Award className="w-4 h-4 mr-2" />
              Character Profile Unlocked
            </Badge>

            <h1
              id="origin-title"
              tabIndex={-1}
              className="section-title text-fluid-xl font-bold mb-6"
            >
              Origin Story
            </h1>

            <p className="text-fluid-md text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              I build software to turn ideas into products people trust. My
              compass is simple: clean architecture, performance, security, and
              respect for the user. This is that journey.
            </p>
          </div>
        </div>
      </section>

      {/* Experience Timeline — translucent surface */}
      <section className="py-20 surface">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-16 gradient-text-secondary">
              Experience Quest Log
            </h2>

            <div className="space-y-8">
              {experiences.map((exp, index) => (
                <div key={index} className="relative">
                  {index < experiences.length - 1 && (
                    <div className="absolute left-6 top-16 w-px h-full bg-card-border/70" />
                  )}

                  <Card
                    className="card-game card-surface p-6 ml-16 hover:scale-105 transition-transform duration-200"
                    onMouseEnter={() => ui.play("cardhover")}
                    onClick={() => ui.play("cardclick")}
                  >
                    <div className="absolute -left-16 top-6">
                      <div
                        className={`w-12 h-12 rounded-full flex items-center justify-center neon-glow-${exp.color}`}
                      >
                        <exp.icon className="w-6 h-6 text-primary" />
                      </div>
                    </div>

                    <div
                      className="space-y-4"
                      onMouseEnter={() => ui.play("hover")}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                        <h3 className="text-xl font-semibold text-foreground">
                          {exp.title}
                        </h3>
                        <Badge
                          variant="outline"
                          className="self-start sm:self-center"
                          onMouseEnter={() => ui.play("hover")}
                        >
                          <Calendar className="w-3 h-3 mr-1" />
                          {exp.period}
                        </Badge>
                      </div>

                      <div className="flex items-center gap-2 text-muted-foreground">
                        <MapPin className="w-4 h-4" />
                        <span>{exp.company}</span>
                      </div>

                      <p className="text-muted-foreground leading-relaxed">
                        {exp.description}
                      </p>

                      <div className="flex flex-wrap gap-2">
                        {exp.skills.map((skill, skillIndex) => (
                          <Badge
                            key={skillIndex}
                            variant="secondary"
                            className="text-xs"
                          >
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </Card>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Education Section — translucent surface */}
      <section className="py-20 surface">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-16 gradient-text-primary">
              Education & Training
            </h2>

            {education.map((edu, index) => (
              <Card
                key={index}
                className="card-game card-surface p-8 hover:scale-105 transition-transform duration-200"
                onMouseEnter={() => ui.play("cardhover")}
                onClick={() => ui.play("cardclick")}
              >
                <div className="flex items-start gap-6">
                  <div
                    className={`w-16 h-16 rounded-full flex items-center justify-center neon-glow-${edu.color} flex-shrink-0`}
                  >
                    <edu.icon className="w-8 h-8 text-primary" />
                  </div>

                  <div
                    className="space-y-4 flex-1"
                    onMouseEnter={() => ui.play("hover")}
                  >
                    <div>
                      <h3 className="text-2xl font-semibold text-foreground mb-2">
                        {edu.degree}
                      </h3>
                      <div className="flex items-center gap-4 text-muted-foreground">
                        <span>{edu.school}</span>
                        <Badge variant="outline">
                          <Calendar className="w-3 h-3 mr-1" />
                          {edu.period}
                        </Badge>
                      </div>
                    </div>

                    <p className="text-muted-foreground leading-relaxed">
                      {edu.description}
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Personal Mission — stronger surface for long paragraph */}
      <section className="py-20 surface-strong">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-8 gradient-text-secondary">
              Personal Mission
            </h2>

            <Card
              className="card-game card-surface p-8"
              onMouseEnter={() => ui.play("cardhover")}
            >
              <p className="text-lg text-muted-foreground leading-relaxed">
                Reliability by default, speed by design products that are ready
                for growth.
              </p>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
};
