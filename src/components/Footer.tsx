import { useLayoutEffect, useRef } from "react";
import { gsap, motion } from "../lib/motion";
import { ALT, BRAND, UI } from "../data/content";
import Img from "./Img";
import Marquee from "./Marquee";
import JoinButton from "./JoinButton";

export default function Footer() {
  const root = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const el = root.current;
    if (!el) return;
    return motion(el, ({ reduce }) => {
      const q = gsap.utils.selector(el);
      if (reduce) {
        gsap.from(q(".footer__word"), { autoAlpha: 0, duration: 0.8, scrollTrigger: { trigger: el, start: "top 80%", once: true } });
        return;
      }
      // The wordmark rises out of the floor as the page ends.
      gsap.fromTo(
        q(".footer__word"),
        { yPercent: 65 },
        { yPercent: 0, ease: "none", scrollTrigger: { trigger: el, start: "top bottom", end: "bottom bottom", scrub: true } },
      );
      gsap.from(q(".footer__word-part"), {
        yPercent: 40,
        stagger: 0.12,
        ease: "none",
        scrollTrigger: { trigger: el, start: "top 90%", end: "bottom bottom", scrub: true },
      });
    });
  }, []);

  return (
    <footer ref={root} className="footer" data-theme="ink">
      <Marquee text={BRAND.tagline} />
      <div className="container footer__grid">
        <a className="footer__brand" href="#top" aria-label={`${BRAND.name} — về đầu trang`}>
          <span className="brand__badge brand__badge--lg">
            <Img name="logo" alt={ALT.logo} fit="cover" />
          </span>
        </a>
        <nav className="footer__nav" aria-label="Điều hướng chân trang">
          <ul>
            {UI.nav.map((item) => (
              <li key={item.href}>
                <a className="link" href={item.href}>
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div className="footer__cta">
          <JoinButton variant="outline" magnetic />
        </div>
      </div>
      <div className="footer__wordmark" aria-hidden="true">
        <p className="footer__word">
          <span className="footer__word-part">THUẬT</span> <span className="footer__word-part footer__word-part--em">PROJECT</span>
        </p>
      </div>
      <div className="container footer__base">
        <p>{UI.copyright}</p>
      </div>
    </footer>
  );
}
