import cursor32 from "@/assets/cursors/cursor-32.png?inline";
import cursor64 from "@/assets/cursors/cursor-64.png?inline";

type Options = { debug?: boolean; hotspotX?: number; hotspotY?: number };

export function installCursorLock(opts: Options = {}) {
  const HSX = Number.isFinite(opts.hotspotX) ? (opts.hotspotX as number) : 6;
  const HSY = Number.isFinite(opts.hotspotY) ? (opts.hotspotY as number) : 4;
  const debug = !!opts.debug;

  const css = `
@media (pointer: fine) {
  html.custom-cursor,
  html.custom-cursor *,
  html.custom-cursor *::before,
  html.custom-cursor *::after {
    cursor:
      url("${cursor32}") ${HSX} ${HSY},
      -webkit-image-set(url("${cursor32}") 1x, url("${cursor64}") 2x) ${HSX} ${HSY},
      image-set(url("${cursor32}") 1x, url("${cursor64}") 2x) ${HSX} ${HSY},
      auto !important;
  }

  /* i-beam for text inputs/contenteditable */
  input, textarea, [contenteditable="true"], [role="textbox"] {
    cursor: text !important;
  }

  /* pointer intent while still using PNG */
  a, button, [role="button"], [aria-role="button"], [data-cursor="interactive"] {
    cursor:
      url("${cursor32}") ${HSX} ${HSY},
      -webkit-image-set(url("${cursor32}") 1x, url("${cursor64}") 2x) ${HSX} ${HSY},
      image-set(url("${cursor32}") 1x, url("${cursor64}") 2x) ${HSX} ${HSY},
      pointer !important;
  }
}
`;

  const html = document.documentElement;
  html.classList.add("custom-cursor");

  let style = document.getElementById(
    "cursor-enforcer"
  ) as HTMLStyleElement | null;
  if (!style) {
    style = document.createElement("style");
    style.id = "cursor-enforcer";
    document.head.appendChild(style);
    debug && console.log("[CursorLock] Injected enforcer style");
  }
  style.textContent = css;

  // keep our <style> last without a 1-frame gap
  let scheduled = false;
  const ensureLast = () => {
    if (!style) return;
    if (
      style.parentNode !== document.head ||
      document.head.lastChild !== style
    ) {
      document.head.appendChild(style);
      debug && console.log("[CursorLock] Re-appended enforcer (head mutation)");
    }
    if (!html.classList.contains("custom-cursor")) {
      html.classList.add("custom-cursor");
      debug && console.log("[CursorLock] Re-added html.custom-cursor");
    }
  };

  const scheduleEnsure = () => {
    if (scheduled) return;
    scheduled = true;
    (window as any).queueMicrotask
      ? queueMicrotask(() => {
          scheduled = false;
          ensureLast();
        })
      : setTimeout(() => {
          scheduled = false;
          ensureLast();
        }, 0);
  };

  const mo = new MutationObserver((mutations) => {
    const needsReassert = mutations.some((m) => {
      if (m.type === "attributes") return true;
      return Array.from(m.addedNodes).some(
        (n) => n !== style && (n.nodeName === "STYLE" || n.nodeName === "LINK")
      );
    });
    if (needsReassert) scheduleEnsure();
  });
  mo.observe(document.head, {
    childList: true,
    attributes: true,
    subtree: true,
  });

  const reassert = () => scheduleEnsure();
  window.addEventListener("focus", reassert, true);
  window.addEventListener("mouseenter", reassert, true);
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible") scheduleEnsure();
  });

  const timer = window.setInterval(scheduleEnsure, 2000);

  const onMove = (e: MouseEvent) => {
    if (!debug) return;
    const el = document.elementFromPoint(
      e.clientX,
      e.clientY
    ) as HTMLElement | null;
    if (!el) return;
    console.log(
      "[CursorLock] computed cursor:",
      getComputedStyle(el).cursor,
      "on",
      el
    );
  };
  debug && window.addEventListener("mousemove", onMove, { passive: true });

  return {
    cleanup: () => {
      mo.disconnect();
      clearInterval(timer);
      window.removeEventListener("focus", reassert, true);
      window.removeEventListener("mouseenter", reassert, true);
      debug && window.removeEventListener("mousemove", onMove);
      style?.remove();
      html.classList.remove("custom-cursor");
    },
    reassert: () => scheduleEnsure(),
  };
}
