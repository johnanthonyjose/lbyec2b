import React from "react";
import { SiteHeader } from "../components/SiteHeader.jsx";
import { SiteFooter } from "../components/SiteFooter.jsx";
import { Button } from "../components/ds/index.js";
import { Resolution } from "../components/Resolution.jsx";
import { SelfCheck } from "../components/SelfCheck.jsx";
import { ZoomContext } from "../components/figures/index.js";
import {
  useWalkthrough, scrollToId,
  StageMap, Step, StepNav, StageComplete, StageDoneFooter
} from "../components/walkthrough/index.js";

import { OsContext, DEFAULT_OS } from "./assignment-workflow/os.jsx";
import { stages, stageByN, TOTAL_STAGES, TOTAL_MINUTES } from "./assignment-workflow/stages.jsx";
import { stepsInStage, sizeOfStage, stepAt } from "./assignment-workflow/steps.jsx";
import { resolutionById } from "./assignment-workflow/resolutions.jsx";
import { prereqsFor } from "./assignment-workflow/prereqs.jsx";
import { Prerequisites } from "./assignment-workflow/Prerequisites.jsx";
import { AppStrip } from "./assignment-workflow/AppStrip.jsx";
import { OsToggle } from "./assignment-workflow/OsToggle.jsx";
import { Lightbox } from "./assignment-workflow/Lightbox.jsx";
import { RepoMark } from "./assignment-workflow/OutcomeMarks.jsx";

/* The assignment-workflow handout.

   The staging, persistence and gating all live in components/walkthrough now,
   shared with the File I/O handout. What is left here is what is genuinely
   particular to this procedure: the platform fork, the prerequisite gate in
   front of stage 1, and the screenshot lightbox. */

const STORAGE_KEY = "lbyec2b-aw";

export default function AssignmentWorkflow() {
  const w = useWalkthrough({
    storageKey: STORAGE_KEY,
    stages, stepsInStage, sizeOfStage, stepAt,
    // Stage 1 opens once every prerequisite is ticked, or once the reader has
    // said they would rather get on with it.
    isGateOpen: (s) =>
      prereqsFor(s.os || DEFAULT_OS).every((p) => (s.prereq || {})[p.id]) || !!s.skipped,
    extraInitial: {
      os: DEFAULT_OS,  // "win" | "mac" — Windows until the reader says otherwise
      prereq: {},      // { account: true, ... }
      skipped: false   // opened the stages without ticking the prerequisites
    }
  });

  const { saved, save, answers, stage, step, size, current, started } = w;

  // The open resolution is deliberately not persisted, exactly as on the
  // GitHub-account handout: a reload should never restore a modal.
  const [fix, setFix] = React.useState(0);

  // Whether the settled prerequisite panel is expanded. Not persisted: reopening
  // the page should land on the step, not on questions already answered.
  const [openPrereq, setOpenPrereq] = React.useState(false);

  // The enlarged figure, if one is open. Not persisted, for the same reason the
  // resolution is not: a reload should never restore an overlay.
  const [zoomed, setZoomed] = React.useState(null);

  const os = saved.os || DEFAULT_OS;
  const ticked = saved.prereq || {};

  const tick = (id) => save({ ...saved, prereq: { ...ticked, [id]: !ticked[id] } });
  const setOs = (value) => save({ ...saved, os: value });

  // Clearing progress keeps the platform choice.
  const restart = () => {
    w.restart({ os: saved.os });
    setFix(0);
    scrollToId("before");
  };

  const begin = () => { w.goStage(1); setTimeout(() => scrollToId("walk"), 0); };
  const skipGate = () => {
    save({ ...saved, skipped: true, stage: 1, step: 1 });
    setTimeout(() => scrollToId("walk"), 0);
  };

  const continueToNext = () => {
    w.acknowledge({ stage: stage + 1, step: 1 });
    setTimeout(() => scrollToId("walk"), 0);
  };

  const returnFromFix = (to) => {
    setFix(0);
    save({ ...saved, stage: to.stage, step: to.step });
    setTimeout(() => scrollToId("walk"), 0);
  };

  const fixData = fix ? resolutionById[fix] : null;

  return (
    <OsContext.Provider value={os}>
     <ZoomContext.Provider value={setZoomed}>
      <div style={{
        background: "var(--surface-page)", color: "var(--text-primary)",
        fontFamily: "var(--font-sans)", minHeight: "100%"
      }}>
        <SiteHeader
          pages={[
            { href: "index.html", label: "Home" },
            { href: "course-overview.html", label: "Course overview" },
            { href: "github-account.html", label: "GitHub account" },
            { href: "assignment-workflow.html", label: "Assignment workflow", current: true },
            { href: "file-io.html", label: "File I/O" }
          ]}
          progress={w.pct}
          progressLabel={w.progressLabel}
        />

        <main>
          <Hero started={started} stage={stage}
            onBegin={() => scrollToId(started ? "walk" : "before")} />

          <Prerequisites
            os={os}
            onOs={setOs}
            ticked={ticked}
            onTick={tick}
            ready={w.gateOpen}
            skipped={!!saved.skipped}
            onSkip={skipGate}
            onBegin={started ? () => { setOpenPrereq(false); scrollToId("walk"); } : begin}
            collapsed={started && !openPrereq}
            onExpand={() => setOpenPrereq(true)}
            onCollapse={started ? () => setOpenPrereq(false) : undefined}
          />

          {started && (
            <>
              <StageMap
                stages={stages}
                stepsInStage={stepsInStage}
                stage={stage}
                step={step}
                answers={answers}
                isComplete={w.isComplete}
                isOpen={w.isOpen}
                onGoStage={w.goStage}
                onGoStep={w.goStep}
                eyebrow="The five stages"
                intro="One step is shown at a time. Each stage opens when the one before it is finished. Your place is kept on this device only — nothing here is submitted or graded."
              />

              <section id="walk" className="dls-section aw-walk">
                <StageBanner stage={stageByN[stage]} os={os} onOs={setOs} />

                <Step
                  key={current.id}
                  step={current}
                  total={size}
                  onOpenFix={(id) => setFix(id)}
                  context={<AppStrip app={current.app} />}
                  check={
                    <SelfCheck
                      label="Checkpoint"
                      question={current.check.question}
                      ok={current.check.ok}
                      alt={current.check.alt}
                      value={answers[current.id]}
                      onAnswer={(v) => w.answer(current.id, v)}
                    />
                  }
                />

                <StepNav step={step} total={size} onGoStep={w.goStep} />

                {w.isComplete(stage) && !w.showComplete && (
                  <StageDoneFooter
                    stage={stageByN[stage]}
                    next={stageByN[stage + 1]}
                    onContinue={() => { w.goStage(stage + 1); setTimeout(() => scrollToId("walk"), 0); }}
                    allDone={w.allDone}
                    onRestart={restart}
                  />
                )}
              </section>
            </>
          )}
        </main>

        <SiteFooter note="Department of Electronics and Computer Engineering" />

        {fixData && (
          <Resolution
            fix={fixData}
            onClose={() => setFix(0)}
            onReturn={() => returnFromFix(fixData.returnTo)}
            returnLabel={`Back to Stage ${fixData.returnTo.stage}, step ${fixData.returnTo.step}`}
          />
        )}

        {w.showComplete && (
          <StageComplete
            stage={stageByN[stage]}
            stages={stages}
            next={stageByN[stage + 1]}
            onContinue={continueToNext}
            onLater={() => w.acknowledge()}
            onRestart={restart}
            finale={{
              eyebrow: "All five stages complete",
              title: "Your assignment is submitted",
              have: "Your code is on GitHub, it passed the check, and the link is recorded in Canvas. That is the whole workflow — every assignment this term follows the same five stages."
            }}
          />
        )}
        {zoomed && <Lightbox figure={zoomed} onClose={() => setZoomed(null)} />}
      </div>
     </ZoomContext.Provider>
    </OsContext.Provider>
  );
}

/* Five stages and a number of minutes. No step count: the figure that would
   make a reader close the tab is the one this page never prints. */
function Hero({ started, stage, onBegin }) {
  return (
    <section className="aw-hero">
      <div className="dls-section gh-two aw-hero-inner">
        <div style={{ minWidth: 0 }}>
          <div className="aw-hero-eyebrow">Laboratory Preliminary · Handout 02</div>
          <h1 className="aw-hero-title">Submitting an assignment</h1>
          <p className="aw-hero-lede">
            Every assignment this term is collected the same way: GitHub Classroom
            issues you a repository, you write the answer on your own machine, and
            the link goes back to Canvas. This handout walks the whole route once,
            in five short stages.
          </p>
          <dl className="aw-hero-meta">
            <div>
              <dt>Stages</dt>
              <dd>Five, each ending in something you can check</dd>
            </div>
            <div>
              <dt>Time</dt>
              <dd>About {TOTAL_MINUTES} minutes, start to finish</dd>
            </div>
          </dl>
          <div style={{ marginTop: 28 }}>
            <Button variant="gold" size="lg" onClick={onBegin}>
              {started ? `Resume at Stage ${stage}` : "Start"}
            </Button>
          </div>
        </div>

        <div className="dls-hero-mark" style={{ display: "flex", justifyContent: "center", minWidth: 0 }}>
          <RepoMark size={220} />
        </div>
      </div>
    </section>
  );
}

/* The stage you are in, restated above the step, with the platform toggle
   beside it so changing it never means hunting back up the page. */
function StageBanner({ stage, os, onOs }) {
  return (
    <div className="aw-stagebanner">
      <div style={{ minWidth: 0 }}>
        <div className="aw-eyebrow">Stage {stage.n} of {TOTAL_STAGES} · about {stage.minutes} minutes</div>
        <h2 className="aw-stagebanner-title">{stage.title}</h2>
        <p className="aw-stagebanner-goal">{stage.goal}</p>
      </div>
      <OsToggle os={os} onChange={onOs} />
    </div>
  );
}
