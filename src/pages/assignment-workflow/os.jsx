import React from "react";

/* Windows and macOS differ in this procedure in two ways, and each needs its
   own mechanism.

   Small differences are inline — a modifier key, a menu name. Forking a whole
   step over "Ctrl" versus "Cmd" would double the content for no gain, so <Os>
   and <Key> switch a few words inside otherwise identical prose.

   One difference is structural: Git ships with the Xcode command line tools, so
   installing it is a prerequisite on Windows and nothing at all on a Mac. That
   is `osOnly` on the row itself, and the row disappears.

   Either way the point is the same. A reader should not have to work out which
   half of a sentence is addressed to them. */

export const OsContext = React.createContext("win");

export const useOs = () => React.useContext(OsContext);

export function Os({ win, mac }) {
  return <>{useOs() === "mac" ? mac : win}</>;
}

export function Key({ win, mac }) {
  return <kbd className="aw-kbd"><Os win={win} mac={mac} /></kbd>;
}

export const osLabel = (os) => (os === "mac" ? "macOS" : "Windows");

/* Windows unless the reader says otherwise. Sniffing the user agent was worse
   than a plain default: it quietly put Mac readers and Windows readers on
   different versions of the page with nothing on screen to say why, and a
   shared or lab machine guessed wrong for whoever sat down at it. A fixed
   default that everyone can see and change is easier to reason about. */
export const DEFAULT_OS = "win";
