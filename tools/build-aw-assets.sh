#!/usr/bin/env bash
#
# Rebuilds public/assets/img/aw/ from the Craft export in original/.
#
# The source screenshots are full-desktop captures up to 3104x1974, roughly
# seventy per cent of which is empty editor background. Every one is cropped to
# the region its instruction actually refers to before conversion: it cuts the
# payload by an order of magnitude, and on a phone it is the difference between
# a legible control and a three-pixel target.
#
# Crop rectangles are x,y,w,h in the SOURCE image's own pixels. They are
# recorded here rather than applied by hand so a re-export can be reprocessed
# identically. The printed table at the end gives the post-crop dimensions that
# steps.jsx must pass to <PinnedShot width height>.
#
# Requires: ffmpeg, sips (macOS). Run from anywhere.

set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
SRC="$ROOT/original/assignment_workflow/Our Assignment Workflow using Github Classroom/Our Assignment Workflow using Github Classroom.assets"
OUT="$ROOT/public/assets/img/aw"

[ -d "$SRC" ] || { echo "source assets not found: $SRC" >&2; exit 1; }
mkdir -p "$OUT"

# Resolve a source by glob. Three of the Craft exports carry a narrow no-break
# space (U+202F) before "PM" in their filename, which is invisible in a terminal
# and miserable to type; patterns let the shell find them instead.
find_src () {
  local hit
  hit=$(compgen -G "$SRC/$1" | head -1) || true
  [ -n "$hit" ] || { echo "no source matching: $1" >&2; exit 1; }
  printf '%s' "$hit"
}

# shot <source-glob> <slug> <x,y,w,h>
# Crops, caps the long edge at 1400px (never upscales), writes WebP.
shot () {
  local src="$1" slug="$2" rect="$3"
  IFS=, read -r x y w h <<< "$rect"
  ffmpeg -y -loglevel error -i "$(find_src "$src")" \
    -vf "crop=${w}:${h}:${x}:${y},scale='min(1400,iw)':-2:flags=lanczos" \
    -c:v libwebp -quality 82 "$OUT/$slug.webp"
}

# clip <source.gif> <slug> <poster-seek>
# GIFs autoplay and loop forever, which is hostile in peripheral vision and
# ignores prefers-reduced-motion. They become click-to-play video plus a poster
# taken partway through, where the demonstrated action is actually visible.
clip () {
  local src="$1" slug="$2" at="$3"
  ffmpeg -y -loglevel error -i "$(find_src "$src")" -movflags +faststart -pix_fmt yuv420p \
    -vf "scale=trunc(iw/2)*2:trunc(ih/2)*2" -an "$OUT/$slug.mp4"
  ffmpeg -y -loglevel error -ss "$at" -i "$(find_src "$src")" -frames:v 1 \
    -c:v libwebp -quality 82 "$OUT/$slug.webp"
}

echo "Stage 1 — Obtaining your repository"
shot "Image.png"                                  s1-canvas-link  0,0,1476,520
shot "B9A55D7B-2AF2-4776-B8BE-4E519BDD637F.png"   s1-authorize    415,155,545,460
shot "9F4B55F4-DA1E-49DE-8F68-04875F59F0CA.png"   s1-roster       270,60,645,470
shot "04 - accept.png"                            s1-accept       380,280,1300,760
shot "05 - refresh.png"                           s1-configuring  60,260,1310,650
shot "06 - new link.png"                          s1-repo-link    80,500,1350,660
shot "07 - new repo.png"                          s1-repo-view    0,0,1980,1010

echo "Stage 2 — Cloning to your computer"
shot "Screenshot*8.54.29*PM.png"        s2-copy-url     950,300,1010,780
shot "Screenshot*9.09.03*PM.png"        s2-signin       25,28,855,675
shot "Screenshot*9.11.11*PM.png"        s2-open         35,10,535,555
shot "07-success.png"                             s2-files        100,60,850,800
clip "AnimatedImage.gif"                          s2-clone-palette 5.2
clip "AnimatedImage (2).gif"                      s2-destination   6.7

echo "Stage 3 — Completing the exercise"
shot "01 - Readme.png"                            s3-readme       20,20,1780,700
shot "02 - open ex1.png"                          s3-open-ex1     100,60,1620,730
shot "03 - remove comment.png"                    s3-uncomment    100,60,1470,730
shot "04 - Save.png"                              s3-save         100,60,2170,820
shot "05 - run.png"                               s3-run-menu     1250,0,1620,340
shot "05b - run prompt.png"                       s3-run-prompt   790,1235,2200,420
shot "6 - test.png"                               s3-test         760,1060,1700,640

echo "Stage 4 — Committing and uploading"
shot "02 - Review.png"                            s4-review       100,60,2870,1140
shot "03 - Commit.png"                            s4-commit       100,60,1350,580
# The two halves of the VS Code commit-counter defect, cropped to the same
# status-bar band so they read as two ordinary outcomes side by side.
shot "04 - issue.png"                             s4-status-missing 0,165,640,77
shot "04 - proper.png"                            s4-status-ok      0,205,750,77
clip "AnimatedImage (3).gif"                      s4-fetch         4.5
clip "AnimatedImage (4).gif"                      s4-sync          4.7

echo "Stage 5 — Confirming your submission"
shot "01 - check.png"                             s5-checking     10,0,1978,1000
shot "02 - green.png"                             s5-green        0,0,2008,500
shot "03 - get link.png"                          s5-copy-link    0,0,2076,175
shot "03b - Submit Canvas.png"                    s5-canvas-submit 100,820,2240,670

# Deliberately not built:
#   Vscode.png, Github.tiff, 00-target repo.tiff — the source's "your desktop
#   should have these open" recap. That recap is carried by the Stage 2
#   completion panel's prose instead, so the images have no step to sit in.
#   01 - Modified.png is byte-identical to 04 - Save.png (one asset, two
#   captions), and Github.tiff is byte-identical to 00-target repo.tiff.

echo
printf '%-22s %-12s %s\n' FILE DIMENSIONS SIZE
for f in "$OUT"/*.webp "$OUT"/*.mp4; do
  d=$(ffprobe -v error -select_streams v:0 -show_entries stream=width,height \
        -of csv=s=x:p=0 "$f" 2>/dev/null || echo "-")
  printf '%-22s %-12s %s\n' "$(basename "$f")" "$d" "$(du -h "$f" | cut -f1)"
done
echo
echo "total: $(du -sh "$OUT" | cut -f1)   (source was 21M)"
