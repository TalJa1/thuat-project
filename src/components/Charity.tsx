import { useLayoutEffect, useRef } from "react";
import { gsap, motion } from "../lib/motion";
import { parallax, revealFrame, revealItems, revealLines } from "../lib/reveal";
import type { ImageKey } from "../config/media";
import { ALT, CHARITY } from "../data/content";
import Img from "./Img";
import GoldFrame from "./GoldFrame";
import CountUp from "./CountUp";
import JoinButton from "./JoinButton";
import Lines from "./Lines";

const PHOTOS: { name: ImageKey; speed: number; from: "bottom" | "left" | "right" }[] = [
  { name: "charity-1", speed: 4, from: "bottom" },
  { name: "charity-2", speed: -12, from: "right" },
  { name: "charity-3", speed: 10, from: "left" },
  { name: "charity-4", speed: -7, from: "bottom" },
];

export default function Charity() {
  const root = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const el = root.current;
    if (!el) return;
    return motion(el, ({ reduce, wide }) => {
      const q = gsap.utils.selector(el);
      revealItems(el, reduce);
      revealLines(el, reduce);
      q(".collage__item").forEach((item, i) => {
        revealFrame(item.querySelector(".frame")!, reduce, PHOTOS[i].from, i * 0.12);
        if (!reduce) parallax(item.querySelector(".collage__drift")!, PHOTOS[i].speed, wide, q(".collage")[0]);
      });
      if (!reduce) {
        gsap.fromTo(
          q(".charity__glow"),
          { yPercent: 20, scale: 0.8 },
          { yPercent: -20, scale: 1.1, ease: "none", scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true } },
        );
      }
    });
  }, []);

  return (
    <section id="lan-toa" ref={root} className="charity section" data-theme="ink" aria-labelledby="charity-title">
      <div className="charity__glow" aria-hidden="true" />
      <div className="container charity__grid">
        <header className="charity__head">
          <p className="eyebrow" data-reveal>
            {CHARITY.label}
          </p>
          <h2 id="charity-title" className="display-2" data-lines>
            <Lines text={CHARITY.headline} />
          </h2>
        </header>

        <p className="charity__count" data-reveal="0.1">
          <span className="sr-only">{CHARITY.count} </span>
          <CountUp value={CHARITY.count} className="charity__num" />
          <span className="charity__caption">{CHARITY.countCaption}</span>
        </p>

        <div className="collage">
          {PHOTOS.map((p, i) => (
            <div key={p.name} className={`collage__item collage__item--${i + 1}`}>
              <div className="collage__drift">
                <GoldFrame mat="paper">
                  <Img name={p.name} alt={ALT[p.name]} ratio="4 / 3" fit="cover" />
                </GoldFrame>
              </div>
            </div>
          ))}
        </div>

        <div className="charity__close">
          <p className="charity__text body-lg" data-reveal>
            {CHARITY.text}
          </p>
          <div className="charity__cta" data-reveal="0.15">
            <JoinButton variant="solid" size="lg" magnetic />
          </div>
        </div>
      </div>
    </section>
  );
}
