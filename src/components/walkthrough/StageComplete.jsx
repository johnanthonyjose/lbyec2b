import React from "react";
import { Button } from "../ds/index.js";

/* The moment a stage ends.

   It takes the whole screen for three reasons. It marks the end of something,
   which a reader who has just done six fiddly things in another application has
   earned. It states what they now hold, so progress reads as an acquisition
   rather than a count of tasks discharged. And it is the designed place to
   stop — a reader who walks away here walks away at a clean boundary rather
   than half way through a clone, or half way through a read loop.

   Naming the next stage and its cost in minutes is what makes continuing feel
   small. "About six minutes" is a much easier thing to agree to than an
   unbounded remainder.

   Shared by every staged handout, so the stage list and the closing words are
   props. `finale` carries the two things that cannot be derived — what to call
   the end of this particular procedure, and what the reader has when it is
   over. */

const eyebrow = {
  fontSize: "var(--text-2xs)", fontWeight: 700, letterSpacing: "var(--tracking-wider)",
  textTransform: "uppercase"
};

export function StageComplete({ stage, stages, next, onContinue, onLater, onRestart, finale }) {
  const panelRef = React.useRef(null);

  React.useEffect(() => {
    panelRef.current?.focus();
  }, []);

  React.useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") onLater(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onLater]);

  const Mark = stage.outcome.mark;
  const final = !next;

  return (
    <div className="aw-done-scrim" role="dialog" aria-modal="true" tabIndex={-1} ref={panelRef}
      aria-label={`Stage ${stage.n} complete: ${stage.outcome.name}`}>
      <div className="aw-done">
        <div style={{ ...eyebrow, color: "var(--gold-300)" }}>
          {final ? finale.eyebrow : `Stage ${stage.n} of ${stages.length} complete`}
        </div>

        {final ? (
          <ul className="aw-done-marks" aria-label="What you have">
            {stages.map((s) => {
              const M = s.outcome.mark;
              return (
                <li key={s.n}>
                  <M size={62} />
                  <span>{s.outcome.name}</span>
                </li>
              );
            })}
          </ul>
        ) : (
          <div className="aw-done-mark"><Mark size={116} /></div>
        )}

        <h2 className="aw-done-title">
          {final ? finale.title : stage.outcome.name}
        </h2>

        <p className="aw-done-have">
          {final ? finale.have : stage.outcome.have}
        </p>

        {next ? (
          <>
            <div className="aw-done-next">
              <span style={{ ...eyebrow, color: "var(--gold-300)" }}>Next</span>
              <p>
                <strong>Stage {next.n} — {next.title}</strong><br />
                {next.goal} About {next.minutes} minutes.
              </p>
            </div>
            <div className="aw-done-actions">
              <Button variant="gold" size="lg" onClick={onContinue}>
                Begin Stage {next.n}
              </Button>
              <button type="button" className="aw-later" onClick={onLater}>
                Not now
              </button>
            </div>
          </>
        ) : (
          <div className="aw-done-actions">
            <Button variant="gold" size="lg" onClick={onLater}>Close</Button>
            <button type="button" className="aw-later" onClick={onRestart}>
              Clear my progress
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

/* A stage finished but already acknowledged still needs a way forward — the
   completion panel only appears once. */
export function StageDoneFooter({ stage, next, onContinue, allDone, onRestart }) {
  return (
    <div className="aw-stagedone">
      <div style={{ minWidth: 0, flex: 1 }}>
        <div className="aw-eyebrow" style={{ color: "var(--green-800)" }}>
          Stage {stage.n} complete · {stage.outcome.name}
        </div>
        <p className="aw-stagedone-have">{stage.outcome.have}</p>
      </div>
      {next ? (
        <Button variant="primary" onClick={onContinue} style={{ height: 44 }}>
          Begin Stage {next.n}
        </Button>
      ) : allDone ? (
        <button type="button" className="aw-nav-btn" onClick={onRestart}>
          Clear my progress
        </button>
      ) : null}
    </div>
  );
}
