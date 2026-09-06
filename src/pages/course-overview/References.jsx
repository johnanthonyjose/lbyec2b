import React from "react";
import { Section } from "../../components/Section.jsx";
import { references, onlineResources } from "../../data/course.js";

export function References() {
  return (
    <Section id="references" tone="subtle" style={{ borderTop: "1px solid var(--border-subtle)" }}
      innerStyle={{ padding: "72px 32px" }}>
      <div style={{
        fontSize: "var(--text-xs)", fontWeight: "var(--weight-semibold)",
        letterSpacing: "var(--tracking-wider)", textTransform: "uppercase", color: "var(--text-gold)"
      }}>References</div>
      <h2 style={{
        fontFamily: "var(--font-display)", fontSize: "var(--text-2xl)",
        fontWeight: "var(--weight-semibold)", margin: "12px 0 32px"
      }}>Prescribed and supplementary materials</h2>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 40 }}>
        <div style={{ minWidth: 0 }}>
          {references.map((r) => (
            <div key={r.text} style={{ padding: "16px 0", borderBottom: "1px solid var(--border-subtle)" }}>
              {/* Each citation links into AnimoSearch rather than to a
                  bookseller, so the first stop is the library's holdings. */}
              <a href={r.url} target="_blank" rel="noopener" className="dls-link-quiet" style={{
                display: "block", fontSize: "var(--text-sm)", lineHeight: "var(--leading-relaxed)"
              }}>{r.text}</a>
              <div style={{
                display: "flex", alignItems: "baseline", gap: 8, marginTop: 8,
                fontSize: "var(--text-2xs)", color: "var(--text-muted)"
              }}>
                <span style={{
                  letterSpacing: "var(--tracking-wider)", textTransform: "uppercase",
                  fontWeight: "var(--weight-semibold)", color: "var(--text-gold)"
                }}>AnimoSearch</span>
                <span>{r.keywords}</span>
              </div>
            </div>
          ))}
        </div>

        <div style={{ minWidth: 0 }}>
          <div style={{
            fontSize: "var(--text-xs)", fontWeight: "var(--weight-semibold)",
            letterSpacing: "var(--tracking-wider)", textTransform: "uppercase", color: "var(--text-secondary)"
          }}>Online resources</div>
          <ul style={{
            margin: "14px 0 0", paddingLeft: 18, fontSize: "var(--text-sm)",
            lineHeight: "var(--leading-relaxed)", display: "grid", gap: 8
          }}>
            {onlineResources.map((o) => (
              <li key={o.href}>
                <a href={o.href} target="_blank" rel="noopener">{o.label}</a>{o.suffix}
              </li>
            ))}
          </ul>
          <p style={{ margin: "20px 0 0", fontSize: "var(--text-sm)", color: "var(--text-muted)" }}>
            Activity materials are provided by the instructor. All deliverables are submitted through Canvas.
          </p>
        </div>
      </div>
    </Section>
  );
}
