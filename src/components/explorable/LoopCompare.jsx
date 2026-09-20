import React from "react";
import { useScrub, ScrubBar, Explorable } from "./Scrub.jsx";

/* The read loop that runs one time too many.

   Step 4.3 of the handout spends nearly seven hundred words on a single fault:
   `while (!feof(fp))` processes the last record twice. Those words are being
   deleted, so this figure has to teach the fault on its own, to a reader who
   has not been told what to look for.

   The fault is not visible in either loop read by itself. Both look reasonable;
   the wrong one arguably reads better in English. What distinguishes them is
   *when* each one asks its question relative to the read, and a difference in
   timing cannot be shown in a static listing. So the figure runs both loops at
   once on the same file, moved by one timeline, and the reader watches them
   agree three times and then come apart on the fourth.

   The design rests on that simultaneity. Two separate figures, or one figure
   with a toggle between the loops, would ask the reader to hold one loop's
   fourth iteration in memory while studying the other's; the whole point is
   that the two fourth iterations differ, and a comparison a reader has to
   perform from memory is a comparison most readers will not perform.

   Three things are drawn for each loop at every frame because all three are
   needed and only one of them is normally visible: which source line is
   executing, what the `line` buffer holds, and the state of the stream's
   end-of-file indicator. The indicator is the hidden term. Students believe it
   means "the next read will fail". It means "a read has already failed". The
   figure makes that legible by showing it still clear at the exact frame where
   the wrong loop tests it, and set only one frame later, after the read.

   The component knows no C. Every frame below was authored against the real
   output of both loops compiled and run on a file of three lines ending in a
   newline: the wrong loop prints one, two, three, three; the right loop prints
   one, two, three. Simulating fgets here would put a second, unverified
   implementation of C in front of students, and where it disagreed with the
   compiler the students would believe the screen. */

/* The newline is drawn, not turned into a line break, for the same reason the
   file figure draws it: a buffer holding "three\n" and a buffer holding
   "three" behave differently here, and that difference is the subject of the
   footnote at the bottom of this figure. Rendered as nothing, the byte would
   look like it was not there. */
const NEWLINE_MARK = "¶";

const WRONG_SRC = [
  "while (!feof(fp)) {",
  "    fgets(line, 100, fp);",
  "    printf(\"%s\", line);",
  "}"
];

const RIGHT_SRC = [
  "while (fgets(line, 100, fp) != NULL) {",
  "    printf(\"%s\", line);",
  "}"
];

/* The output accumulates, so it is built up once rather than retyped into
   thirteen frames, where a typo would be invisible to review. */
const OUT_0 = [];
const OUT_1 = [{ text: "one" }];
const OUT_2 = [{ text: "one" }, { text: "two" }];
const OUT_3 = [{ text: "one" }, { text: "two" }, { text: "three" }];
const OUT_4_WRONG = [
  { text: "one" },
  { text: "two" },
  { text: "three" },
  { text: "three", repeat: true }
];

const NOT_SET = "not set yet";

/* Each frame is one beat. An iteration is three beats — test the condition,
   perform the read, print — and both loops are shown at the same beat, which
   is what lets the reader read across the two panels rather than down one.

   The right-hand loop does its test and its read on the same source line, so
   at the "test" beat it is sitting on that line with the read not yet made,
   and at the "read" beat the same line has both read and decided. That is not
   a fudge to make the beats line up; it is precisely the property that makes
   the loop correct, and the two beats sharing one line says so. */
const FRAMES = [
  /* ---- iteration 1 ------------------------------------------------- */
  {
    beat: "Test the condition",
    iter: 1,
    wrong: {
      line: 0,
      act: "feof(fp) asks the indicator. It is clear, so the loop is entered.",
      buf: NOT_SET, eof: false, out: OUT_0
    },
    right: {
      line: 0,
      act: "Sitting on the condition. The read has not happened yet.",
      buf: NOT_SET, eof: false, out: OUT_0
    }
  },
  {
    beat: "The read happens",
    iter: 1,
    wrong: {
      line: 1,
      act: "fgets succeeds and stores the first line.",
      buf: "one" + NEWLINE_MARK, eof: false, out: OUT_0
    },
    right: {
      line: 0,
      act: "fgets succeeds. It returned a pointer, not NULL, so the body runs.",
      buf: "one" + NEWLINE_MARK, eof: false, out: OUT_0
    }
  },
  {
    beat: "Print",
    iter: 1,
    wrong: {
      line: 2, act: "printf writes whatever the buffer holds.",
      buf: "one" + NEWLINE_MARK, eof: false, out: OUT_1
    },
    right: {
      line: 1, act: "printf writes whatever the buffer holds.",
      buf: "one" + NEWLINE_MARK, eof: false, out: OUT_1
    }
  },

  /* ---- iteration 2 ------------------------------------------------- */
  {
    beat: "Test the condition",
    iter: 2,
    wrong: {
      line: 0, act: "The indicator is clear. The loop is entered again.",
      buf: "one" + NEWLINE_MARK, eof: false, out: OUT_1
    },
    right: {
      line: 0, act: "Back on the condition. The read has not happened yet.",
      buf: "one" + NEWLINE_MARK, eof: false, out: OUT_1
    }
  },
  {
    beat: "The read happens",
    iter: 2,
    wrong: {
      line: 1, act: "fgets succeeds and overwrites the buffer.",
      buf: "two" + NEWLINE_MARK, eof: false, out: OUT_1
    },
    right: {
      line: 0, act: "fgets succeeds. Not NULL, so the body runs.",
      buf: "two" + NEWLINE_MARK, eof: false, out: OUT_1
    }
  },
  {
    beat: "Print",
    iter: 2,
    wrong: {
      line: 2, act: "printf writes the buffer.",
      buf: "two" + NEWLINE_MARK, eof: false, out: OUT_2
    },
    right: {
      line: 1, act: "printf writes the buffer.",
      buf: "two" + NEWLINE_MARK, eof: false, out: OUT_2
    }
  },

  /* ---- iteration 3: the last successful read ------------------------ */
  {
    beat: "Test the condition",
    iter: 3,
    wrong: {
      line: 0, act: "The indicator is clear. The loop is entered again.",
      buf: "two" + NEWLINE_MARK, eof: false, out: OUT_2
    },
    right: {
      line: 0, act: "Back on the condition. The read has not happened yet.",
      buf: "two" + NEWLINE_MARK, eof: false, out: OUT_2
    }
  },
  {
    beat: "The read happens",
    iter: 3,
    wrong: {
      line: 1,
      act: "fgets succeeds and takes the last line, newline and all. It stops at that newline, so it never touches the end of the file.",
      buf: "three" + NEWLINE_MARK, eof: false, out: OUT_2
    },
    right: {
      line: 0,
      act: "The same read, with the same result. Not NULL, so the body runs.",
      buf: "three" + NEWLINE_MARK, eof: false, out: OUT_2
    }
  },
  {
    beat: "Print",
    iter: 3,
    wrong: {
      line: 2, act: "printf writes the buffer. Every line of the file has now been printed once.",
      buf: "three" + NEWLINE_MARK, eof: false, out: OUT_3
    },
    right: {
      line: 1, act: "printf writes the buffer. Every line of the file has now been printed once.",
      buf: "three" + NEWLINE_MARK, eof: false, out: OUT_3
    }
  },

  /* ---- iteration 4: where they come apart ---------------------------- */
  {
    beat: "Test the condition",
    iter: 4,
    moment:
      "The file has been read to the end, but nothing has failed yet — so the indicator is still clear, and the wrong loop is entered a fourth time.",
    wrong: {
      line: 0,
      act: "feof(fp) asks the indicator and finds it CLEAR, because no read has failed yet. The loop is entered a fourth time.",
      buf: "three" + NEWLINE_MARK, eof: false, out: OUT_3, alarm: true
    },
    right: {
      line: 0,
      act: "Sitting on the condition. It has nothing to go on until the read is made, so it makes the read.",
      buf: "three" + NEWLINE_MARK, eof: false, out: OUT_3
    }
  },
  {
    beat: "The read happens",
    iter: 4,
    moment:
      "The fourth read fails, and only NOW is the indicator set — one beat after the wrong loop tested it. A failed read leaves the buffer alone, so it still holds the previous line.",
    wrong: {
      line: 1,
      act: "fgets fails and returns NULL. The indicator is set now. The return value is thrown away, and the failed read left the buffer untouched.",
      buf: "three" + NEWLINE_MARK, eof: true, stale: true, out: OUT_3, alarm: true
    },
    right: {
      line: 0,
      act: "The same fgets fails and returns NULL. The condition tests that NULL and is false, so the body is skipped and the loop ends here.",
      buf: "three" + NEWLINE_MARK, eof: true, stale: true, out: OUT_3, done: true
    }
  },
  {
    beat: "Print",
    iter: 4,
    moment:
      "There it is. The wrong loop prints a fourth line that was never read. The right loop has already stopped.",
    wrong: {
      line: 2,
      act: "printf runs anyway, on a buffer nothing refreshed, and prints the previous line a second time.",
      buf: "three" + NEWLINE_MARK, eof: true, stale: true, out: OUT_4_WRONG, alarm: true
    },
    right: {
      line: -1,
      act: "The loop has ended. This line never runs a fourth time.",
      buf: "three" + NEWLINE_MARK, eof: true, stale: true, out: OUT_3, done: true
    }
  },

  /* ---- the finished run --------------------------------------------- */
  {
    beat: "Both loops have finished",
    iter: 4,
    moment:
      "Four lines out of a three-line file. The duplicate is the whole fault, and it came from testing the indicator before the read instead of testing the read itself.",
    wrong: {
      line: 3,
      act: "The next test finally sees the indicator set, and the loop ends. It printed four lines from a file of three.",
      buf: "three" + NEWLINE_MARK, eof: true, stale: true, out: OUT_4_WRONG, alarm: true, done: true
    },
    right: {
      line: 2,
      act: "Already finished, one beat earlier, having printed three lines from a file of three.",
      buf: "three" + NEWLINE_MARK, eof: true, stale: true, out: OUT_3, done: true
    }
  }
];

/* The sentence equivalent of the drawing. It carries every fact the two panels
   carry — beat, source line, buffer, indicator, output so far, for both loops —
   because a reader who is not getting the panels has no second source for any
   of it. */
function describe(frame, index) {
  const side = (s, src, name) => {
    const where = s.line < 0
      ? "is not executing any line"
      : `is on the line ${JSON.stringify(src[s.line].trim())}`;
    const printed = s.out.length === 0
      ? "nothing printed yet"
      : `printed so far: ${s.out.map((o) => o.text + (o.repeat ? " (a repeat)" : "")).join(", ")}`;
    const buffer = s.buf === NOT_SET
      ? "the line buffer is not set yet"
      : `the line buffer holds ${JSON.stringify(s.buf.replace(NEWLINE_MARK, ""))} followed by a newline`
        + (s.stale ? ", left over from the previous read" : "");
    return `${name} loop ${where}; ${buffer}; the end-of-file indicator is ${s.eof ? "set" : "clear"}; ${printed}.`;
  };

  return [
    `Beat ${index + 1} of ${FRAMES.length}. ${frame.beat}, iteration ${frame.iter}.`,
    side(frame.wrong, WRONG_SRC, "Wrong"),
    side(frame.right, RIGHT_SRC, "Right"),
    frame.moment || ""
  ].filter(Boolean).join(" ");
}

export function LoopCompare({ caption }) {
  const scrub = useScrub(FRAMES.length);
  const frame = FRAMES[Math.min(scrub.index, FRAMES.length - 1)];
  const status = describe(frame, scrub.index);

  return (
    <Explorable
      title="Two read loops, one file"
      notice="Watch iteration 4: the indicator is still clear when the wrong loop tests it"
      status={status}
      caption={caption || DEFAULT_CAPTION}
    >
      {/* The drawing repeats, glyph by glyph, what `status` says in one
          sentence, so it is hidden from assistive technology rather than
          announced twice in a form nobody can follow. */}
      <div className="lc" aria-hidden="true">
        <div className="lc-file">
          <span className="lc-file-label">The input file</span>
          <code className="lc-file-bytes">
            one<span className="lc-nl">{NEWLINE_MARK}</span>
            two<span className="lc-nl">{NEWLINE_MARK}</span>
            three<span className="lc-nl">{NEWLINE_MARK}</span>
          </code>
          <span className="lc-file-note">
            Three lines, and the last one ends with a newline. {NEWLINE_MARK} is one newline byte.
          </span>
        </div>

        <p className="lc-beat">
          <span className="lc-beat-n">Beat {scrub.index + 1} of {FRAMES.length}</span>
          <span className="lc-beat-name">{frame.beat}</span>
          <span className="lc-beat-iter">iteration {frame.iter}</span>
        </p>

        {/* The two panels are identical in shape — same rows, same order, same
            widths — so that any difference the reader sees between them is a
            difference in the loops and not a difference in the drawing. */}
        <div className="lc-pair">
          <Loop side="wrong" verdict="Wrong" src={WRONG_SRC} state={frame.wrong} />
          <Loop side="right" verdict="Right" src={RIGHT_SRC} state={frame.right} />
        </div>

        {/* The divergence has to be unmissable and it has to be said in words,
            not left as a shape the reader is expected to interpret. The banner
            is keyed on the frame so it replays its entrance on each new beat
            that carries one. */}
        {frame.moment && (
          <p className="lc-moment" key={scrub.index}>
            <span className="lc-moment-label">What just happened</span>
            {frame.moment}
          </p>
        )}

        {/* Stated in the figure itself, not only in the caption, because it is
            the one thing that would otherwise make a student conclude the
            handout was wrong when their own file did not misbehave. */}
        <p className="lc-footnote">
          This depends on the file ending with a newline. If the last line has no
          trailing newline, the third read itself reaches the end of the file and
          sets the indicator, the wrong loop's fourth test sees it set, and the
          duplicate never appears. The fault does not go away — it only hides.
          That is why the condition, not the file, is what has to be fixed.
        </p>
      </div>

      <ScrubBar scrub={scrub} label="both read loops" status={status} unit="beat" />
    </Explorable>
  );
}

/* The caption is the only part of the figure an assistive technology reader
   meets outside the announced status line, so the trailing-newline condition is
   stated here as well as in the drawing's footnote. It is not a detail: a
   student whose own file lacks the final newline will see three lines from the
   wrong loop and conclude the handout is mistaken. */
const DEFAULT_CAPTION =
  "Both loops, run on the same three-line file and moved by one timeline. They agree "
  + "for three iterations. On the fourth, the wrong loop tests an indicator that is still "
  + "clear, enters, reads nothing, and prints the previous line a second time — four lines "
  + "of output from a file of three. This particular file ends with a newline. On a file "
  + "whose last line has no trailing newline, the third read reaches the end of the file "
  + "itself and sets the indicator, so the wrong loop's fourth test sees it set and the "
  + "duplicate never appears. The fault is still there; it is only hidden, and it is the "
  + "condition rather than the file that has to be fixed.";

/* One loop's panel. Everything that carries meaning also carries a word or a
   glyph: the executing line is marked with a caret as well as a tint, the
   indicator reads "clear" or "set" in text, the duplicated output line is
   labelled "printed twice". Nothing here is legible by color alone. */
function Loop({ side, verdict, src, state }) {
  return (
    <section className={`lc-loop lc-loop-${side}`}>
      <header className="lc-loop-head">
        <span className={`lc-verdict lc-verdict-${side}`}>{verdict}</span>
        <span className="lc-loop-name">
          {side === "wrong" ? "loops on feof" : "loops on the read"}
        </span>
      </header>

      <div className="lc-code ex-scroll">
        {src.map((text, n) => {
          const here = n === state.line;
          return (
            <div className={`lc-line${here ? " is-here" : ""}`} key={n}>
              <span className="lc-caret">{here ? "▸" : " "}</span>
              <code className="lc-src">{text}</code>
            </div>
          );
        })}
        {state.line < 0 && (
          <div className="lc-line is-skipped">
            <span className="lc-caret">{" "}</span>
            <code className="lc-src">(the loop has ended)</code>
          </div>
        )}
      </div>

      <p className="lc-act">{state.act}</p>

      <dl className="lc-state">
        <dt>line buffer</dt>
        <dd>
          <code className={`lc-buf${state.stale ? " is-stale" : ""}`}>
            {state.buf === NOT_SET
              ? <span className="lc-empty">not set yet</span>
              : state.buf.split(NEWLINE_MARK).map((part, n) => (
                  <React.Fragment key={n}>
                    {part}
                    {n === 0 && <span className="lc-nl">{NEWLINE_MARK}</span>}
                  </React.Fragment>
                ))}
          </code>
          {state.stale && <span className="lc-tag">unchanged by the failed read</span>}
        </dd>

        <dt>end-of-file indicator</dt>
        <dd>
          <span className={`lc-flag${state.eof ? " is-set" : ""}`}>
            <span className="lc-flag-dot">{state.eof ? "■" : "□"}</span>
            {state.eof ? "set" : "clear"}
          </span>
          {state.eof
            ? <span className="lc-tag">a read has already failed</span>
            : <span className="lc-tag">no read has failed yet</span>}
        </dd>
      </dl>

      <div className="lc-out">
        <span className="lc-out-label">
          Output so far{state.done ? " · finished" : ""}
        </span>
        {state.out.length === 0
          ? <span className="lc-empty">nothing printed yet</span>
          : state.out.map((row, n) => (
              <span className={`lc-out-row${row.repeat ? " is-repeat" : ""}`} key={n}>
                <span className="lc-out-text">{row.text}</span>
                {row.repeat && <span className="lc-out-mark">printed twice</span>}
              </span>
            ))}
      </div>
    </section>
  );
}
