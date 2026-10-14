import { useEffect, useRef } from "react";

type Wisp = {
  x: number; // 0..1 across the canvas
  phase: number;
  amp: number; // px of sideways sway
  freq: number;
  size: number; // px
  life: number; // seconds
  age: number;
  rise: number; // 0..1 of the canvas height it travels
};

const TRAIL = 9;
const SCALE = 0.5; // render at half resolution; the upscale is part of the softness

function makeSprite() {
  const s = document.createElement("canvas");
  s.width = s.height = 128;
  const g = s.getContext("2d");
  if (!g) return s;
  const grad = g.createRadialGradient(64, 64, 0, 64, 64, 64);
  grad.addColorStop(0, "rgba(243,235,221,0.9)");
  grad.addColorStop(0.35, "rgba(243,235,221,0.42)");
  grad.addColorStop(0.7, "rgba(243,235,221,0.1)");
  grad.addColorStop(1, "rgba(243,235,221,0)");
  g.fillStyle = grad;
  g.fillRect(0, 0, 128, 128);
  return s;
}

function spawn(w: Wisp, fresh: boolean) {
  w.x = 0.08 + Math.random() * 0.84;
  w.phase = Math.random() * Math.PI * 2;
  w.amp = 18 + Math.random() * 46;
  w.freq = 0.6 + Math.random() * 0.9;
  w.size = 70 + Math.random() * 90;
  w.life = 9 + Math.random() * 7;
  w.rise = 0.55 + Math.random() * 0.35;
  w.age = fresh ? Math.random() * w.life : 0;
}

/** Calm, translucent steam wisps rising from the lower part of its parent. Pauses off-screen. */
export default function Steam({ count = 16 }: { count?: number }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const sprite = makeSprite();
    const wisps: Wisp[] = Array.from({ length: count }, () => {
      const w = {} as Wisp;
      spawn(w, true);
      return w;
    });

    let width = 0;
    let height = 0;
    const resize = () => {
      width = Math.max(1, Math.round(canvas.clientWidth * SCALE));
      height = Math.max(1, Math.round(canvas.clientHeight * SCALE));
      canvas.width = width;
      canvas.height = height;
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    let raf = 0;
    let last = 0;
    let visible = false;

    const frame = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000 || 0);
      last = now;
      ctx.clearRect(0, 0, width, height);

      for (const w of wisps) {
        w.age += dt;
        if (w.age >= w.life) spawn(w, false);
        const t = w.age / w.life;
        for (let k = 0; k < TRAIL; k++) {
          const p = t - k * 0.022;
          if (p <= 0) break;
          const eased = 1 - Math.pow(1 - p, 1.6);
          const y = height + 40 * SCALE - eased * height * w.rise;
          const sway = Math.sin(p * w.freq * Math.PI * 2 + w.phase) * w.amp * (0.25 + p) * SCALE;
          const x = w.x * width + sway;
          const size = w.size * SCALE * (0.55 + p * 1.5);
          const alpha = Math.sin(Math.PI * p) * 0.075 * (1 - k / TRAIL);
          if (alpha <= 0.002) continue;
          ctx.globalAlpha = alpha;
          ctx.drawImage(sprite, x - size / 2, y - size / 2, size, size * 1.25);
        }
      }
      ctx.globalAlpha = 1;
      raf = requestAnimationFrame(frame);
    };

    const start = () => {
      if (raf || !visible || document.hidden) return;
      last = performance.now();
      raf = requestAnimationFrame(frame);
    };
    const stop = () => {
      cancelAnimationFrame(raf);
      raf = 0;
    };

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) start();
      else stop();
    });
    io.observe(canvas);
    const onVisibility = () => (document.hidden ? stop() : start());
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      stop();
      io.disconnect();
      ro.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [count]);

  return <canvas ref={ref} className="steam" aria-hidden="true" />;
}
