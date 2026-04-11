import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSettings } from "@/contexts/SettingsContext";
import { useAudioSettings } from "@/context/AudioSettingsContext";
import { useGameState } from "@/components/GameHUD";
import { useToast } from "@/hooks/use-toast";
import { useUiSounds } from "@/components/UiSounds";
import {
  Settings as SettingsIcon,
  Palette,
  Volume2,
  VolumeX,
  RotateCcw,
  Download,
  Upload,
  Shield,
  Trash2,
  Monitor,
  Sun,
  Moon,
  Gamepad2,
  Bell,
  Info,
  Accessibility,
  Globe,
  Sparkles,
} from "lucide-react";
import { ACCENTS, AccentToken } from "@/theme/palette";
import { useThemeSettings } from "@/context/ThemeSettingsContext";

export const NewSettings = () => {
  const {
    settings,
    updateSettings,
    resetSettings,
    exportSettings,
    importSettings,
  } = useSettings();

  const { bgmEnabled, bgmVolume, setBgmEnabled, setBgmVolume } =
    useAudioSettings();

  const { xp, level, badges, resetProgress } = useGameState();
  const { toast } = useToast();
  const { play } = useUiSounds();

  const ui = {
    hover: () => play("hover"),
    cardHover: () => play("cardhover"),
    click: () => play("click"),
    nav: () => play("nav"),
    cardClick: () => play("cardclick"),
  };

  const [activeTab, setActiveTab] = useState("general");

  const {
    themeMode,
    setThemeMode,
    accent,
    setAccent,
    fontScale,
    setFontScale,
    highContrast,
    setHighContrast,
  } = useThemeSettings();

  const tabs = [
    { id: "general", label: "General", icon: Globe },
    { id: "appearance", label: "Appearance", icon: Palette },
    { id: "audio", label: "Audio", icon: Volume2 },
    { id: "motion", label: "Motion & Accessibility", icon: Accessibility },
    { id: "game", label: "Game Data", icon: Gamepad2 },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "about", label: "About", icon: Info },
  ];

  const handleExportSettings = () => {
    ui.cardClick();

    const settingsData = exportSettings();
    const gameData = {
      xp,
      level,
      badges,
      exportDate: new Date().toISOString(),
    };
    const combinedData = { settings: JSON.parse(settingsData), gameData };

    const dataStr = JSON.stringify(combinedData, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);

    const link = document.createElement("a");
    link.href = url;
    link.download = `vrg-portfolio-backup-${
      new Date().toISOString().split("T")[0]
    }.json`;
    link.click();
    URL.revokeObjectURL(url);

    toast({
      title: "Settings & Progress Exported! 📦",
      description: "Your data has been downloaded as a JSON file.",
    });
  };

  const handleImportSettings = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    ui.cardClick();

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);
        let success = false;

        if (data.settings) {
          success = importSettings(JSON.stringify(data.settings));
        }

        if (success) {
          toast({
            title: "Settings Imported! ⚡",
            description: "Your settings have been restored successfully.",
          });
        } else {
          throw new Error("Invalid settings format");
        }
      } catch {
        toast({
          title: "Import Failed",
          description: "The file format is invalid or corrupted.",
          variant: "destructive",
        });
      }
    };

    reader.readAsText(file);
    event.target.value = "";
  };

  const handleResetProgress = () => {
    ui.cardClick();

    if (
      window.confirm(
        "Are you sure you want to reset session progress? This will start a new session."
      )
    ) {
      resetProgress();
      toast({
        title: "Session Reset 🔄",
        description: "A new session has been started with reset progress.",
      });
    }
  };

  const handleResetSettings = () => {
    ui.cardClick();

    if (
      window.confirm(
        "Are you sure you want to reset all settings? This action cannot be undone."
      )
    ) {
      resetSettings();
      toast({
        title: "Settings Reset 🔄",
        description: "All settings have been reset to defaults.",
      });
    }
  };

  const renderRow = (
    title: string,
    description: string,
    control: React.ReactNode
  ) => (
    <div className="flex items-center justify-between gap-6 rounded-xl border border-white/6 bg-background/20 p-4 sm:p-5">
      <div className="space-y-1">
        <div className="text-lg font-semibold text-foreground font-rajdhani">
          {title}
        </div>
        <p className="text-sm text-muted-foreground font-rajdhani">
          {description}
        </p>
      </div>
      <div className="shrink-0">{control}</div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case "general":
        return (
          <div className="space-y-6">
            <h3 className="text-2xl font-orbitron font-semibold gradient-text-primary">
              Language & Region
            </h3>

            <div className="space-y-4">
              {renderRow(
                "Language",
                "Choose your preferred language",
                <Select
                  value={settings.general.language}
                  onValueChange={(value) => {
                    ui.click();
                    updateSettings("general.language", value);
                  }}
                >
                  <SelectTrigger
                    className="w-36 border-white/10 bg-background/35 font-rajdhani"
                    onMouseEnter={ui.hover}
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                  </SelectContent>
                </Select>
              )}

              {renderRow(
                "Time Format",
                "Display format for timestamps",
                <Select
                  value={settings.general.timeFormat}
                  onValueChange={(value) => {
                    ui.click();
                    updateSettings("general.timeFormat", value);
                  }}
                >
                  <SelectTrigger
                    className="w-24 border-white/10 bg-background/35 font-rajdhani"
                    onMouseEnter={ui.hover}
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="12h">12h</SelectItem>
                    <SelectItem value="24h">24h</SelectItem>
                  </SelectContent>
                </Select>
              )}
            </div>
          </div>
        );

      case "appearance":
        return (
          <div className="space-y-6">
            <h3 className="text-2xl font-orbitron font-semibold gradient-text-primary">
              Theme & Colors
            </h3>

            <div className="space-y-4">
              {renderRow(
                "Theme",
                "Choose your color scheme",
                <Select
                  value={themeMode}
                  onValueChange={(value) => {
                    ui.click();
                    setThemeMode(value as "light" | "dark" | "system");
                  }}
                >
                  <SelectTrigger
                    className="w-36 border-white/10 bg-background/35 font-rajdhani"
                    onMouseEnter={ui.hover}
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">
                      <div className="flex items-center gap-2">
                        <Sun className="h-4 w-4" />
                        Light
                      </div>
                    </SelectItem>
                    <SelectItem value="dark">
                      <div className="flex items-center gap-2">
                        <Moon className="h-4 w-4" />
                        Dark
                      </div>
                    </SelectItem>
                    <SelectItem value="system">
                      <div className="flex items-center gap-2">
                        <Monitor className="h-4 w-4" />
                        System
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              )}

              <div className="rounded-xl border border-white/6 bg-background/20 p-4 sm:p-5">
                <div className="flex items-center justify-between gap-6">
                  <div className="space-y-1">
                    <div className="text-lg font-semibold text-foreground font-rajdhani">
                      Accent Color
                    </div>
                    <p className="text-sm text-muted-foreground font-rajdhani">
                      Primary color theme
                    </p>
                  </div>

                  <div className="flex gap-3">
                    {(["cyan", "purple", "pink", "green"] as AccentToken[]).map(
                      (token) => (
                        <button
                          key={token}
                          aria-label={token}
                          onMouseEnter={ui.hover}
                          onClick={() => {
                            ui.click();
                            setAccent(token);
                          }}
                          className={`h-8 w-8 rounded-full ring-2 ring-transparent transition-all ${
                            accent === token
                              ? "scale-110 ring-white/60"
                              : "hover:scale-105 hover:ring-white/30"
                          }`}
                          style={{ background: ACCENTS[token] }}
                        />
                      )
                    )}
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-white/6 bg-background/20 p-4 sm:p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-lg font-semibold text-foreground font-rajdhani">
                    Font Scale
                  </span>
                  <span className="text-sm text-muted-foreground font-rajdhani">
                    {Math.round(fontScale * 100)}%
                  </span>
                </div>
                <Slider
                  value={[fontScale]}
                  onValueChange={([v]) => setFontScale(v)}
                  onPointerUp={ui.click}
                  min={0.8}
                  max={1.6}
                  step={0.05}
                  className="w-full"
                />
              </div>

              {renderRow(
                "High Contrast",
                "Enhanced visibility for accessibility",
                <Switch
                  checked={highContrast}
                  onCheckedChange={(checked) => {
                    ui.click();
                    setHighContrast(checked);
                  }}
                />
              )}
            </div>
          </div>
        );

      case "audio":
        return (
          <div className="space-y-6">
            <h3 className="text-2xl font-orbitron font-semibold gradient-text-primary">
              Sound Settings
            </h3>

            <div className="space-y-4">
              {renderRow(
                "UI Sounds",
                "Play sounds for interactions",
                <Switch
                  checked={settings.audio.uiSounds}
                  onCheckedChange={(checked) => {
                    updateSettings("audio.uiSounds", checked);
                  }}
                  onClick={ui.click}
                />
              )}

              <div className="rounded-xl border border-white/6 bg-background/20 p-4 sm:p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-lg font-semibold text-foreground font-rajdhani">
                      {bgmEnabled ? (
                        <Volume2 className="h-4 w-4" />
                      ) : (
                        <VolumeX className="h-4 w-4" />
                      )}
                      Background Music
                    </div>
                    <p className="text-sm text-muted-foreground font-rajdhani">
                      Ambient soundtrack
                    </p>
                  </div>

                  <Switch
                    checked={bgmEnabled}
                    onCheckedChange={(checked) => {
                      setBgmEnabled(checked);
                    }}
                    onClick={ui.click}
                  />
                </div>

                <div className="space-y-2 border-l border-card-border/60 pl-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium font-rajdhani">
                      Volume
                    </span>
                    <span className="text-sm text-muted-foreground font-rajdhani">
                      {Math.round(bgmVolume * 100)}%
                    </span>
                  </div>

                  <Slider
                    value={[bgmVolume]}
                    onValueChange={([value]) => {
                      setBgmVolume(value);
                    }}
                    onPointerUp={ui.click}
                    min={0}
                    max={1}
                    step={0.1}
                    className="w-full"
                    disabled={!bgmEnabled}
                  />
                </div>
              </div>
            </div>
          </div>
        );

      case "motion":
        return (
          <div className="space-y-6">
            <h3 className="text-2xl font-orbitron font-semibold gradient-text-primary">
              Motion & Accessibility
            </h3>

            <div className="space-y-4">
              {renderRow(
                "Reduce Motion",
                "Minimize animations for comfort",
                <Select
                  value={settings.motion.reduceMotion}
                  onValueChange={(value) => {
                    ui.click();
                    updateSettings("motion.reduceMotion", value);
                  }}
                >
                  <SelectTrigger
                    className="w-32 border-white/10 bg-background/35 font-rajdhani"
                    onMouseEnter={ui.hover}
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="system">System</SelectItem>
                    <SelectItem value="enabled">Enabled</SelectItem>
                    <SelectItem value="disabled">Disabled</SelectItem>
                  </SelectContent>
                </Select>
              )}

              {renderRow(
                "Keyboard Navigation Aid",
                "Enhanced focus indicators",
                <Switch
                  checked={settings.motion.keyboardAid}
                  onCheckedChange={(checked) =>
                    updateSettings("motion.keyboardAid", checked)
                  }
                  onClick={ui.click}
                />
              )}

              {renderRow(
                "Colorblind Support",
                "Adjust colors for better visibility",
                <Switch
                  checked={settings.motion.colorblindAid}
                  onCheckedChange={(checked) =>
                    updateSettings("motion.colorblindAid", checked)
                  }
                  onClick={ui.click}
                />
              )}
            </div>
          </div>
        );

      case "game":
        return (
          <div className="space-y-6">
            <h3 className="text-2xl font-orbitron font-semibold gradient-text-primary">
              Game Elements
            </h3>

            <div className="space-y-4">
              {renderRow(
                "Show XP HUD",
                "Display the game interface",
                <Switch
                  checked={settings.game.showHud}
                  onCheckedChange={(checked) =>
                    updateSettings("game.showHud", checked)
                  }
                  onClick={ui.click}
                />
              )}

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 rounded-xl border border-white/6 bg-background/20 p-4 sm:p-5">
                <div className="text-center">
                  <div className="text-3xl font-orbitron font-bold text-success">
                    {xp}
                  </div>
                  <div className="text-sm text-muted-foreground font-rajdhani">
                    Total XP
                  </div>
                </div>

                <div className="text-center">
                  <div className="text-3xl font-orbitron font-bold gradient-text-primary">
                    Level {level}
                  </div>
                  <div className="text-sm text-muted-foreground font-rajdhani">
                    Current Level
                  </div>
                </div>

                <div className="text-center">
                  <div className="text-3xl font-orbitron font-bold gradient-text-secondary">
                    {badges.length}
                  </div>
                  <div className="text-sm text-muted-foreground font-rajdhani">
                    Badges
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <Button
                  variant="outline"
                  onMouseEnter={ui.cardHover}
                  onClick={handleExportSettings}
                  className="w-full justify-start font-rajdhani"
                >
                  <Download className="mr-2 h-4 w-4" />
                  Export All Data
                </Button>

                <label
                  className="w-full"
                  onMouseEnter={ui.cardHover}
                  onClick={ui.cardClick}
                >
                  <input
                    type="file"
                    accept=".json"
                    onChange={handleImportSettings}
                    className="hidden"
                  />
                  <div className="flex w-full cursor-pointer items-center gap-2 rounded-lg border border-input-border card-surface p-3 transition hover:neon-glow-cyan font-rajdhani">
                    <Upload className="h-4 w-4" />
                    Import Data
                  </div>
                </label>

                <Button
                  variant="destructive"
                  onMouseEnter={ui.cardHover}
                  onClick={handleResetProgress}
                  className="w-full justify-start font-rajdhani"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Reset Game Progress
                </Button>
              </div>
            </div>
          </div>
        );

      case "notifications":
        return (
          <div className="space-y-6">
            <h3 className="text-2xl font-orbitron font-semibold gradient-text-primary">
              Notifications & Privacy
            </h3>

            <div className="space-y-4">
              {renderRow(
                "Achievement Toasts",
                "Show XP and badge notifications",
                <Switch
                  checked={settings.notifications.toasts}
                  onCheckedChange={(checked) =>
                    updateSettings("notifications.toasts", checked)
                  }
                  onClick={ui.click}
                />
              )}

              {renderRow(
                "Blog Reading Reminders",
                "Gentle nudges to check new content",
                <Select
                  value={settings.notifications.blogReminders}
                  onValueChange={(value) => {
                    ui.click();
                    updateSettings("notifications.blogReminders", value);
                  }}
                >
                  <SelectTrigger
                    className="w-24 border-white/10 bg-background/35 font-rajdhani"
                    onMouseEnter={ui.hover}
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="off">Off</SelectItem>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                  </SelectContent>
                </Select>
              )}

              <div className="rounded-xl border border-white/6 bg-background/20 p-4 sm:p-5">
                <div className="flex items-start gap-3">
                  <Shield className="mt-0.5 h-5 w-5 text-success" />
                  <div className="space-y-1">
                    <div className="text-lg font-semibold text-foreground font-rajdhani">
                      Privacy Notice
                    </div>
                    <p className="text-sm text-muted-foreground font-rajdhani">
                      All data is stored locally in your browser. No analytics,
                      tracking, or external data collection.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case "about":
        return (
          <div className="space-y-6">
            <h3 className="text-2xl font-orbitron font-semibold gradient-text-primary">
              About This Portfolio
            </h3>

            <div className="space-y-4">
              <div className="rounded-xl border border-white/6 bg-background/20 p-4 sm:p-5">
                <div className="space-y-3">
                  <div>
                    <div className="text-xl font-semibold text-foreground font-rajdhani">
                      Varun Reddy Gutha — Gamified Portfolio
                    </div>
                    <div className="text-sm text-muted-foreground font-rajdhani">
                      Version 1.0.0
                    </div>
                  </div>

                  <p className="text-[1.02rem] leading-relaxed text-muted-foreground font-rajdhani">
                    An interactive, game-inspired portfolio showcasing software
                    development skills and projects with RPG-style progression,
                    XP systems, and achievement unlocks.
                  </p>

                  <div className="flex flex-wrap gap-3 pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      asChild
                      onMouseEnter={ui.hover}
                      onClick={ui.click}
                      className="font-rajdhani"
                    >
                      <a
                        href="https://github.com/varunreddygutha"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        GitHub Profile
                      </a>
                    </Button>

                    <Button
                      variant="outline"
                      size="sm"
                      asChild
                      onMouseEnter={ui.hover}
                      onClick={ui.cardClick}
                      className="font-rajdhani"
                    >
                      <a
                        href="/resume.pdf"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Download Resume
                      </a>
                    </Button>
                  </div>
                </div>
              </div>

              <Button
                variant="destructive"
                onMouseEnter={ui.cardHover}
                onClick={handleResetSettings}
                className="w-full justify-start font-rajdhani"
              >
                <RotateCcw className="mr-2 h-4 w-4" />
                Reset All Settings
              </Button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

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
            >
              <SettingsIcon className="mr-2 h-4 w-4" />
              Configuration Panel
            </Badge>

            <h1 className="mb-6 text-fluid-xl font-orbitron font-bold">
              <span
                className="glitch-text gradient-text-primary"
                data-text="Settings"
              >
                Settings
              </span>
            </h1>

            <p className="mx-auto max-w-3xl text-fluid-md leading-relaxed text-muted-foreground font-rajdhani">
              Tailor the portfolio to your preferences. Control appearance,
              sounds, and accessibility.
            </p>
          </div>
        </div>
      </section>

      {/* ═══════════ BODY ═══════════ */}
      <section className="relative py-12 surface">
        <div className="circuit-border absolute left-0 top-0 w-full" />

        <div className="container relative z-10 mx-auto px-4">
          <div className="mx-auto max-w-6xl">
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
              {/* Sidebar */}
              <div className="lg:col-span-1">
                <div className="sticky top-24 rounded-2xl card-game card-surface p-4 space-y-2">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onMouseEnter={ui.cardHover}
                      onClick={() => {
                        ui.nav();
                        setActiveTab(tab.id);
                      }}
                      className={`w-full rounded-xl px-4 py-3 text-left transition-all duration-200 flex items-center gap-3 ${
                        activeTab === tab.id
                          ? "bg-primary text-primary-foreground shadow-[0_0_22px_hsl(var(--primary)/0.28)]"
                          : "text-muted-foreground hover:bg-background/35 hover:text-foreground"
                      }`}
                    >
                      <tab.icon className="h-4 w-4" />
                      <span className="text-sm font-medium font-rajdhani">
                        {tab.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Content */}
              <div className="lg:col-span-3">
                <Card className="holo-card card-game card-surface rounded-2xl p-6 sm:p-8">
                  {renderTabContent()}
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};