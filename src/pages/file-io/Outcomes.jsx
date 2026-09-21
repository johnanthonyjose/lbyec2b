import React from "react";

/* The three learning outcomes, stated on the page.

   The original document opened with these and this one dropped them, which on
   its own stopped it being a substitute. LBYEC2B is an outcomes-based course:
   course.js maps LO1 to LO6 onto Student Outcome K, the machine problems are
   assessed against them, and an instructor handing out material is expected to
   be able to point at what it is for. A handout that cannot is a handout that
   has to be paired with the old document rather than replacing it.

   They are stated in the original's words, with the stage that delivers each
   one named beside it. That second half is new and is the part that earns its
   place on the page rather than in a syllabus: a reader who wants only the
   third outcome can see that stages 2 to 5 are the ones to read. */

export const outcomes = [
  {
    text: "Explain what a file is, and tell a text file from a binary file.",
    stages: "Stage 1"
  },
  {
    text: "Explain what file input and output is.",
    stages: "Stage 1"
  },
  {
    text: "Identify and use the C file I/O facilities to save data to a text file and read it back.",
    stages: "Stages 1 to 4"
  }
];

export function Outcomes() {
  return (
    <section className="fio-outcomes-wrap" aria-labelledby="outcomes-heading">
      <div className="dls-section fio-outcomes">
        <h2 className="aw-eyebrow" id="outcomes-heading">Learning outcomes</h2>
        <p className="fio-outcomes-lede">
          By the end of this session you should be able to:
        </p>
        <ol className="fio-outcomes-list">
          {outcomes.map((o, i) => (
            <li key={i}>
              <span className="fio-outcome-text">{o.text}</span>
              <span className="fio-outcome-where">{o.stages}</span>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
