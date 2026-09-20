/* The staged-handout engine, shared by every walkthrough on the site.

   A handout supplies its own data — stages.jsx, steps.jsx, resolutions.jsx —
   and its own page-specific chrome, and gets the stage gating, the map, the
   step frame, the completion panel and the persistence from here. Adding a
   fourth handout should mean writing three data files and a shell, not a
   fourth copy of this machinery. */

export { useWalkthrough, scrollToId } from "./useWalkthrough.js";
export { StageMap } from "./StageMap.jsx";
export { Step, StepNav } from "./Step.jsx";
export { StageComplete, StageDoneFooter } from "./StageComplete.jsx";
export { Why } from "./Why.jsx";
