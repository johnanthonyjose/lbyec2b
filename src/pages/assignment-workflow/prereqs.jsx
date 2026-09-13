import React from "react";

/* What has to be true before Stage 1 is worth starting.

   The original handout opened with four links to other documents and no way to
   tell which of them you had already done. Here each is a row you tick, and the
   ticks persist, so the question "am I set up?" is answered once rather than
   re-derived every time the page is opened.

   Ticking is not enforcement. A reader who wants to look through the procedure
   first can open Stage 1 without ticking anything — see the shell's
   "Show me the steps anyway". Nothing here is graded or submitted. */

export const prereqs = [
  {
    id: "account",
    title: "You have a GitHub account",
    detail: "Registered, with your DLSU address confirmed, and a member of the course organisation.",
    todo: "If not, register one first:",
    href: "github-account.html",
    linkLabel: "Handout 01 — Registering a GitHub account",
    internal: true
  },
  {
    id: "form",
    title: "You submitted the organisation membership form",
    detail: "This is what puts your username on the course roster. Without it, Stage 1 will not find your name.",
    todo: "If not, submit it now:",
    href: "https://beans-attack-jxb.craft.me/8sE6FONuL0odFh",
    linkLabel: "Organisation membership form"
  },
  {
    id: "cprog",
    title: "A C program already runs in your VS Code",
    detail: "You have compiled and run at least one C file successfully. Stage 3 assumes this works.",
    todo: "If not, work through this first:",
    href: {
      win: "https://www.craft.do/s/kgGXFvKbyXxG9C",
      mac: "https://www.craft.do/s/6EI5jDqJf01WIR"
    },
    linkLabel: { win: "Running C programs in VS Code (Windows)", mac: "Running C programs (Mac)" }
  },
  {
    id: "git",
    title: "Git is installed",
    detail: "Stage 2 cannot clone anything without it.",
    todo: "If not, install it first:",
    href: "https://www.craft.do/s/Eud7pGvAgfvQy4",
    linkLabel: "Installing Git (Windows)",
    // On a Mac, Git arrives with the Xcode command line tools. There is nothing
    // to do, so the row is not presented as an outstanding task.
    osOnly: "win",
    satisfiedOn: {
      mac: "Already installed on your Mac, with the Xcode command line tools."
    }
  }
];

/* Rows that apply to this reader. A Mac reader is not shown a Windows-only
   installation step as something still owed. */
export const prereqsFor = (os) => prereqs.filter((p) => !p.osOnly || p.osOnly === os);

export const pick = (value, os) =>
  value && typeof value === "object" && !React.isValidElement(value) ? value[os] : value;
