import React from "react";
import { useScrub, ScrubBar, Explorable } from "./Scrub.jsx";

/* getDelimitedItem, walked one character at a time.

   This is the hardest function in the handout, and it used to be explained by
   six code blocks and four hundred and fifty words of prose. Prose is the
   wrong instrument for it. The function is a loop over invisible state: a
   stream position that moves on its own, a buffer that fills one byte at a
   time, a counter, and a four-way test that decides whether the loop goes
   round again. A reader can follow every sentence about that and still not be
   able to say why the comma is not in the string that comes out.

   So the figure shows the state instead of describing it. Everything moves
   together on one timeline: the cursor on the input line, the characters
   arriving in `out`, `n` and `c` as the variables they actually are, and which
   of the four loop conditions holds right now. The payoff is one frame long
   and it is the reason the figure exists — the reader watches "Toyota"
   assemble letter by letter and then watches the comma get read and NOT
   stored. That single frame replaces a paragraph.

   The timeline runs across four calls rather than one, because one call in
   isolation looks arbitrary. Four calls on one line show the thing main()
   actually relies on: the stream position survives between calls, so the
   second call starts exactly where the first one stopped. A fifth, two-frame
   call is included at the end because the end-of-file condition is one of the
   four the loop tests and it cannot otherwise be reached — that call is the
   -1 that stops main's while loop. */

/* The frames are computed, not authored. Thirty-eight hand-written frames
   would be thirty-eight chances to mistype a buffer, and the reader would have
   no way to tell a typo from the real behavior of C. `buildParseFrames` is
   instead a line-by-line mirror of the C loop in 08-csv.c: fgetc before the
   test, the \r dropped, characters stored only while n < size - 1, the
   delimiter consumed but never stored, the terminator written after the loop,
   and -1 returned when the very first fgetc already sees EOF. It is a pure
   function of its arguments and is exported so it can be checked against the
   compiled program's output. */
export function buildParseFrames(line, size = 40) {
  /* A line read from a CSV file always ends with a newline, and the newline is
     one of the four conditions the loop tests. Appending it when the caller
     omitted it keeps the figure honest about how the last field on a line
     actually ends. */
  const text = typeof line === "string" ? line : "";
  const source = text.endsWith("\n") ? text : `${text}\n`;

  const frames = [];
  const done = [];
  let i = 0;
  let call = 0;

  /* The stream, reduced to its one relevant behavior: it hands back the next
     character and moves forward, and once it is empty it hands back EOF
     forever. `null` stands for EOF because it is the one value a character
     from the string can never be. */
  const fgetc = () => (i < source.length ? source[i++] : null);

  const push = (frame) => frames.push({ ...frame, call, fields: done.slice() });

  /* The guard is not a simulation limit, it is a defense against a caller
     passing something for which the loop below would never terminate. */
  while (call < 64) {
    call += 1;

    /* The call has begun but nothing has been read. Showing this state is what
       makes it visible that n and out start empty on every call while the
       stream position does not. */
    push({ phase: "start", pos: i, c: null, n: 0, out: "", test: null });

    let c = fgetc();

    if (c === null) {
      push({
        phase: "eof", pos: i, c: "EOF", n: 0, out: "",
        test: "eof", terminated: true, ret: -1
      });
      break;
    }

    let n = 0;
    let out = "";

    while (c !== null && c !== "," && c !== "\n") {
      if (c === "\r") {
        push({ phase: "skip", pos: i, c, n, out, test: "reading", readAt: i - 1 });
      } else if (n < size - 1) {
        out += c;
        n += 1;
        push({ phase: "store", pos: i, c, n, out, test: "reading", readAt: i - 1 });
      } else {
        push({ phase: "full", pos: i, c, n, out, test: "reading", readAt: i - 1 });
      }
      c = fgetc();
    }

    const stop = c === null ? "eof" : c === "," ? "comma" : "newline";
    const shown = c === null ? "EOF" : c;

    /* The delimiter has been read and the loop has stopped. out is unchanged.
       This is the frame the whole figure is built around. */
    push({
      phase: "delim", pos: i, c: shown, n, out,
      test: stop, readAt: c === null ? undefined : i - 1
    });

    done.push({ text: out, n });

    /* out[n] = '\0'; return n; — the terminator appears and the finished field
       leaves for the list of completed fields. */
    push({
      phase: "return", pos: i, c: shown, n, out,
      test: stop, terminated: true, ret: n, justCompleted: true
    });
  }

  return frames;
}

const DEFAULT_LINE = "Toyota,Corolla,1995,TVX-111";

/* main() declares four buffers and fills them in this order, so naming the
   destination of each call ties the figure back to the program the reader has
   in front of them instead of leaving it an abstract exercise. */
const TARGETS = ["make", "model", "year", "plate"];

/* The four tests in `while (c != EOF && c != ',' && c != '\n')`, named in
   words. The loop is the whole function; a reader who can say which of these
   four is true at a given moment can predict everything else on screen. */
const CONDITIONS = [
  {
    key: "reading",
    code: "c is an ordinary character",
    label: "Still reading",
    note: "out[n] = c, then n = n + 1. Go round again."
  },
  {
    key: "comma",
    code: "c == ','",
    label: "Hit a comma",
    note: "The field ends. The comma is consumed but never stored."
  },
  {
    key: "newline",
    code: "c == '\\n'",
    label: "Hit the newline",
    note: "Last field on the line. The newline is consumed but never stored."
  },
  {
    key: "eof",
    code: "c == EOF",
    label: "End of file",
    note: "Nothing was left to read at all. Returns -1, not 0."
  }
];

/* Control characters and the space have no glyph of their own, and drawn as
   themselves they look like the absence of a character rather than like a
   character the loop is about to test. Each gets a visible stand-in. */
function glyph(ch) {
  if (ch === "\n") return "¶";
  if (ch === "\r") return "␍";
  if (ch === " ") return "␣";
  return ch;
}

function charName(ch) {
  if (ch === "\n") return "a newline";
  if (ch === "\r") return "a carriage return";
  if (ch === " ") return "a space";
  if (ch === ",") return "a comma";
  if (ch === "EOF") return "EOF";
  return `'${ch}'`;
}

export function ParseWalker({ line = DEFAULT_LINE, caption }) {
  /* A handout that passes the wrong shape should still render the figure it
     was reaching for rather than take the page down with it. */
  const input = typeof line === "string" && line.length > 0 ? line : DEFAULT_LINE;

  const frames = React.useMemo(() => buildParseFrames(input), [input]);
  const scrub = useScrub(frames.length);

  const index = Math.min(scrub.index, frames.length - 1);
  const frame = frames[index] || {};

  /* The same source string the builder walked, reconstructed the same way, so
     the cursor positions the frames carry index into exactly this string. */
  const source = input.endsWith("\n") ? input : `${input}\n`;

  const calls = frames.length ? frames[frames.length - 1].call : 0;
  const target = TARGETS[(frame.call - 1) % TARGETS.length];

  /* The buffer is 40 characters wide in C, and drawing forty cells would make
     every one of them too small to read on a phone while teaching nothing: the
     cells past the longest field are never touched. Enough slots are drawn to
     hold the longest field plus its terminator. */
  const widest = frames.reduce((w, f) => Math.max(w, f.out ? f.out.length : 0), 0);
  const slots = Math.max(8, widest + 1);

  const fields = frame.fields || [];

  const phraseFor = () => {
    switch (frame.phase) {
      case "start":
        return `The call begins: n is 0 and ${target} is empty. Nothing has been read yet.`;
      case "store":
        return `Read ${charName(frame.c)}. It is not a delimiter, so it is stored: ${target}[${frame.n - 1}] = ${charName(frame.c)} and n becomes ${frame.n}.`;
      case "skip":
        return "Read a carriage return. It is dropped, so n does not change.";
      case "full":
        return `Read ${charName(frame.c)}, but the buffer is full, so it is read past and not stored. n stays ${frame.n}.`;
      case "delim":
        if (frame.test === "comma") {
          return `Read a comma. The loop stops. The comma is consumed but is not stored, so ${target} still holds "${frame.out}" and n is still ${frame.n}.`;
        }
        if (frame.test === "newline") {
          return `Read the newline that ends the line. The loop stops. The newline is consumed but is not stored, so ${target} still holds "${frame.out}" and n is still ${frame.n}.`;
        }
        return `The file ran out mid-field. The loop stops with ${target} holding "${frame.out}".`;
      case "return":
        return `out[${frame.n}] is set to the null terminator, so ${target} is now the string "${frame.out}", and the function returns ${frame.ret}.`;
      case "eof":
        return "The very first fgetc returned EOF, so there was nothing left at all. The function returns -1, and that -1 is what stops the loop in main.";
      default:
        return "";
    }
  };

  const status =
    `Call ${frame.call} of ${calls}, filling ${target}. ` +
    `Stream position ${frame.pos} of ${source.length}. ` +
    phraseFor() +
    (fields.length
      ? ` Completed so far: ${fields.map((f, k) => `${TARGETS[k % TARGETS.length]} = "${f.text}" with n = ${f.n}`).join("; ")}.`
      : " No field is complete yet.");

  return (
    <Explorable
      title="getDelimitedItem, one character at a time"
      notice="Watch the comma: it is read, the loop stops, and it never enters the buffer."
      caption={
        caption
        || "One line of cars.csv, read by four calls to getDelimitedItem. The stream position survives between calls, which is why each call picks up exactly where the last one stopped. The fifth call finds nothing left and returns -1, which is what ends the loop in main."
      }
      status={status}
    >
      {/* The drawing repeats, cell by cell, what the status sentence already
          says in full. Announced as well it would be read out letter by
          letter, so it is hidden from assistive technology entirely. */}
      <div className="pw" aria-hidden="true">
        <div className="pw-call">
          <span className="pw-call-n">Call {frame.call} of {calls}</span>
          <code className="pw-call-src">
            n = getDelimitedItem(fp, {target}, 40);
          </code>
        </div>

        {/* 1. The input line, with the cursor on the character fgetc is about
               to return. Commas and the newline are drawn differently from
               ordinary characters because they are what the loop tests for. */}
        <section className="pw-panel">
          <h4 className="pw-label">
            The line in the file
            <span className="pw-meta">position {frame.pos} of {source.length}</span>
          </h4>

          {/* The scroller is deliberately not focusable. Everywhere else on
              the site a horizontal scroller takes a tabIndex so a keyboard can
              reach its far end, but this one lives inside an aria-hidden
              subtree, and a focusable element inside an aria-hidden subtree is
              a control that focus can land on and assistive technology cannot
              describe. The sentence in the transport carries the whole line
              instead. */}
          <div className="pw-scroll ex-scroll">
            <div className="pw-row">
              {source.split("").map((ch, k) => {
                const delim = ch === "," || ch === "\n";
                const cls = [
                  "pw-cell",
                  delim ? "pw-cell-delim" : "",
                  k < frame.pos ? "is-past" : "",
                  k === frame.pos ? "is-cursor" : "",
                  k === frame.readAt ? "is-read" : ""
                ].filter(Boolean).join(" ");
                return (
                  <span key={k} className={cls}>
                    <span className="pw-glyph">{glyph(ch)}</span>
                    <span className="pw-idx">{k}</span>
                  </span>
                );
              })}

              {/* There is no byte here. The cell exists so the cursor has
                  somewhere to stand once the file is exhausted, which is the
                  state the fifth call is entirely about. */}
              <span
                className={`pw-cell pw-cell-eof${frame.pos >= source.length ? " is-cursor" : ""}`}
              >
                <span className="pw-glyph">EOF</span>
                <span className="pw-idx">{source.length}</span>
              </span>
            </div>
          </div>
        </section>

        {/* 3. The two variables, shown as the variables they are. */}
        <div className="pw-vars">
          <span className="pw-var">
            <span className="pw-var-name">c</span>
            <span className={`pw-var-value${frame.c === null ? " is-empty" : ""}`}>
              {frame.c === null ? "not read yet" : glyph(frame.c)}
            </span>
          </span>
          <span className="pw-var">
            <span className="pw-var-name">n</span>
            <span className="pw-var-value">{frame.n}</span>
          </span>
          {typeof frame.ret === "number" && (
            <span className="pw-var pw-var-ret">
              <span className="pw-var-name">returns</span>
              <span className="pw-var-value">{frame.ret}</span>
            </span>
          )}
        </div>

        {/* 2. The buffer filling up, and the terminator arriving at the end. */}
        <section className="pw-panel">
          <h4 className="pw-label">
            char {target}[40]
            <span className="pw-meta">{frame.n} stored</span>
          </h4>

          <div className="pw-scroll ex-scroll">
            <div className="pw-row">
              {Array.from({ length: slots }, (_, k) => {
                const filled = k < frame.n;
                const isNul = frame.terminated && k === frame.n;
                const fresh = frame.phase === "store" && k === frame.n - 1;
                const cls = [
                  "pw-slot",
                  filled ? "is-filled" : "",
                  isNul ? "is-nul" : "",
                  fresh ? "is-fresh" : ""
                ].filter(Boolean).join(" ");
                return (
                  <span key={k} className={cls}>
                    <span className="pw-glyph">
                      {filled ? glyph(frame.out[k]) : isNul ? "\\0" : ""}
                    </span>
                    <span className="pw-idx">{k}</span>
                  </span>
                );
              })}
            </div>
          </div>

          <p className="pw-note">{phraseFor()}</p>
        </section>

        {/* 4. Which of the four conditions the loop is in, named in words. */}
        <section className="pw-panel">
          <h4 className="pw-label">while (c != EOF &amp;&amp; c != ',' &amp;&amp; c != '\n')</h4>
          <ul className="pw-conds">
            {CONDITIONS.map((cond) => {
              const on = frame.test === cond.key;
              return (
                <li key={cond.key} className={`pw-cond${on ? " is-on" : ""}`}>
                  {/* The marker is a word as well as a color, because a reader
                      who cannot tell the two tints apart still has to be able
                      to say which condition holds. */}
                  <span className="pw-cond-flag">{on ? "NOW" : ""}</span>
                  <span className="pw-cond-text">
                    <code className="pw-cond-code">{cond.code}</code>
                    <strong className="pw-cond-label">{cond.label}</strong>
                    <span className="pw-cond-note">{cond.note}</span>
                  </span>
                </li>
              );
            })}
          </ul>
        </section>

        {/* The point of the whole timeline: four fields coming out of one line
            of text, accumulating as the reader scrubs. */}
        <section className="pw-panel">
          <h4 className="pw-label">
            Completed fields
            <span className="pw-meta">{fields.length} of {TARGETS.length}</span>
          </h4>

          {fields.length === 0 ? (
            <p className="pw-note">Nothing has come out of the line yet.</p>
          ) : (
            <ul className="pw-fields">
              {fields.map((f, k) => (
                <li
                  key={k}
                  className={`pw-field${frame.justCompleted && k === fields.length - 1 ? " is-new" : ""}`}
                >
                  <span className="pw-field-name">{TARGETS[k % TARGETS.length]}</span>
                  <code className="pw-field-value">"{f.text}"</code>
                  <span className="pw-field-n">n = {f.n}</span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      <ScrubBar
        scrub={scrub}
        label="getDelimitedItem reading one line"
        status={status}
        unit="step"
      />
    </Explorable>
  );
}

export default ParseWalker;
