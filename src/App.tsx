// src/App.tsx
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import { Navigation } from "@/components/Navigation";
import { GameHUD, GameProvider } from "@/components/GameHUD";
import BackgroundMusic from "@/components/BackgroundMusic";
import UiSounds from "@/components/UiSounds";

import { Home } from "./pages/Home";
import { About } from "./pages/About";
import { Projects } from "./pages/Projects";
import { Skills } from "./pages/Skills";
import { Contact } from "./pages/Contact";
import { Settings } from "./pages/Settings";
import { Blog } from "./pages/Blog";
import NotFound from "./pages/NotFound";

import { SettingsProvider } from "@/contexts/SettingsContext";
import { AudioSettingsProvider } from "@/context/AudioSettingsContext";
import { ThemeSettingsProvider } from "@/context/ThemeSettingsContext";

import OnboardingTour from "@/components/ui/onboarding-tour";
import GooFilter from "./components/ui/GooFilter";

// ✅ fixed background video (desktop only)
function FixedBgVideo() {
  return (
    <div className="fixed inset-0 -z-10 hidden md:block pointer-events-none overflow-hidden">
      <video
        className="w-full h-full object-cover"
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        // the same grade you liked
        style={{ filter: "brightness(.72) contrast(1.06) saturate(1.04)" }}
      >
        <source src="/assets/cyberpunk-track.webm" type="video/webm" />
        <source src="/assets/cyberpunk-track.mp4" type="video/mp4" />
      </video>

      {/* overlays (subtle; readable) */}
      <div className="absolute inset-0 mix-blend-multiply bg-[#070b14]/55" />
      <div className="absolute inset-0 bg-[radial-gradient(85%_70%_at_50%_18%,rgba(0,0,0,.75)_0%,rgba(0,0,0,.65)_40%,rgba(0,0,0,.45)_60%,rgba(0,0,0,.2)_80%,rgba(0,0,0,0)_100%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,.45)_0%,rgba(0,0,0,.25)_14%,rgba(0,0,0,0)_28%,rgba(0,0,0,0)_72%,rgba(0,0,0,.25)_86%,rgba(0,0,0,.45)_100%)]" />
      <div
        className="absolute inset-0 mix-blend-overlay opacity-[0.045]"
        style={{ backgroundImage: "url(/assets/noise.png)" }}
      />
    </div>
  );
}

const queryClient = new QueryClient();

if ("scrollRestoration" in history) {
  history.scrollRestoration = "manual";
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <SettingsProvider>
      <GameProvider>
        <ThemeSettingsProvider>
          <AudioSettingsProvider>
            <UiSounds>
              <TooltipProvider>
                <BrowserRouter>
                  <GooFilter />
                  {/* 🔳 Fixed background video behind the whole app (desktop) */}
                  <FixedBgVideo />

                  <div className="min-h-screen text-foreground relative z-10">
                    <div id="site-header">
                      <Navigation />
                    </div>

                    <GameHUD />

                    {/* Background music follows the current route */}
                    <BackgroundMusic
                      rules={[
                        { match: "/", url: "/audio/home-lucid-dreams.mp3" },
                        { match: "/home", url: "/audio/home-lucid-dreams.mp3" },
                        { match: "/about", url: "/audio/about-lofi.mp3" },
                        {
                          match: "/projects",
                          url: "/audio/project-beyond.mp3",
                        },
                        { match: "/skills", url: "/audio/skill-deep.mp3" },
                        {
                          match: "/contact",
                          url: "/audio/contact-abstract.mp3",
                        },
                        { match: "/blog", url: "/audio/blog-without.mp3" },
                        { match: "/settings", url: "/audio/skill-deep.mp3" },
                      ]}
                    />

                    {/* Make pages render over the video */}
                    <main className="pt-16 sm:pt-0 pb-16 sm:pb-0">
                      <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/about" element={<About />} />
                        <Route path="/projects" element={<Projects />} />
                        <Route path="/skills" element={<Skills />} />
                        <Route path="/contact" element={<Contact />} />
                        <Route path="/blog" element={<Blog />} />
                        <Route path="/settings" element={<Settings />} />
                        <Route path="*" element={<NotFound />} />
                      </Routes>
                    </main>

                    {/* Guided tour */}
                    <OnboardingTour />

                    {/* Portals & toasts */}
                    <Toaster />
                    <Sonner />
                  </div>
                </BrowserRouter>
              </TooltipProvider>
            </UiSounds>
          </AudioSettingsProvider>
        </ThemeSettingsProvider>
      </GameProvider>
    </SettingsProvider>
  </QueryClientProvider>
);

export default App;
