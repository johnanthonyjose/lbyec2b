import React from "react";
import { useScrub, ScrubBar, Explorable } from "./Scrub.jsx";

/* What the mode string does to a file that already has contents.

   This figure carries step 3.1 of the File I/O handout on its own, and it is
   deliberately not a source walk. The statements in 03-append.c are in the
   order a student would guess; nothing about their order is surprising. The
   surprising thing is one argument. Change "a" to "w" in a call whose shape is
   otherwise identical and the file's contents are destroyed — so the reader
   picks the argument and watches the file, rather than walking the program.

   Three things the figure has to land, in this order of importance.

   First, that the destruction happens AT THE OPEN. Students who lose work to
   "w" are not careless; they are reasoning correctly from a wrong model, in
   which a file is emptied by being written over. Under that model the danger
   is in fputc, and a program that opens a file and then decides not to write
   is safe. It is not. So the timeline places the open and the write in
   separate frames, and the 27 bytes are already gone one frame before the
   single 'X' appears. A figure that truncated at the write would have taught
   the misconception instead of correcting it.

   Second, that a mode is a permission as well as a position. Under "r" the
   write is refused, the file is untouched, and fputc quietly returns EOF. That
   frame is why the timeline continues past the open in every mode.

   Third, what fopen RETURNS. "r" on a file that does not exist gives NULL and
   creates nothing, which is the other half of the same lesson and the reason
   the handout checks fp before using it. That case is stated per mode in the
   return panel rather than given a second control, because a second control
   would double the reader's work for a fact that does not need a timeline.

   The component knows no C. Every frame below is authored data checked against
   the standard and against the handout's own programs in public/assets/file-io;
   nothing here opens a stream or counts a byte at render time. A second,
   unverified implementation of C's semantics on screen would be the one the
   students believed. */

/* The file the whole handout uses, in the state 02-write.c leaves it: 27
   bytes, with the newline at offset 11. Written as an escape rather than a
   literal so this stays a text file to git; the runtime value is identical. */
const BEFORE = "hello no. 1\nwhere is no. 2?";
const BEFORE_LEN = BEFORE.length;                // 27
const NEWLINE_AT = 11;
const NEWLINE_MARK = "¶";                        // a newline is a byte, not an absence

/* The strip is drawn on a fixed grid so that the three modes are directly
   comparable: the same column means the same offset whichever mode is
   selected, and the file visibly shrinks to nothing under "w" rather than
   being redrawn at a new scale. Twenty-eight columns hold the longest state
   this figure reaches (the 28 bytes "a" leaves), and a twenty-ninth is the
   spacer the position marker needs when it sits past the last byte. */
const BYTE_COLUMNS = 28;
const TRACK = BYTE_COLUMNS + 1;                  // 29

const MODES = [
  { id: "r", label: '"r"', hint: "read only" },
  { id: "w", label: '"w"', hint: "write, truncating" },
  { id: "a", label: '"a"', hint: "write, appending" }
];

/* The frame every timeline starts from. Shared rather than repeated so the
   three modes provably begin from the same file. */
const START = {
  code: "/* test.txt already holds 27 bytes */",
  content: BEFORE,
  pos: null,
  fp: "none",
  say:
    "Before the open. test.txt is sitting on disk with 27 bytes in it, and " +
    "the program does not have a stream yet."
};

/* Three timelines of the same length, aligned frame for frame, so that
   switching mode keeps the reader's position on the timeline: stop on the
   open, flip from "a" to "w", and see the same instant in the other world.

   `content` is what the file holds, `pos` is where the next write is aimed,
   `gone` is how many bytes the open just destroyed. */
const TIMELINES = {
  r: [
    START,
    {
      code: 'fp = fopen("test.txt", "r");',
      content: BEFORE, pos: 0, fp: "open", event: "intact",
      say:
        "Opening for reading changes nothing. All 27 bytes are still there, " +
        "and the position sits at byte 0, the start of the file."
    },
    {
      code: "fputc('X', fp);",
      content: BEFORE, pos: 0, fp: "open", event: "refused",
      say:
        "The write is refused. A mode is a permission as well as a position: " +
        "fputc returns EOF, the stream's error indicator is set, and not one " +
        "byte of the file changes."
    },
    {
      code: "fclose(fp);",
      content: BEFORE, pos: null, fp: "closed",
      say: "The stream is closed. test.txt is exactly the 27 bytes it started with."
    }
  ],

  w: [
    START,
    {
      code: 'fp = fopen("test.txt", "w");',
      content: "", gone: BEFORE_LEN, pos: 0, fp: "open", event: "truncate",
      say:
        "The open itself empties the file. All 27 bytes are gone the moment " +
        "fopen returns, before the program has written anything at all, and " +
        "the position sits at byte 0 of a file that is now 0 bytes long."
    },
    {
      code: "fputc('X', fp);",
      content: "X", pos: 1, fp: "open", event: "write",
      note: "the byte waits in the stream's buffer until fclose flushes it; the file was emptied back at the open, not here",
      say:
        "One byte is written at offset 0, and it is the whole file. The old " +
        "contents were not overwritten by this call — they were already gone."
    },
    {
      code: "fclose(fp);",
      content: "X", pos: null, fp: "closed",
      say:
        "fclose flushes and closes. test.txt is 1 byte long and reads X. The " +
        "27 bytes are not recoverable."
    }
  ],

  a: [
    START,
    {
      code: 'fp = fopen("test.txt", "a");',
      content: BEFORE, pos: BEFORE_LEN, fp: "open", event: "end",
      say:
        "Opening for appending keeps every byte. The 27 bytes are intact, and " +
        "writes are aimed past the last one, at offset 27."
    },
    {
      code: "fputc('X', fp);",
      content: BEFORE + "X", pos: BEFORE_LEN + 1, fp: "open", event: "write",
      note: "the byte waits in the stream's buffer until fclose flushes it",
      say:
        "The byte lands at offset 27, after the text that was already there. " +
        "The file grows to 28 bytes instead of replacing anything."
    },
    {
      code: "fclose(fp);",
      content: BEFORE + "X", pos: null, fp: "closed",
      say: "test.txt is 28 bytes: the original 27, with one more on the end."
    }
  ]
};

const FRAME_COUNT = TIMELINES.r.length;

/* What fopen hands back, in both of the cases a student will meet. The second
   sentence is the one the handout's NULL check exists for, and it is on screen
   in every frame rather than being reachable only through another control. */
const RETURNS = {
  r: {
    exists: "a usable FILE * — test.txt exists, so the open succeeds",
    missing: "If test.txt does not exist, fopen returns NULL and no file is created."
  },
  w: {
    exists: "a usable FILE * — and the file it points at has just been emptied",
    missing: "If test.txt does not exist, fopen creates it, empty. There is nothing to destroy."
  },
  a: {
    exists: "a usable FILE * — the file is open with its contents kept",
    missing: "If test.txt does not exist, fopen creates it, empty, and writes start at offset 0."
  }
};

/* The line telling the reader what to watch has to change with the mode: the
   thing worth watching is a different thing in each of the three. */
const NOTICE = {
  r: "Watch the write get refused, and the file never change.",
  w: "Watch all 27 bytes disappear at the open, before any write.",
  a: "Watch the position start at the end, so the write adds rather than replaces."
};

const MODE_NAME = {
  r: 'mode "r", read only',
  w: 'mode "w", write and truncate',
  a: 'mode "a", write and append'
};

export function ModeExplorer({ caption }) {
  const [mode, setMode] = React.useState("a");

  /* "a" is the opening mode, not "w". The figure's argument is a comparison,
     and it only reads as a comparison if the reader arrives at "w" from a mode
     that kept the file — landing on the destroyed state first would make it
     look like what opening a file simply does. */
  const scrub = useScrub(FRAME_COUNT);

  const frames = TIMELINES[mode];
  const index = Math.min(scrub.index, frames.length - 1);
  const frame = frames[index];

  const len = frame.content.length;

  const status =
    `${MODE_NAME[mode]}. Step ${index + 1} of ${frames.length}: ${frame.code} ` +
    `${frame.say} ` +
    `test.txt now holds ${len} ${len === 1 ? "byte" : "bytes"}. ` +
    `Next write is aimed at ${describePosition(frame, len)}. ` +
    `fopen returned ${RETURNS[mode].exists}. ` +
    `${RETURNS[mode].missing}`;

  return (
    <Explorable
      title="What the mode does to a file that already has contents"
      notice={NOTICE[mode]}
      caption={caption}
      status={status}
    >
      {/* The mode selector is the instrument, not decoration, so it sits above
          the drawing and is never hidden from assistive technology. */}
      <ModeChoice value={mode} onChange={setMode} />

      <div className="me-figure" aria-hidden="true">
        {/* The call, with the one argument that decides everything picked out
            of it. The whole figure turns on that string, so it is never left
            to the reader to find it inside the line. */}
        <div className="me-region me-program">
          <div className="me-region-label">The program</div>
          <ol className="me-calls">
            {frames.map((f, n) => (
              <li
                key={n}
                className={
                  "me-call" +
                  (n === index ? " is-here" : "") +
                  (n < index ? " is-past" : "")
                }
              >
                <span className="me-call-mark">{n === index ? "▸" : ""}</span>
                <code className="me-call-src">{f.code}</code>
              </li>
            ))}
          </ol>

          <p className="me-arg">
            <span className="me-arg-label">The argument in question</span>
            <code className="me-arg-value">"{mode}"</code>
          </p>
        </div>

        <div className="me-region me-file">
          <div className="me-region-label">
            test.txt
            <span className="me-region-meta">
              {len} {len === 1 ? "byte" : "bytes"}
            </span>
          </div>

          {/* Keyed on mode and frame so the truncation animation runs again
              every time the reader arrives at that frame, including on the
              second and third pass, which is when they are looking for it. */}
          <Track key={`${mode}-${index}`} frame={frame} />

          <p className="me-contents">
            <span className="me-contents-label">reads</span>
            <code className="me-contents-value">
              {len === 0
                ? "(nothing — the file is empty)"
                : frame.content.split("\n").join(NEWLINE_MARK + " ")}
            </code>
          </p>

          {frame.note && <p className="me-note">{frame.note}</p>}

          {/* What the open did, named. A strip that shortened cannot say by
              itself whether it was emptied, refused or extended. */}
          <div className={"me-event is-" + (frame.event || "none")}>
            <span className="me-event-mark">{eventMark(frame)}</span>
            <span className="me-event-text">{eventText(frame)}</span>
          </div>
        </div>

        <div className="me-region me-facts">
          <Fact label="Length" value={`${len} ${len === 1 ? "byte" : "bytes"}`} />
          <Fact label="Next write goes to" value={describePosition(frame, len)} />
          <Fact
            label="fopen returned"
            value={frame.fp === "none"
              ? "nothing yet — the call has not run"
              : frame.fp === "closed"
                ? "the stream has been closed"
                : RETURNS[mode].exists}
          />
        </div>

        {/* The half of stage 2's lesson that needs no timeline: what comes
            back when the file is not there at all. */}
        <p className="me-missing">
          <span className="me-missing-label">If the file does not exist</span>
          {RETURNS[mode].missing}
        </p>

        <p className="me-say">{frame.say}</p>
      </div>

      <ScrubBar scrub={scrub} label="the program" status={status} unit="step" />
    </Explorable>
  );
}

/* One phrase for where the next write lands, used by the drawing and by the
   spoken status, so the two can never disagree. */
function describePosition(frame, len) {
  if (frame.pos === null || frame.pos === undefined) return "nowhere — the stream is closed";
  if (frame.pos === 0 && len === 0) return "byte 0, the start of an empty file";
  if (frame.pos >= len) return `byte ${frame.pos}, the end of the file`;
  return `byte ${frame.pos}, the start of the file`;
}

function eventMark(frame) {
  if (frame.event === "truncate") return "✕";
  if (frame.event === "refused") return "✕";
  if (frame.event === "write") return "▸";
  if (frame.event === "intact" || frame.event === "end") return "✓";
  return "·";
}

function eventText(frame) {
  if (frame.event === "truncate") {
    return `all ${BEFORE_LEN} bytes destroyed by the open itself, before any write`;
  }
  if (frame.event === "intact") return "nothing destroyed; the position is at the start";
  if (frame.event === "end") return "nothing destroyed; the position is at the end";
  if (frame.event === "refused") return "the write is refused and the file is unchanged";
  if (frame.event === "write") return "one byte written";
  return "the file as the program found it";
}

/* The byte strip and the position marker, on one grid.

   The marker is a separate rail under the strip rather than a cell inside it,
   because a position is not a byte: after the last write under "a" the
   position is 28, one past every byte in the file, and there is no cell it
   could occupy without claiming a byte exists there. The rail carries one
   extra column for exactly that case. */
function Track({ frame }) {
  const len = frame.content.length;
  const gone = frame.gone || 0;
  const newByte = frame.event === "write" ? len - 1 : -1;

  const cells = [];
  for (let k = 0; k < BYTE_COLUMNS; k++) {
    const full = k < len;
    cells.push(
      <span
        key={k}
        className={
          "me-cell" +
          (full ? " is-full" : "") +
          (k < gone ? " is-gone" : "") +
          (k === newByte ? " is-new" : "") +
          (k === NEWLINE_AT && full ? " is-newline" : "")
        }
      />
    );
  }
  // The spacer column the marker needs when it sits past the last byte.
  cells.push(<span key="pad" className="me-cell is-pad" />);

  return (
    <div className="me-track">
      <div className={"me-strip" + (frame.event === "truncate" ? " is-emptied" : "")}>
        {cells}
      </div>

      <div className="me-rail">
        {frame.pos !== null && frame.pos !== undefined && (
          <span
            className="me-caret"
            style={{ left: `calc(${frame.pos} * 100% / ${TRACK})` }}
          >
            <span className="me-caret-mark">▲</span>
            <span className="me-caret-num">{frame.pos}</span>
          </span>
        )}
      </div>

      <div className="me-ruler">
        <span>byte 0</span>
        <span>newline at 11</span>
        <span>byte 27</span>
      </div>
    </div>
  );
}

function Fact({ label, value }) {
  return (
    <div className="me-fact">
      <span className="me-fact-label">{label}</span>
      <span className="me-fact-value">{value}</span>
    </div>
  );
}

/* A real radio group.

   Buttons with radio semantics rather than a select or three styled divs: all
   three modes are named and visible at once, which a select cannot do, and the
   arrow keys move between them the way a radio group is expected to behave.
   Roving tabindex keeps the group one tab stop, so a keyboard reader passing
   through the page does not have to step through every option. */
function ModeChoice({ value, onChange }) {
  const refs = React.useRef([]);
  const at = MODES.findIndex((o) => o.id === value);

  const move = (delta) => {
    const next = (at + delta + MODES.length) % MODES.length;
    onChange(MODES[next].id);
    const el = refs.current[next];
    if (el && el.focus) el.focus();
  };

  const onKeyDown = (e) => {
    if (e.key === "ArrowRight" || e.key === "ArrowDown") { e.preventDefault(); move(1); }
    else if (e.key === "ArrowLeft" || e.key === "ArrowUp") { e.preventDefault(); move(-1); }
    else if (e.key === "Home") { e.preventDefault(); move(-at); }
    else if (e.key === "End") { e.preventDefault(); move(MODES.length - 1 - at); }
  };

  return (
    <div className="me-choice" role="radiogroup" aria-label="The mode passed to fopen">
      {/* The legend is already the group's aria-label, so the visible copy is
          hidden from assistive technology to stop it being announced twice. */}
      <span className="me-choice-legend" aria-hidden="true">
        fopen("test.txt", ? )
      </span>
      <div className="me-opts">
        {MODES.map((o, n) => (
          <button
            key={o.id}
            type="button"
            role="radio"
            aria-checked={o.id === value}
            tabIndex={o.id === value ? 0 : -1}
            ref={(el) => { refs.current[n] = el; }}
            className={"me-opt" + (o.id === value ? " is-on" : "")}
            onClick={() => onChange(o.id)}
            onKeyDown={onKeyDown}
          >
            {/* Selection is marked by the check, by weight, by a thick left
                rule and by a filled surface — never by colour on its own. */}
            <span className="me-opt-mark" aria-hidden="true">
              {o.id === value ? "✓" : ""}
            </span>
            <span className="me-opt-label">{o.label}</span>
            <span className="me-opt-hint">{o.hint}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
