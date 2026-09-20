import React from "react";
import { useScrub, ScrubBar, Explorable } from "./explorable/Scrub.jsx";

/* The oldest interactive figure in the File I/O handout, rebuilt on the shared
   transport.

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
   the reader move through the calls.

   It used to carry its own Previous, Next and Reset buttons and its own
   arrow-key handler. Three more explorables now sit in the same handout on one
   shared transport with a real timeline and a play control, and a reader
   should only have to learn one instrument. The bespoke controls are gone;
   ScrubBar's range input supplies stepping, arrow keys, Home, End and the
   platform focus ring, all of which the hand-rolled version only approximated.

   The component knows no C. It renders authored frames, each verified against
   a real compiler by whoever wrote the handout, and it never computes a stream
   position of its own. Simulating fgets here would put a second, unverified
   implementation of C's semantics in front of students, and when the two
   disagreed the one on screen would be the one they believed.

   Interpolation is the one thing that moves, and it is presentation only. The
   caret slides BETWEEN two authored positions while the transport is between
   two frames; every number on screen, every position it comes to rest on, and
   everything announced comes from the authored data unchanged. Inventing a
   position would be a simulation. Drawing the trip between two of them is not. */

/* The newline is drawn as a pilcrow because the entire lesson of stage 4 is
   that it is a byte like any other: it occupies a position, fgets keeps it,
   and the stream position lands on it. Rendered as nothing but a line break
   it would look like the absence of a byte, which is the misconception the
   figure exists to correct. */
const NEWLINE_MARK = "¶";

export function FileMachine({ file, trace, caption, title }) {
  const frames = Array.isArray(trace) ? trace : [];
  const content = (file && typeof file.content === "string") ? file.content : "";
  const name = (file && file.name) || "the file";

  const scrub = useScrub(frames.length);

  /* A new trace is a different figure, and keeping the old position would open
     it part-way through, which reads as a rendering fault rather than as a
     position the reader chose. useScrub already resets when the number of
     frames changes; this covers the case it cannot see, two different traces
     of the same length swapped at one call site.

     The reset is keyed on what the props say rather than on their identity. A
     handout that writes its props inline in JSX hands over a fresh object on
     every render, and an identity-keyed effect would then reset to the first
     call immediately after every step — the component would look broken for a
     reason nothing on the page would explain. */
  /* The separators are written as escapes rather than as literal control
     bytes. Typed literally they make git classify this source file as
     binary, so it can never be diffed or reviewed; the runtime value is
     identical either way. */
  const signature = `${name}\u0000${content.length}\u0000${frames.map((f) => f && f.call).join("\u0001")}`;

  /* Held in a ref because `reset` is a fresh closure on every render, and
     depending on it directly would rewind the figure under the reader's hand
     once a frame. */
  const resetRef = React.useRef(scrub.reset);
  resetRef.current = scrub.reset;
  React.useEffect(() => { resetRef.current(); }, [signature]);

  if (frames.length === 0) return null;

  const index = Math.min(scrub.index, frames.length - 1);
  const frame = frames[index] || {};

  /* A write trace is a property of the whole trace, not of one frame: the
     final fclose frame carries `closed` but no longer carries a buffer, and it
     still has to be drawn with the write legend rather than the read one. */
  const isWrite = frames.some((f) => typeof f.buffered === "string");

  /* Clamping is a defence against a typo in the authored data, not a
     simulation. A position past the last byte can only mean end of file, so it
     is reported as such rather than silently drawn at the end as if the stream
     were still readable. */
  const posOf = (n) => {
    const f = frames[Math.max(0, Math.min(n, frames.length - 1))] || {};
    const authored = Number.isFinite(f.pos) ? f.pos : 0;
    return Math.max(0, Math.min(authored, content.length));
  };

  const authoredPos = Number.isFinite(frame.pos) ? frame.pos : 0;
  const pos = posOf(index);
  const atEof = Boolean(frame.eof) || authoredPos > content.length;
  const closed = Boolean(frame.closed);

  /* The continuous position. `scrub.pos` runs 0..last across FRAMES; the two
     authored byte positions it currently lies between are interpolated into a
     byte position that may be fractional. At every integer frame this is
     exactly the authored number, so the figure still comes to rest only on
     positions a compiler produced. */
  const lower = Math.floor(scrub.pos);
  const upper = Math.min(frames.length - 1, lower + 1);
  const t = scrub.pos - lower;
  const fluidPos = posOf(lower) + (posOf(upper) - posOf(lower)) * t;

  /* In a write trace the file does not yet hold the bytes the trace will
     eventually produce, so only the bytes issued up to the write position are
     drawn. In a read trace the whole file is there from the start and the
     position only says how much of it has been consumed.

     Both follow the continuous value, so the shading and the caret can never
     disagree about where the program has got to. A byte counts as issued, or
     as consumed, once the caret has passed it completely — which at an integer
     frame is the same test the figure has always applied. */
  const issued = Math.floor(fluidPos + 1e-9);
  const shown = isWrite ? content.slice(0, issued) : content;
  const consumedTo = isWrite ? 0 : fluidPos;

  /* The caret is drawn in the cell it is standing in, then nudged across that
     cell by the fraction. The grid is monospaced, so one cell is exactly 1ch
     and the nudge lands on the glyph boundary at every whole number. */
  const caretCell = Math.max(0, Math.min(Math.floor(fluidPos + 1e-9), shown.length));
  const caretFrac = Math.max(0, Math.min(1, fluidPos - caretCell));

  /* Announced, and shown under the transport. Every number in it is discrete
     and authored: an assistive technology user is told where the stream is,
     not where an animation happens to be mid-flight. */
  const status =
    `Call ${index + 1} of ${frames.length}. ` +
    (isWrite
      ? `${pos} of ${content.length} bytes issued.`
      : `Stream position ${pos} of ${content.length} bytes.`) +
    (atEof ? " End of file reached." : "") +
    (closed ? " The stream is closed." : "");

  const vars = frame.vars && typeof frame.vars === "object" ? Object.entries(frame.vars) : [];

  const heading = title || (isWrite
    ? `Writing ${name}, one call at a time`
    : `Reading ${name}, one call at a time`);

  const notice = isWrite
    ? "Watch the write position advance while the file stays behind"
    : "Watch the stream position advance";

  return (
    <Explorable title={heading} notice={notice} caption={caption} status={status}>
      {/* `is-live` suppresses the caret's transition while the transport is
          playing. Play already moves the position sixty times a second, and a
          transition on top of that would make the caret trail the position it
          is supposed to be reporting. */}
      <div className={`fm${scrub.playing ? " is-live" : ""}`}>
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
                once as a sentence above it instead, at the authored position
                rather than the interpolated one. */}
            <p className="fm-sr">
              {isWrite
                ? `${name} holds ${pos} bytes so far. The program has issued ${pos} of the ${content.length} bytes it will write. `
                : `${name} holds ${content.length} bytes. The stream position is byte ${pos}. ` +
                  (pos === 0 ? "No bytes have been read yet. " : `Bytes 0 to ${pos - 1} have been read. `)}
              {`The contents, with a slash written for each newline: ${(isWrite ? content.slice(0, pos) : content).replace(/\n/g, " / ") || "(nothing yet)"}`}
            </p>

            <div className="fm-bytes-scroll ex-scroll" tabIndex={0} role="region"
              aria-label={`${name}, byte by byte`}>
              <div className="fm-bytes" aria-hidden="true">
                <FileBytes
                  text={shown}
                  caretCell={caretCell}
                  caretFrac={caretFrac}
                  consumedTo={consumedTo}
                  showCaret={!closed}
                />
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
                : "Tinted, underlined bytes have been consumed. The bar marks the stream position."}
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
      </div>

      {/* The transport's label is spoken inside sentences ScrubBar builds —
          "Move through the calls on test.txt", "the calls on test.txt: call 3
          of 6" — so it is phrased as a noun phrase rather than reusing the
          heading, which would read as a title dropped mid-sentence. */}
      <ScrubBar scrub={scrub} label={`the calls on ${name}`} status={status} unit="call" />
    </Explorable>
  );
}

/* One span per byte, grouped into lines, with the byte offset of each line in
   a gutter. The gutter is what lets a reader turn the number in the variables
   panel back into a place in the file; without it "position 12" is a fact with
   nowhere to land. */
function FileBytes({ text, caretCell, caretFrac, consumedTo, showCaret }) {
  const lines = [];
  let line = [];
  let lineStart = 0;

  const push = () => {
    lines.push({ start: lineStart, nodes: line });
    line = [];
  };

  for (let k = 0; k < text.length; k++) {
    if (showCaret && k === caretCell) line.push(<Caret key="caret" frac={caretFrac} />);
    /* A byte is consumed once the position has passed it completely. At an
       integer frame this is the authored rule exactly; between frames it is
       what makes the tint travel with the caret instead of jumping a whole
       line ahead of it. */
    const consumed = k + 1 <= consumedTo + 1e-9;
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
  if (showCaret && caretCell >= text.length) line.push(<Caret key="caret" frac={caretFrac} />);
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

/* The caret carries the only motion in the figure. It keeps one identity for
   the life of the trace — it is deliberately NOT keyed on the position — so
   that moving the transport slides it rather than destroying it and building a
   new one somewhere else. A caret that blinks out and reappears asks the
   reader to find it again; a caret that travels shows them the thing the
   figure exists to teach, which is that the position moves.

   The fraction is a custom property rather than a computed pixel offset: the
   grid is monospaced, so one byte is exactly 1ch, and letting CSS do the
   multiplication keeps the caret aligned at any font size the page is set to.

   It is never animated from zero opacity or zero scale. An animation that
   starts at nothing can rest at nothing if a frame callback never arrives, and
   a caret that is never drawn is worse than one that never moved, because the
   reader would then be hunting for a stream position that is not on screen at
   all. */
function Caret({ frac }) {
  return <span className="fm-caret" style={{ "--fm-frac": frac.toFixed(4) }} />;
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
