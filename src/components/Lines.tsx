import { splitHeadline } from "../lib/reveal";

/** Renders a headline as masked lines; the last line is set in italic as the emphasis. Text content is unchanged. */
export default function Lines({ text, emphasis = true }: { text: string; emphasis?: boolean }) {
  const lines = splitHeadline(text);
  return (
    <>
      {lines.map((line, i) => {
        const em = emphasis && i === lines.length - 1 && lines.length > 1;
        return (
          <span className="line" key={line}>
            <span className={`line__inner ${em ? "line__inner--em" : ""}`}>{line}</span>
            {i < lines.length - 1 ? " " : null}
          </span>
        );
      })}
    </>
  );
}
