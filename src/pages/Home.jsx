import React from "react";
import { SiteHeader } from "../components/SiteHeader.jsx";
import { SiteFooter } from "../components/SiteFooter.jsx";
import { CourseMarkLarge } from "../components/Brand.jsx";
import { Button, Card } from "../components/ds/index.js";
import { meta } from "../data/course.js";

/* The hub. One card per page of the site; add a page by adding an entry here
   and a matching .html to vite.config.js. Pages not yet built are marked so
   the index stays an honest map of what exists. */
const pages = [
  {
    href: "course-overview.html",
    eyebrow: "Course",
    title: "Course overview",
    body: "The syllabus in full: description, structure of the term, learning outcomes, the thirteen-week plan, assessment weights, rubrics, class policies and references.",
    ready: true
  },
  {
    href: "github-account.html",
    eyebrow: "Laboratory preliminary",
    title: "Registering a GitHub account",
    body: "Handout 01. A seven-step walkthrough for registering the account, confirming the DLSU mail address and joining the course organisation, with a resolution for each anticipated difficulty.",
    ready: true
  },
  {
    href: null,
    eyebrow: "Schedule",
    title: "Weekly schedule",
    body: "Session dates, deliverable deadlines and consultation hours for the current trimester.",
    ready: false
  },
  {
    href: null,
    eyebrow: "Resources",
    title: "Activity materials",
    body: "Laboratory handouts, starter code and the machine problem specifications, as they are released.",
    ready: false
  }
];

export default function Home() {
  return (
    <div style={{
      background: "var(--surface-page)", color: "var(--text-primary)",
      fontFamily: "var(--font-sans)", minHeight: "100%"
    }}>
      <SiteHeader pages={[
          { href: "course-overview.html", label: "Course overview" },
          { href: "github-account.html", label: "GitHub account" }
        ]} />

      <main>
        <section style={{ background: "var(--green-900)", color: "var(--text-inverse)" }}>
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
              }}>{meta.code}</h1>
              <p style={{
                fontSize: "var(--text-md)", lineHeight: "var(--leading-relaxed)",
                color: "rgba(255,255,255,0.9)", maxWidth: "54ch", margin: "16px 0 0"
              }}>
                {meta.title}. A laboratory course carrying the fundamentals of programming to
                problems of engineering scale, in C and then in MATLAB, and concluding in a team
                project that is scoped, built and defended.
              </p>
              <div style={{ display: "flex", gap: 14, flexWrap: "wrap", marginTop: 32 }}>
                <Button as="a" href="course-overview.html" variant="inverse" style={{ height: 44 }}>
                  Read the course overview
                </Button>
              </div>
            </div>
            <div className="dls-hero-mark" style={{ display: "flex", justifyContent: "center", minWidth: 0 }}>
              <CourseMarkLarge />
            </div>
          </div>
        </section>

        <section className="dls-section" style={{
          maxWidth: "var(--container-lg)", margin: "0 auto", padding: "72px 32px"
        }}>
          <div style={{
            fontSize: "var(--text-xs)", fontWeight: "var(--weight-semibold)",
            letterSpacing: "var(--tracking-wider)", textTransform: "uppercase", color: "var(--text-gold)"
          }}>Contents</div>
          <h2 style={{
            fontFamily: "var(--font-display)", fontSize: "var(--text-2xl)",
            fontWeight: "var(--weight-semibold)", margin: "12px 0 32px"
          }}>Pages of this site</h2>

          <div style={{
            display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20
          }}>
            {pages.map((p) => (
              <Card key={p.title} eyebrow={p.eyebrow} title={p.title} href={p.href || undefined}
                goldRule={p.ready}
                meta={p.ready ? "Read the page" : "Not yet published"}
                style={p.ready ? undefined : { opacity: 0.62 }}>
                {p.body}
              </Card>
            ))}
          </div>
        </section>
      </main>

      <SiteFooter note="De La Salle University, Gokongwei College of Engineering." />
    </div>
  );
}
