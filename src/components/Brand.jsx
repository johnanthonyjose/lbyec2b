import React from "react";

/* The course mark: code brackets around a hammer. Engineering tools inside a
   program. Drawn rather than raster so it stays crisp at any size and picks
   up the design-system colours. */
export function CourseMark({ size = 34, tone = "light", ...rest }) {
  const bracket = tone === "dark" ? "var(--gold-300)" : "var(--green-700)";
  const hammer = tone === "dark" ? "var(--neutral-0)" : "var(--green-700)";
  return (
    <svg viewBox="0 0 64 64" width={size} height={size} aria-hidden="true" style={{ display: "block", flex: "none" }} {...rest}>
      <rect x="1.5" y="1.5" width="61" height="61" rx="4" fill="none" stroke="var(--gold-500)" strokeWidth="1.5" />
      <g fill="none" stroke={bracket} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 21 11.5 32 21 43" />
        <path d="M43 21 52.5 32 43 43" />
      </g>
      <g fill="none" stroke={hammer} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
        <path d="M32 46V28.5" />
        <path d="M25 19.5h13.5v8H25l-3.5-4z" />
      </g>
    </svg>
  );
}

/* The hero-scale version of the same mark, with the double rule the
   Institutional Identification Manual uses around a framed device. */
export function CourseMarkLarge(props) {
  return (
    <svg viewBox="0 0 64 64" style={{ width: "100%", maxWidth: 260, height: "auto" }} role="img"
      aria-label="Course mark: code brackets around a hammer" {...props}>
      <rect x="1" y="1" width="62" height="62" rx="4" fill="none" stroke="var(--gold-500)" strokeWidth="0.7" />
      <rect x="6" y="6" width="52" height="52" rx="3" fill="none" stroke="rgba(255,255,255,0.18)" strokeWidth="0.5" />
      <g fill="none" stroke="var(--gold-300)" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 20 13 32l9 12" />
        <path d="M42 20l9 12-9 12" />
      </g>
      <g fill="none" stroke="var(--neutral-0)" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round">
        <path d="M32 47V27.5" />
        <path d="M24 18.5h16a1.5 1.5 0 0 1 1.5 1.5v6a1.5 1.5 0 0 1-1.5 1.5H24l-4-4.5z" />
      </g>
      <path d="M32 51.5v4" fill="none" stroke="var(--gold-300)" strokeWidth="2.1" strokeLinecap="round" />
    </svg>
  );
}

/* The university wordmark. The horizontal scale approximates the condensed
   set of ITC Galliard in the official logotype, which EB Garamond does not
   carry on its own. */
export function Wordmark({ subtitle, href = "index.html" }) {
  return (
    <a href={href} style={{ display: "flex", alignItems: "center", gap: 12, textDecoration: "none", color: "inherit" }}>
      <CourseMark />
      <span style={{ display: "flex", flexDirection: "column", lineHeight: 1.1 }}>
        <span style={{
          fontFamily: "var(--font-display)", fontSize: 19, fontWeight: "var(--weight-semibold)",
          color: "var(--green-700)", transform: "scaleX(.92)", transformOrigin: "left center",
          letterSpacing: "var(--tracking-tight)"
        }}>De La Salle University</span>
        {subtitle && (
          <span style={{
            fontSize: 11, fontWeight: "var(--weight-semibold)", letterSpacing: "var(--tracking-wider)",
            textTransform: "uppercase", color: "var(--text-gold)", marginTop: 3
          }}>{subtitle}</span>
        )}
      </span>
    </a>
  );
}
