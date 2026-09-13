import React from "react";

/* Background, folded away.

   The source document gave rationale, warnings and instructions the same
   weight, because a blockquote was the only container it had. The result was
   that a reader scanning for what to do had to read everything to find it.

   Anything a reader does not need in order to take the next action lives in
   here, shut. It is one line of type until asked for. */

export function Why({ label, children }) {
  return (
    <details className="aw-why">
      <summary>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
          strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="m9 18 6-6-6-6" />
        </svg>
        <span>{label}</span>
      </summary>
      <div className="aw-why-body">{children}</div>
    </details>
  );
}
