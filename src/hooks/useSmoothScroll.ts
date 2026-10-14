import { useEffect } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger } from "../lib/motion";
import { scrollToHash, setLenis } from "../lib/scroll";

/** Lenis smooth scrolling driven by GSAP's ticker (off under reduced motion), plus in-page anchor handling. */
export function useSmoothScroll(reduced: boolean) {
  useEffect(() => {
    let lenis: Lenis | null = null;
    let tick: ((time: number) => void) | null = null;

    if (!reduced) {
      lenis = new Lenis({ lerp: 0.085, wheelMultiplier: 0.9, anchors: false });
      lenis.on("scroll", ScrollTrigger.update);
      tick = (time: number) => lenis?.raf(time * 1000);
      gsap.ticker.add(tick);
      gsap.ticker.lagSmoothing(0);
      setLenis(lenis);
    }

    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const link = (e.target as Element | null)?.closest?.('a[href^="#"]');
      if (!link) return;
      const hash = link.getAttribute("href") ?? "";
      if (hash.length < 2 || !document.getElementById(hash.slice(1))) return;
      e.preventDefault();
      scrollToHash(hash);
    };
    document.addEventListener("click", onClick);

    return () => {
      document.removeEventListener("click", onClick);
      if (tick) gsap.ticker.remove(tick);
      gsap.ticker.lagSmoothing(500, 33);
      lenis?.destroy();
      setLenis(null);
    };
  }, [reduced]);
}
