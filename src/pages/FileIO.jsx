import React from "react";
import { SiteHeader } from "../components/SiteHeader.jsx";
import { SiteFooter } from "../components/SiteFooter.jsx";
import { Button } from "../components/ds/index.js";
import { Resolution } from "../components/Resolution.jsx";
import { SelfCheck } from "../components/SelfCheck.jsx";
import { PredictCheck } from "../components/PredictCheck.jsx";
import {
  useWalkthrough, scrollToId,
  StageMap, Step, StepNav, StageComplete, StageDoneFooter
} from "../components/walkthrough/index.js";

import { stages, stageByN, TOTAL_STAGES, TOTAL_MINUTES } from "./file-io/stages.jsx";
import { stepsInStage, sizeOfStage, stepAt } from "./file-io/steps.jsx";
import { resolutionById } from "./file-io/resolutions.jsx";
import { Before, needs } from "./file-io/Before.jsx";
import { Outcomes } from "./file-io/Outcomes.jsx";
import { Reference } from "./file-io/Reference.jsx";
import { Exercises } from "./file-io/Exercises.jsx";
import { Further } from "./file-io/Further.jsx";
import { ReadMark } from "./file-io/OutcomeMarks.jsx";

/* Handout 03 — File I/O.

   It replaces a three-year-old reference document that was organised by
   language feature and offered the reader nothing to do. The two structural
   decisions that matter are made elsewhere and are only assembled here: the
   handout is ordered by what the reader ends up holding (stages.jsx), and the
   one genuinely interactive element is a visualiser for state the reader cannot
   otherwise see (FileMachine.jsx), rather than decoration competing with the
   prose for attention.

   The staging, gating and persistence are shared with the assignment-workflow
   handout and live in components/walkthrough. What is particular to this page
   is the checkpoint fork below: a step either verifies something on the
   reader's screen, which is a SelfCheck, or asks them to predict what the code
   will do before it is revealed, which is a PredictCheck. The second is the one
   that makes the prose necessary, so roughly half the steps use it. */

const STORAGE_KEY = "lbyec2b-fio";

export default function FileIO() {
  const w = useWalkthrough({
    storageKey: STORAGE_KEY,
    stages, stepsInStage, sizeOfStage, stepAt,
    isGateOpen: (s) => needs.every((n) => (s.ready || {})[n.id]) || !!s.skipped,
    // A handout is also a reference. See the note on `unlocked` in the hook.
    unlocked: true,
    extraInitial: {
      ready: {},      // { compiler: true, files: true, cwd: true }
      skipped: false  // opened the stages without confirming the three
    }
  });

  const { saved, save, answers, stage, step, size, current, started } = w;

  // Neither the open resolution nor the expanded gate is persisted: a reload
  // should never restore a modal, and reopening the page should land on the
  // step rather than on questions already answered.
  const [fix, setFix] = React.useState(0);

  const ticked = saved.ready || {};
  const tick = (id) => save({ ...saved, ready: { ...ticked, [id]: !ticked[id] } });

  const restart = () => { w.restart(); setFix(0); scrollToId("before"); };

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
    <div style={{
      background: "var(--surface-page)", color: "var(--text-primary)",
      fontFamily: "var(--font-sans)", minHeight: "100%"
    }}>
      <SiteHeader
        pages={[
          { href: "index.html", label: "Home" },
          { href: "course-overview.html", label: "Course overview" },
          { href: "github-account.html", label: "GitHub account" },
          { href: "assignment-workflow.html", label: "Assignment workflow" },
          { href: "file-io.html", label: "File I/O", current: true }
        ]}
        progress={w.pct}
        progressLabel={w.progressLabel}
      />

      <main>
        <Hero started={started} stage={stage}
          onBegin={() => scrollToId(started ? "walk" : "before")} />

        <Outcomes />

        <Before
          ticked={ticked}
          onTick={tick}
          ready={w.gateOpen}
          skipped={!!saved.skipped}
          onSkip={skipGate}
          onBegin={started ? () => scrollToId("walk") : begin}
          started={started}
        />

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
          intro="One step is shown at a time, and each stage leaves a file on your disk that the next one reads. Work through them in order the first time. After that, open any stage you want — nothing is locked. Your place is kept on this device only, and nothing here is submitted or graded."
        />

        {started && current && (
          <>
            <section id="walk" className="dls-section aw-walk">
              <StageBanner stage={stageByN[stage]} />

              <Step
                key={current.id}
                step={current}
                total={size}
                onOpenFix={() => setFix(current.fix)}
                media={current.media}
                check={<Checkpoint step={current} value={answers[current.id]}
                  onAnswer={(v) => w.answer(current.id, v)} />}
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
        <Reference />
        <Exercises />
        <Further />
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
            title: "Your program reads a data file",
            have: "You have written a file, read it back byte by byte, and turned a comma-delimited data file into a formatted table. That last program is the same shape as the pipeline you build in MATLAB in Week 7 and defend as a team in Week 13 — you have now written it once, by hand, in C."
          }}
        />
      )}
    </div>
  );
}

/* A step either verifies what is on the reader's screen or asks them to commit
   to a prediction first. Which one is a property of the step, not of the page,
   so the fork is here and the step data simply says `kind`. */
function Checkpoint({ step, value, onAnswer }) {
  const c = step.check;

  if (c.kind === "predict") {
    return (
      <PredictCheck
        label="Before you run it"
        question={c.question}
        options={c.options}
        value={value}
        onAnswer={onAnswer}
      />
    );
  }

  return (
    <SelfCheck
      label="Checkpoint"
      question={c.question}
      ok={c.ok}
      alt={c.alt}
      value={value}
      onAnswer={onAnswer}
    />
  );
}

/* Five stages and a number of minutes. No step count, for the same reason the
   assignment workflow prints none: the figure that would make a reader close
   the tab is the one this page never shows them. */
function Hero({ started, stage, onBegin }) {
  return (
    <section className="aw-hero">
      <div className="dls-section gh-two aw-hero-inner">
        <div style={{ minWidth: 0 }}>
          <div className="aw-hero-eyebrow">Week 3 · Handout 03</div>
          <h1 className="aw-hero-title">Making a program remember</h1>
          <p className="aw-hero-lede">
            Every program you have written so far has forgotten everything the
            moment it ended. This handout is how that stops. You will write a
            file, read it back one byte at a time, and finish with a program that
            turns a data file into a formatted table — the same pipeline you
            build in MATLAB in Week 7, and the one your team project rests on.
          </p>
          <dl className="aw-hero-meta">
            <div>
              <dt>Stages</dt>
              <dd>Five, each leaving a file the next one reads</dd>
            </div>
            <div>
              <dt>Time</dt>
              <dd>About {TOTAL_MINUTES} minutes, at a machine</dd>
            </div>
          </dl>
          <div style={{ marginTop: "var(--space-8)" }}>
            <Button variant="gold" size="lg" onClick={onBegin}>
              {started ? `Resume at Stage ${stage}` : "Start"}
            </Button>
          </div>
        </div>

        <div className="dls-hero-mark" style={{ display: "flex", justifyContent: "center", minWidth: 0 }}>
          <ReadMark size={220} />
        </div>
      </div>
    </section>
  );
}

function StageBanner({ stage }) {
  return (
    <div className="aw-stagebanner">
      <div style={{ minWidth: 0 }}>
        <div className="aw-eyebrow">
          Stage {stage.n} of {TOTAL_STAGES} · about {stage.minutes} minutes
        </div>
        <h2 className="aw-stagebanner-title">{stage.title}</h2>
        <p className="aw-stagebanner-goal">{stage.goal}</p>
      </div>
    </div>
  );
}
