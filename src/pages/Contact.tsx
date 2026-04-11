import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useGameState } from "@/components/GameHUD";
import { useToast } from "@/hooks/use-toast";
import { useUiSounds } from "@/components/UiSounds";
import { personal } from "@/data/resumeData";
import {
  Mail,
  MapPin,
  Phone,
  Send,
  Github,
  Linkedin,
  MessageSquare,
  Zap,
  Shield,
  Sparkles,
} from "lucide-react";

const contactAccentStyles = [
  {
    wrap: "border-primary/25 bg-primary/10 hover:neon-glow-cyan",
    icon: "text-primary",
  },
  {
    wrap: "border-secondary/25 bg-secondary/10 hover:neon-glow-purple",
    icon: "text-secondary",
  },
  {
    wrap: "border-success/25 bg-success/10 hover:neon-glow-green",
    icon: "text-success",
  },
] as const;

const socialAccentStyles = [
  {
    wrap: "border-primary/25 bg-primary/10 hover:neon-glow-cyan",
    icon: "text-primary",
  },
  {
    wrap: "border-secondary/25 bg-secondary/10 hover:neon-glow-purple",
    icon: "text-secondary",
  },
] as const;

export const Contact = () => {
  const { trackExploreAction, trackCriticalAction } = useGameState();
  const { toast } = useToast();
  const ui = useUiSounds();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    trackExploreAction("Contact");
  }, [trackExploreAction]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    ui.play("cardclick");
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      trackCriticalAction("Contact form submitted");
      toast({
        title: "Message Sent! ⚡",
        description:
          "Your message has been sent. I'll respond within 24 hours.",
      });
      setFormData({ name: "", email: "", subject: "", message: "" });
    }, 2000);
  };

  const contactInfo = [
    {
      icon: Mail,
      label: "Email",
      value: personal.email,
      href: `mailto:${personal.email}`,
    },
    {
      icon: Phone,
      label: "Phone",
      value: personal.phone,
      href: `tel:${personal.phone.replace(/-/g, "")}`,
    },
    {
      icon: MapPin,
      label: "Location",
      value: personal.location,
      href: "#",
    },
  ];

  const socialLinks = [
    {
      icon: Github,
      label: "GitHub",
      href: personal.github,
      username: personal.githubHandle,
    },
    {
      icon: Linkedin,
      label: "LinkedIn",
      href: personal.linkedin,
      username: personal.linkedinHandle,
    },
  ];

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
              <MessageSquare className="mr-2 h-4 w-4" />
              Get in Touch
            </Badge>

            <h1 className="mb-6 text-fluid-xl font-orbitron font-bold">
              <span
                className="glitch-text gradient-text-primary"
                data-text="Contact Me"
              >
                Contact Me
              </span>
            </h1>

            <p className="mx-auto max-w-3xl text-fluid-md leading-relaxed text-muted-foreground font-rajdhani">
            Have a project idea or want to connect? 
            Drop me a message and I&apos;ll get back to you.
            </p>
          </div>
        </div>
      </section>

      {/* ═══════════ BODY ═══════════ */}
      <section className="relative py-12 surface">
        <div className="circuit-border absolute left-0 top-0 w-full" />

        <div className="container relative z-10 mx-auto px-4">
          <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[1.05fr_0.95fr]">
            {/* Form */}
            <Card className="holo-card card-game card-surface rounded-2xl p-7 sm:p-8">
              <div className="mb-6">
                <h2 className="mb-2 text-2xl sm:text-3xl font-orbitron font-bold gradient-text-primary">
                  Send a Message
                </h2>
                <p className="text-[1.05rem] leading-relaxed text-muted-foreground font-rajdhani">
                Fill out the form below and I&apos;ll respond within 24 hours.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-sm uppercase tracking-wider text-foreground font-rajdhani">
                      Your Name
                    </label>
                    <Input
                      name="name"
                      placeholder="Enter your name"
                      value={formData.name}
                      onChange={handleInputChange}
                      onFocus={() => ui.play("hover")}
                      required
                      className="h-12 border-white/10 bg-background/35 font-rajdhani"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm uppercase tracking-wider text-foreground font-rajdhani">
                      Email Address
                    </label>
                    <Input
                      name="email"
                      type="email"
                      placeholder="your.email@example.com"
                      value={formData.email}
                      onChange={handleInputChange}
                      onFocus={() => ui.play("hover")}
                      required
                      className="h-12 border-white/10 bg-background/35 font-rajdhani"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm uppercase tracking-wider text-foreground font-rajdhani">
                    Subject
                  </label>
                  <Input
                    name="subject"
                    placeholder="What&apos;s this about?"
                    value={formData.subject}
                    onChange={handleInputChange}
                    onFocus={() => ui.play("hover")}
                    required
                    className="h-12 border-white/10 bg-background/35 font-rajdhani"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm uppercase tracking-wider text-foreground font-rajdhani">
                    Message
                  </label>
                  <Textarea
                    name="message"
                    placeholder="Describe your project, ideas, or just say hello..."
                    value={formData.message}
                    onChange={handleInputChange}
                    onFocus={() => ui.play("hover")}
                    required
                    rows={7}
                    className="min-h-[180px] resize-none border-white/10 bg-background/35 font-rajdhani"
                  />
                </div>

                <Button
                  type="submit"
                  size="lg"
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-rajdhani tracking-wider uppercase shadow-[0_0_22px_hsl(var(--primary)/0.30)]"
                  disabled={isSubmitting}
                  onMouseEnter={() => ui.play("hover")}
                >
                  {isSubmitting ? (
                    <>
                      <Shield className="mr-2 h-5 w-5 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="mr-2 h-5 w-5" />
                      Send Message
                    </>
                  )}
                </Button>

                <div className="text-center">
                  <Badge
                    variant="outline"
                    className="border-white/10 bg-background/30 px-3 py-1 text-xs font-rajdhani tracking-wide"
                    onMouseEnter={() => ui.play("hover")}
                  >
                    <Zap className="mr-1.5 h-3 w-3" />
                    I typically respond within 24 hours
                  </Badge>
                </div>
              </form>
            </Card>

            {/* Info column */}
            <div className="space-y-8">
              <Card className="holo-card card-game card-surface rounded-2xl p-6 sm:p-7">
                <h3 className="mb-6 text-2xl font-orbitron font-semibold gradient-text-secondary">
                Contact Info
                </h3>

                <div className="space-y-3">
                  {contactInfo.map((info, index) => {
                    const Icon = info.icon;
                    const accent =
                      contactAccentStyles[index % contactAccentStyles.length];

                    return (
                      <a
                        key={index}
                        href={info.href}
                        className="flex items-center gap-4 rounded-xl border border-white/6 bg-background/20 p-4 transition-all duration-300 hover:bg-background/35"
                        onMouseEnter={() => ui.play("cardhover")}
                        onClick={() => ui.play("nav")}
                      >
                        <div
                          className={`flex h-11 w-11 items-center justify-center rounded-xl border transition-all duration-300 ${accent.wrap}`}
                        >
                          <Icon className={`h-5 w-5 ${accent.icon}`} />
                        </div>

                        <div>
                          <div className="text-sm text-muted-foreground font-rajdhani">
                            {info.label}
                          </div>
                          <div className="text-lg font-semibold text-foreground font-rajdhani">
                            {info.value}
                          </div>
                        </div>
                      </a>
                    );
                  })}
                </div>
              </Card>

              <Card className="holo-card card-game card-surface rounded-2xl p-6 sm:p-7">
                <h3 className="mb-6 text-2xl font-orbitron font-semibold gradient-text-primary">
                  Social Channels
                </h3>

                <div className="space-y-3">
                  {socialLinks.map((social, index) => {
                    const Icon = social.icon;
                    const accent =
                      socialAccentStyles[index % socialAccentStyles.length];

                    return (
                      <a
                        key={index}
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-4 rounded-xl border border-white/6 bg-background/20 p-4 transition-all duration-300 hover:bg-background/35"
                        onMouseEnter={() => ui.play("cardhover")}
                        onClick={() => ui.play("nav")}
                      >
                        <div
                          className={`flex h-11 w-11 items-center justify-center rounded-xl border transition-all duration-300 ${accent.wrap}`}
                        >
                          <Icon className={`h-5 w-5 ${accent.icon}`} />
                        </div>

                        <div>
                          <div className="text-lg font-semibold text-foreground font-rajdhani">
                            {social.label}
                          </div>
                          <div className="text-sm text-muted-foreground font-rajdhani">
                            {social.username}
                          </div>
                        </div>
                      </a>
                    );
                  })}
                </div>
              </Card>

              <Card
                className="holo-card card-game card-surface rounded-2xl p-7 text-center"
                onMouseEnter={() => ui.play("cardhover")}
              >
                <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full border border-success/25 bg-success/10 neon-glow-green">
                  <MessageSquare className="h-8 w-8 text-success" />
                </div>

                <h4 className="mb-3 text-2xl font-orbitron font-semibold text-foreground">
                  Quick Response Guaranteed
                </h4>

                <p className="mx-auto max-w-md text-[1.02rem] leading-relaxed text-muted-foreground font-rajdhani">
                  I typically respond within 24 hours. For urgent matters, feel
                  free to reach out via phone or LinkedIn.
                </p>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};