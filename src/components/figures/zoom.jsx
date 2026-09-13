import React from "react";

/* Whether the surrounding page can enlarge a figure.

   The assignment workflow shows its figures small on purpose, so it supplies a
   handler here and every PinnedShot on the page becomes enlargeable without
   its step data saying anything about it. Pages that supply nothing — the
   GitHub-account handout — render exactly the plain image they always did. */

export const ZoomContext = React.createContext(null);
export const useZoom = () => React.useContext(ZoomContext);
