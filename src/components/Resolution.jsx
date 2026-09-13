import React from "react";

/* The modal behind an "anticipated difficulty" banner.

   Shared rather than copied because most of what is here is the accessibility
   contract — focus moved into the panel on open, Escape to close, the scrim
   closing on click but not the panel, role and aria-modal — and a second
   hand-written copy is exactly where one of those quietly goes missing.

   The only thing that varied between the two handouts was the wording of the
   return button, so that is a prop. */

const eyebrow = {
  fontSize: "var(--text-2xs)", fontWeight: 700, letterSpacing: "var(--tracking-wider)",
  textTransform: "uppercase", color: "var(--text-gold)"
};

export function Resolution({ fix, onClose, onReturn, returnLabel }) {
  const panelRef = React.useRef(null);

  // Move focus into the dialog on open so keyboard and screen-reader users
  // land on it rather than being left behind on the page.
  React.useEffect(() => {
    panelRef.current?.focus();
  }, []);

  React.useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div onClick={onClose} style={{
      position: "fixed", inset: 0, zIndex: 60, background: "var(--overlay-scrim)",
      display: "grid", placeItems: "center", padding: 24
    }}>
      <div ref={panelRef} tabIndex={-1} onClick={(e) => e.stopPropagation()}
        role="dialog" aria-modal="true" aria-label={`Resolution: ${fix.title}`}
        style={{
          background: "var(--surface-page)", width: "100%", maxWidth: 620, maxHeight: "84vh",
          overflowY: "auto", borderRadius: "var(--radius-md)",
          borderTop: "4px solid var(--gold-500)", boxShadow: "var(--shadow-lg)", outline: "none"
        }}>
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          gap: 16, padding: "22px 34px 0"
        }}>
          <span style={{ ...eyebrow, color: "var(--gold-700)" }}>Resolution</span>
          <button type="button" onClick={onClose} aria-label="Close" style={{
            cursor: "pointer", background: "transparent", border: "1px solid var(--border-default)",
            borderRadius: "var(--radius-md)", width: 36, height: 36, display: "grid",
            placeItems: "center", color: "var(--text-secondary)", flex: "none"
          }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
              strokeWidth="2" strokeLinecap="round" aria-hidden="true">
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div style={{ padding: "24px 34px 34px" }}>
          <h3 style={{
            fontFamily: "var(--font-display)", fontSize: "var(--text-xl)",
            fontWeight: "var(--weight-semibold)", margin: "0 0 18px", maxWidth: "36ch"
          }}>{fix.title}</h3>

          <div style={eyebrow}>Probable cause</div>
          <p style={{
            margin: "8px 0 22px", fontSize: "var(--text-base)",
            lineHeight: "var(--leading-relaxed)", color: "var(--text-secondary)"
          }}>{fix.cause}</p>

          <div style={eyebrow}>Procedure</div>
          <ol style={{
            margin: "12px 0 24px", paddingLeft: 22, display: "grid", gap: 10,
            fontSize: "var(--text-base)", lineHeight: "var(--leading-relaxed)", color: "var(--text-secondary)"
          }}>
            {fix.steps.map((s, i) => <li key={i}>{s}</li>)}
          </ol>

          <div style={{
            display: "flex", gap: 12, flexWrap: "wrap", paddingTop: 20,
            borderTop: "1px solid var(--border-subtle)"
          }}>
            <button type="button" onClick={onReturn} style={{
              cursor: "pointer", fontFamily: "var(--font-sans)", fontSize: "var(--text-sm)",
              fontWeight: 600, letterSpacing: "var(--tracking-wide)", background: "var(--green-700)",
              border: "1px solid var(--green-700)", borderRadius: "var(--radius-md)",
              color: "#fff", padding: "0 22px", minHeight: 44
            }}>{returnLabel}</button>
            <button type="button" onClick={onClose} style={{
              cursor: "pointer", fontFamily: "var(--font-sans)", fontSize: "var(--text-sm)",
              fontWeight: 600, letterSpacing: "var(--tracking-wide)", background: "transparent",
              border: "1px solid var(--border-default)", borderRadius: "var(--radius-md)",
              color: "var(--text-secondary)", padding: "0 22px", minHeight: 44
            }}>Close</button>
          </div>
        </div>
      </div>
    </div>
  );
}
