import { useLayoutEffect, useRef } from "react";
import { gsap, motion } from "../lib/motion";

/** An original fine-line lotus (and bamboo for the grand variant) that draws itself as you scroll. */
const LOTUS = [
  "M500 28C514 52 520 86 500 122C480 86 486 52 500 28Z",
  "M500 122C478 108 462 82 468 52C486 66 496 92 500 122",
  "M500 122C522 108 538 82 532 52C514 66 504 92 500 122",
  "M500 122C468 122 440 106 430 80C456 82 482 98 500 122",
  "M500 122C532 122 560 106 570 80C544 82 518 98 500 122",
  "M454 128Q500 138 546 128",
  "M500 64L500 112",
];
const WATER = ["M440 142q10 -5 20 0t20 0", "M520 142q10 -5 20 0t20 0", "M478 154q11 -5 22 0t22 0"];
const LINES = ["M418 126H40", "M582 126H960"];
const TERMINALS = ["M40 126l-6 -6l-6 6l6 6z", "M960 126l6 -6l6 6l-6 6z"];

const BAMBOO = [
  // two stalks with nodes
  "M170 1000V40",
  "M152 1000V220",
  "M160 860h20M160 660h20M160 460h20M160 260h20",
  "M142 920h20M142 720h20M142 520h20M142 320h20",
  // leaves
  "M170 260C210 236 262 230 300 238C262 256 214 262 170 260Z",
  "M170 262C206 280 236 314 252 350C220 330 190 300 170 262Z",
  "M170 460C130 440 86 438 52 450C88 466 130 468 170 460Z",
  "M170 660C214 640 266 640 302 652C264 672 214 674 170 660Z",
  "M152 520C124 494 108 460 104 426C130 452 146 486 152 520Z",
];
const GRAND_LOTUS = [
  "M700 360C744 440 762 548 700 664C638 548 656 440 700 360Z",
  "M700 664C628 620 578 534 596 438C654 484 688 568 700 664",
  "M700 664C772 620 822 534 804 438C746 484 712 568 700 664",
  "M700 664C602 664 514 614 482 532C566 538 646 588 700 664",
  "M700 664C798 664 886 614 918 532C834 538 754 588 700 664",
  "M700 664C700 760 680 880 640 1000",
  "M560 690Q700 724 840 690",
  "M520 740q30 -14 60 0t60 0M760 740q30 -14 60 0t60 0",
];

type Props = { variant?: "divider" | "grand"; className?: string };

export default function LotusDivider({ variant = "divider", className = "" }: Props) {
  const ref = useRef<SVGSVGElement>(null);

  useLayoutEffect(() => {
    const svg = ref.current;
    if (!svg) return;
    return motion(svg, ({ reduce }) => {
      if (reduce) return;
      const paths = svg.querySelectorAll(".draw");
      gsap.fromTo(
        paths,
        { strokeDashoffset: 1 },
        {
          strokeDashoffset: 0,
          ease: "none",
          stagger: 0.08,
          scrollTrigger: {
            trigger: svg,
            start: variant === "grand" ? "top 85%" : "top 92%",
            end: variant === "grand" ? "bottom 40%" : "bottom 55%",
            scrub: 1,
          },
        },
      );
    });
  }, [variant]);

  if (variant === "grand") {
    return (
      <svg ref={ref} className={`lotus lotus--grand ${className}`} viewBox="0 0 1000 1000" aria-hidden="true" focusable="false">
        {[...BAMBOO, ...GRAND_LOTUS].map((d) => (
          <path key={d} className="draw" d={d} pathLength={1} />
        ))}
      </svg>
    );
  }

  return (
    <div className={`lotus-divider ${className}`} aria-hidden="true">
      <svg ref={ref} className="lotus" viewBox="0 0 1000 170" preserveAspectRatio="xMidYMid meet" focusable="false">
        {[...LINES, ...LOTUS, ...WATER, ...TERMINALS].map((d) => (
          <path key={d} className="draw" d={d} pathLength={1} />
        ))}
      </svg>
    </div>
  );
}
