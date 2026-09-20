import React from "react";
import { Section } from "../../components/Section.jsx";
import { Tag } from "../../components/ds/index.js";
import { weeks as allWeeks, tracks } from "../../data/course.js";

const microLabel = {
  fontSize: "var(--text-2xs)", letterSpacing: "var(--tracking-wider)",
  textTransform: "uppercase", color: "var(--text-muted)", fontWeight: "var(--weight-semibold)"
};

const trackLabel = (name) => (name === "C" ? "C programming" : name === "All" ? "All weeks" : name);

export function LearningPlan({ showFilters = true }) {
  const [track, setTrack] = React.useState("All");
  const [open, setOpen] = React.useState({});

  const shown = track === "All" ? allWeeks : allWeeks.filter((w) => w.group === track);
  const allOpen = shown.length > 0 && shown.every((w) => open[w.no]);

  const toggle = (no) => setOpen((s) => ({ ...s, [no]: !s[no] }));
  const toggleAll = () => {
    if (allOpen) return setOpen({});
    setOpen(Object.fromEntries(shown.map((w) => [w.no, true])));
  };

  return (
    <Section id="plan">
      <div style={{
        fontSize: "var(--text-xs)", fontWeight: "var(--weight-semibold)",
        letterSpacing: "var(--tracking-wider)", textTransform: "uppercase", color: "var(--text-gold)"
      }}>Learning plan</div>

      <div style={{
        display: "flex", alignItems: "flex-end", justifyContent: "space-between",
        gap: 24, flexWrap: "wrap", marginTop: 12
      }}>
        <h2 style={{
          fontFamily: "var(--font-display)", fontSize: "var(--text-2xl)",
          fontWeight: "var(--weight-semibold)", margin: 0
        }}>The thirteen-week learning plan</h2>
        {showFilters && (
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {tracks.map((name) => (
              <Tag key={name} selected={track === name} onClick={() => setTrack(name)}>{trackLabel(name)}</Tag>
            ))}
          </div>
        )}
      </div>

      <div style={{ marginTop: 28, borderTop: "3px solid var(--rule-brand)" }}>
        <div className="dls-plan-head" style={{
          display: "grid", gridTemplateColumns: "72px minmax(0, 2.2fr) minmax(0, 1fr)", gap: 24,
          padding: "14px 0", borderBottom: "1px solid var(--border-default)",
          fontSize: "var(--text-xs)", fontWeight: "var(--weight-semibold)",
          letterSpacing: "var(--tracking-wider)", textTransform: "uppercase", color: "var(--text-secondary)"
        }}>
          <div>Week</div><div>Topic</div><div>Activities</div>
        </div>

        {shown.map((w) => {
          const expanded = !!open[w.no];
          return (
            <div key={w.no} style={{ borderBottom: "1px solid var(--border-subtle)" }}>
              <div role="button" tabIndex={0} aria-expanded={expanded} className="dls-row-hover dls-plan-row"
                onClick={() => toggle(w.no)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") { e.preventDefault(); toggle(w.no); }
                }}
                style={{
                  display: "grid", gridTemplateColumns: "72px minmax(0, 2.2fr) minmax(0, 1fr) 28px",
                  gap: 24, padding: "20px 0", cursor: "pointer", alignItems: "start"
                }}>
                <div style={{
                  fontFamily: "var(--font-display)", fontSize: "var(--text-xl)",
                  fontFeatureSettings: "'tnum'", color: "var(--green-700)", paddingLeft: 4
                }}>{w.no}</div>
                <div style={{ minWidth: 0 }}>
                  <div style={{
                    fontFamily: "var(--font-display)", fontSize: "var(--text-md)",
                    fontWeight: "var(--weight-semibold)"
                  }}>{w.title}</div>
                  <div style={{ fontSize: "var(--text-sm)", color: "var(--text-secondary)", marginTop: 6 }}>{w.detail}</div>
                  <div style={{
                    display: "flex", gap: 14, alignItems: "center", marginTop: 10,
                    fontSize: "var(--text-2xs)", letterSpacing: "var(--tracking-wider)",
                    textTransform: "uppercase", color: "var(--text-gold)", fontWeight: "var(--weight-semibold)"
                  }}>
                    <span>{w.track}</span>
                    <span style={{ color: "var(--text-muted)" }}>{w.lo}</span>
                  </div>
                </div>
                <div className="dls-plan-activities" style={{ fontSize: "var(--text-sm)", color: "var(--text-secondary)" }}>{w.activities}</div>
                <div aria-hidden="true" style={{
                  justifySelf: "end", paddingTop: 6, color: "var(--green-700)",
                  fontSize: "var(--text-sm)", fontFamily: "var(--font-display)"
                }}>{expanded ? "−" : "+"}</div>
              </div>

              {expanded && (
                <div className="dls-plan-detail" style={{ display: "grid", gridTemplateColumns: "72px minmax(0, 1fr)", gap: 24, padding: "0 0 26px" }}>
                  <div />
                  <div style={{
                    minWidth: 0, padding: "20px 24px", background: "var(--green-50)",
                    borderLeft: "3px solid var(--rule-brand)", borderRadius: "var(--radius-md)"
                  }}>
                    <div style={{
                      fontSize: "var(--text-xs)", fontWeight: "var(--weight-semibold)",
                      letterSpacing: "var(--tracking-wider)", textTransform: "uppercase", color: "var(--text-secondary)"
                    }}>What this week requires</div>
                    <div style={{
                      fontSize: "var(--text-sm)", lineHeight: "var(--leading-relaxed)",
                      color: "var(--text-primary)", marginTop: 10
                    }}>{w.body}</div>
                    <div style={{
                      display: "flex", gap: 32, flexWrap: "wrap", marginTop: 18,
                      paddingTop: 16, borderTop: "1px solid var(--green-100)"
                    }}>
                      <Detail label="Deliverable" value={w.deliverable} />
                      <Detail label="Due" value={w.due} />
                      <Detail label="Environment" value={w.env} />
                    </div>
                    {/* A week that has a handout of its own says so here, so the
                        plan is a way into the material rather than only a
                        description of it. */}
                    {w.handout && (
                      <a className="dls-link-quiet" href={w.handout.href} style={{
                        display: "inline-block", marginTop: 16, fontSize: "var(--text-sm)",
                        fontWeight: "var(--weight-semibold)", color: "var(--text-accent)"
                      }}>{w.handout.label} →</a>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}

        <div style={{
          display: "flex", justifyContent: "space-between", gap: 20, flexWrap: "wrap",
          padding: "20px 0 0", fontSize: "var(--text-sm)", color: "var(--text-muted)"
        }}>
          <span>
            {shown.length === allWeeks.length
              ? "All thirteen weeks are shown. Select a row to read a week in full."
              : `${shown.length} of thirteen weeks are shown. Select a row to read a week in full.`}
          </span>
          <button onClick={toggleAll} style={{
            border: "1px solid var(--border-default)", background: "transparent",
            borderRadius: "var(--radius-md)", padding: "8px 16px", fontFamily: "var(--font-sans)",
            fontSize: "var(--text-sm)", color: "var(--text-accent)", cursor: "pointer",
            transition: "var(--transition-control)"
          }}>{allOpen ? "Collapse all weeks" : "Expand all weeks"}</button>
        </div>
      </div>
    </Section>
  );
}

function Detail({ label, value }) {
  return (
    <div>
      <div style={microLabel}>{label}</div>
      <div style={{ fontSize: "var(--text-sm)", color: "var(--text-primary)", marginTop: 4 }}>{value}</div>
    </div>
  );
}
