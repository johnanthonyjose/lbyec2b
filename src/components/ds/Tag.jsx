import React from "react";

export function Tag({ children, selected = false, onRemove, onClick, icon, style, ...rest }) {
  const [hover, setHover] = React.useState(false);
  const clickable = Boolean(onClick);
  return (
    <span
      onClick={onClick}
      onKeyDown={clickable ? (e) => {
        if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onClick(e); }
      } : undefined}
      onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      role={clickable ? "button" : undefined} tabIndex={clickable ? 0 : undefined}
      aria-pressed={clickable ? selected : undefined}
      style={{
        display: "inline-flex", alignItems: "center", gap: "var(--space-2)",
        height: 28, padding: "0 var(--space-3)", borderRadius: "var(--radius-pill)",
        border: "1px solid " + (selected ? "var(--green-700)" : "var(--border-default)"),
        background: selected ? "var(--green-700)" : hover && clickable ? "var(--green-50)" : "var(--neutral-0)",
        color: selected ? "var(--text-on-brand)" : "var(--text-primary)",
        fontFamily: "var(--font-sans)", fontSize: "var(--text-sm)",
        cursor: clickable ? "pointer" : "default", transition: "var(--transition-control)", ...style
      }}
      {...rest}
    >
      {icon}
      {children}
      {onRemove && (
        <button type="button" aria-label="Remove" onClick={(e) => { e.stopPropagation(); onRemove(e); }}
          style={{ border: 0, background: "transparent", color: "inherit", cursor: "pointer", padding: 0, lineHeight: 1, fontSize: 14 }}>×</button>
      )}
    </span>
  );
}
