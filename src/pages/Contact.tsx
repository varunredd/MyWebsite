import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useGameState } from "@/components/GameHUD";
import { useToast } from "@/hooks/use-toast";
import { useUiSounds } from "@/components/UiSounds";
import {
  Mail,
  MapPin,
  Phone,
  Send,
  Github,
  Linkedin,
  Twitter,
  MessageSquare,
  Zap,
  Shield,
} from "lucide-react";

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
        title: "Spell Cast Successfully! ⚡",
        description:
          "Your message has been sent through the portal. I'll respond within 24 hours.",
      });
      setFormData({ name: "", email: "", subject: "", message: "" });
    }, 2000);
  };

  const contactInfo = [
    {
      icon: Mail,
      label: "Email Portal",
      value: "varun.reddy.gutha@example.com",
      href: "mailto:varun.reddy.gutha@example.com",
      color: "primary",
    },
    {
      icon: Phone,
      label: "Voice Channel",
      value: "+1 (555) 123-4567",
      href: "tel:+15551234567",
      color: "secondary",
    },
    {
      icon: MapPin,
      label: "Location Marker",
      value: "San Francisco, CA",
      href: "#",
      color: "success",
    },
  ];

  const socialLinks = [
    {
      icon: Github,
      label: "GitHub",
      href: "https://github.com/varunreddy",
      username: "@varunreddy",
      color: "primary",
    },
    {
      icon: Linkedin,
      label: "LinkedIn",
      href: "https://linkedin.com/in/varunreddy",
      username: "/in/varunreddy",
      color: "secondary",
    },
    {
      icon: Twitter,
      label: "Twitter",
      href: "https://twitter.com/varunreddy",
      username: "@varunreddy",
      color: "success",
    },
  ];

  return (
    <div className="min-h-screen pt-16">
      {/* Hero (translucent) */}
      <section className="surface-strong pt-12 pb-10">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <Badge
              variant="secondary"
              className="neon-glow-purple mb-6 px-4 py-2"
              onMouseEnter={() => ui.play("hover")}
            >
              <MessageSquare className="w-4 h-4 mr-2" />
              Communication Portal Active
            </Badge>

            <h1 className="text-fluid-xl font-bold mb-6">
              <span className="gradient-text-primary">Open Portal</span>
            </h1>

            <p className="text-fluid-md text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Ready to embark on a new quest together? Open a communication
              portal and let's discuss your next digital adventure. Every
              message earns you XP!
            </p>
          </div>
        </div>
      </section>

      {/* Body (translucent) */}
      <section className="surface py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <Card className="card-game card-surface p-8">
              <div className="mb-6">
                <h2 className="text-2xl font-bold gradient-text-primary mb-2">
                  Cast Your Message Spell
                </h2>
                <p className="text-muted-foreground">
                  Fill out the form below to send your message through the
                  portal.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">
                      Your Name
                    </label>
                    <Input
                      name="name"
                      placeholder="Enter your name"
                      value={formData.name}
                      onChange={handleInputChange}
                      onFocus={() => ui.play("hover")}
                      required
                      className="card-surface border-card-border"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">
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
                      className="card-surface border-card-border"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    Subject
                  </label>
                  <Input
                    name="subject"
                    placeholder="What's this quest about?"
                    value={formData.subject}
                    onChange={handleInputChange}
                    onFocus={() => ui.play("hover")}
                    required
                    className="card-surface border-card-border"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    Message
                  </label>
                  <Textarea
                    name="message"
                    placeholder="Describe your quest, project ideas, or just say hello..."
                    value={formData.message}
                    onChange={handleInputChange}
                    onFocus={() => ui.play("hover")}
                    required
                    rows={6}
                    className="card-surface border-card-border resize-none"
                  />
                </div>

                <Button
                  type="submit"
                  size="lg"
                  className="w-full neon-glow-cyan"
                  disabled={isSubmitting}
                  onMouseEnter={() => ui.play("hover")}
                >
                  {isSubmitting ? (
                    <>
                      <Shield className="w-5 h-5 mr-2 animate-spin" />
                      Casting Spell...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5 mr-2" />
                      Send Message (+100 XP)
                    </>
                  )}
                </Button>

                <div className="text-center">
                  <Badge
                    variant="outline"
                    className="text-xs"
                    onMouseEnter={() => ui.play("hover")}
                  >
                    <Zap className="w-3 h-3 mr-1" />
                    Sending a message grants 100 XP and the "Message Caster"
                    badge
                  </Badge>
                </div>
              </form>
            </Card>

            {/* Contact Info & Social */}
            <div className="space-y-8">
              {/* Contact Information */}
              <Card className="card-game card-surface p-6">
                <h3 className="text-xl font-semibold gradient-text-secondary mb-6">
                  Alternative Portals
                </h3>

                <div className="space-y-3">
                  {contactInfo.map((info, index) => (
                    <a
                      key={index}
                      href={info.href}
                      className="flex items-center gap-4 p-4 rounded-lg card-surface hover:neon-glow-cyan transition"
                      onMouseEnter={() => ui.play("cardhover")}
                      onClick={() => ui.play("nav")}
                    >
                      <div
                        className={`w-10 h-10 rounded-lg flex items-center justify-center neon-glow-${info.color} group-hover:scale-110 transition-transform`}
                      >
                        <info.icon className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">
                          {info.label}
                        </div>
                        <div className="font-medium text-foreground">
                          {info.value}
                        </div>
                      </div>
                    </a>
                  ))}
                </div>
              </Card>

              {/* Social Links */}
              <Card className="card-game card-surface p-6">
                <h3 className="text-xl font-semibold gradient-text-primary mb-6">
                  Social Channels
                </h3>

                <div className="space-y-3">
                  {socialLinks.map((social, index) => (
                    <a
                      key={index}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-4 p-4 rounded-lg card-surface hover:neon-glow-cyan transition"
                      onMouseEnter={() => ui.play("cardhover")}
                      onClick={() => ui.play("nav")}
                    >
                      <div
                        className={`w-10 h-10 rounded-lg flex items-center justify-center neon-glow-${social.color} group-hover:scale-110 transition-transform`}
                      >
                        <social.icon className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <div className="font-medium text-foreground">
                          {social.label}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {social.username}
                        </div>
                      </div>
                    </a>
                  ))}
                </div>
              </Card>

              {/* Response Time */}
              <Card
                className="card-game card-surface p-6 text-center"
                onMouseEnter={() => ui.play("cardhover")}
              >
                <div className="w-16 h-16 mx-auto mb-4 rounded-full neon-glow-green flex items-center justify-center">
                  <MessageSquare className="w-8 h-8 text-success" />
                </div>
                <h4 className="text-lg font-semibold text-foreground mb-2">
                  Quick Response Guaranteed
                </h4>
                <p className="text-sm text-muted-foreground">
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
