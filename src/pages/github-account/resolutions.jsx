import React from "react";

/* The resolution panels behind each step's "Anticipated difficulty" banner.
   Keyed by id rather than by step number: panel 6 covers the missing
   invitation raised at step 7, and panel 7 covers the membership form raised
   at step 6, so `returnTo` records where each sends the reader back. */

export const resolutions = [
  {
    id: 1,
    returnTo: 1,
    title: "The page does not load, or the address is not github.com",
    cause: "The page was reached by way of a search result and is not the intended site, or a browser extension is suppressing the scripts the page requires. A blank page is almost always the latter.",
    steps: [
      <>Read the address bar. It must read <strong>github.com</strong> and indicate a secure connection. If it does not, close the tab.</>,
      <>Enter <a href="https://github.com/signup" target="_blank" rel="noopener">github.com/signup</a> directly.</>,
      <>Reload once. If the page remains blank, disable script and advertisement blocking for the site.</>,
      <>If the condition persists, use a different browser, or the campus network in place of a mobile connection.</>,
      <>A student directed to an account dashboard already holds an account and should proceed to step 6.</>
    ]
  },
  {
    id: 2,
    returnTo: 2,
    title: "The username is unavailable, or a personal address was entered",
    cause: "Common names were claimed long ago, so a plain surname is rarely available. A personal address does not invalidate the registration; it must simply be replaced afterwards.",
    steps: [
      <>Extend the username with a middle initial or a short suffix. A year of birth is not recommended.</>,
      <>Record the final username. Step 6 requires it character for character.</>,
      <>If a personal address was entered, complete the registration as it stands.</>,
      <>Then add the <strong>@dlsu.edu.ph</strong> address at <a href="https://github.com/settings/emails" target="_blank" rel="noopener">github.com/settings/emails</a> and confirm it.</>,
      <>Give the DLSU address on the membership form at step 6.</>
    ]
  },
  {
    id: 3,
    returnTo: 3,
    title: "The verification exercise does not appear",
    cause: "The exercise is served by a third party and is routinely suppressed by advertisement and privacy extensions. No entered data is lost.",
    steps: [
      <>Disable script and advertisement blocking for github.com, then reload the page.</>,
      <>Attempt the exercise again. An unsuccessful attempt carries no consequence.</>,
      <>If it still does not appear, change browser, or disconnect from any virtual private network.</>,
      <>On a slow connection, allow the page to load fully before selecting any control.</>
    ]
  },
  {
    id: 4,
    returnTo: 4,
    title: "No code is received, or the code is refused",
    cause: "University mail occasionally files automated messages under promotions. Codes expire quickly, and a refused code is in most cases simply an earlier one.",
    steps: [
      <>Wait one full minute. The registration tab must remain open.</>,
      <>Examine the spam and promotions folders, and search the mailbox for <strong>GitHub</strong>.</>,
      <>Request a new code from the same screen, and use only the most recent message.</>,
      <>If the address itself was mistyped, sign in, correct it at <a href="https://github.com/settings/emails" target="_blank" rel="noopener">github.com/settings/emails</a> and request confirmation again.</>,
      <>Confirmation cannot be omitted: an unconfirmed address cannot create a repository.</>
    ]
  },
  {
    id: 5,
    returnTo: 5,
    title: "Payment details are being requested",
    cause: "A paid trial is offered during the personalisation questions. It is an offer rather than a requirement, and is readily accepted in error.",
    steps: [
      <>Do not enter a payment instrument. No paid plan is required in this course.</>,
      <>Locate a skip or close control, or a statement offering to continue on the free plan.</>,
      <>If none is available, navigate directly to <a href="https://github.com" target="_blank" rel="noopener">github.com</a>. The dashboard loads regardless.</>,
      <>If a trial has already begun, cancel it at <a href="https://github.com/settings/billing" target="_blank" rel="noopener">github.com/settings/billing</a>.</>
    ]
  },
  {
    id: 6,
    returnTo: 7,
    title: "No invitation has been received",
    cause: "In nearly every instance the username submitted at step 6 differs from the account, generally by a single character, and the invitation is issued to an account that does not exist.",
    steps: [
      <>Examine the spam and promotions folders. Invitations expire after seven days.</>,
      <>Sign in and open <a href="https://github.com/dlsuece-programming-fundamentals" target="_blank" rel="noopener">github.com/dlsuece-programming-fundamentals</a>. A pending invitation is shown as a banner offering <strong>View invitation</strong>.</>,
      <>Also examine <a href="https://github.com/settings/organizations" target="_blank" rel="noopener">github.com/settings/organizations</a>.</>,
      <>If nothing is pending in either location, open the profile page, copy the username from the address bar, and submit the membership form again.</>,
      <>An expired invitation may be reissued on request to the course coordinator.</>
    ]
  },
  {
    id: 7,
    returnTo: 6,
    title: "The membership form does not open, or is not accepted",
    cause: "Access is generally restricted to DLSU Google accounts, so a personal Google session is refused.",
    steps: [
      <>Sign in to Google with the DLSU account, then open <a href="https://forms.gle/62vVyyMWzkLedn6a8" target="_blank" rel="noopener">the form</a> again in the same browser.</>,
      <>If the form reports that it is not accepting responses, notify the course coordinator rather than waiting.</>,
      <>The form cannot be omitted. No invitation is issued without it.</>,
      <>Retain the username on the clipboard, copied from the profile address, so that the response may be submitted without delay.</>
    ]
  }
];

export const resolutionById = Object.fromEntries(resolutions.map((r) => [r.id, r]));
