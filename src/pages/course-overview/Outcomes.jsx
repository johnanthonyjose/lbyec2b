import React from "react";
import { Section, SectionHeading } from "../../components/Section.jsx";
import { outcomes, meta } from "../../data/course.js";

const microLabel = {
  fontSize: "var(--text-2xs)", fontWeight: "var(--weight-semibold)",
  letterSpacing: "var(--tracking-wider)", textTransform: "uppercase", color: "var(--text-muted)"
};

export function Outcomes() {
  const [index, setIndex] = React.useState(0);
  const active = outcomes[index];
  const move = (delta) => setIndex((i) => (i + delta + outcomes.length) % outcomes.length);

  // Arrow keys walk the list, which is what a reader expects of a tablist and
  // what makes the control usable without a mouse.
  const onKey = (e) => {
    if (e.key === "ArrowDown" || e.key === "ArrowRight") { e.preventDefault(); move(1); }
    if (e.key === "ArrowUp" || e.key === "ArrowLeft") { e.preventDefault(); move(-1); }
  };

  return (
    <Section id="outcomes" tone="subtle"
      style={{ borderTop: "1px solid var(--border-subtle)", borderBottom: "1px solid var(--border-subtle)" }}>
      <SectionHeading eyebrow="Learning outcomes"
        title="Upon completion of the course, the student is expected to be able to">
        Mapped to Student Outcomes D, J and K, and to Expected Lasallian Graduate Attributes 1 to 4.
      </SectionHeading>

      <div className="dls-split" style={{
        display: "grid", gridTemplateColumns: "minmax(0, 0.85fr) minmax(0, 1.6fr)",
        gap: 32, alignItems: "start"
      }}>
        <div role="tablist" aria-label="Learning outcomes" style={{ display: "grid", gap: 8, minWidth: 0 }}>
          {outcomes.map((lo, i) => {
            const on = i === index;
            return (
              <button key={lo.code} role="tab" aria-selected={on} onClick={() => setIndex(i)} onKeyDown={onKey}
                style={{
                  display: "grid", gridTemplateColumns: "44px minmax(0, 1fr)", gap: 14, alignItems: "center",
                  textAlign: "left", cursor: "pointer", fontFamily: "var(--font-sans)",
                  padding: "14px 16px", borderRadius: "var(--radius-md)",
                  background: on ? "var(--green-50)" : "var(--surface-card)",
                  border: `1px solid ${on ? "var(--green-100)" : "var(--border-subtle)"}`,
                  borderLeft: `3px solid ${on ? "var(--gold-500)" : "var(--border-subtle)"}`,
                  color: on ? "var(--text-primary)" : "var(--text-secondary)",
                  transition: "background var(--duration-fast) var(--ease-standard)"
                }}>
                <span style={{
                  fontFamily: "var(--font-display)", fontSize: "var(--text-lg)",
                  fontWeight: "var(--weight-semibold)", fontFeatureSettings: "'tnum'",
                  color: on ? "var(--green-800)" : "var(--text-muted)"
                }}>{lo.code}</span>
                <span style={{ fontSize: "var(--text-sm)", lineHeight: "var(--leading-snug)" }}>{lo.short}</span>
              </button>
            );
          })}
        </div>

        <div className="dls-outcome-panel" style={{
          minWidth: 0, background: "var(--surface-card)",
          borderTop: "3px solid var(--rule-brand)", borderRight: "1px solid var(--border-subtle)",
          borderBottom: "1px solid var(--border-subtle)", borderLeft: "1px solid var(--border-subtle)",
          borderRadius: "var(--radius-md)", boxShadow: "var(--shadow-xs)", padding: "34px 36px"
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 20, flexWrap: "wrap" }}>
            <div style={{
              fontSize: "var(--text-xs)", fontWeight: "var(--weight-semibold)",
              letterSpacing: "var(--tracking-wider)", textTransform: "uppercase", color: "var(--text-gold)"
            }}>{active.code}, learning outcome</div>
            <div style={{ fontSize: "var(--text-sm)", color: "var(--text-muted)", fontFeatureSettings: "'tnum'" }}>
              Outcome {index + 1} of {outcomes.length}
            </div>
          </div>

          <h3 style={{
            fontFamily: "var(--font-display)", fontSize: "var(--text-xl)",
            fontWeight: "var(--weight-semibold)", lineHeight: "var(--leading-snug)", margin: "10px 0 0"
          }}>{active.title}</h3>
          <p style={{
            margin: "16px 0 0", fontSize: "var(--text-base)",
            lineHeight: "var(--leading-relaxed)", color: "var(--text-secondary)"
          }}>{active.body}</p>

          {/* Which of the thirteen weeks develop this outcome. Filled cells are
              the weeks; the grid makes the concentration visible at a glance. */}
          <div style={{ marginTop: 26, paddingTop: 22, borderTop: "1px solid var(--border-subtle)" }}>
            <div style={{ ...microLabel, color: "var(--text-secondary)" }}>Weeks in which it is developed</div>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 12 }}>
              {Array.from({ length: meta.weeks }, (_, k) => {
                const week = k + 1;
                const on = active.weeks.includes(week);
                return (
                  <span key={week} title={`Week ${week}`} style={{
                    display: "inline-flex", alignItems: "center", justifyContent: "center",
                    width: 34, height: 34, borderRadius: "var(--radius-sm)",
                    fontSize: "var(--text-sm)", fontFeatureSettings: "'tnum'",
                    background: on ? "var(--green-700)" : "var(--surface-page)",
                    color: on ? "var(--text-inverse)" : "var(--text-muted)",
                    border: `1px solid ${on ? "var(--green-700)" : "var(--border-subtle)"}`
                  }}>{week}</span>
                );
              })}
            </div>
          </div>

          <div style={{
            display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))", gap: 24,
            marginTop: 26, paddingTop: 22, borderTop: "1px solid var(--border-subtle)"
          }}>
            <div>
              <div style={microLabel}>Evidence of attainment</div>
              <div style={{ fontSize: "var(--text-sm)", color: "var(--text-primary)", marginTop: 6, lineHeight: "var(--leading-normal)" }}>{active.evidence}</div>
            </div>
            <div>
              <div style={microLabel}>Mapped student outcome</div>
              <div style={{ fontSize: "var(--text-sm)", color: "var(--text-primary)", marginTop: 6, lineHeight: "var(--leading-normal)" }}>{active.meta}</div>
            </div>
          </div>

          <div style={{ display: "flex", gap: 12, marginTop: 28 }}>
            <button onClick={() => move(-1)} className="dls-quiet-btn" style={{
              border: "1px solid var(--border-default)", background: "transparent",
              borderRadius: "var(--radius-md)", padding: "9px 18px", fontFamily: "var(--font-sans)",
              fontSize: "var(--text-sm)", color: "var(--text-accent)", cursor: "pointer",
              transition: "var(--transition-control)"
            }}>Previous outcome</button>
            <button onClick={() => move(1)} style={{
              border: "1px solid var(--green-700)", background: "var(--green-700)",
              borderRadius: "var(--radius-md)", padding: "9px 18px", fontFamily: "var(--font-sans)",
              fontSize: "var(--text-sm)", color: "var(--text-inverse)", cursor: "pointer",
              transition: "var(--transition-control)"
            }}>Next outcome</button>
          </div>
        </div>
      </div>
    </Section>
  );
}
