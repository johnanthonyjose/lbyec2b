#!/usr/bin/env bash
#
# Drives the built site in a headless browser and asserts on what a reader
# would actually see. See tools/smoke.html for the assertions themselves.
#
#   ./tools/smoke.sh          build, serve, test, tear down
#   ./tools/smoke.sh --dev    test against an already-running `npm run dev`
#
# Requires Google Chrome.

set -euo pipefail
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
CHROME="${CHROME:-/Applications/Google Chrome.app/Contents/MacOS/Google Chrome}"
PORT="${PORT:-5199}"

[ -x "$CHROME" ] || { echo "Chrome not found at $CHROME (override with CHROME=…)" >&2; exit 1; }

cleanup () {
  rm -f "$ROOT/dist/__smoke.html" "$ROOT/__smoke.html"
  [ -n "${SERVER_PID:-}" ] && kill "$SERVER_PID" 2>/dev/null || true
}
trap cleanup EXIT

if [ "${1:-}" = "--dev" ]; then
  BASE="http://localhost:${DEV_PORT:-5173}"
  cp "$ROOT/tools/smoke.html" "$ROOT/__smoke.html"
else
  echo "building…"
  (cd "$ROOT" && npx vite build >/dev/null)
  cp "$ROOT/tools/smoke.html" "$ROOT/dist/__smoke.html"
  (cd "$ROOT" && npx vite preview --port "$PORT" --strictPort >/dev/null 2>&1) &
  SERVER_PID=$!
  BASE="http://localhost:$PORT"
  for _ in $(seq 1 40); do
    curl -sf -o /dev/null "$BASE/index.html" && break
    perl -e 'select undef,undef,undef,0.25'
  done
fi

# The window has to be taller than the tallest test frame: a region of an iframe
# that falls outside the browser window is not rendered, and IntersectionObserver
# correctly reports it as not visible.
OUT=$("$CHROME" --headless --disable-gpu --virtual-time-budget=90000 \
  --window-size=1400,3800 --dump-dom "$BASE/__smoke.html" 2>/dev/null)

# --dump-dom may return the whole document on one line, so pull the results out
# by span rather than by line range.
echo "$OUT" | python3 -c '
import html, re, sys
dom = sys.stdin.read()
m = re.search(r"<pre id=\"out\">(.*?)</pre>", dom, re.S)
print(html.unescape(re.sub(r"<[^>]*>", "", m.group(1))) if m else "could not read results from the page")
'

# A run that never reached its last assertion must not be reported as a pass.
if ! echo "$OUT" | grep -q "<title>PASS</title>"; then
  echo
  echo "SMOKE TEST FAILED (the run did not complete — see the output above)"
  exit 1
fi
echo
echo "smoke test passed"
