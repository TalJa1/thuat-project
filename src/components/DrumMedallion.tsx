/**
 * An original, geometric reading of a Đông Sơn bronze-drum face:
 * a many-rayed sun star, hatched feathers between the rays, and concentric bands of
 * circle chains, combs, abstract Lạc birds and sawtooth. Two layers counter-rotate slowly.
 */
const TAU = Math.PI * 2;
const f = (n: number) => n.toFixed(2);
const polar = (r: number, a: number) => `${f(Math.cos(a) * r)} ${f(Math.sin(a) * r)}`;

function circle(cx: number, cy: number, r: number) {
  return `M${f(cx + r)} ${f(cy)}a${r} ${r} 0 1 0 ${f(-2 * r)} 0a${r} ${r} 0 1 0 ${f(2 * r)} 0`;
}

function ring(r: number) {
  return circle(0, 0, r);
}

function ticks(count: number, r1: number, r2: number) {
  let d = "";
  for (let i = 0; i < count; i++) {
    const a = (i / count) * TAU;
    d += `M${polar(r1, a)}L${polar(r2, a)}`;
  }
  return d;
}

function star(rays: number, inner: number, outer: number) {
  let d = "";
  const half = (Math.PI / rays) * 0.62;
  for (let i = 0; i < rays; i++) {
    const a = (i / rays) * TAU - Math.PI / 2;
    d += `M${polar(inner, a - half)}L${polar(outer, a)}L${polar(inner, a + half)}`;
  }
  return d + ring(inner);
}

function feathers(rays: number, radii: number[]) {
  let d = "";
  for (let i = 0; i < rays; i++) {
    const a = ((i + 0.5) / rays) * TAU - Math.PI / 2;
    for (const r of radii) {
      const spread = 0.09 * (110 / r);
      d += `M${polar(r - 12, a - spread)}L${polar(r, a)}L${polar(r - 12, a + spread)}`;
    }
  }
  return d;
}

function circleChain(count: number, r: number, size: number) {
  let d = "";
  for (let i = 0; i < count; i++) {
    const a = (i / count) * TAU;
    const [x, y] = [Math.cos(a) * r, Math.sin(a) * r];
    d += circle(x, y, size) + circle(x, y, size * 0.45);
  }
  return d;
}

function tangentChain(count: number, r: number, size: number) {
  let d = "";
  for (let i = 0; i < count; i++) {
    const a = (i / count) * TAU;
    const b = ((i + 1) / count) * TAU;
    const [x, y] = [Math.cos(a) * r, Math.sin(a) * r];
    d += circle(x, y, size) + circle(x, y, size * 0.5);
    // tangent strokes linking this motif to the next, as on the drum's bands
    d += `M${polar(r + size, a)}L${polar(r - size, b)}`;
  }
  return d;
}

function sawtooth(count: number, r1: number, r2: number) {
  let d = `M${polar(r1, 0)}`;
  for (let i = 0; i < count; i++) {
    const a = (i / count) * TAU;
    const b = ((i + 1) / count) * TAU;
    d += `L${polar(r2, (a + b) / 2)}L${polar(r1, b)}`;
  }
  return d;
}

// One abstract long-beaked bird in flight, drawn along +x, centred on the origin.
const BIRD =
  "M38 0L20 -2Q14 -9 7 -5Q-8 3 -30 2L-40 -9M-30 2L-42 9M5 -3Q-4 -24 -20 -29Q-12 -12 -9 0M13 -7L19 -17L9 -9";

const CORE = star(14, 26, 158) + feathers(14, [70, 98, 126]) + ring(14) + ring(6);
const OUTER =
  ring(168) +
  ring(174) +
  circleChain(32, 190, 11) +
  ring(206) +
  ring(211) +
  ticks(144, 215, 237) +
  ring(242) +
  ring(336) +
  ring(341) +
  sawtooth(80, 345, 366) +
  ring(371) +
  tangentChain(28, 400, 14) +
  ring(430) +
  ring(435) +
  ticks(220, 440, 458) +
  ring(463);

const BIRDS = Array.from({ length: 10 }, (_, i) => (i / 10) * 360);

type Props = { className?: string };

export default function DrumMedallion({ className = "" }: Props) {
  return (
    <div className={`drum ${className}`} aria-hidden="true">
      <svg className="drum__layer drum__layer--outer" viewBox="-480 -480 960 960" focusable="false">
        <path d={OUTER} />
        <g>
          {BIRDS.map((deg) => (
            <path key={deg} d={BIRD} transform={`rotate(${deg}) translate(289 0) rotate(-90) scale(1.25)`} />
          ))}
        </g>
      </svg>
      <svg className="drum__layer drum__layer--core" viewBox="-480 -480 960 960" focusable="false">
        <path d={CORE} />
      </svg>
    </div>
  );
}
