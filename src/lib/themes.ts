import { gsap, motion, ScrollTrigger } from "./motion";

/** Page colour per chapter. Every pair has been checked for WCAG AA (body text ≥ 4.5:1). */
export const THEMES = {
  paper: { bg: "#F3EBDD", fg: "#14110F", soft: "#4A4038", label: "#7A5C17", accent: "#B3202A", line: "rgba(20, 17, 15, 0.16)" },
  indigo: { bg: "#14304F", fg: "#F3EBDD", soft: "#C8D3CF", label: "#E5CB8A", accent: "#E5CB8A", line: "rgba(229, 203, 138, 0.32)" },
  vermilion: { bg: "#B3202A", fg: "#F7EFE2", soft: "#F3E4CF", label: "#F7EFE2", accent: "#F2E2B4", line: "rgba(247, 239, 226, 0.34)" },
  ink: { bg: "#14110F", fg: "#F3EBDD", soft: "#B9AE9C", label: "#C9A24B", accent: "#C9A24B", line: "rgba(201, 162, 75, 0.3)" },
} as const;

export type ThemeName = keyof typeof THEMES;

const toVars = (t: (typeof THEMES)[ThemeName]) => ({
  "--bg": t.bg,
  "--fg": t.fg,
  "--fg-soft": t.soft,
  "--label": t.label,
  "--accent": t.accent,
  "--line": t.line,
});

/**
 * Scrubs the page colours between consecutive [data-theme] chapters:
 * paper → indigo → vermilion → paper → ink. Under reduced motion it switches with a short CSS fade.
 */
export function initThemeShift() {
  const root = document.documentElement;
  return motion(null, ({ reduce }) => {
    const sections = gsap.utils.toArray<HTMLElement>("[data-theme]");
    if (!sections.length) return;
    const first = sections[0].dataset.theme as ThemeName;
    gsap.set(root, toVars(THEMES[first]));

    sections.forEach((section, i) => {
      if (i === 0) return;
      const prev = sections[i - 1].dataset.theme as ThemeName;
      const next = section.dataset.theme as ThemeName;
      if (prev === next) return;

      if (reduce) {
        ScrollTrigger.create({
          trigger: section,
          start: "top 55%",
          onEnter: () => gsap.set(root, toVars(THEMES[next])),
          onLeaveBack: () => gsap.set(root, toVars(THEMES[prev])),
        });
        return;
      }

      gsap.fromTo(root, toVars(THEMES[prev]), {
        ...toVars(THEMES[next]),
        ease: "none",
        immediateRender: false,
        scrollTrigger: {
          trigger: section,
          start: "top 80%",
          end: "top 25%",
          scrub: 0.4,
        },
      });
    });
  });
}
