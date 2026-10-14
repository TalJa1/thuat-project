import { useLayoutEffect, useRef } from "react";
import { gsap, motion } from "../lib/motion";

const INTERACTIVE = "a, button, [role='button']";
const MEDIA = "[data-cursor='media']";

/** Desktop-only dot + ring. The ring swells over pictures and controls. */
export default function Cursor() {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const d = dot.current;
    const r = ring.current;
    if (!d || !r) return;
    return motion(null, ({ fine }) => {
      if (!fine) return;
      document.documentElement.classList.add("has-cursor");
      gsap.set([d, r], { xPercent: -50, yPercent: -50, autoAlpha: 0 });
      const dx = gsap.quickTo(d, "x", { duration: 0.12, ease: "power3.out" });
      const dy = gsap.quickTo(d, "y", { duration: 0.12, ease: "power3.out" });
      const rx = gsap.quickTo(r, "x", { duration: 0.55, ease: "power3.out" });
      const ry = gsap.quickTo(r, "y", { duration: 0.55, ease: "power3.out" });
      let shown = false;
      let state = "";

      const move = (e: PointerEvent) => {
        if (e.pointerType !== "mouse") return;
        if (!shown) {
          shown = true;
          gsap.set([d, r], { x: e.clientX, y: e.clientY });
          gsap.to([d, r], { autoAlpha: 1, duration: 0.3 });
        }
        dx(e.clientX);
        dy(e.clientY);
        rx(e.clientX);
        ry(e.clientY);
        const t = e.target as Element | null;
        const next = t?.closest?.(INTERACTIVE) ? "link" : t?.closest?.(MEDIA) ? "media" : "";
        if (next !== state) {
          state = next;
          r.dataset.state = next;
          d.dataset.state = next;
        }
      };
      const leave = () => {
        shown = false;
        gsap.to([d, r], { autoAlpha: 0, duration: 0.3 });
      };
      const down = () => gsap.to(r, { scale: 0.8, duration: 0.2 });
      const up = () => gsap.to(r, { scale: 1, duration: 0.4, ease: "power3.out" });

      window.addEventListener("pointermove", move, { passive: true });
      document.documentElement.addEventListener("pointerleave", leave);
      window.addEventListener("pointerdown", down);
      window.addEventListener("pointerup", up);
      return () => {
        document.documentElement.classList.remove("has-cursor");
        window.removeEventListener("pointermove", move);
        document.documentElement.removeEventListener("pointerleave", leave);
        window.removeEventListener("pointerdown", down);
        window.removeEventListener("pointerup", up);
      };
    });
  }, []);

  return (
    <>
      <div ref={ring} className="cursor cursor--ring" aria-hidden="true" />
      <div ref={dot} className="cursor cursor--dot" aria-hidden="true" />
    </>
  );
}
