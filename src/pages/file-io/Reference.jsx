import React from "react";
import { programs, dataFiles, ASSETS } from "./programs.jsx";

/* The half of a handout that is not a walkthrough.

   The original document did two jobs. It taught the topic once, and then it
   was the thing you looked at forever afterwards — and its two function tables
   were the most useful objects in it, because they are what a student screen-
   shots and what a lecturer points at.

   The first version of this page did only the teaching. Worse, it obstructed
   the looking-up: stages were sealed until the one before them was finished,
   so a student revising for the Week 12 practical could not scan it, and
   anyone wanting getDelimitedItem had to answer seventeen checkpoints to
   reach it. That is why it did not feel like a substitute even where the
   content was present.

   So this section is always open, never gated, sits at the foot of the page,
   and is the first thing in the print stylesheet. Nothing here teaches. It is
   deliberately terse: every row is something a reader already met in a stage
   and now needs only to be reminded of. */

export function Reference() {
  return (
    <section id="reference" className="fio-ref-wrap" aria-labelledby="reference-heading">
      <div className="dls-section fio-ref">
        <h2 className="aw-eyebrow" id="reference-heading">Reference</h2>
        <p className="fio-ref-lede">
          Everything on one screen, for after you have worked through the
          stages. Nothing here is locked, and this section prints on its own.
        </p>

        <div className="fio-ref-grid">
          <Card title="Opening a file" note="Every one of these can fail. Check the result.">
            <Table rows={[
              ["FILE *fp;", "Declares a handle. One per open file."],
              ['fopen("f.txt","r")', "Open to read. NULL if it is not there."],
              ['fopen("f.txt","w")', "Create, or empty an existing file."],
              ['fopen("f.txt","a")', "Append. Keeps what is already there."],
              ["fclose(fp)", "Flushes the buffer and releases the file."]
            ]} />
            <Note>
              <code className="aw-code">"w"</code> empties the file the moment it
              opens, before anything is written.
            </Note>
          </Card>

          <Card title="Writing" note="Declared in stdio.h, not stdlib.h.">
            <Table rows={[
              ["fprintf(fp, ...)", "printf, but into a file. Formats values."],
              ['fputs("text", fp)', "Writes a string. String first, file second."],
              ["fputc('c', fp)", "Writes one character. Single quotes."]
            ]} />
            <Note>
              Output sits in a buffer until the buffer fills, until{" "}
              <code className="aw-code">fclose</code>, or until the program ends
              normally. A program that crashes first loses it.
            </Note>
          </Card>

          <Card title="Reading" note="Each one moves the stream position.">
            <Table rows={[
              ["fgetc(fp)", "One character. Store it in an int, not a char."],
              ["fgets(s, n, fp)", "One line, up to n-1 chars. Keeps the newline."],
              ["fscanf(fp, ...)", "scanf from a file. %s stops at whitespace."],
              ["feof(fp)", "After the loop, not in it. Says the file ran out."],
              ["ferror(fp)", "After the loop. Says something went wrong."]
            ]} />
            <Note>
              Loop on what the read returns —{" "}
              <code className="aw-code">while (fgets(...) != NULL)</code> — never
              on <code className="aw-code">feof</code>.
            </Note>
          </Card>

          <Card title="Naming the file" note="A bare name means the folder you ran from.">
            <Table rows={[
              ['"cars.txt"', "In the working directory. Usually what you want."],
              ['"../cars.txt"', "The parent directory."],
              ['"C:/temp/cars.txt"', "Absolute. Forward slashes work on Windows."],
              ['"C:\\\\temp\\\\cars.txt"', "Absolute, backslashes doubled."]
            ]} />
            <Note>
              <code className="aw-code">"C:\temp\cars.txt"</code> is a trap:{" "}
              <code className="aw-code">\t</code> is a tab, so that path cannot
              exist and the compiler says nothing.
            </Note>
          </Card>

          <Card title="Delimiters" note="What separates one item from the next.">
            <Table rows={[
              ["a newline", "One field per line. Simplest to read."],
              ["a comma", "CSV. Breaks if a field contains a comma."],
              [":|:", "A sequence your data will never contain."],
              ["sscanf(s, \"%i\", &n)", "Turns a field of text into a number."]
            ]} />
            <Note>
              Check what <code className="aw-code">sscanf</code> returns. A 1
              means the number was really there.
            </Note>
          </Card>

          <Card title="The programs" note="All verified. Downloads.">
            <ul className="fio-ref-progs">
              {programs.map((p) => (
                <li key={p.file}>
                  <a className="fio-ref-prog" href={`${ASSETS}/${p.file}`} download>
                    <code>{p.file}</code>
                    <span>{p.note}</span>
                  </a>
                </li>
              ))}
              {dataFiles.map((d) => (
                <li key={d.file}>
                  <a className="fio-ref-prog" href={`${ASSETS}/${d.file}`} download>
                    <code>{d.file}</code>
                    <span>{d.note}</span>
                  </a>
                </li>
              ))}
            </ul>
            <Note>
              There is no <code className="aw-code">test.txt</code> to download.
              You write it in stage 3.
            </Note>
          </Card>
        </div>

        <p className="fio-ref-print">
          This section is what prints if you print the page. The stages do not:
          they are meant to be worked through, not carried.
        </p>
      </div>
    </section>
  );
}

function Card({ title, note, children }) {
  return (
    <section className="fio-ref-card">
      <h3 className="fio-ref-card-title">{title}</h3>
      <p className="fio-ref-card-note">{note}</p>
      {children}
    </section>
  );
}

function Table({ rows }) {
  return (
    <div className="fio-ref-scroll">
      <table className="fio-ref-table">
        <tbody>
          {rows.map(([a, b]) => (
            <tr key={a}>
              <th scope="row"><code>{a}</code></th>
              <td>{b}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Note({ children }) {
  return <p className="fio-ref-foot">{children}</p>;
}
