/* Measures the prose a student actually reads.

   Run from the repo root:  node tools/check-readability.mjs [--verbose]

   The handout's audience reads English as a second language, on a phone, under
   deadline. The first draft was written in the register of the site's
   procedural handouts and turned into textbook prose — 34-word sentences with
   three subordinate clauses — which is the one thing this handout could not
   afford. Sentence length is a crude proxy for that, but it is an objective
   one, and it is the measure the rewrite was briefed against.

   It renders each step through the real page and measures the visible text, so
   it reports what reaches the reader rather than what is in the source. Code,
   terminal output and line numbers are excluded: they are not prose and their
   line lengths are meaningless here. */
import { createServer } from "vite";
import { renderToString } from "react-dom/server";
import React from "react";

const VERBOSE = process.argv.includes("--verbose");
/* Revised. The first target — under 12 words a sentence — was set after the
   handout came back as textbook prose, and hitting it produced the opposite
   fault: a quick-start guide with the intellectual content stripped out along
   with the long sentences. Sentence length was never the real variable.

   The band below is what an academic register looks like when it is still
   readable: long enough to carry a qualified technical claim, short enough
   that a second-language reader is not parsing three clauses at once. A mean
   UNDER the floor now fails, because that is the failure we actually shipped. */
const FLOOR_MEAN = 13;
const TARGET_MEAN = 18;
const CEILING = 30;          // a sentence past this is doing too much at once

const server = await createServer({ server: { middlewareMode: true }, appType: "custom", logLevel: "warn" });
const store = new Map();
globalThis.window = globalThis.window || {};
globalThis.window.localStorage = {
  getItem: (k) => (store.has(k) ? store.get(k) : null),
  setItem: (k, v) => store.set(k, v), removeItem: (k) => store.delete(k)
};

const BRITISH = /\b(behaviour|colour|recognise|authorise|organise|initialise|analyse|centre|favourite|labelled|modelling|practise|licence|whilst|amongst|learnt|spelt)\b/gi;

const { steps } = await server.ssrLoadModule("/src/pages/file-io/steps.jsx");

let all = [], longest = null, britishHits = [], perStep = [];

for (const st of steps) {
  store.set("lbyec2b-fio", JSON.stringify({
    v: 1, answers: {}, acknowledged: [], ready: { compiler: 1, files: 1, cwd: 1 },
    stage: st.stage, step: st.n
  }));
  const mod = await server.ssrLoadModule("/src/pages/FileIO.jsx");
  let html = renderToString(React.createElement(mod.default));

  // Just the step frame.
  const a = html.indexOf('class="aw-step-head"');
  const b = html.indexOf('class="aw-nav"');
  html = html.slice(a, b > a ? b : undefined);

  // Drop everything that is not prose.
  /* Strip everything that is not prose the student reads as sentences: the
     code, the terminal output, the byte grid, and the figure's own controls
     and labels. Left in, the FileMachine call list alone ("1 fgets(line, 100,
     fp) 2 fgets... Previous Next Reset") reads as one 60-word sentence and
     makes the whole measurement meaningless. */
  const strip = (re) => { html = html.replace(re, " "); };

  /* Every explorable figure's drawing and transport is chrome, not prose. Its
     cell labels, variable chips and condition names ("still reading", "set",
     "n = 6") are read as glances, not as sentences, and counting them drags
     the mean toward zero and makes a page of proper academic prose look like
     a quick-start guide. The figcaption IS prose and is deliberately kept.
     This is the same class of error as counting the FileMachine call list. */
  strip(/<div class="ex-head"[\s\S]*?<\/div>\s*(?=<div class="ex-body")/g);
  strip(/<div class="ex-body"[\s\S]*?(?=<div class="ex-transport"|<figcaption class="ex-caption"|<\/figure>)/g);
  strip(/<div class="ex-transport"[\s\S]*?(?=<figcaption class="ex-caption"|<\/figure>)/g);
  strip(/<pre[\s\S]*?<\/pre>/g);                       // code and terminal output
  strip(/<figcaption class="fio-code-head"[\s\S]*?<\/figcaption>/g);
  strip(/<ol class="fm-call-list"[\s\S]*?<\/ol>/g);     // the call list
  strip(/<div class="fm-controls"[\s\S]*?<\/div>\s*<div class="fm-region fm-file"/g);
  strip(/<button[\s\S]*?<\/button>/g);                  // Previous / Next / Reset / Copy
  strip(/<p class="fm-hint"[\s\S]*?<\/p>/g);
  strip(/<span class="fm-count"[\s\S]*?<\/span>/g);
  strip(/<div class="fm-region-label"[\s\S]*?<\/div>/g);
  strip(/<dl class="fm-(varlist|statelist)"[\s\S]*?<\/dl>/g);
  strip(/<span class="fio-code-num"[\s\S]*?<\/span>/g);
  strip(/<div class="fm-bytes"[\s\S]*?<\/div>/g);       // the byte grid
  strip(/<p class="fm-sr"[\s\S]*?<\/p>/g);              // the screen-reader sentence
  strip(/<p class="fm-status"[\s\S]*?<\/p>/g);

  /* Block boundaries are sentence boundaries. A list item rarely ends in a
     full stop, so flattening the markup first would glue a five-item list into
     one "sentence" and score it as the longest thing on the page — penalising
     exactly the structure the prose is supposed to use. */
  const text = html
    .replace(/<\/(li|p|h2|h3|figcaption|dd|dt|div)>/g, "\n")
    .replace(/<[^>]+>/g, " ").replace(/<!--.*?-->/g, " ")
    .replace(/&#x27;|&rsquo;/g, "'").replace(/&quot;/g, '"')
    .replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">")
    .replace(/&[a-z]+;|&#\d+;/g, " ")
    .replace(/[ \t]+/g, " ").replace(/\n\s*/g, "\n").trim();

  for (const m of text.matchAll(BRITISH)) britishHits.push([st.id, m[0]]);

  /* Split on block boundaries first, then on sentence ends within a block.
     Doing it in that order keeps each list item its own unit, and it also
     avoids mis-splitting the handout's own data: "hello no. 1" and
     "where is no. 2?" contain full stops that are not sentence ends, so the
     within-block rule still requires a capital letter after the break. */
  const sentences = text.split("\n")
    .flatMap(block => block.split(/(?<=[.?!])\s+(?=[A-Z"'(])/))
    .map(s => s.trim()).filter(s => /[a-z]{3}/.test(s));

  const lens = sentences.map(s => s.split(/\s+/).filter(w => /[A-Za-z0-9]/.test(w)).length);
  lens.forEach((n, i) => {
    all.push(n);
    if (!longest || n > longest.n) longest = { n, id: st.id, s: sentences[i] };
  });
  const over = lens.filter(n => n > CEILING).length;
  perStep.push({ id: st.id, n: lens.length, mean: lens.length ? lens.reduce((x, y) => x + y, 0) / lens.length : 0, over });
}

const mean = all.reduce((a, b) => a + b, 0) / all.length;
const over = all.filter(n => n > CEILING);
const pct = (100 * over.length / all.length);

console.log(`\nsentences measured   ${all.length}`);
console.log(`mean words/sentence  ${mean.toFixed(1)}   (target ${FLOOR_MEAN} to ${TARGET_MEAN})`);
console.log(`over ${CEILING} words        ${over.length}  (${pct.toFixed(1)}%)`);
console.log(`longest              ${longest.n} words, ${longest.id}`);
console.log(`   "${longest.s}"`);
console.log(`british spellings    ${britishHits.length}${britishHits.length ? "  " + JSON.stringify(britishHits.slice(0, 8)) : ""}`);

if (VERBOSE) {
  console.log("\nper step (mean / sentences over ceiling):");
  for (const p of perStep.sort((x, y) => y.mean - x.mean))
    console.log(`  ${p.id.padEnd(6)} ${p.mean.toFixed(1).padStart(5)}  ${String(p.over).padStart(3)} over`);
}

await server.close();
const tooSimple = mean < FLOOR_MEAN;
const tooDense = mean > TARGET_MEAN || pct > 10;
const ok = !tooSimple && !tooDense && britishHits.length === 0;
console.log(
  ok ? "\nReads at the briefed academic level.\n"
     : tooSimple ? `\nToo simplified: a mean of ${mean.toFixed(1)} is a quick-start guide, not a university handout.\n`
     : "\nStill too dense.\n");
process.exit(ok ? 0 : 1);
