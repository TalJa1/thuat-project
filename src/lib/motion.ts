import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

gsap.registerPlugin(ScrollTrigger, SplitText);

/** One signature ease and a short list of durations, used everywhere. */
export const EASE = "power3.out";
export const EASE_IN_OUT = "power3.inOut";
export const DUR = { quick: 0.6, base: 1.1, slow: 1.6 } as const;

export const MQ = {
  reduce: "(prefers-reduced-motion: reduce)",
  /** Big screen with a precise pointer: custom cursor, tilt, magnetism. */
  fine: "(min-width: 900px) and (hover: hover) and (pointer: fine)",
  wide: "(min-width: 900px)",
} as const;

export type MotionFlags = { reduce: boolean; fine: boolean; wide: boolean };

/**
 * Runs `setup` inside gsap.matchMedia so every tween / ScrollTrigger / SplitText it creates
 * is reverted automatically when a media query flips or the component unmounts.
 */
export function motion(scope: Element | null, setup: (flags: MotionFlags) => void | (() => void)) {
  const mm = gsap.matchMedia(scope ?? undefined);
  mm.add({ reduce: MQ.reduce, fine: MQ.fine, wide: MQ.wide, all: "all" }, (ctx) => {
    const c = ctx.conditions as Record<string, boolean>;
    return setup({ reduce: !!c.reduce, fine: !!c.fine && !c.reduce, wide: !!c.wide });
  });
  return () => mm.revert();
}

/** Mask-reveal lines of a block of text. Pads masks so stacked Vietnamese diacritics are never clipped. */
export function splitLines(el: Element) {
  return SplitText.create(el, {
    type: "lines",
    mask: "lines",
    linesClass: "split-line",
    aria: "auto",
  });
}

export { gsap, ScrollTrigger, SplitText };
