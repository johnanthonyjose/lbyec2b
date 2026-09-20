# Assessment as audit — an AI-resistant design for LBYEC2B

Status: draft v6, for discussion. Nothing here is committed to the syllabus yet.
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
> frame. v3 timed every student-authored artefact in the room, lifting the plan
> and divergence log from rank 5 to rank 2 and putting 75% of the component on
> observed work; the implementation stays untimed and taken home, for the reason
> in §5.5. v4 restored a named leader, evaluated by the instructor, inside
> standing pods of six. **v5 implements the decision to run a single round**,
> and spends the saved effort on recovering what repetition would have bought:
> two independent probes per student, two evaluators, a mandatory ungraded dry
> run in week 3, and a stated re-sit right — see §5.1.2. **v6 cuts supervised
> time from 95 minutes to 75** by sending peer evaluations home and replacing
> one authored probe with a calibrated instructor bank probe — §5.2.1 gives the
> rule used to decide what stays in the room. The v1 critique is condensed into
> Appendix A.

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
| 5 | Modification authored for a peer, **in-session, 12 min** | 4, observed | LO2 | Timed and observed, so it is real work rather than a five-minute afterthought. |
| 5b | Common bank probe, written by the instructor | n/a — it is the instrument | LO2, LO3 | Calibrated: one probe every student answers against their own design, so responses are comparable class-wide. |
| 6 | **Supervised response to the peer's modification** | 2 | LO2, LO3 | The substantive test. The single highest-value artefact. |
| 7 | Peer evaluation, with evidence quoted, take-home | 4 | LO6 (of the rater) | Evidence *for* the instructor; the peer scores nothing. Not supervised — it is a claim about someone else's work, so §5.2.1's rule does not apply. |
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

Use it as the audit's **control total**. If the round's peer-audit
evidence says a student is Exemplary and the practical examination says
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

### 5.1 Structure: pods are the standing unit, rounds are the repeat

These are two different axes and it is worth separating them explicitly, because
they solve different problems and neither substitutes for the other.

- A **pod** is a *spatial* partition. It splits 40 students into manageable
  groups so that windows can be staggered, machines are sufficient, one person
  has a real span of control, and the same faces recur. Pods solve **logistics
  and accountability**.
- A **round** is a *temporal* repeat. Each round measures every student again,
  on different material. Rounds solve **reliability and outcome coverage**.

Running more pods in parallel does not reduce the number of rounds needed:
eight pods measured once is still one measurement per student. §5.1.2 makes the
case for why one is not enough.

#### 5.1.1 Pods

**Pods of six, stable for the term.** Roughly seven pods for a class of 40. Pods
are drawn so that a pod does not reproduce a project team — you want the audit
relationships to be independent of the project relationships, so that a project
grievance does not contaminate audit evidence, and vice versa.

Stability is deliberate and is a change from v2's fully random redraw. A
standing pod builds enough familiarity for people to write frank evaluations,
lets the leader form a *comparative* view across their members, and makes the
scheduling tractable. The audit pairings **inside** the pod are still redrawn
for the round, which preserves the anti-collusion property that mattered.

**Within a pod of six, each member probes one other and evaluates two others**,
drawn so that no pair probes each other reciprocally. A ring is easiest to
publish: number the members 1–6; member *n* authors a modification for *n+1*
and evaluates *n+2* and *n+3*. Everyone authors one probe, receives one peer
probe plus the common bank probe, evaluates two and is evaluated by two, and
nobody probes someone who is probing them.

#### 5.1.2 One round: the decision, and how to make it hold

**Decision taken: a single round.** The trade is understood and is not
unreasonable — one round that is run properly beats three that are rushed,
scheduled badly, and marked in a hurry, and the instructor time falls from ~21
hours to ~8. What follows is the honest cost, stated once, and then the design
changes that buy most of it back.

**What one round costs, plainly.**

- *No repeat measurement.* Illness, a bad day, or a lazy probe from a peer is
  unmitigated. Answered by §5.1.2a and by a stated re-sit right.
- *Novelty contamination becomes the entire result.* Students are bad at an
  unfamiliar assessment format the first time they meet it. In a three-round
  design round one absorbs this; with one round there is nothing to absorb it.
  Answered by the dry run in §5.1.2b, which is now **mandatory, not optional**.
- *Coverage narrows to one technology.* The component can only claim the
  outcomes the round actually measures. Answered by choosing the week
  deliberately — §5.1.2c.
- *Leader rotation is impossible.* One leader per pod, fixed, so ~7 of 40
  students generate leadership evidence. Accepted; see §5.1.3.

**What one round gains, and it is not nothing.** Three well-separated pods'
worth of logistics collapse into a single well-prepared week. Invigilation is
easier to secure once than three times. Students face one format rather than a
term of recurring examinations, which was a real morale risk in v3. And the
whole scheme can be piloted, judged and revised in one term instead of being
committed to across a term before any evidence about it exists.

##### 5.1.2a Recover reliability inside the round: two probes, two observers

Reliability came from repeated measurement over *time*. With one round it has to
come from redundancy *within* the round, and it largely can.

**Two probes: one from a peer, one from the instructor's bank.** This is the
single most important change and it substitutes directly for the missing second
round. One lazy or badly-aimed modification no longer determines the result, and
the bank probe additionally fixes a fairness problem the peer ring cannot — see
§5.2.2 on calibration.

**Two evaluators per student.** In a pod of six this costs nothing structurally:
each member writes two short evaluations instead of one, take-home. Peer
evidence is rank 4 precisely because the observer is untrained, and two
untrained observers who agree are worth appreciably more than one.

**Already-redundant artefacts.** Note that the round was never a single
measurement even before this: the plan, the divergence log, the two
modifications authored, and the two responses are five separate observations of
LO2 and LO3 reasoning, gathered under observation on different days. What one
round loses is *temporal* spread and *topic* spread, not sample size.

**A stated re-sit right.** Any student may request one re-sit of the response
window, no justification required, within two weeks. With one round this is not
a courtesy; it is the only remaining safeguard against a bad day, and it costs
almost nothing because few will use it.

##### 5.1.2b A mandatory ungraded dry run

Run the entire mechanic in **week 3**, ungraded, on a deliberately small
exercise — a single file-reading function is enough. Full format: a 10-minute
plan, a 10-minute modification for a peer, a 15-minute response, one evaluation
form. Nothing is marked; the instructor returns two or three worked examples of
what a strong modification and a strong response look like.

This is the highest-value 45 minutes in the entire one-round design. Without it
the graded round measures how quickly students decode an unfamiliar format, and
that is not a learning outcome. It also surfaces your own logistics problems —
timings, machine lockdown, invigilation — while they are still free to fix.

**If nothing else in this section is adopted, adopt the dry run.**

##### 5.1.2c Which week

With one round, the week determines which outcomes the component can honestly
claim. The syllabus itself settles it: **week 6, elementary matrix operations,
is the only week mapped to LO1 through LO4** — exactly the span the
machine-problem component claims.

| Candidate | Mapped outcomes | Assessment |
|---|---|---|
| Week 4, structures | LO1–LO3 | Earliest, so the strongest effect on behaviour for the rest of the term, but no LO4 at all |
| **Week 6, matrix operations** | **LO1–LO4** | **Recommended.** Full coverage; C and introductory MATLAB both behind the students; still early enough to shape weeks 7–13 |
| Week 7, analyzing data | LO4 only | Too narrow, and it collides with the project announcement |
| Week 10, GUI | LO1–LO4 | Also full coverage, but too late to change behaviour and it collides with project implementation |

Week 6 also sits well against the dry run in week 3 — far enough apart that the
format has settled, close enough that it is still fresh.

If week 6's material proves too thin to support a modification that changes a
real constraint (§5.2), week 10 is the fallback, at the cost of the behavioural
effect.

##### 5.1.2d Weight

**Recommendation: carry 25%, not 30%,** with the remaining 5% staying in
conventionally-marked machine problems. One round with two probes is a
defensible basis for a quarter of the grade; the last five points are cheap
insurance against a single week going wrong for reasons outside any student's
control.

If 30% is preferred, it is carryable **provided** §5.1.2a and the dry run are
both adopted. It is not carryable on a single probe with no dry run, and that
is the one combination to avoid.

#### 5.1.3 The pod leader, and the instructor's evaluation of them

Reinstating a named leader is sound **under the audit frame**, and the objection
raised against it in v1 no longer applies. The original danger was that the
leader *graded* peers; in this design nobody but the instructor scores anything,
so the leader's judgement is evidence, not a mark. What a leader adds is real:

- **A comparative view.** One person who sees all five pod members' work across
  a round can make relative judgements that isolated pairwise raters cannot.
- **First-pass quality control.** The leader reviews their pod's evaluations for
  evidence quality before they reach the instructor — an evaluation asserting
  "good understanding" with nothing quoted goes back. This directly reduces the
  instructor's §5.3 audit burden.
- **A genuine LO6 measurement.** Coordinating, chasing, and quality-checking
  others' work is the teamwork outcome, assessed for once on something other
  than self-report.

**The leader's job, stated so it is not merely a title.** Each round: confirm
every pod member's artefacts exist before each window; review the pod's
evaluations for cited evidence and return the thin ones; submit a one-page pod
summary naming any exceptions and the reasoning behind them.

**The leader is evaluated by the instructor** — your proposal, and it is the
right call. It closes the accountability gap that sank the original two-person
structure, and it means the one person with influence over how evidence is
presented answers to the assessor rather than to a peer. Concretely the
instructor scores the pod summary and the quality of the returned evaluations,
which is §6.1's fifth row applied to the leadership role.

**The leader is still audited like everyone else.** They submit all the same
artefacts and a pod member writes their modification. Leading is an additional
role, never an exemption.

**One leader per pod, fixed for the term** — rotation needs rounds to rotate
through, and with a single round there are none. This is a real loss: roughly
seven of forty students will generate leadership evidence, and LO6 for the other
thirty-three rests entirely on the project's teamwork rubric. Two partial
compensations, both cheap:

- **Appoint deliberately rather than by volunteer or popularity.** With only
  seven leadership slots, use them: pick students for whom the evidence is most
  useful, or who most need the developmental experience.
- **Name a deputy in each pod** who runs the evidence quality-control pass on
  the leader's own artefacts, and who takes over if the leader is absent. That
  yields fourteen students with some coordination evidence instead of seven, at
  no extra instructor cost.

---

### 5.2 Timeline

#### 5.2.1 The rule for what gets supervised

Supervised minutes are expensive and they are the only thing in the design that
buys AI resistance, so they should be spent on one thing and nothing else:

> **Supervise the claim, not the chore.** An artefact needs the room if, and
> only if, it is the student making a claim about *their own* capability.
> Everything else can go home.

Applied honestly, that rule cuts two items from v5's 95 minutes.

- **Peer evaluations (15 min) — send them home.** An evaluation is about
  *someone else's* work. It is rank-4 evidence whether or not a model helped
  write it, and the thing being graded is whether the rater cited real evidence
  — which is just as visible in a take-home form. Fifteen minutes of scarce
  supervised time was buying nothing.
- **Authoring the second modification (12 min) — replace it with a bank probe.**
  See §5.2.2; this turns out to be an improvement to the assessment, not only a
  saving.

The two items that look expensive but must stay are the divergence log and the
responses. Both are pure claim: *this is what I did and why*, and *this is what
breaks in my design*. Send either home and the component loses its rank-2
evidence and, with it, its point.

#### 5.2.2 One peer probe and one bank probe

v5 had every student author two modifications and receive two. Replace one of
the received probes with a **pre-written instructor bank probe**, and each
student authors only one.

This halves the authoring time, but the reason to do it is **calibration**. With
two peer probes, the difficulty of your assessment depends entirely on who drew
your name — one student gets two sharp probes and another gets two lazy ones,
and their marks are not comparable. A common bank probe, sat by the whole class
against their own programs, is one measurement every student can be ranked on
fairly. It also guarantees a floor on probe quality, which the peer ring never
could.

It stays contingent, which is what matters for §3: a bank probe such as *"the
input file may now contain malformed rows at unknown positions"* is generic in
its wording but can only be answered against the student's own design.

So: **two probes, one peer-authored and one from the bank**, and the peer probe
is still graded as the author's LO2 evidence.

#### 5.2.3 The schedule

**Week 3, the dry run** (§5.1.2b): the whole format, ungraded, on a trivial
exercise. **30 minutes** — abbreviated, since it only has to teach the format —
with worked examples returned the following session.

**Week 6, the graded round**, in two touchpoints:

| Day | Event | Supervised | Produces |
|---|---|---|---|
| 0 | Exercise released; pods and the probe ring published | — | — |
| 0 | *15 min, appended to the release session:* **write the plan**, then lock it | **15 min** | 1 |
| 1–4 | Implementation at home, committing as the work proceeds | — | 2, 4 |
| 4 | Code pushed; automated analytical screen runs | — | 2, exceptions |
| 5 | *8 min:* read your assigned peer's program | **one 60-min session** | — |
| 5 | *12 min:* **author one modification** for that peer | ↑ | 5 |
| 5 | *10 min:* **divergence log** from your own commit log — also the buffer while modifications are distributed | ↑ | 3 |
| 5 | *30 min, offline:* **respond to your two probes**, peer and bank, 15 min each | ↑ | **6** |
| 5–7 | *Take-home:* write two evaluations of two pod members | — | 7 |
| 7 | Leader reviews the pod's evaluations, returns thin ones, submits the pod summary | — | quality control, LO6 |
| 7 | Instructor forms the file; exception orals held | — | 8, opinion |
| ≤ wk 8 | Re-sit of the day-5 session, on request, no justification needed | — | — |

**Total supervised time: 75 minutes** — one 15-minute tail on a session you are
already running, and one protected 60-minute session — plus the 30-minute dry
run. Down from 95 + 45, and against 255 for the three-round design.

Collapsing day 5 and day 6 into a single session is what removes the third
touchpoint. It works because the peer's code was pushed on day 4, so the
modification can be authored and answered in the same sitting; the divergence
log sits between them as a natural buffer while papers are swapped.

Every claim a student makes is still written in the room, and the plan and
divergence log keep their rank-2 standing. **The 30 response minutes are the
part to protect** — they carry 35% of the component and are the only
substantive test in the design.

#### 5.2.4 Is 75 minutes actually a lot?

Worth putting against the denominator before deciding. An LBY course carrying
three contact hours across thirteen weeks has roughly 2,340 minutes of
laboratory time. The graded round uses 75 of them and the dry run 30.

| | Minutes | Share of term contact time |
|---|---|---|
| Graded round | 75 | 3.2% |
| Dry run | 30 | 1.3% |
| **Total** | **105** | **4.5%** |

Four and a half percent of contact time to place 75% of a 25% grade component
on observed evidence is not, in the abstract, expensive. The honest caveat is
that it is **concentrated**: 60 minutes lands in one week-6 session, which is a
third of that session's teaching, and that is a real cost in the week it falls.
Schedule week 6's teaching around it rather than treating it as spare capacity.

**Modification quality control.** The modification must change a *constraint*,
not a parameter: an input-validity assumption, a scale or memory bound, the
shape or arrival order of the data, a new failure mode, or the removal of an
assumption the original relied on. Changing a literal, renaming, or "also print
X" is out of scope and scores zero. The author must state in one sentence which
part of the peer's design they expect to break — that sentence is the graded
artefact, because it is a direct measurement of LO2.

**Response format**, 15 minutes per probe, offline, on the student's own
program. Two probes means two passes through the same four points. The
repetition is deliberate — the peer probe tests reasoning against an
unanticipated attack, and the bank probe gives one calibrated measurement
comparable across the whole class:
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

Within the single round:

| Sub-component | Share | Evidence | Rank | Outcome |
|---|---|---|---|---|
| Working program: requirements, standards | 25% | 4 | 1 for requirements | LO1 |
| Plan + divergence log, timed, commit-corroborated | 20% | 1, 2, 3 | 2 | LO2, LO3 |
| **Supervised response** | 35% | 6, informed by 7 | 2 | LO2, LO3 |
| Modification authored (timed) | 12% | 5 | 4 | LO2 |
| Quality of your audit work: evaluations written as a rater, and pod supervision in the round you lead | 8% | 7, pod summary | — | LO6 |

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

For each student, the instructor records one of four opinions. This
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

One page per student, generated mostly automatically: the nine data
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
| Writing the bank probe (once, reusable across terms) | ~1 h |
| Running the week-3 dry run and returning worked examples | ~1 h |
| Invigilating 75 min of supervised time | ~1.25 h |
| Analytical screen (scripted) | ~0 |
| Grading 80 responses — 40 students × 2 probes, 4 structured points each | ~4 h |
| Grading 40 timed plans and divergence logs, both very short | ~1 h |
| Grading 40 authored modifications, one sentence each is what counts | ~0.5 h |
| Auditing a 20% sample of 80 peer evaluations | ~0.75 h |
| Reading 7 pod summaries and evaluating the leaders | ~0.75 h |
| Exception orals, assuming a 10% rate | ~0.5 h |
| File review and opinions | ~0.75 h |
| Re-sits, assuming a 5% uptake | ~0.25 h |
| **Whole term** | **~11.75 h**, of which ~1 h is one-off |

About ~12 hours for the term, against ~21 for the three-round design, and it
barely moved when supervised time fell from 95 minutes to 75 — which is the
point worth noticing. **Invigilation was never the expensive part.** Marking
the responses is, at ~4 hours, and that cost is driven by having two probes per
student, not by how long students sat in the room.

So the two-probe design is where the money goes, and it is the best-value line
in the table: it is the only thing standing between a single observation and a
defensible mark. The dry run costs ~1 hour and protects the entire result from
novelty contamination. Neither is a candidate for cutting; trimming supervised
minutes further would save almost nothing.

Two things further soften the total. The ~1.25 hours of invigilation are
**contact hours you are already present for**, provided the blocks fit the
timetable — which is why §9.1 remains the first decision. And much of the
marking displaces machine-problem marking you already do, with the supervised
artefacts being short and structured, which is why they go quickly.

With one round there is no longer a round count to trim. If the real class size
is materially above 40, the adjustment is a lower weight per §5.1.2d, never
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

1. **Now.** Settle the four decisions in §9 that change the design — above all
   whether one protected 60-minute session exists in week 6.
2. **Before the term.** Publish the evidence table (§2) and the demonstrability
   rule (§3) to students; these are teaching artefacts, not fine print. Write
   the bank probe (§5.2.2) and the default modification bank. Script the
   analytical screen. Build the one-page file
   template and the evaluation form. Form pods and appoint leaders and deputies.
3. **Week 3 — the dry run.** Ungraded, full format, small exercise, 30 min. Return
   worked examples of a strong modification and a strong response. This also
   shakes out your invigilation and machine-lockdown problems while they are
   still free to fix.
4. **Week 6 — the graded round.** A 15-minute tail on the release session and
   one protected 60-minute session.
5. **Weeks 7–8.** Marking, exception orals, re-sits, files closed.
6. **Week 12 — validate.** Run §4.3 against the practical examination. With one
   round this is *more* important, not less: it is the only external check on
   whether the round measured capability at all. A weak correlation means the
   weight should not be repeated next term, whatever the design looks like on
   paper.
7. **After the term.** Decide on the strength of that correlation whether to
   keep one round at this weight, or add a second next term.

**Note on piloting.** v3 recommended running the first round as a low-stakes
pilot at 5%. With a single round that option is gone — the round *is* the
assessment, so it cannot also be the rehearsal. The week-3 dry run is what
replaces it, and it is the reason §5.1.2b calls it mandatory rather than
advisable.

---

## 9. Decisions needed from the coordinator

Five that change the design:

1. **Can one protected 60-minute session be scheduled in week 6**, plus a
   15-minute tail on the release session and 30 minutes in week 3? This is the
   binding constraint on the whole architecture, since 75% of the component is
   timed observed work and there is no second round to fall back on. If the
   60 minutes cannot be protected, cut in this order: the 8-minute code-reading
   slot, then the authored modification (leaving the bank probe alone as the
   sole probe, which costs the LO2 authoring evidence), then the divergence log.
   **Never cut the 30 response minutes** — at that point the recording fallback
   becomes primary and the weight should drop further.
2. **Is commit history mandatory and inspectable for machine problems?** §4.1 is
   the cheap engine, and it does not run without it.
3. **Is the bounty withdrawn?** The audit frame and a contingent fee are
   incompatible (§1.5); the design does not hold with both.
4. **What weight does the single round carry?** §5.1.2d recommends 25%, with
   5% left in conventionally-marked machine problems. 30% is carryable **only**
   with both the two-probe design and the week-3 dry run in place.
5. **Which week?** §5.1.2c recommends week 6, the only week the syllabus maps
   to LO1–LO4. Week 4 trades LO4 coverage for a stronger effect on behaviour
   across the rest of the term; week 10 is the fallback if week 6's material
   will not support a real constraint change.

Three that need settling but do not change the architecture:

6. **Does restructuring the machine-problem component require department
   approval,** even though published totals are unchanged?
7. **Is the AI policy moving from prohibition to disclosure?** The current policy
   bans reading AI summaries in search results, which is unenforceable, and this
   design does not need prohibition to work — it needs the demonstrability rule.
   Worth deciding before publication rather than after.
8. **Are students told the evidence table in advance?** §7 recommends strongly
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
also never said who evaluates the leader. Resolved in v4 by pods with a
rotating leader whom the instructor evaluates directly, and by the
§2 finding that peers generate rank-4 evidence — real, useful, and not a grade.

**Why the arithmetic did not close.** Published weights already total 100
(Laboratory 25, Machine problems 25, Project 30, Practical examination 15,
Teacher's evaluation 5). §6.1 sources the 30% from the last two, leaving
everything else untouched.

**Why the workload was infeasible.** Applied to every machine problem at ~40
students it generates roughly 160 artefacts per exercise and over a thousand per
term, for a one-unit course. Reduced to a single round with hard caps and
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
