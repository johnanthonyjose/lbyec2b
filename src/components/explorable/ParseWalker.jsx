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
   -1 that stops main's while loop.

   The layout is four bands, and the arrangement is the teaching instrument as
   much as the data is. The middle band carries the real source of
   getDelimitedItem on the left with the line that is executing marked, and the
   explanation of exactly that line on the right. A figure that animates beside
   code the reader has to find for themselves leaves them holding two pictures
   and no correspondence between them; marking the executing line is what turns
   the animation into a reading of the C they have to write. The two animated
   bands wrap that pairing — the stream being consumed above it, the buffer and
   the finished fields below it — so the source always sits between its input
   and its output. */

/* The frames are computed, not authored. Ninety hand-written frames would be
   ninety chances to mistype a buffer, and the reader would have no way to tell
   a typo from the real behavior of C. `buildParseFrames` is instead a
   line-by-line mirror of the C loop in 08-csv.c: fgetc before the test, the \r
   dropped, characters stored only while n < size - 1, the delimiter consumed
   but never stored, the terminator written after the loop, and -1 returned
   when the very first fgetc already sees EOF. It is a pure function of its
   arguments and is exported so it can be checked against the compiled
   program's output.

   Every frame now also carries the source lines that are executing on it. The
   builder is the only place that knows the order statements run in, so it is
   the only honest place for that mapping to live: a marked line computed in
   the view would be a second, silent claim about control flow that nothing
   would keep in step with the first. */
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

  /* Which of the four conditions on line 27 holds for a given character. The
     view must never work this out for itself: the same function answering for
     every frame is what stops the named condition and the drawn state from
     ever disagreeing. */
  const condOf = (ch) =>
    ch === null ? "eof" : ch === "," ? "comma" : ch === "\n" ? "newline" : "reading";

  const push = (frame) => frames.push({ ...frame, call, fields: done.slice() });

  /* The guard is not a simulation limit, it is a defense against a caller
     passing something for which the loop below would never terminate. */
  while (call < 64) {
    call += 1;

    /* The call has begun and line 20, the read that happens before the loop,
       is the statement in hand. Showing this state is what makes it visible
       that n and out start empty on every call while the stream position does
       not. */
    push({ phase: "start", lines: [20], pos: i, c: null, n: 0, out: "", test: null });

    let c = fgetc();
    let at = c === null ? undefined : i - 1;

    if (c === null) {
      push({
        phase: "eof", lines: [24], pos: i, c: "EOF", n: 0, out: "",
        test: "eof", terminated: true, ret: -1
      });
      break;
    }

    let n = 0;
    let out = "";

    while (c !== null && c !== "," && c !== "\n") {
      /* Line 27 evaluated and held. This frame exists so that the marked line
         can be truthful: without it the figure would jump from a character
         arriving straight into it being stored, and the test that decided the
         loop should run at all would never be seen executing. */
      push({ phase: "test", lines: [27], pos: i, c, n, out, test: "reading", readAt: at });

      if (c === "\r") {
        push({ phase: "skip", lines: [32], pos: i, c, n, out, test: "reading", readAt: at });
      } else if (n < size - 1) {
        out += c;
        n += 1;
        push({ phase: "store", lines: [38, 39], pos: i, c, n, out, test: "reading", readAt: at });
      } else {
        push({ phase: "full", lines: [37], pos: i, c, n, out, test: "reading", readAt: at });
      }

      c = fgetc();
      at = c === null ? undefined : i - 1;

      /* Line 43, the read at the foot of the loop. It is a frame of its own
         for the same reason as the test above: reading the next character and
         deciding what to do about it are two statements, and a figure that
         merges them hides the one place where the delimiter enters c without
         anything yet having decided that it ends the field. */
      push({
        phase: "read", lines: [43], pos: i, c: c === null ? "EOF" : c, n, out,
        test: condOf(c), readAt: at
      });
    }

    const stop = condOf(c);
    const shown = c === null ? "EOF" : c;

    /* Line 27 again, this time false: the delimiter has been read and the loop
       has stopped. out is unchanged. This is the frame the whole figure is
       built around. */
    push({ phase: "delim", lines: [27], pos: i, c: shown, n, out, test: stop, readAt: at });

    /* out[n] = '\0'; — the terminator appears. The field is deliberately not
       yet in the completed list, because the function has not returned. */
    push({
      phase: "term", lines: [47], pos: i, c: shown, n, out,
      test: stop, terminated: true
    });

    done.push({ text: out, n });

    /* return n; — the finished field leaves for the list of completed fields
       on the same frame the count goes back to main. */
    push({
      phase: "return", lines: [49], pos: i, c: shown, n, out,
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

/* The body of getDelimitedItem as it stands in 08-csv.c, with the real line
   numbers kept. The numbers are the whole point of showing the source here
   rather than a paraphrase of it: the reader has the file open beside the
   handout, and a marked line they can find in their own editor is what ties
   the moving picture to the program. The comment lines are dropped — they are
   already set as prose around this figure, and at 360px every row the snippet
   does not need is a row that pushes the marked line out of sight. */
const CODE = [
  { n: 13, src: "int getDelimitedItem(FILE *fp, char *out, int size) {" },
  { n: 15, src: "    int c;" },
  { n: 16, src: "    int n = 0;" },
  { n: 20, src: "    c = fgetc(fp);" },
  { n: 22, src: "    if (c == EOF) {" },
  { n: 23, src: "        out[0] = '\\0';" },
  { n: 24, src: "        return -1;" },
  { n: 25, src: "    }" },
  { n: 27, src: "    while (c != EOF && c != ',' && c != '\\n') {" },
  { n: 32, src: "        if (c != '\\r') {" },
  { n: 37, src: "            if (n < size - 1) {" },
  { n: 38, src: "                out[n] = (char) c;" },
  { n: 39, src: "                n = n + 1;" },
  { n: 40, src: "            }" },
  { n: 41, src: "        }" },
  { n: 43, src: "        c = fgetc(fp);" },
  { n: 44, src: "    }" },
  { n: 47, src: "    out[n] = '\\0';" },
  { n: 49, src: "    return n;" },
  { n: 50, src: "}" }
];

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

/* c is an int in C, not a char, and the whole reason for that is the numeric
   value: EOF is -1 and no byte is. Showing the glyph and the code together is
   the cheapest way to keep that fact in front of the reader while they watch
   the comparisons on line 27 being made. */
function charValue(ch) {
  if (ch === null || ch === undefined) return "—";
  if (ch === "EOF") return "EOF is -1";
  return `${ch.charCodeAt(0)}`;
}

/* "line 27" or "lines 38 and 39". Written out rather than printed as a list
   because it is read aloud in the status sentence as well as set beside the
   snippet. */
function lineLabel(lines) {
  const ls = Array.isArray(lines) ? lines : [];
  if (ls.length === 0) return "";
  if (ls.length === 1) return `line ${ls[0]}`;
  return `lines ${ls.slice(0, -1).join(", ")} and ${ls[ls.length - 1]}`;
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
  const marked = frame.lines || [];

  /* Clamped because the cursor is drawn by translating one element across a
     row of fixed-width cells: a position past the end would slide it out of
     the row entirely rather than onto the EOF cell, which is the one position
     the fifth call is about. */
  const cursorAt = Math.max(0, Math.min(Number(frame.pos) || 0, source.length));

  /* One sentence per frame, naming what the marked line did. It is used twice
     — set beside the snippet and read into the status line — and computing it
     once is what guarantees the sighted reader and the listening reader are
     told the same thing about the same line. */
  const explain = () => {
    switch (frame.phase) {
      case "start":
        return `The call begins. Line 20 is about to read the first character; n is 0 and ${target} is still empty.`;
      case "eof":
        return "The first fgetc returned EOF, so out[0] was terminated and line 24 returns -1, the end-of-records signal.";
      case "test":
        return `The while condition held: c is ${charName(frame.c)}, none of the three terminators, so the body runs again.`;
      case "skip":
        return "Line 32 finds c equal to a carriage return, so the guarded body is skipped and the character is discarded.";
      case "store":
        return `Line 38 copies ${charName(frame.c)} into ${target}[${frame.n - 1}] and line 39 raises n to ${frame.n}.`;
      case "full":
        return `Line 37 finds n has reached size - 1, so ${charName(frame.c)} is read past but not stored. n stays ${frame.n}.`;
      case "read":
        return `Line 43 reads the next character, so c is now ${charName(frame.c)}; line 27 tests it on the next step.`;
      case "delim":
        if (frame.test === "comma") {
          return `The while condition is now false: c is a comma. The delimiter is consumed but never stored in ${target}.`;
        }
        if (frame.test === "newline") {
          return "The while condition is now false: c is the newline ending the record. It is consumed but never stored.";
        }
        return `The while condition is now false: the stream ran out mid-item, so the loop leaves ${target} as it stands.`;
      case "term":
        return `Line 47 writes the terminator into ${target}[${frame.n}], closing the ${frame.n} stored characters into a C string.`;
      case "return":
        return `Line 49 returns ${frame.ret}, the number of characters stored, and ${target} now holds "${frame.out}".`;
      default:
        return "";
    }
  };

  const active = CONDITIONS.find((cond) => cond.key === frame.test);

  /* The drawing is hidden from assistive technology, so this sentence is the
     figure for anyone not reading it visually. Everything the four bands carry
     has to be in here: the call, the marked line, the stream position, what
     the line did, the live variables, the loop condition, and the fields that
     have come out so far. */
  const status =
    `Call ${frame.call} of ${calls}, filling ${target}. ` +
    `Executing ${lineLabel(marked)} of 08-csv.c. ` +
    `Stream position ${frame.pos} of ${source.length}. ` +
    explain() + " " +
    `c holds ${frame.c === null ? "nothing yet" : charName(frame.c)}, n is ${frame.n}` +
    (typeof frame.ret === "number" ? `, and the call returns ${frame.ret}` : "") + ". " +
    (active ? `Loop condition: ${active.label}.` : "The loop has not been tested yet.") +
    (fields.length
      ? ` Completed so far: ${fields.map((f, k) => `${TARGETS[k % TARGETS.length]} = "${f.text}" with n = ${f.n}`).join("; ")}.`
      : " No field is complete yet.");

  return (
    <Explorable
      title="getDelimitedItem, one character at a time"
      notice="Watch the marked line: the comma is read there, the loop stops, and it never enters the buffer."
      caption={
        caption
        || "One line of cars.csv, read by four calls to getDelimitedItem. The marked line in the middle is the statement executing on this frame; the bands above and below it are that statement's input and its result. The stream position survives between calls, which is why each call picks up exactly where the last one stopped. The fifth call finds nothing left and returns -1, which is what ends the loop in main."
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

        {/* BAND 1 — the input line being consumed. The cursor is a single
            element that travels along the row rather than a class that moves
            from cell to cell, because the trip between two characters is the
            thing the stream position actually does and a cursor that blinks
            out and reappears asks the reader to find it again. */}
        <section className="pw-band pw-band-line">
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
            {/* The cell index is handed to CSS as a plain number, which the
                cursor multiplies by one cell's pitch. Written as a string so
                that no renderer is tempted to append a unit to it. */}
            <div className="pw-row pw-row-line" style={{ "--pw-at": String(cursorAt) }}>
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

              {/* The travelling cursor, laid over the row. Its offset is a
                  whole number of cells, so it comes to rest exactly on a cell
                  at every frame and only the journey is animated. */}
              <span className="pw-cursor" />
            </div>
          </div>

          <p className="pw-legend">
            ▲ marks the character the next fgetc will return. The cell tagged c
            holds the character that has already been read.
          </p>
        </section>

        {/* BAND 2 — the source on the left, the explanation of the marked line
            on the right. This is the anchor of the figure: everything else on
            screen is the state that this one statement is acting on. */}
        <div className="pw-mid">
          <section className="pw-band pw-band-code">
            <h4 className="pw-label">
              08-csv.c
              <span className="pw-meta">comments omitted</span>
            </h4>

            <div className="pw-scroll ex-scroll">
              <ol className="pw-code">
                {CODE.map((row) => {
                  const on = marked.includes(row.n);
                  return (
                    <li key={row.n} className={`pw-code-line${on ? " is-now" : ""}`}>
                      {/* The arrow, not the tint, is what says which line is
                          executing. A reader who cannot separate the two
                          backgrounds still has a mark to find. */}
                      <span className="pw-code-mark">{on ? "▶" : ""}</span>
                      <span className="pw-code-n">{row.n}</span>
                      <code className="pw-code-src">{row.src}</code>
                    </li>
                  );
                })}
              </ol>
            </div>
          </section>

          <section className="pw-band pw-band-why">
            <h4 className="pw-label">
              What that line just did
              <span className="pw-meta">{lineLabel(marked)}</span>
            </h4>

            <p className="pw-note">{explain()}</p>

            {/* The live variables, shown as the variables they are. c carries
                its numeric value as well as its glyph because line 27 compares
                it against EOF, which is a number and not a character. */}
            <div className="pw-vars">
              <span className="pw-var">
                <span className="pw-var-name">c</span>
                <span className={`pw-var-value${frame.c === null ? " is-empty" : ""}`}>
                  {frame.c === null ? "not read yet" : glyph(frame.c)}
                </span>
                <span className="pw-var-code">{charValue(frame.c)}</span>
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

            {/* Which of the four conditions the loop is in, named in words.
                The note is printed for the condition that holds only: the
                other three are here to be ruled out, and three paragraphs of
                explanation for states that are not happening would crowd out
                the one that is. */}
            <p className="pw-cond-head">
              <code>while (c != EOF &amp;&amp; c != ',' &amp;&amp; c != '\n')</code>
            </p>
            <ul className="pw-conds">
              {CONDITIONS.map((cond) => {
                const on = frame.test === cond.key;
                return (
                  <li key={cond.key} className={`pw-cond${on ? " is-on" : ""}`}>
                    {/* The marker is a word as well as a color, because a
                        reader who cannot tell the two tints apart still has to
                        be able to say which condition holds. */}
                    <span className="pw-cond-flag">{on ? "NOW" : ""}</span>
                    <span className="pw-cond-text">
                      <code className="pw-cond-code">{cond.code}</code>
                      <strong className="pw-cond-label">{cond.label}</strong>
                      {on && <span className="pw-cond-note">{cond.note}</span>}
                    </span>
                  </li>
                );
              })}
            </ul>
          </section>
        </div>

        {/* BAND 3 — what comes out. The buffer filling one character at a
            time, and beside it the fields that have already left it, so that
            by the end of the timeline the reader has watched four strings come
            out of one line of text. */}
        <div className="pw-bot">
          <section className={`pw-band pw-band-buf${frame.justCompleted ? " is-handoff" : ""}`}>
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
          </section>

          <section className="pw-band pw-band-fields">
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
