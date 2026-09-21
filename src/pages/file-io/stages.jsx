import React from "react";
import { OpenMark, WriteMark, ReadMark, TableMark } from "./OutcomeMarks.jsx";

/* The four stages of the File I/O handout.

   The source document was organised the way a reference is organised: by
   language feature. Five numbered headings — which library, how to reference,
   how to create, how to write, how to read — each opening onto everything
   there is to say about that feature. That order serves somebody who already
   knows what they are looking for, and nobody else.

   These five are ordered by what the reader ends up holding instead. Each one
   leaves a file on their own disk that the next one consumes, so the sequence
   is a single programme of work rather than five topics that happen to share a
   chapter. Stage 3 writes test.txt; stage 4 reads the very bytes stage 3 wrote;
   stage 5 does the same thing to data worth reading.

   There were five. The first produced no file: it had the reader watch a
   program forget a number, then explained process address spaces. It was cut
   because the motivation it manufactured is already supplied by the machine
   problem the reader arrived with, and because its one load-bearing idea — that
   text and binary are two contracts for reading the same bytes — belongs
   immediately before opening a file rather than a stage earlier. That idea is
   now the first step of stage 1.

   As on the assignment workflow, minutes are published and step counts are
   not. The figure that makes a reader close the tab is the one this page
   never prints. */

export const stages = [
  {
    n: 1,
    title: "Opening a file",
    goal: "Tell a text file from a binary one, get a FILE pointer, and make your program say so out loud when it cannot.",
    minutes: 14,
    outcome: {
      name: "An honest open",
      mark: OpenMark,
      have: (
        <>
          The distinction between a text file and a binary one, and a program
          that opens a file and, when it cannot, tells you exactly why instead
          of ending in silence — and that can hold an input and an
          output open at once, which is what nearly every real program does.
          Checking the open is the single habit that saves the most time this
          week: an unchecked{" "}
          <code className="aw-code">fopen</code> is why a program runs, prints
          nothing, and exits as though everything were fine.
        </>
      )
    }
  },
  {
    n: 2,
    title: "Writing to a file",
    goal: "Put text on disk with fprintf, fputs and fputc, and understand why fclose is not optional.",
    minutes: 10,
    outcome: {
      name: "A file of your own",
      mark: WriteMark,
      have: (
        <>
          A real <code className="aw-code">test.txt</code> in your project
          folder, written by your program and readable in any editor — and an
          understanding of the <strong>write buffer</strong>, which is why the
          file can still be empty after a program that appeared to work.
        </>
      )
    }
  },
  {
    n: 3,
    title: "Reading it back",
    goal: "Read the file a character, then a line at a time, and keep track of where the cursor is.",
    minutes: 12,
    outcome: {
      name: "Data back in memory",
      mark: ReadMark,
      have: (
        <>
          Your own file read back into your own variables, and — the part that
          actually makes reading difficult — a working picture of the{" "}
          <strong>stream position</strong>, the invisible cursor that every read
          moves and that decides what the next one gets.
        </>
      )
    }
  },
  {
    n: 4,
    title: "Data worth reading",
    goal: "Use a delimiter to store several fields per record, and turn a CSV file into a formatted table.",
    minutes: 16,
    outcome: {
      name: "A table from a file",
      mark: TableMark,
      have: (
        <>
          A program that reads <code className="aw-code">cars.csv</code> and
          prints it as an aligned table. This is the same shape as the pipeline
          you build in MATLAB in Week 7, and the one your team project is
          measured on in Week 13 — you have now written it once, by hand, in C.
        </>
      )
    }
  }
];

export const stageByN = Object.fromEntries(stages.map((s) => [s.n, s]));

export const TOTAL_STAGES = stages.length;

/* Published on the page, rounded down to the nearest five so it reads as an
   estimate rather than a promise. */
export const TOTAL_MINUTES = Math.floor(
  stages.reduce((t, s) => t + s.minutes, 0) / 5
) * 5;
