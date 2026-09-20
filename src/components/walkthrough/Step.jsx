import React from "react";
import { Why } from "./Why.jsx";

/* One step, in a fixed order of reading:

     where you are        the context slot — an application strip, a file strip
     what to do           one imperative, in the green rule — the largest thing here
     what you will see    prose, then media
     why                  folded away
     did it work          the checkpoint

   The order is half the argument; the sizing is the other half. Reading order
   counts for nothing if the media is the biggest element on the page, because
   the eye goes to the largest thing before it goes to the first thing. So the
   instruction is set larger than the prose around it and figures are held well
   below the width of the text column.

   That lesson was learned on the assignment workflow, where a full-width figure
   meant readers went straight to it and never read the instruction at all — a
   rational response to what the page was emphasising. It is a reference for
   what the screen should look like, not the instruction itself, and it is sized
   to say so.

   The component is deliberately presentational. `context`, `media` and `check`
   are slots the page fills, because what belongs in them differs by handout: an
   application strip and a screenshot on one, a file strip and a live trace of a
   C program on another. Keeping the decision at the page means this file never
   grows a branch per handout. */

export function Step({ step, total, answer, onAnswer, onOpenFix, context, media, check }) {
  return (
    <article>
      <div className="aw-step-head">
        <span className="aw-step-num">{String(step.n).padStart(2, "0")}</span>
        <span className="aw-step-count">Step {step.n} of {total} in this stage</span>
      </div>

      {context}

      {/* h3, not h2: the stage title above is the h2, and a step sits inside
          a stage. Navigating this page by heading should reproduce that
          nesting rather than present every step as a peer of its own stage.
          All the styling is on the class, so the level is free to be correct. */}
      <h3 className="aw-step-title">{step.title}</h3>

      <div className="aw-action">
        <span className="aw-action-label">Do this</span>
        <span className="aw-action-text">{step.action}</span>
      </div>

      {step.body}

      {step.figure && <div className="aw-figure">{step.figure}</div>}

      {media}

      {step.why && <Why label={step.why.label}>{step.why.body}</Why>}

      {step.fix && (
        <button type="button" className="gh-warn aw-warn" onClick={onOpenFix}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--gold-600)"
            strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"
            style={{ flex: "none" }}>
            <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
            <path d="M12 9v4" /><path d="M12 17h.01" />
          </svg>
          <span style={{ flex: 1, minWidth: 0 }}>
            <span className="aw-warn-label">If this happens</span>
            <span className="aw-warn-text">{step.difficulty}</span>
          </span>
          <span className="aw-warn-cta">View resolution</span>
        </button>
      )}

      {check}
    </article>
  );
}

/* The previous/next pair under a step. Extracted with the step itself because
   the two were always rendered together and the disabled-at-the-ends logic was
   duplicated verbatim on both handouts. */
export function StepNav({ step, total, onGoStep }) {
  return (
    <nav className="aw-nav" aria-label="Move between steps">
      <button type="button" className="aw-nav-btn" onClick={() => onGoStep(step - 1)}
        disabled={step === 1}>
        Previous step
      </button>
      <span className="aw-nav-count">Step {step} of {total}</span>
      <button type="button" className="aw-nav-btn is-primary"
        onClick={() => onGoStep(step + 1)} disabled={step === total}>
        Next step
      </button>
    </nav>
  );
}
