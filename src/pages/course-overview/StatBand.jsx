import React from "react";

const stats = [
  { figure: "1", label: "credit unit, laboratory" },
  { figure: "13", label: "weeks of laboratory instruction" },
  { figure: "C and MATLAB", label: "the two programming environments used" },
  { figure: "70%", label: "passing grade" }
];

export function StatBand() {
  return (
    <section style={{ borderBottom: "1px solid var(--border-subtle)", background: "var(--surface-subtle)" }}>
      <div className="dls-section" style={{
        maxWidth: "var(--container-lg)", margin: "0 auto", padding: "0 32px",
        display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))"
      }}>
        {stats.map((s, i) => (
          <div key={s.label} style={{
            padding: i === 0 ? "28px 24px 28px 0" : i === stats.length - 1 ? "28px 0 28px 24px" : "28px 24px",
            borderRight: i === stats.length - 1 ? "none" : "1px solid var(--border-subtle)"
          }}>
            <div style={{
              fontFamily: "var(--font-display)", fontSize: "var(--text-3xl)",
              fontWeight: "var(--weight-semibold)", fontFeatureSettings: "'tnum'", color: "var(--green-800)"
            }}>{s.figure}</div>
            <div style={{ fontSize: "var(--text-sm)", color: "var(--text-secondary)", marginTop: 4 }}>{s.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
