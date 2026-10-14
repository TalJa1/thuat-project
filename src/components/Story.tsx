import { useLayoutEffect, useRef } from "react";
import { gsap, motion, SplitText } from "../lib/motion";
import { parallax, revealFrame, revealItems, revealLines, revealSplit } from "../lib/reveal";
import { ALT, STORY } from "../data/content";
import Img from "./Img";
import GoldFrame from "./GoldFrame";
import Lines from "./Lines";

export default function Story() {
  const root = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const el = root.current;
    if (!el) return;
    return motion(el, ({ reduce, wide }) => {
      const q = gsap.utils.selector(el);
      revealItems(el, reduce);
      revealLines(el, reduce);
      revealSplit(q(".quote__text")[0], reduce);
      revealFrame(q(".story__media .frame")[0], reduce);

      if (reduce) return;

      // Reading light: each word warms from faint to full ink as it passes the middle of the screen.
      const text = q(".story__text")[0];
      SplitText.create(text, {
        type: "words",
        wordsClass: "word",
        autoSplit: true,
        onSplit: (self) =>
          gsap.fromTo(
            self.words,
            { opacity: 0.16 },
            {
              opacity: 1,
              ease: "none",
              stagger: 0.1,
              scrollTrigger: { trigger: text, start: "top 78%", end: "bottom 52%", scrub: 0.6 },
            },
          ),
      });

      // The photograph drifts against the text.
      parallax(q(".story__parallax")[0], 9, wide, q(".story__media")[0]);
      gsap.fromTo(
        q(".quote__mark"),
        { yPercent: 30, rotate: -8 },
        { yPercent: -30, rotate: 4, ease: "none", scrollTrigger: { trigger: q(".quote")[0], start: "top bottom", end: "bottom top", scrub: true } },
      );
    });
  }, []);

  return (
    <section id="cau-chuyen" ref={root} className="story section" data-theme="paper" aria-labelledby="story-title">
      <div className="container story__grid">
        <header className="story__head">
          <p className="eyebrow" data-reveal>
            {STORY.label}
          </p>
          <h2 id="story-title" className="display-2" data-lines>
            <Lines text={STORY.headline} />
          </h2>
        </header>

        <div className="story__media">
          <div className="story__parallax">
            <GoldFrame mat="paper-2">
              <Img name="story" alt={ALT.story} ratio="4 / 5" fit="cover" position="45% 50%" />
            </GoldFrame>
          </div>
        </div>

        <p className="story__text lead">{STORY.text}</p>

        <aside className="quote" aria-label={STORY.quoteLabel}>
          <svg className="quote__mark" viewBox="0 0 120 90" aria-hidden="true" focusable="false">
            <path d="M8 86c0-30 8-56 40-80l6 8C36 30 30 46 30 58c10 0 18 8 18 18s-9 12-20 12C16 88 8 82 8 86zM68 86c0-30 8-56 40-80l6 8C96 30 90 46 90 58c10 0 18 8 18 18s-9 12-20 12C76 88 68 82 68 86z" />
          </svg>
          <p className="eyebrow quote__label" data-reveal>
            {STORY.quoteLabel}
          </p>
          <blockquote className="quote__body">
            <p className="quote__text">{STORY.quote}</p>
          </blockquote>
        </aside>
      </div>
    </section>
  );
}
