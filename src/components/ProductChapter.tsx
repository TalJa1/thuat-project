import { useLayoutEffect, useRef } from "react";
import { gsap, motion, EASE } from "../lib/motion";
import { parallax, revealFrame, revealItems, revealLines } from "../lib/reveal";
import type { ImageKey } from "../config/media";
import { ALT, type Product } from "../data/content";
import Img from "./Img";
import GoldFrame from "./GoldFrame";
import DrumMedallion from "./DrumMedallion";
import LotusDivider from "./LotusDivider";
import Price from "./Price";

type Props = {
  product: Product;
  images: [ImageKey, ImageKey];
  theme: "indigo" | "vermilion";
  mirrored?: boolean;
};

export default function ProductChapter({ product, images, theme, mirrored = false }: Props) {
  const root = useRef<HTMLElement>(null);
  const [main, second] = images;
  const design = product.design?.match(/^([^:]+:)\s*(.*)$/);

  useLayoutEffect(() => {
    const el = root.current;
    if (!el) return;
    return motion(el, ({ reduce, fine, wide }) => {
      const q = gsap.utils.selector(el);
      revealItems(el, reduce);
      revealLines(el, reduce);
      revealFrame(q(".chapter__plate--main .frame")[0], reduce, "bottom");
      revealFrame(q(".chapter__plate--second .frame")[0], reduce, mirrored ? "left" : "right", 0.25);

      if (reduce) return;

      parallax(q(".chapter__plate--main")[0], 5, wide, el);
      parallax(q(".chapter__plate--second")[0], -16, wide, el);
      gsap.fromTo(
        q(".chapter__numeral"),
        { yPercent: 40 },
        { yPercent: -40, ease: "none", scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true } },
      );

      if (theme === "vermilion") {
        gsap.fromTo(
          q(".chapter__sweep"),
          { xPercent: -120 },
          { xPercent: 120, ease: "none", scrollTrigger: { trigger: el, start: "top 80%", end: "bottom 20%", scrub: 1.2 } },
        );
        gsap.to(q(".chapter__drum-spin"), {
          rotate: -60,
          ease: "none",
          scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true },
        });
      }

      if (fine) {
        const visual = q(".chapter__visual")[0] as HTMLElement;
        const tilt = q(".chapter__tilt")[0];
        gsap.set(tilt, { transformPerspective: 1400 });
        const rx = gsap.quickTo(tilt, "rotationX", { duration: 1.1, ease: EASE });
        const ry = gsap.quickTo(tilt, "rotationY", { duration: 1.1, ease: EASE });
        const sx = gsap.quickTo(q(".chapter__plate--second .frame"), "x", { duration: 1.1, ease: EASE });
        const sy = gsap.quickTo(q(".chapter__plate--second .frame"), "y", { duration: 1.1, ease: EASE });
        const move = (e: PointerEvent) => {
          const r = visual.getBoundingClientRect();
          const nx = (e.clientX - r.left) / r.width - 0.5;
          const ny = (e.clientY - r.top) / r.height - 0.5;
          ry(nx * 7);
          rx(ny * -6);
          sx(nx * 18);
          sy(ny * 14);
        };
        const leave = () => {
          rx(0);
          ry(0);
          sx(0);
          sy(0);
        };
        visual.addEventListener("pointermove", move);
        visual.addEventListener("pointerleave", leave);
        return () => {
          visual.removeEventListener("pointermove", move);
          visual.removeEventListener("pointerleave", leave);
        };
      }
    });
  }, [mirrored, theme]);

  return (
    <article
      id={product.id}
      ref={root}
      className={`chapter chapter--${theme} ${mirrored ? "chapter--mirrored" : ""}`}
      data-theme={theme}
      aria-labelledby={`${product.id}-title`}
    >
      <div className="chapter__decor" aria-hidden="true">
        {theme === "indigo" ? (
          <LotusDivider variant="grand" className="chapter__lotus" />
        ) : (
          <>
            <div className="chapter__drum-wrap">
              <div className="chapter__drum-spin">
                <DrumMedallion />
              </div>
            </div>
            <div className="chapter__sweep" />
          </>
        )}
      </div>

      <div className="container chapter__grid">
        <div className="chapter__visual">
          <div className="chapter__tilt">
            <div className="chapter__plate chapter__plate--main">
              <GoldFrame mat="paper-2">
                <Img name={main} alt={ALT[main]} ratio="1 / 1" fit="contain" />
              </GoldFrame>
            </div>
            <div className="chapter__plate chapter__plate--second">
              <GoldFrame mat="paper">
                <Img name={second} alt={ALT[second]} ratio="16 / 9" fit="contain" />
              </GoldFrame>
            </div>
          </div>
        </div>

        <div className="chapter__copy">
          <p className="chapter__numeral" aria-hidden="true">
            {product.numeral}
          </p>
          <h3 id={`${product.id}-title`} className="chapter__name display-3" data-lines>
            <span className="line">
              <span className="line__inner">{product.name}</span>
            </span>
          </h3>
          {product.subtitle && (
            <p className="chapter__subtitle" data-reveal="0.15">
              {product.subtitle}
            </p>
          )}
          <span className="rule" data-reveal="0.2" aria-hidden="true" />
          {product.description && (
            <p className="chapter__desc" data-reveal="0.25">
              {product.description}
            </p>
          )}
          {product.design && (
            <p className="chapter__design" data-reveal="0.3">
              {design ? (
                <>
                  <span className="chapter__design-label">{design[1]}</span> {design[2]}
                </>
              ) : (
                product.design
              )}
            </p>
          )}
          <div data-reveal="0.35">
            <Price value={product.price} className="chapter__price" />
          </div>
        </div>
      </div>
    </article>
  );
}
