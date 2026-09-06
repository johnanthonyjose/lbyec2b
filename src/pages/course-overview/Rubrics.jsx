import React from "react";
import { Section, SectionHeading } from "../../components/Section.jsx";
import { Tabs } from "../../components/ds/index.js";
import { rubrics, rubricTabs, levels, levelBands } from "../../data/course.js";

export function Rubrics() {
  const [rubric, setRubric] = React.useState(rubricTabs[0]);
  const [level, setLevel] = React.useState(levels[0]);
  const rows = rubrics[rubric] || [];

  return (
    <Section id="rubrics" tone="subtle"
      style={{ borderTop: "1px solid var(--border-subtle)", borderBottom: "1px solid var(--border-subtle)" }}>
      <SectionHeading eyebrow="Rubrics" title="How submitted work is assessed">
        Each rubric is a general guide that sets the minimum expectations. An instructor may issue a
        rubric better suited to a particular activity. Select a performance level to read the
        corresponding descriptors.
      </SectionHeading>

      <Tabs items={rubricTabs} value={rubric} onChange={setRubric} />

      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 24 }}>
        {levels.map((l) => {
          const on = level === l;
          return (
            <button key={l} onClick={() => setLevel(l)} aria-pressed={on} style={{
              border: `1px solid ${on ? "var(--green-700)" : "var(--border-default)"}`,
              background: on ? "var(--green-700)" : "var(--neutral-0)",
              color: on ? "var(--neutral-0)" : "var(--text-secondary)",
              borderRadius: "var(--radius-pill)", padding: "7px 16px",
              fontFamily: "var(--font-sans)", fontSize: "var(--text-sm)", cursor: "pointer",
              transition: "var(--transition-control)"
            }}>{l} ({levelBands[l]})</button>
          );
        })}
      </div>

      <div style={{
        marginTop: 28, background: "var(--surface-card)", border: "1px solid var(--border-subtle)",
        borderRadius: "var(--radius-md)", boxShadow: "var(--shadow-xs)", overflow: "hidden"
      }}>
        <div className="dls-rubric-head" style={{
          display: "grid", gridTemplateColumns: "minmax(0, 1.1fr) minmax(0, 1.6fr)",
          padding: "16px 28px", background: "var(--green-700)", color: "var(--text-inverse)",
          fontSize: "var(--text-xs)", fontWeight: "var(--weight-semibold)",
          letterSpacing: "var(--tracking-wider)", textTransform: "uppercase"
        }}>
          <div>Criterion</div>
          <div>{level}, {levelBands[level]}</div>
        </div>
        {rows.map((r) => (
          <div key={r.criterion} className="dls-rubric-row" style={{
            display: "grid", gridTemplateColumns: "minmax(0, 1.1fr) minmax(0, 1.6fr)", gap: 32,
            padding: "24px 28px", borderTop: "1px solid var(--border-subtle)"
          }}>
            <div style={{ minWidth: 0 }}>
              <div style={{
                fontFamily: "var(--font-display)", fontSize: "var(--text-md)", fontWeight: "var(--weight-semibold)"
              }}>{r.criterion}</div>
              <div style={{
                fontSize: "var(--text-2xs)", letterSpacing: "var(--tracking-wider)",
                textTransform: "uppercase", color: "var(--text-gold)",
                fontWeight: "var(--weight-semibold)", marginTop: 8
              }}>{r.weight}</div>
            </div>
            <div style={{
              fontSize: "var(--text-sm)", lineHeight: "var(--leading-relaxed)", color: "var(--text-secondary)"
            }}>{r[level]}</div>
          </div>
        ))}
      </div>
    </Section>
  );
}
