import React from "react";
import { Wordmark } from "./Brand.jsx";

/* Sticky masthead shared by every page.
   The gold bar under the masthead is driven one of two ways. Pass
   `progressRef` and a page can write its width imperatively, which is what a
   long page does on every scroll frame without re-rendering. Pass `progress`
   (0-100) instead and it is driven from state, which suits a page whose
   progress is a count of completed work rather than a scroll position.
   `sections` are in-page anchors; `pages` are links to other pages of the
   site. A page that has no sections still gets the site-wide page links. */
export function SiteHeader({ subtitle = "LBYEC2B", sections = [], pages = [], active, progressRef, progress, progressLabel }) {
  return (
    <header style={{
      position: "sticky", top: 0, zIndex: 30,
      background: "var(--surface-page)", borderBottom: "1px solid var(--border-subtle)"
    }}>
      <div style={{ height: 4, background: "var(--gold-200)" }}
        role={progress != null ? "progressbar" : undefined}
        aria-valuenow={progress != null ? Math.round(progress) : undefined}
        aria-valuemin={progress != null ? 0 : undefined}
        aria-valuemax={progress != null ? 100 : undefined}
        aria-label={progress != null ? progressLabel : undefined}>
        <div ref={progressRef} style={{
          height: 4,
          width: progress != null ? `${progress}%` : "0%",
          background: "var(--rule-brand)",
          transition: "width var(--duration-base) var(--ease-standard)"
        }} />
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
