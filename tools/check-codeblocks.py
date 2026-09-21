"""Every CodeBlock on the page must match the real program it names.

   Run from the repo root:  python3 tools/check-codeblocks.py

   The handout quotes its sample programs a few lines at a time, with a `from`
   giving the line number the excerpt starts at. Nothing else checks that the
   quoted lines are the real ones, or that `from` is right — and a wrong `from`
   is worse than useless, because the whole point of printing line numbers is
   so a student can say "line 14" to a classmate and be understood. One was
   already off by one before this existed.
"""
import pathlib, re, sys

ROOT = pathlib.Path(__file__).resolve().parent.parent
ASSETS = ROOT / "public/assets/file-io"
FILES = ["src/pages/file-io/steps-1-2.jsx", "src/pages/file-io/steps-3-4.jsx"]

def unescape(js):
    out, i = [], 0
    while i < len(js):
        c = js[i]
        if c == "\\" and i + 1 < len(js):
            nxt = js[i + 1]
            out.append({"n": "\n", "t": "\t", "\\": "\\", '"': '"', "'": "'"}.get(nxt, nxt))
            i += 2
        else:
            out.append(c); i += 1
    return "".join(out)

problems = checked = walked = 0
typed = set()
for f in FILES:
    src = (ROOT / f).read_text()
    # each CodeBlock: capture file=, from= and the lines array together
    for m in re.finditer(
        r'<CodeBlock\b(?P<attrs>[\s\S]*?)lines=\{\[(?P<lines>[\s\S]*?)\]\}', src):
        attrs = m.group("attrs")
        fm = re.search(r'file="([^"]+)"', attrs)
        fr = re.search(r'from=\{(\d+)\}', attrs)
        if not fm:
            continue                      # an unnamed fragment, not from a file
        name, start = fm.group(1), int(fr.group(1)) if fr else 1
        target = ASSETS / name
        if not target.exists():
            # forget.c is typed by the reader in stage 1 and deliberately not
            # offered as a download, so it has no file to check against.
            typed.add(name); continue
        real = target.read_text().split("\n")
        # A source line containing a double quote is written as a
        # single-quoted JS string, so both forms have to be matched, in order.
        # Matching only double-quoted strings picks up the INNER fragments of
        # those lines instead — 'test.txt' rather than the whole fopen call.
        quoted = [unescape(a or b) for a, b in re.findall(
            r'"((?:[^"\\]|\\.)*)"|\'((?:[^\'\\]|\\.)*)\'', m.group("lines"))]
        checked += 1
        for k, line in enumerate(quoted):
            want = real[start - 1 + k] if start - 1 + k < len(real) else "<past end of file>"
            if line != want:
                print(f"  !! {f}: {name} from={start}, offset {k} (source line {start + k})")
                print(f"     page:   {line!r}")
                print(f"     source: {want!r}")
                problems += 1


# CodeWalk renders its own source listing from a `source={[{ n, src }]}` prop.
# That is now the primary way code reaches the reader on this page — more lines
# than the remaining CodeBlocks carry — and it was going unchecked, which is
# exactly the gap that let an off-by-one `from` ship the first time.
for f in FILES:
    src = (ROOT / f).read_text()
    for m in re.finditer(r'<CodeWalk\b([\s\S]*?)source=\{\[([\s\S]*?)\]\}', src):
        fm = re.search(r'file="([^"]+)"', m.group(1))
        if not fm:
            print(f"  ?? {f}: a CodeWalk has a source listing but no file= prop")
            problems += 1; continue
        name = fm.group(1)
        target = ASSETS / name
        if not target.exists():
            typed.add(name); continue
        real = target.read_text().split("\n")
        rows = re.findall(
            r'\{\s*n:\s*(\d+)\s*,\s*src:\s*(?:"((?:[^"\\]|\\.)*)"|\'((?:[^\'\\]|\\.)*)\')\s*\}',
            m.group(2))
        walked += 1
        for num, a, b in rows:
            line = unescape(a or b)
            i = int(num)
            want = real[i - 1] if 0 < i <= len(real) else "<past end of file>"
            if line != want:
                print(f"  !! {f}: CodeWalk over {name}, line {i}")
                print(f"     page:   {line!r}")
                print(f"     source: {want!r}")
                problems += 1

print(f"\n{checked} code blocks and {walked} CodeWalk listings checked against public/assets/file-io/")
if typed: print(f"not checked (typed by the reader, not shipped): {', '.join(sorted(typed))}")
print("All code blocks match their source." if not problems else f"{problems} MISMATCH(ES)")
sys.exit(1 if problems else 0)
