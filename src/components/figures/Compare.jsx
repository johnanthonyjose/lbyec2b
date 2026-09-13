import React from "react";

/* Two screenshots offered as equals.

   Written for the step where VS Code may or may not draw its commit counter.
   The source handout showed the empty status bar first, under the heading
   "ISSUE ALERT", and the correct one afterwards — which tells a reader who sees
   the empty bar that they have broken something. They have not; the editor
   simply failed to redraw.

   Presenting both at the same size, in the same frame, with neutral labels and
   no colour coding, is most of the repair. Neither panel is the error panel. */

export function Compare({ a, b, caption, note }) {
  return (
    <figure style={{ margin: "28px 0 0" }}>
      {caption && (
        <figcaption style={{
          fontSize: "var(--text-2xs)", fontWeight: 700, letterSpacing: "var(--tracking-wider)",
          textTransform: "uppercase", color: "var(--text-gold)", marginBottom: 10
        }}>{caption}</figcaption>
      )}
      <div className="aw-compare">
        {[a, b].map((panel, i) => (
          <div key={i} style={{ minWidth: 0 }}>
            <div style={{
              border: "5px solid var(--surface-gold-tint)", outline: "1px solid var(--border-gold)",
              background: "var(--neutral-900)", lineHeight: 0
            }}>
              <img src={panel.src} alt={panel.alt} width={panel.width} height={panel.height}
                style={{ width: "100%", height: "auto", display: "block" }} />
            </div>
            <p style={{
              margin: "10px 0 0", fontSize: "var(--text-sm)",
              lineHeight: "var(--leading-normal)", color: "var(--text-secondary)"
            }}>{panel.label}</p>
          </div>
        ))}
      </div>
      {note && (
        <p style={{ margin: "12px 0 0", fontSize: "var(--text-2xs)", color: "var(--text-muted)" }}>
          {note}
        </p>
      )}
    </figure>
  );
}
