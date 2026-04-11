import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { useGameState } from "@/components/GameHUD";
import { useUiSounds } from "@/components/UiSounds";
import { personal, experience, education } from "@/data/resumeData";
import {
  GraduationCap,
  Briefcase,
  Award,
  MapPin,
  Calendar,
  Target,
} from "lucide-react";

export const About = () => {
  const { trackExploreAction } = useGameState();
  const location = useLocation();
  const ui = useUiSounds();

  useEffect(() => {
    trackExploreAction("About");

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
              <Award className="mr-2 h-4 w-4" />
              Character Profile Unlocked
            </Badge>

            <h1
              id="origin-title"
              tabIndex={-1}
              className="mb-6 text-fluid-xl font-orbitron font-bold"
            >
              <span
                className="glitch-text gradient-text-primary"
                data-text="Origin Story"
              >
                Origin Story
              </span>
            </h1>

            <p className="mx-auto max-w-3xl text-fluid-md leading-relaxed text-muted-foreground font-rajdhani">
              {personal.mission} This is that journey.
            </p>
          </div>
        </div>
      </section>

      {/* ═══════════ EXPERIENCE ═══════════ */}
      <section className="relative py-20 surface">
        <div className="circuit-border absolute left-0 top-0 w-full" />

        <div className="container relative z-10 mx-auto px-4">
          <div className="mx-auto max-w-5xl">
            <div className="mb-16 text-center">
              <h2 className="text-3xl sm:text-4xl font-orbitron font-bold gradient-text-secondary neon-underline">
                Experience Quest Log
              </h2>
            </div>

            <div className="relative">
              <div className="absolute bottom-4 left-[1.05rem] top-4 hidden w-px bg-gradient-to-b from-primary/0 via-primary/40 to-secondary/0 md:block" />

              <div className="space-y-10">
                {experience.map((exp, index) => (
                  <div key={index} className="relative md:pl-20">
                    <div className="absolute left-0 top-8 hidden h-9 w-9 items-center justify-center rounded-xl border border-primary/30 bg-background/80 backdrop-blur md:flex neon-glow-cyan">
                      <Briefcase className="h-4 w-4 text-primary" />
                    </div>

                    <Card
                      className="group holo-card card-game card-surface rounded-2xl p-6 sm:p-7 transition-all duration-300 hover:-translate-y-1"
                      onMouseEnter={() => ui.play("cardhover")}
                      onClick={() => ui.play("cardclick")}
                    >
                      <div
                        className="space-y-5"
                        onMouseEnter={() => ui.play("hover")}
                      >
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                          <div className="space-y-2">
                            <div className="flex items-center gap-3 md:hidden">
                              <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-primary/30 bg-background/80 backdrop-blur neon-glow-cyan">
                                <Briefcase className="h-4 w-4 text-primary" />
                              </div>
                              <h3 className="text-xl sm:text-2xl font-orbitron font-semibold text-foreground">
                                {exp.role}
                              </h3>
                            </div>

                            <h3 className="hidden text-xl sm:text-2xl font-orbitron font-semibold text-foreground md:block">
                              {exp.role}
                            </h3>

                            <div className="flex items-center gap-2 text-muted-foreground font-rajdhani">
                              <MapPin className="h-4 w-4 text-primary/80" />
                              <span>
                                {exp.company} · {exp.location}
                              </span>
                            </div>
                          </div>

                          <Badge
                            variant="outline"
                            className="self-start border-primary/20 bg-background/40 px-3 py-1 font-rajdhani tracking-wide"
                            onMouseEnter={() => ui.play("hover")}
                          >
                            <Calendar className="mr-1.5 h-3.5 w-3.5" />
                            {exp.dates}
                          </Badge>
                        </div>

                        <p className="leading-relaxed text-muted-foreground font-rajdhani text-[1.05rem]">
                          {exp.description}
                        </p>

                        <div className="flex flex-wrap gap-2.5">
                          {exp.skills.map((skill, skillIndex) => (
                            <Badge
                              key={skillIndex}
                              variant="secondary"
                              className="border border-white/10 bg-secondary/85 px-3 py-1 text-[11px] font-rajdhani tracking-wider uppercase text-secondary-foreground"
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
        </div>
      </section>

      {/* ═══════════ EDUCATION ═══════════ */}
      <section className="relative py-20 surface">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-5xl">
            <div className="mb-16 text-center">
              <h2 className="text-3xl sm:text-4xl font-orbitron font-bold gradient-text-primary neon-underline">
                Education & Training
              </h2>
            </div>

            <div className="space-y-8">
              {education.map((edu, index) => (
                <Card
                  key={index}
                  className="group holo-card card-game card-surface rounded-2xl p-7 sm:p-8 transition-all duration-300 hover:-translate-y-1"
                  onMouseEnter={() => ui.play("cardhover")}
                  onClick={() => ui.play("cardclick")}
                >
                  <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
                    <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl border border-primary/30 bg-background/70 backdrop-blur neon-glow-cyan">
                      <GraduationCap className="h-7 w-7 text-primary" />
                    </div>

                    <div
                      className="flex-1 space-y-4"
                      onMouseEnter={() => ui.play("hover")}
                    >
                      <div className="space-y-3">
                        <h3 className="text-2xl sm:text-3xl font-orbitron font-semibold text-foreground">
                          {edu.degree}
                        </h3>

                        <div className="flex flex-wrap items-center gap-4 text-muted-foreground font-rajdhani">
                          <span>{edu.school}</span>

                          <Badge
                            variant="outline"
                            className="border-primary/20 bg-background/40 px-3 py-1 font-rajdhani tracking-wide"
                          >
                            <Calendar className="mr-1.5 h-3.5 w-3.5" />
                            {edu.dates}
                          </Badge>
                        </div>
                      </div>

                      <p className="leading-relaxed text-muted-foreground font-rajdhani text-[1.05rem]">
                        {edu.description}
                      </p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════ PERSONAL MISSION ═══════════ */}
      <section className="relative py-20 surface-strong">
        <div className="circuit-border absolute left-0 top-0 w-full opacity-70" />

        <div className="container relative z-10 mx-auto px-4">
          <div className="mx-auto max-w-4xl text-center">
            <h2 className="mb-10 text-3xl sm:text-4xl font-orbitron font-bold gradient-text-secondary neon-underline">
              Personal Mission
            </h2>

            <Card
              className="holo-card card-game card-surface rounded-2xl p-8 sm:p-10"
              onMouseEnter={() => ui.play("cardhover")}
              onClick={() => ui.play("cardclick")}
            >
              <div className="mx-auto flex max-w-3xl flex-col items-center gap-5">
                <Badge
                  variant="secondary"
                  className="border border-primary/20 bg-primary/10 px-4 py-1.5 font-rajdhani tracking-wider uppercase text-foreground"
                  onMouseEnter={() => ui.play("hover")}
                >
                  <Target className="mr-2 h-4 w-4" />
                  Core Directive
                </Badge>

                <p className="text-lg sm:text-xl leading-relaxed text-muted-foreground font-rajdhani">
                  Reliability by default, speed by design — products that are
                  ready for growth.
                </p>
              </div>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
};