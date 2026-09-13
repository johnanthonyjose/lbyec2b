import React from "react";

/* The panels behind an "anticipated difficulty" banner.

   Only six of the thirty steps carry one. Most things that go wrong in this
   procedure have a single cause and a one-sentence fix, and those belong inline
   in the step's own checkpoint, where the reader already is. A modal is for the
   handful that genuinely branch — where the right action depends on which of
   several things happened — and it earns its interruption there.

   `returnTo` is a {stage, step} pair because a resolution can send a reader
   back across a stage boundary. */

export const resolutions = [
  {
    id: 1,
    returnTo: { stage: 1, step: 4 },
    title: "Your name is not in the list of identifiers",
    cause:
      "The roster is built from the organisation membership form. If your form has not been processed yet, or you filled it in with a different name or username than the one you are signed in with, there is nothing on the list to match you.",
    steps: [
      <>Check the top of the page. It should name your course and section. If it names a different section, you have opened another section's link — go back to Canvas and use the link on your own assignment page.</>,
      <>Look for a name close to yours. Rosters are often built from registrar records, so it may be your full legal name rather than the one you use.</>,
      <>If it is genuinely absent, select <strong>Skip to the next step</strong> at the right of the list. You will still receive your repository; your instructor can attach your name to it afterwards.</>,
      <>Tell your instructor which username you used, so the roster can be corrected before the next assignment.</>
    ]
  },
  {
    id: 2,
    returnTo: { stage: 2, step: 1 },
    title: "The Code panel offers SSH, or the URL does not begin with https",
    cause:
      "GitHub remembers the last protocol you used. If SSH is selected, the address it copies needs a key you have not set up, and the clone in the next step will fail with a permissions error.",
    steps: [
      <>Open the green <strong>Code</strong> button again.</>,
      <>Under the <strong>Local</strong> tab, select <strong>HTTPS</strong>. It is the first of the three words beneath "Clone".</>,
      <>Confirm the address now begins <code className="aw-code">https://github.com/</code>.</>,
      <>Use the copy icon to its right rather than selecting the text by hand — the field is cut off, and a partial address fails in a way that is hard to read.</>
    ]
  },
  {
    id: 3,
    returnTo: { stage: 2, step: 2 },
    title: "There is no “Git: Clone” in the command palette",
    cause:
      "VS Code only offers Git commands when it can find Git itself. On Windows this almost always means Git was never installed, or was installed after VS Code was last started.",
    steps: [
      <>Close VS Code completely and open it again. An installation done while VS Code was running is not picked up until it restarts.</>,
      <>If the command is still missing, Git is not installed. Work through the <a className="dls-link-quiet" href="https://www.craft.do/s/Eud7pGvAgfvQy4" target="_blank" rel="noreferrer">Installing Git</a> handout, then return here.</>,
      <>On a Mac, Git arrives with the Xcode command line tools. Open Terminal and run <code className="aw-code">xcode-select --install</code>, then restart VS Code.</>,
      <>Check that you typed the leading <code className="aw-code">&gt;</code> in the palette. Without it the box searches for files rather than commands, and no command will ever appear.</>
    ]
  },
  {
    id: 4,
    returnTo: { stage: 2, step: 5 },
    title: "The sign-in never completes, or it asks again every time",
    cause:
      "The sign-in hands off to your browser and back again. If a different GitHub account is already signed in there, or the hand-back is blocked, VS Code never receives the confirmation and asks again.",
    steps: [
      <>Read the account name on the authorisation page in the browser. If it is not the account you registered for this course, sign out of GitHub there and sign in again as yourself.</>,
      <>Allow the browser to reopen VS Code when it offers. Blocking that prompt is what usually leaves the sign-in half finished.</>,
      <>If nothing happens at all, choose <strong>Sign in with a code</strong> instead. VS Code shows a short code to type into the browser, which avoids the hand-back entirely.</>,
      <>Once signed in, run the clone again from the command palette. The folder you chose earlier may be empty or partly written; delete it first so the clone starts clean.</>
    ]
  },
  {
    id: 5,
    returnTo: { stage: 3, step: 5 },
    title: "There is no “Run Code” in that menu",
    cause:
      "Run Code comes from the Code Runner extension, not from VS Code itself. If the extension is missing, the menu shows only the debugging entries.",
    steps: [
      <>Open the Extensions panel in the left rail and search for <strong>Code Runner</strong>. Install it if it is not there, then reopen the menu.</>,
      <>If it is installed and still absent, make sure <code className="aw-code">ex1.c</code> is the file you are looking at. The menu changes with the active file, and it offers nothing for a README.</>,
      <>You can also use <strong>Run C/C++ File</strong> in the same menu. It compiles and runs the same program; only the console it opens differs.</>,
      <>If the program compiles but the console closes instantly, run it once more — the first run of a session sometimes reports before the terminal has attached.</>
    ]
  },
  {
    id: 6,
    returnTo: { stage: 5, step: 2 },
    title: "You have a red cross rather than a green check",
    cause:
      "The cross is GitHub reporting that it ran your program and the output did not match the table. It is a result, not a failure to submit — your work uploaded correctly, it simply does not pass yet.",
    steps: [
      <>Select the red cross to see what was run and what came back. The report shows the expected output beside what your program actually printed.</>,
      <>Compare them character by character. Spacing, capitalisation and punctuation all count: <code className="aw-code">Hello World 2!</code> and <code className="aw-code">hello world 2</code> are different answers.</>,
      <>Check that the prompt text matches too. The expected output includes what you typed, so a changed <code className="aw-code">printf</code> prompt fails even when the calculation is right.</>,
      <>Fix the code in VS Code, then work through Stage 4 again — save, stage, commit, sync. Each upload is marked afresh, and there is no penalty for more than one.</>,
      <>Submit the repository link to Canvas regardless. The link is what records that you handed the work in, and it stays correct however many times you upload.</>
    ]
  }
];

export const resolutionById = Object.fromEntries(resolutions.map((r) => [r.id, r]));
