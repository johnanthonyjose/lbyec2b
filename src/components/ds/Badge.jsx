import React from "react";

const TONES = {
  neutral: ["var(--neutral-100)", "var(--text-secondary)"],
  brand: ["var(--green-50)", "var(--green-800)"],
  gold: ["var(--gold-100)", "var(--gold-700)"],
  success: ["var(--status-success-bg)", "var(--status-success)"],
  warning: ["var(--status-warning-bg)", "var(--status-warning)"],
  danger: ["var(--status-danger-bg)", "var(--status-danger)"],
  info: ["var(--status-info-bg)", "var(--status-info)"]
};

export function Badge({ children, tone = "neutral", solid = false, style, ...rest }) {
  const [bg, fg] = TONES[tone] || TONES.neutral;
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: "var(--space-1)",
      padding: "2px var(--space-2)", borderRadius: "var(--radius-sm)",
      background: solid ? fg : bg, color: solid ? "var(--neutral-0)" : fg,
      fontFamily: "var(--font-sans)", fontSize: "var(--text-xs)", fontWeight: "var(--weight-semibold)",
      letterSpacing: "var(--tracking-wide)", textTransform: "uppercase", ...style
    }} {...rest}>{children}</span>
  );
}
