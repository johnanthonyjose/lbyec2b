import React from "react";
import { SelfCheck } from "../../components/SelfCheck.jsx";
import { AppStrip } from "./AppStrip.jsx";
import { Why } from "./Why.jsx";
import { sizeOfStage } from "./steps.jsx";

/* One step, in a fixed order of reading:

     where you are        the application strip
     what to do           one imperative, in the green rule — the largest thing here
     what you will see    prose, then a small figure
     why                  folded away
     did it work          the checkpoint

   The order is half the argument; the sizing is the other half. Reading order
   counts for nothing if the figure is the biggest element on the page, because
   the eye goes to the largest thing before it goes to the first thing. So the
   instruction is set larger than the prose around it and the figure is held
   well below the width of the text column. */

export function Step({ step, answer, onAnswer, onOpenFix }) {
  const total = sizeOfStage(step.stage);

  return (
    <article>
      <div className="aw-step-head">
        <span className="aw-step-num">{String(step.n).padStart(2, "0")}</span>
        <span className="aw-step-count">Step {step.n} of {total} in this stage</span>
      </div>

      <AppStrip app={step.app} />

      <h2 className="aw-step-title">{step.title}</h2>

      <div className="aw-action">
        <span className="aw-action-label">Do this</span>
        <span className="aw-action-text">{step.action}</span>
      </div>

      {step.body}

      {/* The figure sits after the instruction and inside a wrapper that keeps
          it small. Shown at full width it became the largest thing on screen,
          and readers went straight to it and never read the instruction at
          all — a rational response to what the page was emphasising. It is a
          reference for what the screen should look like, not the instruction
          itself, and it is sized to say so. Select it to enlarge. */}
      {step.figure && <div className="aw-figure">{step.figure}</div>}

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

      <SelfCheck
        label="Checkpoint"
        question={step.check.question}
        ok={step.check.ok}
        alt={step.check.alt}
        value={answer}
        onAnswer={onAnswer}
      />
    </article>
  );
}
