import React from "react";
import { Button } from "../../components/ds/index.js";
import { CourseMarkLarge } from "../../components/Brand.jsx";
import { meta } from "../../data/course.js";

const dtStyle = {
  fontSize: "var(--text-2xs)", fontWeight: "var(--weight-semibold)",
  letterSpacing: "var(--tracking-wider)", textTransform: "uppercase", color: "var(--gold-300)"
};
const ddStyle = { margin: "6px 0 0", fontSize: "var(--text-base)", color: "rgba(255,255,255,0.9)" };

export function Hero() {
  return (
    <section id="top" style={{ background: "var(--green-900)", color: "var(--text-inverse)" }}>
      <div className="dls-section dls-hero-grid" style={{
        maxWidth: "var(--container-lg)", margin: "0 auto", padding: "88px 32px 72px",
        display: "grid", gridTemplateColumns: "minmax(0, 1.55fr) minmax(0, 1fr)",
        gap: 56, alignItems: "center"
      }}>
        <div style={{ minWidth: 0 }}>
          <div style={{
            fontSize: "var(--text-xs)", fontWeight: "var(--weight-semibold)",
            letterSpacing: "var(--tracking-wider)", textTransform: "uppercase", color: "var(--gold-300)"
          }}>{meta.college}</div>

          <h1 style={{
            fontFamily: "var(--font-display)", fontSize: "clamp(38px, 5.6vw, 60px)",
            fontWeight: "var(--weight-semibold)", lineHeight: "var(--leading-tight)",
            letterSpacing: "var(--tracking-tight)", margin: "20px 0 0"
          }}>{meta.title}</h1>

          <p style={{
            fontSize: "var(--text-md)", lineHeight: "var(--leading-relaxed)",
            color: "rgba(255,255,255,0.9)", maxWidth: "54ch", margin: "20px 0 0"
          }}>
            Where LBYEC2A established the fundamentals of programming, this course carries them to
            problems of engineering scale. Students implement arrays, pointers, file handling and
            user-defined structures directly in C, then apply the same reasoning in MATLAB to matrix
            computation, data pipelines, plotting and interactive interfaces, and conclude the
            trimester with a team program they have scoped, built and defended.
          </p>

          <dl style={{
            display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))",
            gap: "22px 32px", margin: "34px 0 0", paddingTop: 26,
            borderTop: "1px solid rgba(255,255,255,0.24)"
          }}>
            <div>
              <dt style={dtStyle}>Course code</dt>
              <dd style={{
                margin: "6px 0 0", fontFamily: "var(--font-display)", fontSize: "var(--text-lg)",
                fontWeight: "var(--weight-semibold)", letterSpacing: "0.02em"
              }}>{meta.code}</dd>
            </div>
            <div><dt style={dtStyle}>Prerequisite</dt><dd style={ddStyle}>{meta.prerequisite}</dd></div>
            <div><dt style={dtStyle}>Course coordinator</dt><dd style={ddStyle}>{meta.coordinator}</dd></div>
            <div><dt style={dtStyle}>Department</dt><dd style={ddStyle}>{meta.department}</dd></div>
          </dl>

          <div style={{ display: "flex", gap: 14, flexWrap: "wrap", marginTop: 34 }}>
            <Button as="a" href="#plan" variant="inverse" style={{ height: 44 }}>Review the learning plan</Button>
            <Button as="a" href="#assessment" variant="gold" style={{ height: 44 }}>Review the grading system</Button>
          </div>
        </div>

        <div className="dls-hero-mark" style={{ display: "flex", justifyContent: "center", minWidth: 0 }}>
          <CourseMarkLarge />
        </div>
      </div>
    </section>
  );
}
