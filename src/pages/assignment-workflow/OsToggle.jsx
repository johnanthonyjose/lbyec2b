import React from "react";

/* Which machine the reader is on.

   The class is mixed, and the original handout wrote every keystroke twice —
   "Ctrl + S (Win) or Cmd + S (Mac)" — so every student read instructions
   addressed to the other half of the room. Choosing once removes that.

   It is drawn as a full-size segmented control rather than a pair of quiet
   pills. This is not a preference tucked away in a corner: it changes the
   hotkeys in the instructions and whether a prerequisite exists at all, so a
   reader on the wrong setting is following the wrong handout. It needs to be
   obvious enough that anyone on the other platform notices and switches. */

const OPTIONS = [
  {
    value: "win",
    label: "Windows",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M3 5.7 10.2 4.7v6.9H3zM11.4 4.5 21 3.2v8.4h-9.6zM3 12.8h7.2v6.9L3 18.6zM11.4 12.8H21v8.4l-9.6-1.3z" />
      </svg>
    )
  },
  {
    value: "mac",
    label: "Mac",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9"
        strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M9 6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3z" />
      </svg>
    )
  }
];

export function OsToggle({ os, onChange, label = "Your computer" }) {
  return (
    <div className="aw-ostoggle">
      <span className="aw-ostoggle-label">{label}</span>
      <div className="aw-ostoggle-track" role="group" aria-label="Which computer are you using?">
        {OPTIONS.map((o) => (
          <button key={o.value} type="button" onClick={() => onChange(o.value)}
            aria-pressed={os === o.value}
            className={`aw-ostoggle-btn${os === o.value ? " is-on" : ""}`}>
            <span className="aw-ostoggle-icon">{o.icon}</span>
            {o.label}
          </button>
        ))}
      </div>
    </div>
  );
}
