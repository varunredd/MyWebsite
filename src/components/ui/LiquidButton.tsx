// components/LiquidButton.tsx
import { PropsWithChildren, useRef } from "react";
import clsx from "clsx";

type Variant = "cyan" | "violet" | "lime";

export function LiquidButton({
  variant = "cyan",
  className,
  onClick,
  onMouseEnter,
  children,
  ariaLabel,
}: PropsWithChildren<{
  variant?: Variant;
  className?: string;
  onClick?: () => void;
  onMouseEnter?: () => void;
  ariaLabel?: string;
}>) {
  const ref = useRef<HTMLButtonElement>(null);

  const makeRipple = (e: React.MouseEvent) => {
    const b = ref.current?.getBoundingClientRect();
    if (!b) return;
    const x = e.clientX - b.left;
    const y = e.clientY - b.top;
    ref.current?.style.setProperty("--x", `${x}px`);
    ref.current?.style.setProperty("--y", `${y}px`);
    ref.current?.classList.remove("rippling");
    void ref.current?.offsetWidth;
    ref.current?.classList.add("rippling");
  };

  return (
    <>
      <svg style={{ position: "absolute", width: 0, height: 0 }}>
        <defs>
          <filter id="goo">
            <feGaussianBlur in="SourceGraphic" stdDeviation="6" result="blur" />
            <feColorMatrix
              in="blur"
              mode="matrix"
              values="
                1 0 0 0 0
                0 1 0 0 0
                0 0 1 0 0
                0 0 0 18 -8"
              result="goo"
            />
            <feBlend in="SourceGraphic" in2="goo" />
          </filter>
        </defs>
      </svg>

      <button
        ref={ref}
        className={clsx(
          "btn-cta btn-liquid",
          variant === "cyan" && "btn-cyan",
          variant === "violet" && "btn-violet",
          variant === "lime" && "btn-lime",
          className
        )}
        onClick={(e) => {
          makeRipple(e);
          onClick?.();
        }}
        onMouseEnter={onMouseEnter}
        aria-label={ariaLabel}
      >
        <span className="goo-wrap" aria-hidden>
          <span className="blob b1" />
          <span className="blob b2" />
          <span className="blob b3" />
        </span>
        <span className="relative z-10 inline-flex items-center gap-2">
          {children}
        </span>
        <span className="r" />
      </button>
    </>
  );
}
