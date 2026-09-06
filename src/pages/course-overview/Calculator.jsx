import React from "react";
import { Section, SectionHeading } from "../../components/Section.jsx";
import { components, meta } from "../../data/course.js";
import { usePersistentState } from "../../hooks/index.js";

const defaults = Object.fromEntries(components.map((c) => [c.key, c.default]));

/* Spells the weight out in words to match the register of the rest of the
   page, where figures are reserved for the numbers that carry meaning. */
const WEIGHT_WORD = { 25: "25", 30: "30", 15: "15", 5: "5" };

export function Calculator() {
  const [scores, setScores] = usePersistentState("lbyec2b-scores", defaults);

  const setScore = (key, value) => {
    const n = Math.max(0, Math.min(100, Number(value) || 0));
    setScores({ ...scores, [key]: n });
  };

  const total = components.reduce((a, c) => a + (scores[c.key] * c.weight) / 100, 0);
  const rounded = Math.round(total * 10) / 10;
  const passing = rounded >= meta.passingGrade;

  return (
    <Section id="calculator">
      <SectionHeading eyebrow="Standing calculator" title="Estimating a final standing from component scores">
        The figures below are indicative only. They apply the published weights to the scores entered
        and are not a record of grades. The instructor of record remains the sole source of official marks.
      </SectionHeading>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 48, alignItems: "start" }}>
        <div style={{ minWidth: 0 }}>
          {components.map((c) => (
            <div key={c.key} style={{ padding: "16px 0", borderBottom: "1px solid var(--border-subtle)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 16, alignItems: "baseline" }}>
                <span style={{ fontSize: "var(--text-base)" }}>{c.label}</span>
                <span style={{ fontSize: "var(--text-sm)", color: "var(--text-muted)", fontFeatureSettings: "'tnum'" }}>
                  Weighted {WEIGHT_WORD[c.weight] ?? c.weight} percent
                </span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 16, marginTop: 10 }}>
                <input type="range" min="0" max="100" step="1" value={scores[c.key]}
                  onChange={(e) => setScore(c.key, e.target.value)} aria-label={c.label}
                  style={{ flex: 1, minWidth: 0, accentColor: "var(--green-700)", height: 22 }} />
                <span style={{
                  fontFamily: "var(--font-display)", fontSize: "var(--text-lg)",
                  fontFeatureSettings: "'tnum'", color: "var(--green-800)", minWidth: "3ch", textAlign: "right"
                }}>{scores[c.key]}</span>
              </div>
            </div>
          ))}
          <button onClick={() => setScores(defaults)} style={{
            marginTop: 22, border: "1px solid var(--border-default)", background: "transparent",
            borderRadius: "var(--radius-md)", padding: "10px 18px", fontFamily: "var(--font-sans)",
            fontSize: "var(--text-sm)", color: "var(--text-accent)", cursor: "pointer",
            transition: "var(--transition-control)"
          }}>Reset all scores</button>
        </div>

        <div style={{
          minWidth: 0, borderTop: "3px solid var(--rule-brand)",
          borderRight: "1px solid var(--border-subtle)", borderBottom: "1px solid var(--border-subtle)",
          borderLeft: "1px solid var(--border-subtle)", borderRadius: "var(--radius-md)",
          padding: 32, background: "var(--surface-card)", boxShadow: "var(--shadow-xs)"
        }}>
          <div style={{
            fontSize: "var(--text-xs)", fontWeight: "var(--weight-semibold)",
            letterSpacing: "var(--tracking-wider)", textTransform: "uppercase", color: "var(--text-secondary)"
          }}>Weighted standing</div>

          <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginTop: 12 }}>
            <span style={{
              fontFamily: "var(--font-display)", fontSize: "var(--text-5xl)",
              fontWeight: "var(--weight-semibold)", fontFeatureSettings: "'tnum'",
              color: "var(--green-800)", lineHeight: 1
            }}>{rounded.toFixed(1)}</span>
            <span style={{ fontSize: "var(--text-lg)", color: "var(--text-muted)" }}>of 100</span>
          </div>

          {/* The gold hairline marks the published passing mark, so the bar is
              read against the threshold rather than against 100. */}
          <div style={{
            marginTop: 20, height: 8, border: "1px solid var(--border-default)",
            borderRadius: "var(--radius-sm)", position: "relative"
          }}>
            <div style={{
              position: "absolute", top: 0, bottom: 0, left: 0,
              width: `${Math.max(0, Math.min(100, rounded))}%`, background: "var(--green-700)",
              transition: "width var(--duration-base) var(--ease-standard)"
            }} />
            <div style={{
              position: "absolute", top: -6, bottom: -6,
              left: `${meta.passingGrade}%`, width: 1, background: "var(--gold-600)"
            }} />
          </div>
          <div style={{
            display: "flex", justifyContent: "space-between", marginTop: 8,
            fontSize: "var(--text-2xs)", letterSpacing: "var(--tracking-wider)",
            textTransform: "uppercase", color: "var(--text-muted)"
          }}>
            <span>0</span>
            <span style={{ color: "var(--text-gold)" }}>Passing {meta.passingGrade}</span>
            <span>100</span>
          </div>

          <div style={{ marginTop: 24, paddingTop: 20, borderTop: "1px solid var(--border-subtle)" }}>
            <div style={{
              fontFamily: "var(--font-display)", fontSize: "var(--text-lg)",
              fontWeight: "var(--weight-semibold)",
              color: passing ? "var(--green-800)" : "var(--status-danger)"
            }}>{passing ? "Above the passing mark" : "Below the passing mark"}</div>
            <p style={{
              margin: "10px 0 0", fontSize: "var(--text-sm)",
              lineHeight: "var(--leading-relaxed)", color: "var(--text-secondary)"
            }}>
              {passing
                ? `A weighted standing of ${rounded.toFixed(1)} meets the published passing grade of ${meta.passingGrade} percent. Deductions for late submission are not modelled here.`
                : `A weighted standing of ${rounded.toFixed(1)} falls short of the published passing grade of ${meta.passingGrade} percent. The project and the laboratory components carry the largest weights and are therefore where improvement has the greatest effect.`}
            </p>
          </div>
        </div>
      </div>
    </Section>
  );
}
