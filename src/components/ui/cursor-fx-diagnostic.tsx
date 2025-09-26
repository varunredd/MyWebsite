// src/components/ui/CursorFXDiagnostic.tsx
import { useEffect } from "react";

export default function CursorFXDiagnostic() {
  useEffect(() => {
    // Unscoped global kill – diagnostic only
    const style = document.createElement("style");
    style.id = "cursor-diagnostic-global";
    style.textContent = `
      * { cursor: none !important; }
      *::before, *::after { cursor: none !important; }
      html, body { cursor: none !important; }
    `;
    document.head.appendChild(style);

    // Extra belt & suspenders
    const onOver = (e: MouseEvent) => {
      const t = e.target as HTMLElement | null;
      if (t) t.style.setProperty("cursor", "none", "important");
    };
    window.addEventListener("mouseover", onOver, { passive: true });

    return () => {
      window.removeEventListener("mouseover", onOver);
      document.getElementById("cursor-diagnostic-global")?.remove();
    };
  }, []);

  return null;
}
