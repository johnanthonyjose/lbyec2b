import React from "react";
import { Button } from "../../components/ds/index.js";
import { prereqsFor, pick } from "./prereqs.jsx";
import { OsToggle } from "./OsToggle.jsx";

/* What has to be true before Stage 1.

   Four rows, ticked once and remembered. The alternative — four links in a
   paragraph, as the source had — leaves a reader to work out on every visit
   which ones they have already done.

   It does not block. "Show me the steps anyway" opens Stage 1 without ticking
   anything, because a reader who wants to read the procedure before setting
   their machine up is doing something reasonable, and a hard gate would give
   them nothing. */

export function Prerequisites({ os, onOs, ticked, onTick, ready, skipped, onSkip, onBegin,
                                collapsed, onExpand, onCollapse }) {
  const rows = prereqsFor(os);
  const allTicked = rows.every((p) => ticked[p.id]);
  const count = rows.filter((p) => ticked[p.id]).length;

  /* Once the reader is inside the stages, this panel has done its job. Leaving
     it open would put a screenful of settled questions between the top of the
     page and the step they came back for — which is exactly the scrolling this
     handout exists to remove. It collapses to one line and can be reopened. */
  if (collapsed) {
    return (
      <section id="before" className="aw-prereq-bar-wrap">
        <div className="dls-section aw-prereq-bar">
          <span className="aw-prereq-bar-state">
            {allTicked ? (
              <><span className="aw-prereq-bar-tick" aria-hidden="true">✓</span> Ready — all four prerequisites confirmed</>
            ) : (
              <>{count} of {rows.length} prerequisites confirmed</>
            )}
          </span>
          <button type="button" className="aw-quiet" onClick={onExpand}>
            Review prerequisites
          </button>
        </div>
      </section>
    );
  }

  return (
    <section id="before" className="aw-prereq-wrap">
      <div className="dls-section aw-prereq-inner">
        <div className="aw-eyebrow">Before you start</div>
        <h2 className="aw-prereq-title">Four things need to be true</h2>
        <p className="aw-prereq-intro">
          Each one is a separate handout. Tick them off as you confirm them — the
          ticks are kept on this device, and you will not be asked again.
        </p>

        <OsToggle os={os} onChange={onOs} />

        <ul className="aw-prereq">
          {rows.map((p) => {
            const href = pick(p.href, os);
            const label = pick(p.linkLabel, os);
            const on = !!ticked[p.id];
            return (
              <li key={p.id} className={on ? "is-on" : undefined}>
                <label className="aw-prereq-row">
                  <input type="checkbox" checked={on} onChange={() => onTick(p.id)} />
                  <span className="aw-prereq-body">
                    <span className="aw-prereq-name">{p.title}</span>
                    <span className="aw-prereq-detail">{p.detail}</span>
                    {href && (
                      <span className="aw-prereq-todo">
                        <span className="aw-prereq-todo-label">{p.todo}</span>
                        <a className="aw-prereq-link" href={href}
                          {...(p.internal ? {} : { target: "_blank", rel: "noreferrer" })}
                          onClick={(e) => e.stopPropagation()}>
                          {label}
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
                            stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"
                            strokeLinejoin="round" aria-hidden="true">
                            <path d="M7 17 17 7M9 7h8v8" />
                          </svg>
                        </a>
                      </span>
                    )}
                  </span>
                </label>
              </li>
            );
          })}
        </ul>

        {/* On a Mac the Git row is not shown as outstanding, because it is not. */}
        {os === "mac" && (
          <p className="aw-prereq-note">
            Git is already on your Mac — it arrives with the Xcode command line
            tools, so there is nothing to install.
          </p>
        )}

        <div className="aw-prereq-actions">
          <Button variant="gold" size="lg" onClick={onBegin} disabled={!ready}>
            {onCollapse ? "Back to the stages" : "Begin Stage 1"}
          </Button>
          {!ready && (
            <button type="button" className="aw-quiet" onClick={onSkip}>
              Show me the steps anyway
            </button>
          )}
          {onCollapse && (
            <button type="button" className="aw-quiet" onClick={onCollapse}>
              Hide this
            </button>
          )}
          {skipped && !allTicked && (
            <span className="aw-prereq-skipnote">
              Opened without ticking. Some steps will not work until the four above are done.
            </span>
          )}
        </div>
      </div>
    </section>
  );
}
