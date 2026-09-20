import React from "react";

/* References and further reading.

   The original document carried none, which is the single clearest sign that
   it was lecture support rather than a handout: it was written to be spoken
   over, and a student who wanted to go further had nowhere to go. A handout
   that replaces it has to give the reader somewhere to go.

   Three kinds of source, and the distinction is worth making on the page. The
   textbook is where the material is explained at length. The standard is where
   the guarantees actually live, and citing it teaches something this course
   wants taught: that "it worked on my machine" and "the language promises this"
   are different claims. The manual pages are what a working programmer reaches
   for, and most second-year students have never been shown that `man 3 fopen`
   exists on the machine in front of them.

   Clause numbers are given for C11, ISO/IEC 9899:2011, which is the revision
   this course's material targets. */

export const references = [
  {
    kind: "Textbook",
    items: [
      {
        cite: "Kernighan, B. W. and Ritchie, D. M. The C Programming Language, 2nd edition. Prentice Hall, 1988.",
        note: (
          <>
            Chapter 7, <em>Input and Output</em>. Section 7.5 covers file access
            and section 7.7 line input and output. Chapter 7 is short, and it is
            worth reading in full rather than consulting.
          </>
        )
      }
    ]
  },
  {
    kind: "The standard",
    items: [
      {
        cite: "ISO/IEC 9899:2011 (C11), clause 7.21, Input/output <stdio.h>.",
        note: (
          <>
            7.21.2 defines a <strong>stream</strong> and distinguishes text
            streams from binary streams. 7.21.3 covers files and buffering.
            7.21.5.3 specifies <code className="aw-code">fopen</code> and the
            mode strings, including exactly what <code className="aw-code">"w"</code>{" "}
            truncates and when. Error handling is 7.21.10, which is where{" "}
            <code className="aw-code">feof</code>,{" "}
            <code className="aw-code">ferror</code> and{" "}
            <code className="aw-code">perror</code> are defined.
          </>
        )
      },
      {
        cite: "Draft N1570 is the freely available working paper closest to the published C11 text.",
        note: (
          <>
            The published standard is a paid document. N1570 is not the standard
            and should not be cited as though it were, but the clause numbering
            matches and it is what most people actually read.
          </>
        )
      }
    ]
  },
  {
    kind: "Manual pages",
    items: [
      {
        cite: "man 3 fopen, man 3 fgets, man 3 fgetc, man 3 fscanf, man 3 ftell, man 3 setvbuf, man 3 perror",
        note: (
          <>
            Section 3 is the C library. These are already installed on any Mac or
            Linux machine, and on Windows the same pages are available through
            WSL or online. Read <code className="aw-code">man 3 fopen</code>{" "}
            before the laboratory session: the RETURN VALUE and ERRORS headings
            are the two that matter most in this material.
          </>
        )
      }
    ]
  },
  {
    kind: "In this course",
    items: [
      {
        cite: "Handout 02, Submitting an assignment.",
        note: (
          <>
            How the machine problem that follows this session is collected and
            marked. If your compiler is not yet working, start there.
          </>
        ),
        href: "assignment-workflow.html"
      },
      {
        cite: "Week 7, Analyzing data in MATLAB.",
        note: (
          <>
            The same pipeline as stage 5 — a delimited file read into records and
            reduced to a figure — expressed in a language that hides the reading.
            The handout you are on is what it is hiding.
          </>
        ),
        href: "course-overview.html#plan"
      }
    ]
  }
];

export function Further() {
  return (
    <section id="further" className="fio-further-wrap" aria-labelledby="further-heading">
      <div className="dls-section fio-further">
        <h2 className="aw-eyebrow" id="further-heading">References and further reading</h2>
        <p className="fio-further-lede">
          The textbook explains this material at length, the standard is where
          the guarantees are actually written down, and the manual pages are
          what you will reach for once you are working. They are not
          interchangeable.
        </p>

        <div className="fio-further-groups">
          {references.map((g) => (
            <section key={g.kind} className="fio-further-group">
              <h3 className="fio-further-kind">{g.kind}</h3>
              <ul className="fio-further-list">
                {g.items.map((it) => (
                  <li key={it.cite}>
                    <p className="fio-further-cite">
                      {it.href
                        ? <a className="dls-link-quiet" href={it.href}>{it.cite}</a>
                        : it.cite}
                    </p>
                    <p className="fio-further-note">{it.note}</p>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </div>
    </section>
  );
}
