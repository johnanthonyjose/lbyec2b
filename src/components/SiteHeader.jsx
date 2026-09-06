import React from "react";
import { Wordmark } from "./Brand.jsx";

/* Sticky masthead shared by every page.
   `progressRef` is optional: pass it on a long page to get the gold reading
   bar, omit it on a short one and the bar stays at zero width.
   `sections` are in-page anchors; `pages` are links to other pages of the
   site. A page that has no sections still gets the site-wide page links. */
export function SiteHeader({ subtitle = "LBYEC2B", sections = [], pages = [], active, progressRef }) {
  return (
    <header style={{
      position: "sticky", top: 0, zIndex: 30,
      background: "var(--surface-page)", borderBottom: "1px solid var(--border-subtle)"
    }}>
      <div style={{ height: 3, background: "var(--gold-200)" }}>
        <div ref={progressRef} style={{ height: 3, width: "0%", background: "var(--rule-brand)" }} />
      </div>
      <div className="dls-section" style={{
        maxWidth: "var(--container-lg)", margin: "0 auto", padding: "14px 32px",
        display: "flex", alignItems: "center", gap: 24, flexWrap: "wrap"
      }}>
        <Wordmark subtitle={subtitle} />
        <nav aria-label="Page sections" style={{
          marginLeft: "auto", display: "flex", gap: 26, flexWrap: "wrap", fontSize: "var(--text-sm)"
        }}>
          {pages.map((p) => (
            <a key={p.href} className="dls-navlink" href={p.href} aria-current={p.current ? "true" : undefined}>{p.label}</a>
          ))}
          {sections.map((s) => (
            <a key={s.id} className="dls-navlink" href={`#${s.id}`} aria-current={active === s.id ? "true" : undefined}>{s.label}</a>
          ))}
        </nav>
      </div>
    </header>
  );
}
