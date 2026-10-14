import type Lenis from "lenis";
import { MQ } from "./motion";

let lenis: Lenis | null = null;

export function setLenis(instance: Lenis | null) {
  lenis = instance;
}

export function getLenis() {
  return lenis;
}

/** Smooth-scroll to an in-page anchor and move focus there for keyboard and screen-reader users. */
export function scrollToHash(hash: string) {
  const id = hash.replace(/^#/, "");
  const target = id === "top" ? document.getElementById("top") : document.getElementById(id);
  if (!target) return;

  const focusTarget = () => {
    if (!target.hasAttribute("tabindex")) target.setAttribute("tabindex", "-1");
    target.focus({ preventScroll: true });
  };

  if (lenis) {
    lenis.scrollTo(target, { duration: 1.6, onComplete: focusTarget });
  } else {
    const reduce = window.matchMedia(MQ.reduce).matches;
    target.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
    focusTarget();
  }
  if (history.replaceState) history.replaceState(null, "", `#${id}`);
}
