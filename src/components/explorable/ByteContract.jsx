import React from "react";
import { useScrub, ScrubBar, Explorable } from "./Scrub.jsx";

/* Text and binary, for the File I/O handout.

   This figure replaces the largest block of prose in stage 1 — four hundred
   words that ask the reader to imagine a file as a sequence of bytes and then
   assert, without showing it, that text and binary are two CONTRACTS under
   which a program may read that sequence, and that nothing stored inside the
   file records which contract was intended.

   The assertion is the part prose cannot win. A student who has only ever
   opened .txt files in Notepad believes, reasonably, that a text file is a
   different KIND of thing from a program. So the figure refuses to argue and
   simply shows one row of real bytes with both readings stacked against it at
   the same time. Not one reading with a toggle: a toggle would let the reader
   conclude that the file changed when the view changed, which is the exact
   misconception being corrected. Both readings are on screen at once, drawn
   against the same columns, so that "the bytes did not change, the reading
   did" is something the reader sees rather than something they are told.

   The compiled program is in the source list for one reason beyond showing the
   text contract failing. Under the binary contract its first four bytes are not
   noise at all: CF FA ED FE is a magic number that identifies the format. The
   step's rationale already mentions magic numbers, and this is the one place in
   the handout where a reader can look at one, so the four bytes are bracketed
   and named. The PNG is offered as a second magic number because three of its
   four bytes are the printable letters P, N and G, which makes the point that
   printability is a property of the value and not of the file's kind.

   Every byte below is authored data, captured by running real programs on the
   course machine and recorded in the stage brief. Nothing here reads a file,
   decodes a character or derives a bit pattern at render time. A second,
   unverified implementation of a character set on screen would be the one the
   students believed. */

/* The substitution mark. A byte with no printable character is drawn as the
   empty box a text editor puts there — the mark a reader has met before,
   under the name they have met it under. */
const NONE = "▯";

/* The one claim the figure exists to land. Kept as a constant because it is
   said twice, in the permanent line under the drawing and in the spoken
   status, and the two must not drift apart. */
const CLAIM =
  "The file contains no field that says which contract to use. The extension " +
  "claims one, and nothing inside the bytes enforces the claim.";

/* ── The bytes ────────────────────────────────────────────────────────────

   Per byte: its decimal value, its hexadecimal value, its eight bits, the
   character the text contract assigns it (`ch`, or null when it assigns none),
   the name a reader can say out loud for a character with no visible shape,
   and `binary`, what the byte means to the application that wrote the file.

   `ch` is the text contract's verdict and `printable` is the same verdict
   stated as a fact, because the drawing needs both: one to show and one to
   mark. They are authored together so they cannot disagree. */

const TEXT_BYTES = [
  { dec: 104, hex: "68", bits: "01101000", ch: "h", printable: true, binary: "a byte whose value happens to be 104" },
  { dec: 101, hex: "65", bits: "01100101", ch: "e", printable: true, binary: "a byte whose value happens to be 101" },
  { dec: 108, hex: "6C", bits: "01101100", ch: "l", printable: true, binary: "a byte whose value happens to be 108" },
  { dec: 108, hex: "6C", bits: "01101100", ch: "l", printable: true, binary: "a byte whose value happens to be 108" },
  { dec: 111, hex: "6F", bits: "01101111", ch: "o", printable: true, binary: "a byte whose value happens to be 111" },
  { dec: 32, hex: "20", bits: "00100000", ch: "␣", name: "SP", printable: true, binary: "a byte whose value happens to be 32" },
  { dec: 110, hex: "6E", bits: "01101110", ch: "n", printable: true, binary: "a byte whose value happens to be 110" },
  { dec: 111, hex: "6F", bits: "01101111", ch: "o", printable: true, binary: "a byte whose value happens to be 111" },
  { dec: 46, hex: "2E", bits: "00101110", ch: ".", printable: true, binary: "a byte whose value happens to be 46" },
  { dec: 32, hex: "20", bits: "00100000", ch: "␣", name: "SP", printable: true, binary: "a byte whose value happens to be 32" },
  { dec: 49, hex: "31", bits: "00110001", ch: "1", printable: true, binary: "a byte whose value happens to be 49" },
  /* The newline. It is a byte in the file like any other, and the text
     contract is the only reason it means the end of a line. */
  { dec: 10, hex: "0A", bits: "00001010", ch: "¶", name: "LF", printable: false, line: true, binary: "a byte whose value happens to be 10" },
  { dec: 119, hex: "77", bits: "01110111", ch: "w", printable: true, binary: "a byte whose value happens to be 119" },
  { dec: 104, hex: "68", bits: "01101000", ch: "h", printable: true, binary: "a byte whose value happens to be 104" },
  { dec: 101, hex: "65", bits: "01100101", ch: "e", printable: true, binary: "a byte whose value happens to be 101" },
  { dec: 114, hex: "72", bits: "01110010", ch: "r", printable: true, binary: "a byte whose value happens to be 114" }
];

const MACH_BYTES = [
  { dec: 207, hex: "CF", bits: "11001111", ch: null, printable: false, magic: 1, binary: "byte 1 of the four-byte magic number that identifies a Mach-O 64-bit binary" },
  { dec: 250, hex: "FA", bits: "11111010", ch: null, printable: false, magic: 2, binary: "byte 2 of the four-byte magic number that identifies a Mach-O 64-bit binary" },
  { dec: 237, hex: "ED", bits: "11101101", ch: null, printable: false, magic: 3, binary: "byte 3 of the four-byte magic number that identifies a Mach-O 64-bit binary" },
  { dec: 254, hex: "FE", bits: "11111110", ch: null, printable: false, magic: 4, binary: "byte 4 of the four-byte magic number that identifies a Mach-O 64-bit binary" },
  { dec: 12, hex: "0C", bits: "00001100", ch: null, printable: false, binary: "a header field whose meaning is fixed by the Mach-O format" },
  { dec: 0, hex: "00", bits: "00000000", ch: null, printable: false, binary: "a header field whose meaning is fixed by the Mach-O format" },
  { dec: 0, hex: "00", bits: "00000000", ch: null, printable: false, binary: "a header field whose meaning is fixed by the Mach-O format" },
  { dec: 1, hex: "01", bits: "00000001", ch: null, printable: false, binary: "a header field whose meaning is fixed by the Mach-O format" },
  { dec: 0, hex: "00", bits: "00000000", ch: null, printable: false, binary: "a header field whose meaning is fixed by the Mach-O format" },
  { dec: 0, hex: "00", bits: "00000000", ch: null, printable: false, binary: "a header field whose meaning is fixed by the Mach-O format" },
  { dec: 0, hex: "00", bits: "00000000", ch: null, printable: false, binary: "a header field whose meaning is fixed by the Mach-O format" },
  { dec: 0, hex: "00", bits: "00000000", ch: null, printable: false, binary: "a header field whose meaning is fixed by the Mach-O format" },
  { dec: 2, hex: "02", bits: "00000010", ch: null, printable: false, binary: "a header field whose meaning is fixed by the Mach-O format" },
  { dec: 0, hex: "00", bits: "00000000", ch: null, printable: false, binary: "a header field whose meaning is fixed by the Mach-O format" },
  { dec: 0, hex: "00", bits: "00000000", ch: null, printable: false, binary: "a header field whose meaning is fixed by the Mach-O format" },
  { dec: 0, hex: "00", bits: "00000000", ch: null, printable: false, binary: "a header field whose meaning is fixed by the Mach-O format" }
];

/* Only the four bytes of the signature are recorded ground truth for this
   file, so only four are drawn. A shorter row is preferable to an invented
   one, and four is enough for what this source is here to show. */
const PNG_BYTES = [
  { dec: 137, hex: "89", bits: "10001001", ch: null, printable: false, magic: 1, binary: "byte 1 of the four-byte magic number that identifies a PNG image" },
  { dec: 80, hex: "50", bits: "01010000", ch: "P", printable: true, magic: 2, binary: "byte 2 of the four-byte magic number that identifies a PNG image" },
  { dec: 78, hex: "4E", bits: "01001110", ch: "N", printable: true, magic: 3, binary: "byte 3 of the four-byte magic number that identifies a PNG image" },
  { dec: 71, hex: "47", bits: "01000111", ch: "G", printable: true, magic: 4, binary: "byte 4 of the four-byte magic number that identifies a PNG image" }
];

/* The sources. `verdict` is what the text contract produces for the file as a
   whole, and it is stated for every source including the one where the
   contract succeeds, so that success reads as an outcome rather than as the
   normal condition of a file. */
const SOURCES = [
  {
    id: "text",
    label: "test.txt",
    hint: "written by fprintf",
    bytes: TEXT_BYTES,
    shown: "the first sixteen bytes",
    verdict:
      "The text contract succeeds. Fifteen of these sixteen bytes are printable characters, the sixteenth is the newline that ends line one, and the bytes spell words.",
    magic: null,
    notice: "Both readings work. Now switch the file."
  },
  {
    id: "mach",
    label: "a compiled program",
    hint: "Mach-O 64-bit",
    bytes: MACH_BYTES,
    shown: "the first sixteen bytes",
    verdict:
      "The text contract fails. Not one of these sixteen bytes is a printable character, so a text editor shows the row of substitution marks below.",
    magic: { from: 0, count: 4, name: "Mach-O 64-bit magic number", reads: "CF FA ED FE" },
    notice: "The text row is empty boxes. The binary row is not."
  },
  {
    id: "png",
    label: "a PNG image",
    hint: "first four bytes",
    bytes: PNG_BYTES,
    shown: "the first four bytes",
    verdict:
      "The text contract half succeeds, which is worse than failing: three of these four bytes are the printable letters P, N and G, and the first has no printable character at all.",
    magic: { from: 0, count: 4, name: "PNG magic number", reads: "89 50 4E 47" },
    notice: "A magic number a reader can almost pronounce."
  }
];

function sourceById(id) {
  return SOURCES.find((s) => s.id === id) || SOURCES[0];
}

/* How the text contract's verdict on ONE byte is said, in the drawing and in
   the status line, from the same function so the two cannot disagree. */
function textReading(b) {
  if (b.ch === null) return "no printable character; a text editor shows a substitution mark";
  if (b.name === "SP") return "the space character";
  if (b.name === "LF") return "the newline, which ends a line rather than printing a shape";
  return `the character ${b.ch}`;
}

export function ByteContract({ caption }) {
  const [sourceId, setSourceId] = React.useState("text");
  const source = sourceById(sourceId);
  const bytes = source.bytes;

  /* The timeline walks byte positions, one frame per byte. Two of the three
     sources are the same sixteen bytes long, so moving to the compiled program
     from byte nine of test.txt lands on byte nine of the program: the same
     position in the row, the other file, and the text reading gone. */
  const scrub = useScrub(bytes.length);
  const at = Math.min(scrub.index, bytes.length - 1);
  const byte = bytes[at];

  const cols = bytes.length;
  const magic = source.magic;
  const inMagic = magic && at >= magic.from && at < magic.from + magic.count;

  /* The drawing is aria-hidden, so this sentence is the figure for a reader
     who is not getting it from the picture. It carries the same facts the
     columns do — which file, which byte, the value twice, both readings, and
     whether the text contract produced anything — and then the claim, because
     the claim is permanently visible on screen and must be permanently
     available here too. */
  const status =
    `${source.label}, ${source.shown}. ` +
    `The byte at offset ${at}, of the ${cols} shown: decimal ${byte.dec}, ` +
    `hexadecimal ${byte.hex}, bits ${byte.bits}. ` +
    `Under the text contract, ${textReading(byte)}. ` +
    `Under the binary contract, ${byte.binary}. ` +
    `The byte is ${byte.printable ? "printable" : "not printable"}. ` +
    `${source.verdict} ${CLAIM}`;

  return (
    <Explorable
      title="One row of bytes, read two ways at once"
      notice={source.notice}
      caption={caption}
      status={status}
    >
      {/* The control is the instrument, not decoration: the figure only makes
          its argument once the reader changes the file and watches one reading
          collapse while the row of bytes goes on being a row of bytes. */}
      <Choice
        legend="The file being read"
        options={SOURCES.map((s) => ({ id: s.id, label: s.label, hint: s.hint }))}
        value={sourceId}
        onChange={setSourceId}
      />

      <div className="bc-figure" aria-hidden="true">
        <p className="bc-verdict">{source.verdict}</p>

        {/* Wide by construction — sixteen columns of eight bits each — so it
            scrolls inside itself and never the page. It is deliberately not
            made focusable: it sits inside an aria-hidden subtree, and a
            focusable element there is a tab stop that announces nothing. The
            same row is reachable byte by byte through the transport, which
            moves the cursor and speaks each byte. */}
        <div className="bc-scroll ex-scroll">
          <div className="bc-lanes" style={{ "--bc-cols": String(cols) }}>
            <Lane label="offset" kind="offset">
              {bytes.map((b, n) => (
                <span key={n} className={"bc-cell bc-offset" + (n === at ? " is-here" : "")}>
                  <span className="bc-caret">{n === at ? "▾" : ""}</span>
                  {n}
                </span>
              ))}
            </Lane>

            {/* The invariant. The middle lane is the file itself, drawn as the
                eight bits each byte actually is, and it is identical whichever
                contract is being applied above or below it. */}
            <Lane label="the bytes" kind="bits">
              {bytes.map((b, n) => (
                <span key={n} className={"bc-cell bc-bits" + (n === at ? " is-here" : "")}>
                  {b.bits}
                </span>
              ))}
            </Lane>

            {/* Reading one. Unprintable cells are marked three ways — the
                substitution glyph, a dashed outline, and the word "none" —
                so the distinction survives greyscale and a cheap panel. */}
            <Lane label="as text" kind="text">
              {bytes.map((b, n) => (
                <span
                  key={n}
                  className={
                    "bc-cell bc-char" +
                    (n === at ? " is-here" : "") +
                    (b.printable ? "" : " is-unprintable")
                  }
                >
                  <span className="bc-glyph">{b.ch === null ? NONE : b.ch}</span>
                  <span className="bc-tag">{b.printable ? b.name || "" : b.name || "none"}</span>
                </span>
              ))}
            </Lane>

            {/* Reading two. The same bytes as the values they are: hexadecimal
                over decimal, which is how every tool that reads a binary file
                prints them. */}
            <Lane label="as binary" kind="value">
              {bytes.map((b, n) => (
                <span key={n} className={"bc-cell bc-value" + (n === at ? " is-here" : "")}>
                  <span className="bc-hex">{b.hex}</span>
                  <span className="bc-dec">{b.dec}</span>
                </span>
              ))}
            </Lane>

            {/* The magic number, bracketed under the bytes it is made of and
                named. A span rather than a per-cell tint, because a magic
                number is one object that happens to be four bytes wide. */}
            {magic && (
              <Lane label="" kind="magic">
                <span
                  className="bc-magic"
                  style={{ gridColumn: `${magic.from + 1} / span ${magic.count}` }}
                >
                  {/* The bracket is drawn with borders rather than with box
                      glyphs, so it spans exactly the four columns whatever the
                      reader's font does. */}
                  <span className="bc-magic-brace" />
                  <span className="bc-magic-name">
                    {magic.reads} is the {magic.name}
                  </span>
                </span>
              </Lane>
            )}
          </div>
        </div>

        {/* The byte under the cursor, spelled out. The lanes show all of the
            row shallowly; this shows one position of it completely. */}
        <dl className="bc-detail">
          <div className="bc-detail-row">
            <dt>Byte</dt>
            <dd>offset {at}, of the {cols} bytes shown</dd>
          </div>
          <div className="bc-detail-row">
            <dt>Its value</dt>
            <dd>{byte.dec} decimal, {byte.hex} hexadecimal, {byte.bits}</dd>
          </div>
          <div className="bc-detail-row">
            <dt>Under the text contract</dt>
            <dd>
              {textReading(byte)}
              <span className={"bc-flag" + (byte.printable ? " is-yes" : " is-no")}>
                {byte.printable ? "printable" : "not printable"}
              </span>
            </dd>
          </div>
          <div className="bc-detail-row">
            <dt>Under the binary contract</dt>
            <dd>
              {byte.binary}
              {inMagic && <span className="bc-flag is-magic">part of the magic number</span>}
            </dd>
          </div>
        </dl>
      </div>

      {/* Permanently visible, and outside the aria-hidden drawing so that it is
          read once rather than never. This sentence is the learning outcome the
          step states, and the figure exists to make it undeniable. */}
      <p className="bc-claim">{CLAIM}</p>

      <ScrubBar scrub={scrub} label="the byte row" status={status} unit="byte" />
    </Explorable>
  );
}

/* One lane: a label that stays put while the bytes scroll past it, and the
   cells themselves on the shared column grid. Sticking the label is what keeps
   the figure legible at 360px, where the reader is always looking at a scrolled
   row and would otherwise have forgotten which of the three lanes they are on. */
function Lane({ label, kind, children }) {
  return (
    <React.Fragment>
      <span className={`bc-lane-label bc-lane-${kind}`}>{label}</span>
      <span className={`bc-lane bc-lane-${kind}`}>{children}</span>
    </React.Fragment>
  );
}

/* The same two-state control the other figures use, with three options rather
   than two: real radio semantics, both the arrow keys and a single tab stop,
   and the chosen option named by aria-checked rather than only by its tint. */
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
    <div className="bc-choice" role="radiogroup" aria-label={legend}>
      {/* Repeated to the group as aria-label above, so the visible copy is
          hidden here to stop it being announced twice. */}
      <span className="bc-choice-legend" aria-hidden="true">{legend}</span>
      <div className="bc-opts">
        {options.map((o, n) => (
          <button
            key={o.id}
            type="button"
            role="radio"
            aria-checked={o.id === value}
            tabIndex={o.id === value ? 0 : -1}
            ref={(el) => { refs.current[n] = el; }}
            className={"bc-opt" + (o.id === value ? " is-on" : "")}
            onClick={() => onChange(o.id)}
            onKeyDown={onKeyDown}
          >
            <span className="bc-opt-label">{o.label}</span>
            <span className="bc-opt-hint">{o.hint}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
