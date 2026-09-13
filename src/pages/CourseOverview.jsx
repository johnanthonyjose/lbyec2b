import React from "react";
import { SiteHeader } from "../components/SiteHeader.jsx";
import { SiteFooter } from "../components/SiteFooter.jsx";
import { BackToTop } from "../components/BackToTop.jsx";
import { useScrollProgress, useScrollSpy } from "../hooks/index.js";
import { navSections } from "../data/course.js";

import { Hero } from "./course-overview/Hero.jsx";
import { StatBand } from "./course-overview/StatBand.jsx";
import { Description } from "./course-overview/Description.jsx";
import { Structure } from "./course-overview/Structure.jsx";
import { Gallery } from "./course-overview/Gallery.jsx";
import { Outcomes } from "./course-overview/Outcomes.jsx";
import { LearningPlan } from "./course-overview/LearningPlan.jsx";
import { Assessment } from "./course-overview/Assessment.jsx";
import { Calculator } from "./course-overview/Calculator.jsx";
import { Rubrics } from "./course-overview/Rubrics.jsx";
import { Policies } from "./course-overview/Policies.jsx";
import { References } from "./course-overview/References.jsx";

const sectionIds = navSections.map((s) => s.id);

export default function CourseOverview() {
  const progressRef = React.useRef(null);
  const topRef = React.useRef(null);

  useScrollProgress(progressRef, topRef);
  const active = useScrollSpy(sectionIds);

  return (
    <div style={{
      background: "var(--surface-page)", color: "var(--text-primary)",
      fontFamily: "var(--font-sans)", minHeight: "100%"
    }}>
      <SiteHeader
        pages={[
          { href: "index.html", label: "Home" },
          { href: "github-account.html", label: "GitHub account" },
          { href: "assignment-workflow.html", label: "Assignment workflow" }
        ]}
        sections={navSections} active={active} progressRef={progressRef} />

      <main>
        <Hero />
        <StatBand />
        <Description />
        <Structure />
        <Gallery />
        <Outcomes />
        <LearningPlan />
        <Assessment />
        <Calculator />
        <Rubrics />
        <Policies />
        <References />
      </main>

      <SiteFooter note="Drawn from the revised LBYEC2B syllabus, which governs where the two differ." />
      <BackToTop ref={topRef} />
    </div>
  );
}
