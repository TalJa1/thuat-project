import { useLayoutEffect, useRef } from "react";
import { gsap, motion, EASE, EASE_IN_OUT, DUR } from "../lib/motion";
import { revealItems, revealLines } from "../lib/reveal";
import { ALT, COMBO } from "../data/content";
import Img from "./Img";
import GoldFrame from "./GoldFrame";
import Price from "./Price";

/** Chapter 03 — the climax: indigo and vermilion meet in an arch behind the pair. */
export default function Combo() {
  const root = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const el = root.current;
    if (!el) return;
    return motion(el, ({ reduce, wide }) => {
      const q = gsap.utils.selector(el);
      revealItems(el, reduce);
      revealLines(el, reduce);
      const stage = q(".combo__stage")[0];

      if (reduce) {
        gsap.from(q(".combo__arch, .combo__float"), {
          autoAlpha: 0,
          duration: 0.8,
          scrollTrigger: { trigger: stage, start: "top 85%", once: true },
        });
        return;
      }

      gsap
        .timeline({ scrollTrigger: { trigger: stage, start: "top 78%", once: true } })
        .fromTo(q(".combo__arch"), { clipPath: "inset(100% 0% 0% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: DUR.slow, ease: EASE_IN_OUT })
        .from(q(".combo__float"), { scale: 0.78, autoAlpha: 0, y: 60, duration: DUR.slow + 0.2, ease: EASE }, 0.35)
        .from(q(".combo__shadow"), { scaleX: 0.3, autoAlpha: 0, duration: DUR.slow, ease: EASE }, 0.6);

      // Gentle floating, like something carried on warm air.
      gsap.to(q(".combo__bob"), { y: wide ? -14 : -8, rotate: 0.6, duration: 3.6, ease: "sine.inOut", repeat: -1, yoyo: true });
      gsap.to(q(".combo__shadow"), { scaleX: 0.86, opacity: 0.6, duration: 3.6, ease: "sine.inOut", repeat: -1, yoyo: true });
      gsap.fromTo(
        q(".combo__arch-seam"),
        { yPercent: -30 },
        { yPercent: 30, ease: "none", scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true } },
      );
    });
  }, []);

  return (
    <article id={COMBO.id} ref={root} className="combo" data-theme="paper" aria-labelledby="combo-title">
      <div className="container combo__grid">
        <div className="combo__head">
          <p className="combo__numeral" aria-hidden="true">
            {COMBO.numeral}
          </p>
          <h3 id="combo-title" className="combo__name display-3" data-lines>
            <span className="line">
              <span className="line__inner">{COMBO.name}</span>
            </span>
          </h3>
        </div>

        <div className="combo__stage">
          <div className="combo__arch" aria-hidden="true">
            <span className="combo__arch-seam" />
          </div>
          <div className="combo__float">
            <div className="combo__bob">
              <GoldFrame mat="paper">
                <Img name="combo" alt={ALT.combo} ratio="1414 / 2000" fit="contain" />
              </GoldFrame>
            </div>
            <span className="combo__shadow" aria-hidden="true" />
          </div>
        </div>

        <div className="combo__offer" data-reveal="0.2">
          <span className="rule" aria-hidden="true" />
          <Price value={COMBO.price} className="combo__price" />
        </div>
      </div>
    </article>
  );
}
