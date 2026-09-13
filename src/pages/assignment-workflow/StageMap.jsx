import React from "react";
import { stages } from "./stages.jsx";
import { stepsInStage } from "./steps.jsx";

/* Five rows. Never thirty.

   This component is where the page keeps its promise. The GitHub-account
   handout lays all seven of its steps out at once, which is fine at seven. Laid
   out the same way, this procedure would open with a wall of thirty titles —
   and a reader who counts thirty decides it is too long before starting.

   So the map shows the five stages, and only the stage in hand expands to its
   own steps. A finished stage collapses to one line naming what it produced. A
   stage not yet reached shows its title and its cost in minutes but no steps at
   all, so the road ahead is legible without being heavy.

   The step chips inside the open stage are numbered within the stage: the
   largest number this component can render is seven. */

export function StageMap({ stage, step, answers, isComplete, isOpen, onGoStage, onGoStep }) {
  return (
    <section className="aw-map-wrap" aria-label="Stages">
      <div className="dls-section aw-map-inner">
        <div className="aw-eyebrow">The five stages</div>
        <p className="aw-map-intro">
          One step is shown at a time. Each stage opens when the one before it is
          finished. Your place is kept on this device only — nothing here is
          submitted or graded.
        </p>

        <ol className="aw-map">
          {stages.map((s) => {
            const done = isComplete(s.n);
            const open = isOpen(s.n);
            const current = stage === s.n;
            const state = current ? "current" : done ? "done" : open ? "open" : "sealed";

            return (
              <li key={s.n} className={`aw-row is-${state}`}>
                <button type="button" className="aw-row-head"
                  onClick={() => open && onGoStage(s.n)}
                  disabled={!open}
                  aria-current={current ? "step" : undefined}
                  aria-disabled={!open || undefined}>
                  <span className="aw-row-chip" aria-hidden="true">
                    {done ? "✓" : s.n}
                  </span>
                  <span className="aw-row-text">
                    <span className="aw-row-title">
                      Stage {s.n} — {s.title}
                    </span>
                    <span className="aw-row-meta">
                      {done
                        ? s.outcome.name
                        : open
                          ? `${s.goal} About ${s.minutes} minutes.`
                          : `Opens after Stage ${s.n - 1}. About ${s.minutes} minutes.`}
                    </span>
                  </span>
                  {!open && (
                    <span className="aw-row-lock" aria-hidden="true">
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                        strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="4" y="11" width="16" height="9" rx="2" />
                        <path d="M8 11V7a4 4 0 0 1 8 0v4" />
                      </svg>
                    </span>
                  )}
                </button>

                {/* Only the stage in hand shows its steps. */}
                {current && (
                  <ol className="aw-steps">
                    {stepsInStage(s.n).map((st) => {
                      const ok = answers[st.id] === "ok";
                      const here = st.n === step;
                      return (
                        <li key={st.id}>
                          <button type="button"
                            className={`aw-stepchip${here ? " is-here" : ""}${ok ? " is-done" : ""}`}
                            aria-current={here ? "step" : undefined}
                            aria-label={`Step ${st.n} of this stage: ${st.title}${ok ? ", done" : ""}`}
                            onClick={() => onGoStep(st.n)}>
                            <span aria-hidden="true">{ok ? "✓" : st.n}</span>
                          </button>
                        </li>
                      );
                    })}
                  </ol>
                )}
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
