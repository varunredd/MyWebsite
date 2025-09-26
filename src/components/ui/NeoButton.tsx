// src/components/NeoButton.tsx
import * as React from "react";
import { Button, type ButtonProps } from "@/components/ui/button";

type NeoVariant = "primary" | "outline" | "ghost";

export const NeoButton = React.forwardRef<
  HTMLButtonElement,
  ButtonProps & {
    neoVariant?: NeoVariant;
  }
>(
  (
    { neoVariant = "primary", className, onMouseDown, children, ...props },
    ref
  ) => {
    const innerRef = React.useRef<HTMLButtonElement | null>(null);

    // allow both forwarded ref + internal ref
    React.useImperativeHandle(ref, () => innerRef.current as HTMLButtonElement);

    const handleMouseDown: React.MouseEventHandler<HTMLButtonElement> = (e) => {
      onMouseDown?.(e);

      const el = innerRef.current;
      if (!el) return;

      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const span = document.createElement("span");
      span.className = "ripple";
      span.style.left = `${x}px`;
      span.style.top = `${y}px`;

      el.appendChild(span);
      el.classList.add("rippling");

      span.addEventListener(
        "animationend",
        () => {
          span.remove();
          el.classList.remove("rippling");
        },
        { once: true }
      );
    };

    return (
      <Button
        ref={innerRef}
        className={`neo neo--${neoVariant} ${className ?? ""}`}
        onMouseDown={handleMouseDown}
        {...props}
      >
        {children}
      </Button>
    );
  }
);
NeoButton.displayName = "NeoButton";
