import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
  className?: string;
  /** Mat colour behind the picture. */
  mat?: "paper" | "paper-2" | "indigo" | "vermilion" | "none";
};

/** A gallery mat: tinted passe-partout, a gold hairline and four corner brackets. */
export default function GoldFrame({ children, className = "", mat = "paper-2" }: Props) {
  return (
    <div className={`frame frame--${mat} ${className}`} data-cursor="media">
      <div className="frame__inner">{children}</div>
      <span className="frame__corner frame__corner--tl" aria-hidden="true" />
      <span className="frame__corner frame__corner--tr" aria-hidden="true" />
      <span className="frame__corner frame__corner--bl" aria-hidden="true" />
      <span className="frame__corner frame__corner--br" aria-hidden="true" />
    </div>
  );
}
