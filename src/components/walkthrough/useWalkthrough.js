import React from "react";
import { usePersistentState } from "../../hooks/index.js";

/* The state machine every staged handout runs on.

   It was written twice before this — once inline in the GitHub-account page and
   once inline in the assignment workflow — and the second copy had already
   started to drift from the first. The arithmetic here is small but every part
   of it is load-bearing: a stage opens only when the one before it is finished,
   a step counts as finished only when its checkpoint has been answered `ok`,
   and all of it survives a reload. Getting any of that subtly wrong on one page
   and not the other is the kind of bug nobody reports, because the page still
   looks like it works.

   The hook owns the core: which stage, which step, which answers, and what is
   derived from them. It does not own the gate in front of stage 1, because each
   handout gates on something different — a list of prerequisites on one, a
   working compiler on another. `isGateOpen` is therefore passed in as a
   predicate over the stored record rather than as a boolean: the gate on the
   assignment workflow is computed from prerequisites that live in that same
   record, so a boolean would have to be derived before the record exists.

   Pages that need extra persisted state of their own (a platform choice, a set
   of ticked prerequisites) pass it in `extraInitial` and write it through the
   returned `save`. It rides in the same localStorage record, so a reader's
   place and their preferences are saved and cleared together. */

export function useWalkthrough({
  storageKey,
  stages,
  stepsInStage,
  sizeOfStage,
  stepAt,
  isGateOpen = () => true,
  /* When true, every stage can be opened at any time. The stage map still
     shows the intended order and still marks what has been finished, so a
     first-time reader is guided exactly as before — but a reader who is not
     reading for the first time is not held up.

     Sealing stages is right for a procedure whose steps must happen in order,
     which is what the assignment workflow is: cloning before committing is not
     a preference. It is wrong for a handout, which also has to serve the
     student revising the night before the practical exam and the lecturer
     pointing at one table mid-session. Handout 03 is the second kind, and
     locking it was the single thing that most stopped it substituting for the
     document it replaced. */
  unlocked = false,
  extraInitial = {}
}) {
  const INITIAL = React.useMemo(
    () => ({
      v: 1,
      answers: {},      // { "S3.4": "ok" | something else }
      stage: 0,         // 0 = not started; the gate is still in front of the reader
      step: 1,
      acknowledged: [], // stages whose completion panel has been dismissed
      ...extraInitial
    }),
    // extraInitial is a literal at every call site, so comparing its contents
    // rather than its identity keeps this from rebuilding on every render.
    [JSON.stringify(extraInitial)]
  );

  const [saved, save] = usePersistentState(storageKey, INITIAL);

  const answers = saved.answers || {};
  const totalStages = stages.length;

  /* ---- derived state, all pure functions of what is stored ---- */

  const doneIn = (n) => stepsInStage(n).filter((s) => answers[s.id] === "ok").length;
  const isComplete = (n) => doneIn(n) === sizeOfStage(n);
  const gateOpen = isGateOpen(saved);
  const isOpen = (n) => unlocked || (n === 1 ? gateOpen : isComplete(n - 1));

  const stage = saved.stage || 0;
  const started = stage >= 1;
  const size = started ? sizeOfStage(stage) : 0;
  const step = started ? Math.min(size, Math.max(1, saved.step || 1)) : 1;
  const current = started ? stepAt(stage, step) : null;

  /* The completion panel appears when the stage in hand is finished and has not
     been dismissed. Dismissal is what writes, not mounting, so reloading while
     it is open shows it again — which is right, that reader never saw the end
     of it. */
  const showComplete =
    started && isComplete(stage) && !(saved.acknowledged || []).includes(stage);

  const allDone = stages.every((s) => isComplete(s.n));

  const pct = started
    ? Math.round(((stage - 1 + doneIn(stage) / size) / totalStages) * 100)
    : 0;

  const progressLabel = started
    ? `Stage ${stage} of ${totalStages} — ${doneIn(stage)} of ${size} in this stage`
    : "Not started";

  /* ---- transitions ---- */

  const goStage = (n) => save({ ...saved, stage: n, step: 1 });
  const goStep = (n) => save({ ...saved, step: Math.min(size, Math.max(1, n)) });
  const answer = (id, value) => save({ ...saved, answers: { ...answers, [id]: value } });

  const acknowledge = (extra = {}) =>
    save({
      ...saved,
      acknowledged: Array.from(new Set([...(saved.acknowledged || []), stage])),
      ...extra
    });

  /* Clearing progress keeps whatever the page named in `keepOnRestart`. A
     platform choice is a preference, not progress, and making someone set it
     again would be a small rudeness. */
  const restart = (keepOnRestart = {}) => save({ ...INITIAL, ...keepOnRestart });

  return {
    saved, save,
    answers, stage, step, size, current, started,
    doneIn, isComplete, isOpen, showComplete, allDone,
    pct, progressLabel, totalStages, gateOpen,
    goStage, goStep, answer, acknowledge, restart
  };
}

/* Scrolls an anchor into view, clearing the sticky masthead. Shared because
   both handouts need the same offset and a wrong one puts the heading under
   the header, where it reads as though the page simply did not move. */
export function scrollToId(id, offset = 72) {
  const el = document.getElementById(id);
  if (!el) return;
  /* site.css sets html{scroll-behavior:auto} under prefers-reduced-motion, but
     an explicit behavior here overrides that property outright. This fires on
     every stage transition and on every return from a resolution, so it has to
     honour the preference itself. */
  const still = window.matchMedia
    && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  window.scrollTo({ top: el.offsetTop - offset, behavior: still ? "auto" : "smooth" });
}
