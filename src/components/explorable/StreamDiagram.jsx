import React from "react";
import { useScrub, ScrubBar, Explorable } from "./Scrub.jsx";

/* Streams and the FILE object, for step S1.2 of the File I/O handout.

   This figure replaces two paragraphs of assertion. The prose could state that
   the library models a file as a stream, that the traversal state lives in an
   object of type FILE, and that printf is fprintf(stdout, ...) — and students
   read all three, agreed with all three, and still treated fopen as the moment
   file I/O begins. The reframing the step actually needs is that they have been
   driving this machinery since their first program, and a sentence has not been
   able to deliver it.

   So the figure is built around one comparison. The reader steps through
   fopen, fgetc, printf and fclose on a single stack of four layers — the
   program, the FILE object, the operating system, the device — and printf
   travels that stack exactly as fgetc did. Nothing about the picture changes
   except which of the four streams is named. That identity is the lesson, and
   it is only convincing because the three standard streams are drawn as peers
   of fp from the first frame rather than introduced afterwards as a special
   case: fp arrives as a fourth chip in a row of four, not as the subject.

   Three design decisions are worth recording.

   The four fields are shown with live values and the one that moved is named
   in words, because "position advances" is the claim the reader has to be able
   to check. A field table that never visibly changes would make the FILE object
   look like a label rather than a thing with state.

   The layers a call reaches are frame data, not decoration. The second fgetc
   deliberately stops at the FILE object: the byte it returns is already in the
   buffer that object owns, so the call never reaches the operating system. That
   is a real difference between two identical-looking calls, and a figure whose
   only variable was a highlight color could not have shown it.

   And fclose empties the card rather than removing it quietly. The dangling
   pointer is the error this step is trying to prevent, so the last frame has to
   leave fp visibly pointing at something that is no longer there.

   The component simulates nothing. Every frame below is authored data: the byte
   values are the first sixteen bytes of the course machine's test.txt, the file
   is 27 bytes with its newline at offset 11, and a position after one fgetc is
   1 because that is what the program printed. A second implementation of C's
   semantics running at render time would be the one students believed. */

/* The first sixteen of test.txt's twenty-seven bytes, as captured on the course
   machine. Sixteen rather than twenty-seven because at 360px a twenty-seven
   column row of glyphs is unreadable, and the position the figure demonstrates
   never leaves the first two. The newline at offset 11 is drawn as a named cell
   rather than as a gap: it is a byte, and a gap would say it is an absence. */
const BYTES = [
  { ch: "h", dec: 104 },
  { ch: "e", dec: 101 },
  { ch: "l", dec: 108 },
  { ch: "l", dec: 108 },
  { ch: "o", dec: 111 },
  { ch: "·", dec: 32, name: "SP" },
  { ch: "n", dec: 110 },
  { ch: "o", dec: 111 },
  { ch: ".", dec: 46 },
  { ch: "·", dec: 32, name: "SP" },
  { ch: "1", dec: 49 },
  { ch: "¶", dec: 10, name: "LF" },
  { ch: "w", dec: 119 },
  { ch: "h", dec: 104 },
  { ch: "e", dec: 101 },
  { ch: "r", dec: 114 }
];

const SIZE = 27;              // test.txt is 27 bytes at this point in the handout

/* The three streams the runtime opens before main is entered. Their fields are
   constant for the whole figure: nothing this program does touches stdin or
   stderr, and showing them as fixed is part of the argument that fp is not
   special. Positions are reported as inapplicable rather than as zero because a
   terminal is not a seekable file and ftell on one does not return a byte
   offset. */
const STANDARD = {
  stdin: {
    name: "stdin",
    where: "the terminal (keyboard)",
    device: "terminal",
    pos: "not applicable — a terminal is not seekable",
    buf: "line buffered",
    eof: "clear",
    err: "clear",
    state: "opened before main"
  },
  stdout: {
    name: "stdout",
    where: "the terminal (screen)",
    device: "terminal",
    pos: "not applicable — a terminal is not seekable",
    buf: "line buffered",
    eof: "clear",
    err: "clear",
    state: "opened before main"
  },
  stderr: {
    name: "stderr",
    where: "the terminal (screen)",
    device: "terminal",
    pos: "not applicable — a terminal is not seekable",
    buf: "never fully buffered",
    eof: "clear",
    err: "clear",
    state: "opened before main"
  }
};

/* Frames are authored, one per call, and every one of them changes something a
   reader can point at: a field value, which stream is active, or how far down
   the stack the call reaches. A frame that changed nothing would be a frame
   that taught nothing, and there is no such frame here.

     active    which stream the call names
     reach     which of the four layers the call actually touches
     fp        the fields of fp's FILE object, or null when there is no object
     changed   the field keys that moved, and the word printed beside them
     terminal  what has appeared on screen so far */
const FRAMES = [
  {
    code: "/* before main is entered */",
    active: null,
    show: "stdout",
    reach: ["file", "os", "device"],
    device: "terminal",
    fp: null,
    pointer: "no value yet",
    changed: { fields: [], word: "" },
    terminal: "",
    note: "The library, not your program",
    say:
      "Before main is entered the runtime opens three streams. stdin, stdout and " +
      "stderr are each a FILE object, already connected to the terminal."
  },
  {
    code: 'FILE *fp = fopen("test.txt", "r");',
    active: "fp",
    show: "fp",
    reach: ["program", "file", "os", "device"],
    device: "disk",
    fp: { pos: 0, buf: "fully buffered", eof: "clear", err: "clear" },
    pointer: "refers to the new FILE object",
    changed: { fields: ["pos", "buf", "eof", "err"], word: "set" },
    terminal: "",
    note: "A fourth stream, beside the three",
    say:
      "fopen asks the operating system for the file, constructs a FILE object " +
      "to hold its state, and returns a pointer to it. fp is now a fourth stream " +
      "beside stdin, stdout and stderr."
  },
  {
    code: "int c = fgetc(fp);        /* c is 104, 'h' */",
    active: "fp",
    show: "fp",
    reach: ["program", "file", "os", "device"],
    device: "disk",
    fp: { pos: 1, posFrom: 0, buf: "fully buffered", eof: "clear", err: "clear" },
    pointer: "refers to the FILE object",
    changed: { fields: ["pos"], word: "changed" },
    terminal: "",
    note: "The position moved, and nothing else",
    say:
      "fgetc takes the pointer, reads the byte at the current position and " +
      "advances that position from 0 to 1. The next call will read byte 1, and " +
      "the reader never touched the object to make that happen."
  },
  {
    code: 'printf("hi");             /* = fprintf(stdout, "hi") */',
    active: "stdout",
    show: "stdout",
    reach: ["program", "file", "os", "device"],
    device: "terminal",
    fp: { pos: 1, buf: "fully buffered", eof: "clear", err: "clear" },
    pointer: "refers to the FILE object",
    changed: { fields: [], word: "" },
    streamChanged: true,
    note: "The same stack, a different stream",
    say:
      "printf is fprintf with stdout supplied for you. The call travels the same " +
      "four layers fgetc travelled and differs only in which stream it names. fp " +
      "is not touched, and no new mechanism is involved."
  },
  {
    code: "c = fgetc(fp);            /* c is 101, 'e' */",
    active: "fp",
    show: "fp",
    reach: ["program", "file"],
    device: "disk",
    fp: { pos: 2, posFrom: 1, buf: "fully buffered", eof: "clear", err: "clear" },
    pointer: "refers to the FILE object",
    changed: { fields: ["pos"], word: "changed" },
    note: "This one stops at the FILE object",
    say:
      "Back on fp, whose position is exactly where printf left it. This byte is " +
      "already inside the object's buffer, so the call is answered in memory and " +
      "never reaches the operating system."
  },
  {
    code: "fclose(fp);",
    active: "fp",
    show: "fp",
    reach: ["program", "file", "os", "device"],
    device: "disk",
    fp: null,
    pointer: "still holds the old address — do not use it",
    changed: { fields: [], word: "" },
    released: true,
    note: "The object is gone; the pointer is not",
    say:
      "fclose releases the FILE object. fp still holds the address it was given, " +
      "so the pointer survives the thing it pointed at, and reading through it " +
      "now is undefined behavior."
  }
];

/* The four layers, top to bottom. The bottom one is retitled per frame, because
   the device under the same three layers is a disk for fp and a terminal for
   stdout — which is the only thing that differs between the two paths. */
const LAYER_TITLE = {
  program: "Your program",
  file: "The FILE object",
  os: "The operating system",
  device: "The device"
};

const FIELDS = [
  { key: "pos", label: "position" },
  { key: "buf", label: "buffering mode" },
  { key: "eof", label: "end-of-file indicator" },
  { key: "err", label: "error indicator" }
];

export function StreamDiagram({ caption }) {
  const scrub = useScrub(FRAMES.length);
  const frame = FRAMES[Math.min(scrub.index, FRAMES.length - 1)];

  /* The card the field table is showing. fp's card is authored per frame; the
     standard streams are constant, which is itself the point being made. */
  const card = frame.show === "fp" ? fpCard(frame) : STANDARD[frame.show];

  const streams = [
    STANDARD.stdin,
    STANDARD.stdout,
    STANDARD.stderr,
    {
      name: "fp",
      where: "test.txt",
      device: "disk",
      state: fpState(frame)
    }
  ];

  const reached = (id) => frame.reach.indexOf(id) !== -1;

  /* The drawing is aria-hidden, so this sentence has to carry the same four
     facts it carries: which call, which stream it names, how far down the stack
     it reaches, and what the object's fields now read. */
  const status =
    `Call ${scrub.index + 1} of ${FRAMES.length}: ${frame.code.replace(/\s+/g, " ")} ` +
    `${frame.say} ` +
    `Active stream: ${frame.active ? frame.active : "none, main has not started"}. ` +
    `This call reaches ${frame.reach.map((id) => reachName(id, frame)).join(", ")}. ` +
    `${card.name} now reads: position ${describe(card.pos)}, ` +
    `buffering ${describe(card.buf)}, end-of-file indicator ${describe(card.eof)}, ` +
    `error indicator ${describe(card.err)}.`;

  return (
    <Explorable
      title="One stream, and the FILE object behind it"
      notice="Watch printf land on the same four layers as fgetc."
      caption={caption}
      status={status}
    >
      <div className="sd-figure" aria-hidden="true">
        {/* The calls stay on screen so the reader can see which one produced
            the state in front of them, and so the printf line sits in the same
            column as the two fgetc lines it is being compared with. */}
        <ol className="sd-calls">
          {FRAMES.map((f, n) => (
            <li
              key={n}
              className={"sd-call" + (n === scrub.index ? " is-here" : "")}
            >
              <span className="sd-call-mark">{n === scrub.index ? "▸" : ""}</span>
              <code className="sd-call-src">{f.code}</code>
            </li>
          ))}
        </ol>

        <div className="sd-stack">
          {/* Layer 1 — the program. It holds a pointer and nothing else, which
              is the whole of its relationship with the stream. */}
          <Layer id="program" lit={reached("program")} meta="main()">
            <p className="sd-ptr">
              <code className="sd-ptr-decl">FILE *fp</code>
              <span className="sd-ptr-arrow">{frame.fp ? "→" : "⇢"}</span>
              <span className={"sd-ptr-val" + (frame.released ? " is-dangling" : "")}>
                {frame.pointer}
              </span>
            </p>
          </Layer>

          <Joint lit={reached("program") && reached("file")} />

          {/* Layer 2 — the FILE objects. All four streams live here, side by
              side, so that fp is visibly one of a set and not a new species. */}
          <Layer
            id="file"
            lit={reached("file")}
            meta="owned by the library, not by you"
          >
            <ul className="sd-streams">
              {streams.map((s) => (
                <li
                  key={s.name}
                  className={
                    "sd-stream" +
                    (s.name === frame.active ? " is-active" : "") +
                    (s.name === "fp" && frame.released ? " is-released" : "") +
                    (s.name === "fp" && !frame.fp && !frame.released ? " is-absent" : "")
                  }
                >
                  <span className="sd-stream-name">{s.name}</span>
                  <span className="sd-stream-where">{s.where}</span>
                  {/* The active stream is named in words as well as marked, so
                      the distinction survives grayscale and a cheap panel. */}
                  <span className="sd-stream-state">
                    {s.name === frame.active ? "named by this call" : s.state}
                  </span>
                </li>
              ))}
            </ul>

            <div className={"sd-card" + (frame.streamChanged ? " is-swapped" : "")}>
              <p className="sd-card-head">
                <span className="sd-card-title">
                  Inside the FILE object behind <code>{card.name}</code>
                </span>
                {/* What this frame did, named in one phrase. Every frame has
                    one, because a frame that changed nothing is not a frame. */}
                <span className="sd-card-note">{frame.note}</span>
              </p>

              <dl className="sd-fields">
                {FIELDS.map((f) => {
                  const moved = frame.changed.fields.indexOf(f.key) !== -1;
                  return (
                    <div
                      key={f.key}
                      className={"sd-field" + (moved ? " is-moved" : "")}
                    >
                      <dt className="sd-field-label">{f.label}</dt>
                      <dd className="sd-field-value">
                        {f.key === "pos" && card.posFrom !== undefined ? (
                          <span className="sd-shift">
                            <span className="sd-shift-was">{card.posFrom}</span>
                            <span className="sd-shift-arrow">{"→"}</span>
                            <span className="sd-shift-now">{card.pos}</span>
                          </span>
                        ) : (
                          describe(card[f.key])
                        )}
                        {/* The word, not only the rule: a field that moved says
                            so in text that a screenshot in black and white
                            still carries. */}
                        {moved && <span className="sd-chip">{frame.changed.word}</span>}
                      </dd>
                    </div>
                  );
                })}
              </dl>
            </div>
          </Layer>

          <Joint lit={reached("file") && reached("os")} />

          <Layer
            id="os"
            lit={reached("os")}
            meta={
              reached("os")
                ? "this call crosses into the kernel"
                : "answered in memory; the kernel is not involved"
            }
          />

          <Joint lit={reached("os") && reached("device")} />

          {/* Layer 4 — the device, named per frame. The same three layers above
              it end at a disk for fp and at a terminal for stdout, and that is
              the only difference between the two paths. */}
          <Layer
            id="device"
            lit={reached("device")}
            title={frame.device === "disk" ? "The disk" : "The terminal"}
            meta={frame.device === "disk" ? "test.txt, 27 bytes" : "screen and keyboard"}
          >
            {/* Seventeen byte cells do not fit in 360px, so the row scrolls
                inside itself and never the page. It carries no focusable
                child: the whole drawing is aria-hidden, and a tab stop inside
                a hidden subtree is a trap with nothing in it. */}
            {frame.device === "disk" ? (
              <div className="ex-scroll">
                <div className="sd-bytes">
                  {BYTES.map((b, k) => (
                    <span
                      key={k}
                      className={
                        "sd-byte" +
                        (b.name ? " is-named" : "") +
                        (frame.fp && k === frame.fp.pos ? " is-at" : "") +
                        (frame.fp && k < frame.fp.pos ? " is-read" : "")
                      }
                    >
                      <span className="sd-byte-ch">{b.name ? b.name : b.ch}</span>
                      <span className="sd-byte-n">{k}</span>
                    </span>
                  ))}
                  <span className="sd-byte is-rest">
                    <span className="sd-byte-ch">{"…"}</span>
                    <span className="sd-byte-n">26</span>
                  </span>
                </div>
              </div>
            ) : (
              <pre className="sd-term">
                {frame.terminal ? frame.terminal : "(nothing printed yet)"}
              </pre>
            )}

            {frame.device === "disk" && (
              <p className="sd-caret-note">
                {frame.fp
                  ? `The position marks byte ${frame.fp.pos}, decimal ` +
                    `${BYTES[frame.fp.pos].dec}, the next byte a read would return.`
                  : "No stream refers to this file, so there is no position in it."}
              </p>
            )}
          </Layer>
        </div>

        <p className="sd-say">{frame.say}</p>
      </div>

      <ScrubBar scrub={scrub} label="the calls" status={status} unit="call" />
    </Explorable>
  );
}

/* A band of the stack. Whether a call reached it is stated in words on the
   band itself as well as drawn, because "lit" as a tint is exactly the kind of
   signal that disappears in print, in grayscale and in sunlight. */
function Layer({ id, lit, title, meta, children }) {
  return (
    <section className={`sd-layer sd-layer-${id}${lit ? " is-lit" : ""}`}>
      <div className="sd-layer-head">
        <span className="sd-layer-title">{title || LAYER_TITLE[id]}</span>
        {meta && <span className="sd-layer-meta">{meta}</span>}
        <span className="sd-layer-reach">
          {lit ? "reached by this call" : "not involved"}
        </span>
      </div>
      {children}
    </section>
  );
}

/* The link between two bands. Solid when the call passes through it, dashed
   when it stops short, so the depth a call travels is readable as a shape. */
function Joint({ lit }) {
  return (
    <div className={"sd-joint" + (lit ? " is-lit" : "")}>
      <span className="sd-joint-mark">{lit ? "↓" : "·"}</span>
    </div>
  );
}

/* fp's card, assembled from the frame so the field table and the stream chip
   can never disagree about whether the object exists. */
function fpCard(frame) {
  if (!frame.fp) {
    return {
      name: "fp",
      pos: null,
      buf: null,
      eof: null,
      err: null
    };
  }
  return {
    name: "fp",
    pos: `${frame.fp.pos} of ${SIZE} bytes`,
    posFrom: frame.fp.posFrom,
    buf: frame.fp.buf,
    eof: frame.fp.eof,
    err: frame.fp.err
  };
}

function fpState(frame) {
  if (frame.released) return "released by fclose";
  if (!frame.fp) return "not open yet";
  return "opened by your program";
}

/* The spoken name of a layer. The bottom band is a disk under fp and a
   terminal under stdout, and the sentence has to say whichever the drawing is
   showing or the two descriptions of the same frame disagree. */
function reachName(id, frame) {
  if (id === "device") return frame.device === "disk" ? "the disk" : "the terminal";
  return LAYER_TITLE[id].toLowerCase();
}

/* One renderer for an absent value, used by both the drawing and the spoken
   status so the two cannot describe the same empty field differently. */
function describe(value) {
  if (value === null || value === undefined) return "— no object";
  return String(value);
}
