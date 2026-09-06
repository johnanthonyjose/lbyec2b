import React from "react";
import { Section, SectionHeading } from "../../components/Section.jsx";
import { journeySteps, projectMix } from "../../data/course.js";

const eyebrow = {
  fontSize: "var(--text-2xs)", letterSpacing: "var(--tracking-wider)",
  textTransform: "uppercase", color: "var(--text-gold)", fontWeight: "var(--weight-semibold)"
};
const listStyle = {
  margin: "20px 0 0", paddingLeft: 18, fontSize: "var(--text-sm)",
  lineHeight: "var(--leading-relaxed)", color: "var(--text-secondary)", display: "grid", gap: 6
};

/* Each stage carries a drawn medallion rather than an icon-font glyph, so the
   three read as a set and inherit the brand colours. */
const StageC = () => (
  <g fill="none" stroke="var(--green-700)" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <rect x="15" y="22" width="12" height="12" /><rect x="27" y="22" width="12" height="12" />
    <rect x="39" y="22" width="12" height="12" /><path d="M21 40v6h24v-6" /><path d="M33 46v5" />
  </g>
);
const StageMatlab = () => (
  <g fill="none" stroke="var(--green-700)" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <rect x="16" y="18" width="16" height="16" /><path d="M16 26h16M24 18v16" />
    <path d="M36 26h9" /><path d="M42 22.5 45.5 26 42 29.5" />
    <path d="M20 50h28" /><path d="M24 50v-8M31 50v-12M38 50v-6M45 50v-10" />
  </g>
);
const StageProject = () => (
  <g fill="none" stroke="var(--green-700)" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="25" cy="23" r="4.5" /><circle cx="43" cy="23" r="4.5" />
    <path d="M18 34c0-4 3.2-6 7-6s7 2 7 6" /><path d="M36 34c0-4 3.2-6 7-6s7 2 7 6" />
    <rect x="19" y="39" width="30" height="12" /><path d="M34 51v4M28 55h12" />
  </g>
);

const stages = [
  { weeks: "Weeks 1 to 4", title: "Implementation in C", Art: StageC, dot: [33, 52.5],
    items: ["Arrays, strings and their passage to functions", "Pointers, memory addressing and dereferencing", "File input and output", "User-defined types and structures"] },
  { weeks: "Weeks 5 to 10", title: "Application in MATLAB", Art: StageMatlab, dot: [45, 40],
    items: ["Computation expressed in matrix form", "Extraction, transformation and loading of data", "Plots and figures for interpretation", "Interactive interfaces in App Designer"] },
  { weeks: "Weeks 9 to 13", title: "Team project", Art: StageProject, dot: [34, 45],
    items: ["Scoping, milestones and a working mock-up", "Implementation with instructor consultation", "Practical examination in Week 12", "Demonstration and defense in Week 13"] }
];

export function Structure() {
  const [step, setStep] = React.useState(0);
  const active = journeySteps[step];
  const fill = step / (journeySteps.length - 1);

  return (
    <Section id="structure" style={{ borderTop: "1px solid var(--border-subtle)" }}>
      <SectionHeading eyebrow="Structure of the term" title="The term proceeds in three stages">
        The sequence is intentional. Students implement each construct in C before using the
        equivalent facility in MATLAB, and both are covered before the term-end project is scoped.
      </SectionHeading>

      <div style={{ position: "relative", marginTop: 44 }}>
        <div style={{ position: "absolute", left: 0, right: 0, top: 34, height: 1, background: "var(--border-subtle)" }} />
        <div style={{
          display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
          gap: 28, position: "relative"
        }}>
          {stages.map(({ weeks, title, Art, dot, items }) => (
            <div key={title} style={{ minWidth: 0 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                <svg viewBox="0 0 68 68" width="68" height="68" aria-hidden="true"
                  style={{ flex: "none", background: "var(--surface-page)" }}>
                  <circle cx="34" cy="34" r="33" fill="var(--surface-page)" stroke="var(--gold-500)" strokeWidth="1" />
                  <Art />
                  <circle cx={dot[0]} cy={dot[1]} r="2" fill="var(--gold-500)" />
                </svg>
                <div>
                  <div style={eyebrow}>{weeks}</div>
                  <div style={{
                    fontFamily: "var(--font-display)", fontSize: "var(--text-lg)",
                    fontWeight: "var(--weight-semibold)", marginTop: 2
                  }}>{title}</div>
                </div>
              </div>
              <ul style={listStyle}>{items.map((i) => <li key={i}>{i}</li>)}</ul>
            </div>
          ))}
        </div>
      </div>

      {/* The project timeline. Announced in Week 7, defended in Week 13; the
          laboratory work in between prepares a specific part of it. */}
      <div style={{ marginTop: 56, paddingTop: 44, borderTop: "1px solid var(--border-subtle)" }}>
        <div style={{
          fontSize: "var(--text-xs)", fontWeight: "var(--weight-semibold)",
          letterSpacing: "var(--tracking-wider)", textTransform: "uppercase", color: "var(--text-secondary)"
        }}>The term-end project, from announcement to defense</div>
        <p style={{
          margin: "10px 0 0", fontSize: "var(--text-sm)", lineHeight: "var(--leading-relaxed)",
          color: "var(--text-secondary)", maxWidth: "78ch"
        }}>
          It is useful to know the destination early. The project is announced in Week 7 and defended
          in Week 13, and the laboratory exercises in between prepare a specific part of it. Select a
          milestone to see what is produced and how it is assessed.
        </p>

        <div style={{ marginTop: 30, overflowX: "auto", paddingBottom: 4 }}>
          <div style={{ position: "relative", minWidth: 640 }}>
            <div style={{ position: "absolute", left: 24, right: 24, top: 17, height: 1, background: "var(--border-default)" }} />
            <div style={{
              position: "absolute", left: 24, top: 17, height: 1, background: "var(--gold-500)",
              width: `calc((100% - 48px) * ${fill})`,
              transition: "width var(--duration-base) var(--ease-standard)"
            }} />
            <div role="tablist" aria-label="Project milestones" style={{
              display: "grid", gridTemplateColumns: `repeat(${journeySteps.length}, minmax(0, 1fr))`, position: "relative"
            }}>
              {journeySteps.map((j, i) => (
                <button key={j.week} role="tab" aria-selected={i === step} onClick={() => setStep(i)}
                  style={{
                    display: "grid", justifyItems: "center", gap: 12, background: "transparent",
                    border: 0, cursor: "pointer", fontFamily: "var(--font-sans)", padding: 0
                  }}>
                  <span style={{
                    display: "inline-flex", alignItems: "center", justifyContent: "center",
                    width: 34, height: 34, borderRadius: "50%",
                    background: i === step ? "var(--green-700)" : i < step ? "var(--gold-200)" : "var(--surface-page)",
                    border: `1px solid ${i <= step ? "var(--green-700)" : "var(--border-default)"}`,
                    color: i === step ? "var(--text-inverse)" : "var(--text-secondary)",
                    fontSize: "var(--text-sm)", fontFeatureSettings: "'tnum'",
                    fontWeight: "var(--weight-semibold)", transition: "var(--transition-control)"
                  }}>{j.week}</span>
                  <span style={{
                    fontSize: "var(--text-2xs)", letterSpacing: "var(--tracking-wider)",
                    textTransform: "uppercase", fontWeight: "var(--weight-semibold)",
                    color: i === step ? "var(--text-accent)" : "var(--text-muted)",
                    textAlign: "center", lineHeight: "var(--leading-snug)", padding: "0 6px"
                  }}>{j.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div style={{
          display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 36,
          marginTop: 34, padding: "30px 32px", background: "var(--green-50)",
          border: "1px solid var(--green-100)", borderLeft: "3px solid var(--rule-brand)",
          borderRadius: "var(--radius-md)"
        }}>
          <div style={{ minWidth: 0 }}>
            <div style={eyebrow}>{active.stage}</div>
            <h3 style={{
              fontFamily: "var(--font-display)", fontSize: "var(--text-xl)",
              fontWeight: "var(--weight-semibold)", margin: "8px 0 0"
            }}>{active.title}</h3>
            <p style={{
              margin: "14px 0 0", fontSize: "var(--text-sm)",
              lineHeight: "var(--leading-relaxed)", color: "var(--text-secondary)"
            }}>{active.body}</p>
          </div>
          <div style={{ minWidth: 0, display: "grid", gap: 18, alignContent: "start" }}>
            <Fact label="What is produced" value={active.produced} />
            <Fact label="How it is assessed" value={active.judged} />
          </div>
        </div>

        {/* Composition of the project mark, as a single 100% bar. */}
        <div style={{ marginTop: 34 }}>
          <div style={{
            display: "flex", justifyContent: "space-between", gap: 16, flexWrap: "wrap",
            fontSize: "var(--text-2xs)", letterSpacing: "var(--tracking-wider)",
            textTransform: "uppercase", color: "var(--text-secondary)", fontWeight: "var(--weight-semibold)"
          }}>
            <span>Composition of the project mark</span>
            <span style={{ color: "var(--text-muted)" }}>Thirty percent of the final grade</span>
          </div>
          <div style={{
            display: "flex", marginTop: 12, border: "1px solid var(--border-default)",
            borderRadius: "var(--radius-sm)", overflow: "hidden", height: 40
          }}>
            {projectMix.map((m) => (
              <div key={m.label} title={m.title} style={{
                width: `${m.pct}%`, background: m.bg, borderRight: "1px solid var(--neutral-0)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "var(--text-2xs)", color: m.fg, fontFeatureSettings: "'tnum'"
              }}>{m.pct}</div>
            ))}
          </div>
          <div style={{ display: "flex", gap: 20, flexWrap: "wrap", marginTop: 12 }}>
            {projectMix.map((m) => (
              <span key={m.label} style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                fontSize: "var(--text-sm)", color: "var(--text-secondary)"
              }}>
                <span style={{ width: 10, height: 10, background: m.bg, border: "1px solid var(--border-default)" }} />
                {m.label}
              </span>
            ))}
          </div>
        </div>
      </div>
    </Section>
  );
}

function Fact({ label, value }) {
  return (
    <div>
      <div style={{
        fontSize: "var(--text-2xs)", fontWeight: "var(--weight-semibold)",
        letterSpacing: "var(--tracking-wider)", textTransform: "uppercase", color: "var(--text-muted)"
      }}>{label}</div>
      <div style={{
        fontSize: "var(--text-sm)", color: "var(--text-primary)",
        marginTop: 5, lineHeight: "var(--leading-normal)"
      }}>{value}</div>
    </div>
  );
}
