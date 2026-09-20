"""Proves a prose rewrite changed only prose.

   Run from the repo root:
     python3 tools/check-invariants.py --save before.json     (before editing)
     python3 tools/check-invariants.py --diff before.json      (after editing)

   The step files carry two kinds of content. The prose is meant to be rewritten
   freely. Everything else — the verified C, the byte offsets measured with
   ftell, the exact program output, the step ids a reader's saved progress is
   keyed on, and which option is the correct one — is ground truth that a
   rewrite must not touch, and that no amount of reading the diff will reliably
   catch across two thousand lines. This extracts exactly that and compares it.
"""
import pathlib, re, json, sys

ROOT = pathlib.Path(__file__).resolve().parent.parent
FILES = ["src/pages/file-io/steps-1-3.jsx", "src/pages/file-io/steps-4-5.jsx"]

def extract():
    out = {"code": [], "terminals": [], "pos": [], "steps": [], "correct": [], "calls": []}
    for f in FILES:
        src = (ROOT / f).read_text()

        # Every source line shown to the reader, in order.
        for block in re.findall(r'lines=\{\[(.*?)\]\}', src, re.S):
            for line in re.findall(r'"((?:[^"\\]|\\.)*)"', block):
                out["code"].append(line)

        # Exact expected output.
        for t in re.finditer(r'<Terminal[^>]*>\s*\{`(.*?)`\}', src, re.S):
            out["terminals"].append(t.group(1))

        # Stream positions and the C calls they belong to.
        out["pos"] += re.findall(r'\bpos:\s*(\d+)', src)
        out["calls"] += re.findall(r"\bcall:\s*['\"](.*?)['\"],", src)

        # Step identity and gating.
        for m in re.finditer(r'id:\s*"(S\d+\.\d+)"[\s\S]{0,400}?stage:\s*(\d+),\s*n:\s*(\d+)', src):
            out["steps"].append(list(m.groups()))
        for m in re.finditer(r'\bfix:\s*(\d+)', src):
            out["steps"].append(["fix", m.group(1)])

        # Which option is the right one. The id is what gets stored, so a
        # rewrite may change a label freely but never move `correct: true`.
        for m in re.finditer(r'id:\s*"([a-z][\w-]*)",\s*\n\s*label:[\s\S]{0,600}?correct:\s*true', src):
            out["correct"].append(m.group(1))
    return out

def main():
    mode = sys.argv[1] if len(sys.argv) > 1 else "--show"
    data = extract()
    if mode == "--save":
        pathlib.Path(sys.argv[2]).write_text(json.dumps(data, indent=1))
        for k, v in data.items(): print(f"  captured {len(v):4d}  {k}")
        return 0
    if mode == "--diff":
        old = json.loads(pathlib.Path(sys.argv[2]).read_text())
        bad = False
        for k in data:
            if old.get(k) != data[k]:
                bad = True
                o, n = old.get(k, []), data[k]
                print(f"\n!! {k} CHANGED ({len(o)} -> {len(n)})")
                for a, b in zip(o, n):
                    if a != b: print(f"   was: {a!r}\n   now: {b!r}")
                for extra in n[len(o):]: print(f"   added: {extra!r}")
                for gone in o[len(n):]: print(f"   removed: {gone!r}")
            else:
                print(f"  ok  {len(data[k]):4d}  {k} unchanged")
        return 1 if bad else 0
    for k, v in data.items(): print(f"{k}: {len(v)}")
    return 0

sys.exit(main())
