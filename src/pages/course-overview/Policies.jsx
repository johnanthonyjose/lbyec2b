import React from "react";
import { Section } from "../../components/Section.jsx";
import { Card } from "../../components/ds/index.js";
import { scenarios, policies } from "../../data/course.js";

/* The three rulings the policy can produce, each with its own colour pairing.
   Permitted reads as success green, "ask" as brand gold, and the prohibition
   as the danger tone, so a card is legible before the words are read. */
const TONES = {
  Permitted: { bg: "var(--status-success-bg)", fg: "var(--status-success)", edge: "var(--green-700)", border: "var(--green-100)" },
  "Ask the instructor": { bg: "var(--surface-gold-tint)", fg: "var(--text-gold)", edge: "var(--gold-500)", border: "var(--gold-200)" },
  "Not permitted": { bg: "var(--status-danger-bg)", fg: "var(--status-danger)", edge: "var(--status-danger)", border: "var(--border-subtle)" }
};

const body = {
  margin: 0, fontSize: "var(--text-base)",
  lineHeight: "var(--leading-relaxed)", color: "var(--text-secondary)"
};

export function Policies() {
  const [revealed, setRevealed] = React.useState({});
  const shownCount = Object.keys(revealed).length;
  const allRevealed = shownCount === scenarios.length;

  const toggleAll = () => {
    if (allRevealed) return setRevealed({});
    setRevealed(Object.fromEntries(scenarios.map((_, i) => [i, true])));
  };

  return (
    <Section id="policies">
      <div style={{
        fontSize: "var(--text-xs)", fontWeight: "var(--weight-semibold)",
        letterSpacing: "var(--tracking-wider)", textTransform: "uppercase", color: "var(--text-gold)"
      }}>Class policies</div>
      <h2 style={{
        fontFamily: "var(--font-display)", fontSize: "var(--text-2xl)",
        fontWeight: "var(--weight-semibold)", margin: "12px 0 6px"
      }}>Policies observed for the duration of the term</h2>
      <p style={{ margin: "0 0 36px", fontSize: "var(--text-sm)", color: "var(--text-muted)" }}>
        The policies below apply to all sections. An instructor may add to them but may not relax them.
      </p>

      <div style={{
        borderTop: "3px solid var(--rule-brand)", borderRight: "1px solid var(--border-subtle)",
        borderBottom: "1px solid var(--border-subtle)", borderLeft: "1px solid var(--border-subtle)",
        borderRadius: "var(--radius-md)", padding: "36px 40px",
        background: "var(--surface-card)", boxShadow: "var(--shadow-xs)"
      }}>
        <div style={{
          fontSize: "var(--text-xs)", fontWeight: "var(--weight-semibold)",
          letterSpacing: "var(--tracking-wider)", textTransform: "uppercase", color: "var(--text-gold)"
        }}>Generative AI policy</div>
        <h3 style={{
          fontFamily: "var(--font-display)", fontSize: "var(--text-xl)",
          fontWeight: "var(--weight-semibold)", margin: "10px 0 0"
        }}>No AI tools may be used in this course</h3>

        <div className="dls-split" style={{
          display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 40, marginTop: 24
        }}>
          <div style={{ minWidth: 0 }}>
            <p style={body}>
              The prohibition applies to all laboratory activities, homework, machine problems, the
              term-end project and the practical examination. The course assesses the student's own
              ability to analyze a problem, design an algorithm, and write and debug working code. A
              tool that performs any of these tasks on the student's behalf removes the competence
              under assessment.
            </p>
            <p style={{ ...body, marginTop: 16 }}>
              While the adoption of emerging technology is valued, the priority of this course is to
              support learning of the fundamentals and the development of analytical thinking, which
              remain necessary even when such tools are adopted, particularly in view of their uneven
              reliability across tasks.
            </p>
          </div>
          <div style={{ minWidth: 0, paddingLeft: 40, borderLeft: "1px solid var(--border-subtle)" }}>
            <div style={{
              fontSize: "var(--text-xs)", fontWeight: "var(--weight-semibold)",
              letterSpacing: "var(--tracking-wider)", textTransform: "uppercase", color: "var(--text-secondary)"
            }}>Covered unless permitted by the instructor</div>
            <ul style={{
              margin: "14px 0 0", paddingLeft: 18, fontSize: "var(--text-sm)",
              lineHeight: "var(--leading-relaxed)", color: "var(--text-secondary)", display: "grid", gap: 6
            }}>
              <li>AI assistants and chatbots</li>
              <li>AI coding assistants and editor extensions</li>
              <li>AI features built into MATLAB and other course tools</li>
              <li>AI-generated summaries in search results</li>
            </ul>
            <p style={{ ...body, fontSize: "var(--text-sm)", marginTop: 18 }}>
              Every submission must carry a signed declaration that no AI tools were used in its
              production. Compliance is verified through unscheduled oral examination rather than
              detection software, and a student may be asked to explain, trace or modify submitted
              code at any time. The use of AI tools, and any false declaration, is treated under the
              cheating policy and the Student Handbook. A student uncertain whether a particular tool
              is covered should consult the instructor before using it.
            </p>
          </div>
        </div>
      </div>

      {/* Eight situations, ruling hidden until asked for. Deciding before
          revealing is the point: it turns a policy statement into a check. */}
      <div style={{ marginTop: 44 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 20, flexWrap: "wrap" }}>
          <div>
            <div style={{
              fontSize: "var(--text-xs)", fontWeight: "var(--weight-semibold)",
              letterSpacing: "var(--tracking-wider)", textTransform: "uppercase", color: "var(--text-gold)"
            }}>Apply the policy</div>
            <h3 style={{
              fontFamily: "var(--font-display)", fontSize: "var(--text-xl)",
              fontWeight: "var(--weight-semibold)", margin: "8px 0 0"
            }}>Eight situations for self-assessment</h3>
          </div>
          <div style={{ fontSize: "var(--text-sm)", color: "var(--text-muted)", fontFeatureSettings: "'tnum'" }}>
            {shownCount} of {scenarios.length} shown
          </div>
        </div>
        <p style={{
          margin: "12px 0 0", fontSize: "var(--text-sm)", lineHeight: "var(--leading-relaxed)",
          color: "var(--text-secondary)", maxWidth: "78ch"
        }}>
          The situations below arise regularly in practice. Read each one, decide how the policy
          applies, then show the ruling and its reason. These examples do not replace the judgment of
          the instructor on a specific tool.
        </p>

        <div style={{
          display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 16, marginTop: 24
        }}>
          {scenarios.map((s, i) => {
            const on = !!revealed[i];
            const tone = TONES[s.verdict];
            return (
              <div key={s.text} style={{
                background: "var(--surface-card)",
                border: `1px solid ${on ? tone.border : "var(--border-subtle)"}`,
                borderLeft: `3px solid ${on ? tone.edge : "var(--border-default)"}`,
                borderRadius: "var(--radius-md)", padding: "22px 24px",
                display: "flex", flexDirection: "column", gap: 14,
                transition: "border-color var(--duration-base) var(--ease-standard)"
              }}>
                <div style={{ fontSize: "var(--text-base)", lineHeight: "var(--leading-normal)", color: "var(--text-primary)" }}>
                  {s.text}
                </div>
                {on ? (
                  <div style={{ display: "grid", gap: 10 }}>
                    <span style={{
                      justifySelf: "start", fontSize: "var(--text-2xs)", fontWeight: "var(--weight-semibold)",
                      letterSpacing: "var(--tracking-wider)", textTransform: "uppercase",
                      padding: "5px 10px", borderRadius: "var(--radius-sm)",
                      background: tone.bg, color: tone.fg
                    }}>{s.verdict}</span>
                    <div style={{
                      fontSize: "var(--text-sm)", lineHeight: "var(--leading-relaxed)", color: "var(--text-secondary)"
                    }}>{s.reason}</div>
                  </div>
                ) : (
                  <button onClick={() => setRevealed((r) => ({ ...r, [i]: true }))} style={{
                    alignSelf: "start", marginTop: "auto", border: "1px solid var(--border-brand)",
                    background: "transparent", borderRadius: "var(--radius-md)", padding: "8px 16px",
                    fontFamily: "var(--font-sans)", fontSize: "var(--text-sm)",
                    color: "var(--text-accent)", cursor: "pointer", transition: "var(--transition-control)"
                  }}>Show the ruling</button>
                )}
              </div>
            );
          })}
        </div>

        <button onClick={toggleAll} style={{
          marginTop: 22, border: "1px solid var(--border-default)", background: "transparent",
          borderRadius: "var(--radius-md)", padding: "9px 18px", fontFamily: "var(--font-sans)",
          fontSize: "var(--text-sm)", color: "var(--text-accent)", cursor: "pointer",
          transition: "var(--transition-control)"
        }}>{allRevealed ? "Hide all rulings" : "Show all rulings"}</button>
      </div>

      <div style={{
        display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 20, marginTop: 44
      }}>
        {policies.map((p) => (
          <Card key={p.title} eyebrow={p.eyebrow} title={p.title}>{p.body}</Card>
        ))}
      </div>
    </Section>
  );
}
