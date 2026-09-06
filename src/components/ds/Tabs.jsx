import React from "react";

export function Tabs({ items = [], value, defaultValue, onChange, variant = "underline", style, ...rest }) {
  const first = items[0] && (typeof items[0] === "string" ? items[0] : items[0].value);
  const [internal, setInternal] = React.useState(defaultValue || first);
  const current = value !== undefined ? value : internal;
  const pick = (v) => { if (value === undefined) setInternal(v); onChange && onChange(v); };
  const isPill = variant === "pill";
  return (
    <div role="tablist" style={{
      display: "flex", gap: isPill ? "var(--space-2)" : "var(--space-6)",
      borderBottom: isPill ? "none" : "1px solid var(--border-subtle)",
      fontFamily: "var(--font-sans)", flexWrap: "wrap", ...style
    }} {...rest}>
      {items.map((it) => {
        const v = typeof it === "string" ? it : it.value;
        const label = typeof it === "string" ? it : it.label;
        const on = current === v;
        return (
          <button key={v} role="tab" aria-selected={on} onClick={() => pick(v)}
            style={{
              border: 0, cursor: "pointer", fontFamily: "inherit",
              fontSize: "var(--text-base)", fontWeight: on ? "var(--weight-semibold)" : "var(--weight-regular)",
              color: on ? (isPill ? "var(--text-on-brand)" : "var(--text-accent)") : "var(--text-secondary)",
              background: isPill ? (on ? "var(--green-700)" : "var(--neutral-100)") : "transparent",
              padding: isPill ? "var(--space-2) var(--space-4)" : "var(--space-3) 0",
              borderRadius: isPill ? "var(--radius-pill)" : 0,
              boxShadow: !isPill && on ? "inset 0 -3px 0 0 var(--green-700)" : "none",
              transition: "var(--transition-control)"
            }}>
            {label}
          </button>
        );
      })}
    </div>
  );
}
