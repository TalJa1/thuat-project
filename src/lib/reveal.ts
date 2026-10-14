import { gsap, SplitText, EASE, EASE_IN_OUT, DUR } from "./motion";

/** Split a headline after its first sentence/clause so it can be set on two lines; the text itself is unchanged. */
export function splitHeadline(text: string): string[] {
  const m = text.match(/^(.+?[.,])\s+(.+)$/);
  return m ? [m[1], m[2]] : [text];
}

const START = "top 86%";

/** Fade-and-rise for every [data-reveal] in scope (fade only under reduced motion). Fires once. */
export function revealItems(scope: Element, reduce: boolean) {
  scope.querySelectorAll<HTMLElement>("[data-reveal]").forEach((el) => {
    const delay = Number(el.dataset.reveal) || 0;
    gsap.from(el, {
      autoAlpha: 0,
      y: reduce ? 0 : 32,
      duration: reduce ? 0.6 : DUR.base,
      delay,
      ease: EASE,
      scrollTrigger: { trigger: el, start: START, once: true },
    });
  });
}

/** Masked line rise for every [data-lines] block (its children are .line > .line__inner). */
export function revealLines(scope: Element, reduce: boolean) {
  scope.querySelectorAll<HTMLElement>("[data-lines]").forEach((block) => {
    const inners = block.querySelectorAll(".line__inner");
    gsap.from(inners, {
      ...(reduce ? { autoAlpha: 0 } : { yPercent: 112, rotate: 2.5 }),
      duration: reduce ? 0.6 : DUR.slow,
      stagger: 0.12,
      ease: EASE,
      scrollTrigger: { trigger: block, start: START, once: true },
    });
  });
}

/** SplitText line mask reveal for a paragraph or quote; re-splits on resize / font load. */
export function revealSplit(el: Element, reduce: boolean) {
  if (reduce) {
    gsap.from(el, { autoAlpha: 0, duration: 0.6, scrollTrigger: { trigger: el, start: START, once: true } });
    return;
  }
  let played = false;
  SplitText.create(el, {
    type: "lines",
    mask: "lines",
    linesClass: "split-line",
    autoSplit: true,
    onSplit: (self) =>
      gsap.from(self.lines, {
        yPercent: played ? 0 : 110,
        duration: DUR.slow,
        stagger: 0.09,
        ease: EASE,
        scrollTrigger: {
          trigger: el,
          start: START,
          once: true,
          onEnter: () => {
            played = true;
          },
        },
      }),
  });
}

/** Clip-path curtain reveal of a framed picture with a slow settle of the image inside. */
export function revealFrame(frame: Element, reduce: boolean, from: "bottom" | "left" | "right" = "bottom", delay = 0) {
  if (reduce) {
    gsap.from(frame, { autoAlpha: 0, duration: 0.8, scrollTrigger: { trigger: frame, start: "top 90%", once: true } });
    return;
  }
  const hidden = {
    bottom: "inset(100% 0% 0% 0%)",
    left: "inset(0% 100% 0% 0%)",
    right: "inset(0% 0% 0% 100%)",
  }[from];
  const tl = gsap.timeline({ scrollTrigger: { trigger: frame, start: "top 88%", once: true }, delay });
  tl.fromTo(frame, { clipPath: hidden }, { clipPath: "inset(0% 0% 0% 0%)", duration: DUR.slow, ease: EASE_IN_OUT, clearProps: "clipPath" });
  const img = frame.querySelector(".img");
  if (img) tl.from(img, { scale: 1.28, duration: DUR.slow + 0.6, ease: EASE }, 0);
}

/** Scrubbed vertical drift; `amount` in % of the element's height, softened on small screens. */
export function parallax(el: Element, amount: number, wide: boolean, trigger: Element = el) {
  const a = wide ? amount : amount * 0.45;
  gsap.fromTo(
    el,
    { yPercent: -a },
    { yPercent: a, ease: "none", scrollTrigger: { trigger, start: "top bottom", end: "bottom top", scrub: true } },
  );
}
