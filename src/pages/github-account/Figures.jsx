import React from "react";

/* The schematic diagrams that stand in for screenshots.
   They are drawn rather than captured so they cannot go stale when GitHub
   changes its interface, and so they carry the design system's own colours.
   Each is explicitly labelled a schematic in its caption. */

const fieldStyle = {
  border: "1px solid var(--border-default)", borderRadius: "var(--radius-md)",
  background: "#fff", height: 34
};

export function Field({ style }) {
  return <div style={{ ...fieldStyle, ...style }} />;
}

export function GreenButton({ children, height = 34, size = "var(--text-sm)", style }) {
  return (
    <div style={{
      height, borderRadius: "var(--radius-md)", background: "var(--green-700)",
      color: "#fff", display: "grid", placeItems: "center",
      fontSize: size, fontWeight: 600, ...style
    }}>{children}</div>
  );
}

export function Figure({ caption, note, maxWidth, children }) {
  return (
    <figure style={{ margin: "28px 0 0" }}>
      <figcaption style={{
        fontSize: "var(--text-2xs)", fontWeight: 700, letterSpacing: "var(--tracking-wider)",
        textTransform: "uppercase", color: "var(--text-gold)", marginBottom: 10
      }}>{caption}</figcaption>
      {children}
      {note && (
        <p style={{ margin: "10px 0 0", fontSize: "var(--text-2xs)", color: "var(--text-muted)", maxWidth }}>
          {note}
        </p>
      )}
    </figure>
  );
}

/* A browser chrome frame with the address bar filled in. */
export function BrowserFrame({ address, children, maxWidth = 620 }) {
  return (
    <div style={{
      border: "1px solid var(--border-default)", borderRadius: "var(--radius-md)",
      background: "var(--neutral-50)", padding: 16, maxWidth
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
        {[0, 1, 2].map((i) => (
          <span key={i} style={{ width: 9, height: 9, borderRadius: 999, background: "var(--neutral-300)" }} />
        ))}
        <span style={{
          flex: 1, background: "#fff", border: "1px solid var(--border-default)",
          borderRadius: "var(--radius-pill)", padding: "7px 14px", fontSize: "var(--text-sm)",
          color: "var(--text-primary)", display: "flex", alignItems: "center", gap: 8
        }}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--green-700)"
            strokeWidth="2" strokeLinecap="round" aria-hidden="true">
            <rect x="3" y="11" width="18" height="11" rx="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
          {address}
        </span>
      </div>
      {children}
    </div>
  );
}

/* A captured screenshot with numbered pins over the control being referenced.
   Pin coordinates are percentages of the image box, so they track the image
   as it scales. */
export function PinnedShot({ src, alt, width, height, pins = [] }) {
  return (
    <div style={{ position: "relative", border: "5px solid var(--surface-gold-tint)", outline: "1px solid var(--border-gold)" }}>
      {/* Loaded eagerly: these two are the substance of the final step, not
          decoration, and the intrinsic dimensions reserve the right box so the
          pins are never briefly positioned against a collapsed image. */}
      <img src={src} alt={alt} width={width} height={height}
        style={{ width: "100%", height: "auto", display: "block" }} />
      {pins.map((p) => (
        <span key={p.n} className="gh-pin" style={{ left: p.left, top: p.top }}>{p.n}</span>
      ))}
    </div>
  );
}
