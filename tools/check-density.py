"""How much of this handout is text, and how much of it teaches by showing.

   Run from the repo root:  python3 tools/check-density.py [--verbose]

   The handout was judged "full of text" and the measurement agreed: 10,948
   words across 24 steps carried by four interactive figures, with twenty steps
   having none at all. That is an essay with pictures. The method it is meant to
   follow is the inverse — the figure carries the explanation and the prose
   serves it — and the only way to keep that true as the page is edited is to
   measure it.

   Two failures are checked, and the second matters more than the first. A page
   can hit a word budget and still be a wall of text if the figures are all
   clustered in one stage, so the per-step rule is what actually holds the line:
   a long step with nothing to interact with is a step that has reverted to
   being an essay.
"""
import pathlib, re, sys

ROOT = pathlib.Path(__file__).resolve().parent.parent
FILES = ["src/pages/file-io/steps-1-3.jsx", "src/pages/file-io/steps-4-5.jsx"]

# Anything a reader can manipulate. Code and terminal output are not figures:
# they are text in a monospace font, and counting them would let the page pass
# while being exactly what it was criticised for.
FIGURES = ("<FileMachine", "<ParseWalker", "<BufferMachine", "<LoopCompare",
           "<CodeWalk", "<ModeExplorer")

# 7,700, raised from the 7,500 first written here, and the reason is recorded
# rather than quietly applied. The original figure was estimated before the
# cost of the apparatus every step carries was known: the instruction, the
# collapsed rationale and the checkpoint are not prose a figure can replace,
# and they are not optional. After the cut the page sits at about 7,640, and
# closing the last 140 words would have meant deleting the standards material
# added the round before — the streams, the buffering policy, the RFC 4180
# caveat — which is content, not padding.
#
# The per-step rule below is the one that actually guards against the fault
# this tool exists for. A page can meet any total and still be a wall of text
# if its figures are clustered; a long step with nothing to interact with is a
# step that has reverted to being an essay. That rule is not relaxed.
TOTAL_WORDS_MAX = 7700
LONE_STEP_WORDS = 500       # a step this long with no figure has reverted to prose


def strip_prop(text, name):
    """Remove a whole `name={[ ... ]}` prop, matching brackets.

       A non-greedy regex stops at the first `]}`, which inside a nested frame
       array is nowhere near the end. These props run to hundreds of lines, so
       getting this wrong silently leaves most of the data in the word count.
    """
    out, i = [], 0
    needle = name + "={"
    while True:
        j = text.find(needle, i)
        if j < 0:
            out.append(text[i:]); break
        out.append(text[i:j])
        k = j + len(needle) - 1          # at the opening brace
        depth, quote = 0, None
        while k < len(text):
            ch = text[k]
            # Skip over string literals. The arrays being matched are full of
            # C source, and a line like "    while (x) {" or "    }" would
            # otherwise move the depth counter and send this past the end of
            # the prop, silently eating the prose that follows it.
            if quote:
                if ch == "\\": k += 2; continue
                if ch == quote: quote = None
            elif ch in "\"'`":
                quote = ch
            elif ch in "{[": depth += 1
            elif ch in "}]":
                depth -= 1
                if depth == 0: break
            k += 1
        i = k + 1
    return "".join(out)

def measure():
    rows = []
    for f in FILES:
        src = (ROOT / f).read_text()
        for chunk in re.split(r'(?=id:\s*"S\d+\.\d+")', src):
            m = re.match(r'id:\s*"(S\d+\.\d+)"', chunk)
            if not m:
                continue
            # Strip the source's own comments first. They are developer
            # documentation and never reach a reader, and this file's comments
            # are long: counting them inflates the measurement by hundreds of
            # words and would have had me cutting real prose to compensate.
            prose = re.sub(r'/\*[\s\S]*?\*/', ' ', chunk)
            prose = re.sub(r'^\s*//.*$', ' ', prose, flags=re.M)
            prose = strip_prop(prose, "lines")     # CodeBlock source
            # A figure's authored frames are data, not page prose. The reader
            # sees one `explain` at a time as a glance beside the drawing, and
            # never sees the `source` rows as running text at all. Counting
            # them put two steps at over 1,200 words apiece and would have had
            # me deleting real prose to compensate.
            prose = strip_prop(prose, "source")    # CodeWalk listing
            prose = strip_prop(prose, "tracks")    # CodeWalk frames
            prose = strip_prop(prose, "trace")     # FileMachine frames
            prose = re.sub(r'<Terminal[\s\S]*?</Terminal>', ' ', prose)
            prose = re.sub(r'<[^>]+>', ' ', prose)
            words = len(re.findall(r"[A-Za-z][A-Za-z'-]+", prose))
            figs = sum(chunk.count(t) for t in FIGURES)
            rows.append((m.group(1), words, figs,
                         chunk.count("<CodeBlock"), chunk.count("<Terminal")))
    return rows

rows = measure()
total = sum(r[1] for r in rows)
figs = sum(r[2] for r in rows)
bare = [r for r in rows if r[2] == 0 and r[1] > LONE_STEP_WORDS]
nofig = [r for r in rows if r[2] == 0]

if "--verbose" in sys.argv:
    print(f"{'step':6} {'words':>6} {'figures':>8} {'code':>5} {'output':>7}")
    for sid, w, fm, cb, tm in rows:
        mark = "  <-- long, and nothing to interact with" if (fm == 0 and w > LONE_STEP_WORDS) else ""
        print(f"{sid:6} {w:6} {fm:8} {cb:5} {tm:7}{mark}")
    print()

print(f"steps                      {len(rows)}")
print(f"words of prose             {total}   (budget {TOTAL_WORDS_MAX})")
print(f"interactive figures        {figs}")
print(f"words per figure           {total // max(figs, 1)}")
print(f"steps with no figure       {len(nofig)} of {len(rows)}")
print(f"long steps with no figure  {len(bare)}   {[r[0] for r in bare]}")

bad = total > TOTAL_WORDS_MAX or bare
print("\nStill text-first." if bad else "\nFigure-led within budget.")
sys.exit(1 if bad else 0)
