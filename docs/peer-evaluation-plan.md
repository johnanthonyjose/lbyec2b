# Peer evaluation for AI-resistant assessment — design plan

Status: draft for discussion. Nothing here is committed to the syllabus yet.
Course: LBYEC2B, Computer Fundamentals and Programming 2 (1 unit, 13 weeks).
Author of the original concept: the course coordinator. This document assesses
that concept, names what breaks, and proposes hardened mechanics.

Working assumption: class size ~40, and the instructor is the sole grader.
Adjust the round count if the real figure differs materially.

---

## 1. Verdict in one paragraph

The instinct is correct and the structure is close to right: assess the things a
language model cannot supply on the student's behalf — the student's own
approach, their reaction to an unanticipated change, and their judgement about
what makes a problem hard. Two parts of the proposal, however, defeat the
purpose. The graded artefacts are all untimed unsupervised prose, which is the
single most AI-vulnerable artefact type in existence; and the detection bounty
converts a teaching instrument into an informant economy that will damage LO6,
which this course is required to attain. The recommendation is to keep the
three-part structure, move the pivotal step into a supervised window, anchor
everything to commit history the student cannot retro-fit, and delete the bounty
entirely. The scrutiny the bounty was meant to buy is obtained for free by the
peer-modification step itself.

---

## 2. What the original proposal gets right

1. **It assesses process, not product.** Product is now cheap; process is not.
2. **The peer modification is a viva in disguise.** An unanticipated variation on
   your own problem is the classic oral-defence probe, and it is the single best
   discriminator between a student who built something and one who received it.
3. **Authoring a modification is itself an assessed skill.** To modify a problem
   well you must know where its difficulty lives. That is LO2 (analyse a problem
   and identify its requirements) measured directly, and it is rarely assessed
   anywhere in an engineering programme. This is the most original idea in the
   proposal and should be kept prominently.
4. **It creates a second reader for every submission**, which is the scalability
   trick that makes deep assessment affordable at all.

---

## 3. Five things that will break

### 3.1 Untimed written prose is not AI-resistant. It is AI-optimal.

This is the central flaw. "A bullet list of how I approached the exercise",
"a written modification of the exercise", and "a written response to the
modification" are three tasks a chatbot performs better than most second-year
students, in under a minute, with no verifiable ground truth to contradict it.
The proposal moves assessment away from code — which at least has observable
behaviour that can be tested — and towards prose, which has none.

What is actually resistant to AI substitution has four properties:

- **Time-boxed** — the window is too short to prompt, read, judge, and adapt.
- **Observed** — someone can see the screen, or the artefact is produced in one
  unedited take.
- **Contingent on private history** — the answer depends on facts only the
  author possesses: their own bug, their own abandoned first attempt, the commit
  they made at 23:10 on Tuesday.
- **Interactive** — a follow-up question can be asked, and the second answer
  must be consistent with the first.

The proposal has none of the four. The fix is not to write a better prompt for
students; it is to change where and how the writing happens. See §5.

### 3.2 The +5% detection bounty is the most damaging element and should be cut

It fails on six independent grounds.

- **No admissible evidence exists.** Automated AI detectors are demonstrably
  unreliable, and stylistic suspicion is not evidence. "Proven correct by the
  instructor" is doing enormous unspecified work: there is no stated standard of
  proof, no procedure, and no appeal.
- **It pays students to accuse each other.** With a zero attached to the accused
  and a reward attached to the accuser, speculative accusation becomes rational.
  Any student uncertain about their own standing improves it by accusing.
- **It rewards accusing the strongest work.** Polished, fluent, unusually
  well-structured submissions attract suspicion. You would be systematically
  penalising the best students and the students who write well in English.
- **It is a conflict of interest for the team leader.** The leader both scores
  the individual and can profit by reporting them. Never give one person the
  reward and the judgement.
- **It is unbounded and unmapped.** +5% of what, capped at how many? A student
  who reports four peers gains +20% of a grade for an activity that maps to no
  learning outcome. It is not assessment; it is a policy instrument placed
  inside a grade.
- **It destroys the substrate the rest of the design runs on.** The mechanic
  requires students to show peers their reasoning. Under a bounty, they will
  show the minimum. LO6 — work in a team to develop a modular program — is a
  required outcome against Student Outcomes D and K, and this directly attacks
  it.

**Replacement.** Keep the scrutiny, drop the price. The evaluation form carries
an unpaid *concern note* field which requires specific, checkable evidence —
"the approach document claims a recursive descent parse, but the commit history
shows a single 40-line function added in one commit with no intermediate work",
not "this sounds like AI". Concerns go to the instructor, who resolves them with
a five-minute oral check. Outcome is either nothing, or the existing Student
Handbook cheating process — which already prescribes a failing grade for the
course and needs no supplement.

An optional middle path, offered but not recommended: award a small integrity
credit for the *quality of the evidence* in a substantiated note. It is still a
bounty, only smaller; the incentive distortions above are proportional, not
eliminated.

### 3.3 Handing 30% of a grade to a single unmoderated student rater

Second-year students are not calibrated raters. Peer marks cluster high,
correlate with friendship, and have poor inter-rater reliability — and here
there is exactly one rater per ratee, so there is no redundancy to detect a
lazy or hostile one. This course reports against Student Outcomes D, J and K;
evidence for an outcome must be instructor-validated to survive review.

There is also an unclosed structural gap: **the proposal never says who
evaluates the team leader.**

**Fix, two parts.** First, the peer *produces evidence and a recommendation*;
the instructor *awards the mark*, with sampling and moderation. Second, replace
the fixed leader with a **rotating triad** — see §5.1 — which closes the gap and
gives every student the experience of all three roles.

### 3.4 The arithmetic does not close

Published weights are Laboratory 25, Machine problems 25, Project 30, Practical
examination 15, Teacher's evaluation 5 = 100. A new 30% component requires
removing 30 points from elsewhere mid-syllabus.

**Clean resolution:** this is not a new component. It is a restructuring of how
*Machine problems* (25) is assessed, absorbing *Teacher's evaluation* (5). That
totals exactly the 30% requested, leaves Laboratory, Project and the Practical
examination untouched, and requires no renegotiation of the published mix.

### 3.5 Workload is roughly an order of magnitude too high

At ~40 students across every machine problem, the mechanic generates four
artefacts per student per exercise — approach, modification authored, response,
evaluation — or ~160 artefacts per exercise and well over a thousand across the
term, for a **one-unit** course.

**Fix:** run it on **three rounds only**, tied to the three substantive skill
blocks, with hard length caps and structured forms rather than free prose. See
§5.2.

---

## 4. Reframe: stop detecting, start designing out

The proposal's organising goal is *catch the student who used AI*. That goal is
unwinnable and expensive: detection is probabilistic, adjudication is unbounded,
and every false positive costs more trust than ten true positives recover.

The better goal is *make AI use irrelevant to the mark*. If the graded artefact
requires knowledge that only exists because the student did the work — the bug
they actually hit, the approach they actually abandoned, the commit they
actually pushed — then a student who outsourced the work simply scores badly.
No accusation, no adjudication, no informants. Detection systems fail open;
design-outs fail closed.

Read from the three customers of this course:

- **The student** does not want to be policed; they want proof their skill is
  real and legible to an employer. Sell the mechanic as *demonstrate your
  reasoning*, never as *we are catching cheaters*. The first framing produces
  cooperation; the second produces adversaries who are cleverer than the policy.
- **The instructor** needs defensible per-outcome evidence with bounded hours.
  Peer scrutiny that feeds instructor judgement delivers this; peer *grading*
  does not, and peer *policing* actively costs hours.
- **The accreditor and the employer** need instructor-validated evidence mapped
  to Student Outcomes D, J and K. Only moderated marks qualify.

A related item, outside this plan's scope but worth raising: the current course
AI policy is total prohibition, extending to reading AI summaries in search
results. That is unenforceable, and attaching a bounty to an unenforceable rule
is precisely where classroom trust fails. A policy of **disclosure plus
unfakeable assessment** is more honest and more effective. Recommend treating
this as a separate decision, taken before the mechanic ships.

---

## 5. Proposed mechanics

### 5.1 Grouping: rotating triads, not leader-and-peer

Students are assigned to **random triads per round**, drawn so that no two
members share a project team and no pairing repeats across rounds.

Within a triad {A, B, C}, each member plays all three roles in a single round:

| Member | Is assessed on | Writes a modification for | Evaluates |
|--------|----------------|---------------------------|-----------|
| A      | A's exercise   | B                         | C         |
| B      | B's exercise   | C                         | A         |
| C      | C's exercise   | A                         | B         |

This closes the "who evaluates the leader" gap, removes the standing power
asymmetry, prevents reciprocal grade-trading between two people, and gives every
student the LO2 experience of authoring a modification and the LO6 experience of
evaluating against criteria. Roles rotate again each round.

**Failure handling.** If a triad member does not submit a modification by the
deadline, the instructor issues one from a pre-written bank so the assessed
student is never penalised for a peer's default. Non-submission of an assigned
modification or evaluation scores zero on that sub-component for the defaulter.

### 5.2 Rounds: three, not every exercise

| Round | Week | Material | Primary outcomes |
|-------|------|----------|------------------|
| R1 | 4  | Pointers, file I/O, structures | LO1, LO2, LO3 |
| R2 | 7  | MATLAB data pipeline, CSV to figure | LO2, LO3, LO4 |
| R3 | 10 | GUI, data structures, variable scoping | LO1, LO3, LO5 |

Week 12's practical examination and week 13's defence remain the unaided
individual checks; this mechanic feeds them rather than duplicating them.

### 5.3 The five artefacts, and where the AI resistance actually comes from

**(a) Plan — submitted before coding, locked.** Max one page of bullets: the
decomposition, the data structures chosen, the parts expected to be difficult.
Timestamped; edits after the lock are visible. Low weight on its own.

**(b) Divergence log — submitted with the code.** Max half a page: *what changed
between the plan and the final program, and why*. Each claim must cite a commit.
This is the strongest anti-AI lever in the whole design and it is absent from the
original proposal. Either document alone is easy to fabricate. A *coherent,
specific divergence* between a locked plan and a real commit history — naming
the attempt that failed and the commit where it was abandoned — is very hard to
fabricate, and the course already has students on GitHub, so the ground truth is
free.

**(c) Modification authored for a peer.** Max 200 words, and it must satisfy a
taxonomy: it must alter a **constraint**, not a parameter. Permitted classes:
change an input-validity assumption; change a scale or memory bound; change the
data's shape or arrival order; add a failure mode that must be handled; remove
an assumption the original relied on. Explicitly disallowed: changing a literal,
renaming, or "also print X". The author must state, in one sentence, *which part
of the original design they expect to break* — that sentence is what is graded.

**(d) Response to the modification — SUPERVISED, 25 minutes, in the lab
session, no internet.** This is the pivot, and it is the one part that must not
be taken home. Required structure:

1. What breaks under the modification, and why.
2. The minimal change that fixes it.
3. The revised algorithm as pseudocode.
4. One thing that could still go wrong.

Twenty-five supervised minutes on your own code, with an offline machine or on
paper, is cheap to invigilate — it fits inside an existing lab session — and it
is the single highest-information artefact in the design.

*Fallback if a supervised window genuinely cannot be scheduled:* require a
three-minute unedited single-take screen-and-voice recording answering the same
four points, with the code visible and no other window open. Weaker, but far
stronger than take-home prose, because the student must own the reasoning aloud
at speaking speed.

**(e) Evaluation written by the triad peer.** A structured form against the
round's outcomes — not free prose, and not a single global score. Anchored
descriptors reusing the existing four-level scale (Exemplary / Satisfactory /
Developing / Beginning) so it is continuous with the rubrics already published.
Each rating requires one sentence of evidence quoting the artefact. Plus the
unpaid concern-note field from §3.2.

### 5.4 Weighting

Component: **Machine problems and exercise mastery — 30% of the final grade**
(absorbing the former 25% machine-problem component and the 5% teacher's
evaluation). Internal split, averaged across the three rounds:

| Sub-component | Share | Graded by | Outcomes |
|---|---|---|---|
| Working program, requirements met, coding standards | 35% | Instructor | LO1 |
| Plan + divergence log, commit-anchored | 15% | Instructor | LO2, LO3 |
| Supervised response to the peer modification | 30% | Instructor, informed by the peer evaluation | LO2, LO3 |
| Quality of the modification authored for a peer | 12% | Peer evaluation, instructor-moderated | LO2 |
| Quality of the evaluation you wrote as a rater | 8% | Instructor | LO6 |

Note what this preserves: 35% still rides on a program that compiles and meets
its requirements, so LO1 is not diluted. And note the last row — grading the
*quality of someone's evaluation* is what makes peers take the rating seriously,
and it is a genuine, defensible LO6 skill.

### 5.5 Moderation, so the peer input is defensible

- The instructor grades all supervised responses. These are short and structured;
  ~40 students × 4 points × 3 rounds is tractable.
- The instructor audits **20% of peer evaluations** at random, plus 100% of any
  evaluation that is an outlier against the instructor's own mark for the same
  student, plus 100% of evaluations carrying a concern note.
- A rater who is systematically generous or harsh is corrected by a per-rater
  offset, and their §5.4 row-five mark reflects it.
- Peer marks never stand alone: the instructor may override any of them, and the
  published rule must say so plainly.

### 5.6 Timeline for one round (one week)

| Day | Event |
|---|---|
| 0 | Exercise released in session. Triads published. |
| 1 | Plan due, locked. |
| 1–4 | Implementation, committing as the work proceeds. |
| 4 | Code + divergence log due. |
| 5 | Artefacts released to the assigned triad peer. |
| 6 | Modification due (max 200 words). |
| 7 | **Supervised 25-minute response**, in the lab session. |
| 8–9 | Evaluations written and submitted. |
| 10 | Instructor moderation, marks released. |

### 5.7 Pilot before committing

Run **R1 at week 4 as a low-stakes pilot** — full mechanics, but capped at 5% of
the final grade with the remainder held in the existing machine-problem
component. Review what actually happened: how long the supervised window really
took, whether the modifications were substantive, how far peer marks sat from
instructor marks, and how many concern notes arrived. Commit to the full 30%
only from R2 onwards, and publish that intent from day one so no student is
surprised.

---

## 6. Alternatives considered

- **B — Live oral defence with the instructor per exercise.** Most robust
  available method; ~40 students × 10 minutes × 3 rounds ≈ 20 hours of
  instructor time for a one-unit course. Rejected on cost. Retained in reduced
  form as the five-minute check that resolves a concern note.
- **C — Whole-class in-lab modification sprint, no peers.** Everyone receives an
  instructor-written modification of their own submission and answers it under
  supervision. Cheaper than the proposal, nearly as AI-resistant, but discards
  the LO2 modification-authoring skill and the LO6 evaluation skill. A good
  fallback if peer logistics prove unworkable.
- **D — Commit-history-anchored portfolio, no peers.** Cheap and quite resistant,
  but passive; it assesses traces rather than reasoning.

**Recommended: the proposal's structure (A), hardened with D's commit anchoring
and C's supervised window** — which is exactly what §5 describes.

---

## 7. Open decisions for the coordinator

1. **Class size and available lab time**, which set the round count and whether
   the 25-minute supervised window is schedulable.
2. **Is the bounty negotiable?** The rest of the design holds without it; it does
   not hold with it.
3. **Is the AI policy moving from prohibition to disclosure?** This should be
   settled before the mechanic is published, not after.
4. **Is GitHub commit history mandatory for machine problems?** §5.3(b) depends
   on it. If not, that lever is lost and the supervised window must carry more
   weight.
5. **Does changing the published weights mid-term require department approval?**
   §3.4 keeps the totals intact specifically to minimise this, but the
   sub-structure of the machine-problem component still changes.
6. **Language equity.** Written reasoning under time pressure penalises students
   who are less fluent in English. Recommend that the supervised response accept
   pseudocode and diagrams, and that grading ignore prose quality entirely.
