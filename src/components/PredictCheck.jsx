import React from "react";

/* The checkpoint that asks what the code WILL DO, before the answer is shown.

   SelfCheck and PredictCheck look alike and are not the same instrument.
   SelfCheck asks what is on the reader's screen: it verifies a state that
   already exists, so that an error surfaces where it happened. PredictCheck
   asks for a commitment about a state that does not exist yet — where the
   stream position lands after an fgets, what a second run of a "w" program
   leaves in the file — and only then reveals what actually happens.

   Prediction before feedback is what makes the prose instrumentally necessary.
   A student cannot guess where the cursor lands after fgets without having read
   the paragraph above it, and cannot skim past the question either, because the
   page will not move on until an answer has been committed. The interactivity
   is a gate that the prose is the key to, rather than a second thing on the
   screen competing with the prose for attention. That is also why nothing here
   is scored: a prediction that turns out wrong is the most useful event on the
   page, and anything that made it feel like a mark would teach the reader to
   answer defensively instead of honestly.

   Consequences of that, all deliberate:

   - `correct` never reaches the DOM before a selection is made. Order, markup,
     class names and attributes are identical across the options, so the answer
     cannot be read off the page by inspecting it, and a reader who hovers over
     the buttons learns nothing. The options are NOT shuffled at runtime: the
     page is meant to render the same way every time it is opened, so that an
     instructor can refer to "the second option" in a lab session.

   - A wrong choice is answered with the reason that reading fails, in the same
     voice and the same colours as the right one. No rebuke, no red cross, no
     "incorrect". It is treated as the other thing a reader might genuinely have
     thought, because usually it is.

   - Every option stays selectable afterwards, exactly as in SelfCheck, so the
     way out of a wrong answer is to understand it and then choose the right
     one. Nothing is ever locked.

   - Once the correct option has been chosen, every note opens at once. Most of
     the learning is in the distractors: knowing why the plausible wrong reading
     fails is worth more than knowing which button was green. */

/* Progress semantics are fixed by the page, not by this component. A step
   counts as done when answers[step.id] === "ok", so the correct option must
   report the literal string "ok" and every other option must report its own id.
   Storing the id rather than a generic "alt" is what lets a returning reader
   see the same note they saw before reopening the page. */
export function PredictCheck({ question, options, value, onAnswer, label = "Predict" }) {
  const uid = React.useId();

  // Answering correctly is the only condition that opens every note. It is
  // derived from the stored value rather than from a second piece of state so
  // that a reader who reloads the page sees exactly what they left behind.
  const solved = value === "ok";
  const correctId = options.find((o) => o.correct)?.id;

  const isSelected = (o) => (solved ? o.id === correctId : value === o.id);

  // is-solved is what allows the chosen option to be tinted only once the
  // prediction has been confirmed. Before that a chosen option is marked in a
  // neutral way, because tinting a wrong choice would be a red cross by another
  // name, and the notes are meant to carry the correction instead.
  return (
    <div className={`pc-box${solved ? " is-solved" : ""}`}>
      <div className="pc-eyebrow">{label}</div>
      <p className="pc-question">{question}</p>

      {/* The live region is on each note rather than around the whole set. A
          region wrapping every option announced the note twice — once as an
          insertion and again as the pressed button's description — and on a
          correct answer, when every note opens at once, it read the entire set
          in a single burst. Per-note is the announcement a reader wants. */}
      <div className="pc-options">
        {options.map((o) => {
          const selected = isSelected(o);
          const showNote = solved || value === o.id;
          const noteId = `${uid}-note-${o.id}`;

          return (
            <div className="pc-option" key={o.id}>
              <button
                type="button"
                className={`pc-choice${selected ? " is-chosen" : ""}`}
                aria-pressed={selected}
                aria-describedby={showNote ? noteId : undefined}
                onClick={() => onAnswer(o.correct ? "ok" : o.id)}
              >
                {o.label}
              </button>

              {showNote && (
                <p className="pc-note" id={noteId} aria-live="polite">
                  {o.note}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
