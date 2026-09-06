import React from "react";

/* Appears once the reader is far enough down that the masthead is a long way
   back. Opacity and pointer-events are driven imperatively by
   useScrollProgress so the control does not re-render on every scroll frame. */
export const BackToTop = React.forwardRef(function BackToTop(_props, ref) {
  return (
    <a ref={ref} href="#top" aria-label="Return to the top of the page" className="dls-totop"
      style={{
        position: "fixed", right: 24, bottom: 24, zIndex: 40,
        display: "flex", alignItems: "center", justifyContent: "center",
        width: 46, height: 46, borderRadius: "var(--radius-md)",
        background: "var(--green-800)", color: "var(--neutral-0)",
        border: "1px solid var(--gold-500)", textDecoration: "none",
        fontSize: "var(--text-lg)", opacity: 0, pointerEvents: "none"
      }}>
      <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.75"
        strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M12 19V5" /><path d="M5 12l7-7 7 7" />
      </svg>
    </a>
  );
});
