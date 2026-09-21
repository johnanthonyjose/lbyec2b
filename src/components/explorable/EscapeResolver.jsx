import React from "react";
import { useScrub, ScrubBar, Explorable } from "./Scrub.jsx";

/* Escape sequences in a path, for the File I/O handout, step S1.3.

   This figure exists because the handout it belongs to once shipped the bug in
   its own examples. A student types "c:\temp\data.txt", the program compiles,
   nothing is printed, the exit status is zero, and an hour goes into looking
   for a missing file that the program never asked the operating system for.
   Sixteen characters were typed and fourteen were delivered: the backslash is
   not a character in C source, it is the start of an escape sequence, and the
   compiler resolves it long before fopen is ever called.

   Prose can state that. What prose cannot do is make the loss countable. Two
   characters do not change, they VANISH, and the argument the figure has to
   win is that the reader can point at the two cells that are gone. So the two
   rows are drawn on one grid of typed columns: the delivered row is filled
   from the left, it stops short, and the empty slots at its end are the
   missing characters, marked and labelled rather than merely absent.

   The second thing the figure has to carry is the cruelty of the asymmetry.
   \t is a VALID escape, so the compiler accepts it without a word; \d is not,
   so the compiler warns. The more broken string is therefore the one that
   compiles in silence, and a student who reads a clean build as evidence that
   the path is fine has been misled by the toolchain. That is why the compiler
   verdict is a panel of its own and not a line in the caption.

   NOTHING HERE IS RESOLVED AT RUNTIME. A JavaScript string literal has its own
   escape rules, and if this file wrote the C source as a JavaScript string the
   figure would be showing JavaScript's answer to a question about C. Every C
   string below is therefore an ARRAY of one-character strings, the backslash
   comes from the named constant BS, and the tab is a marker object that is
   never a real control character. The delivered characters and their decimal
   values are authored from the measured table in the course notes: the strings
   were compiled with clang and printed byte by byte, and those numbers are
   copied here rather than recomputed. */

/* One backslash. JavaScript needs two characters in a literal to write it, and
   that is exactly the confusion this figure is about, so it is named once here
   and never written inline again. */
const BS = "\\";

/* The tab a valid \t escape delivers. Held as a marker, never as a real tab
   character: a literal tab in the DOM would collapse into ordinary whitespace
   and the one byte the reader is meant to see would disappear. */
const TAB = { glyph: "⇥", name: "TAB", dec: 9, control: true };

/* An ordinary character, typed as itself and delivered as itself. */
function plain(ch, dec) {
  return {
    typed: [ch],
    out: { glyph: ch, name: ch, dec },
    kind: "plain",
    say: `The character ${ch} is not special. One typed character, one delivered character.`
  };
}

/* An escape sequence: two typed characters, one delivered character. `kind` is
   "valid" when the compiler accepts it silently and "invalid" when it warns,
   because that difference is the trap and it has to travel with the data. */
function escape(second, out, kind, say) {
  return { typed: [BS, second], out, kind, say };
}

const SEQ_C = { glyph: BS, name: "backslash", dec: 92 };
const SEQ_D = { glyph: "d", name: "d", dec: 100 };

/* ---- the four sources, from the measured table --------------------------
   "c:\temp\test1.txt"   -> 15: 99 58 9 101 109 112 9 101 115 116 49 46 116 120 116
   "c:\temp\data.txt"    -> 14: 99 58 9 101 109 112 100 97 116 97 46 116 120 116
   "c:\\temp\\data.txt"  -> 16: c : \ t e m p \ d a t a . t x t
   "c:/temp/data.txt"    -> 16: c : / t e m p / d a t a . t x t              */

const SOURCES = [
  {
    id: "two-tabs",
    hint: "15 delivered, two tabs",
    typedLength: 17,
    deliveredLength: 15,
    groups: [
      plain("c", 99),
      plain(":", 58),
      escape("t", TAB, "valid",
        "Backslash t is a valid escape. Two typed characters become one tab, decimal 9, and the compiler says nothing at all."),
      plain("e", 101),
      plain("m", 109),
      plain("p", 112),
      escape("t", TAB, "valid",
        "The second backslash t, and a second tab. Both separators the path needed are now tab characters instead."),
      plain("e", 101),
      plain("s", 115),
      plain("t", 116),
      plain("1", 49),
      plain(".", 46),
      plain("t", 116),
      plain("x", 120),
      plain("t", 116)
    ],
    compiler: {
      warned: false,
      verdict: "Compiles in silence",
      line: "No diagnostic. Backslash t is a valid escape, so the compiler has nothing to report.",
      spoken: "The compiler issued no warning, because backslash t is a valid escape."
    },
    spoken: "c, colon, a tab character, e, m, p, a tab character, e, s, t, 1, period, t, x, t",
    exists: {
      ok: false,
      line: "No. Two directory separators have become tab characters, so no such path exists and fopen returns NULL.",
      spoken: "no such path can exist, and fopen returns NULL"
    }
  },

  {
    id: "one-tab",
    hint: "14 delivered, warns",
    typedLength: 16,
    deliveredLength: 14,
    groups: [
      plain("c", 99),
      plain(":", 58),
      escape("t", TAB, "valid",
        "Backslash t is a valid escape. Two typed characters become one tab, decimal 9, and the compiler says nothing at all."),
      plain("e", 101),
      plain("m", 109),
      plain("p", 112),
      escape("d", SEQ_D, "invalid",
        "Backslash d is not an escape. The compiler warns, discards the backslash, and delivers a plain d."),
      plain("a", 97),
      plain("t", 116),
      plain("a", 97),
      plain(".", 46),
      plain("t", 116),
      plain("x", 120),
      plain("t", 116)
    ],
    compiler: {
      warned: true,
      verdict: "Warns, about the lesser fault",
      line: `warning: unknown escape sequence '${BS}d'. It says nothing about ${BS}t, which did the greater damage.`,
      spoken: "The compiler warned about backslash d, and said nothing about backslash t, which did the greater damage."
    },
    spoken: "c, colon, a tab character, e, m, p, d, a, t, a, period, t, x, t",
    exists: {
      ok: false,
      line: "No. One separator is a tab and the other was dropped, so no such path exists and fopen returns NULL.",
      spoken: "no such path can exist, and fopen returns NULL"
    }
  },

  {
    id: "doubled",
    hint: "16 delivered, correct",
    typedLength: 18,
    deliveredLength: 16,
    groups: [
      plain("c", 99),
      plain(":", 58),
      escape(BS, SEQ_C, "valid",
        "Backslash backslash is the escape for one backslash. Two typed characters deliver the single separator the path needs."),
      plain("t", 116),
      plain("e", 101),
      plain("m", 109),
      plain("p", 112),
      escape(BS, SEQ_C, "valid",
        "The second doubled backslash delivers the second separator. Two characters are still spent to obtain one."),
      plain("d", 100),
      plain("a", 97),
      plain("t", 116),
      plain("a", 97),
      plain(".", 46),
      plain("t", 116),
      plain("x", 120),
      plain("t", 116)
    ],
    compiler: {
      warned: false,
      verdict: "Compiles in silence, and correctly",
      line: "No diagnostic, and here the silence is earned: every escape was intended and every one was resolved as written.",
      spoken: "The compiler issued no warning, and here the silence is earned."
    },
    spoken: "c, colon, backslash, t, e, m, p, backslash, d, a, t, a, period, t, x, t",
    exists: {
      ok: true,
      line: "Yes. This is the Windows path that was meant, and fopen can open it.",
      spoken: "this path can exist on Windows, and fopen can open it"
    }
  },

  {
    id: "forward",
    hint: "16 delivered, portable",
    typedLength: 16,
    deliveredLength: 16,
    groups: [
      plain("c", 99),
      plain(":", 58),
      plain("/", 47),
      plain("t", 116),
      plain("e", 101),
      plain("m", 109),
      plain("p", 112),
      plain("/", 47),
      plain("d", 100),
      plain("a", 97),
      plain("t", 116),
      plain("a", 97),
      plain(".", 46),
      plain("t", 116),
      plain("x", 120),
      plain("t", 116)
    ],
    compiler: {
      warned: false,
      verdict: "Nothing to resolve",
      line: "No diagnostic, and no escape sequence anywhere. The forward slash is an ordinary character in C source.",
      spoken: "The compiler issued no warning, and there is no escape sequence anywhere in the string."
    },
    spoken: "c, colon, slash, t, e, m, p, slash, d, a, t, a, period, t, x, t",
    exists: {
      ok: true,
      line: "Yes. Windows accepts forward slashes, and the same string is a valid path on Linux and macOS.",
      spoken: "this path can exist, and it is the portable form"
    }
  }
];

/* The C source, rebuilt from the typed characters rather than written out as a
   JavaScript literal. Every character in it was authored one at a time above,
   so joining them cannot reinterpret anything. */
function quoted(source) {
  const inner = source.groups.reduce((acc, g) => acc.concat(g.typed), []);
  return `"${inner.join("")}"`;
}

const OPTIONS = SOURCES.map((s) => ({ id: s.id, label: quoted(s), hint: s.hint }));

/* How many typed characters have been read once `k` groups are resolved. The
   count is arithmetic over authored data, never a re-resolution of the string:
   the measured totals are carried on each source and displayed as the target. */
function typedRead(source, k) {
  let n = 0;
  for (let i = 0; i < k; i++) n += source.groups[i].typed.length;
  return n;
}

export function EscapeResolver({ caption }) {
  const [id, setId] = React.useState(SOURCES[0].id);
  const source = SOURCES.find((s) => s.id === id) || SOURCES[0];

  /* Frame 0 is the string as typed, with nothing resolved yet, and each frame
     after it resolves exactly one group. An escape group is one frame, which
     is what lets the reader stop on the backslash and watch two cells become
     one instead of catching it in passing. */
  const scrub = useScrub(source.groups.length + 1);
  const resolved = Math.min(scrub.index, source.groups.length);
  const read = typedRead(source, resolved);
  const group = resolved === 0 ? null : source.groups[resolved - 1];

  const src = quoted(source);
  const lost = source.typedLength - source.deliveredLength;

  /* The flat lists the two rows draw. Both are authored data rearranged, and
     both are laid out on the same grid of typed columns so that the delivered
     row stopping short is a distance the reader can measure. */
  const typedCells = [];
  source.groups.forEach((g, gi) => {
    g.typed.forEach((ch, ci) => {
      typedCells.push({
        ch,
        group: gi,
        kind: g.kind,
        part: g.kind === "plain" ? "single" : ci === 0 ? "lead" : "tail"
      });
    });
  });

  const step = resolved === 0
    ? `Nothing has been resolved yet. The compiler has read none of the ${source.typedLength} characters between the quotation marks.`
    : `${group.say}`;

  /* The drawing is aria-hidden, so this sentence has to carry everything it
     carries: which source, where the reader is, what the compiler said, what
     fopen is handed, and whether that path can exist. */
  const status =
    `C source ${src}. Step ${resolved + 1} of ${source.groups.length + 1}. ` +
    `${step} ` +
    `Read ${read} of ${source.typedLength} typed characters; delivered ` +
    `${resolved} of ${source.deliveredLength}. ` +
    `${lost === 0
      ? "Nothing is lost: every typed character is delivered."
      : `${lost} typed characters are consumed and never delivered.`} ` +
    `${source.compiler.spoken} ` +
    `fopen receives ${source.spoken}, and ${source.exists.spoken}.`;

  return (
    <Explorable
      title="What the compiler does to your path"
      notice="Watch two typed cells become one, and the lower row stop short."
      caption={caption}
      status={status}
    >
      <Choice
        legend="The string in your C source"
        options={OPTIONS}
        value={id}
        onChange={setId}
      />

      <div className="er-figure" aria-hidden="true">
        {/* Wide by nature, so it scrolls inside itself. Not focusable: it sits
            inside the aria-hidden drawing, and a focus stop inside a hidden
            subtree is a trap rather than a convenience. */}
        <div className="er-scroll ex-scroll">
          <div className="er-rows">
            <RowLabel
              title="What you typed"
              meta={`${read} of ${source.typedLength} read`}
            />
            <div
              className="er-row er-row-typed"
              style={{ "--er-cols": source.typedLength }}
            >
              {typedCells.map((cell, n) => (
                <span
                  key={n}
                  className={
                    "er-cell" +
                    (n < read ? " is-read" : " is-unread") +
                    (cell.kind === "plain" ? "" : " is-esc") +
                    (cell.kind === "invalid" ? " is-bad" : "") +
                    (cell.part === "lead" ? " is-lead" : "") +
                    (cell.part === "tail" ? " is-tail" : "") +
                    (group && cell.group === resolved - 1 ? " is-now" : "")
                  }
                >
                  <span className="er-glyph">{cell.ch}</span>
                  <span className="er-tick">{n}</span>
                </span>
              ))}
            </div>

            {/* The band between the rows names what the escapes cost, which is
                the one thing two rows of cells cannot say by themselves. */}
            <p className="er-between">
              {lost === 0
                ? "No escape sequences. Every typed character survives."
                : `${lost} typed characters are swallowed by escape sequences and never reach fopen.`}
            </p>

            <RowLabel
              title="What the compiler delivered"
              meta={`${resolved} of ${source.deliveredLength} delivered`}
            />
            <div
              className="er-row er-row-out"
              style={{ "--er-cols": source.typedLength }}
            >
              {source.groups.map((g, n) => (
                <span
                  key={n}
                  className={
                    "er-cell er-out" +
                    (n < resolved ? " is-out" : " is-pending") +
                    (g.kind === "plain" ? "" : " is-from-esc") +
                    (g.out.control ? " is-control" : "") +
                    (n === resolved - 1 ? " is-now" : "")
                  }
                >
                  <span className="er-glyph">
                    {n < resolved ? g.out.glyph : ""}
                  </span>
                  <span className="er-tick">
                    {n < resolved ? g.out.dec : ""}
                  </span>
                </span>
              ))}

              {/* The missing characters. Drawn as real slots rather than left
                  out, because a reader cannot point at an absence. */}
              {Array.from({ length: lost }, (_, n) => (
                <span key={`gone-${n}`} className="er-cell er-gone">
                  <span className="er-glyph">✕</span>
                  <span className="er-tick">gone</span>
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="er-counts">
          <Count label="Typed" value={source.typedLength} tone="typed" />
          <Count label="Delivered" value={source.deliveredLength} tone="out" />
          <Count label="Lost" value={lost} tone={lost === 0 ? "none" : "lost"} />
        </div>

        {/* The two verdicts. The compiler's, because the silence is the trap;
            and the operating system's, because that is the one that decides
            whether the program works. */}
        <div className="er-verdicts">
          <div
            className={
              "er-verdict" + (source.compiler.warned ? " is-warn" : " is-quiet")
            }
          >
            <span className="er-verdict-head">
              <span className="er-verdict-mark">
                {source.compiler.warned ? "△" : "—"}
              </span>
              The compiler: {source.compiler.verdict}
            </span>
            <span className="er-verdict-body">{source.compiler.line}</span>
          </div>

          <div
            className={"er-verdict" + (source.exists.ok ? " is-ok" : " is-bad")}
          >
            <span className="er-verdict-head">
              <span className="er-verdict-mark">
                {source.exists.ok ? "✓" : "✕"}
              </span>
              fopen receives
            </span>
            <span className="er-verdict-path">
              <span className="er-quote">&quot;</span>
              {source.groups.map((g, n) => (
                <span
                  key={n}
                  className={"er-path-ch" + (g.out.control ? " is-control" : "")}
                >
                  {g.out.glyph}
                </span>
              ))}
              <span className="er-quote">&quot;</span>
            </span>
            <span className="er-verdict-body">{source.exists.line}</span>
          </div>
        </div>

        <p className="er-say">{step}</p>
      </div>

      <ScrubBar
        scrub={scrub}
        label="the string"
        status={status}
        unit="character"
      />
    </Explorable>
  );
}

function RowLabel({ title, meta }) {
  return (
    <div className="er-row-label">
      {title}
      <span className="er-row-meta">{meta}</span>
    </div>
  );
}

/* The three numbers, side by side. The lesson is a subtraction, and a reader
   should not have to perform it from two counts in two different places. */
function Count({ label, value, tone }) {
  return (
    <span className={`er-count er-tone-${tone}`}>
      <span className="er-count-value">{value}</span>
      <span className="er-count-label">{label}</span>
    </span>
  );
}

/* The source selector, built the way BufferMachine builds its mode control:
   buttons with radio semantics, every option named and visible at once, arrow
   keys moving between them, and a roving tabindex so the group is a single tab
   stop for a reader passing through the page. */
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
    <div className="er-choice" role="radiogroup" aria-label={legend}>
      {/* The legend is already on the group as aria-label, so the visible copy
          is hidden to stop it being announced twice. */}
      <span className="er-choice-legend" aria-hidden="true">{legend}</span>
      <div className="er-opts">
        {options.map((o, n) => (
          <button
            key={o.id}
            type="button"
            role="radio"
            aria-checked={o.id === value}
            tabIndex={o.id === value ? 0 : -1}
            ref={(el) => { refs.current[n] = el; }}
            className={"er-opt" + (o.id === value ? " is-on" : "")}
            onClick={() => onChange(o.id)}
            onKeyDown={onKeyDown}
          >
            <span className="er-opt-label">{o.label}</span>
            <span className="er-opt-hint">{o.hint}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
