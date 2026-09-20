import React from "react";

/* Problems set at the end of the session.

   The checkpoints inside the stages verify that a reader followed the material.
   They are not assessment: each one has a right answer that the page then
   supplies, which is the correct design for a guided walkthrough and the wrong
   design for measuring whether anything was learned.

   These are different. Each requires the student to write or modify code and
   defend a choice, none can be answered by scrolling back for a sentence, and
   several have no single correct answer at all. They are posed and not graded
   here — the page marks nothing and stores nothing about them — because the
   assessment instrument in this course is the machine problem, and a handout
   that pretended otherwise would be making a promise the instructor has to keep.

   Ordered by what they demand rather than by the stage they draw on:
   verification, then diagnosis, then modification, then design. The last two
   are deliberately open, and the final one cannot be completed honestly without
   conceding a limitation, which is the point of it. */

export const exercises = [
  {
    n: 1,
    title: "Instrument the file position indicator",
    assesses: "Stage 4 · the position as observable state",
    body: (
      <>
        Add a call to <code className="aw-code">ftell(fp)</code> after each{" "}
        <code className="aw-code">fgets</code> in{" "}
        <code className="aw-code">06-readline.c</code> and print what it returns.
        Confirm that the three values are 12, 28 and 44, and account for each of
        them in terms of the bytes consumed. Then explain why a fourth call
        reports 44 as well.
      </>
    )
  },
  {
    n: 2,
    title: "Distinguish four causes of the same symptom",
    assesses: "Stage 2 · diagnosis rather than repair",
    body: (
      <>
        A program opens <code className="aw-code">data.txt</code>, prints
        nothing, and exits with status 0. Give four distinct causes consistent
        with that description. Then give the smallest change to the program that
        would let you tell which one occurred, and state what each cause would
        then print.
      </>
    )
  },
  {
    n: 3,
    title: "Lose the buffer deliberately",
    assesses: "Stage 3 · buffering and program termination",
    body: (
      <>
        Remove the <code className="aw-code">fclose</code> from{" "}
        <code className="aw-code">02-write.c</code> and run it. The file is
        written in full. Now make the program terminate abnormally before the
        end of <code className="aw-code">main</code> — a call to{" "}
        <code className="aw-code">abort()</code> will do — and run it again.
        Report both file sizes and explain the difference. Your answer should
        make clear what <code className="aw-code">fclose</code> actually
        guarantees, given that the first run succeeded without it.
      </>
    )
  },
  {
    n: 4,
    title: "Report rather than truncate",
    assesses: "Stage 5 · boundary conditions in a parser",
    body: (
      <>
        <code className="aw-code">getDelimitedItem</code> in{" "}
        <code className="aw-code">08-csv.c</code> stops storing characters once
        the buffer is full, but keeps reading to the delimiter. A field longer
        than the buffer is therefore silently shortened. Change the function so
        that the caller can detect this, and change{" "}
        <code className="aw-code">main</code> to report the record and field
        affected. Explain why silent truncation is the more dangerous of the two
        behaviors in a data pipeline.
      </>
    )
  },
  {
    n: 5,
    title: "Two streams, one transformation",
    assesses: "Stage 2 and Stage 5 · independent stream state",
    body: (
      <>
        Write a program that reads <code className="aw-code">cars.csv</code> and
        writes a second file containing only the make and the model year of each
        car, one record per line. Both streams must be open at once and both
        opens must be checked. State what happens to the output file if the
        program returns early after a failed read, and what you did about it.
      </>
    )
  },
  {
    n: 6,
    title: "Choose a delimiter and admit its cost",
    assesses: "Stage 5 · in-band delimiters, open design",
    body: (
      <>
        The comma is drawn from the same alphabet as the data, so a field
        containing a comma cannot be represented. Propose a scheme that removes
        this restriction, implement reading for it, and state its cost. Every
        answer has one: a delimiter that cannot occur in the data restricts the
        data, an escape mechanism complicates both reader and writer, and a
        length-prefixed format stops being readable in a text editor. Name the
        cost your scheme pays and say why you accepted it.
      </>
    )
  }
];

export function Exercises() {
  return (
    <section id="exercises" className="fio-ex-wrap" aria-labelledby="exercises-heading">
      <div className="dls-section fio-ex">
        <h2 className="aw-eyebrow" id="exercises-heading">Exercises</h2>
        <p className="fio-ex-lede">
          Nothing on this page records or marks these. They are set for the
          laboratory session and for your own preparation, and they are the kind
          of question the machine problem and the practical examination ask.
        </p>

        <ol className="fio-ex-list">
          {exercises.map((e) => (
            <li key={e.n} className="fio-ex-item">
              <div className="fio-ex-head">
                <span className="fio-ex-n" aria-hidden="true">{e.n}</span>
                <div style={{ minWidth: 0 }}>
                  <h3 className="fio-ex-title">{e.title}</h3>
                  <p className="fio-ex-assesses">{e.assesses}</p>
                </div>
              </div>
              <div className="fio-ex-body">{e.body}</div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
