import React from "react";

export function Card({
  children, eyebrow, title, meta, footer, variant = "default",
  goldRule = false, href, onClick, style, ...rest
}) {
  const [hover, setHover] = React.useState(false);
  const interactive = Boolean(href || onClick);
  const tones = {
    default: { bg: "var(--surface-card)", fg: "var(--text-primary)", bd: "var(--border-subtle)" },
    tint: { bg: "var(--surface-brand-tint)", fg: "var(--text-primary)", bd: "var(--green-100)" },
    brand: { bg: "var(--surface-brand)", fg: "var(--text-on-brand)", bd: "var(--green-800)" },
    ink: { bg: "var(--surface-ink)", fg: "var(--text-inverse)", bd: "var(--neutral-800)" }
  };
  const t = tones[variant] || tones.default;
  const El = href ? "a" : onClick ? "button" : "div";
  return (
    <El
      href={href} onClick={onClick}
      onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{
        display: "block", textAlign: "left", width: "100%", boxSizing: "border-box",
        background: t.bg, color: t.fg, border: "1px solid " + t.bd,
        borderTop: goldRule ? "var(--rule-width-brand) solid var(--rule-brand)" : "1px solid " + t.bd,
        borderRadius: "var(--radius-md)", padding: "var(--space-6)",
        textDecoration: "none", cursor: interactive ? "pointer" : "default",
        boxShadow: interactive && hover ? "var(--shadow-md)" : "var(--shadow-xs)",
        transform: interactive && hover ? "translateY(-2px)" : "none",
        transition: "box-shadow var(--duration-base) var(--ease-standard), transform var(--duration-base) var(--ease-standard)",
        ...style
      }}
      {...rest}
    >
      {eyebrow && (
        <div style={{
          fontFamily: "var(--font-sans)", fontSize: "var(--text-xs)", fontWeight: "var(--weight-semibold)",
          letterSpacing: "var(--tracking-wider)", textTransform: "uppercase",
          color: variant === "brand" || variant === "ink" ? "var(--gold-300)" : "var(--text-gold)",
          marginBottom: "var(--space-3)"
        }}>{eyebrow}</div>
      )}
      {title && (
        <div style={{ fontFamily: "var(--font-display)", fontSize: "var(--text-xl)", fontWeight: "var(--weight-semibold)", lineHeight: "var(--leading-snug)" }}>{title}</div>
      )}
      {children && <div style={{ marginTop: "var(--space-3)", fontSize: "var(--text-base)", lineHeight: "var(--leading-relaxed)", color: variant === "brand" || variant === "ink" ? "rgba(255,255,255,0.86)" : "var(--text-secondary)" }}>{children}</div>}
      {meta && <div style={{ marginTop: "var(--space-4)", fontFamily: "var(--font-sans)", fontSize: "var(--text-sm)", color: variant === "brand" || variant === "ink" ? "rgba(255,255,255,0.72)" : "var(--text-muted)" }}>{meta}</div>}
      {footer && <div style={{ marginTop: "var(--space-5)", paddingTop: "var(--space-4)", borderTop: "1px solid " + (variant === "brand" || variant === "ink" ? "rgba(255,255,255,0.2)" : "var(--border-subtle)") }}>{footer}</div>}
    </El>
  );
}
