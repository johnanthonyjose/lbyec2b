import React from "react";
import { Button } from "../../components/ds/index.js";
import { stages } from "./stages.jsx";

/* The moment a stage ends.

   It takes the whole screen for three reasons. It marks the end of something,
   which a reader who has just done six fiddly things in another application has
   earned. It states what they now hold, so progress reads as an acquisition
   rather than a count of tasks discharged. And it is the designed place to
   stop — a reader who walks away here walks away at a clean boundary rather
   than half way through a clone.

   Naming the next stage and its cost in minutes is what makes continuing feel
   small. "About six minutes" is a much easier thing to agree to than an
   unbounded remainder. */

const eyebrow = {
  fontSize: "var(--text-2xs)", fontWeight: 700, letterSpacing: "var(--tracking-wider)",
  textTransform: "uppercase"
};

export function StageComplete({ stage, next, onContinue, onLater, onRestart }) {
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
          {final ? "All five stages complete" : `Stage ${stage.n} of 5 complete`}
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
          {final ? "Your assignment is submitted" : stage.outcome.name}
        </h2>

        <p className="aw-done-have">
          {final
            ? "Your code is on GitHub, it passed the check, and the link is recorded in Canvas. That is the whole workflow — every assignment this term follows the same five stages."
            : stage.outcome.have}
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
