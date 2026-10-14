import { useState, type CSSProperties } from "react";
import { candidateFiles, isPending, storageUrl, type ImageKey } from "../config/media";
import { UI } from "../data/content";

/** Remembers which file name worked for each key so repeated uses skip known 404s. */
const resolved = new Map<string, string>();
const failed = new Set<string>();

type Props = {
  name: ImageKey;
  alt: string;
  /** "contain" for products (never cropped), "cover" for photographs. */
  fit?: "cover" | "contain";
  /** Reserve space with an aspect ratio (e.g. "4 / 3"); omit when the parent sizes the image (fill). */
  ratio?: string;
  priority?: boolean;
  className?: string;
  position?: string;
  tone?: "paper" | "indigo" | "vermilion" | "ink";
};

export default function Img({ name, alt, fit = "cover", ratio, priority = false, className = "", position, tone = "paper" }: Props) {
  const pending = isPending(name);
  const candidates = pending ? [] : candidateFiles(name);
  const cached = resolved.get(name);
  const [index, setIndex] = useState(() => (cached ? Math.max(0, candidates.indexOf(cached)) : 0));
  const [loaded, setLoaded] = useState(false);
  const [broken, setBroken] = useState(() => pending || failed.has(name));

  const file = candidates[index];
  const style: CSSProperties = ratio ? { aspectRatio: ratio } : {};
  const classes = `img img--${fit} img--${tone} ${ratio ? "" : "img--fill"} ${loaded ? "is-loaded" : ""} ${className}`;

  if (broken || !file) {
    return (
      <div className={`${classes} img--placeholder`} style={style} role="img" aria-label={alt}>
        <span className="img__placeholder-text">{UI.imagePending}</span>
      </div>
    );
  }

  return (
    <div className={classes} style={style}>
      <img
        key={file}
        src={storageUrl(file)}
        alt={alt}
        loading={priority ? "eager" : "lazy"}
        decoding="async"
        fetchPriority={priority ? "high" : "auto"}
        draggable={false}
        style={position ? { objectPosition: position } : undefined}
        onLoad={() => {
          resolved.set(name, file);
          if (import.meta.env.DEV && index > 0) {
            console.info(`[Img] "${name}" loaded via fallback file name "${file}"`);
          }
          setLoaded(true);
        }}
        onError={() => {
          if (index + 1 < candidates.length) {
            setIndex(index + 1);
          } else {
            failed.add(name);
            setBroken(true);
          }
        }}
      />
    </div>
  );
}
