# Assessment as audit — an AI-resistant design for LBYEC2B

Status: draft v3, for discussion. Nothing here is committed to the syllabus yet.
Course: LBYEC2B, Computer Fundamentals and Programming 2 (1 unit, 13 weeks).

**Organising goal.** Assess whether a student's capability against the learning
outcomes is *demonstrable*, under conditions where an AI assistant cannot supply
the demonstration. The mechanic is an **audit**: many data points of differing
reliability are gathered around each student, and the **instructor** — not a
peer, not a detector, not the code alone — forms a judgement from the whole
file.

Working assumption: class size ~40, instructor is the sole grader. Round count
scales with the real figure.

> v1 argued a peer-evaluation mechanic into shape. v2 rebuilt it on the audit
> frame. **v3 times every student-authored artefact in the room**, which is the
> change that makes the original three-part concept work as designed: the plan
> and the divergence log rise from rank 5 to rank 2, and 75% of the component
> now rests on observed work. The implementation itself stays untimed and taken
> home, for the reason in §5.5. The v1 critique is condensed into Appendix A.

---

## 1. Why "audit" is the right word, and what it commits us to

An audit is the established professional answer to exactly our problem: *someone
asserts something about their own work, the assertion is cheap to make and
expensive to verify, and a judgement must be reached that will survive review by
a third party.* Auditing has spent a century working out how to do that, and
essentially all of it transfers.

Adopting the word commits us to six things. Each one is load-bearing.

**1. Assertions and evidence are different objects.** The student asserts "I can
build a file-backed record store." The approach document is not evidence of
that; it is a restatement of the assertion. Auditors call this a *management
representation* and treat it as the weakest evidence that exists — precisely
because it is free to produce. This is why the original proposal's core
artefacts were fragile: all three were representations. §2 fixes this.

**2. Evidence is ranked, not counted.** Three weak data points do not sum to one
strong one. §2 sets out the hierarchy we will use.

**3. Controls and substance are tested differently.** A *control* is a property
of the process — did you plan before coding, did you commit incrementally, did
you engage with your peer's modification. A *substantive test* asks whether the
capability actually exists. Controls are cheap and tested on everyone;
substantive tests are expensive and targeted. Where controls are strong,
substantive testing can be lighter. Where controls fail, testing escalates.
This is what makes the design affordable. §4 and §5.

**4. Sampling and materiality are explicit.** We will not examine everything.
We state in advance what we sample, and what magnitude of doubt is *material* —
large enough to change the mark. Undocumented sampling is how assessment
schemes quietly become arbitrary. §5.3.

**5. Professional scepticism is not fraud investigation.** An auditor holds a
questioning mind and does not presume dishonesty. The two are compatible and the
distinction is the whole reason the design is survivable culturally. It also
supplies the cleanest argument against the bounty: **contingent-fee auditing is
prohibited everywhere it has been tried, because paying the examiner for
findings destroys their independence.** You cannot both reward someone for
finding a problem and rely on their judgement that the problem exists.

**6. The working papers are the deliverable.** An audit that reaches the right
conclusion but cannot show why is worthless. Each student's file must let a
second reader — a colleague, a department chair, an accreditor — reach the same
conclusion from the same evidence. This is what turns the scheme into defensible
Student Outcome D/J/K evidence rather than instructor intuition. §6.

---

## 2. The evidence hierarchy, and what each data point is actually worth

Auditors rank evidence by how far it is from the interested party's control.
Applied here, strongest first:

| Rank | Class of evidence | Why it ranks there |
|---|---|---|
| 1 | **Obtained directly by the instructor, under observation, interactively** | The student cannot outsource it, and a follow-up question can test consistency |
| 2 | **Obtained under observation, non-interactive** | Cannot be outsourced, but cannot be probed |
| 3 | **System-generated as a by-product of doing the work** | Not authored for the assessor; costly to fabricate coherently |
| 4 | **Third-party observation (a peer)** | Independent of the student, but the observer is untrained |
| 5 | **Self-representation, cross-checkable** | Free to produce, but contradicts detectably |
| 6 | **Self-representation, uncheckable** | No evidential weight at all |

Now every data point in the design, placed:

| # | Data point | Rank | Tests | Notes |
|---|---|---|---|---|
| 1 | Locked plan, **written in-session, 15 min** | 2 | LO2, LO3 | Also fixes the **expectation** that §4.1 tests against. Timing it is what lifts it from rank 5. |
| 2 | Commit history: cadence, granularity, churn distribution | 3 | control | A control test, never a substantive one. See the Goodhart warning in §7. |
| 3 | Divergence log, **written in-session, 10 min**, each claim citing a commit | 2, corroborated by 1 and 2 | LO2, LO3 | Written from your own commit log in the room. Very hard to fabricate under time. |
| 4 | Working program, requirements met, standards observed | 6 for capability, 1 for requirements | LO1 | Output. AI-substitutable, so it evidences *requirement satisfaction*, not capability. Both still matter. |
| 5 | Modification authored for a peer, **in-session, 20 min** | 4, observed | LO2 | Timed and observed, so it is real work rather than a five-minute afterthought. |
| 6 | **Supervised response to the peer's modification** | 2 | LO2, LO3 | The substantive test. The single highest-value artefact. |
| 7 | Peer evaluation, with evidence quoted | 4 | LO6 (of the rater) | Evidence *for* the instructor. The peer scores nothing. |
| 8 | Exception-triggered oral check, 5 minutes | 1 | any | Escalation only. Interactive, so it settles matters nothing else can. |
| 9 | Practical examination, week 12 (already in the syllabus) | 2 | LO1–LO4 | Free. An independent control total for the entire scheme — see §4.3. |

Three consequences fall straight out of this table.

- **The original proposal's three artefacts were ranks 5, 5 and 5.** That is the
  whole story of why it was not AI-resistant. Nothing in it was above
  self-representation.
- **Peers generate rank-4 evidence, which is real and useful, and cannot
  generate a defensible grade.** So: the peer is an *audit procedure*, not the
  auditor. This is the cleanest resolution of the peer-grading problem, and it
  is exactly the framing you stated.
- **Rank 3 is where the leverage is.** Rank-1 and rank-2 evidence is expensive
  to gather; rank-5 is free but worthless. Rank 3 — traces produced as a
  by-product of genuinely doing the work — is cheap *and* hard to fake, because
  it was never authored for the assessor. Commit history is the obvious
  instance; the students are already on GitHub, so it costs nothing.

---

## 3. Demonstrability: the rule that makes the scheme AI-resistant by construction

Define three states for any claimed capability:

- **Claimed** — the student has stated it. Evidence ranks 5–6.
- **Corroborated** — independent traces are mutually consistent and would have
  been costly to make consistent without doing the work. Ranks 3–4.
- **Demonstrated** — produced under observation, unaided, and *contingent on the
  student's own history* so that a generic correct answer does not satisfy it.
  Ranks 1–2.

**The grading rule: the mark is set by what is Demonstrated. Corroborated
evidence moves the mark within a band. Claimed evidence carries zero weight.**

This is the sentence that does the work, and it is worth being explicit about
why. A language model can generate unbounded quantities of Claimed evidence at
zero cost. Under this rule, unbounded Claimed evidence buys exactly zero marks.
There is no detector to defeat and no accusation to contest; the artefacts an
AI is good at producing simply do not enter the numerator. That is what
"AI-resistant by construction" means, as against "AI-detected."

**Contingency is the operative word.** A supervised exam question that any
competent student could answer is observed but not contingent — it tests the
syllabus, not the authorship. The supervised response in this design is
contingent because it is about *the student's own submitted program*: what
breaks in *your* design, what *your* minimal change is. A student who did not
build the thing cannot answer it well even with perfect knowledge of C.

**One refinement to your stated goal.** "Assess the process, not the output" is
the right corrective, but taken literally it over-rotates: pure process evidence
rewards the diligent-but-incapable and penalises the capable-and-fast, and it is
itself gameable once students learn what traces are being read. The audit
formulation is more precise and avoids both failure modes: **process evidence
corroborates; observed contingent performance demonstrates; output evidences
requirement satisfaction.** All three are in the file, with different jobs. That
is also why §6 keeps 30% of the component on a working program — LO1 says
*implement*, and we should not stop measuring it.

---

## 4. Analytical procedures — the cheap engine of the whole thing

The most productive audit technique is also the cheapest: form an **expectation**
from one source, compare it to the **actual** from an independent source, and
investigate the gap. Three of these run in this design, and the first is the
reason the locked plan exists at all.

### 4.1 Predicted difficulty vs. actual churn

The locked plan (data point 1) requires the student to name, before coding,
*which parts they expect to be difficult*. The commit history (data point 2)
shows where the time and the rework actually went.

- **Aligned** — the plan predicted difficulty at the file-reading layer, and the
  commits show the most churn there. Consistent with a student who understood
  the problem before starting. Corroborating.
- **Diverged, and the divergence log explains it** — *stronger* evidence than
  alignment, in fact. "I expected parsing to be hard; it was trivial, and the
  real problem was that my struct held a pointer into a buffer I was reusing,
  which is why commits 7–11 are all about ownership." That sentence is very
  difficult to produce without having lived it.
- **Diverged, unexplained** — an exception. Escalate.
- **No difficulty predicted, no churn anywhere, one large commit** — an
  exception. Escalate.

Note the asymmetry: the design *rewards* an honest wrong prediction that is
subsequently explained. That is deliberate. It pays students to plan sincerely
rather than to write a plan that is safe, and it is the opposite of what a
model-generated plan looks like, because a model asked to write a plan after the
fact will produce one that matches the final code suspiciously well.

### 4.2 Response quality vs. everything else

The supervised response (6) is compared against the program (4) and the plan
(1). A student whose program is excellent but who cannot say what breaks under a
modest constraint change is the central case this whole scheme exists to catch —
and it is caught by a comparison, not by an accusation.

### 4.3 Round evidence vs. the week-12 practical examination

This one is free and nobody usually connects it. The syllabus already contains a
supervised, unaided, individually-assessed practical examination at 15%. That is
an independent rank-2 measurement of LO1–LO4 on every student in the class.

Use it as the audit's **control total**. If the three rounds of peer-audit
evidence say a student is Exemplary and the practical examination says
Beginning, the discrepancy is a finding — about that student, or about the
scheme. Either way you want to know, and computing it costs one scatter plot.

Run it in both directions:
- *Per student*, a large gap is an exception worth a conversation.
- *Across the class*, weak correlation between round evidence and examination
  performance means the rounds are not measuring capability, and the design
  needs revision before it carries 30%. This is the empirical test of whether
  the scheme works at all, and §8's pilot exists to run it early.

---

## 5. The audit programme

### 5.1 Structure

**Rotating triads, three rounds.** Triads are drawn at random per round, never
pairing two members of the same project team and never repeating a pairing.
Within triad {A, B, C}: A is audited, writes B's modification, and evaluates C.
Roles rotate each round, so every student is audited once, probes once, and
observes once, per round.

Triads rather than pairs because pairs permit reciprocal trading, and because a
pair leaves no answer to "who audits the leader."

| Round | Week | Material | Outcomes under test |
|---|---|---|---|
| R1 | 4 | Pointers, file I/O, structures | LO1, LO2, LO3 |
| R2 | 7 | MATLAB data pipeline, CSV to figure | LO2, LO3, LO4 |
| R3 | 10 | GUI, data structures, scoping | LO1, LO3, LO5 |

Weeks 12 and 13 stay as they are, and per §4.3 the week-12 examination doubles
as the scheme's control total.

### 5.2 Timeline for one round

Every student-authored artefact is now **timed and in-session**. Only the
implementation itself is taken home — deliberately, for the reason in §5.5.

| Day | Event | Timed? | Produces |
|---|---|---|---|
| 0 | Exercise released; triads published | — | — |
| 0 | *Same session, 15 min, supervised:* **write the plan**, then lock it | ✓ | 1 |
| 1–4 | Implementation at home, committing as the work proceeds | ✗ | 2, 4 |
| 4 | Code pushed | — | 4 |
| 5 | *In session, 10 min, supervised:* **divergence log**, from your own commit log | ✓ | 3 |
| 5 | Automated analytical screen runs; artefacts released to the peer | — | exceptions |
| 5 | *Same session, 20 min, supervised:* **write your peer's modification** | ✓ | 5 |
| 6 | *In session, 25 min, supervised, offline:* **respond to your modification** | ✓ | **6** |
| 6 | *Same session, 15 min:* **write your evaluation** of the third member | ✓ | 7 |
| 7 | Instructor forms the file; exception orals held | — | 8, opinion |

Four of the five student artefacts moved in-session relative to v1, and two of
them — the plan and the divergence log — **rise from rank 5 to rank 2** as a
direct result. That is the largest single improvement to the evidence base in
either revision, and it comes from one decision: write it in the room.

The windows group into **two supervised blocks of roughly 45 and 40 minutes**,
which is the practical scheduling unit. LBY courses carry laboratory contact
hours, so both blocks should fit inside the round week's normal sessions —
**confirm this against the actual timetable before committing**, because §9.1
now turns on total supervised minutes rather than on one window.

**Modification quality control.** The modification must change a *constraint*,
not a parameter: an input-validity assumption, a scale or memory bound, the
shape or arrival order of the data, a new failure mode, or the removal of an
assumption the original relied on. Changing a literal, renaming, or "also print
X" is out of scope and scores zero. The author must state in one sentence which
part of the peer's design they expect to break — that sentence is the graded
artefact, because it is a direct measurement of LO2.

**Response format**, 25 minutes, offline, on the student's own program:
1. What breaks under this modification, and why.
2. The minimal change that fixes it.
3. The revised algorithm, as pseudocode.
4. One thing that could still go wrong.

Pseudocode and diagrams are accepted throughout, and prose quality is explicitly
not graded — see §7 on equity.

**If a supervised window is genuinely unschedulable,** the fallback is a
three-minute unedited single-take screen-and-voice recording against the same
four points. That is rank 2-minus rather than rank 2, and it is far above the
take-home alternative, because the student must own the reasoning aloud at
speaking speed.

**Defaults.** If a peer fails to submit a modification, the instructor issues one
from a pre-written bank so no student is penalised for a peer's default. Failing
to produce an assigned modification or evaluation scores zero on that
sub-component for the defaulter, not for the audited student.

### 5.3 Sampling and materiality, stated in advance

- **100% substantive testing.** Every student sits the supervised response every
  round. This is not sampled — it is the basis of the mark and it is affordable.
- **100% automated control screen.** Every submission passes the §4.1 analytical
  comparison, which is scripted.
- **20% random audit of peer evaluations**, plus 100% of evaluations that are
  outliers against the instructor's own mark, plus 100% carrying a concern note.
- **Materiality.** A discrepancy is material if it could move the student across
  a band boundary of the four-level scale. Immaterial discrepancies are recorded
  in the file and not investigated. Without this line, exception handling
  expands without limit.

### 5.4 Exception handling, and the replacement for the bounty

Default is a clean pass through the programme with no instructor deep-dive. An
**exception** is raised only by: an unexplained analytical divergence (§4.1), a
material gap between the response and the program (§4.2), a peer concern note,
or a failure to appear for the supervised window.

An exception triggers exactly one thing: **a five-minute oral check with the
instructor on the student's own code.** Rank-1 evidence, interactive, and
decisive. Outcomes are the §6.2 opinions — most exceptions resolve to
"unqualified, explained," which matters for the culture of the thing.

**The concern note replaces the bounty.** It is unpaid, it lives on the peer
evaluation form, and it requires specific checkable evidence — *"the divergence
log says ownership was the hard part, but every commit is a whole-file
overwrite"* — not "this reads like AI." Unsupported notes are themselves
recorded, and a rater who files them repeatedly is showing you something about
their own judgement, which §6.1 already grades.

Beyond independence (§1.6), the bounty fails on five further grounds, kept in
Appendix A. The short version: it pays students to accuse, the rational target
is the best-written submission, it puts reward and judgement in the same hands,
it is unbounded and maps to no learning outcome, and it destroys the willingness
to share reasoning that LO6 and this entire mechanic depend on.

### 5.5 What timing buys, and the one trap in it

**The trap: timed is not the same as supervised.** A 25-minute countdown on a
Canvas quiz taken at home buys almost nothing. Pasting a problem into a chatbot
and reading the answer takes under a minute, so a home timer constrains only the
honest student. Timing produces AI resistance solely in combination with
observation, and it is the observation doing most of the work. Wherever this
document says "timed," read **timed, in the room, on a machine without a browser
or with the network restricted, phones away**, and for the response window,
read-only access to the student's own repository and nothing else.

Said precisely in §2's terms: timing alone does not change an artefact's rank.
Timing *plus* observation is what moves the plan and the divergence log from
rank 5 to rank 2.

**Do not time the implementation.** This is the important negative
recommendation, and it cuts against the instinct that more timing is more
resistance. Turning the machine problems into timed lab exercises would:

- **Destroy §4.1, the cheapest AI resistance in the design.** Multi-day work is
  what produces a commit history with a churn distribution to compare against
  the predicted difficulty. Compress it to two hours in a room and there is no
  trace left to analyse. You would be trading a rank-3 evidence stream that
  costs nothing for supervision you are already buying elsewhere.
- **Measure the wrong thing.** Timed coding measures recall and speed. LO2 and
  LO3 — analyse a problem, develop an algorithm — need reflection, and the
  student who thinks for an hour before typing is the one the outcome is meant
  to reward.
- **Be redundant.** Week 12's practical examination already measures unaided
  timed performance at 15%, and §4.3 already uses it as the control total.

The division of labour is therefore: **implementation takes as long as it takes
and leaves a trace; every claim the student makes about that implementation is
made in the room.** An AI can write the program — and if it does, the student
will have nothing to say in any of the four windows about a program they did
not build. That is the design working as intended, and it is the concrete
meaning of "make AI use irrelevant to the mark" from §3.

**Morale cost, stated honestly.** This is twelve timed episodes across the term
in a one-unit course, and a badly framed version of it feels like a term of
examinations. Two mitigations. First, only the response window is high-stakes;
the plan, divergence and evaluation windows are short and low-weight, and should
be run and described as **working sessions, not tests** — the students are
simply doing the work in the room instead of at home. Second, publish the point
of it: written reasoning in the room is the normal professional condition —
design reviews, incident write-ups, code review — and is worth practising for
its own sake, not only because it is hard to outsource.

**Absence and accommodation.** A missed window yields a *disclaimer* opinion
(§6.2) and a re-sit, never a zero by default. Any student who reasons better
aloud may give the response orally into a recorder in the room, on request and
without justification.

---

## 6. Forming and recording the judgement

### 6.1 The mark

Component: **Machine problems and exercise mastery — 30% of the final grade**,
formed from the existing machine-problem 25% and teacher's-evaluation 5%, so the
published totals do not move and no other component is disturbed.

Averaged across the three rounds:

| Sub-component | Share | Evidence | Rank | Outcome |
|---|---|---|---|---|
| Working program: requirements, standards | 25% | 4 | 1 for requirements | LO1 |
| Plan + divergence log, timed, commit-corroborated | 20% | 1, 2, 3 | 2 | LO2, LO3 |
| **Supervised response** | 35% | 6, informed by 7 | 2 | LO2, LO3 |
| Modification authored (timed) | 12% | 5 | 4 | LO2 |
| Quality of the evaluation written as a rater | 8% | 7 | — | LO6 |

The first two rows moved by five points relative to v2 as a consequence of
timing. The plan and divergence log are now observed artefacts rather than
self-representations, so they can carry more; the program, which remains
rank 6 as capability evidence, carries less. A quarter of the component still
rides on a program that compiles and meets its requirements, which is the floor
LO1 requires.

**Every row is scored by the instructor.** The peer contributes evidence to rows
three and four and is scored on row five. This is the change the audit frame
forces, and it is what makes the component defensible as Student Outcome
evidence.

Row five is doing more work than its weight suggests: grading the *quality of
someone's audit* is what makes raters take the role seriously, it is a genuine
LO6 skill, and it is the only thing standing between you and forty perfunctory
evaluation forms.

Overall, **75% of the component now rests on timed observed work and its
corroboration, and 25% on the submitted program.** That ratio is the numeric
expression of §3: demonstration outweighs output, but output still counts,
because LO1 says implement.

### 6.2 The opinion

For each student each round, the instructor records one of four opinions. This
is not decoration — it gives you a vocabulary for cases the usual scale handles
badly.

- **Unqualified** — capability demonstrated; evidence consistent. Mark stands.
- **Qualified** — demonstrated with a specified exception, which is named in the
  file. Mark stands with the noted limitation.
- **Adverse** — the evidence contradicts the claim. The supervised response
  cannot account for a program the student submitted. Mark reflects what was
  demonstrated, which is little, and the Student Handbook process is available
  separately if warranted.
- **Disclaimer** — *insufficient evidence to form an opinion*: the student
  missed the supervised window, or no commit history exists. No capability
  credit, and a re-sit is offered.

The fourth is the one worth having. "We could not assess you" is a different
finding from "you failed," it is currently homeless in most grading schemes, and
keeping them distinct is both fairer and far easier to defend on appeal.

### 6.3 The working file

One page per student per round, generated mostly automatically: the nine data
points with their ranks, the analytical comparisons and their outcomes, any
exceptions and how they were resolved, the sub-component marks, and the opinion.

This is the deliverable that makes the whole scheme real. It is what you hand to
a department chair questioning a grade, what you show an accreditation panel as
Student Outcome D/J/K evidence, and what lets you answer an appeal with a
document rather than a recollection.

### 6.4 What it costs

Per round, for ~40 students:

| Activity | Time |
|---|---|
| Invigilating two supervised blocks, ~45 and ~40 min | ~1.5 h |
| Analytical screen (scripted) | ~0 |
| Grading 40 supervised responses, 4 structured points | ~2.5 h |
| Grading 40 timed plans and divergence logs, both very short | ~1 h |
| Auditing 8 peer evaluations | ~0.5 h |
| Exception orals, assuming a 10% rate | ~0.5 h |
| File review and opinions | ~0.5 h |
| **Per round** | **~6.5 h** |
| **Per term, three rounds** | **~19.5 h** |

Timing everything raised this from ~12 hours to ~19.5, and that increase should
be looked at squarely rather than waved past. Two things soften it. The ~4.5
hours of invigilation across the term are **contact hours you are already
present for**, not new hours, provided the blocks fit the timetable — which is
exactly why §9.1 is the first decision. And much of the marking displaces
machine problems you already grade, with the supervised artefacts being short
and structured, which is why they mark quickly.

The residue is real, though: call it five to seven genuinely new hours across
the term for a one-unit course, bought in exchange for moving 75% of the
component onto observed evidence. That is a good trade, and it is a trade. If
the real class size is materially above 40 the correct adjustment is fewer
rounds, not
thinner evidence.

---

## 7. Risks this design carries

**Goodhart on the traces.** The moment students learn that commit cadence is
read, some will pad commits. **Mitigation, and it is a hard design rule:
trace metrics are exception *triggers* only and are never scored directly.**
Nobody gains a mark for a pretty commit graph; an odd one buys a five-minute
conversation, which a student who did the work passes trivially. This follows
from audit practice, where testing a control is not the same as scoring it.

**Naive metrics will produce false exceptions.** A student who drafts offline
and commits once at the end is not cheating, and a student on intermittent
internet may have no useful cadence at all. Set the screen loose, expect
false positives, and remember that the cost of one is a short friendly
conversation, not an allegation. Publish that cost to the class explicitly —
it is the difference between a screen students tolerate and one they resent.

**Drift into surveillance.** An audit frame can slide into monitoring if it is
communicated badly. Two guards: never read anything the student did not know
was being read, and publish the entire evidence table in §2 to the class in
week 1. Ask students to audit — teach the role as a professional skill, which
it is.

**The supervised window is a single point of failure.** It carries 35% and it
depends on scheduling and attendance. The recording fallback exists; the
disclaimer opinion exists for genuine absence. If lab time cannot be secured,
that is the thing to solve first, because everything else in the design is
corroboration around it.

**Written reasoning under time pressure is not equally accessible.** Accept
pseudocode, diagrams and bullet fragments; grade the reasoning and ignore the
prose entirely; state this on the form itself. Consider allowing the response to
be given orally into a recorder for any student who prefers it.

---

## 8. Sequencing

1. **Now.** Settle the four decisions in §9 that change the design.
2. **Before the term.** Publish the evidence table and the demonstrability rule
   to students — this is a teaching artefact, not fine print. Write the
   modification bank. Script the analytical screen. Build the one-page file
   template.
3. **Week 4, R1, as a pilot at 5% of the final grade,** with the remainder held
   in the existing machine-problem component and the intent published from day
   one so nobody is surprised. Measure: actual duration of the supervised
   window, substantiveness of the modifications, spread between peer evidence
   and instructor marks, and the exception rate.
4. **Week 12.** Run §4.3 against the practical examination. This is the honest
   test of whether the scheme measures capability. If the correlation is weak,
   the rounds are not working and the weight should not be carried into next
   term regardless of how good the design looks on paper.
5. **R2 and R3 at full weight**, if the pilot holds.

---

## 9. Decisions needed from the coordinator

Four that change the design:

1. **Can roughly 85 supervised minutes be scheduled in each of weeks 4, 7 and
   10** — two blocks of about 45 and 40 minutes? This is now the binding
   constraint on the whole architecture, since 75% of the component is timed
   observed work. If only one block is available, keep the 25-minute response
   window and revert the plan, divergence log and evaluation to take-home, which
   costs them their rank-2 standing and shifts the §6.1 weights back toward the
   program. If no block is available, the recording fallback becomes primary.
2. **Is commit history mandatory and inspectable for machine problems?** §4.1 is
   the cheap engine, and it does not run without it.
3. **Is the bounty withdrawn?** The audit frame and a contingent fee are
   incompatible (§1.5); the design does not hold with both.
4. **Real class size and available grading hours**, which set the round count.

Three that need settling but do not change the architecture:

5. **Does restructuring the machine-problem component require department
   approval,** even though published totals are unchanged?
6. **Is the AI policy moving from prohibition to disclosure?** The current policy
   bans reading AI summaries in search results, which is unenforceable, and this
   design does not need prohibition to work — it needs the demonstrability rule.
   Worth deciding before publication rather than after.
7. **Are students told the evidence table in advance?** §7 recommends strongly
   yes. Noted here because it is a real choice and some colleagues will disagree.

---

## Appendix A — critique of the original proposal (condensed from v1)

The original concept: teams of a leader and a peer; each student submits a
one-page bullet list of their approach per exercise; a randomly assigned peer
formulates a modification, answered in writing; the team leader evaluates the
individual on the three artefacts, worth 30%; +5% to any student who detects AI
use, proven by the instructor, and zero on the exercise for the user.

**What it gets right, and is preserved.** It assesses process rather than
product. The peer modification is a viva in disguise, and an unanticipated
variation on your own problem is the best single discriminator available.
Authoring a modification is itself an assessed skill and a direct measurement of
LO2 that is rare in engineering programmes — this is the most original element
and it survives into §5.2 intact. And it creates a second reader for every
submission, which is the scalability trick that makes deep assessment possible
at all.

**Why the artefacts were not AI-resistant.** All three graded artefacts —
approach list, modification, response — are untimed, unsupervised, self-authored
prose. In the §2 hierarchy they are ranks 5, 5 and 5: nothing above
self-representation. Worse, the design moved assessment away from code, which at
least has testable behaviour, toward prose, which has no ground truth at all.
Fixed by §3's demonstrability rule and, in v3, by timing every student-authored
artefact in the room — which lifts the same three artefacts the original
proposal named from rank 5 to ranks 2, 2 and 4 without changing what they are.
The original structure was sound; only the venue was wrong.

**Why the bounty must go.** Beyond the independence argument in §1.5: no
admissible evidence standard exists and "proven by the instructor" hides an
unbounded adjudication workload with no stated burden of proof or appeal; it
makes speculative accusation rational; the rational target is the most polished
submission, so it penalises strong students and fluent writers; it puts the
reward and the judgement in the same hands when the leader both scores and
reports; it is uncapped and maps to no learning outcome, so it is a policy
instrument hidden inside a grade; and it destroys the willingness to share
reasoning that both LO6 and this mechanic require.

**Why a single student rater could not carry 30%.** Second-year students are
uncalibrated, peer marks cluster high and track friendship, and with one rater
per ratee there is no redundancy to catch a lazy or hostile one. The proposal
also never said who evaluates the leader. Resolved by rotating triads and by the
§2 finding that peers generate rank-4 evidence — real, useful, and not a grade.

**Why the arithmetic did not close.** Published weights already total 100
(Laboratory 25, Machine problems 25, Project 30, Practical examination 15,
Teacher's evaluation 5). §6.1 sources the 30% from the last two, leaving
everything else untouched.

**Why the workload was infeasible.** Applied to every machine problem at ~40
students it generates roughly 160 artefacts per exercise and over a thousand per
term, for a one-unit course. Reduced to three rounds with hard caps and
structured forms; costed in §6.4.

## Appendix B — alternatives considered

- **Live oral defence with the instructor, every exercise.** The most robust
  method available. ~40 students × 10 min × 3 rounds ≈ 20 hours for a one-unit
  course. Rejected on cost, and retained in reduced form as the five-minute
  exception oral, where it does the most good per minute spent.
- **Whole-class in-lab modification sprint, no peers.** The instructor writes
  every modification; students answer under supervision. Cheaper and nearly as
  AI-resistant, but it discards the LO2 modification-authoring measurement and
  the LO6 evaluation measurement, and it puts the entire authoring burden on the
  instructor. Good fallback if peer logistics fail.
- **Commit-history portfolio alone, no peers, no supervision.** Cheap and rank-3
  throughout, but entirely corroborative: it assesses traces rather than
  reasoning, and under §3 nothing in it is ever Demonstrated.

**Recommended: the original structure, rebuilt as an audit** — rank-3 commit
corroboration as the cheap screen, a rank-2 supervised response as the
substantive test, rank-4 peer work as the probe that makes it affordable, and
rank-1 orals reserved for exceptions.
