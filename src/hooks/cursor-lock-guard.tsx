import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { installCursorLock } from "@/hooks/cursor-lock";

export default function CursorLockGuard() {
  const loc = useLocation();
  const apiRef = useRef<ReturnType<typeof installCursorLock> | null>(null);

  // Mount once
  useEffect(() => {
    apiRef.current = installCursorLock({
      debug: true,
      hotspotX: 6,
      hotspotY: 4,
    });
    return () => apiRef.current?.cleanup();
  }, []);

  // Re-assert on every route change (prevents 1-frame system cursor)
  useEffect(() => {
    apiRef.current?.reassert();
  }, [loc.pathname]);

  return null;
}
