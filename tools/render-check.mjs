/* Runtime check without a browser.

   Run from the repo root:  node tools/render-check.mjs

   tools/smoke.sh is the thorough one and needs Chrome. This is the fast one:
   it renders every page, every step of every handout and every resolution
   through Vite's SSR loader in a couple of seconds, which is enough to catch a
   step whose JSX throws — a failure a bundler cannot see and that a reader
   would not meet until three stages in.

   The build only proves the modules parse and bundle. This renders the real
   page components through Vite's SSR loader, which runs the hooks, the stage
   arithmetic and every step's JSX for real, and would surface the failures a
   bundler cannot see: a bad prop shape, a component called with undefined, a
   step whose `check` the page cannot render. */
import { createServer } from "vite";
import { renderToString } from "react-dom/server";
import React from "react";

const server = await createServer({
  server: { middlewareMode: true },
  appType: "custom",
  logLevel: "warn"
});

// localStorage is read by usePersistentState on first render.
const store = new Map();
globalThis.window = globalThis.window || {};
globalThis.window.localStorage = {
  getItem: (k) => (store.has(k) ? store.get(k) : null),
  setItem: (k, v) => store.set(k, v),
  removeItem: (k) => store.delete(k)
};

let failed = false;

async function render(label, path, exportName = "default") {
  try {
    const mod = await server.ssrLoadModule(path);
    const html = renderToString(React.createElement(mod[exportName]));
    console.log(`  ok   ${label.padEnd(26)} ${String(html.length).padStart(7)} bytes`);
    return html;
  } catch (e) {
    failed = true;
    console.log(`  FAIL ${label}`);
    console.log("       " + (e.stack || e.message).split("\n").slice(0, 6).join("\n       "));
    return "";
  }
}

console.log("\nPages (initial render, nothing stored):");
const pages = [
  ["Home", "/src/pages/Home.jsx"],
  ["CourseOverview", "/src/pages/CourseOverview.jsx"],
  ["GitHubAccount", "/src/pages/GitHubAccount.jsx"],
  ["AssignmentWorkflow", "/src/pages/AssignmentWorkflow.jsx"],
  ["FileIO", "/src/pages/FileIO.jsx"]
];
for (const [l, p] of pages) await render(l, p);

/* Now the part a first render cannot reach. Seed stored progress so the page
   opens mid-walkthrough, and render every single step of both handouts. A step
   whose JSX throws is invisible until a reader actually reaches it, which on
   this site could be three stages in. */
console.log("\nEvery step of both handouts, rendered individually:");

for (const [label, key, stepsPath, extra] of [
  ["file-io", "lbyec2b-fio", "/src/pages/file-io/steps.jsx", { ready: { compiler: true, files: true, cwd: true } }],
  ["assignment-workflow", "lbyec2b-aw", "/src/pages/assignment-workflow/steps.jsx", { skipped: true, os: "win" }]
]) {
  const { steps } = await server.ssrLoadModule(stepsPath);
  const pagePath = label === "file-io" ? "/src/pages/FileIO.jsx" : "/src/pages/AssignmentWorkflow.jsx";
  let ok = 0;
  for (const st of steps) {
    store.set(key, JSON.stringify({ v: 1, answers: {}, stage: st.stage, step: st.n, acknowledged: [], ...extra }));
    const mod = await server.ssrLoadModule(pagePath);
    try {
      const html = renderToString(React.createElement(mod.default));
      if (!html.includes("Do this")) throw new Error("step frame did not render");
      ok++;
    } catch (e) {
      failed = true;
      console.log(`  FAIL ${label} ${st.id}: ${(e.message || "").split("\n")[0]}`);
    }
  }
  console.log(`  ok   ${label.padEnd(26)} ${ok}/${steps.length} steps rendered`);
}

/* Both resolution modals, for every id. */
console.log("\nResolution modals:");
for (const [label, path] of [
  ["file-io", "/src/pages/file-io/resolutions.jsx"],
  ["assignment-workflow", "/src/pages/assignment-workflow/resolutions.jsx"]
]) {
  const { resolutions } = await server.ssrLoadModule(path);
  const { Resolution } = await server.ssrLoadModule("/src/components/Resolution.jsx");
  let ok = 0;
  for (const r of resolutions) {
    try {
      renderToString(React.createElement(Resolution, {
        fix: r, onClose() {}, onReturn() {}, returnLabel: "back"
      }));
      ok++;
    } catch (e) {
      failed = true;
      console.log(`  FAIL ${label} resolution ${r.id}: ${e.message}`);
    }
  }
  console.log(`  ok   ${label.padEnd(26)} ${ok}/${resolutions.length} resolutions rendered`);
}

await server.close();
console.log(failed ? "\nFAILURES ABOVE\n" : "\nAll runtime renders clean.\n");
process.exit(failed ? 1 : 0);
