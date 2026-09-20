import React from "react";

/* C source, shown in increments.

   The source document printed its sample programs whole: the shortest was
   twenty lines and the longest thirty-two. On the phone most of this cohort
   reads on, a thirty-two line block is four screens of scrolling with no
   landmark in it, and the student's rational response is to copy the whole
   thing into the editor unread and run it. That is the behaviour the old
   handout actually taught.

   So a block here is at most a handful of lines and arrives with the reason it
   exists. `lines` is an array of strings, one per line, and a line may be
   marked as the one the step is about by listing its index in `focus` — the
   rest stay legible but recede, which is the same trick the step frame uses to
   keep the instruction larger than the prose.

   There is no syntax colouring. Colour here would be decoration competing for
   attention with `focus`, which carries meaning, and the palette has no
   accessible eight-colour token set to spend on it. */

export function CodeBlock({ file, lines, focus = [], from = 1, caption }) {
  const marked = new Set(focus);
  const text = lines.join("\n");

  return (
    <figure className="fio-code">
      {file && (
        <figcaption className="fio-code-head">
          <span className="fio-code-name">{file}</span>
          <CopyButton text={text} label={`Copy the code from ${file}`} />
        </figcaption>
      )}
      {/* Focusable because it scrolls: the longest line in these programs is
          wider than a phone, and a scroller no element can focus leaves a
          keyboard user unable to reach the right-hand half of the code. */}
      <div className="fio-code-scroll" tabIndex={0} role="region"
        aria-label={file ? `Source of ${file}, scrollable` : "Source code, scrollable"}>
        <pre className="fio-code-pre"><code>
          {lines.map((line, i) => (
            <span key={i} className={`fio-code-line${marked.has(i) ? " is-focus" : ""}`}>
              <span className="fio-code-num" aria-hidden="true">{from + i}</span>
              <span className="fio-code-text">{line === "" ? " " : line}</span>
            </span>
          ))}
        </code></pre>
      </div>
      {caption && <p className="fio-code-caption">{caption}</p>}
    </figure>
  );
}

/* Expected output, styled as a terminal rather than as source, because the
   whole point of showing it is that the reader compares it against their own
   terminal. Making the two look alike is the comparison aid. */
export function Terminal({ children, label = "What you should see" }) {
  return (
    <figure className="fio-term">
      <figcaption className="fio-term-head">{label}</figcaption>
      <div className="fio-code-scroll" tabIndex={0} role="region"
        aria-label={`${label}, scrollable`}>
        <pre className="fio-term-pre"><code>{children}</code></pre>
      </div>
    </figure>
  );
}

/* Copying is offered because the alternative is retyping from a phone, which
   produces typos that look like File I/O bugs and cost an evening. It degrades
   to nothing useful being lost if the clipboard API is unavailable. */
function CopyButton({ text, label }) {
  const [done, setDone] = React.useState(false);

  React.useEffect(() => {
    if (!done) return;
    const t = setTimeout(() => setDone(false), 2000);
    return () => clearTimeout(t);
  }, [done]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setDone(true);
    } catch {
      /* Clipboard blocked, or no permission. The code is on screen and
         selectable, so there is nothing to recover from and nothing to say. */
    }
  };

  return (
    <button type="button" className="fio-copy" onClick={copy} aria-label={label}>
      <span aria-hidden="true">{done ? "Copied" : "Copy"}</span>
      {/* aria-label names the button, so the visible word never reaches a
          screen reader. This is what announces that the copy happened. */}
      <span className="fio-sr" aria-live="polite">{done ? "Copied to clipboard" : ""}</span>
    </button>
  );
}
