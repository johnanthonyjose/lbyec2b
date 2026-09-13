import React from "react";

/* The checkpoint at the foot of a step: one question about what is actually on
   the reader's screen, and two answers.

   It exists so an error surfaces where it happened rather than three steps
   later, when it has compounded and the cause is no longer obvious.

   Both answers carry the same weight on purpose. The second is not an error
   state — it is the other thing a reader might genuinely be looking at, and it
   answers with what to do next. The first answer stays selectable throughout,
   so the way out of the second is always to fix the thing and then choose it. */

const eyebrow = {
  fontSize: "var(--text-2xs)", fontWeight: 700, letterSpacing: "var(--tracking-wider)",
  textTransform: "uppercase", color: "var(--text-gold)"
};

/* altValue exists so the GitHub-account handout keeps writing its original
   "stuck" into localStorage. Renaming it would not break that page — only an
   "ok" ever counts towards progress — but it would silently orphan the answers
   of any student who is part-way through, which is not worth a tidier string. */
export function SelfCheck({ question, ok, alt, value, onAnswer, label = "Self-check", altValue = "alt" }) {
  return (
    <div style={{
      margin: "24px 0 0", border: "1px solid var(--border-default)",
      borderRadius: "var(--radius-md)", padding: "22px 24px"
    }}>
      <div style={eyebrow}>{label}</div>
      <p style={{ margin: "10px 0 16px", fontSize: "var(--text-md)", color: "var(--text-primary)" }}>
        {question}
      </p>
      <div style={{ display: "grid", gap: 10, maxWidth: 560 }}>
        <AnswerButton selected={value === "ok"} onClick={() => onAnswer("ok")}>
          {ok.label}
        </AnswerButton>
        <AnswerButton dashed selected={value === altValue} onClick={() => onAnswer(altValue)}>
          {alt.label}
        </AnswerButton>
      </div>

      {value === "ok" && (
        <p style={{
          margin: "16px 0 0", fontSize: "var(--text-base)",
          color: "var(--green-800)", fontWeight: 600
        }}>{ok.note}</p>
      )}

      {value === altValue && (
        <div style={{ margin: "16px 0 0" }}>
          <p style={{
            margin: 0, fontSize: "var(--text-base)", lineHeight: "var(--leading-relaxed)",
            color: "var(--text-secondary)", maxWidth: "70ch"
          }}>{alt.note}</p>
          {alt.figure}
        </div>
      )}
    </div>
  );
}

export function AnswerButton({ children, dashed, selected, onClick }) {
  return (
    <button type="button" className="gh-ans" onClick={onClick} aria-pressed={selected}
      style={{
        textAlign: "left", cursor: "pointer", fontFamily: "var(--font-sans)",
        fontSize: "var(--text-base)",
        color: selected ? "var(--text-primary)" : dashed ? "var(--text-secondary)" : "var(--text-primary)",
        background: selected ? "var(--green-50)" : "#fff",
        border: `1px ${dashed && !selected ? "dashed" : "solid"} ${selected ? "var(--green-700)" : "var(--border-default)"}`,
        borderRadius: "var(--radius-md)", padding: "14px 18px", minHeight: 48,
        transition: "background 140ms, border-color 140ms"
      }}>{children}</button>
  );
}
