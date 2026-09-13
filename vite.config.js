import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath } from "node:url";

// Multi-page build. Each entry below becomes a real URL on GitHub Pages
// (/index.html, /course-overview.html) rather than a client-side route, so
// pages stay linkable, bookmarkable and indexable. Add a page by creating
// its .html at the repo root and listing it here.
//
// base is "./" so every asset URL is relative to the page that loads it.
// That makes the build work unchanged at a user site (user.github.io) and at
// a project site (user.github.io/repo-name) without threading the repo name
// through the config or the workflow.
const page = (name) => fileURLToPath(new URL(`./${name}.html`, import.meta.url));

export default defineConfig({
  base: "./",
  plugins: [react()],
  build: {
    outDir: "dist",
    rollupOptions: {
      input: {
        index: page("index"),
        "course-overview": page("course-overview"),
        "github-account": page("github-account"),
        "assignment-workflow": page("assignment-workflow")
      }
    }
  }
});
