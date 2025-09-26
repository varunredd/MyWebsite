type NavTarget = 'home' | 'about' | 'projects' | 'skills' | 'blog' | 'contact' | 'settings';

const START_ANCHOR: Record<NavTarget, string | null> = {
  home: null,
  about: 'origin-start',
  projects: 'projects-start', 
  skills: 'skills-start',
  blog: 'blog-start',
  contact: 'contact-start',
  settings: 'settings-start',
};

export function navigateTo(target: NavTarget, navigate?: (path: string, options?: any) => void) {
  const anchor = START_ANCHOR[target];
  const path = target === 'home' ? '/' : `/${target}`;
  
  // Use history state to signal a one-time scroll
  const targetUrl = anchor ? `${path}#${anchor}` : path;
  const state = anchor ? { scrollTargetId: anchor } : {};
  
  if (navigate) {
    // Using React Router navigate function
    navigate(path, { state });
  } else {
    // Direct navigation
    window.history.pushState(state, '', targetUrl);
    // Trigger a popstate event to ensure router updates
    window.dispatchEvent(new PopStateEvent('popstate', { state }));
  }
}

// Reset scroll guard between route changes
export function resetNavigationScrollGuard() {
  delete (window as any).__didInitialAnchorScroll;
}

// Helper to get the target anchor ID for a route
export function getAnchorForRoute(route: string): string | null {
  const routeMap: Record<string, NavTarget> = {
    '/': 'home',
    '/about': 'about',
    '/projects': 'projects',
    '/skills': 'skills',
    '/blog': 'blog',
    '/contact': 'contact',
    '/settings': 'settings',
  };
  
  const target = routeMap[route];
  return target ? START_ANCHOR[target] : null;
}