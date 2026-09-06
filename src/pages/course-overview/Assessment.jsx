import React from "react";
import { components, deliverables, meta } from "../../data/course.js";

/* Bars are scaled against the largest single weight rather than against 100,
   so the relative sizes of the five components stay legible. */
const maxWeight = Math.max(...components.map((c) => c.weight));

const columnLabel = {
  fontSize: "var(--text-xs)", fontWeight: "var(--weight-semibold)",
  letterSpacing: "var(--tracking-wider)", textTransform: "uppercase",
  color: "rgba(255,255,255,0.6)", paddingBottom: 12, borderBottom: "1px solid rgba(255,255,255,0.24)"
};

export function Assessment() {
  return (
    <section id="assessment" style={{ scrollMarginTop: 96, background: "var(--green-900)", color: "var(--text-inverse)" }}>
      <div className="dls-section" style={{ maxWidth: "var(--container-lg)", margin: "0 auto", padding: "80px 32px" }}>
        <div style={{
          fontSize: "var(--text-xs)", fontWeight: "var(--weight-semibold)",
          letterSpacing: "var(--tracking-wider)", textTransform: "uppercase", color: "var(--gold-300)"
        }}>Assessment</div>
        <h2 style={{
          fontFamily: "var(--font-display)", fontSize: "var(--text-2xl)",
          fontWeight: "var(--weight-semibold)", margin: "12px 0 40px"
        }}>Assessed outputs and their corresponding weights</h2>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 56 }}>
          <div style={{ minWidth: 0 }}>
            <div style={columnLabel}>Grading system</div>
            {components.map((c) => (
              <div key={c.key} style={{ padding: "18px 0", borderBottom: "1px solid rgba(255,255,255,0.14)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", gap: 16, alignItems: "baseline" }}>
                  <span style={{ fontSize: "var(--text-base)" }}>{c.label}</span>
                  <span style={{
                    fontFamily: "var(--font-display)", fontSize: "var(--text-lg)",
                    fontFeatureSettings: "'tnum'", color: "var(--gold-300)"
                  }}>{c.weight}%</span>
                </div>
                <div style={{ marginTop: 10, height: 6, border: "1px solid rgba(255,255,255,0.28)" }}>
                  <div style={{ height: "100%", background: "var(--gold-500)", width: `${(c.weight / maxWeight) * 100}%` }} />
                </div>
              </div>
            ))}
            <div style={{
              display: "flex", justifyContent: "space-between", paddingTop: 18,
              fontSize: "var(--text-sm)", color: "rgba(255,255,255,0.72)"
            }}>
              <span>Passing grade</span>
              <span style={{ fontFeatureSettings: "'tnum'" }}>{meta.passingGrade}%</span>
            </div>
          </div>

          <div style={{ minWidth: 0 }}>
            <div style={columnLabel}>Assessed output and due dates</div>
            {deliverables.map((d) => (
              <div key={d.name} style={{ padding: "18px 0", borderBottom: "1px solid rgba(255,255,255,0.14)" }}>
                <div style={{
                  fontFamily: "var(--font-display)", fontSize: "var(--text-md)", fontWeight: "var(--weight-semibold)"
                }}>{d.name}</div>
                <div style={{
                  display: "flex", justifyContent: "space-between", gap: 16, marginTop: 8,
                  fontSize: "var(--text-sm)", color: "rgba(255,255,255,0.72)"
                }}>
                  <span>{d.lo}</span>
                  <span style={{ color: "var(--gold-300)" }}>{d.due}</span>
                </div>
              </div>
            ))}
            <p style={{
              margin: "22px 0 0", fontSize: "var(--text-sm)",
              lineHeight: "var(--leading-relaxed)", color: "rgba(255,255,255,0.72)"
            }}>
              Submissions are evaluated on completeness and quality, on documentation, that is,
              inline comments together with pseudo-code or a flowchart that accurately describes the
              submitted program, and, in the case of the project, on the proposal, the presentation
              and the demonstrated mastery of the code submitted.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
