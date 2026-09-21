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
FILES = ["src/pages/file-io/steps-1-2.jsx", "src/pages/file-io/steps-3-4.jsx"]

def extract():
    out = {"code": [], "terminals": [], "pos": [], "steps": [], "correct": [], "calls": []}
    for f in FILES:
        src = (ROOT / f).read_text()

        # Every source line shown to the reader, tagged with the step it is in.
        #
        # Tagging matters. Bare lines collide constantly — "    }" and the empty
        # string occur dozens of times — and a value-keyed diff then cannot tell
        # which instances were removed. It reported a clean, intentional
        # deletion as "order BROKEN" and would have hidden a real reordering
        # just as easily. The step id makes each entry unique enough to trust.
        #
        # Both quoting forms are matched: a source line containing a double
        # quote is written as a single-quoted JS string.
        for chunk in re.split(r'(?=id:\s*"S\d+\.\d+")', src):
            m = re.match(r'id:\s*"(S\d+\.\d+)"', chunk)
            sid = m.group(1) if m else "?"
            for block in re.findall(r'lines=\{\[(.*?)\]\}', chunk, re.S):
                for a, b in re.findall(r'"((?:[^"\\]|\\.)*)"|\'((?:[^\'\\]|\\.)*)\'', block):
                    out["code"].append(f"{sid}|{a or b}")

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
        #
        # Parsed by splitting on option boundaries rather than by one regex
        # spanning both fields: a span-based match drifts into the NEXT option
        # whenever a note changes length, and reports a violation that is
        # really just prose getting longer. It did exactly that twice.
        for chunk in re.split(r'(?=\bid:\s*"(?!S\d+\.)[a-z])', src):
            m = re.match(r'id:\s*"([a-z][\w-]*)"', chunk)
            if not m:
                continue
            body = chunk[: chunk.find('id:', 1) if chunk.find('id:', 1) != -1 else len(chunk)]
            if re.search(r'\bcorrect:\s*true', body):
                out["correct"].append(m.group(1))
    return out

def main():
    mode = sys.argv[1] if len(sys.argv) > 1 else "--show"
    data = extract()
    if mode == "--save":
        pathlib.Path(sys.argv[2]).write_text(json.dumps(data, indent=1))
        for k, v in data.items(): print(f"  captured {len(v):4d}  {k}")
        return 0
    if mode == "--subseq":
        # A round that ADDS material shifts every later entry, so a positional
        # compare reports the whole file as changed and hides a real edit in
        # the noise. The question that matters is whether every original entry
        # still appears, unaltered and in the same relative order.
        #
        # Two separate questions, answered separately, because conflating them
        # was actively misleading: a single greedy scan reports every entry
        # after the first missing one as missing too, which buries the one
        # fact you needed.
        from collections import Counter
        old = json.loads(pathlib.Path(sys.argv[2]).read_text())
        norm = lambda x: json.dumps(x, sort_keys=True) if isinstance(x, (list, dict)) else x
        bad = False
        for k in data:
            o = [norm(x) for x in old.get(k, [])]
            n = [norm(x) for x in data[k]]

            gone = Counter(o) - Counter(n)          # what actually disappeared
            budget = dict(gone)
            it, in_order = iter(n), True
            for x in o:
                if budget.get(x, 0):                # a known deletion; skip it
                    budget[x] -= 1
                    continue
                if not any(y == x for y in it):
                    in_order = False
                    break

            if gone or not in_order:
                bad = True
                print(f"\n!! {k}: {sum(gone.values())} removed, order {'kept' if in_order else 'BROKEN'}")
                for x, c in sorted(gone.items()):
                    print(f"   removed x{c}: {x}")
            else:
                print(f"  ok  {len(o):4d} -> {len(n):4d}  {k}: all originals intact, {len(n)-len(o)} added")
        return 1 if bad else 0

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
