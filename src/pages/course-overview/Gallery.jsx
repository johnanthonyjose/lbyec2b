import React from "react";

/* Photographs of the course in progress.
   The files are not in the repository yet: the design project's copies exceed
   the 256 KiB ceiling on a single design-system file read, so they could not
   be exported whole. Drop the two JPEGs into public/assets/img/ under the
   names below and they appear here automatically. Until then each frame falls
   back to a drawn placeholder rather than a broken image icon, so the band
   still reads as designed. */
const figures = [
  {
    src: "assets/img/lab-session.jpeg",
    alt: "Students at workstations during an LBYEC2B laboratory session.",
    caption: "A laboratory session in progress. Instruction is given at the workstation and the week’s activity is completed within the session."
  },
  {
    src: "assets/img/project-team.jpeg",
    alt: "A project team in consultation with the instructor.",
    caption: "A project team in consultation. From Week 9 onwards the work is scoped, apportioned and defended as a team."
  }
];

export function Gallery() {
  return (
    <section style={{ background: "var(--green-900)" }}>
      <div className="dls-section" style={{ maxWidth: "var(--container-lg)", margin: "0 auto", padding: "72px 32px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 28 }}>
          {figures.map((f) => (
            <figure key={f.src} style={{ margin: 0 }}>
              {/* The gold keyline on deep green is the framing device the
                  Institutional Identification Manual uses for imagery. */}
              <div style={{ border: "1px solid var(--gold-600)", padding: 10, background: "var(--green-800)" }}>
                <Frame src={f.src} alt={f.alt} />
              </div>
              <figcaption style={{ marginTop: 12, fontSize: "var(--text-sm)", color: "rgba(255,255,255,0.72)" }}>
                {f.caption}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

function Frame({ src, alt }) {
  const [failed, setFailed] = React.useState(false);
  return (
    <div style={{ position: "relative", height: 260, overflow: "hidden" }}>
      {failed ? (
        <div style={{
          position: "absolute", inset: 0, display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center", gap: 10,
          background: "var(--green-900)", color: "rgba(255,255,255,0.5)",
          border: "1px dashed rgba(255,255,255,0.22)", textAlign: "center", padding: 20
        }}>
          <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" strokeWidth="1.4"
            strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <rect x="3" y="4" width="18" height="16" rx="1.5" />
            <circle cx="8.5" cy="9.5" r="1.8" /><path d="m3 17 5.5-5 4 3.5L17 11l4 4" />
          </svg>
          <span style={{ fontSize: "var(--text-sm)", lineHeight: "var(--leading-normal)" }}>{alt}</span>
          <code style={{
            fontFamily: "var(--font-mono)", fontSize: "var(--text-2xs)", color: "rgba(255,255,255,0.38)"
          }}>public/{src}</code>
        </div>
      ) : (
        <img src={src} alt={alt} loading="lazy" onError={() => setFailed(true)}
          style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
      )}
    </div>
  );
}
