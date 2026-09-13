import React from "react";
import { Figure, PinnedShot, Clip, Compare } from "../../components/figures/index.js";
import { Key, Os } from "./os.jsx";

/* The procedure, one action per step.

   The source document numbered its instructions in fives and sixes — "open the
   palette, type the angle bracket, type git clone, choose it, paste, choose
   Clone from URL" was a single numbered item. That is six places to lose your
   footing with no checkpoint between any of them, so each has been split out.
   Thirty steps is more than the source appeared to have; it is the same work,
   counted honestly, and the page never shows the total.

   Fields:
     id      stable storage key. Answers are stored against this, so a step can
             be renumbered or moved without orphaning a reader's progress.
     n       position within the stage. The only number ever displayed.
     app     which application the reader should be in.
     action  the single imperative. Rendered in the green "Required action" rule.
     body    what to look at, what it means. Optional.
     why     background, collapsed by default — never needed to proceed.
     check   the checkpoint. Two outcomes, equal weight, `ok` always reachable.
     fix     id into resolutions.jsx, for the few failures that genuinely branch.

   Prose is JSX rather than strings because nearly every line carries emphasis,
   a code span, a link or an OS fork. */

const IMG = "assets/img/aw";   // relative: vite.config.js sets base to "./"

const list = { margin: "18px 0 0", paddingLeft: 20, display: "grid", gap: 8 };

export const steps = [
  /* ─────────────────────────────────────────────────────────────────────────
     Stage 1 — Obtaining your repository
     ───────────────────────────────────────────────────────────────────────── */
  {
    id: "S1.1",
    stage: 1, n: 1, app: "canvas",
    title: "Open today's assignment in Canvas",
    action: <>Sign in to <a className="dls-link-quiet" href="https://dlsu.instructure.com" target="_blank" rel="noreferrer">dlsu.instructure.com</a> and open the assignment for this session.</>,
    body: (
      <p className="aw-p">
        For the first one, it is called <strong>Submitting your first assignment</strong>.
        Everything in this stage starts from that page, so leave it open — Stage 5
        brings you back to it.
      </p>
    ),
    check: {
      question: "Are you looking at the assignment page for this session?",
      ok: { label: "Yes, the assignment page is open", note: "Good. The link you need is on it." },
      alt: {
        label: "I cannot find today's assignment",
        note: <>Check that you are in the right course, and look under <strong>Assignments</strong> in the course menu rather than the dashboard. If it is genuinely not there it may not be published yet — ask your instructor before going further, because the link in the next step is what issues your repository.</>
      }
    }
  },
  {
    id: "S1.2",
    stage: 1, n: 2, app: "canvas",
    title: "Select the assignment link",
    action: <>On that page, select the link labelled <strong>Assignment Link</strong>.</>,
    body: (
      <p className="aw-p">
        It is the first bullet, circled below. It sends you to GitHub Classroom.
        Ignore the deliverable note underneath for now — you come back for that
        in Stage 5.
      </p>
    ),
    figure: (
      <Figure caption="Figure 1.1 · The assignment page in Canvas">
        <PinnedShot src={`${IMG}/s1-canvas-link.webp`} width={1400} height={494}
          alt="A Canvas assignment page headed 'Submitting your first assignment'. The first bullet, an 'Assignment Link', is circled in red." />
      </Figure>
    ),
    check: {
      question: "Where did the link take you?",
      ok: { label: "To a GitHub page asking me to authorise something", note: "That is GitHub Classroom. Continue." },
      alt: {
        label: "Somewhere else, or nothing happened",
        note: <>If a GitHub sign-in page appeared instead, sign in with the account you registered for this course and the authorisation page will follow. If nothing opened at all, the link may have been blocked as a pop-up — allow it and select the link again.</>
      }
    }
  },
  {
    id: "S1.3",
    stage: 1, n: 3, app: "browser",
    title: "Authorise GitHub Classroom",
    action: <>Select the green <strong>Authorize github</strong> button.</>,
    body: (
      <p className="aw-p">
        Check the line above it first: it should name <em>your</em> GitHub
        username. This is what lets Classroom create a repository on your behalf
        and tell your instructor it is yours.
      </p>
    ),
    figure: (
      <Figure caption="Figure 1.2 · The authorisation page">
        <PinnedShot src={`${IMG}/s1-authorize.webp`} width={545} height={460}
          alt="The GitHub Classroom authorisation card, listing the permissions requested, with a green Authorize github button."
          pins={[{ n: 1, left: "49%", top: "75%" }]} />
      </Figure>
    ),
    why: {
      label: "What am I agreeing to?",
      body: <>Read-only access to your public repositories, your email address, and the ability to accept repository invitations for you. It cannot read your private work outside this course, and you can withdraw it later from your GitHub settings.</>
    },
    check: {
      question: "Does the page name your own GitHub username?",
      ok: { label: "Yes, and I have authorised it", note: "Authorised. Next you identify yourself to the class roster." },
      alt: {
        label: "It shows somebody else's username",
        note: <>You are signed in to GitHub as a different account — a shared machine will do this. Sign out of GitHub in this browser, sign in as yourself, then open the assignment link from Canvas again.</>
      }
    }
  },
  {
    id: "S1.4",
    stage: 1, n: 4, app: "browser",
    title: "Find your name on the roster",
    action: <>Find your own name in the <strong>Identifiers</strong> list and select it.</>,
    body: (
      <p className="aw-p">
        This joins your GitHub account to your place on the class list, so marks
        reach the right person. Check the heading above the list first — it names
        the course and section you are about to join.
      </p>
    ),
    figure: (
      <Figure caption="Figure 1.3 · The class roster">
        <PinnedShot src={`${IMG}/s1-roster.webp`} width={645} height={470}
          alt="A GitHub Classroom page headed 'Join the classroom', with an Identifiers list beneath it containing student names."
          pins={[{ n: 1, left: "50%", top: "83%" }]} />
      </Figure>
    ),
    difficulty: "Your name is not on the list",
    fix: 1,
    check: {
      question: "Did you find your name and select it?",
      ok: { label: "Yes, I selected my name", note: "You are on the roster. Now to claim the assignment itself." },
      alt: {
        label: "My name is not there",
        note: <>This happens when the membership form has not been processed yet, and it has a way round it — open the resolution above for the full procedure. In short: use <strong>Skip to the next step</strong>, then tell your instructor.</>
      }
    }
  },
  {
    id: "S1.5",
    stage: 1, n: 5, app: "browser",
    title: "Accept the assignment",
    action: <>Select <strong>Accept this assignment</strong>.</>,
    body: (
      <p className="aw-p">
        The page names the repository it is about to make for you. It will read{" "}
        <code className="aw-code">welcome-<em>yourusername</em></code> — your
        classmates each get their own.
      </p>
    ),
    figure: (
      <Figure caption="Figure 1.4 · Accepting the assignment">
        <PinnedShot src={`${IMG}/s1-accept.webp`} width={1300} height={760}
          alt="A GitHub Classroom page headed 'Accept the assignment — Welcome', naming the repository to be created, with a green 'Accept this assignment' button."
          pins={[{ n: 1, left: "81%", top: "85%" }]} />
      </Figure>
    ),
    check: {
      question: "What happened after you selected it?",
      ok: { label: "A page saying my repository is being configured", note: "GitHub is building your copy now." },
      alt: {
        label: "An error, or the button did nothing",
        note: <>Reload the page and try once more. If it reports that you have already accepted, that is fine — the repository exists and you can go straight on to the next step.</>
      }
    }
  },
  {
    id: "S1.6",
    stage: 1, n: 6, app: "browser",
    title: "Refresh while GitHub builds it",
    action: <>Wait a few seconds, then refresh the page.</>,
    body: (
      <p className="aw-p">
        Copying the exercise into a repository of your own takes a moment, and
        the page does not update itself. Refresh until the wording changes.
      </p>
    ),
    figure: (
      <Figure caption="Figure 1.5 · Still being configured">
        <PinnedShot src={`${IMG}/s1-configuring.webp`} width={1310} height={650}
          alt="A GitHub Classroom page reading 'You accepted the assignment, Welcome. We're configuring your repository now. This may take a few minutes to complete. Refresh this page to see updates.'" />
      </Figure>
    ),
    why: {
      label: "Why does this take a moment?",
      body: <>GitHub is copying a template repository, applying your username to it, and setting the permissions so that only you and your instructors can see it. The email invitation you may receive to join the organisation needs no action — accepting the assignment already did that.</>
    },
    check: {
      question: "What does the page say now?",
      ok: { label: "“You're ready to go!” with a repository link", note: "Your repository exists. One step left in this stage." },
      alt: {
        label: "Still “We're configuring your repository”",
        note: <>Give it another thirty seconds and refresh again. A first assignment for a large section can take a minute or two. If it has not changed after five minutes, tell your instructor rather than accepting a second time.</>
      }
    }
  },
  {
    id: "S1.7",
    stage: 1, n: 7, app: "browser",
    title: "Open your new repository",
    action: <>Select the repository link the page now shows.</>,
    body: (
      <p className="aw-p">
        It is unique to you. Keep this tab open — Stages 3 and 5 both come back
        to it, and Stage 2 starts by copying its address.
      </p>
    ),
    figure: (
      <>
        <Figure caption="Figure 1.6 · Your repository has been created">
          <PinnedShot src={`${IMG}/s1-repo-link.webp`} width={1350} height={660}
            alt="A GitHub Classroom page reading 'You're ready to go!' with the address of the newly created assignment repository beneath it."
            pins={[{ n: 1, left: "46%", top: "62%" }]} />
        </Figure>
        <Figure caption="Figure 1.7 · Where that link lands"
          note="Your repository, on GitHub. The file list is the exercise as it was given to you.">
          <PinnedShot src={`${IMG}/s1-repo-view.webp`} width={1400} height={714}
            alt="A GitHub repository page for welcome-johnanthonyjose2005, listing .github, .vscode, assets, tests, .gitignore, README.md and ex1.c."
            pins={[{ n: 1, left: "52%", top: "5%" }, { n: 2, left: "15%", top: "92%" }]} />
        </Figure>
      </>
    ),
    check: {
      question: "Are you now looking at a repository page listing files, including ex1.c?",
      ok: { label: "Yes, I can see ex1.c in the file list", note: "That is your repository. Stage 1 is done." },
      alt: {
        label: "I see a 404, or the page will not load",
        note: <>A 404 from GitHub usually means you are signed in as a different account in this tab than the one you authorised. Check the avatar at the top right, sign in as yourself, and open the link again.</>
      }
    }
  },

  /* ─────────────────────────────────────────────────────────────────────────
     Stage 2 — Cloning to your computer
     ───────────────────────────────────────────────────────────────────────── */
  {
    id: "S2.1",
    stage: 2, n: 1, app: "github",
    title: "Copy your repository address",
    action: <>Select the green <strong>Code</strong> button, make sure <strong>HTTPS</strong> is chosen, then use the copy icon.</>,
    body: (
      <ul style={list} className="aw-p">
        <li><strong>[1]</strong> The green <strong>Code</strong> button, above the file list on the right.</li>
        <li><strong>[2]</strong> <strong>HTTPS</strong> — the first of the three words under "Clone". It must be this one.</li>
        <li><strong>[3]</strong> The copy icon at the right of the address.</li>
      </ul>
    ),
    figure: (
      <Figure caption="Figure 2.1 · Copying the address" note="Use the copy icon rather than selecting the text — the field is cut off, and a partial address fails confusingly.">
        <PinnedShot src={`${IMG}/s2-copy-url.webp`} width={1010} height={780}
          alt="The GitHub Code dropdown, with the Code button marked 1, the HTTPS tab marked 2, and the copy icon marked 3." />
      </Figure>
    ),
    difficulty: "The panel offers SSH, or the address does not start with https",
    fix: 2,
    check: {
      question: "What does the copied address begin with?",
      ok: { label: "https://github.com/…", note: "Copied. Now over to VS Code." },
      alt: {
        label: "git@github.com, or I am not sure",
        note: <>That is the SSH form, which needs a key you have not set up. Open the <strong>Code</strong> panel again and choose <strong>HTTPS</strong> first — the resolution above has the detail.</>
      }
    }
  },
  {
    id: "S2.2",
    stage: 2, n: 2, app: "vscode",
    title: "Open the command palette and find Git: Clone",
    action: <>In VS Code, select the search box at the top, type <code className="aw-code">&gt;</code>, then type <code className="aw-code">git clone</code> and choose <strong>Git: Clone</strong>.</>,
    body: (
      <p className="aw-p">
        The leading <code className="aw-code">&gt;</code> is what turns the search
        box into a command palette. Without it the box looks for files and no
        command will ever appear. <Key win="Ctrl + Shift + P" mac="⇧ ⌘ P" /> opens
        it directly with the angle bracket already in place.
      </p>
    ),
    figure: (
      <Clip src={`${IMG}/s2-clone-palette.mp4`} poster={`${IMG}/s2-clone-palette.webp`}
        width={640} height={248} caption="Figure 2.2 · Finding Git: Clone in the command palette" />
    ),
    difficulty: "There is no “Git: Clone” in the list",
    fix: 3,
    check: {
      question: "Is “Git: Clone” showing in the list?",
      ok: { label: "Yes, I can see it", note: "Choose it, and VS Code will ask for the address." },
      alt: {
        label: "Nothing matching appears",
        note: <>Almost always one of two things: the leading <code className="aw-code">&gt;</code> is missing, or Git is not installed. Check the angle bracket first, since it costs nothing — then open the resolution above.</>
      }
    }
  },
  {
    id: "S2.3",
    stage: 2, n: 3, app: "vscode",
    title: "Paste your address",
    action: <>Press <Key win="Ctrl + V" mac="⌘ V" /> to paste the address, then choose <strong>Clone from URL</strong>.</>,
    body: (
      <p className="aw-p">
        VS Code offers <strong>Clone from URL</strong> as the first entry once
        something is pasted. If the box is empty, go back to Stage 2 step 1 and
        copy the address again — a clipboard does not always survive a switch
        between applications.
      </p>
    ),
    check: {
      question: "Did a folder chooser open?",
      ok: { label: "Yes, it is asking me where to put it", note: "That is the next step." },
      alt: {
        label: "It reported an error instead",
        note: <>Read the address in the box carefully. A truncated address, or one beginning <code className="aw-code">git@</code>, fails here. Copy it again using the copy icon on GitHub rather than by selecting the text.</>
      }
    }
  },
  {
    id: "S2.4",
    stage: 2, n: 4, app: "vscode",
    title: "Choose where to keep it",
    action: <>Choose a folder, then select <strong>Select as Repository Destination</strong>.</>,
    body: (
      <p className="aw-p">
        Pick somewhere you will find again and use the same place all term — a
        folder such as <code className="aw-code">Documents ▸ LBYEC2B ▸ activities</code> works
        well. VS Code makes a new folder inside it named after the repository, so
        you do not need to make one yourself.
      </p>
    ),
    figure: (
      <Clip src={`${IMG}/s2-destination.mp4`} poster={`${IMG}/s2-destination.webp`}
        width={640} height={378} caption="Figure 2.3 · Choosing the destination folder" />
    ),
    why: {
      label: "Why not the Desktop or Downloads?",
      body: <>Both work, but Downloads is routinely emptied and a crowded Desktop makes the folder hard to find again in week six. You will clone one of these for every assignment this term, so they are worth keeping together.</>
    },
    check: {
      question: "What happened after you chose the folder?",
      ok: { label: "It started cloning, or asked me to sign in to GitHub", note: "Both are normal. The sign-in is the next step." },
      alt: {
        label: "It refused to write there",
        note: <>Some folders are protected by the operating system. Choose somewhere inside your own Documents folder instead and try again.</>
      }
    }
  },
  {
    id: "S2.5",
    stage: 2, n: 5, app: "vscode",
    title: "Sign in to GitHub, if you are asked",
    action: <>If a <strong>GitHub Sign in</strong> window appears, choose <strong>Sign in with your browser</strong> and accept each prompt that follows.</>,
    body: (
      <p className="aw-p">
        This step is conditional. VS Code only asks the first time it needs to
        reach a private repository on a given machine — if you have done this
        before, nothing will appear and there is nothing to do.
      </p>
    ),
    figure: (
      <Figure caption="Figure 2.4 · The sign-in window, if it appears">
        <PinnedShot src={`${IMG}/s2-signin.webp`} width={855} height={676}
          alt="A GitHub Sign in window with two buttons: 'Sign in with your browser' and 'Sign in with a code'."
          pins={[{ n: 1, left: "50%", top: "56%" }]} />
      </Figure>
    ),
    difficulty: "The sign-in never finishes, or it keeps asking",
    fix: 4,
    check: {
      question: "Where have you got to?",
      ok: { label: "Signed in — or it never asked me", note: "Either way you are through. Both are correct." },
      alt: {
        label: "It keeps asking, or the browser never came back",
        note: <>Sign in to GitHub in your browser as the account you registered for this course, then try once more. If the hand-back keeps failing, <strong>Sign in with a code</strong> avoids it entirely — the resolution above has both routes.</>
      }
    }
  },
  {
    id: "S2.6",
    stage: 2, n: 6, app: "vscode",
    title: "Open the cloned repository",
    action: <>When VS Code asks whether to open it, select <strong>Open</strong>.</>,
    body: (
      <p className="aw-p">
        If you miss the prompt, nothing is lost — the folder is on disk. Use{" "}
        <strong>File ▸ Open Folder</strong> and choose the folder you picked in
        the previous step.
      </p>
    ),
    figure: (
      <Figure caption="Figure 2.5 · The prompt to open it">
        <PinnedShot src={`${IMG}/s2-open.webp`} width={535} height={556}
          alt="A VS Code dialog asking 'Would you like to open the cloned repository?' with Open, Open in New Window and Cancel buttons."
          pins={[{ n: 1, left: "50%", top: "61%" }]} />
      </Figure>
    ),
    check: {
      question: "Does the VS Code title bar now show your repository name?",
      ok: { label: "Yes, it shows welcome- and my username", note: "Almost there. One confirmation left." },
      alt: {
        label: "No, it still shows something else",
        note: <>The window is still on a previous project. Use <strong>File ▸ Open Folder</strong> and choose the folder you cloned into — look for a folder named after the repository.</>
      }
    }
  },
  {
    id: "S2.7",
    stage: 2, n: 7, app: "vscode",
    title: "Confirm the files arrived",
    action: <>Select the <strong>Explorer</strong> icon at the top of the left rail and check that <code className="aw-code">ex1.c</code> is listed.</>,
    body: (
      <ul style={list} className="aw-p">
        <li><strong>[1]</strong> The Explorer icon — the top one in the narrow rail down the left.</li>
        <li><strong>[2]</strong> Your files. There should be <code className="aw-code">ex1.c</code>, a <code className="aw-code">README.md</code>, and a <code className="aw-code">.github</code> folder.</li>
      </ul>
    ),
    figure: (
      <Figure caption="Figure 2.6 · The files, on your own machine">
        <PinnedShot src={`${IMG}/s2-files.webp`} width={850} height={800}
          alt="The VS Code Explorer panel, with the Explorer icon marked 1 and the file list — .github, ex1.c and README.md — marked 2." />
      </Figure>
    ),
    check: {
      question: "Can you see ex1.c in the list?",
      ok: { label: "Yes, ex1.c is there", note: "The repository is on your machine. Stage 2 is done." },
      alt: {
        label: "The panel is empty, or ex1.c is missing",
        note: <>An empty Explorer means no folder is open — use <strong>File ▸ Open Folder</strong>. If the folder is open but nearly empty, the clone was interrupted; delete the folder and work through this stage again from step 2.</>
      }
    }
  },

  /* ─────────────────────────────────────────────────────────────────────────
     Stage 3 — Completing the exercise
     ───────────────────────────────────────────────────────────────────────── */
  {
    id: "S3.1",
    stage: 3, n: 1, app: "github",
    title: "Read what the exercise asks for",
    action: <>Go back to your repository in the browser and scroll down to the README beneath the file list.</>,
    body: (
      <ul style={list} className="aw-p">
        <li><strong>[1]</strong> The title, so you can confirm you are on the right assignment.</li>
        <li><strong>[2]</strong> What to do, and which file to write it in — here, <code className="aw-code">ex1.c</code>.</li>
        <li><strong>[3]</strong> A table of test input against expected output. This is the specification. Stage 5 marks you against exactly this.</li>
      </ul>
    ),
    figure: (
      <Figure caption="Figure 3.1 · The exercise specification">
        <PinnedShot src={`${IMG}/s3-readme.webp`} width={1400} height={550}
          alt="A repository README showing the assignment title marked 1, the problem description marked 2, and a table of test input and expected console output marked 3." />
      </Figure>
    ),
    why: {
      label: "Read the table before you write anything",
      body: <>The expected output is matched literally, including the prompt text and your own typed input. Writing code that solves the problem but prints something slightly different is the single most common reason a correct answer is marked wrong.</>
    },
    check: {
      question: "Can you see the table of test input and expected output?",
      ok: { label: "Yes, I have read it", note: "Now open the file you will be writing in." },
      alt: {
        label: "There is no README below the files",
        note: <>Make sure you are on the repository's main page rather than inside a folder — select the repository name at the top to go back. If there is genuinely no README, tell your instructor: the specification is missing.</>
      }
    }
  },
  {
    id: "S3.2",
    stage: 3, n: 2, app: "vscode",
    title: "Open ex1.c",
    action: <>In VS Code's Explorer, select <code className="aw-code">ex1.c</code>.</>,
    body: (
      <p className="aw-p">
        Check the tab that opens actually reads <code className="aw-code">ex1.c</code>.
        It is easy to open the README by mistake, and easier still not to notice.
      </p>
    ),
    figure: (
      <Figure caption="Figure 3.2 · ex1.c open in the editor">
        <PinnedShot src={`${IMG}/s3-open-ex1.webp`} width={1400} height={630}
          alt="VS Code with ex1.c open, the Explorer icon marked 1 and the ex1.c entry in the file list marked 2." />
      </Figure>
    ),
    why: {
      label: "Never rename this file",
      body: <>The marking runs against a file called <code className="aw-code">ex1.c</code>. Renaming it, or making your own copy alongside it, means the marking finds nothing and reports a failure however good the code is.</>
    },
    check: {
      question: "Does the open tab read ex1.c?",
      ok: { label: "Yes, ex1.c is open", note: "Good. Now to make the code live." },
      alt: {
        label: "A different file is open",
        note: <>Select <code className="aw-code">ex1.c</code> in the Explorer on the left. You can close the other tab, or leave it — only the one you are editing matters.</>
      }
    }
  },
  {
    id: "S3.3",
    stage: 3, n: 3, app: "vscode",
    title: "Remove the comment marks",
    action: <>Delete the <code className="aw-code">//</code> at the start of each commented line.</>,
    body: (
      <p className="aw-p">
        For this first assignment the answer is already written for you — it is
        simply commented out, which means C ignores it. Removing the{" "}
        <code className="aw-code">//</code> marks turns it back into code. You
        will know it worked when the lines pick up colour.
      </p>
    ),
    figure: (
      <Figure caption="Figure 3.3 · The code, uncommented">
        <PinnedShot src={`${IMG}/s3-uncomment.webp`} width={1400} height={696}
          alt="VS Code showing ex1.c with the comment marks removed, the code now syntax-coloured, and an unsaved-changes dot on the tab."
          pins={[{ n: 1, left: "62%", top: "15%" }, { n: 2, left: "72%", top: "61%" }]} />
      </Figure>
    ),
    why: {
      label: "What the two marks mean",
      body: <><strong>[1]</strong> is a solid white dot on the tab: this file has changes you have not saved. <strong>[2]</strong> is the code itself, now coloured because the editor is reading it as C rather than as a comment. Later assignments will not be pre-written — this one exists to teach the workflow, not the programming.</>
    },
    check: {
      question: "Is the code coloured now, rather than all one flat colour?",
      ok: { label: "Yes, it is syntax-coloured", note: "The code is live. Save it next." },
      alt: {
        label: "It is still all the same colour",
        note: <>Some <code className="aw-code">//</code> marks are still in place. Check every line inside <code className="aw-code">main</code> — there are several, and it is easy to leave the last one.</>
      }
    }
  },
  {
    id: "S3.4",
    stage: 3, n: 4, app: "vscode",
    title: "Save the file",
    action: <>Press <Key win="Ctrl + S" mac="⌘ S" />.</>,
    body: (
      <ul style={list} className="aw-p">
        <li>The white dot on the tab becomes an <strong>×</strong>. That means saved.</li>
        <li>An orange <strong>M</strong> appears next to the filename. That means <em>modified</em> — Git has noticed the file differs from what it gave you.</li>
        <li>Blue marks appear down the left margin, one for each line you changed.</li>
      </ul>
    ),
    figure: (
      <Figure caption="Figure 3.4 · Saved, and marked as modified">
        <PinnedShot src={`${IMG}/s3-save.webp`} width={1400} height={530}
          alt="VS Code after saving ex1.c: the tab shows an M and a close cross, the file list shows an orange M, and blue change marks run down the editor gutter." />
      </Figure>
    ),
    why: {
      label: "Why the M matters",
      body: <>That <strong>M</strong> is Git noticing you. Stage 4 is nothing more than turning it into an upload, so if you never see one, nothing will ever reach GitHub.</>
    },
    check: {
      question: "Look at the tab for ex1.c. What is beside the filename?",
      ok: { label: "An × and an orange M", note: "Saved and tracked. Now run it." },
      alt: {
        label: "Still a solid white dot",
        note: <>The save did not land. Select somewhere inside the editor so it has focus, then press <Key win="Ctrl + S" mac="⌘ S" /> again — and then choose the first answer above.</>
      }
    }
  },
  {
    id: "S3.5",
    stage: 3, n: 5, app: "vscode",
    title: "Run it",
    action: <>At the top right of the editor, select the chevron beside the play icon, then <strong>Run Code</strong>.</>,
    body: (
      <ul style={list} className="aw-p">
        <li><strong>[1]</strong> The small chevron next to the play triangle.</li>
        <li><strong>[2]</strong> <strong>Run Code</strong> in the menu that drops down.</li>
      </ul>
    ),
    figure: (
      <Figure caption="Figure 3.5 · The run menu, at the top right of the editor">
        <PinnedShot src={`${IMG}/s3-run-menu.webp`} width={1400} height={294}
          alt="The top right of the VS Code editor, with the chevron beside the play icon marked 1 and the Run Code entry in the open menu marked 2." />
      </Figure>
    ),
    difficulty: "There is no “Run Code” in that menu",
    fix: 5,
    check: {
      question: "What does the terminal at the bottom show?",
      ok: {
        label: "It is waiting, showing “Enter number:”",
        note: "Your program compiled and is running. Now test it properly."
      },
      alt: {
        label: "Errors, or the terminal never opened",
        note: <>Read the first error only — the rest are usually consequences of it. A missing semicolon or a stray <code className="aw-code">/</code> left over from the previous step accounts for most of them. Fix, save, and run again.</>,
        figure: (
          <Figure caption="For reference · a successful run">
            <PinnedShot src={`${IMG}/s3-run-prompt.webp`} width={1400} height={268}
              alt="The VS Code terminal showing the compile command followed by the prompt 'Enter number:' waiting for input." />
          </Figure>
        )
      }
    }
  },
  {
    id: "S3.6",
    stage: 3, n: 6, app: "vscode",
    title: "Test every row of the table",
    action: <>Type the test input from the specification, press Enter, and compare what you get against the expected output.</>,
    body: (
      <>
        <p className="aw-p">
          For this assignment the table has one row. Later ones have several, and
          every row has to be checked — passing the first proves very little.
        </p>
        <table className="aw-table">
          <thead>
            <tr><th>Test input</th><th>Expected console output</th></tr>
          </thead>
          <tbody>
            <tr>
              <td><code className="aw-code">2</code></td>
              <td><code className="aw-code">Enter number: 2<br />Hello World 2!</code></td>
            </tr>
          </tbody>
        </table>
        <p className="aw-p">
          Note that the expected output includes <em>your own typed input</em>.
          It is everything that ends up on the console, not only what the program
          prints.
        </p>
      </>
    ),
    figure: (
      <Figure caption="Figure 3.6 · Testing against the table">
        <PinnedShot src={`${IMG}/s3-test.webp`} width={1400} height={528}
          alt="The VS Code terminal after typing 2, showing 'Enter number: 2' and 'Hello World 2!' with annotations marking the typed input and the expected console output." />
      </Figure>
    ),
    check: {
      question: "Does your output match the table exactly — spacing, capitals and punctuation?",
      ok: { label: "Yes, character for character", note: "The exercise is complete. Stage 3 is done." },
      alt: {
        label: "Close, but not identical",
        note: <>Close is not enough — the marking compares literally. Check capitals, the space after the colon, and the exclamation mark. Change the <code className="aw-code">printf</code> to match the table exactly, save, and run it again.</>
      }
    }
  },

  /* ─────────────────────────────────────────────────────────────────────────
     Stage 4 — Committing and uploading
     ───────────────────────────────────────────────────────────────────────── */
  {
    id: "S4.1",
    stage: 4, n: 1, app: "vscode",
    title: "Save everything",
    action: <>Press <Key win="Ctrl + S" mac="⌘ S" /> once more, and check for the orange <strong>M</strong>.</>,
    body: (
      <p className="aw-p">
        An unsaved change cannot be uploaded — it only exists in the editor. The{" "}
        <strong>M</strong> beside each file you have changed is your evidence
        that it reached the disk.
      </p>
    ),
    figure: (
      <Figure caption="Figure 4.1 · Saved changes, ready to upload" note="The same view as Figure 3.4. This time what matters is the M in the file list on the left.">
        <PinnedShot src={`${IMG}/s3-save.webp`} width={1400} height={530}
          alt="VS Code with ex1.c saved: an orange M beside the filename in the Explorer and on the editor tab." />
      </Figure>
    ),
    check: {
      question: "Is there an orange M next to ex1.c in the file list?",
      ok: { label: "Yes, I can see the M", note: "Everything is saved. Now review what you are about to send." },
      alt: {
        label: "There is no M anywhere",
        note: <>No <strong>M</strong> means Git sees no difference between your file and the one you were given — so either the changes were never saved, or you are looking at a different folder. Go back to Stage 3 and check the file has your uncommented code in it.</>
      }
    }
  },
  {
    id: "S4.2",
    stage: 4, n: 2, app: "vscode",
    title: "Review what you changed",
    action: <>Select the <strong>Source Control</strong> icon in the left rail, then select <code className="aw-code">ex1.c</code>.</>,
    body: (
      <ul style={list} className="aw-p">
        <li><strong>[1]</strong> Source Control — the branching icon, third down the left rail.</li>
        <li><strong>[2]</strong> <code className="aw-code">ex1.c</code> under <strong>Changes</strong>.</li>
        <li><strong>[3]</strong> The comparison. On the left is what GitHub currently has; on the right is what you are about to send. Red lines are going away, green lines are arriving.</li>
      </ul>
    ),
    figure: (
      <Figure caption="Figure 4.2 · Comparing your version against GitHub's">
        <PinnedShot src={`${IMG}/s4-review.webp`} width={1400} height={556}
          alt="VS Code's Source Control view showing a side-by-side comparison of ex1.c, the previous version on the left and the current version on the right, with change markers." />
      </Figure>
    ),
    why: {
      label: "Why bother looking?",
      body: <>This is the last point at which a mistake is cheap. Deleting a line by accident is invisible in the editor and obvious here, and once it is on GitHub it has been marked. It takes five seconds.</>
    },
    check: {
      question: "Does the comparison show only the changes you meant to make?",
      ok: { label: "Yes, that is what I changed", note: "Good. Now tell Git to include it." },
      alt: {
        label: "There are changes I do not recognise",
        note: <>Look at the red lines. If something you meant to keep is being removed, put it back in the editor and save before going on — the comparison updates as you type.</>
      }
    }
  },
  {
    id: "S4.3",
    stage: 4, n: 3, app: "vscode",
    title: "Add the file to the commit",
    action: <>Select the <strong>+</strong> beside <code className="aw-code">ex1.c</code>.</>,
    body: (
      <p className="aw-p">
        Marked <strong>[4]</strong> in the figure above. This says "include this
        one" — Git uploads only what you have added, which is what lets you
        commit some changes and not others.
      </p>
    ),
    check: {
      question: "Where is ex1.c listed now?",
      ok: { label: "Under “Staged Changes”", note: "It is in. Now describe it." },
      alt: {
        label: "Still under “Changes”",
        note: <>Hover over the <code className="aw-code">ex1.c</code> row — the <strong>+</strong> only appears when the pointer is over it, which is easy to miss. Select it, and the file moves up to <strong>Staged Changes</strong>.</>
      }
    }
  },
  {
    id: "S4.4",
    stage: 4, n: 4, app: "vscode",
    title: "Write a message and commit",
    action: <>Type a short message in the box at the top, then select <strong>Commit</strong>.</>,
    body: (
      <ul style={list} className="aw-p">
        <li><strong>[1]</strong> The message box. Anything describing what you did — <code className="aw-code">My First Commit Message</code> is fine here.</li>
        <li><strong>[2]</strong> The blue <strong>Commit</strong> button.</li>
      </ul>
    ),
    figure: (
      <Figure caption="Figure 4.3 · Committing the change">
        <PinnedShot src={`${IMG}/s4-commit.webp`} width={1350} height={580}
          alt="The VS Code Source Control panel with a commit message typed in the box marked 1 and the Commit button marked 2."
          pins={[]} />
      </Figure>
    ),
    why: {
      label: "Committing is not uploading",
      body: <>A commit records the change in the copy on your own machine. Nothing has left your laptop yet — that is the last step of this stage. The two are separate so that you can record work while offline.</>
    },
    check: {
      question: "Is the Staged Changes list empty now?",
      ok: { label: "Yes, the list has cleared", note: "The commit was recorded. One check, then you upload." },
      alt: {
        label: "It is asking me something I do not understand",
        note: <>If VS Code offers to stage all your changes, say yes — you only have the one file. If it asks for a name and email address, enter your own; Git records who made each change and has not been told yet.</>
      }
    }
  },
  {
    id: "S4.5",
    stage: 4, n: 5, app: "vscode",
    title: "Check the commit registered",
    action: <>Look at the bottom left of the VS Code window, just right of the branch name.</>,
    body: (
      <p className="aw-p">
        There are two things you might see here. Both are normal, and one of them
        needs an extra click from you.
      </p>
    ),
    figure: (
      <Compare
        caption="Figure 4.4 · Two things the status bar might show"
        a={{
          src: `${IMG}/s4-status-ok.webp`, width: 750, height: 78,
          alt: "The VS Code status bar showing the branch name main followed by a sync icon reading 0 down, 1 up.",
          label: "A number beside the arrows — your commit, waiting to be uploaded."
        }}
        b={{
          src: `${IMG}/s4-status-missing.webp`, width: 640, height: 78,
          alt: "The VS Code status bar showing the branch name main with no counter beside it.",
          label: "Nothing beside the branch name — the counter has not been drawn."
        }}
        note="Neither of these means you have done anything wrong."
      />
    ),
    check: {
      question: "Which of the two are you looking at?",
      ok: {
        label: "There is a number beside the arrows",
        note: "That is your commit, queued for upload. Last step of this stage."
      },
      alt: {
        label: "There is nothing there",
        note: (
          <>
            This one is VS Code's doing, not yours — it sometimes fails to redraw
            the counter after a commit. Select the <strong>…</strong> menu at the
            top of the Source Control panel and choose <strong>Fetch</strong>. A
            second or two later the number appears. Then choose the first answer
            above.
          </>
        ),
        figure: (
          <Clip src={`${IMG}/s4-fetch.mp4`} poster={`${IMG}/s4-fetch.webp`}
            width={576} height={349} caption="Fetching, to wake up the counter" />
        )
      }
    }
  },
  {
    id: "S4.6",
    stage: 4, n: 6, app: "vscode",
    title: "Upload it with Sync Changes",
    action: <>Select <strong>Sync Changes</strong>, and confirm if you are asked.</>,
    body: (
      <p className="aw-p">
        Watch the bottom left. A spinner turns while the upload runs, and both
        the spinner and the counter disappear when it finishes. That is your
        signal that your machine and GitHub now hold the same thing.
      </p>
    ),
    figure: (
      <Clip src={`${IMG}/s4-sync.mp4`} poster={`${IMG}/s4-sync.webp`}
        width={576} height={349} caption="Figure 4.5 · Syncing the commit to GitHub" />
    ),
    check: {
      question: "Has the counter beside the branch name gone?",
      ok: { label: "Yes, it has cleared", note: "Your work is on GitHub. Stage 4 is done." },
      alt: {
        label: "It is still there, or an error appeared",
        note: <>If you were asked to sign in, finish that and select <strong>Sync Changes</strong> again. If it reports that the remote has changes you do not have, choose to pull first, then sync — your instructor has updated something since you cloned.</>
      }
    }
  },

  /* ─────────────────────────────────────────────────────────────────────────
     Stage 5 — Confirming your submission
     ───────────────────────────────────────────────────────────────────────── */
  {
    id: "S5.1",
    stage: 5, n: 1, app: "github",
    title: "Refresh your repository page",
    action: <>Go back to your repository in the browser and refresh it.</>,
    body: (
      <ul style={list} className="aw-p">
        <li><strong>[1]</strong> Your commit message now appears beside the files you changed. That is proof the upload arrived.</li>
        <li><strong>[2]</strong> An orange dot near the commit means GitHub is running your program against the table. Give it about a minute.</li>
      </ul>
    ),
    figure: (
      <Figure caption="Figure 5.1 · GitHub checking your work">
        <PinnedShot src={`${IMG}/s5-checking.webp`} width={1400} height={708}
          alt="A GitHub repository page showing the latest commit message on ex1.c marked 1 and an orange in-progress status dot marked 2." />
      </Figure>
    ),
    check: {
      question: "Can you see your commit message next to ex1.c?",
      ok: { label: "Yes, my message is there", note: "The upload arrived. Now wait for the result." },
      alt: {
        label: "It still shows “Initial commit”",
        note: <>The upload has not arrived. Go back to VS Code and check the bottom left — if a counter is still showing, <strong>Sync Changes</strong> did not finish. Run it again, then refresh here.</>
      }
    }
  },
  {
    id: "S5.2",
    stage: 5, n: 2, app: "github",
    title: "Wait for the green check",
    action: <>Refresh once more after a minute, and look at the mark beside your commit.</>,
    body: (
      <p className="aw-p">
        The orange dot becomes a green check when your program produced what the
        table required. That is GitHub confirming the code is right — it is not
        yet your submission, which is the last two steps.
      </p>
    ),
    figure: (
      <Figure caption="Figure 5.2 · A green check">
        <PinnedShot src={`${IMG}/s5-green.webp`} width={1400} height={348}
          alt="A GitHub repository header with a green check mark beside the latest commit."
          pins={[{ n: 1, left: "69%", top: "79%" }]} />
      </Figure>
    ),
    difficulty: "You have a red cross instead",
    fix: 6,
    check: {
      question: "What is beside your commit?",
      ok: { label: "A green check", note: "Your code passes. Two steps left." },
      alt: {
        label: "A red cross",
        note: <>A cross means the output did not match — your upload worked, the answer is not right yet. The resolution above shows how to read the report and what to change. Submit the link to Canvas either way, and fix the code afterwards.</>
      }
    }
  },
  {
    id: "S5.3",
    stage: 5, n: 3, app: "github",
    title: "Copy the repository link",
    action: <>Copy the address of your repository from the browser's address bar.</>,
    body: (
      <p className="aw-p">
        The whole address, beginning <code className="aw-code">https://github.com/</code>.
        This is the deliverable — the Canvas assignment asked for the repository
        URL, and this is it.
      </p>
    ),
    figure: (
      <Figure caption="Figure 5.3 · The address to copy">
        <PinnedShot src={`${IMG}/s5-copy-link.webp`} width={1400} height={118}
          alt="A browser address bar showing github.com followed by the organisation and repository name, outlined in red." />
      </Figure>
    ),
    check: {
      question: "Does the address you copied end with your own repository name?",
      ok: { label: "Yes, it ends with my username", note: "That is the one. One step left." },
      alt: {
        label: "It has extra parts after the repository name",
        note: <>You are inside a file or a sub-page. Select the repository name at the top of the page to get back to its main view, then copy the address again — it should end at your username with nothing after it.</>
      }
    }
  },
  {
    id: "S5.4",
    stage: 5, n: 4, app: "canvas",
    title: "Submit the link in Canvas",
    action: <>Return to the Canvas assignment, paste the address into the <strong>Website URL</strong> box, and select <strong>Submit Assignment</strong>.</>,
    body: (
      <p className="aw-p">
        This is what records that you handed the work in. A green check on GitHub
        without a Canvas submission is not a submitted assignment.
      </p>
    ),
    figure: (
      <Figure caption="Figure 5.4 · Submitting in Canvas">
        <PinnedShot src={`${IMG}/s5-canvas-submit.webp`} width={1400} height={418}
          alt="A Canvas assignment submission form with the repository URL pasted into the Website URL field and the Submit Assignment button outlined." />
      </Figure>
    ),
    why: {
      label: "What if I need to change something afterwards?",
      body: <>Fix the code and work through Stage 4 again. The repository link does not change, so the submission you have already made stays correct — GitHub marks each upload afresh. If Canvas allows another attempt, resubmitting the same link is harmless.</>
    },
    check: {
      question: "Does Canvas show the assignment as submitted?",
      ok: { label: "Yes, it is submitted", note: "That is the whole workflow, start to finish." },
      alt: {
        label: "It will not accept my submission",
        note: <>Check that the box is the <strong>Website URL</strong> one rather than a file upload or text entry tab. If the deadline has passed Canvas may refuse the submission entirely — tell your instructor, and note that your work is already on GitHub with a timestamp.</>
      }
    }
  }
];

export const stepsInStage = (n) => steps.filter((s) => s.stage === n);

export const sizeOfStage = (n) => stepsInStage(n).length;

export const stepAt = (stage, n) => stepsInStage(stage)[n - 1];
