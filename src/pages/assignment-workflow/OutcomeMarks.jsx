import React from "react";

/* One mark per stage, drawn rather than captured, in the same register as the
   CredentialMark on the GitHub-account handout: gold and white line work on the
   deep green ground, ruled border, no fill.

   They are not badges in the arcade sense and are not meant to read as prizes.
   Each one depicts the thing the stage actually produced — a repository, a
   folder on disk, a program that runs, an upload, a mark on the record — so
   what a reader collects is a picture of what they now hold. */

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

/* Stage 1 — a repository bearing your name. */
export function RepoMark(props) {
  return (
    <Mark label="Mark: a repository issued in your name" {...props}>
      <g {...white}>
        <path d="M50 48h76a8 8 0 0 1 8 8v96H58a8 8 0 0 1-8-8V48z" />
        <path d="M50 128h84" />
      </g>
      <g {...gold}><path d="M70 70h42M70 90h30" /></g>
      <circle cx="134" cy="140" r="20" fill="var(--green-900)" stroke="var(--gold-300)" strokeWidth="3" />
      <path d="M125 140.5l6.5 6.5L143 135" fill="none" stroke="var(--gold-300)"
        strokeWidth="3.6" strokeLinecap="round" strokeLinejoin="round" />
    </Mark>
  );
}

/* Stage 2 — the same repository, now a folder on your own machine. */
export function FolderMark(props) {
  return (
    <Mark label="Mark: a working copy on your own computer" {...props}>
      <g {...white}>
        <path d="M42 68a6 6 0 0 1 6-6h30l10 12h64a6 6 0 0 1 6 6v62a6 6 0 0 1-6 6H48a6 6 0 0 1-6-6V68z" />
      </g>
      <g {...gold}><path d="M64 98h72M64 116h48" /></g>
      <path d="M100 36v20M92 48l8 8 8-8" fill="none" stroke="var(--gold-300)"
        strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round" />
    </Mark>
  );
}

/* Stage 3 — a console that answers correctly. */
export function RunMark(props) {
  return (
    <Mark label="Mark: a program producing the expected output" {...props}>
      <g {...white}>
        <rect x="36" y="50" width="128" height="100" rx="6" />
        <path d="M36 72h128" />
      </g>
      <g {...gold}>
        <path d="M58 98l14 12-14 12" />
        <path d="M86 122h34" />
        <path d="M50 61h8" />
      </g>
    </Mark>
  );
}

/* Stage 4 — the work leaving your machine. */
export function PushMark(props) {
  return (
    <Mark label="Mark: work uploaded to GitHub" {...props}>
      <g {...white}>
        <path d="M62 132a26 26 0 0 1 4-51 34 34 0 0 1 65 6 24 24 0 0 1 7 45" />
      </g>
      <g {...gold}>
        <path d="M100 152V90" />
        <path d="M82 108l18-18 18 18" />
      </g>
    </Mark>
  );
}

/* Stage 5 — the mark on the record. */
export function CheckMark(props) {
  return (
    <Mark label="Mark: a confirmed submission" {...props}>
      <g {...white}>
        <path d="M100 36l52 20v46c0 32-22 53-52 62-30-9-52-30-52-62V56z" />
      </g>
      <path d="M78 102l16 17 30-34" fill="none" stroke="var(--gold-300)"
        strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
    </Mark>
  );
}
