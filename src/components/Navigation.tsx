import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { navigateTo } from "@/utils/navigation";
import { useUiSounds } from "@/components/UiSounds";
import {
  Home,
  User,
  Briefcase,
  Settings,
  GitBranch,
  BookOpen,
  Mail,
  Menu,
  X,
} from "lucide-react";

const navItems = [
  { name: "Start Mission", path: "/", icon: Home, description: "Home Base" },
  {
    name: "Origin Story",
    path: "/about",
    icon: User,
    description: "Character Profile",
  },
  {
    name: "Completed Quests",
    path: "/projects",
    icon: Briefcase,
    description: "Portfolio",
  },
  {
    name: "Lore & Tech Codex",
    path: "/blog",
    icon: BookOpen,
    description: "Blog",
  },
  {
    name: "Skill Tree",
    path: "/skills",
    icon: GitBranch,
    description: "Expertise",
  },
  { name: "Open Portal", path: "/contact", icon: Mail, description: "Contact" },
  {
    name: "Control Panel",
    path: "/settings",
    icon: Settings,
    description: "Settings",
  },
];

export const Navigation = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { play } = useUiSounds();

  const ui = {
    hover: () => play("cardhover"),
    nav: () => play("nav"),
    click: () => play("click"),
    close: () => play("cardclick"),
  };

  const handleNavClick = (path: string, callback?: () => void) => {
    ui.nav();

    const targetMap: Record<
      string,
      "home" | "about" | "projects" | "skills" | "blog" | "contact" | "settings"
    > = {
      "/": "home",
      "/about": "about",
      "/projects": "projects",
      "/skills": "skills",
      "/blog": "blog",
      "/contact": "contact",
      "/settings": "settings",
    };

    const target = targetMap[path];
    if (target) {
      navigateTo(target, navigate);
    } else {
      navigate(path);
    }

    callback?.();
  };

  const NavItems = ({
    mobile = false,
    onClick,
    className = "",
  }: {
    mobile?: boolean;
    onClick?: () => void;
    className?: string;
  }) => (
    <nav
      className={
        mobile
          ? "flex flex-col space-y-4"
          : `hidden lg:flex items-center ${className}`
      }
    >
      {navItems.map((item) => (
        <button
          key={item.path}
          onMouseEnter={ui.hover}
          onClick={() => handleNavClick(item.path, onClick)}
          className={`group relative overflow-hidden
                      flex items-center gap-3 px-3 py-2 rounded-lg font-medium
                      transition-all duration-200
                      text-muted-foreground hover:text-foreground
                      hover:bg-transparent
                      ${mobile ? "w-full justify-start" : ""}
          `}
          style={{ filter: "url(#goo)" }} // 👈 apply goo filter
        >
          {/* liquid blobs */}
          <span
            className="pointer-events-none absolute -z-10 inset-0 opacity-0
                  transition-opacity duration-300 group-hover:opacity-100"
          >
            {/* left blob */}
            <span
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2
                    w-20 h-10 rounded-full bg-primary/25 blur-[10px]
                    transition-transform duration-500
                    group-hover:translate-x-4 group-hover:scale-110"
            />
          </span>

          <item.icon className="w-5 h-5" />
          <div className={mobile ? "text-left" : "block"}>
            <div className="text-sm font-semibold">{item.name}</div>
            {mobile && (
              <div className="text-xs text-muted-foreground">
                {item.description}
              </div>
            )}
          </div>
        </button>
      ))}
    </nav>
  );

  return (
    <>
      {/* Desktop Navigation */}
      <header className="fixed inset-x-0 top-3 sm:top-4 z-40 px-3 sm:px-4 lg:px-6">
        <div
          className="mx-auto flex h-16 w-full max-w-[1500px] items-center gap-4 rounded-[24px] border border-white/10 bg-background/70 px-4 shadow-[0_10px_30px_rgba(0,0,0,0.35)] backdrop-blur-2xl sm:px-5 lg:px-6"
        >
          {/* Logo (left) */}
          <button
            onMouseEnter={ui.hover}
            onClick={() => handleNavClick("/")}
            className="flex items-center gap-2 text-xl font-bold gradient-text-primary hover:opacity-80 transition-opacity"
          >
            <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center neon-glow-cyan">
              <span className="text-primary font-mono text-lg">V</span>
            </div>
          </button>

          {/* Desktop Navigation (center) */}
          <NavItems className="flex-1 justify-center gap-4 xl:gap-6" />

          {/* Right controls (right) */}
          <div className="flex items-center gap-2">
            {/* Mobile menu trigger (only visible < lg) */}
            <Sheet
              open={mobileMenuOpen}
              onOpenChange={(open) => {
                if (open) ui.click();
                else ui.close();
                setMobileMenuOpen(open);
              }}
            >
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="lg:hidden rounded-xl"
                  onMouseEnter={ui.hover}
                >
                  <Menu className="w-5 h-5" />
                </Button>
              </SheetTrigger>
              <SheetContent
                side="right"
                className="w-80 bg-background-secondary"
              >
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-2 text-lg font-bold gradient-text-primary">
                    <div className="w-6 h-6 rounded bg-primary/20 flex items-center justify-center neon-glow-cyan">
                      <span className="text-primary font-mono text-sm">V</span>
                    </div>
                    Varun Reddy
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onMouseEnter={ui.hover}
                    onClick={() => {
                      ui.close();
                      setMobileMenuOpen(false);
                    }}
                    className="w-8 h-8 p-0"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
                <NavItems
                  mobile
                  onClick={() => {
                    ui.close();
                    setMobileMenuOpen(false);
                  }}
                />
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      {/* Mobile Bottom Navigation (very small screens) */}
      <div className="fixed bottom-3 left-3 right-3 z-40 rounded-2xl border border-white/10 bg-background/80 shadow-[0_10px_30px_rgba(0,0,0,0.35)] backdrop-blur-2xl lg:hidden sm:hidden">
        <div className="flex items-center justify-around py-2">
          {navItems.slice(0, 6).map((item) => (
            <button
              key={item.path}
              onMouseEnter={ui.hover}
              onClick={() => handleNavClick(item.path)}
              className="flex flex-col items-center gap-1 p-2 rounded-lg transition-colors text-muted-foreground hover:text-primary"
            >
              <item.icon className="w-5 h-5" />
              <span className="text-xs font-medium">
                {item.name.split(" ")[0]}
              </span>
            </button>
          ))}
        </div>
      </div>
    </>
  );
};
