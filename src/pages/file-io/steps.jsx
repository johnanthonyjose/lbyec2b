import { steps12 } from "./steps-1-2.jsx";
import { steps34 } from "./steps-3-4.jsx";

/* The procedure, one action per step.

   The steps are split across two files purely for the size of them. A handout
   that covers writing, reading and delimited data in one pass runs to a couple
   of thousand lines of prose and code, and a single file that long is painful
   to work in and impossible to review. The split is at the stage boundary that
   divides producing a file from consuming one, which is also where the subject
   matter turns: everything before it puts bytes on a disk, everything after it
   is about the invisible cursor that walks over them.

   Fields, for anyone adding a step:
     id      stable storage key. Answers are stored against this, so a step can
             be renumbered or moved without orphaning a reader's progress.
     n       position within the stage. The only number ever displayed.
     title   sentence case, naming what this step is about.
     action  the single imperative. Rendered in the green "Do this" rule.
     body    what to look at and what it means. Optional.
     media   code, expected output, or a FileMachine trace. Optional.
     why     background, collapsed by default — never needed to proceed.
     fix     id into resolutions.jsx, for the few failures that genuinely branch.
     check   the checkpoint, and the one required field. `kind: "self"` verifies
             something already on the reader's screen; `kind: "predict"` asks
             them to commit to an answer before it is revealed. The page picks
             the component from `kind`.

   Prose is JSX rather than strings because nearly every line carries emphasis,
   a code span or a link. */

export const steps = [...steps12, ...steps34];

export const stepsInStage = (n) => steps.filter((s) => s.stage === n);

export const sizeOfStage = (n) => stepsInStage(n).length;

export const stepAt = (stage, n) => stepsInStage(stage)[n - 1];
