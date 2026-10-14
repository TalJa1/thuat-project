import { useEffect, useLayoutEffect, useRef } from "react";
import { gsap, motion, EASE, DUR } from "../lib/motion";
import { ALT, HERO } from "../data/content";
import { useIsDesktop } from "../hooks/useIsDesktop";
import { useReducedMotion } from "../hooks/useReducedMotion";
import Img from "./Img";
import Steam from "./Steam";
import DrumMedallion from "./DrumMedallion";
import MagneticButton from "./MagneticButton";
import Lines from "./Lines";

export default function Hero({ revealed }: { revealed: boolean }) {
  const root = useRef<HTMLElement>(null);
  const intro = useRef<gsap.core.Timeline | null>(null);
  const revealedRef = useRef(revealed);
  const reduced = useReducedMotion();
  const desktop = useIsDesktop();

  useLayoutEffect(() => {
    const el = root.current;
    if (!el) return;
    return motion(el, ({ reduce, fine, wide }) => {
      const q = gsap.utils.selector(el);

      if (reduce) {
        intro.current = gsap
          .timeline({ paused: true })
          .from(q(".hero__content, .hero__outline, .drum"), { autoAlpha: 0, duration: 0.8, stagger: 0.1 });
        if (revealedRef.current) intro.current.play();
        return;
      }

      // Intro, played when the preloader's ink peels away.
      const tl = gsap.timeline({ paused: true, defaults: { ease: EASE } });
      tl.fromTo(q(".hero__media-inner"), { scale: 1.32 }, { scale: 1.08, duration: 2.8, ease: "expo.out" }, 0)
        .from(q(".hero__title .line__inner"), { yPercent: 115, rotate: 3, duration: DUR.slow, stagger: 0.14 }, 0.15)
        .from(q(".hero__eyebrow"), { autoAlpha: 0, y: 16, duration: DUR.base }, 0.35)
        .from(q(".hero__outline-inner"), { autoAlpha: 0, yPercent: 18, duration: 2.2 }, 0.1)
        .from(q(".drum"), { autoAlpha: 0, scale: 0.82, rotate: -40, duration: 2.6, ease: "expo.out" }, 0.1)
        .from(q(".hero__aside > *"), { autoAlpha: 0, y: 28, duration: DUR.base, stagger: 0.12 }, 0.7)
        .from(q(".hero__cue"), { autoAlpha: 0, duration: DUR.base }, 1.1)
        // after the intro, a barely-there Ken Burns drift
        .add(
          gsap.to(q(".hero__media-inner"), {
            scale: 1.14,
            xPercent: -1.5,
            duration: 18,
            ease: "sine.inOut",
            repeat: -1,
            yoyo: true,
          }),
          2.8,
        );
      intro.current = tl;
      if (revealedRef.current) tl.play();

      // Scroll: the photo sinks, the words lift away, the drum keeps turning.
      const scrub = { trigger: el, start: "top top", end: "bottom top", scrub: true };
      gsap.to(q(".hero__media"), { yPercent: wide ? 24 : 12, ease: "none", scrollTrigger: scrub });
      gsap.to(q(".hero__content"), { yPercent: wide ? -18 : -8, autoAlpha: 0.15, ease: "none", scrollTrigger: scrub });
      gsap.to(q(".hero__outline"), { yPercent: 30, ease: "none", scrollTrigger: scrub });
      gsap.to(q(".hero__drum-spin"), { rotate: 70, ease: "none", scrollTrigger: scrub });

      if (fine) {
        const ox = gsap.quickTo(q(".hero__outline-inner"), "x", { duration: 1.6, ease: EASE });
        const oy = gsap.quickTo(q(".hero__outline-inner"), "y", { duration: 1.6, ease: EASE });
        const dx = gsap.quickTo(q(".hero__drum-spin"), "x", { duration: 2, ease: EASE });
        const dy = gsap.quickTo(q(".hero__drum-spin"), "y", { duration: 2, ease: EASE });
        const onMove = (e: PointerEvent) => {
          const nx = e.clientX / window.innerWidth - 0.5;
          const ny = e.clientY / window.innerHeight - 0.5;
          ox(nx * -60);
          oy(ny * -28);
          dx(nx * 24);
          dy(ny * 18);
        };
        el.addEventListener("pointermove", onMove);
        return () => el.removeEventListener("pointermove", onMove);
      }
    });
  }, []);

  useEffect(() => {
    revealedRef.current = revealed;
    if (revealed) intro.current?.play();
  }, [revealed]);

  return (
    <section id="top" ref={root} className="hero" aria-labelledby="hero-title">
      <div className="hero__media">
        <div className="hero__media-inner">
          <Img name="hero" alt={ALT.hero} fit="cover" priority tone="ink" position="50% 40%" />
        </div>
      </div>
      <div className="hero__shade" aria-hidden="true" />
      {!reduced && <Steam count={desktop ? 16 : 6} />}

      <div className="hero__drum-wrap" aria-hidden="true">
        <div className="hero__drum-spin">
          <DrumMedallion className="hero__drum" />
        </div>
      </div>

      <div className="hero__outline" aria-hidden="true">
        <span className="hero__outline-inner">THUẬT</span>
      </div>

      <div className="hero__content container">
        <h1 id="hero-title" className="hero__title display-1">
          <Lines text={HERO.headline} />
        </h1>
        <div className="hero__aside">
          <span className="hero__eyebrow" aria-hidden="true" />
          <p className="hero__text">{HERO.text}</p>
          <MagneticButton href="#bo-suu-tap" variant="light" magnetic>
            {HERO.button}
          </MagneticButton>
        </div>
      </div>

      <div className="hero__cue" aria-hidden="true">
        <span />
      </div>
    </section>
  );
}
