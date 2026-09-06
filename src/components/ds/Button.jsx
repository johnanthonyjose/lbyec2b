import React from "react";

const SIZES = {
  sm: { height: "var(--control-height-sm)", padding: "0 var(--space-3)", fontSize: "var(--text-sm)" },
  md: { height: "var(--control-height-md)", padding: "0 var(--space-5)", fontSize: "var(--text-base)" },
  lg: { height: "var(--control-height-lg)", padding: "0 var(--space-6)", fontSize: "var(--text-md)" }
};

const VARIANTS = {
  primary: { background: "var(--green-700)", color: "var(--text-on-brand)", border: "1px solid var(--green-700)", hover: "var(--green-800)", active: "var(--green-900)" },
  secondary: { background: "transparent", color: "var(--text-accent)", border: "1px solid var(--border-brand)", hover: "var(--green-50)", active: "var(--green-100)" },
  gold: { background: "var(--gold-500)", color: "var(--neutral-900)", border: "1px solid var(--gold-600)", hover: "var(--gold-600)", active: "var(--gold-700)" },
  ghost: { background: "transparent", color: "var(--text-accent)", border: "1px solid transparent", hover: "var(--green-50)", active: "var(--green-100)" },
  inverse: { background: "var(--neutral-0)", color: "var(--green-800)", border: "1px solid var(--neutral-0)", hover: "var(--green-50)", active: "var(--green-100)" }
};

export function Button({
  children, variant = "primary", size = "md", disabled = false, fullWidth = false,
  iconLeft, iconRight, type = "button", onClick, style, as, ...rest
}) {
  const [state, setState] = React.useState("idle");
  const v = VARIANTS[variant] || VARIANTS.primary;
  const s = SIZES[size] || SIZES.md;
  const bg = disabled ? "var(--neutral-100)" : state === "active" ? v.active : state === "hover" ? v.hover : v.background;
  // `as` lets a Button render as an <a> so a link keeps link semantics
  // (middle-click, copy address) instead of being a button inside an anchor.
  const Tag = as || "button";
  const tagProps = Tag === "button" ? { type, disabled } : {};
  return (
    <Tag
      {...tagProps}
      onClick={onClick}
      onMouseEnter={() => setState("hover")}
      onMouseLeave={() => setState("idle")}
      onMouseDown={() => setState("active")}
      onMouseUp={() => setState("hover")}
      onFocus={() => setState("hover")}
      onBlur={() => setState("idle")}
      style={{
        display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "var(--space-2)",
        width: fullWidth ? "100%" : "auto", height: s.height, padding: s.padding, fontSize: s.fontSize,
        fontFamily: "var(--font-sans)", fontWeight: "var(--weight-semibold)", letterSpacing: "0.02em",
        borderRadius: "var(--radius-md)", cursor: disabled ? "not-allowed" : "pointer",
        background: bg,
        color: disabled ? "var(--text-muted)" : v.color,
        border: disabled ? "1px solid var(--border-subtle)" : v.border,
        textDecoration: "none", boxSizing: "border-box",
        transition: "var(--transition-control)", ...style
      }}
      {...rest}
    >
      {iconLeft}
      {children}
      {iconRight}
    </Tag>
  );
}
