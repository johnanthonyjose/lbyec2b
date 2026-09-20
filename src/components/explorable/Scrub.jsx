import React from "react";

/* The transport shared by every explorable figure on the site.

   Four figures teach four different mechanisms, but a reader should only have
   to learn one set of controls. Before this existed there was one figure with
   Previous and Next buttons; adding three more, each with its own idea of how
   to move through time, would have cost the reader more attention than the
   figures returned.

   The contract:

     - Nothing moves until the reader asks. There is no autoplay, on mount or
       on scroll. A figure that starts animating while someone is reading the
       paragraph above it has taken the attention the paragraph needed.
     - The timeline is the primary control and it is a real range input, so it
       arrives with keyboard support, arrow-key stepping, Home and End, and the
       platform's own focus ring, none of which a div can be made to imitate
       properly.
     - Play is offered but never assumed, and it stops at the end rather than
       looping. A loop is decoration; it also makes it impossible to tell
       whether you are watching the first pass or the fifth.
     - Under prefers-reduced-motion, play is withheld entirely rather than
       being made fast. The reader still has the timeline and the step
       buttons, so nothing is unreachable — only unanimated.

   `useScrub` returns both an integer frame index and a continuous position.
   Figures that show discrete states use the index; figures that interpolate
   (a caret sliding between two bytes) use the continuous value. Keeping both
   in one hook is what stops the two drifting apart mid-animation. */

const REDUCED = "(prefers-reduced-motion: reduce)";

export function prefersReducedMotion() {
  return typeof window !== "undefined"
    && typeof window.matchMedia === "function"
    && window.matchMedia(REDUCED).matches;
}

export function useScrub(length, { msPerFrame = 900 } = {}) {
  const last = Math.max(0, length - 1);
  const [pos, setPos] = React.useState(0);      // continuous, 0 .. last
  const [playing, setPlaying] = React.useState(false);
  const raf = React.useRef(0);
  const started = React.useRef(0);

  // A different figure is a different timeline. Keyed on the length rather
  // than on prop identity so an inline literal does not reset it every render.
  React.useEffect(() => { setPos(0); setPlaying(false); }, [length]);

  React.useEffect(() => {
    if (!playing) return undefined;

    const from = pos >= last ? 0 : pos;
    if (pos >= last) setPos(0);
    started.current = 0;

    const tick = (now) => {
      if (!started.current) started.current = now;
      const advanced = (now - started.current) / msPerFrame;
      const next = from + advanced;
      if (next >= last) {
        setPos(last);
        setPlaying(false);        // stop at the end; never loop
        return;
      }
      setPos(next);
      raf.current = requestAnimationFrame(tick);
    };

    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
    // `pos` is deliberately not a dependency: it changes every frame, and
    // depending on it would tear down and rebuild the loop sixty times a
    // second. The starting point is captured when play begins.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playing, last, msPerFrame]);

  const index = Math.round(pos);
  const stop = React.useCallback(() => setPlaying(false), []);

  return {
    pos,                                  // continuous, for interpolation
    index,                                // nearest frame, for discrete state
    last,
    playing,
    canPlay: last > 0 && !prefersReducedMotion(),
    seek: (v) => { stop(); setPos(Math.max(0, Math.min(last, v))); },
    step: (d) => { stop(); setPos((p) => Math.max(0, Math.min(last, Math.round(p) + d))); },
    toggle: () => setPlaying((p) => !p),
    reset: () => { stop(); setPos(0); }
  };
}

/* The control bar. Identical under every figure, deliberately. */
export function ScrubBar({ scrub, label, status, unit = "step" }) {
  const { index, last, playing, canPlay } = scrub;

  return (
    <div className="ex-transport">
      <div className="ex-controls" role="group" aria-label={`Move through ${label}`}>
        <button type="button" className="ex-btn" onClick={() => scrub.step(-1)}
          disabled={index === 0} aria-label={`Previous ${unit}`}>
          <Chevron dir="left" />
        </button>

        {canPlay && (
          <button type="button" className="ex-btn is-primary" onClick={scrub.toggle}
            aria-label={playing ? "Pause" : "Play"}>
            {playing ? <Pause /> : <Play />}
          </button>
        )}

        <button type="button" className="ex-btn" onClick={() => scrub.step(1)}
          disabled={index === last} aria-label={`Next ${unit}`}>
          <Chevron dir="right" />
        </button>

        {/* A real range input: keyboard, arrow keys, Home and End, and the
            platform focus ring all arrive for free and correctly. */}
        <input
          className="ex-range"
          type="range"
          min={0}
          max={last}
          step={1}
          value={index}
          onChange={(e) => scrub.seek(Number(e.target.value))}
          aria-label={`${label}: ${unit} ${index + 1} of ${last + 1}`}
          aria-valuetext={status}
        />

        <button type="button" className="ex-btn is-quiet" onClick={scrub.reset}
          disabled={index === 0}>Reset</button>
      </div>

      <p className="ex-status" aria-live="polite">{status}</p>
    </div>
  );
}

/* A figure's frame. Gives every explorable the same caption treatment, the
   same "what to notice" line, and the same landmark for assistive technology,
   so the four of them read as one instrument rather than four experiments. */
export function Explorable({ title, notice, caption, status, children }) {
  return (
    <figure className="ex" aria-label={title}>
      <div className="ex-head">
        <span className="ex-title">{title}</span>
        {notice && <span className="ex-notice">{notice}</span>}
      </div>

      <div className="ex-body">{children}</div>

      {/* The same information the drawing carries, as a sentence, for a reader
          who is not getting it from the drawing. */}
      {status && <p className="ex-sr">{status}</p>}

      {caption && <figcaption className="ex-caption">{caption}</figcaption>}
    </figure>
  );
}

function Chevron({ dir }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={dir === "left" ? "m15 18-6-6 6-6" : "m9 18 6-6-6-6"} />
    </svg>
  );
}

function Play() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M8 5.5v13l11-6.5z" />
    </svg>
  );
}

function Pause() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <rect x="7" y="5" width="4" height="14" rx="1" />
      <rect x="13" y="5" width="4" height="14" rx="1" />
    </svg>
  );
}
