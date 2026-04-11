import { useEffect, useMemo, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Clock,
  Search,
  BookOpen,
  Award,
  Sparkles,
  ScrollText,
} from "lucide-react";
import { useGameState } from "@/components/GameHUD";
import { Link } from "react-router-dom";
import { useUiSounds } from "@/components/UiSounds";

interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  readingTime: string;
  tags: string[];
  difficulty: "Novice" | "Adept" | "Master";
  xpReward: number;
}

const blogPosts: BlogPost[] = [
  {
    slug: "building-scalable-apis-with-spring-boot",
    title: "Building Scalable APIs with Spring Boot",
    excerpt:
      "Learn how to create production-ready REST APIs with Spring Boot, including pagination, JWT authentication, and performance optimization techniques.",
    date: "2025-08-15",
    readingTime: "8 min",
    tags: ["Backend", "Java", "APIs"],
    difficulty: "Adept",
    xpReward: 150,
  },
  {
    slug: "from-react-to-production-with-docker-and-nginx",
    title: "From React to Production with Docker and serving them efficiently with NGINX",
    excerpt:
      "Complete guide to containerizing React applications with Docker and serving them efficiently with NGINX in production environments.",
    date: "2025-08-10",
    readingTime: "7 min",
    tags: ["Frontend", "DevOps", "Docker"],
    difficulty: "Novice",
    xpReward: 100,
  },
  {
    slug: "practical-ml-pipelines-fastapi-tensorflow",
    title: "Practical ML Pipelines with FastAPI and TensorFlow",
    excerpt:
      "Build production-ready machine learning APIs with FastAPI and TensorFlow, including model serving, batch processing, and performance optimization.",
    date: "2025-08-05",
    readingTime: "10 min",
    tags: ["AI/ML", "Python", "FastAPI"],
    difficulty: "Master",
    xpReward: 200,
  },
];

export const Blog = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState("all");
  const [selectedDifficulty, setSelectedDifficulty] = useState("all");
  const { trackExploreAction } = useGameState();
  const ui = useUiSounds();

  useEffect(() => {
    trackExploreAction("Blog");
  }, [trackExploreAction]);

  const filteredPosts = useMemo(() => {
    let filtered = blogPosts;

    if (searchQuery) {
      filtered = filtered.filter(
        (post) =>
          post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          post.excerpt.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedTag !== "all") {
      filtered = filtered.filter((post) => post.tags.includes(selectedTag));
    }

    if (selectedDifficulty !== "all") {
      filtered = filtered.filter(
        (post) => post.difficulty === selectedDifficulty
      );
    }

    return filtered;
  }, [searchQuery, selectedTag, selectedDifficulty]);

  const allTags = Array.from(new Set(blogPosts.flatMap((post) => post.tags)));

  const totalMinutes = blogPosts.reduce(
    (acc, post) => acc + parseInt(post.readingTime),
    0
  );

  const getDifficultyClasses = (difficulty: string) => {
    switch (difficulty) {
      case "Novice":
        return "border-success/30 bg-success/10 text-success";
      case "Adept":
        return "border-warning/30 bg-warning/10 text-warning";
      case "Master":
        return "border-destructive/30 bg-destructive/10 text-destructive";
      default:
        return "border-white/10 bg-background/30 text-muted-foreground";
    }
  };

  return (
    <div className="min-h-screen">
      {/* ═══════════ HERO ═══════════ */}
      <section className="relative overflow-hidden pt-28 sm:pt-32 lg:pt-36 surface-strong">
        <div className="scanline-overlay" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(0,245,255,0.08),transparent_38%),radial-gradient(circle_at_bottom,rgba(217,70,239,0.07),transparent_34%)]" />

        <div className="container relative z-10 mx-auto max-w-7xl px-4 py-20 md:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl text-center">
            <Badge
              variant="secondary"
              className="neon-glow-cyan mb-6 px-5 py-2 text-sm font-rajdhani tracking-wider uppercase"
              onMouseEnter={() => ui.play("hover")}
            >
              <Sparkles className="mr-2 h-4 w-4" />
              Blog
            </Badge>

            <h1 className="mb-6 text-fluid-xl font-orbitron font-bold">
              <span
                className="glitch-text gradient-text-primary"
                data-text="Blog"
              >
                Blog
              </span>
            </h1>

            <p className="mx-auto max-w-3xl text-fluid-md leading-relaxed text-muted-foreground font-rajdhani">
              Notes on things I'm learning and building — backend systems, ML pipelines, and the tools behind them.
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-6">
              <div
                className="flex items-center gap-2 text-muted-foreground font-rajdhani"
                onMouseEnter={() => ui.play("hover")}
              >
                <Award className="h-5 w-5 text-primary" />
                <span>{blogPosts.length} Blog Posts</span>
              </div>

              <div
                className="flex items-center gap-2 text-muted-foreground font-rajdhani"
                onMouseEnter={() => ui.play("hover")}
              >
                <Clock className="h-5 w-5 text-secondary" />
                <span>{totalMinutes} min total</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════ FILTERS ═══════════ */}
      <section className="relative py-6 surface">
        <div className="circuit-border absolute left-0 top-0 w-full" />

        <div className="container relative z-10 mx-auto max-w-7xl px-4 md:px-6 lg:px-8">
          <div className="grid gap-4 lg:grid-cols-[1fr_220px_220px]">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search entries..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => ui.play("hover")}
                className="h-12 border-white/10 bg-background/35 pl-10 font-rajdhani"
              />
            </div>

            <Select
              value={selectedTag}
              onValueChange={(v) => {
                setSelectedTag(v);
                ui.play("click");
              }}
            >
              <SelectTrigger
                className="h-12 w-full border-white/10 bg-background/35 font-rajdhani"
                onMouseEnter={() => ui.play("hover")}
              >
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {allTags.map((tag) => (
                  <SelectItem key={tag} value={tag}>
                    {tag}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={selectedDifficulty}
              onValueChange={(v) => {
                setSelectedDifficulty(v);
                ui.play("click");
              }}
            >
              <SelectTrigger
                className="h-12 w-full border-white/10 bg-background/35 font-rajdhani"
                onMouseEnter={() => ui.play("hover")}
              >
                <SelectValue placeholder="Select difficulty" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Difficulties</SelectItem>
                <SelectItem value="Novice">Novice</SelectItem>
                <SelectItem value="Adept">Adept</SelectItem>
                <SelectItem value="Master">Master</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </section>

      {/* ═══════════ POSTS ═══════════ */}
      <section className="py-10 surface">
        <div className="container mx-auto max-w-7xl px-4 md:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {filteredPosts.map((post) => (
              <Card
                key={post.slug}
                className="group holo-card card-game card-surface h-full rounded-2xl transition-all duration-300 hover:-translate-y-1 flex flex-col"
                onMouseEnter={() => ui.play("cardhover")}
              >
                <CardHeader className="p-5 md:p-6">
                  <div className="mb-3 flex items-start justify-between gap-3">
                    <Badge
                      className={`border px-3 py-1 font-rajdhani tracking-wide ${getDifficultyClasses(
                        post.difficulty
                      )}`}
                      onMouseEnter={() => ui.play("hover")}
                    >
                      {post.difficulty}
                    </Badge>

                    <div
                      className="flex items-center gap-1.5 text-primary font-rajdhani"
                      onMouseEnter={() => ui.play("hover")}
                    >
                      <Award className="h-4 w-4" />
                      <span className="text-sm font-medium">
                        {post.xpReward} XP
                      </span>
                    </div>
                  </div>

                  <CardTitle className="min-h-[72px] text-2xl font-orbitron leading-tight text-foreground transition-colors duration-300 group-hover:text-primary">
                    {post.title}
                  </CardTitle>

                  <CardDescription className="min-h-[112px] pt-2 text-[1.05rem] leading-relaxed text-muted-foreground font-rajdhani">
                    {post.excerpt}
                  </CardDescription>
                </CardHeader>

                <CardContent className="mt-auto flex flex-col gap-4 p-5 pt-0 md:p-6 md:pt-0">
                  <div className="flex items-center justify-between text-sm text-muted-foreground font-rajdhani">
                    <span>{new Date(post.date).toLocaleDateString()}</span>
                    <div className="flex items-center gap-1.5">
                      <Clock className="h-4 w-4" />
                      <span>{post.readingTime}</span>
                    </div>
                  </div>

                  <div className="min-h-[68px] flex flex-wrap content-start gap-2">
                    {post.tags.map((tag) => (
                      <Badge
                        key={tag}
                        variant="outline"
                        className="rounded-full border-white/10 bg-background/30 px-3 py-1 text-xs font-rajdhani tracking-wide"
                        onMouseEnter={() => ui.play("hover")}
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  <Link
                    to={`/blog/${post.slug}`}
                    onMouseEnter={() => ui.play("hover")}
                    onClick={() => ui.play("cardclick")}
                    className="mt-auto"
                  >
                    <Button
                      className="w-full font-rajdhani tracking-wider uppercase"
                      variant="outline"
                    >
                      <ScrollText className="mr-2 h-4 w-4" />
                      Read Entry
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredPosts.length === 0 && (
            <div className="py-16 text-center">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl border border-white/10 bg-background/35">
                <BookOpen className="h-10 w-10 text-muted-foreground" />
              </div>

              <h3 className="mt-6 text-2xl font-orbitron font-semibold text-foreground">
               No posts found
              </h3>

              <p className="mx-auto mt-3 max-w-md text-muted-foreground font-rajdhani">
                Try changing the search terms or filters.
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};