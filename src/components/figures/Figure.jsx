import React from "react";
import { useZoom } from "./zoom.jsx";

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
  // A page may offer to enlarge its figures. Supplied through context so that
  // neither this component's callers nor the handouts' step data have to know
  // whether the page they are on does; a page that offers nothing gets the
  // plain image it always had.
  const zoom = useZoom();

  const shot = (
    <>
      {/* Intrinsic dimensions reserve the right box, so the pins are never
          briefly positioned against a collapsed image. */}
      <img className="fig-img" src={src} alt={alt} width={width} height={height} />
      {pins.map((p) => (
        <span key={p.n} className="gh-pin" style={{ left: p.left, top: p.top }}>{p.n}</span>
      ))}
    </>
  );

  if (!zoom) return <div className="fig-shot">{shot}</div>;

  return (
    <button type="button" className="fig-shot fig-zoom"
      onClick={() => zoom({ src, alt, width, height, pins })}
      aria-label={`Enlarge the figure: ${alt}`}>
      {shot}
      <span className="fig-zoom-hint" aria-hidden="true">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor"
          strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5M11 8v6M8 11h6" />
        </svg>
        Enlarge
      </span>
    </button>
  );
}
