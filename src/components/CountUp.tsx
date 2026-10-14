import { useLayoutEffect, useRef } from "react";
import { gsap, motion } from "../lib/motion";

/**
 * Counts from 0 to `value` once when it enters the viewport. Renders the final value without JS.
 * An invisible copy of the final number reserves the width, so nothing beside it shifts while counting.
 */
export default function CountUp({ value, className = "" }: { value: number; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    return motion(el, ({ reduce }) => {
      if (reduce) return;
      const state = { n: 0 };
      el.textContent = "0";
      gsap.to(state, {
        n: value,
        duration: 2.4,
        ease: "power2.out",
        onUpdate: () => {
          el.textContent = String(Math.round(state.n));
        },
        scrollTrigger: { trigger: el, start: "top 82%", once: true },
      });
      return () => {
        el.textContent = String(value);
      };
    });
  }, [value]);

  return (
    <span className={className} aria-hidden="true">
      <span className="count__ghost">{value}</span>
      <span ref={ref} className="count__live">
        {value}
      </span>
    </span>
  );
}
