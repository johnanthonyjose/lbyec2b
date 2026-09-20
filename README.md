# LBYEC2B course website

Course site for **LBYEC2B, Computer Fundamentals and Programming 2** — De La Salle
University, Gokongwei College of Engineering.

Built with Vite and React, deployed to GitHub Pages by GitHub Actions.

## Running it

```bash
npm install
npm run dev        # local dev server with hot reload
npm run build      # production build into dist/
npm run preview    # serve the production build locally
```

## How the site is laid out

```
index.html               hub page          -> src/main-index.jsx           -> src/pages/Home.jsx
course-overview.html     the syllabus page -> src/main-course-overview.jsx -> src/pages/CourseOverview.jsx
github-account.html      handout 01        -> src/main-github-account.jsx  -> src/pages/GitHubAccount.jsx
assignment-workflow.html handout 02        -> src/main-assignment-workflow.jsx -> src/pages/AssignmentWorkflow.jsx
file-io.html             handout 03        -> src/main-file-io.jsx          -> src/pages/FileIO.jsx

src/
  data/course.js         ALL course content: weeks, outcomes, rubrics, policies, references
  styles/
    dlsu/                the design system's token layer (colours, type, spacing, elevation, motion)
    site.css             site-wide utilities and the responsive rules
    parts/               one stylesheet per component introduced by handout 03,
                         imported from site.css. Kept separate so components
                         can be added without editing a 1,200-line file.
  components/
    ds/                  design-system components (Button, Card, Tabs, Tag, Badge)
    figures/             figure primitives shared by the handouts
    SiteHeader/Footer    chrome shared by every page
    walkthrough/         the staged-handout engine: stage gating, the stage map,
                         the step frame, the completion panel and persistence.
                         Shared by handouts 02 and 03; a new staged handout
                         should need three data files and a shell, not a copy
                         of this.
    Resolution.jsx       the "anticipated difficulty" modal, shared
    SelfCheck.jsx        the two-answer checkpoint — verifies what is on screen
    PredictCheck.jsx     the prediction checkpoint — commits to an answer first
    FileMachine.jsx      handout 03's trace visualiser: the stream position
                         and EOF, which prose cannot show
    explorable/          the explorable figures and the transport they share.
                         Scrub.jsx defines one timeline, one play control and
                         one caption frame for all of them, so learning the
                         first figure teaches the rest: nothing autoplays,
                         nothing loops, and prefers-reduced-motion withholds
                         play rather than making it fast. ParseWalker animates
                         getDelimitedItem, BufferMachine the write buffer and
                         the syscall it saves, LoopCompare the feof fault with
                         both loops on one timeline.
    Section.jsx          the section shell and heading
    Brand.jsx            the wordmark and course mark
  pages/
    course-overview/     one file per section of the course page
    github-account/      handout 01's step and resolution content
    assignment-workflow/ handout 02's stages, steps, resolutions and UI
    file-io/             handout 03's stages, steps (split at the stage-4
                         boundary for size), resolutions and page chrome.
                         Reference.jsx is the ungated half: the function
                         tables, modes, paths and program index that make the
                         page usable as a reference and not only a walkthrough.
                         It is also the only part that prints.
  hooks/                 scroll progress, scroll spy, persistent state

public/                  copied verbatim into the build
  .nojekyll              stops GitHub Pages running the files through Jekyll
  assets/img/            photographs
  assets/img/aw/         handout 02's figures, built by tools/build-aw-assets.sh
  assets/file-io/        handout 03's sample programs and data files. Authored
                         for this handout: the originals were hosted on
                         workshopj.com, which no longer responds.

tools/
  build-aw-assets.sh     rebuilds handout 02's figures from original/
  smoke.sh, smoke.html   behavioural test for all three handouts, in real Chrome
  render-check.mjs       renders every page, step and modal without a browser
  check-steps.py         structural check on handout 03's step data
  check-readability.mjs  measures the prose a student actually reads, by
                         rendering each step and counting sentence length.
                         It enforces a BAND, 13 to 18 words, and fails in both
                         directions: the first draft was textbook prose at 18.1,
                         and the correction overshot to 8.8, which reads as a
                         quick-start guide rather than a university handout.
                         A tool that only detects one of the two failures is how
                         the second one shipped.
  check-density.py       measures how much of the handout is text and how much
                         teaches by showing. The page was once 10,948 words
                         carried by four figures, with twenty of twenty-four
                         steps having none. Its per-step rule matters more than
                         its word budget: a page can meet any total and still be
                         a wall of text if the figures are clustered.
  check-codeblocks.py    checks every code excerpt on the page against the real
                         program it names, including the line number it claims
                         to start at
  check-invariants.py    snapshots the verified material — every line of C,
                         every program output, every ftell offset, every
                         correct answer — so a prose edit can be proved to have
                         changed only prose. --save before, --diff after.

original/                the Craft exports the handouts were ported from
```

### Adding a page

1. Create `your-page.html` at the repo root, copying `index.html` and pointing the
   `<script>` at a new entry in `src/`.
2. Add it to the `input` map in `vite.config.js`.
3. Add a card for it in the `pages` array in `src/pages/Home.jsx`.
4. Add it to the `pages` prop of `SiteHeader` on the other pages, so the nav
   stays consistent across the site.

Every page gets the design system by importing `src/styles/site.css` and pulling
components from `src/components/ds/`. Nothing is page-specific except the content.

### Editing the GitHub handout

`src/pages/github-account/steps.jsx` holds the seven steps and
`resolutions.jsx` holds the panels behind each "Anticipated difficulty"
banner. Both carry markup rather than plain strings because the prose is
threaded with emphasis and links.

Note that a step's `fix` is not always its own number. Step 6 raises the
membership form's difficulty and step 7 raises the missing invitation's, and
those two panels are numbered the other way round; each resolution records a
`returnTo` so its "Return to step N" button sends the reader to the right
place. There is a check on this in the browser, not in code, so keep the two
files in step if you renumber anything.

A student's progress is held in `localStorage` under `lbyec2b-gh-guide`. It is
explicitly not submitted or graded, and the page says so.

### Editing the assignment workflow

Handout 02 is the largest thing on the site and the one with the most rules
attached, so they are worth stating plainly.

**The step total is never rendered.** The procedure is thirty steps. A reader
told that decides it is too long and closes the tab, so the page publishes
minutes instead and shows only stage-local counts — "3 of 7 in this stage". The
largest number it can display is 7, and `stages.jsx` exports `TOTAL_MINUTES`
with deliberately no `TOTAL_STEPS` beside it. The smoke test asserts this. If a
change makes a total appear anywhere, that is a bug, not a detail.

**Content lives in `src/pages/assignment-workflow/`:**

| File | What it holds |
|---|---|
| `stages.jsx` | the five stages, their minutes and their outcomes |
| `steps.jsx` | all thirty steps — action, body, figure, `why`, `check` |
| `resolutions.jsx` | the six modals, for failures that genuinely branch |
| `prereqs.jsx` | the four prerequisite rows |
| `os.jsx` | `<Os>` and `<Key>`, the Windows/Mac forks |

A step's `id` (`"S3.4"`) is its storage key and its `n` is what the reader sees.
They are separate so a stage can be reordered without orphaning anyone's saved
answers — change an `id` only if you mean to discard progress for that step.

Most things that go wrong belong inline in `check.alt`, where the reader already
is. Reserve `difficulty` + `fix` for failures where the right action depends on
which of several things happened; there are six of those out of thirty.

Progress is held in `localStorage` under `lbyec2b-aw`, on the device only, and
the page says so. Clearing it keeps the platform choice, which is a preference
rather than progress.

**Figures are deliberately small, and that is load-bearing.** They first shipped
at the full 1120px measure — wider than the text column and several times the
height of the instruction — and students read the pictures and skipped the
words. That is not inattention; it is an accurate reading of what the page was
emphasising, and the effect is sharper for readers who find dense text
expensive. So a figure is capped at 520px wide and 320px tall, framed with a
hairline instead of a gold band, and given a quiet caption, while the "Do this"
instruction is set at `--text-lg` and is the largest thing in the step. The
detail is still there — selecting any figure opens it full size — but a reader
has to ask, and by then they have passed the instruction. `tools/smoke.sh`
asserts the figure stays under 530px and sits below the instruction, because
this is exactly the kind of intent a later stylesheet edit undoes silently.

Enlarging is wired through `ZoomContext` in `src/components/figures/zoom.jsx`:
the workflow page supplies a handler and every `PinnedShot` on it becomes
enlargeable without its step data mentioning it. Handout 01 supplies nothing and
renders the plain image it always did.

**The recordings play on their own.** The four GIFs became muted, looping MP4s
with `autoplay`. Chrome and Safari hold muted autoplay video until it is
actually in the viewport and start it there, so a clip begins when the reader
reaches it and repeats until they move on — no observer, no play button, and
nothing running in a part of the page nobody is looking at. An
IntersectionObserver was tried first and removed: it duplicated what the browser
already does, and a false reading could only ever pause a clip the reader was
watching.

Readers with `prefers-reduced-motion: reduce` still get the still frame and a
play button. That setting belongs to people for whom movement genuinely
interferes with reading, and it is not a preference to trade against
convenience. `tools/smoke.sh` asserts the autoplay attributes rather than
playback itself — see the note in `tools/smoke.html` for why headless Chrome
cannot observe the latter.

**Rebuilding them.** `tools/build-aw-assets.sh` rebuilds every image from `original/`.
The crop rectangles live in that script, so a re-export can be reprocessed
identically; the table it prints at the end gives the post-crop dimensions that
`steps.jsx` must pass to `<PinnedShot width height>`. Cropping is not cosmetic —
the sources are full-desktop captures up to 3104px wide, and uncropped their
pins land on three-pixel targets on a phone. The pass takes 21 MB of PNG, TIFF
and looping GIF down to 1.1 MB of WebP and click-to-play video.

Some sources already carry the author's own red `[1] [2] [3]` annotations burnt
into the pixels. Those are cropped and left alone rather than double-annotated
with gold pins; the prose refers to the same numbers either way.

**One hard rule about the completion panel.** It is modal — it holds focus and
swallows clicks — so it must never be able to render invisibly. Its entrance
animates `transform` only and never `opacity`, because anything fading in from
zero can rest at zero: a frame callback that does not fire, a paused animation
in a non-rendered frame, a fill-mode holding the first keyframe. Two of those
happened during the build. Do not reintroduce a fade here.

## Testing

```bash
./tools/smoke.sh          # build, serve, drive both handouts, tear down
./tools/smoke.sh --dev    # against an already-running `npm run dev`
```

`tools/smoke.html` loads the real pages in an iframe and asserts on what a
reader would see: it walks all thirty steps of handout 02, checks every stage
completion panel is visible rather than merely present, exercises an
alternative-answer branch and its recovery, reloads to confirm persistence,
opens and escapes a resolution modal, and re-checks handout 01 for regressions
from the shared components. It found two real bugs on the way in, so it is
worth running after touching either handout.

It needs Google Chrome; override the path with `CHROME=…` if yours is elsewhere.

### Editing course content

Almost everything on the course page is data, not markup. To change a week, a
learning outcome, a rubric descriptor, a policy or a reference, edit
`src/data/course.js` — the page rebuilds itself around it. The assessment
weights in `components` drive both the grading bars and the standing
calculator, so the two cannot drift apart.

## Deployment

Pushing to `main` triggers `.github/workflows/deploy.yml`, which builds the site
and publishes `dist/` to GitHub Pages.

**One-time setup:** in the repository, go to **Settings → Pages → Build and
deployment** and set **Source** to **GitHub Actions**. Until that is set the
workflow builds but has nowhere to publish.

`vite.config.js` sets `base: "./"`, so the build works both at a user site
(`username.github.io`) and at a project site (`username.github.io/repo-name`)
without any repo-name configuration.

## Known gaps

- **The two photographs on the course page are missing.** `src/pages/course-overview/Gallery.jsx`
  expects `public/assets/img/lab-session.jpeg` and
  `public/assets/img/project-team.jpeg`. They could not be exported from the
  Claude Design project because a single design-system file read is capped at
  256 KiB and both images exceed it. Until the files are added, each frame
  shows a labelled placeholder naming the path it wants; drop the JPEGs in and
  they appear automatically, no code change needed.
- **The mobile layout has been measured, not handled.** `tools/smoke.sh` checks
  that handout 02 does not overflow horizontally at 360px, and the responsive
  rules in `src/styles/site.css` were confirmed to match. Nothing has been seen
  on a real phone. Worth a look before sharing the link with students.
- **Handout 02's screenshots are all macOS, under one student's username.** The
  Windows/Mac toggle switches the prose only, so a Windows reader sees a macOS
  title bar throughout stages 2 to 4. The toggle may over-promise that the
  images adapt too.
- **Handout 02 is written against the first assignment**, so `ex1.c` and the
  `welcome-` repository name are hardcoded. Both will read as wrong from the
  second assignment onward. The five stages themselves do not change.
- **Two items in handout 02 need the instructor's confirmation before it is
  shared.** The source document gives two different URLs for the organisation
  membership form (`forms.gle/62vVyyMWzkLedn6a8` and the Craft page); the Craft
  one is used. And the Stage 5 red-cross resolution says to ask the instructor,
  because the "Understanding your submission status" page it should link to does
  not exist yet.

## Provenance and typography

The design comes from the "DLSU Design System" Claude Design project. The token
layer under `src/styles/dlsu/` and the components under `src/components/ds/`
were ported from it directly.

The Institutional Identification Manual specifies ITC Galliard for the logotype
and Futura Bold for the seal lettering. Both are licensed foundry faces and are
not bundled here; **EB Garamond** and **Jost** stand in for them and are loaded
from Google Fonts in each page's `<head>`. Swap in the licensed files when they
are available — the font stacks already list the real faces first.

Course content is drawn from the revised LBYEC2B syllabus, which governs where
the two differ.
