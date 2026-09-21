import React from "react";
import { programs, dataFiles, ASSETS } from "./programs.jsx";

/* The sample files, at the foot of the page.

   They used to sit in a readiness panel above the handout, alongside a
   three-item checklist a reader had to get past before the first stage. That
   panel was answering a question nobody had yet: a reader who has just opened
   the page does not know what test.txt is for, and being asked to confirm they
   have a compiler before being shown anything is an obstacle wearing the
   costume of preparation.

   So the files are here instead. A reader who wants them knows by now what
   they are, and a reader who does not is not delayed by them. Each step that
   introduces a program still names it, and the reference above this section
   indexes them a second time by what they demonstrate.

   test.txt is deliberately absent, as it always was: stage 3 has the reader
   write it, and stage 4 reads back the bytes they wrote. */

export function Downloads() {
  return (
    <section id="files" className="fio-dl-wrap" aria-labelledby="files-heading">
      <div className="dls-section fio-dls">
        <h2 className="aw-eyebrow" id="files-heading">Sample files</h2>
        <p className="fio-dls-lede">
          Every program in this handout, ready to compile. Put them in a folder
          of their own together with the two data files, and run them from that
          folder. All of them compile clean under{" "}
          <code className="aw-code">clang -std=c11 -Wall -Wextra -pedantic</code>.
        </p>

        <ul className="fio-dls-list">
          {programs.map((p) => (
            <li key={p.file}>
              <a className="fio-dls-item" href={`${ASSETS}/${p.file}`} download>
                <code className="fio-dls-name">{p.file}</code>
                <span className="fio-dls-note">{p.note}</span>
                <span className="fio-dls-stage">Stage {p.stage}</span>
              </a>
            </li>
          ))}
        </ul>

        <h3 className="fio-dls-sub">Data</h3>
        <ul className="fio-dls-list">
          {dataFiles.map((d) => (
            <li key={d.file}>
              <a className="fio-dls-item" href={`${ASSETS}/${d.file}`} download>
                <code className="fio-dls-name">{d.file}</code>
                <span className="fio-dls-note">{d.note}</span>
                <span className="fio-dls-stage">Stage 5</span>
              </a>
            </li>
          ))}
        </ul>

        <p className="fio-dls-foot">
          There is no <code className="aw-code">test.txt</code> here on purpose.
          You write it in stage 3, and stage 4 reads back the bytes you wrote.
        </p>
      </div>
    </section>
  );
}
