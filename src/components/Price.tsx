/** Sets the figure large and the unit small; the string is rendered exactly as given. */
export default function Price({ value, className = "" }: { value: string; className?: string }) {
  const m = value.match(/^([\d.]+)(.*)$/);
  return (
    <p className={`price ${className}`}>
      {m ? (
        <>
          <span className="price__num">{m[1]}</span>
          <span className="price__unit">{m[2]}</span>
        </>
      ) : (
        value
      )}
    </p>
  );
}
