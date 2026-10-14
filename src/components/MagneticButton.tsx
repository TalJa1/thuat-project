import { useLayoutEffect, useRef, type ReactNode } from "react";
import { gsap, motion } from "../lib/motion";

type Props = {
  href: string;
  children: ReactNode;
  external?: boolean;
  variant?: "solid" | "outline" | "light";
  size?: "md" | "lg" | "sm";
  magnetic?: boolean;
  className?: string;
  onClick?: () => void;
};

export function Arrow() {
  return (
    <span className="btn__arrow" aria-hidden="true">
      <svg viewBox="0 0 24 12" focusable="false">
        <path d="M0 6h22M17 1l5 5-5 5" />
      </svg>
      <svg viewBox="0 0 24 12" focusable="false">
        <path d="M0 6h22M17 1l5 5-5 5" />
      </svg>
    </span>
  );
}

/** A link styled as a button: gold fill sweeps in on hover, arrow slides, and (desktop) it eases toward the cursor. */
export default function MagneticButton({
  href,
  children,
  external = false,
  variant = "solid",
  size = "md",
  magnetic = false,
  className = "",
  onClick,
}: Props) {
  const ref = useRef<HTMLAnchorElement>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el || !magnetic) return;
    return motion(el, ({ fine }) => {
      if (!fine) return;
      const label = el.querySelector(".btn__label");
      const xTo = gsap.quickTo(el, "x", { duration: 0.8, ease: "elastic.out(1, 0.45)" });
      const yTo = gsap.quickTo(el, "y", { duration: 0.8, ease: "elastic.out(1, 0.45)" });
      const lxTo = label ? gsap.quickTo(label, "x", { duration: 0.6, ease: "power3.out" }) : null;
      const lyTo = label ? gsap.quickTo(label, "y", { duration: 0.6, ease: "power3.out" }) : null;
      const zone = el.parentElement ?? el;

      const move = (e: PointerEvent) => {
        const r = el.getBoundingClientRect();
        const dx = e.clientX - (r.left + r.width / 2);
        const dy = e.clientY - (r.top + r.height / 2);
        const reach = Math.max(r.width, r.height) * 0.9;
        const pull = Math.hypot(dx, dy) < reach ? 1 : 0;
        xTo(dx * 0.32 * pull);
        yTo(dy * 0.42 * pull);
        lxTo?.(dx * 0.12 * pull);
        lyTo?.(dy * 0.16 * pull);
      };
      const leave = () => {
        xTo(0);
        yTo(0);
        lxTo?.(0);
        lyTo?.(0);
      };
      zone.addEventListener("pointermove", move);
      zone.addEventListener("pointerleave", leave);
      return () => {
        zone.removeEventListener("pointermove", move);
        zone.removeEventListener("pointerleave", leave);
      };
    });
  }, [magnetic]);

  return (
    <a
      ref={ref}
      href={href}
      className={`btn btn--${variant} btn--${size} ${className}`}
      onClick={onClick}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
    >
      <span className="btn__fill" aria-hidden="true" />
      <span className="btn__label">
        <span className="btn__text">{children}</span>
        <Arrow />
      </span>
    </a>
  );
}
