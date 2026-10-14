import { useLayoutEffect, useRef } from "react";
import { gsap, EASE, EASE_IN_OUT } from "../lib/motion";
import { IMAGES, storageUrl } from "../config/media";
import { BRAND, ALT } from "../data/content";
import Img from "./Img";

const MAX_TOTAL = 2.2; // seconds — the preloader never lasts longer than this
const SWEEP_IN = 0.45;
const SWEEP_OUT = 0.55;
const MIN_HOLD = 0.95;
const LATEST_EXIT = MAX_TOTAL - SWEEP_IN - SWEEP_OUT;

/** Deterministic pseudo-random so the brush edge is identical on every visit. */
function rng(seed: number) {
  return () => {
    seed = (seed * 16807) % 2147483647;
    return (seed - 1) / 2147483646;
  };
}

/** A broad ink stroke with ragged, dry-brush edges on both sides. viewBox 0 0 1600 1000, stretched. */
function brushPath() {
  const r = rng(7);
  const step = 20;
  let right = "";
  for (let y = 0; y <= 1000; y += step) right += `L${1480 + r() * 70 - (y % 60 === 0 ? r() * 40 : 0)} ${y}`;
  let left = "";
  for (let y = 1000; y >= 0; y -= step) left += `L${120 - r() * 70 + (y % 80 === 0 ? r() * 36 : 0)} ${y}`;
  let strands = "";
  for (let i = 0; i < 26; i++) {
    const y = r() * 1000;
    const h = 2 + r() * 7;
    const len = 30 + r() * 110;
    strands += `M1540 ${y}h${len}v${h}h${-len}z`;
    const y2 = r() * 1000;
    strands += `M60 ${y2}h${-len * 0.8}v${h}h${len * 0.8}z`;
  }
  return `M120 0${right}${left}Z${strands}`;
}

const BRUSH = brushPath();

type Props = { onReveal: () => void; onDone: () => void };

export default function Preloader({ onReveal, onDone }: Props) {
  const root = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const el = root.current;
    if (!el) return;
    let revealed = false;
    let finished = false;
    const reveal = () => {
      if (!revealed) {
        revealed = true;
        onReveal();
      }
    };
    const finish = () => {
      reveal();
      if (!finished) {
        finished = true;
        onDone();
      }
    };

    const ctx = gsap.context(() => {
      const q = gsap.utils.selector(el);
      const start = performance.now();
      const progress = { value: 0.08 };
      const line = q(".preloader__progress-fill");
      const setLine = () => gsap.set(line, { scaleX: progress.value });
      setLine();

      gsap
        .timeline({ defaults: { ease: EASE } })
        .from(q(".preloader__badge"), { autoAlpha: 0, y: 18, duration: 0.7 })
        .from(q(".preloader__word"), { yPercent: 115, duration: 0.8, stagger: 0.08 }, 0.12)
        .from(q(".preloader__progress"), { scaleX: 0, duration: 0.6 }, 0.2);

      let fontsDone = false;
      let heroDone = false;
      const bump = () => {
        const target = 0.2 + (fontsDone ? 0.35 : 0) + (heroDone ? 0.45 : 0);
        gsap.to(progress, { value: target, duration: 0.5, ease: EASE, onUpdate: setLine });
        if (fontsDone && heroDone) scheduleExit();
      };
      document.fonts?.ready.then(() => {
        fontsDone = true;
        bump();
      });
      const hero = new Image();
      hero.decoding = "async";
      hero.onload = hero.onerror = () => {
        heroDone = true;
        bump();
      };
      hero.src = storageUrl(IMAGES.hero);

      let exiting = false;
      const exit = () => {
        if (exiting) return;
        exiting = true;
        gsap.killTweensOf(progress);
        gsap
          .timeline({ onComplete: finish })
          .to(progress, { value: 1, duration: 0.25, ease: EASE, onUpdate: setLine })
          .fromTo(q(".preloader__ink"), { xPercent: -100 }, { xPercent: -18, duration: SWEEP_IN, ease: EASE_IN_OUT }, 0.05)
          .set(q(".preloader__paper"), { autoAlpha: 0 })
          .call(reveal)
          .to(q(".preloader__ink"), { xPercent: 70, duration: SWEEP_OUT, ease: "power2.in" });
      };
      function scheduleExit() {
        const elapsed = (performance.now() - start) / 1000;
        gsap.delayedCall(Math.max(0, MIN_HOLD - elapsed), exit);
      }
      // Never wait on a slow image: leave at the latest so the whole thing ends by MAX_TOTAL.
      gsap.delayedCall(LATEST_EXIT, exit);
    }, el);

    // Absolute failsafe, independent of GSAP's ticker (e.g. background tabs).
    const failsafe = window.setTimeout(finish, (MAX_TOTAL + 1.2) * 1000);
    return () => {
      window.clearTimeout(failsafe);
      ctx.revert();
    };
  }, [onReveal, onDone]);

  return (
    <div ref={root} className="preloader" aria-hidden="true">
      <div className="preloader__paper">
        <div className="preloader__mark">
          <div className="preloader__badge">
            <Img name="logo" alt={ALT.logo} fit="cover" priority />
          </div>
          <p className="preloader__title">
            {BRAND.name.split(" ").map((word) => (
              <span className="preloader__mask" key={word}>
                <span className="preloader__word">{word}</span>
              </span>
            ))}
          </p>
          <div className="preloader__progress">
            <span className="preloader__progress-fill" />
          </div>
        </div>
      </div>
      <svg className="preloader__ink" viewBox="0 0 1600 1000" preserveAspectRatio="none" focusable="false">
        <path d={BRUSH} />
      </svg>
    </div>
  );
}
