import React from "react";
import { RepoMark, FolderMark, RunMark, PushMark, CheckMark } from "./OutcomeMarks.jsx";

/* The five stages.

   A stage owns its own numbering. Every denominator a reader sees is local to
   the stage they are in — "3 of 7", never "17 of 30" — and the largest number
   the page can ever display is 7.

   That is the whole point of the structure. The work is the same either way,
   but a reader who is told there are thirty steps ahead of them decides it is
   too long before starting, and a reader who is told there are five short
   stages and about twenty-five minutes does not. So minutes are published and
   counts are not: TOTAL_MINUTES below is rendered on the page, and there is
   deliberately no TOTAL_STEPS beside it. */

export const stages = [
  {
    n: 1,
    title: "Obtaining your repository",
    goal: "Turn the link your instructor posted into a repository that belongs to you.",
    minutes: 5,
    outcome: {
      name: "Repository issued",
      mark: RepoMark,
      have: (
        <>
          A repository of your own, named <code className="aw-code">welcome-<em>yourusername</em></code>{" "}
          inside the course organisation. It holds your copy of the exercise, and
          nobody else can write to it.
        </>
      )
    }
  },
  {
    n: 2,
    title: "Cloning to your computer",
    goal: "Bring that repository down onto your own laptop and open it in VS Code.",
    minutes: 6,
    outcome: {
      name: "Local working copy",
      mark: FolderMark,
      have: (
        <>
          A folder on your machine containing <code className="aw-code">ex1.c</code>, still
          joined to GitHub. From here on you have two things open and you will
          keep moving between them: VS Code, where you write, and GitHub, where
          the work is marked.
        </>
      )
    }
  },
  {
    n: 3,
    title: "Completing the exercise",
    goal: "Fill in the code, run it, and check it against the table in the specification.",
    minutes: 8,
    outcome: {
      name: "Verified output",
      mark: RunMark,
      have: (
        <>
          A program that compiles, runs, and prints exactly what the specification
          said it should — checked by you, on your own machine, before anyone else
          sees it.
        </>
      )
    }
  },
  {
    n: 4,
    title: "Committing and uploading",
    goal: "Record what you changed and send it to GitHub.",
    minutes: 4,
    outcome: {
      name: "Work uploaded",
      mark: PushMark,
      have: (
        <>
          Your answer on GitHub rather than only on your laptop. Until this stage
          it existed in one place, and a lost laptop was a lost assignment.
        </>
      )
    }
  },
  {
    n: 5,
    title: "Confirming your submission",
    goal: "Let GitHub mark the work, then hand the link to Canvas.",
    minutes: 3,
    outcome: {
      name: "Submission confirmed",
      mark: CheckMark,
      have: (
        <>
          A green check against your commit and a submitted Canvas assignment.
          Both are required: the check says the code is right, and the Canvas
          submission is what records that you handed it in.
        </>
      )
    }
  }
];

export const stageByN = Object.fromEntries(stages.map((s) => [s.n, s]));

export const TOTAL_STAGES = stages.length;

/* Published on the page. Rounded down to the nearest five so it reads as an
   estimate rather than a promise. */
export const TOTAL_MINUTES = Math.floor(
  stages.reduce((t, s) => t + s.minutes, 0) / 5
) * 5;
