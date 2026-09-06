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

src/
  data/course.js         ALL course content: weeks, outcomes, rubrics, policies, references
  styles/
    dlsu/                the design system's token layer (colours, type, spacing, elevation, motion)
    site.css             site-wide utilities and the responsive rules
  components/
    ds/                  design-system components (Button, Card, Tabs, Tag, Badge)
    SiteHeader/Footer    chrome shared by every page
    Section.jsx          the section shell and heading
    Brand.jsx            the wordmark and course mark
  pages/
    course-overview/     one file per section of the course page
  hooks/                 scroll progress, scroll spy, persistent state

public/                  copied verbatim into the build
  .nojekyll              stops GitHub Pages running the files through Jekyll
  assets/img/            photographs
```

### Adding a page

1. Create `your-page.html` at the repo root, copying `index.html` and pointing the
   `<script>` at a new entry in `src/`.
2. Add it to the `input` map in `vite.config.js`.
3. Add a card for it in the `pages` array in `src/pages/Home.jsx`.

Every page gets the design system by importing `src/styles/site.css` and pulling
components from `src/components/ds/`. Nothing is page-specific except the content.

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

- **The two photographs are missing.** `src/pages/course-overview/Gallery.jsx`
  expects `public/assets/img/lab-session.jpeg` and
  `public/assets/img/project-team.jpeg`. They could not be exported from the
  Claude Design project because a single design-system file read is capped at
  256 KiB and both images exceed it. Until the files are added, each frame
  shows a labelled placeholder naming the path it wants; drop the JPEGs in and
  they appear automatically, no code change needed.
- **The mobile layout has not been verified on a real narrow viewport.** The
  responsive rules in `src/styles/site.css` were written and their selectors
  confirmed to match, but the browser used for checking was pinned at 1920px
  wide. Worth a look on a phone before sharing the link with students.

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
