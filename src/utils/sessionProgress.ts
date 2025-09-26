import { toast } from '@/hooks/use-toast';

export type SessionProgress = {
  sessionId: string;     // crypto.randomUUID()
  startedAt: string;     // ISO
  lastActivity: string;  // ISO
  xp: number;
  level: number;
  badges: string[];
  blogRead: string[];    // slugs read this session
  once: Record<string, boolean>; // one-time guards per session
};

function defaultProgress(): SessionProgress {
  return {
    sessionId: crypto.randomUUID(),
    startedAt: new Date().toISOString(),
    lastActivity: new Date().toISOString(),
    xp: 0,
    level: 1,
    badges: [],
    blogRead: [],
    once: {}
  };
}

const KEY = 'vrg.session.progress.v1';
const MAX_IDLE_MINUTES = 45;

export function loadProgress(): SessionProgress {
  const raw = sessionStorage.getItem(KEY);
  if (raw) {
    try {
      const parsed = JSON.parse(raw) as SessionProgress;
      
      // Check for idle timeout
      const now = new Date();
      const lastActivity = new Date(parsed.lastActivity);
      const minutesIdle = (now.getTime() - lastActivity.getTime()) / (1000 * 60);
      
      if (minutesIdle > MAX_IDLE_MINUTES) {
        console.log('Session expired due to inactivity, creating new session');
        return defaultProgress();
      }
      
      return parsed;
    } catch (error) {
      console.warn('Failed to parse session progress, creating new session:', error);
      return defaultProgress();
    }
  }
  return defaultProgress();
}

export function saveProgress(p: SessionProgress) {
  p.lastActivity = new Date().toISOString();
  sessionStorage.setItem(KEY, JSON.stringify(p));
}

export function resetSession() {
  sessionStorage.removeItem(KEY);
  const newProgress = defaultProgress();
  saveProgress(newProgress);
  return newProgress;
}

export function addXP(amount: number, reason?: string): SessionProgress {
  const p = loadProgress();
  const xpToNextLevel = 1000;
  const maxLevel = 10;
  const previousLevel = p.level;
  
  p.xp += amount;
  p.level = Math.min(Math.floor(p.xp / xpToNextLevel) + 1, maxLevel);
  
  saveProgress(p);
  
  // Show XP toast notification
  setTimeout(() => {
    toast({
      title: `+${amount} XP`,
      description: reason || 'Action completed',
      duration: 2000,
    });
    
    // Show level up notification if leveled up
    if (p.level > previousLevel) {
      setTimeout(() => {
        toast({
          title: `🎉 Level Up!`,
          description: `You've reached Level ${p.level}!`,
          duration: 4000,
        });
        
        // Show max level achievement
        if (p.level === maxLevel) {
          setTimeout(() => {
            toast({
              title: `🏆 LEGENDARY STATUS ACHIEVED!`,
              description: `Congratulations! You've mastered every aspect of this portfolio!`,
              duration: 6000,
            });
          }, 1000);
        }
      }, 500);
    }
  }, 0);
  
  return p;
}

export function addBadge(badge: string): SessionProgress {
  const p = loadProgress();
  if (!p.badges.includes(badge)) {
    p.badges.push(badge);
    saveProgress(p);
  }
  return p;
}

export function trackOnceAction(key: string, xpReward: number, reason?: string): { success: boolean; progress: SessionProgress } {
  const p = loadProgress();
  
  if (!p.once[key]) {
    p.once[key] = true;
    const previousLevel = p.level;
    p.xp += xpReward;
    
    const xpToNextLevel = 1000;
    const maxLevel = 10;
    p.level = Math.min(Math.floor(p.xp / xpToNextLevel) + 1, maxLevel);
    
    saveProgress(p);
    
    // Show XP toast notification
    setTimeout(() => {
      toast({
        title: `+${xpReward} XP`,
        description: reason || 'First time bonus!',
        duration: 2000,
      });
      
      // Show level up notification if leveled up
      if (p.level > previousLevel) {
        setTimeout(() => {
          toast({
            title: `🎉 Level Up!`,
            description: `You've reached Level ${p.level}!`,
            duration: 4000,
          });
          
          // Show max level achievement
          if (p.level === maxLevel) {
            setTimeout(() => {
              toast({
                title: `🏆 LEGENDARY STATUS ACHIEVED!`,
                description: `Congratulations! You've mastered every aspect of this portfolio!`,
                duration: 6000,
              });
            }, 1000);
          }
        }, 500);
      }
    }, 0);
    
    return { success: true, progress: p };
  }
  
  return { success: false, progress: p };
}

export function checkAndAwardBadges(p: SessionProgress): SessionProgress {
  const newBadges = [...p.badges];
  
  // Navigation badges
  const totalActions = Object.keys(p.once).length;
  if (totalActions >= 3 && !newBadges.includes('Explorer')) {
    newBadges.push('Explorer');
  }
  if (totalActions >= 6 && !newBadges.includes('Navigator')) {
    newBadges.push('Navigator');
  }
  if (totalActions >= 10 && !newBadges.includes('Digital Nomad')) {
    newBadges.push('Digital Nomad');
  }
  
  // Critical action badges
  const criticalActions = Object.keys(p.once).filter(key => 
    key.includes('download') || key.includes('portal') || key.includes('contact')
  ).length;
  
  if (criticalActions >= 1 && !newBadges.includes('Action Hero')) {
    newBadges.push('Action Hero');
  }
  if (criticalActions >= 2 && !newBadges.includes('Power User')) {
    newBadges.push('Power User');
  }
  
  // Blog badges
  if (p.blogRead.length >= 1 && !newBadges.includes('Reader')) {
    newBadges.push('Reader');
  }
  if (p.blogRead.length >= 3 && !newBadges.includes('Scholar')) {
    newBadges.push('Scholar');
  }
  
  // Level badges
  if (p.level >= 5 && !newBadges.includes('Rising Star')) {
    newBadges.push('Rising Star');
  }
  if (p.level >= 10 && !newBadges.includes('Digital Champion')) {
    newBadges.push('Digital Champion');
  }
  
  if (newBadges.length !== p.badges.length) {
    p.badges = newBadges;
    saveProgress(p);
  }
  
  return p;
}

// Activity tracking for idle timeout
export function trackActivity() {
  const p = loadProgress();
  p.lastActivity = new Date().toISOString();
  saveProgress(p);
}

// Initialize activity tracking
export function initializeActivityTracking() {
  const events = ['mousemove', 'keydown', 'click', 'touchstart', 'scroll'];
  
  let activityTimeout: NodeJS.Timeout;
  
  const handleActivity = () => {
    clearTimeout(activityTimeout);
    activityTimeout = setTimeout(() => {
      trackActivity();
    }, 1000); // Debounce activity tracking
  };
  
  events.forEach(event => {
    document.addEventListener(event, handleActivity, { passive: true });
  });
  
  // Initial activity tracking
  trackActivity();
  
  return () => {
    events.forEach(event => {
      document.removeEventListener(event, handleActivity);
    });
    clearTimeout(activityTimeout);
  };
}