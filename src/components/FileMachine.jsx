import React from "react";

/* The one interactive figure in the File I/O handout.

   Everything the handout has taught so far could be taught in prose, because
   everything so far was visible in the source. File I/O is the first topic
   where the program's behaviour turns on state the student cannot see: the
   stream position that advances on its own after every read, the write buffer
   that holds output in memory until fclose, and the EOF condition that is not
   a character in the file at all. A reader who cannot see those three things
   reads fgets twice and cannot say why the second call returned a different
   line.

   Prose cannot teach invisible state, and a static screenshot only shows one
   instant of it. So this component draws the state after each call and lets
   the reader walk the calls one at a time. That is the whole reason this page
   is interactive; nothing else on it needed to be.

   The component knows no C. It renders authored frames, each verified against
   a real compiler by whoever wrote the handout, and it never computes a stream
   position of its own. Simulating fgets here would put a second, unverified
   implementation of C's semantics in front of students, and when the two
   disagreed the one on screen would be the one they believed. */

/* The newline is drawn as a pilcrow because the entire lesson of stage 4 is
   that it is a byte like any other: it occupies a position, fgets keeps it,
   and the stream position lands on it. Rendered as nothing but a line break
   it would look like the absence of a byte, which is the misconception the
   figure exists to correct. */
const NEWLINE_MARK = "¶";

export function FileMachine({ file, trace, caption }) {
  const frames = Array.isArray(trace) ? trace : [];
  const content = (file && typeof file.content === "string") ? file.content : "";
  const name = (file && file.name) || "the file";

  /* A new trace is a different figure, and keeping the old index would open it
     part-way through, which reads as a rendering fault rather than as a
     position the reader chose.

     The reset is keyed on what the props say rather than on their identity. A
     handout that writes its props inline in JSX hands over a fresh object on
     every render, and an identity-keyed effect would then reset to the first
     call immediately after every press of Next — the component would look
     broken for a reason nothing on the page would explain. */
  /* The separators are written as escapes rather than as literal control
     bytes. Typed literally they make git classify this source file as
     binary, so it can never be diffed or reviewed; the runtime value is
     identical either way. */
  const signature = `${name}\u0000${content.length}\u0000${frames.map((f) => f && f.call).join("\u0001")}`;

  const [current, setCurrent] = React.useState(0);
  React.useEffect(() => { setCurrent(0); }, [signature]);

  if (frames.length === 0) return null;

  const lastIndex = frames.length - 1;
  const index = Math.min(current, lastIndex);
  const frame = frames[index] || {};

  /* A write trace is a property of the whole trace, not of one frame: the
     final fclose frame carries `closed` but no longer carries a buffer, and it
     still has to be drawn with the write legend rather than the read one. */
  const isWrite = frames.some((f) => typeof f.buffered === "string");

  const authoredPos = Number.isFinite(frame.pos) ? frame.pos : 0;
  const pos = Math.max(0, Math.min(authoredPos, content.length));
  /* Clamping is a defence against a typo in the authored data, not a
     simulation. A position past the last byte can only mean end of file, so it
     is reported as such rather than silently drawn at the end as if the stream
     were still readable. */
  const atEof = Boolean(frame.eof) || authoredPos > content.length;
  const closed = Boolean(frame.closed);

  /* In a write trace the file does not yet hold the bytes the trace will
     eventually produce, so only the bytes issued up to the write position are
     drawn. In a read trace the whole file is there from the start and the
     position only says how much of it has been consumed. */
  const shown = isWrite ? content.slice(0, pos) : content;
  const consumedTo = isWrite ? 0 : pos;

  const goto = (n) => setCurrent(Math.max(0, Math.min(n, lastIndex)));

  const onKeyDown = (e) => {
    /* The byte grid is itself focusable and scrolls horizontally, so once
       focus is inside it the arrows belong to the scroller. Stealing them
       there would leave a keyboard user unable to read the right-hand end of
       a long line, which is the whole reason it scrolls. */
    if (e.target.closest && e.target.closest(".fm-bytes-scroll")) return;
    if (e.key === "ArrowRight") { e.preventDefault(); goto(index + 1); }
    else if (e.key === "ArrowLeft") { e.preventDefault(); goto(index - 1); }
  };

  const status =
    `Call ${index + 1} of ${frames.length}. ` +
    (isWrite
      ? `${shown.length} of ${content.length} bytes issued.`
      : `Stream position ${pos} of ${content.length} bytes.`) +
    (atEof ? " End of file reached." : "") +
    (closed ? " The stream is closed." : "");

  const vars = frame.vars && typeof frame.vars === "object" ? Object.entries(frame.vars) : [];

  return (
    <figure
      className="fm"
      tabIndex={0}
      onKeyDown={onKeyDown}
      aria-label={`Stepping through ${frames.length} C calls on ${name}, one call at a time. Use the left and right arrow keys to move between calls.`}
    >
      <div className="fm-grid">
        <div className="fm-region fm-calls">
          <div className="fm-region-label">The calls</div>
          <ol className="fm-call-list">
            {frames.map((f, n) => (
              <li
                key={n}
                className={`fm-call${n === index ? " is-here" : ""}${n < index ? " is-past" : ""}`}
                aria-current={n === index ? "step" : undefined}
              >
                <span className="fm-call-n" aria-hidden="true">{n + 1}</span>
                <code className="fm-call-src">{f.call}</code>
              </li>
            ))}
          </ol>
        </div>

        {/* The controls sit under the call list rather than under the whole
            figure. On a phone the file region is the tallest of the three and
            scrolls inside itself, so controls placed after it would be off
            screen at the moment the reader wants them. */}
        <div className="fm-controls" role="group" aria-label="Move between calls">
          <button type="button" className="fm-btn" onClick={() => goto(index - 1)} disabled={index === 0}>
            Previous
          </button>
          <button
            type="button"
            className="fm-btn is-primary"
            onClick={() => goto(index + 1)}
            disabled={index === lastIndex}
          >
            Next
          </button>
          <button type="button" className="fm-btn is-quiet" onClick={() => goto(0)} disabled={index === 0}>
            Reset
          </button>
          <span className="fm-count">Call {index + 1} of {frames.length}</span>
          <p className="fm-hint">
            Arrow keys move between calls while this figure has focus. Nothing moves on its own.
          </p>
        </div>

        <div className="fm-region fm-file">
          <div className="fm-region-label">
            {isWrite ? `${name} — bytes issued` : name}
            <span className="fm-region-meta">
              {isWrite ? `${shown.length} of ${content.length} bytes` : `${content.length} bytes`}
              {closed ? " · closed" : ""}
            </span>
          </div>

          {/* The glyph grid is one element per byte, which a screen reader
              would announce letter by letter. The same information is given
              once as a sentence above it instead. */}
          <p className="fm-sr">
            {isWrite
              ? `${name} holds ${shown.length} bytes so far. The program has issued ${shown.length} of the ${content.length} bytes it will write. `
              : `${name} holds ${content.length} bytes. The stream position is byte ${pos}. ` +
                (pos === 0 ? "No bytes have been read yet. " : `Bytes 0 to ${pos - 1} have been read. `)}
            {`The contents, with a slash written for each newline: ${(isWrite ? shown : content).replace(/\n/g, " / ") || "(nothing yet)"}`}
          </p>

          <div className="fm-bytes-scroll" tabIndex={0} role="region"
            aria-label={`${name}, byte by byte`}>
            <div className="fm-bytes" aria-hidden="true">
              <FileBytes text={shown} pos={pos} consumedTo={consumedTo} showCaret={!closed} />
            </div>
          </div>

          {isWrite && (
            <div className="fm-buffer">
              <span className="fm-buffer-label">Write buffer</span>
              <code className="fm-buffer-value">
                {frame.buffered ? frame.buffered : "empty"}
              </code>
              <p className="fm-buffer-note">
                {frame.buffered
                  ? "These bytes are in memory. They are not in the file on disk yet."
                  : closed
                    ? "fclose emptied the buffer. The file on disk is now complete."
                    : "Nothing is waiting to be written."}
              </p>
            </div>
          )}

          <p className="fm-legend">
            {isWrite
              ? "The bar marks the write position."
              : "Tinted bytes have been consumed. The bar marks the stream position."}
            {" "}The <span className="fm-nl-sample">{NEWLINE_MARK}</span> mark is one newline byte.
          </p>
        </div>

        <div className="fm-region fm-vars">
          <div className="fm-region-label">After this call</div>
          {vars.length > 0 && (
            <dl className="fm-varlist">
              {vars.map(([key, value]) => (
                <React.Fragment key={key}>
                  <dt><code>{key}</code></dt>
                  <dd><code>{String(value)}</code></dd>
                </React.Fragment>
              ))}
            </dl>
          )}

          <dl className="fm-statelist">
            <dt>Stream position</dt>
            <dd>{`byte ${pos} of ${content.length}`}</dd>
            <dt>End of file</dt>
            <dd className={atEof ? "is-flagged" : undefined}>
              {atEof ? "reached" : "not reached"}
            </dd>
            <dt>Stream</dt>
            <dd>{closed ? "closed" : "open"}</dd>
          </dl>
        </div>
      </div>

      {frame.note && <p className="fm-note">{frame.note}</p>}

      <p className="fm-status" aria-live="polite">{status}</p>

      {caption && <figcaption className="fm-caption">{caption}</figcaption>}
    </figure>
  );
}

/* One span per byte, grouped into lines, with the byte offset of each line in
   a gutter. The gutter is what lets a reader turn the number in the variables
   panel back into a place in the file; without it "position 12" is a fact with
   nowhere to land. */
function FileBytes({ text, pos, consumedTo, showCaret }) {
  const lines = [];
  let line = [];
  let lineStart = 0;

  const push = () => {
    lines.push({ start: lineStart, nodes: line });
    line = [];
  };

  for (let k = 0; k < text.length; k++) {
    if (showCaret && k === pos) line.push(<Caret key={"caret-" + pos} />);
    const consumed = k < consumedTo;
    const ch = text[k];
    if (ch === "\n") {
      line.push(
        <span key={k} className={`fm-b fm-b-nl${consumed ? " is-consumed" : ""}`}>{NEWLINE_MARK}</span>
      );
      push();
      lineStart = k + 1;
    } else {
      line.push(<span key={k} className={`fm-b${consumed ? " is-consumed" : ""}`}>{ch}</span>);
    }
  }
  if (showCaret && pos >= text.length) line.push(<Caret key={"caret-" + pos} />);
  push();

  return (
    <>
      {lines.map((l, n) => (
        <div className="fm-line" key={n}>
          <span className="fm-gutter">{l.start}</span>
          <span className="fm-line-bytes">{l.nodes}</span>
        </div>
      ))}
    </>
  );
}

/* Callers key this element on the stream position, so moving the position
   remounts it and replays the short entrance. That entrance is the only motion
   in the figure.

   It scales rather than fades, on the same reasoning the stage-done panel in
   site.css records: an animation that starts at zero opacity can rest at zero
   if a frame callback never arrives, and a caret that is never drawn is worse
   than one that never moved, because the reader would then be hunting for a
   stream position that is not on screen at all. */
function Caret() {
  return <span className="fm-caret" />;
}

/* A sanity check on the authored data, for the handout to call while it is
   being written. It reports rather than throws, and never repairs: a trace
   with a wrong position should be corrected against a compiler, not patched at
   render time into something that merely looks plausible. */
export function assertTrace(file, trace) {
  const env = (typeof import.meta !== "undefined" && import.meta.env) || {};
  if (!env.DEV) return;

  const content = (file && typeof file.content === "string") ? file.content : "";
  const frames = Array.isArray(trace) ? trace : [];
  const label = (file && file.name) || "unnamed file";
  const isWrite = frames.some((f) => typeof f.buffered === "string");

  let previous = -1;
  frames.forEach((f, n) => {
    const where = `${label}, call ${n + 1} (${f && f.call})`;
    if (!Number.isFinite(f && f.pos)) {
      console.warn(`FileMachine: ${where} has no numeric pos.`);
      return;
    }
    if (f.pos < 0) console.warn(`FileMachine: ${where} has a negative pos (${f.pos}).`);
    if (f.pos > content.length) {
      console.warn(
        `FileMachine: ${where} has pos ${f.pos}, past the ${content.length} bytes of content. ` +
        "It will be clamped to the end and shown as end of file."
      );
    }
    /* Only read traces are checked for monotonicity. A write trace may legally
       go backwards, because "w" truncates and rewind or a reopen sends the
       write position back to zero. */
    if (!isWrite && f.pos < previous) {
      console.warn(`FileMachine: ${where} moves the stream position backwards, from ${previous} to ${f.pos}.`);
    }
    previous = f.pos;
  });
}
