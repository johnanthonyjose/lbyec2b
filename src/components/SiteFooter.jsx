import React from "react";

export function SiteFooter({ note }) {
  return (
    <footer style={{ background: "var(--green-900)", color: "var(--text-inverse)" }}>
      <div className="dls-section" style={{
        maxWidth: "var(--container-lg)", margin: "0 auto", padding: "40px 32px",
        display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 24, flexWrap: "wrap"
      }}>
        <div style={{
          fontFamily: "var(--font-display)", fontSize: "var(--text-md)", fontWeight: "var(--weight-semibold)",
          transform: "scaleX(.92)", transformOrigin: "left center"
        }}>De La Salle University</div>
        {note && <div style={{ fontSize: "var(--text-sm)", color: "rgba(255,255,255,0.6)" }}>{note}</div>}
      </div>
    </footer>
  );
}
