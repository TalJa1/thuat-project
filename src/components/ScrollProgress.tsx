import { useLayoutEffect, useRef } from "react";
import { gsap, motion } from "../lib/motion";

/** A gold hairline on the right edge that fills as the page is read. */
export default function ScrollProgress() {
  const fill = useRef<HTMLSpanElement>(null);

  useLayoutEffect(() => {
    const el = fill.current;
    if (!el) return;
    return motion(null, () => {
      gsap.fromTo(
        el,
        { scaleY: 0 },
        { scaleY: 1, ease: "none", scrollTrigger: { start: 0, end: "max", scrub: 0.3 } },
      );
    });
  }, []);

  return (
    <div className="progress" aria-hidden="true">
      <span ref={fill} className="progress__fill" />
    </div>
  );
}
