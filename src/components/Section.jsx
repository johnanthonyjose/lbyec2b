import React from "react";

/* Every band of the page shares this shell: an optional id for the scroll
   spy, a background tone, and the 1120px measure with page gutters. */
export function Section({ id, tone = "page", children, style, innerStyle, ...rest }) {
  const tones = {
    page: { background: "var(--surface-page)" },
    subtle: { background: "var(--surface-subtle)" },
    brand: { background: "var(--green-900)", color: "var(--text-inverse)" }
  };
  return (
    <section id={id} style={{ scrollMarginTop: 96, ...tones[tone], ...style }} {...rest}>
      <div className="dls-section" style={{
        maxWidth: "var(--container-lg)", margin: "0 auto", padding: "80px 32px", ...innerStyle
      }}>
        {children}
      </div>
    </section>
  );
}

/* Eyebrow + heading + optional standfirst. The eyebrow is gold on light
   grounds and the lighter gold on the deep green ones, which is the pairing
   the brand guidance sets for reversed type. */
export function SectionHeading({ eyebrow, title, children, tone = "light", headingStyle }) {
  const eyebrowColor = tone === "dark" ? "var(--gold-300)" : "var(--text-gold)";
  return (
    <>
      {eyebrow && (
        <div style={{
          fontSize: "var(--text-xs)", fontWeight: "var(--weight-semibold)",
          letterSpacing: "var(--tracking-wider)", textTransform: "uppercase", color: eyebrowColor
        }}>{eyebrow}</div>
      )}
      {title && (
        <h2 style={{
          fontFamily: "var(--font-display)", fontSize: "var(--text-2xl)",
          fontWeight: "var(--weight-semibold)", margin: "12px 0 6px", ...headingStyle
        }}>{title}</h2>
      )}
      {children && (
        <p style={{
          margin: "0 0 36px", fontSize: "var(--text-sm)",
          color: tone === "dark" ? "rgba(255,255,255,0.72)" : "var(--text-muted)", maxWidth: "78ch"
        }}>{children}</p>
      )}
    </>
  );
}
