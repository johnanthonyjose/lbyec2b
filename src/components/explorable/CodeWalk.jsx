import React from "react";
import { useScrub, ScrubBar, Explorable } from "./Scrub.jsx";

/* Walking a real program, one statement at a time.

   Three of this handout's figures are bespoke because what they draw is
   bespoke: a grid of bytes, a buffer emptying into a file, two loops running
   in parallel. But once ParseWalker was rebuilt around the source it explains,
   the middle of it turned out not to be specific to parsing at all. Source on
   the left with the executing line marked, an explanation of that line on the
   right, and a small panel of live values is what several other steps need,
   and building it five more times would repeat the mistake the walkthrough
   engine was extracted to stop.

   So this is that middle band, generalised, and everything particular to a
   program lives in the data a step passes it.

   The design rule it inherits from the rest of the handout is the important
   one: THIS COMPONENT SIMULATES NOTHING. It does not evaluate C, infer a line
   number, or compute a variable. Every frame is authored against a program
   that was compiled and run, and the component's only job is to render the
   frame it is given. That is what makes a figure here evidence rather than an
   illustration, and it is why the handout can claim its numbers came from
   ftell rather than from a guess.

   `tracks` exists for programs whose interesting behaviour is the branch. One
   run of 01-open.c finds the file and one does not, and the whole point of the
   step is the difference; a figure that could only show one of them would be
   showing the uninteresting half. */

export function CodeWalk({
  title,
  notice,
  caption,
  file,
  source,          // [{ n, src }] — real line numbers, real text
  tracks,          // [{ id, label, frames }] — one or more runs of the program
  outputLabel = "Output"
}) {
  const runs = Array.isArray(tracks) && tracks.length ? tracks : [];
  const [track, setTrack] = React.useState(0);
  const run = runs[Math.min(track, runs.length - 1)] || { frames: [] };
  const frames = run.frames || [];

  const scrub = useScrub(frames.length);
  const frame = frames[Math.min(scrub.index, frames.length - 1)] || {};
  const marked = new Set(frame.lines || []);

  if (!frames.length || !Array.isArray(source)) return null;

  const vars = frame.vars && typeof frame.vars === "object" ? Object.entries(frame.vars) : [];
  const output = Array.isArray(frame.out) ? frame.out : [];

  const status =
    `${runs.length > 1 ? run.label + ". " : ""}` +
    `Statement ${scrub.index + 1} of ${frames.length}. ` +
    `Line ${(frame.lines || []).join(" and ") || "none"}. ` +
    `${frame.explain || ""}` +
    (vars.length ? ` Values: ${vars.map(([k, v]) => `${k} is ${v}`).join(", ")}.` : "") +
    (output.length ? ` Output so far: ${output.join(" / ")}.` : " No output yet.");

  return (
    <Explorable title={title} notice={notice} caption={caption} status={status}>
      <div className="cw">
        {/* The run selector, when a program's branch is the lesson. A radio
            group rather than a toggle: these are named alternatives, not an
            on/off state, and a reader should be able to see both names at
            once rather than discover the second by pressing the first. */}
        {runs.length > 1 && (
          <div className="cw-tracks" role="radiogroup" aria-label="Which run to follow">
            {runs.map((t, i) => (
              <button
                key={t.id}
                type="button"
                role="radio"
                aria-checked={i === track}
                className={`cw-track${i === track ? " is-on" : ""}`}
                onClick={() => { setTrack(i); scrub.reset(); }}
              >
                {t.label}
              </button>
            ))}
          </div>
        )}

        <div className="cw-grid">
          <div className="cw-code-wrap">
            <div className="cw-label">
              {file}
              {frame.lines && frame.lines.length ? (
                <span className="cw-label-meta">
                  line {frame.lines.join(", ")}
                </span>
              ) : null}
            </div>

            {/* aria-hidden because a screen reader walking a syntax-highlighted
                grid line by line learns nothing; the same content is in the
                status sentence, which is announced on every change. */}
            <div className="cw-scroll ex-scroll" tabIndex={0} role="region"
              aria-label={`${file}, scrollable`} aria-hidden="true">
              <pre className="cw-code"><code>
                {source.map((l) => {
                  const on = marked.has(l.n);
                  return (
                    <span key={l.n} className={`cw-line${on ? " is-on" : ""}`}>
                      <span className="cw-gutter">{on ? "▶" : ""}</span>
                      <span className="cw-n">{l.n}</span>
                      <span className="cw-src">{l.src === "" ? " " : l.src}</span>
                    </span>
                  );
                })}
              </code></pre>
            </div>
          </div>

          <div className="cw-side">
            <div className="cw-label">What that line did</div>
            <p className="cw-explain">{frame.explain}</p>

            {vars.length > 0 && (
              <dl className="cw-vars">
                {vars.map(([k, v]) => (
                  <React.Fragment key={k}>
                    <dt><code>{k}</code></dt>
                    <dd><code>{String(v)}</code></dd>
                  </React.Fragment>
                ))}
              </dl>
            )}

            {frame.note && <p className="cw-note">{frame.note}</p>}
          </div>
        </div>

        {/* The program's own output, accumulating. Several of these steps are
            about the difference between what a program does and what it
            prints, and that difference is invisible without showing both. */}
        <div className="cw-out-wrap">
          <div className="cw-label">{outputLabel}</div>
          <div className="cw-scroll ex-scroll" aria-hidden="true">
            <pre className="cw-out"><code>
              {output.length
                ? output.map((l, i) => (
                    <span key={i} className={`cw-out-line${i === output.length - 1 ? " is-new" : ""}`}>
                      {l === "" ? " " : l}
                    </span>
                  ))
                : <span className="cw-out-empty">nothing printed yet</span>}
            </code></pre>
          </div>
        </div>
      </div>

      <ScrubBar scrub={scrub} label={`${file}, statement by statement`}
        status={status} unit="statement" />
    </Explorable>
  );
}
