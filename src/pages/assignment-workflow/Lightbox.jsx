import React from "react";

/* A figure at full size, on demand.

   The figures on this page are shown small deliberately — see the note on
   .aw-figure in site.css — and that would be a straightforward loss if the
   detail were gone for good. It is not: the small figure is the reference, and
   this is where a reader goes when they genuinely cannot find the control.

   The pins are redrawn here because they are positioned as percentages, so
   they track the image at any size. */

export function Lightbox({ figure, onClose }) {
  const panelRef = React.useRef(null);

  React.useEffect(() => { panelRef.current?.focus(); }, []);

  React.useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div className="aw-lightbox" onClick={onClose}>
      <div className="aw-lightbox-panel" ref={panelRef} tabIndex={-1}
        role="dialog" aria-modal="true" aria-label={`Enlarged figure: ${figure.alt}`}
        onClick={(e) => e.stopPropagation()}>
        <div className="aw-lightbox-bar">
          <span>Enlarged figure — the instruction is on the page behind this</span>
          <button type="button" onClick={onClose} aria-label="Close the enlarged figure">
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor"
              strokeWidth="2" strokeLinecap="round" aria-hidden="true">
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="aw-lightbox-shot">
          <img src={figure.src} alt={figure.alt} width={figure.width} height={figure.height} />
          {(figure.pins || []).map((p) => (
            <span key={p.n} className="gh-pin" style={{ left: p.left, top: p.top }}>{p.n}</span>
          ))}
        </div>
      </div>
    </div>
  );
}
