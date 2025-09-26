let didScroll = false;

export function scrollToAnchor(id: string, offset = 72) {
  if (didScroll) return;
  const el = document.getElementById(id);
  if (!el) return;

  didScroll = true;

  const header = document.querySelector<HTMLElement>('#site-header');
  const safeOffset = header ? header.offsetHeight + 8 : offset;
  
  const top = el.getBoundingClientRect().top + window.scrollY - safeOffset;
  window.scrollTo({ 
    top: Math.max(top, 0), 
    behavior: 'smooth' 
  });

  // Optional a11y: focus the title without re-scrolling
  const titleId = id.replace('-start', '-title');
  const titleElement = document.getElementById(titleId);
  if (titleElement) {
    setTimeout(() => {
      titleElement.focus({ preventScroll: true });
    }, 300);
  }
}

// Reset scroll guard when intentionally navigating
export function resetScrollGuard() {
  didScroll = false;
}

// Only scroll when triggered by user action (Explore buttons, etc.)
export function scrollToAnchorOnAction(id: string, offset = 72) {
  resetScrollGuard();
  scrollToAnchor(id, offset);
}

export function getHeaderOffset(): number {
  const header = document.querySelector<HTMLElement>('#site-header');
  return header ? header.offsetHeight + 8 : 72;
}