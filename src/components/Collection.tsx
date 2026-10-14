import { useLayoutEffect, useRef } from "react";
import { motion } from "../lib/motion";
import { revealItems, revealLines } from "../lib/reveal";
import { COLLECTION, COMBO, SAO_VANG, TINH_HOA } from "../data/content";
import ProductChapter from "./ProductChapter";
import Combo from "./Combo";
import { Arrow } from "./MagneticButton";
import Lines from "./Lines";

const INDEX = [TINH_HOA, SAO_VANG, COMBO];

export default function Collection() {
  const intro = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const el = intro.current;
    if (!el) return;
    return motion(el, ({ reduce }) => {
      revealItems(el, reduce);
      revealLines(el, reduce);
    });
  }, []);

  return (
    <section id="bo-suu-tap" className="collection" aria-labelledby="collection-title">
      <div ref={intro} className="collection__intro section" data-theme="paper">
        <div className="container collection__grid">
          <p className="eyebrow collection__label" data-reveal>
            {COLLECTION.label}
          </p>
          <h2 id="collection-title" className="display-2 collection__title" data-lines>
            <Lines text={COLLECTION.headline} />
          </h2>
          <p className="collection__intro-text body-lg" data-reveal="0.15">
            {COLLECTION.intro}
          </p>
          <ol className="collection__index" data-reveal="0.25">
            {INDEX.map((p) => (
              <li key={p.id}>
                <a className="index-link" href={`#${p.id}`}>
                  <span className="index-link__num">{p.numeral}</span>
                  <span className="index-link__name">{p.name}</span>
                  <Arrow />
                </a>
              </li>
            ))}
          </ol>
        </div>
      </div>

      <ProductChapter product={TINH_HOA} images={["tinhhoa-1", "tinhhoa-2"]} theme="indigo" />
      <ProductChapter product={SAO_VANG} images={["saovang-1", "saovang-2"]} theme="vermilion" mirrored />
      <Combo />
    </section>
  );
}
