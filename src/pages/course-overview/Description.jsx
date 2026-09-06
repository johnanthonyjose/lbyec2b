import React from "react";
import { Section } from "../../components/Section.jsx";

const para = {
  margin: 0, fontSize: "var(--text-base)",
  lineHeight: "var(--leading-relaxed)", color: "var(--text-secondary)"
};

export function Description() {
  return (
    <Section id="course">
      <div style={{
        fontSize: "var(--text-xs)", fontWeight: "var(--weight-semibold)",
        letterSpacing: "var(--tracking-wider)", textTransform: "uppercase", color: "var(--text-gold)"
      }}>Course description</div>
      <h2 style={{
        fontFamily: "var(--font-display)", fontSize: "var(--text-2xl)",
        fontWeight: "var(--weight-semibold)", lineHeight: "var(--leading-snug)",
        margin: "12px 0 0", maxWidth: "30ch"
      }}>What this course covers</h2>

      <div className="dls-split" style={{
        display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
        gap: 48, marginTop: 36
      }}>
        <p style={para}>
          The course continues the introduction of computational thinking as an approach to problem
          solving. Built-in data structures and algorithms are presented as instruments for
          engineering problems of larger scale, with sustained attention to the benefits and the
          constraints of applying programming to an engineering task. Arrays, strings, pointers,
          memory addressing, file input and output, and user-defined structures are implemented
          directly in C.
        </p>
        <p style={{ ...para, paddingLeft: 48, borderLeft: "1px solid var(--border-subtle)" }}>
          The second part of the course treats the more advanced programming tools of contemporary
          engineering practice through MATLAB. It covers array and matrix processing, the extraction,
          transformation and loading of tabular data, the plotting of results, and a framework for
          developing interactive and graphical interfaces in App Designer. The term concludes with a
          project that each team scopes, proposes, implements and defends.
        </p>
      </div>
    </Section>
  );
}
