import React from "react";

/* Which application the reader should have in front of them.

   This procedure moves between four of them and changes hands eight times:
   Canvas, a browser, GitHub, VS Code, then Canvas again. The original handout
   never said which one any given instruction belonged to, so a reader returning
   from a context switch had to reconstruct it from the prose.

   Every step names its application, and the page keeps that on screen. */

export const apps = {
  canvas: {
    label: "Canvas",
    hint: "dlsu.instructure.com",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"
        strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="3" />
      </svg>
    )
  },
  browser: {
    label: "Your browser",
    hint: "whichever tab GitHub opened",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"
        strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect x="3" y="4" width="18" height="16" rx="2" /><path d="M3 9h18" />
        <circle cx="6.5" cy="6.5" r=".6" fill="currentColor" />
      </svg>
    )
  },
  github: {
    label: "GitHub",
    hint: "your assignment repository",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.22.68-.48v-1.7c-2.78.6-3.37-1.34-3.37-1.34-.45-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.9 1.53 2.34 1.09 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.94 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.65 0 0 .84-.27 2.75 1.02a9.5 9.5 0 0 1 5 0c1.91-1.29 2.75-1.02 2.75-1.02.55 1.38.2 2.4.1 2.65.64.7 1.03 1.59 1.03 2.68 0 3.84-2.34 4.69-4.57 4.94.36.31.68.92.68 1.85v2.74c0 .27.18.58.69.48A10 10 0 0 0 12 2z" />
      </svg>
    )
  },
  vscode: {
    label: "VS Code",
    hint: "on your own laptop",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"
        strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="m8 17-5-5 5-5" /><path d="m16 7 5 5-5 5" /><path d="M13 5 11 19" />
      </svg>
    )
  }
};
