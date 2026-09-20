import React from "react";
import { useScrub, ScrubBar, Explorable } from "./Scrub.jsx";

/* Buffering, for the File I/O handout.

   This figure replaces about four hundred words of prose, and it has to carry
   the whole mechanism on its own. The prose could assert that a write goes
   into a buffer rather than to the disk; it could not show the file sitting at
   zero bytes while the program has already "written" twenty-seven of them, and
   that gap between what the program said and what the disk holds is the entire
   lesson.

   It also had to assert the reason. A buffer is not there to confuse students:
   handing bytes to the operating system is a system call, which costs orders
   of magnitude more than copying a byte into memory, so the library batches.
   An assertion like that is worth nothing to a second-year student. A counter
   that reads 1 in one mode and 27 in the other, for the same program producing
   the same file, is an argument they can see. That comparison is why the mode
   control exists, and why both counters are on screen at once rather than the
   reader being asked to remember the number from the other mode.

   The third thing this figure has to get right is the misconception the
   handout previously shipped and then had to correct: that a program which
   forgets fclose loses its output. It does not. Returning from main runs exit,
   and exit flushes every open stream. Only ABNORMAL termination loses the
   buffer. So the ending is a control of its own, and the abort branch is drawn
   with the outcome students never predict — a file that exists, holds zero
   bytes, and reported no error at all.

   The component knows no C. Every frame below is authored data checked against
   the real program in public/assets/file-io/02-write.c; nothing here steps a
   stream or counts a byte at render time. A second, unverified implementation
   of C's semantics on screen would be the one students believed. */

/* The bytes 02-write.c produces, exactly: 27 of them, newline at offset 11.
   The newline is written as an escape rather than a literal so this file stays
   a text file to git; the runtime value is identical. */
const TEXT = "hello no. 1\nwhere is no. 2?";
const TOTAL = TEXT.length;                       // 27
const NEWLINE_MARK = "¶";                   // a newline is a byte, not an absence

/* Frames are authored four times rather than computed from two axes, because
   the difference between the four timelines is not arithmetic: it is what each
   step MEANS, and the sentence for "fclose has nothing to flush" cannot be
   derived from a byte count. Writing them out also makes every claim on screen
   reviewable against the compiler by whoever maintains the handout.

   The four timelines are deliberately the same length and aligned step for
   step, so switching mode mid-timeline compares like with like and the scrub
   position does not have to move. `issued` is how many bytes the program has
   handed to the library; `disk` is how many the operating system has. The
   buffer is what lies between them. */
const TIMELINES = {
  "buffered/normal": [
    {
      code: 'fp = fopen("test.txt", "w");',
      issued: 0, disk: 0, calls: 0, buffer: "holding",
      say: "The stream is open and test.txt has been truncated to zero bytes."
    },
    {
      code: 'fprintf(fp, "hello no. %i\\n", 1);',
      issued: 12, disk: 0, calls: 0, buffer: "holding",
      say: "Twelve bytes are copied into the buffer the library owns. Nothing has gone to the disk."
    },
    {
      code: 'fputs("where is no. 2", fp);',
      issued: 26, disk: 0, calls: 0, buffer: "holding",
      say: "Fourteen more bytes are copied in, twenty-six in all, and the file on disk is still empty."
    },
    {
      code: "fputc('?', fp);",
      issued: 27, disk: 0, calls: 0, buffer: "holding",
      say: "One more byte. Every byte this program will write is now in memory, and test.txt is still zero bytes."
    },
    {
      code: "fclose(fp);",
      issued: 27, disk: 27, calls: 1, buffer: "flushed", event: "flush",
      say: "fclose flushes. All twenty-seven bytes cross to the operating system in a single write, and the file goes from zero bytes to twenty-seven at once."
    },
    {
      code: "return 0;",
      issued: 27, disk: 27, calls: 1, buffer: "flushed",
      say: "main returns, exit runs, and exit flushes every stream still open. This one was already closed, so there is nothing left to hand over."
    }
  ],

  "buffered/abort": [
    {
      code: 'fp = fopen("test.txt", "w");',
      issued: 0, disk: 0, calls: 0, buffer: "holding",
      say: "The stream is open and test.txt has been truncated to zero bytes."
    },
    {
      code: 'fprintf(fp, "hello no. %i\\n", 1);',
      issued: 12, disk: 0, calls: 0, buffer: "holding",
      say: "Twelve bytes are copied into the buffer the library owns. Nothing has gone to the disk."
    },
    {
      code: 'fputs("where is no. 2", fp);',
      issued: 26, disk: 0, calls: 0, buffer: "holding",
      say: "Fourteen more bytes are copied in, twenty-six in all, and the file on disk is still empty."
    },
    {
      code: "fputc('?', fp);",
      issued: 27, disk: 0, calls: 0, buffer: "holding",
      say: "One more byte. Every byte this program will write is now in memory, and test.txt is still zero bytes."
    },
    {
      code: "abort();   /* killed here */",
      issued: 27, disk: 0, calls: 0, buffer: "lost", event: "lost",
      say: "The program is killed before fclose. The buffer lives in the program's own memory, so its twenty-seven bytes die with it, and not one write ever reached the operating system."
    },
    {
      code: "/* the program is gone */",
      issued: 27, disk: 0, calls: 0, buffer: "gone", event: "lost",
      say: "test.txt exists and holds zero bytes. Nothing was reported as an error; the program simply never handed the bytes over. Only abnormal ends lose the buffer, because a normal return would have flushed it."
    }
  ],

  "unbuffered/normal": [
    {
      code: 'fp = fopen("test.txt", "w");  setvbuf(fp, NULL, _IONBF, 0);',
      issued: 0, disk: 0, calls: 0, buffer: "off",
      say: "The same program, with buffering turned off. Every byte will now go straight through."
    },
    {
      code: 'fprintf(fp, "hello no. %i\\n", 1);',
      issued: 12, disk: 12, calls: 12, buffer: "off", event: "through",
      say: "Twelve bytes go straight to the operating system, one system call each. The file already holds twelve bytes."
    },
    {
      code: 'fputs("where is no. 2", fp);',
      issued: 26, disk: 26, calls: 26, buffer: "off", event: "through",
      say: "Fourteen more bytes, fourteen more system calls. Twenty-six bytes on disk, twenty-six calls made."
    },
    {
      code: "fputc('?', fp);",
      issued: 27, disk: 27, calls: 27, buffer: "off", event: "through",
      say: "The last byte, and the twenty-seventh system call."
    },
    {
      code: "fclose(fp);",
      issued: 27, disk: 27, calls: 27, buffer: "off",
      say: "There was no buffer, so fclose has nothing to flush. It only closes the file."
    },
    {
      code: "return 0;",
      issued: 27, disk: 27, calls: 27, buffer: "off",
      say: "main returns. The file is the same twenty-seven bytes as before, and it cost twenty-seven system calls instead of one."
    }
  ],

  "unbuffered/abort": [
    {
      code: 'fp = fopen("test.txt", "w");  setvbuf(fp, NULL, _IONBF, 0);',
      issued: 0, disk: 0, calls: 0, buffer: "off",
      say: "The same program, with buffering turned off. Every byte will now go straight through."
    },
    {
      code: 'fprintf(fp, "hello no. %i\\n", 1);',
      issued: 12, disk: 12, calls: 12, buffer: "off", event: "through",
      say: "Twelve bytes go straight to the operating system, one system call each. The file already holds twelve bytes."
    },
    {
      code: 'fputs("where is no. 2", fp);',
      issued: 26, disk: 26, calls: 26, buffer: "off", event: "through",
      say: "Fourteen more bytes, fourteen more system calls. Twenty-six bytes on disk, twenty-six calls made."
    },
    {
      code: "fputc('?', fp);",
      issued: 27, disk: 27, calls: 27, buffer: "off", event: "through",
      say: "The last byte, and the twenty-seventh system call."
    },
    {
      code: "abort();   /* killed here */",
      issued: 27, disk: 27, calls: 27, buffer: "off",
      say: "The program is killed before fclose, and nothing is lost: every byte had already been handed over as it was written."
    },
    {
      code: "/* the program is gone */",
      issued: 27, disk: 27, calls: 27, buffer: "off",
      say: "test.txt holds all twenty-seven bytes. Turning buffering off bought that safety at the price of twenty-seven system calls."
    }
  ]
};

const MODES = [
  { id: "buffered", label: "Buffered", hint: "the default" },
  { id: "unbuffered", label: "Unbuffered", hint: "buffering turned off" }
];

const ENDINGS = [
  { id: "normal", label: "Ends normally", hint: "fclose, then return 0" },
  { id: "abort", label: "Aborts", hint: "killed before fclose" }
];

const FRAME_COUNT = TIMELINES["buffered/normal"].length;

function timeline(mode, ending) {
  return TIMELINES[`${mode}/${ending}`];
}

export function BufferMachine({ caption }) {
  const [mode, setMode] = React.useState("buffered");
  const [ending, setEnding] = React.useState("normal");

  /* Every timeline is the same length, which is what lets useScrub keep the
     reader's position when the mode changes. That is the point of the control:
     stop on the frame where the buffer is full, flip to unbuffered, and see
     the same moment in the other world without having to scrub back to it. */
  const scrub = useScrub(FRAME_COUNT);

  const frames = timeline(mode, ending);
  const index = Math.min(scrub.index, frames.length - 1);
  const frame = frames[index];

  const other = mode === "buffered" ? "unbuffered" : "buffered";
  const otherFrame = timeline(other, ending)[index];

  const held = Math.max(0, frame.issued - frame.disk);
  const onDisk = TEXT.slice(0, frame.disk);

  /* Both counters are named rather than inferred from the current mode. An
     earlier draft read the active count straight out of `frame` and labelled it
     "buffered", which was correct in one mode and a lie in the other — and a
     figure whose whole argument is a pair of numbers cannot afford to put
     either number under the wrong name. */
  const bufferedCalls = mode === "buffered" ? frame.calls : otherFrame.calls;
  const unbufferedCalls = mode === "unbuffered" ? frame.calls : otherFrame.calls;

  /* Once the process is gone the buffer is not holding anything: its memory
     went with it. Drawing the bytes there would say they are still somewhere. */
  const bufferTo = frame.buffer === "gone" ? frame.disk : frame.issued;

  /* The drawing is aria-hidden, so this sentence is the figure for anyone not
     reading the picture. It has to carry the same four facts the picture does:
     which world we are in, what just happened, what is in each of the two
     places, and the two counters side by side. */
  const status =
    `${mode === "buffered" ? "Buffered" : "Unbuffered"}, program ` +
    `${ending === "normal" ? "ends normally" : "aborts before fclose"}. ` +
    `Step ${index + 1} of ${frames.length}: ${frame.code} ` +
    `${frame.say} ` +
    `In the buffer: ${describeHeld(frame, held)}. ` +
    `On disk: test.txt holds ${frame.disk} of ${TOTAL} bytes. ` +
    `Write system calls so far: ${bufferedCalls} buffered against ` +
    `${unbufferedCalls} unbuffered.`;

  /* The line that tells the reader what to look at. It has to change with the
     mode, because the thing worth watching is the opposite in each: a file that
     refuses to grow, or a counter that will not stop climbing. */
  const notice = mode === "buffered"
    ? "Watch the file stay at 0 bytes while the buffer fills."
    : "Watch the file grow a byte at a time, and watch the counter.";

  return (
    <Explorable
      title="Where a write actually goes"
      notice={notice}
      caption={caption}
      status={status}
    >
      {/* The controls are the teaching instrument, not decoration, so they sit
          above the drawing and are never hidden from assistive technology. */}
      <div className="bm-choices">
        <Choice
          legend="The stream"
          options={MODES}
          value={mode}
          onChange={setMode}
        />
        <Choice
          legend="The program"
          options={ENDINGS}
          value={ending}
          onChange={setEnding}
        />
      </div>

      <div className="bm-figure" aria-hidden="true">
        {/* Region 1 — the program. The whole list stays on screen so the
            reader can see which call produced the state in front of them. */}
        <div className="bm-region bm-program">
          <div className="bm-region-label">The program</div>
          <ol className="bm-calls">
            {frames.map((f, n) => (
              <li
                key={n}
                className={
                  "bm-call" +
                  (n === index ? " is-here" : "") +
                  (n < index ? " is-past" : "")
                }
              >
                <span className="bm-call-mark">{n === index ? "▸" : ""}</span>
                <code className="bm-call-src">{f.code}</code>
              </li>
            ))}
          </ol>
        </div>

        {/* Regions 2 and 3 share one panel, and the two byte strips are drawn
            on the same 27-column grid one above the other. That alignment is
            what makes the flush read as a single downward movement rather than
            as two unrelated bars changing length. */}
        <div className="bm-region bm-store">
          <div className="bm-region-label">
            In memory: the buffer
            <span className="bm-region-meta">{describeHeld(frame, held)}</span>
          </div>

          <Strip
            key={`buf-${mode}-${ending}-${index}`}
            from={frame.disk}
            to={bufferTo}
            tone={frame.buffer === "lost" ? "lost" : "memory"}
            empty={emptyBufferNote(frame)}
          />

          {/* The band between the two strips names what is crossing, which is
              the one fact a pair of bars cannot say by itself. */}
          <div
            className={
              "bm-cross" +
              (frame.event === "flush" ? " is-flush" : "") +
              (frame.event === "through" ? " is-through" : "") +
              (frame.event === "lost" ? " is-lost" : "")
            }
          >
            <span className="bm-cross-arrow">
              {frame.event === "lost" ? "✕" : "↓"}
            </span>
            <span className="bm-cross-text">{crossing(frame)}</span>
          </div>

          <div className="bm-region-label">
            On disk: test.txt
            <span className="bm-region-meta">{frame.disk} of {TOTAL} bytes</span>
          </div>

          <Strip
            key={`disk-${mode}-${ending}-${index}`}
            from={0}
            to={frame.disk}
            tone="disk"
            landed={frame.event === "flush"}
            empty={frame.disk === 0 ? "0 bytes — there is nothing in the file" : null}
          />

          <p className="bm-contents">
            <span className="bm-contents-label">test.txt reads</span>
            <code className="bm-contents-value">
              {onDisk.length === 0
                ? "(nothing)"
                : onDisk.split("\n").join(NEWLINE_MARK + " ")}
            </code>
          </p>
        </div>

        {/* The counter. Both modes, always, because the number only means
            something next to the other number. */}
        <div className="bm-region bm-meter-region">
          <div className="bm-region-label">Write system calls so far</div>
          <div className="bm-meter">
            <Bar label="Buffered" value={bufferedCalls} active={mode === "buffered"} />
            <Bar label="Unbuffered" value={unbufferedCalls} active={mode === "unbuffered"} />
          </div>
          <p className="bm-why">
            A system call hands bytes to the operating system and costs far more
            than copying a byte into memory. Batching them is the whole reason
            the buffer exists.
          </p>
        </div>

        <p className="bm-say">{frame.say}</p>
      </div>

      <ScrubBar scrub={scrub} label="the program" status={status} unit="step" />
    </Explorable>
  );
}

/* One sentence fragment for the buffer's contents, used by both the drawing's
   meta line and the spoken status, so the two can never disagree. */
function describeHeld(frame, held) {
  if (frame.buffer === "off") return "buffering off, always empty";
  if (frame.buffer === "lost") return `${held} bytes discarded with the process`;
  if (frame.buffer === "gone") return "gone with the process";
  if (held === 0) return "empty";
  return `${held} bytes waiting`;
}

/* A strip that is empty says nothing by itself, and the reason it is empty is
   different in every mode: never used, already handed over, or destroyed. */
function emptyBufferNote(frame) {
  if (frame.buffer === "off") return "buffering is off — nothing is ever held here";
  if (frame.buffer === "gone") return "the process is gone, and its buffer went with it";
  if (frame.buffer === "flushed") return "empty — fclose handed everything over";
  return null;
}

function crossing(frame) {
  if (frame.event === "flush") return `one write() carries all ${TOTAL} bytes across`;
  if (frame.event === "through") return "each byte crosses on its own write()";
  if (frame.event === "lost") return "nothing ever crossed";
  if (frame.buffer === "off") {
    return frame.disk === 0
      ? "nothing has been written yet"
      : "every byte crossed at the moment it was written";
  }
  return "nothing crosses until the buffer is flushed";
}

/* A byte strip: twenty-seven cells on a fixed grid, filled between `from` and
   `to`. Cells are drawn as blocks rather than as glyphs because at 360px a
   glyph cell would be about eleven pixels wide and unreadable; the actual text
   is printed under the disk strip instead, where it has room to be read.

   Fill is never the only signal — the count is stated in the label above every
   strip and again in the live status line — but filled cells also carry a
   border that empty ones do not, so the strip survives greyscale. */
function Strip({ from, to, tone, landed, empty }) {
  const cells = [];
  for (let k = 0; k < TOTAL; k++) {
    const full = k >= from && k < to;
    cells.push(
      <span
        key={k}
        className={"bm-cell" + (full ? " is-full" : "") + (k === 11 ? " is-newline" : "")}
      />
    );
  }

  return (
    <div className="bm-strip-wrap">
      <div className={`bm-strip bm-tone-${tone}${landed ? " is-landed" : ""}`}>{cells}</div>
      <div className="bm-ruler">
        <span>0</span>
        <span>byte 11 is the newline</span>
        <span>26</span>
      </div>
      {empty && <p className="bm-strip-empty">{empty}</p>}
    </div>
  );
}

/* The two counters. The bar is proportional to 27 so that "1" is visibly a
   sliver next to a full-width 27; the number alone lets a reader conclude the
   difference is small, and the whole point is that it is not. */
function Bar({ label, value, active }) {
  const pct = Math.round((value / TOTAL) * 100);
  return (
    <div className={"bm-bar" + (active ? " is-active" : "")}>
      <span className="bm-bar-label">
        {label}
        {active ? " (shown)" : ""}
      </span>
      <span className="bm-bar-track">
        <span className="bm-bar-fill" style={{ width: `${pct}%` }} />
      </span>
      <span className="bm-bar-value">{value}</span>
    </div>
  );
}

/* A real two-state control.

   Buttons with radio semantics rather than a checkbox or a styled div: both
   states are named and visible at once, which a checkbox cannot do, and the
   arrow keys move between them the way a radio group is expected to behave.
   Roving tabindex keeps the group a single tab stop, so a keyboard reader
   moving through the page does not have to pass through every option. */
function Choice({ legend, options, value, onChange }) {
  const refs = React.useRef([]);
  const at = options.findIndex((o) => o.id === value);

  const move = (delta) => {
    const next = (at + delta + options.length) % options.length;
    onChange(options[next].id);
    const el = refs.current[next];
    if (el && el.focus) el.focus();
  };

  const onKeyDown = (e) => {
    if (e.key === "ArrowRight" || e.key === "ArrowDown") { e.preventDefault(); move(1); }
    else if (e.key === "ArrowLeft" || e.key === "ArrowUp") { e.preventDefault(); move(-1); }
    else if (e.key === "Home") { e.preventDefault(); move(-at); }
    else if (e.key === "End") { e.preventDefault(); move(options.length - 1 - at); }
  };

  return (
    <div className="bm-choice" role="radiogroup" aria-label={legend}>
      {/* The legend is repeated to the group as aria-label above, so the
          visible copy is hidden from assistive technology to stop it being
          announced twice. */}
      <span className="bm-choice-legend" aria-hidden="true">{legend}</span>
      <div className="bm-opts">
        {options.map((o, n) => (
          <button
            key={o.id}
            type="button"
            role="radio"
            aria-checked={o.id === value}
            tabIndex={o.id === value ? 0 : -1}
            ref={(el) => { refs.current[n] = el; }}
            className={"bm-opt" + (o.id === value ? " is-on" : "")}
            onClick={() => onChange(o.id)}
            onKeyDown={onKeyDown}
          >
            <span className="bm-opt-label">{o.label}</span>
            <span className="bm-opt-hint">{o.hint}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
