import React from "react";
import { apps } from "./apps.jsx";

/* "You should be in: VS Code."

   The single most useful thing on the page. This procedure hands off between
   four applications eight times, and every hand-off is a chance to come back
   and not know where you were. Naming the application on every step means a
   reader returning from a context switch can orient in one glance instead of
   reconstructing it from the prose.

   It sits directly under the step number, above the instruction, so it is read
   before the action rather than after it. */

export function AppStrip({ app }) {
  const a = apps[app];
  if (!a) return null;

  return (
    <div className="aw-appstrip">
      <span className="aw-appstrip-label">You should be in</span>
      <span className="aw-appstrip-app">
        <span className="aw-appstrip-icon" aria-hidden="true">{a.icon}</span>
        {a.label}
      </span>
      <span className="aw-appstrip-hint">{a.hint}</span>
    </div>
  );
}
