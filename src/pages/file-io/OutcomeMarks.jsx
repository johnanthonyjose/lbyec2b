import React from "react";

/* One mark per stage, in the same register as the marks on the assignment
   workflow handout: gold and white line work on the deep green ground, ruled
   border, no fill.

   There were five. The mark for the stage that produced no file went with the
   stage itself.

   The rule they follow is the same one, and it is worth restating because it
   is what keeps them from becoming badges. Each mark depicts the thing the
   stage actually produced, so what a reader accumulates is a picture of what
   they now hold rather than a score. Every one of them is now a file that exists
   on the reader's own disk; the one that depicted a loss went with the stage
   that produced no file. */

function Mark({ children, label, size = 120 }) {
  return (
    <svg viewBox="0 0 200 200" width={size} height={size} role="img" aria-label={label}
      style={{ display: "block" }}>
      <rect x="1" y="1" width="198" height="198" rx="4" fill="none"
        stroke="var(--gold-500)" strokeWidth="0.8" />
      <rect x="10" y="10" width="180" height="180" rx="3" fill="none"
        stroke="rgba(255,255,255,0.16)" strokeWidth="0.6" />
      {children}
    </svg>
  );
}

const white = {
  fill: "none", stroke: "var(--neutral-0)", strokeWidth: 3.4,
  strokeLinecap: "round", strokeLinejoin: "round"
};
const gold = {
  fill: "none", stroke: "var(--gold-300)", strokeWidth: 3.4,
  strokeLinecap: "round", strokeLinejoin: "round"
};

/* Stage 1 — a file opened. A document with a key, because the stage is about
   fopen returning a handle and, just as importantly, about it refusing to. */
export function OpenMark(props) {
  return (
    <Mark label="Mark: a file opened, or an honest failure" {...props}>
      <g {...white}>
        <path d="M58 44h52l32 32v84a6 6 0 0 1-6 6H58a6 6 0 0 1-6-6V50a6 6 0 0 1 6-6z" />
        <path d="M110 44v34h32" />
      </g>
      <g {...gold}>
        <circle cx="86" cy="118" r="13" />
        <path d="M99 118h34M127 118v13M117 118v9" />
      </g>
    </Mark>
  );
}

/* Stage 2 — a file written. The same document, now bearing lines of text and
   a nib, with the last line still gold: the buffer, not yet flushed. */
export function WriteMark(props) {
  return (
    <Mark label="Mark: a file written to your disk" {...props}>
      <g {...white}>
        <path d="M54 40h56l34 34v88a6 6 0 0 1-6 6H54a6 6 0 0 1-6-6V46a6 6 0 0 1 6-6z" />
        <path d="M110 40v36h34" />
        <path d="M70 100h58M70 118h58" />
      </g>
      <g {...gold} strokeDasharray="6 7">
        <path d="M70 136h40" />
      </g>
      <path d="M126 148l22-22 8 8-22 22-11 3z" fill="none" stroke="var(--gold-300)"
        strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round" />
    </Mark>
  );
}

/* Stage 3 — a file read. Lines of text with a caret part way along the second
   one: the stream position, which is the whole subject of the stage. */
export function ReadMark(props) {
  return (
    <Mark label="Mark: your data read back into a program" {...props}>
      <g {...white}>
        <path d="M52 48h96a6 6 0 0 1 6 6v92a6 6 0 0 1-6 6H52a6 6 0 0 1-6-6V54a6 6 0 0 1 6-6z" />
        <path d="M68 76h64M68 122h64M68 140h40" />
      </g>
      <g {...gold}>
        <path d="M68 99h28" />
        <path d="M104 88v22" strokeWidth="5" />
        <path d="M99 88h10M99 110h10" strokeWidth="2.6" />
      </g>
    </Mark>
  );
}

/* Stage 4 — delimited data become a table. A grid, with the gold rule standing
   in for the delimiter that made the columns possible. */
export function TableMark(props) {
  return (
    <Mark label="Mark: a data file read into a formatted table" {...props}>
      <g {...white}>
        <rect x="46" y="52" width="108" height="96" rx="5" />
        <path d="M46 80h108M46 108h108M46 130h108" />
      </g>
      <g {...gold}>
        <path d="M108 52v96" strokeDasharray="8 8" />
        <path d="M62 66h30M62 94h28M62 119h26M124 66h20M124 94h22M124 119h16"
          strokeWidth="3" />
      </g>
    </Mark>
  );
}
