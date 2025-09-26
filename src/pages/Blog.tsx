import { useEffect, useState } from "react";
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
import { Clock, Search, BookOpen, Award } from "lucide-react";
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
    title: "From React to Production with Docker and NGINX",
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
  const [filteredPosts, setFilteredPosts] = useState(blogPosts);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState("all");
  const [selectedDifficulty, setSelectedDifficulty] = useState("all");
  const { trackExploreAction, trackBlogRead } = useGameState();
  const ui = useUiSounds();

  useEffect(() => {
    trackExploreAction("Blog");
  }, [trackExploreAction]);

  useEffect(() => {
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
    setFilteredPosts(filtered);
  }, [searchQuery, selectedTag, selectedDifficulty]);

  const allTags = Array.from(new Set(blogPosts.flatMap((post) => post.tags)));

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Novice":
        return "bg-green-500/20 text-green-400";
      case "Adept":
        return "bg-yellow-500/20 text-yellow-400";
      case "Master":
        return "bg-red-500/20 text-red-400";
      default:
        return "bg-gray-500/20 text-gray-400";
    }
  };

  return (
    // CHANGED: make page a flex column that fills the viewport
    <div className="min-h-screen flex flex-col">
      {/* Hero */}
      <section className="surface-strong pt-24 pb-12">
        <div className="container max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <BookOpen className="w-8 h-8 text-primary" />
              <h1 className="text-4xl md:text-5xl font-bold gradient-text-primary">
                Lore & Tech Codex
              </h1>
            </div>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Embark on knowledge quests through the realms of technology. Each
              scroll grants experience and unlocks new abilities.
            </p>
            <div className="flex items-center justify-center gap-6 mt-6">
              <div
                className="flex items-center gap-2"
                onMouseEnter={() => ui.play("hover")}
              >
                <Award className="w-5 h-5 text-primary" />
                <span className="text-sm text-muted-foreground">
                  {blogPosts.length} Codex Entries
                </span>
              </div>
              <div
                className="flex items-center gap-2"
                onMouseEnter={() => ui.play("hover")}
              >
                <Clock className="w-5 h-5 text-secondary" />
                <span className="text-sm text-muted-foreground">
                  {blogPosts.reduce(
                    (acc, post) => acc + parseInt(post.readingTime),
                    0
                  )}{" "}
                  min total
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="surface py-6">
        <div className="container max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search scrolls..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => ui.play("hover")}
                className="pl-10"
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
                className="w-full sm:w-48"
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
                className="w-full sm:w-48"
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

      {/* Posts (fills remaining height) */}
      <section className="surface py-10 flex-1">
        <div className="container max-w-7xl mx-auto px-4 md:px-6 lg:px-8 h-full">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6 lg:gap-8">
            {filteredPosts.map((post) => (
              <Card
                key={post.slug}
                className="card-game card-surface hover:neon-glow-cyan transition-all duration-300 group h-full flex flex-col focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2"
                onMouseEnter={() => ui.play("cardhover")}
              >
                <CardHeader className="p-5 md:p-6">
                  <div className="flex items-center justify-between mb-2">
                    <Badge
                      className={getDifficultyColor(post.difficulty)}
                      onMouseEnter={() => ui.play("hover")}
                    >
                      {post.difficulty}
                    </Badge>
                    <div
                      className="flex items-center gap-1 text-primary"
                      onMouseEnter={() => ui.play("hover")}
                    >
                      <Award className="w-4 h-4" />
                      <span className="text-sm font-medium">
                        {post.xpReward} XP
                      </span>
                    </div>
                  </div>
                  <CardTitle className="group-hover:gradient-text-primary transition-all duration-300 line-clamp-2">
                    {post.title}
                  </CardTitle>
                  <CardDescription className="text-muted-foreground line-clamp-3 flex-grow">
                    {post.excerpt}
                  </CardDescription>
                </CardHeader>

                <CardContent className="p-5 md:p-6 pt-0 flex flex-col gap-4 mt-auto">
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>{new Date(post.date).toLocaleDateString()}</span>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>{post.readingTime}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {post.tags.map((tag) => (
                      <Badge
                        key={tag}
                        variant="outline"
                        className="text-xs"
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
                      className="w-full hover:neon-glow-cyan transition-all duration-200"
                      variant="outline"
                    >
                      Begin Quest
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredPosts.length === 0 && (
            <div className="text-center py-12">
              <BookOpen className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No scrolls found</h3>
              <p className="text-muted-foreground">
                Try adjusting your search criteria
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};
