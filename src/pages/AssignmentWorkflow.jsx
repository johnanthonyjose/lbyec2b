import React from "react";
import { SiteHeader } from "../components/SiteHeader.jsx";
import { SiteFooter } from "../components/SiteFooter.jsx";
import { Button } from "../components/ds/index.js";
import { Resolution } from "../components/Resolution.jsx";
import { ZoomContext } from "../components/figures/index.js";
import { usePersistentState } from "../hooks/index.js";

import { OsContext, DEFAULT_OS } from "./assignment-workflow/os.jsx";
import { stages, stageByN, TOTAL_STAGES, TOTAL_MINUTES } from "./assignment-workflow/stages.jsx";
import { stepsInStage, sizeOfStage, stepAt } from "./assignment-workflow/steps.jsx";
import { resolutionById } from "./assignment-workflow/resolutions.jsx";
import { prereqsFor } from "./assignment-workflow/prereqs.jsx";
import { Prerequisites } from "./assignment-workflow/Prerequisites.jsx";
import { StageMap } from "./assignment-workflow/StageMap.jsx";
import { Step } from "./assignment-workflow/Step.jsx";
import { StageComplete } from "./assignment-workflow/StageComplete.jsx";
import { OsToggle } from "./assignment-workflow/OsToggle.jsx";
import { Lightbox } from "./assignment-workflow/Lightbox.jsx";
import { RepoMark } from "./assignment-workflow/OutcomeMarks.jsx";

const STORAGE_KEY = "lbyec2b-aw";

const INITIAL = {
  v: 1,
  os: DEFAULT_OS,    // "win" | "mac" — Windows until the reader says otherwise
  prereq: {},        // { account: true, ... }
  skipped: false,    // opened the stages without ticking the prerequisites
  answers: {},       // { "S3.4": "ok" | "alt" }
  stage: 0,          // 0 = still on the prerequisites
  step: 1,
  acknowledged: []   // stages whose completion panel has been dismissed
};

export default function AssignmentWorkflow() {
  const [saved, save] = usePersistentState(STORAGE_KEY, INITIAL);

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
  const answers = saved.answers || {};
  const ticked = saved.prereq || {};

  /* ---- derived state, all pure functions of what is stored ---- */

  const doneIn = (n) => stepsInStage(n).filter((s) => answers[s.id] === "ok").length;
  const isComplete = (n) => doneIn(n) === sizeOfStage(n);
  const gateOk = prereqsFor(os).every((p) => ticked[p.id]) || !!saved.skipped;
  const isOpen = (n) => (n === 1 ? gateOk : isComplete(n - 1));

  const stage = saved.stage || 0;
  const started = stage >= 1;
  const size = started ? sizeOfStage(stage) : 0;
  const step = started ? Math.min(size, Math.max(1, saved.step || 1)) : 1;
  const current = started ? stepAt(stage, step) : null;

  // The panel appears when the stage in hand is finished and has not been
  // dismissed. Written on dismissal rather than on mount, so reloading while it
  // is open shows it again — which is right, that reader never saw the end of it.
  const showComplete =
    started && isComplete(stage) && !(saved.acknowledged || []).includes(stage);

  const allDone = stages.every((s) => isComplete(s.n));
  const pct = started
    ? Math.round(((stage - 1 + doneIn(stage) / size) / TOTAL_STAGES) * 100)
    : 0;

  /* ---- transitions ---- */

  const goStage = (n) => save({ ...saved, stage: n, step: 1 });
  const goStep = (n) => save({ ...saved, step: Math.min(size, Math.max(1, n)) });
  const answer = (id, value) => save({ ...saved, answers: { ...answers, [id]: value } });
  const tick = (id) => save({ ...saved, prereq: { ...ticked, [id]: !ticked[id] } });
  const setOs = (value) => save({ ...saved, os: value });

  const acknowledge = (extra = {}) =>
    save({
      ...saved,
      acknowledged: Array.from(new Set([...(saved.acknowledged || []), stage])),
      ...extra
    });

  // Clearing progress keeps the platform choice. That is a preference, not
  // progress, and making someone set it again would be a small rudeness.
  const restart = () => {
    save({ ...INITIAL, os: saved.os });
    setFix(0);
    scrollTo("before");
  };

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) window.scrollTo({ top: el.offsetTop - 72, behavior: "smooth" });
  };

  const begin = () => { goStage(1); setTimeout(() => scrollTo("walk"), 0); };
  const skipGate = () => { save({ ...saved, skipped: true, stage: 1, step: 1 }); setTimeout(() => scrollTo("walk"), 0); };

  const continueToNext = () => {
    acknowledge({ stage: stage + 1, step: 1 });
    setTimeout(() => scrollTo("walk"), 0);
  };

  const returnFromFix = (to) => {
    setFix(0);
    save({ ...saved, stage: to.stage, step: to.step });
    setTimeout(() => scrollTo("walk"), 0);
  };

  const fixData = fix ? resolutionById[fix] : null;

  const progressLabel = started
    ? `Stage ${stage} of ${TOTAL_STAGES} — ${doneIn(stage)} of ${size} in this stage`
    : "Not started";

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
            { href: "assignment-workflow.html", label: "Assignment workflow", current: true }
          ]}
          progress={pct}
          progressLabel={progressLabel}
        />

        <main>
          <Hero started={started} stage={stage} onBegin={() => scrollTo(started ? "walk" : "before")} />

          <Prerequisites
            os={os}
            onOs={setOs}
            ticked={ticked}
            onTick={tick}
            ready={gateOk}
            skipped={!!saved.skipped}
            onSkip={skipGate}
            onBegin={started ? () => { setOpenPrereq(false); scrollTo("walk"); } : begin}
            collapsed={started && !openPrereq}
            onExpand={() => setOpenPrereq(true)}
            onCollapse={started ? () => setOpenPrereq(false) : undefined}
          />

          {started && (
            <>
              <StageMap
                stage={stage}
                step={step}
                answers={answers}
                isComplete={isComplete}
                isOpen={isOpen}
                onGoStage={goStage}
                onGoStep={goStep}
              />

              <section id="walk" className="dls-section aw-walk">
                <StageBanner stage={stageByN[stage]} os={os} onOs={setOs} />

                <Step
                  key={current.id}
                  step={current}
                  answer={answers[current.id]}
                  onAnswer={(v) => answer(current.id, v)}
                  onOpenFix={() => setFix(current.fix)}
                />

                <nav className="aw-nav" aria-label="Move between steps">
                  <button type="button" className="aw-nav-btn" onClick={() => goStep(step - 1)}
                    disabled={step === 1}>
                    Previous step
                  </button>
                  <span className="aw-nav-count">Step {step} of {size}</span>
                  <button type="button" className="aw-nav-btn is-primary"
                    onClick={() => goStep(step + 1)} disabled={step === size}>
                    Next step
                  </button>
                </nav>

                {/* A stage finished but already acknowledged still needs a way
                    forward — the panel only appears once. */}
                {isComplete(stage) && !showComplete && (
                  <StageDoneFooter
                    stage={stageByN[stage]}
                    next={stageByN[stage + 1]}
                    onContinue={() => { goStage(stage + 1); setTimeout(() => scrollTo("walk"), 0); }}
                    allDone={allDone}
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

        {showComplete && (
          <StageComplete
            stage={stageByN[stage]}
            next={stageByN[stage + 1]}
            onContinue={continueToNext}
            onLater={() => acknowledge()}
            onRestart={restart}
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

function StageDoneFooter({ stage, next, onContinue, allDone, onRestart }) {
  return (
    <div className="aw-stagedone">
      <div style={{ minWidth: 0, flex: 1 }}>
        <div className="aw-eyebrow" style={{ color: "var(--green-800)" }}>
          Stage {stage.n} complete · {stage.outcome.name}
        </div>
        <p className="aw-stagedone-have">{stage.outcome.have}</p>
      </div>
      {next ? (
        <Button variant="primary" onClick={onContinue} style={{ height: 44 }}>
          Begin Stage {next.n}
        </Button>
      ) : allDone ? (
        <button type="button" className="aw-nav-btn" onClick={onRestart}>
          Clear my progress
        </button>
      ) : null}
    </div>
  );
}
