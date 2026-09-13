import React from "react";

/* A short screen recording that plays on its own and repeats.

   These began as GIFs, which loop from the moment the page loads whether or not
   anyone is looking. That was worth removing: in the source document four of
   them repeated forever down a long scroll, moving in the corner of the eye of
   somebody trying to read something else.

   Playing automatically is a different thing here. This page shows one step at
   a time, so the clip on screen is the demonstration the reader is actually on
   rather than something moving beside unrelated text, and having it already
   running saves a click at the moment their hands are busy in another
   application. Browsers hold off on muted autoplay video that is scrolled out
   of view, so nothing plays away in a part of the page nobody is reading.

   The exception is prefers-reduced-motion. That is set by people for whom
   movement genuinely interferes with reading, and it is not a preference to
   weigh against convenience — those readers keep the still frame and start the
   clip themselves. */

const REDUCED = "(prefers-reduced-motion: reduce)";

export function Clip({ src, poster, width, height, caption, note, maxWidth }) {
  const videoRef = React.useRef(null);
  const [reduced, setReduced] = React.useState(false);
  const [manual, setManual] = React.useState(false);

  React.useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const mq = window.matchMedia(REDUCED);
    setReduced(mq.matches);
    const onChange = () => setReduced(mq.matches);
    mq.addEventListener ? mq.addEventListener("change", onChange) : mq.addListener(onChange);
    return () => {
      mq.removeEventListener ? mq.removeEventListener("change", onChange) : mq.removeListener(onChange);
    };
  }, []);

  // No IntersectionObserver here, deliberately. An observer pausing clips that
  // have scrolled away sounds like the considerate thing to do, but browsers
  // already decline to run muted autoplay video that is off screen, so it
  // duplicated the platform — and it could only ever subtract, because a false
  // reading pauses a clip the reader is looking at. Plain autoplay is both
  // simpler and the thing that actually works.

  const frame = {
    position: "relative", display: "block", width: "100%", padding: 0,
    border: "1px solid var(--border-default)", background: "var(--neutral-900)", lineHeight: 0
  };

  // Reduced motion, and the reader has not asked for it: the still frame.
  const stillOnly = reduced && !manual;

  return (
    <figure className="aw-clip-fig" style={{ margin: "20px 0 0", maxWidth: maxWidth || width }}>
      {caption && <figcaption>{caption}</figcaption>}

      {stillOnly ? (
        <button type="button" className="aw-clip" onClick={() => setManual(true)}
          style={{ ...frame, cursor: "pointer" }}
          aria-label={caption ? `Play the recording: ${caption}` : "Play the recording"}>
          <img src={poster} alt="" width={width} height={height}
            style={{ width: "100%", height: "auto", display: "block" }} />
          <span className="aw-clip-play" aria-hidden="true">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor">
              <path d="M8 5.5v13l11-6.5z" />
            </svg>
          </span>
        </button>
      ) : (
        <div style={frame}>
          <video ref={videoRef} src={src} poster={poster} width={width} height={height}
            muted loop playsInline controls preload="auto" autoPlay
            style={{ width: "100%", height: "auto", display: "block" }} />
        </div>
      )}

      <p className="aw-clip-note">
        {note || (stillOnly
          ? "Still frame. Select it to play the recording."
          : "Plays as you reach it and repeats. Use the controls to pause.")}
      </p>
    </figure>
  );
}
