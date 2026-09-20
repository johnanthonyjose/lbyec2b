import React from "react";
import { Button } from "../../components/ds/index.js";

/* The gate in front of stage 1.

   It asks for three things, and the third is the one that matters. A student
   whose compiler works and who has the sample files can still lose an entire
   evening to a program that opens nothing, because they ran it from a folder
   that does not contain the data. The original document never mentioned the
   working directory at all; the whole of stage 2 assumes the reader has been
   warned about it here.

   The gate is skippable on purpose. A reader who has done all this before
   should not have to tick three boxes to be allowed to read, and a gate that
   cannot be passed is a gate that gets closed along with the tab. Skipping is
   recorded so the page stops asking. */

const ASSETS = "assets/file-io";   // relative: vite.config.js sets base to "./"

export const needs = [
  {
    id: "compiler",
    name: "I can compile and run a C program on this machine",
    detail: (
      <>
        If <code className="aw-code">clang</code> or <code className="aw-code">gcc</code> is
        not set up yet, work through the{" "}
        <a className="dls-link-quiet" href="assignment-workflow.html">
          assignment workflow handout
        </a>{" "}
        first. Nothing here can be checked without a compiler.
      </>
    )
  },
  {
    id: "files",
    name: "I have the sample files in a folder of their own",
    detail: (
      <>
        Make one folder for this handout and put everything below in it. Keeping
        them together is what makes the programs in stages 3 to 5 find their data.
      </>
    )
  },
  {
    id: "cwd",
    name: "I know which folder my program runs from",
    detail: (
      <>
        A program that opens <code className="aw-code">"test.txt"</code> is asking
        for that name <em>in the folder it was launched from</em>, not the folder
        the source file is in. In VS Code, open the folder itself rather than the
        single file, and use the integrated terminal. This one causes more lost
        evenings than any other item on this list.
      </>
    )
  }
];

/* The eight programs and three data files, offered as downloads rather than as
   a wall of source. The programs are also printed in the steps that build them,
   a few lines at a time, which is where a reader should meet them first. This
   list exists so that nobody has to retype thirty lines of C from a phone. */
const downloads = [
  { file: "01-open.c", note: "Opens a file, and fails out loud when it cannot" },
  { file: "02-write.c", note: "Writes the first two lines of test.txt" },
  { file: "03-append.c", note: "Adds a third line without destroying the first two" },
  { file: "04-readchar.c", note: "Reads one character at a time" },
  { file: "05-readascii.c", note: "The same, printed as the numbers actually stored" },
  { file: "06-readline.c", note: "Reads one line at a time" },
  { file: "07-fields.c", note: "One record over four lines, printed as a table" },
  { file: "08-csv.c", note: "The same table, read from a comma-delimited file" },
  { file: "cars.txt", note: "Data: one field per line" },
  { file: "cars.csv", note: "Data: the same records, comma-delimited" }
];

export function Before({ ticked, onTick, ready, skipped, onSkip, onBegin, started }) {
  const count = needs.filter((n) => ticked[n.id]).length;

  return (
    <section id="before" className="fio-before-wrap">
      <div className="dls-section fio-before">
        <div className="aw-eyebrow">Before you start</div>
        <h2 className="fio-before-title">Three things to have ready</h2>
        <p className="aw-p">
          This handout asks you to run real programs on your own machine and look
          at the files they produce. None of it works from reading alone.
        </p>

        <ul className="fio-needs">
          {needs.map((n) => {
            const on = !!ticked[n.id];
            return (
              <li key={n.id}>
                <button type="button" className={`fio-need${on ? " is-on" : ""}`}
                  aria-pressed={on} onClick={() => onTick(n.id)}>
                  <span className="fio-need-box" aria-hidden="true">{on ? "✓" : ""}</span>
                  <span className="fio-need-text">
                    <span className="fio-need-name">{n.name}</span>
                    <span className="fio-need-detail">{n.detail}</span>
                  </span>
                </button>
              </li>
            );
          })}
        </ul>

        <div className="fio-downloads">
          <div className="aw-eyebrow">The sample files</div>
          <p className="aw-p" style={{ marginTop: "var(--space-2)" }}>
            Save these into the folder you made. Each program is also built up a
            few lines at a time in the stage that introduces it.
          </p>
          <ul className="fio-dl-list">
            {downloads.map((d) => (
              <li key={d.file}>
                <a className="fio-dl" href={`${ASSETS}/${d.file}`} download>
                  <code className="fio-dl-name">{d.file}</code>
                  <span className="fio-dl-note">{d.note}</span>
                </a>
              </li>
            ))}
          </ul>
          <p className="fio-dl-foot">
            There is no <code className="aw-code">test.txt</code> in that list on
            purpose. You write it yourself in stage 3, and stage 4 reads back the
            bytes you wrote.
          </p>
        </div>

        <div className="fio-before-actions">
          <Button variant="gold" size="lg" onClick={onBegin} disabled={!ready && !started}>
            {started ? "Back to where I was" : "Start stage 1"}
          </Button>
          {!ready && !started && (
            <>
              <span className="fio-before-count">{count} of {needs.length} ready</span>
              <button type="button" className="aw-quiet" onClick={onSkip}>
                I have done all this before — let me start
              </button>
            </>
          )}
          {skipped && !ready && (
            <span className="fio-before-count">Prerequisites skipped</span>
          )}
        </div>
      </div>
    </section>
  );
}
