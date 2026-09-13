/* Figure primitives shared by the handouts.

   These began inside the GitHub-account handout. The assignment-workflow page
   uses PinnedShot roughly twenty times, and a page reaching into another page's
   folder is the wrong direction of dependency, so they live here and both pages
   import from one place. */

export { Field, GreenButton, Figure, BrowserFrame, PinnedShot } from "./Figure.jsx";
export { Clip } from "./Clip.jsx";
export { Compare } from "./Compare.jsx";
export { ZoomContext, useZoom } from "./zoom.jsx";
