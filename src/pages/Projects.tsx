import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useGameState } from "@/components/GameHUD";
import { useUiSounds } from "@/components/UiSounds";
import {
  ExternalLink,
  Github,
  Code,
  Smartphone,
  Trophy,
  Zap,
  Shield,
  Brain,
} from "lucide-react";

export const Projects = () => {
  const { trackExploreAction, trackCriticalAction, level } = useGameState();
  const [viewedProjects, setViewedProjects] = useState<string[]>([]);
  const ui = useUiSounds();

  useEffect(() => {
    trackExploreAction("Projects");

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

  const projects = [
    {
      id: "ecommerce-platform",
      title: "E-Commerce Platform",
      description:
        "Full-stack e-commerce solution with payment integration, inventory management, and admin dashboard.",
      longDescription:
        "Built a comprehensive e-commerce platform featuring user authentication, product catalog, shopping cart, payment processing with Stripe, order management, and administrative controls. Implemented responsive design and optimized for performance.",
      image: "/placeholder.svg",
      tags: ["Spring Boot", "React", "PostgreSQL", "Stripe", "Docker"],
      demoUrl: "#",
      repoUrl: "#",
      difficulty: "Master",
      xpReward: 200,
      icon: Code,
      color: "primary",
      features: [
        "User Authentication & Authorization",
        "Product Catalog with Search & Filters",
        "Shopping Cart & Wishlist",
        "Stripe Payment Integration",
        "Order Management System",
        "Admin Dashboard",
        "Responsive Design",
        "Docker Containerization",
      ],
    },
    {
      id: "hospital-management",
      title: "Hospital Management System",
      description:
        "HIPAA-compliant healthcare management system with microservices architecture.",
      longDescription:
        "Developed a secure, scalable hospital management system following HIPAA guidelines. Features patient records, appointment scheduling, billing, and staff management with role-based access control.",
      image: "/placeholder.svg",
      tags: ["Microservices", "PostgreSQL", "Docker", "REST API", "Security"],
      demoUrl: "#",
      repoUrl: "#",
      difficulty: "Master",
      xpReward: 200,
      icon: Shield,
      color: "secondary",
      features: [
        "HIPAA Compliance",
        "Microservices Architecture",
        "Patient Record Management",
        "Appointment Scheduling",
        "Billing System",
        "Role-based Access Control",
        "REST API Design",
        "Security Implementation",
      ],
    },
    {
      id: "mern-ecommerce",
      title: "MERN E-Commerce App",
      description:
        "Modern e-commerce application built with MERN stack and PayPal integration.",
      longDescription:
        "Created a full-featured e-commerce application using MongoDB, Express.js, React, and Node.js. Integrated PayPal for payments and Cloudinary for image management.",
      image: "/placeholder.svg",
      tags: ["React", "Node.js", "MongoDB", "PayPal", "JWT", "Cloudinary"],
      demoUrl: "#",
      repoUrl: "#",
      difficulty: "Adept",
      xpReward: 150,
      icon: Smartphone,
      color: "success",
      features: [
        "MERN Stack Development",
        "PayPal Payment Gateway",
        "JWT Authentication",
        "Image Upload with Cloudinary",
        "Product Reviews & Ratings",
        "Order Tracking",
        "Admin Panel",
        "Responsive UI",
      ],
    },
    {
      id: "ai-analytics",
      title: "AI Analytics Dashboard",
      description:
        "Machine learning-powered analytics platform with real-time data visualization.",
      longDescription:
        "Built an AI-driven analytics dashboard using Python, TensorFlow, and React. Features predictive analytics, real-time data processing, and interactive visualizations.",
      image: "/placeholder.svg",
      tags: ["Python", "TensorFlow", "FastAPI", "React", "Machine Learning"],
      demoUrl: "#",
      repoUrl: "#",
      difficulty: "Master",
      xpReward: 200,
      icon: Brain,
      color: "primary",
      features: [
        "Machine Learning Models",
        "Real-time Data Processing",
        "Interactive Visualizations",
        "Predictive Analytics",
        "FastAPI Backend",
        "TensorFlow Integration",
        "Data Pipeline",
        "Dashboard UI",
      ],
    },
  ];

  const handleProjectView = (projectId: string, xpReward: number) => {
    ui.play("cardclick");
    if (!viewedProjects.includes(projectId)) {
      setViewedProjects((prev) => [...prev, projectId]);
      const projectTitle = projects.find((p) => p.id === projectId)?.title;
      trackCriticalAction(`Viewed project: ${projectTitle}`);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Novice":
        return "success";
      case "Adept":
        return "warning";
      case "Master":
        return "destructive";
      default:
        return "secondary";
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section — translucent */}
      <section className="py-20 pt-24 surface-strong">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <Badge
              variant="secondary"
              className="neon-glow-cyan mb-6 px-4 py-2"
              onMouseEnter={() => ui.play("hover")}
            >
              <Trophy className="w-4 h-4 mr-2" />
              Quest Archive Accessed
            </Badge>

            <h1
              id="projects-title"
              tabIndex={-1}
              className="section-title text-fluid-xl font-bold mb-6"
            >
              Completed Quests
            </h1>

            <p className="text-fluid-md text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Explore the digital realms I've conquered. Each project represents
              a unique challenge, innovative solutions, and lessons learned in
              the art of software development.
            </p>
          </div>
        </div>
      </section>

      {/* Projects Grid — translucent */}
      <section className="py-20 surface">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-2">
              {projects.map((project) => (
                <Card
                  key={project.id}
                  className="card-game card-surface p-6 hover:scale-105 transition-all duration-300 group"
                  onMouseEnter={() => ui.play("cardhover")}
                >
                  {/* Project Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div
                      className={`w-12 h-12 rounded-lg flex items-center justify-center neon-glow-${project.color} group-hover:scale-110 transition-transform`}
                    >
                      <project.icon className="w-6 h-6 text-primary" />
                    </div>

                    <div className="flex gap-2">
                      <Badge
                        variant="outline"
                        className={`border-${getDifficultyColor(
                          project.difficulty
                        )} text-${getDifficultyColor(project.difficulty)}`}
                        onMouseEnter={() => ui.play("hover")}
                      >
                        {project.difficulty}
                      </Badge>
                      <Badge
                        variant="secondary"
                        className="text-xs"
                        onMouseEnter={() => ui.play("hover")}
                      >
                        <Zap className="w-3 h-3 mr-1" />+{project.xpReward} XP
                      </Badge>
                    </div>
                  </div>

                  {/* Project Content */}
                  <div className="space-y-4">
                    <h3 className="text-xl font-semibold text-foreground group-hover:text-primary transition-colors">
                      {project.title}
                    </h3>

                    <p className="text-muted-foreground leading-relaxed">
                      {project.description}
                    </p>

                    {/* Tech Stack */}
                    <div className="flex flex-wrap gap-2">
                      {project.tags.map((tag, index) => (
                        <Badge
                          key={index}
                          variant="outline"
                          className="text-xs"
                          onMouseEnter={() => ui.play("hover")}
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>

                    {/* Key Features */}
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium text-foreground">
                        Key Features:
                      </h4>
                      <div className="grid grid-cols-2 gap-1 text-xs text-muted-foreground">
                        {project.features.slice(0, 4).map((feature, index) => (
                          <div key={index} className="flex items-center gap-1">
                            <div className="w-1 h-1 bg-primary rounded-full" />
                            {feature}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3 pt-4">
                      <Button
                        size="sm"
                        className="flex-1"
                        onClick={() =>
                          handleProjectView(project.id, project.xpReward)
                        }
                        onMouseEnter={() => ui.play("hover")}
                      >
                        <ExternalLink className="w-4 h-4 mr-2" />
                        View Quest
                      </Button>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => ui.play("click")}
                        onMouseEnter={() => ui.play("hover")}
                      >
                        <Github className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Achievement Section — translucent/strong */}
      <section className="py-20 surface-strong">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-8 gradient-text-secondary">
              Quest Statistics
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="space-y-2">
                <div className="text-2xl font-bold gradient-text-primary">
                  {projects.length}
                </div>
                <div className="text-sm text-muted-foreground">
                  Completed Quests
                </div>
              </div>
              <div className="space-y-2">
                <div className="text-2xl font-bold text-success">15+</div>
                <div className="text-sm text-muted-foreground">
                  Technologies Used
                </div>
              </div>
              <div className="space-y-2">
                <div className="text-2xl font-bold gradient-text-secondary">
                  {viewedProjects.length}
                </div>
                <div className="text-sm text-muted-foreground">
                  Quests Explored
                </div>
              </div>
              <div className="space-y-2">
                <div className="text-2xl font-bold text-warning">
                  Level {level}
                </div>
                <div className="text-sm text-muted-foreground">
                  Current Rank
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
