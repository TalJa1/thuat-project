/** A slow, endless ribbon of text separated by small sun-stars. CSS-driven; stops under reduced motion. */
function Star() {
  return (
    <svg className="marquee__star" viewBox="-10 -10 20 20" aria-hidden="true" focusable="false">
      <path d="M0-10L2-2L10 0L2 2L0 10L-2 2L-10 0L-2-2Z" />
    </svg>
  );
}

export default function Marquee({ text, repeat = 3 }: { text: string; repeat?: number }) {
  const items = Array.from({ length: repeat });
  const group = (hidden: boolean) => (
    <div className="marquee__group" aria-hidden={hidden || undefined}>
      {items.map((_, i) => (
        <span className="marquee__item" key={i} aria-hidden={i > 0 || undefined}>
          {text}
          <Star />
        </span>
      ))}
    </div>
  );
  return (
    <div className="marquee">
      <div className="marquee__track">
        {group(false)}
        {group(true)}
      </div>
    </div>
  );
}
