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

  const renderTabContent = () => {
    switch (activeTab) {
      case "general":
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold gradient-text-primary">
                Language & Region
              </h3>

              <div className="space-y-4">
                <div className="flex items-center justify-between card-surface rounded-lg p-4">
                  <div className="space-y-1">
                    <span className="font-medium">Language</span>
                    <p className="text-sm text-muted-foreground">
                      Choose your preferred language
                    </p>
                  </div>
                  <Select
                    value={settings.general.language}
                    onValueChange={(value) => {
                      ui.click();
                      updateSettings("general.language", value);
                    }}
                  >
                    <SelectTrigger className="w-32" onMouseEnter={ui.hover}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between card-surface rounded-lg p-4">
                  <div className="space-y-1">
                    <span className="font-medium">Time Format</span>
                    <p className="text-sm text-muted-foreground">
                      Display format for timestamps
                    </p>
                  </div>
                  <Select
                    value={settings.general.timeFormat}
                    onValueChange={(value) => {
                      ui.click();
                      updateSettings("general.timeFormat", value);
                    }}
                  >
                    <SelectTrigger className="w-24" onMouseEnter={ui.hover}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="12h">12h</SelectItem>
                      <SelectItem value="24h">24h</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>
        );

      case "appearance":
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold gradient-text-primary">
                Theme & Colors
              </h3>

              <div className="space-y-4">
                <div className="flex items-center justify-between card-surface rounded-lg p-4">
                  <div className="space-y-1">
                    <span className="font-medium">Theme</span>
                    <p className="text-sm text-muted-foreground">
                      Choose your color scheme
                    </p>
                  </div>
                  <Select
                    value={themeMode}
                    onValueChange={(value) => {
                      ui.click();
                      setThemeMode(value as "light" | "dark" | "system");
                    }}
                  >
                    <SelectTrigger className="w-32" onMouseEnter={ui.hover}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">
                        <div className="flex items-center gap-2">
                          <Sun className="w-4 h-4" />
                          Light
                        </div>
                      </SelectItem>
                      <SelectItem value="dark">
                        <div className="flex items-center gap-2">
                          <Moon className="w-4 h-4" />
                          Dark
                        </div>
                      </SelectItem>
                      <SelectItem value="system">
                        <div className="flex items-center gap-2">
                          <Monitor className="w-4 h-4" />
                          System
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between card-surface rounded-lg p-4">
                  <div className="space-y-1">
                    <span className="font-medium">Accent Color</span>
                    <p className="text-sm text-muted-foreground">
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
                          className={`h-6 w-6 rounded-full ring-2 ring-transparent hover:ring-white/30 ${
                            accent === token
                              ? "ring-white/60 scale-110"
                              : "hover:scale-105"
                          }`}
                          style={{ background: ACCENTS[token] }}
                        />
                      )
                    )}
                  </div>
                </div>

                <div className="card-surface rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Font Scale</span>
                    <span className="text-sm text-muted-foreground">
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

                <div className="flex items-center justify-between card-surface rounded-lg p-4">
                  <div className="space-y-1">
                    <span className="font-medium">High Contrast</span>
                    <p className="text-sm text-muted-foreground">
                      Enhanced visibility for accessibility
                    </p>
                  </div>
                  <Switch
                    checked={highContrast}
                    onCheckedChange={(checked) => {
                      ui.click();
                      setHighContrast(checked);
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        );

      case "audio":
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold gradient-text-primary">
                Sound Settings
              </h3>

              <div className="space-y-4">
                <div className="flex items-center justify-between card-surface rounded-lg p-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      {settings.audio.uiSounds ? (
                        <Volume2 className="w-4 h-4" />
                      ) : (
                        <VolumeX className="w-4 h-4" />
                      )}
                      <span className="font-medium">UI Sounds</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Play sounds for interactions
                    </p>
                  </div>
                  <Switch
                    checked={settings.audio.uiSounds}
                    onCheckedChange={(checked) => {
                      updateSettings("audio.uiSounds", checked);
                    }}
                    onClick={ui.click}
                  />
                </div>

                <div className="card-surface rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <span className="font-medium">Background Music</span>
                      <p className="text-sm text-muted-foreground">
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

                  <div className="space-y-2 pl-4 border-l border-card-border/60">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Volume</span>
                      <span className="text-sm text-muted-foreground">
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
          </div>
        );

      case "motion":
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold gradient-text-primary">
                Motion & Accessibility
              </h3>

              <div className="space-y-4">
                <div className="flex items-center justify-between card-surface rounded-lg p-4">
                  <div className="space-y-1">
                    <span className="font-medium">Reduce Motion</span>
                    <p className="text-sm text-muted-foreground">
                      Minimize animations for comfort
                    </p>
                  </div>
                  <Select
                    value={settings.motion.reduceMotion}
                    onValueChange={(value) => {
                      ui.click();
                      updateSettings("motion.reduceMotion", value);
                    }}
                  >
                    <SelectTrigger className="w-32" onMouseEnter={ui.hover}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="system">System</SelectItem>
                      <SelectItem value="enabled">Enabled</SelectItem>
                      <SelectItem value="disabled">Disabled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between card-surface rounded-lg p-4">
                  <div className="space-y-1">
                    <span className="font-medium">Keyboard Navigation Aid</span>
                    <p className="text-sm text-muted-foreground">
                      Enhanced focus indicators
                    </p>
                  </div>
                  <Switch
                    checked={settings.motion.keyboardAid}
                    onCheckedChange={(checked) =>
                      updateSettings("motion.keyboardAid", checked)
                    }
                    onClick={ui.click}
                  />
                </div>

                <div className="flex items-center justify-between card-surface rounded-lg p-4">
                  <div className="space-y-1">
                    <span className="font-medium">Colorblind Support</span>
                    <p className="text-sm text-muted-foreground">
                      Adjust colors for better visibility
                    </p>
                  </div>
                  <Switch
                    checked={settings.motion.colorblindAid}
                    onCheckedChange={(checked) =>
                      updateSettings("motion.colorblindAid", checked)
                    }
                    onClick={ui.click}
                  />
                </div>
              </div>
            </div>
          </div>
        );

      case "game":
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold gradient-text-primary">
                Game Elements
              </h3>

              <div className="space-y-4">
                <div className="flex items-center justify-between card-surface rounded-lg p-4">
                  <div className="space-y-1">
                    <span className="font-medium">Show XP HUD</span>
                    <p className="text-sm text-muted-foreground">
                      Display the game interface
                    </p>
                  </div>
                  <Switch
                    checked={settings.game.showHud}
                    onCheckedChange={(checked) =>
                      updateSettings("game.showHud", checked)
                    }
                    onClick={ui.click}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 rounded-lg card-surface">
                  <div className="text-center">
                    <div className="text-lg font-bold text-success">{xp}</div>
                    <div className="text-xs text-muted-foreground">
                      Total XP
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold gradient-text-primary">
                      Level {level}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Current Level
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold gradient-text-secondary">
                      {badges.length}
                    </div>
                    <div className="text-xs text-muted-foreground">Badges</div>
                  </div>
                </div>

                <div className="space-y-3">
                  <Button
                    variant="outline"
                    onMouseEnter={ui.cardHover}
                    onClick={handleExportSettings}
                    className="w-full justify-start"
                  >
                    <Download className="w-4 h-4 mr-2" />
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
                    <div className="w-full flex items-center gap-2 p-3 rounded-lg border border-input-border card-surface hover:neon-glow-cyan cursor-pointer transition">
                      <Upload className="w-4 h-4" />
                      Import Data
                    </div>
                  </label>

                  <Button
                    variant="destructive"
                    onMouseEnter={ui.cardHover}
                    onClick={handleResetProgress}
                    className="w-full justify-start"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Reset Game Progress
                  </Button>
                </div>
              </div>
            </div>
          </div>
        );

      case "notifications":
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold gradient-text-primary">
                Notifications & Privacy
              </h3>

              <div className="space-y-4">
                <div className="flex items-center justify-between card-surface rounded-lg p-4">
                  <div className="space-y-1">
                    <span className="font-medium">Achievement Toasts</span>
                    <p className="text-sm text-muted-foreground">
                      Show XP and badge notifications
                    </p>
                  </div>
                  <Switch
                    checked={settings.notifications.toasts}
                    onCheckedChange={(checked) =>
                      updateSettings("notifications.toasts", checked)
                    }
                    onClick={ui.click}
                  />
                </div>

                <div className="flex items-center justify-between card-surface rounded-lg p-4">
                  <div className="space-y-1">
                    <span className="font-medium">Blog Reading Reminders</span>
                    <p className="text-sm text-muted-foreground">
                      Gentle nudges to check new content
                    </p>
                  </div>
                  <Select
                    value={settings.notifications.blogReminders}
                    onValueChange={(value) => {
                      ui.click();
                      updateSettings("notifications.blogReminders", value);
                    }}
                  >
                    <SelectTrigger className="w-24" onMouseEnter={ui.hover}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="off">Off</SelectItem>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="p-4 rounded-lg card-surface">
                  <div className="flex items-start gap-3">
                    <Shield className="w-5 h-5 text-success mt-0.5" />
                    <div className="space-y-1">
                      <div className="font-medium">Privacy Notice</div>
                      <p className="text-sm text-muted-foreground">
                        All data is stored locally in your browser. No
                        analytics, tracking, or external data collection.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case "about":
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold gradient-text-primary">
                About This Portfolio
              </h3>

              <div className="space-y-4">
                <div className="p-4 rounded-lg card-surface">
                  <div className="space-y-3">
                    <div>
                      <div className="font-medium">
                        Varun Reddy Gutha — Gamified Portfolio
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Version 1.0.0
                      </div>
                    </div>

                    <p className="text-sm text-muted-foreground leading-relaxed">
                      An interactive, game-inspired portfolio showcasing
                      software development skills and projects with RPG-style
                      progression, XP systems, and achievement unlocks.
                    </p>

                    <div className="flex gap-2 pt-2">
                      <Button
                        variant="outline"
                        size="sm"
                        asChild
                        onMouseEnter={ui.hover}
                        onClick={ui.click}
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

                <div className="space-y-3">
                  <Button
                    variant="destructive"
                    onMouseEnter={ui.cardHover}
                    onClick={handleResetSettings}
                    className="w-full justify-start"
                  >
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Reset All Settings
                  </Button>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    // NOTE: flex column + flex-1 makes the translucent surface fill the viewport
    <div className="min-h-screen pt-16 flex flex-col">
      {/* HERO (translucent over video) */}
      <section className="surface-strong py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <Badge
              variant="secondary"
              className="neon-glow-purple mb-6 px-4 py-2"
            >
              <SettingsIcon className="w-4 h-4 mr-2" />
              Configuration Panel
            </Badge>

            <h1 className="text-fluid-xl font-bold mb-6">
              <span className="gradient-text-primary">Settings</span>
            </h1>

            <p className="text-fluid-md text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Tailor the portfolio to your preferences. Control appearance,
              sounds, and accessibility.
            </p>
          </div>
        </div>
      </section>

      {/* BODY (translucent, now fills remaining height) */}
      <section className="surface py-12 flex-1">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              {/* Sidebar Navigation */}
              <div className="lg:col-span-1">
                <div className="card-game card-surface p-4 space-y-2 sticky top-24">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onMouseEnter={ui.cardHover}
                      onClick={() => {
                        ui.nav();
                        setActiveTab(tab.id);
                      }}
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
                        activeTab === tab.id
                          ? "bg-primary text-primary-foreground"
                          : "hover:bg-card-hover text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      <tab.icon className="w-4 h-4" />
                      <span className="text-sm font-medium">{tab.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Main Content */}
              <div className="lg:col-span-3">
                <Card className="card-game card-surface p-6">
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
