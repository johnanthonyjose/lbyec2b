import React from "react";
import { SiteHeader } from "../components/SiteHeader.jsx";
import { SiteFooter } from "../components/SiteFooter.jsx";
import { Button } from "../components/ds/index.js";
import { usePersistentState } from "../hooks/index.js";
import { Resolution } from "../components/Resolution.jsx";
import { SelfCheck } from "../components/SelfCheck.jsx";
import { steps } from "./github-account/steps.jsx";
import { resolutionById } from "./github-account/resolutions.jsx";

const TOTAL = steps.length;
const STORAGE_KEY = "lbyec2b-gh-guide";

const eyebrow = {
  fontSize: "var(--text-2xs)", fontWeight: 700, letterSpacing: "var(--tracking-wider)",
  textTransform: "uppercase", color: "var(--text-gold)"
};

export default function GitHubAccount() {
  // step and answers persist; the open resolution deliberately does not, so a
  // reload never restores a modal over the page.
  const [saved, save] = usePersistentState(STORAGE_KEY, { step: 1, answers: {} });
  const [fix, setFix] = React.useState(0);

  const step = Math.min(TOTAL, Math.max(1, saved.step || 1));
  const answers = saved.answers || {};
  const current = steps[step - 1];

  const doneCount = steps.filter((s) => answers[s.n] === "ok").length;
  const pct = Math.round((doneCount / TOTAL) * 100);
  const allDone = doneCount === TOTAL;

  const goto = (n) => save({ ...saved, step: Math.min(TOTAL, Math.max(1, n)) });
  const answer = (n, value) => save({ ...saved, answers: { ...answers, [n]: value } });
  const restart = () => save({ step: 1, answers: {} });

  const gotoFromFix = (n) => {
    setFix(0);
    goto(n);
    const w = document.getElementById("walk");
    if (w) window.scrollTo({ top: w.offsetTop - 72, behavior: "smooth" });
  };

  return (
    <div style={{
      background: "var(--surface-page)", color: "var(--text-primary)",
      fontFamily: "var(--font-sans)", minHeight: "100%"
    }}>
      <SiteHeader
        pages={[
          { href: "index.html", label: "Home" },
          { href: "course-overview.html", label: "Course overview" },
          { href: "github-account.html", label: "GitHub account", current: true },
          { href: "assignment-workflow.html", label: "Assignment workflow" }
        ]}
        progress={pct}
        progressLabel={allDone ? "Seven of seven steps confirmed" : `${doneCount} of ${TOTAL} steps confirmed`}
      />

      <main>
        <Hero ctaLabel={doneCount === 0 ? "Begin at step 1" : `Resume at step ${step}`} />

        <StepMap steps={steps} step={step} answers={answers} onSelect={goto} />

        <section id="walk" className="dls-section" style={{
          maxWidth: "var(--container-lg)", margin: "0 auto",
          padding: "44px 32px 8px", scrollMarginTop: 80
        }}>
          <Step key={current.n} step={current} answer={answers[current.n]}
            onAnswer={(v) => answer(current.n, v)} onOpenFix={() => setFix(current.fix)} />

          <div style={{
            display: "flex", gap: 14, alignItems: "center", justifyContent: "space-between",
            flexWrap: "wrap", margin: "40px 0 0", paddingTop: 24, borderTop: "1px solid var(--border-subtle)"
          }}>
            <button type="button" onClick={() => goto(step - 1)} disabled={step === 1}
              style={{
                cursor: step === 1 ? "not-allowed" : "pointer", fontFamily: "var(--font-sans)",
                fontSize: "var(--text-sm)", fontWeight: 600, letterSpacing: "var(--tracking-wide)",
                background: "transparent", border: "1px solid var(--border-default)",
                borderRadius: "var(--radius-md)",
                color: step === 1 ? "var(--text-muted)" : "var(--text-secondary)",
                padding: "0 20px", minHeight: 44, opacity: step === 1 ? 0.55 : 1
              }}>Previous step</button>

            <span style={{
              fontSize: "var(--text-2xs)", letterSpacing: "var(--tracking-wide)",
              textTransform: "uppercase", color: "var(--text-muted)", fontFeatureSettings: "'tnum'"
            }}>Step {step} of {TOTAL}</span>

            <button type="button" onClick={() => goto(step === TOTAL ? 1 : step + 1)}
              style={{
                cursor: "pointer", fontFamily: "var(--font-sans)", fontSize: "var(--text-sm)",
                fontWeight: 600, letterSpacing: "var(--tracking-wide)",
                background: "var(--green-700)", border: "1px solid var(--green-700)",
                borderRadius: "var(--radius-md)", color: "#fff", padding: "0 24px", minHeight: 44
              }}>{step === TOTAL ? "Return to step 1" : "Next step"}</button>
          </div>
        </section>

        {allDone && (
          <section className="dls-section" style={{
            maxWidth: "var(--container-lg)", margin: "44px auto 0", padding: "0 32px"
          }}>
            <div style={{
              border: "1px solid var(--green-700)", borderLeft: "4px solid var(--green-700)",
              borderRadius: "var(--radius-md)", background: "var(--green-50)",
              padding: "28px 32px", display: "flex", gap: 28, alignItems: "baseline", flexWrap: "wrap"
            }}>
              <div style={{ minWidth: 0, flex: 1 }}>
                <div style={{ ...eyebrow, color: "var(--green-800)" }}>All seven steps confirmed</div>
                <h2 style={{
                  fontFamily: "var(--font-display)", fontSize: "var(--text-xl)",
                  fontWeight: "var(--weight-semibold)", margin: "10px 0 8px"
                }}>Requirements satisfied</h2>
                <p style={{
                  margin: 0, fontSize: "var(--text-base)", lineHeight: "var(--leading-relaxed)",
                  color: "var(--text-secondary)", maxWidth: "70ch"
                }}>
                  The account is registered, the electronic mail address is confirmed, and membership
                  of the course organisation is held. Bring the username to the first laboratory session.
                </p>
              </div>
              <button type="button" onClick={restart} style={{
                cursor: "pointer", fontFamily: "var(--font-sans)", fontSize: "var(--text-sm)",
                fontWeight: 600, letterSpacing: "var(--tracking-wide)", background: "transparent",
                border: "1px solid var(--green-700)", borderRadius: "var(--radius-md)",
                color: "var(--green-800)", padding: "0 20px", minHeight: 44
              }}>Clear progress</button>
            </div>
          </section>
        )}
      </main>

      <SiteFooter note="Department of Electronics and Computer Engineering" />

      {fix > 0 && (
        <Resolution
          fix={resolutionById[fix]}
          onClose={() => setFix(0)}
          onReturn={() => gotoFromFix(resolutionById[fix].returnTo)}
          returnLabel={`Return to step ${resolutionById[fix].returnTo}`}
        />
      )}
    </div>
  );
}

function Hero({ ctaLabel }) {
  return (
    <section style={{ background: "var(--green-900)", color: "var(--text-inverse)" }}>
      <div className="gh-two dls-section" style={{
        maxWidth: "var(--container-lg)", margin: "0 auto", padding: "60px 32px 56px",
        display: "grid", gridTemplateColumns: "minmax(0, 1.55fr) minmax(0, 1fr)",
        gap: 48, alignItems: "center"
      }}>
        <div style={{ minWidth: 0 }}>
          <div style={{ ...eyebrow, fontSize: "var(--text-xs)", color: "var(--gold-300)" }}>
            Laboratory Preliminary · Handout 01
          </div>
          <h1 style={{
            fontFamily: "var(--font-display)", fontSize: "clamp(34px, 5vw, 54px)",
            fontWeight: "var(--weight-semibold)", lineHeight: "var(--leading-tight)",
            letterSpacing: "var(--tracking-tight)", margin: "18px 0 0"
          }}>Registering a GitHub account</h1>
          <p style={{
            fontSize: "var(--text-md)", lineHeight: "var(--leading-relaxed)",
            color: "rgba(255,255,255,0.9)", maxWidth: "52ch", margin: "18px 0 0"
          }}>
            Laboratory work is submitted through GitHub. Each student requires a personal account,
            with a confirmed mail address, enrolled in the course organisation before the first
            laboratory session.
          </p>
          <dl style={{
            display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            gap: "20px 32px", margin: "32px 0 0", paddingTop: 24,
            borderTop: "1px solid rgba(255,255,255,0.24)"
          }}>
            <div>
              <dt style={{ ...eyebrow, color: "var(--gold-300)" }}>Duration</dt>
              <dd style={{
                margin: "6px 0 0", fontSize: "var(--text-base)",
                color: "rgba(255,255,255,0.9)", fontFeatureSettings: "'tnum'"
              }}>Approximately 15 minutes</dd>
            </div>
          </dl>
          <div style={{ marginTop: 28 }}>
            <Button as="a" href="#walk" variant="gold" size="lg">{ctaLabel}</Button>
          </div>
        </div>

        <div className="dls-hero-mark" style={{ display: "flex", justifyContent: "center", minWidth: 0 }}>
          <CredentialMark />
        </div>
      </div>
    </section>
  );
}

/* A membership credential bearing a verification seal: what the handout
   produces, drawn in the brand's own terms. */
function CredentialMark() {
  return (
    <svg viewBox="0 0 200 200" style={{ width: "100%", maxWidth: 240, height: "auto" }} role="img"
      aria-label="Mark: a membership credential bearing a verification seal">
      <rect x="1" y="1" width="198" height="198" rx="4" fill="none" stroke="var(--gold-500)" strokeWidth="0.8" />
      <rect x="10" y="10" width="180" height="180" rx="3" fill="none" stroke="rgba(255,255,255,0.16)" strokeWidth="0.6" />
      <g fill="none" stroke="var(--neutral-0)" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round">
        <rect x="34" y="52" width="132" height="92" rx="6" />
        <path d="M34 74h132" />
        <circle cx="68" cy="104" r="12" />
        <path d="M52 128c3.6-9.6 28.4-9.6 32 0" />
      </g>
      <g fill="none" stroke="var(--gold-300)" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round">
        <path d="M104 100h44M104 116h30" />
        <path d="M44 64h10" />
      </g>
      <circle cx="152" cy="140" r="21" fill="var(--green-900)" stroke="var(--gold-300)" strokeWidth="3" />
      <path d="M143 140.5l6.5 6.5L161 135" fill="none" stroke="var(--gold-300)" strokeWidth="3.6"
        strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/* The seven steps as a band of selectable markers. A confirmed step carries a
   tick and the brand green; the current one carries gold. */
function StepMap({ steps, step, answers, onSelect }) {
  return (
    <section style={{ background: "var(--surface-subtle)", borderBottom: "1px solid var(--border-subtle)" }}>
      <div className="dls-section" style={{
        maxWidth: "var(--container-lg)", margin: "0 auto", padding: "36px 32px 40px"
      }}>
        <div style={{ ...eyebrow, fontSize: "var(--text-xs)" }}>Sequence of steps</div>
        <p style={{
          margin: "10px 0 26px", fontSize: "var(--text-sm)",
          color: "var(--text-secondary)", maxWidth: "70ch"
        }}>
          One step is presented at a time. Select any step below to move to it directly. Progress is
          recorded on this device and is neither submitted nor graded.
        </p>
        <div style={{
          display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(126px, 1fr))",
          borderTop: "1px solid var(--border-default)"
        }}>
          {steps.map((s) => {
            const done = answers[s.n] === "ok";
            const currentStep = step === s.n;
            return (
              <button key={s.n} type="button" onClick={() => onSelect(s.n)}
                aria-current={currentStep ? "step" : undefined}
                style={{
                  textAlign: "left", cursor: "pointer", background: "transparent", border: 0,
                  borderTop: `3px solid ${currentStep ? "var(--gold-500)" : done ? "var(--green-700)" : "transparent"}`,
                  marginTop: -1, padding: "14px 14px 16px 0", fontFamily: "var(--font-sans)"
                }}>
                <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{
                    width: 22, height: 22, borderRadius: 999, display: "grid", placeItems: "center",
                    fontSize: 12, fontWeight: 600, fontFeatureSettings: "'tnum'",
                    background: done ? "var(--green-700)" : currentStep ? "var(--gold-500)" : "transparent",
                    color: done || currentStep ? "#fff" : "var(--text-muted)",
                    border: `1px solid ${done ? "var(--green-700)" : currentStep ? "var(--gold-500)" : "var(--border-default)"}`
                  }}>{done ? "✓" : s.n}</span>
                  <span style={{
                    fontSize: "var(--text-2xs)", letterSpacing: "var(--tracking-wide)",
                    textTransform: "uppercase", color: "var(--text-muted)", fontFeatureSettings: "'tnum'"
                  }}>Step {s.n}</span>
                </span>
                <span style={{
                  display: "block", marginTop: 8, fontSize: "var(--text-sm)",
                  lineHeight: "var(--leading-normal)",
                  color: currentStep ? "var(--text-primary)" : "var(--text-secondary)",
                  fontWeight: currentStep ? 600 : 400
                }}>{s.title}</span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function Step({ step, answer, onAnswer, onOpenFix }) {
  return (
    <article>
      <div style={{ display: "flex", alignItems: "baseline", gap: 14, flexWrap: "wrap" }}>
        <span style={{
          fontFamily: "var(--font-display)", fontSize: "var(--text-4xl)",
          fontWeight: "var(--weight-semibold)", lineHeight: 1,
          color: "var(--gold-500)", fontFeatureSettings: "'tnum'"
        }}>{String(step.n).padStart(2, "0")}</span>
        <span style={{
          fontSize: "var(--text-xs)", fontWeight: 600, letterSpacing: "var(--tracking-wider)",
          textTransform: "uppercase", color: "var(--text-secondary)"
        }}>Step {step.n} of {TOTAL}</span>
      </div>

      <h2 style={{
        fontFamily: "var(--font-display)", fontSize: "var(--text-3xl)",
        fontWeight: "var(--weight-semibold)", margin: "14px 0 0", maxWidth: "32ch"
      }}>{step.title}</h2>

      <div style={{
        display: "flex", gap: 14, alignItems: "flex-start", margin: "22px 0 0",
        padding: "18px 22px", background: "var(--green-50)", borderLeft: "3px solid var(--green-700)"
      }}>
        <span style={{
          fontSize: "var(--text-2xs)", fontWeight: 700, letterSpacing: "var(--tracking-wider)",
          textTransform: "uppercase", color: "var(--green-800)", paddingTop: 4, flex: "none"
        }}>Required action</span>
        <span style={{
          fontSize: "var(--text-md)", lineHeight: "var(--leading-normal)", color: "var(--text-primary)"
        }}>{step.action}</span>
      </div>

      {step.body}
      {step.figure}

      <button type="button" className="gh-warn" onClick={onOpenFix} style={{
        width: "100%", textAlign: "left", cursor: "pointer", margin: "32px 0 0",
        display: "flex", alignItems: "center", gap: 16, background: "var(--surface-gold-tint)",
        border: "1px solid var(--gold-300)", borderLeft: "4px solid var(--gold-500)",
        borderRadius: "var(--radius-md)", padding: "16px 20px", minHeight: 56,
        fontFamily: "var(--font-sans)", transition: "background 140ms, border-color 140ms"
      }}>
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--gold-600)"
          strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ flex: "none" }}>
          <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
          <path d="M12 9v4" /><path d="M12 17h.01" />
        </svg>
        <span style={{ flex: 1, minWidth: 0 }}>
          <span style={{
            display: "block", fontSize: "var(--text-2xs)", fontWeight: 700,
            letterSpacing: "var(--tracking-wider)", textTransform: "uppercase", color: "var(--gold-700)"
          }}>Anticipated difficulty</span>
          <span style={{
            display: "block", marginTop: 4, fontSize: "var(--text-base)",
            lineHeight: "var(--leading-normal)", color: "var(--text-primary)"
          }}>{step.difficulty}</span>
        </span>
        <span style={{
          fontSize: "var(--text-sm)", fontWeight: 600, color: "var(--gold-700)", whiteSpace: "nowrap"
        }}>View resolution</span>
      </button>

      <SelfCheck
        question={step.question}
        ok={{ label: step.okLabel, note: step.okNote }}
        alt={{ label: step.stuckLabel, note: step.stuckNote }}
        value={answer}
        onAnswer={onAnswer}
        altValue="stuck"
      />
    </article>
  );
}


