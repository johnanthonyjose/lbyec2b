"""Structural validation of the File I/O step data.

   Run from anywhere:  python3 tools/check-steps.py

Checks what a build cannot: that ids are sequential within their stage, that
`n` agrees with the id, that every step has a checkpoint, that every predict
check has exactly one correct option, that a `fix` is always paired with a
`difficulty`, and that every FileMachine position is a real offset measured
from the compiled programs rather than an invented one.
"""
import pathlib, re, sys

ROOT = pathlib.Path(__file__).resolve().parent.parent
FILES = ["src/pages/file-io/steps-1-2.jsx", "src/pages/file-io/steps-3-4.jsx"]

# Offsets that actually occur, measured with ftell() against the compiled
# programs and independently re-verified: fgetc walks 0..44 one byte at a time,
# fgets lands on 12, 28, 44, and test.txt is 44 bytes with newlines at 11, 27.
VALID_POS = set(range(0, 45))

problems, notes = [], []
steps = []

for f in FILES:
    p = ROOT / f
    if not p.exists():
        problems.append(f"{f}: missing"); continue
    src = p.read_text()

    # split on step boundaries: each step starts with an id
    # Split only on a STEP id. Option objects inside a predict check also
    # begin with `id:`, so a looser split truncated every step before its
    # own options and made the whole file look malformed.
    chunks = re.split(r'(?=id:\s*"S\d+\.\d+")', src)
    for ch in chunks:
        m = re.search(r'id:\s*"(S(\d)\.(\d+))"', ch)
        if not m: continue
        sid, stage, n = m.group(1), int(m.group(2)), int(m.group(3))
        steps.append((sid, stage, n, f, ch))

by_stage = {}
for sid, stage, n, f, ch in steps:
    by_stage.setdefault(stage, []).append((sid, n, f, ch))

    dn = re.search(r'\bn:\s*(\d+)', ch)
    if dn and int(dn.group(1)) != n:
        problems.append(f"{sid}: id says step {n} but n: {dn.group(1)}")

    dstage = re.search(r'\bstage:\s*(\d+)', ch)
    if dstage and int(dstage.group(1)) != stage:
        problems.append(f"{sid}: id says stage {stage} but stage: {dstage.group(1)}")

    if "check:" not in ch:
        problems.append(f"{sid}: no check")

    kind = re.search(r'kind:\s*"(\w+)"', ch)
    if not kind:
        problems.append(f"{sid}: check has no kind")
    elif kind.group(1) == "predict":
        c = ch.count("correct: true")
        if c != 1:
            problems.append(f"{sid}: predict check has {c} correct options, expected 1")
        # Option ids are words ("twentyeight"), not single letters. Step ids
        # are the only ones matching S<n>.<n>, so anything else inside the
        # chunk is an option.
        opts = len(re.findall(r'\bid:\s*"(?!S\d+\.)[A-Za-z][\w-]*"', ch))
        if opts < 2:
            problems.append(f"{sid}: predict check has {opts} options")
    elif kind.group(1) == "self":
        if "ok:" not in ch or "alt:" not in ch:
            problems.append(f"{sid}: self check missing ok/alt")

    fix_ids = re.findall(r'\bfix:\s*(?:\[([^\]]*)\]|(\d+))', ch)
    flat = []
    for grp, single in fix_ids:
        flat += [x.strip() for x in grp.split(",") if x.strip()] if grp else [single]
    has_fix = flat
    if has_fix and "difficulty:" not in ch:
        problems.append(f"{sid}: fix {','.join(has_fix)} without a difficulty line")
    if "difficulty:" in ch and not has_fix:
        problems.append(f"{sid}: difficulty without a fix")

    for pos in re.findall(r'\bpos:\s*(\d+)', ch):
        if int(pos) not in VALID_POS:
            problems.append(f"{sid}: FileMachine pos {pos} is not a measured offset")

for stage in sorted(by_stage):
    ns = [n for _, n, _, _ in by_stage[stage]]
    if ns != list(range(1, len(ns) + 1)):
        problems.append(f"stage {stage}: step numbers are {ns}, expected 1..{len(ns)}")

# the six resolutions must each be reachable from the step they name
EXPECT = {1: "S1.2", 2: "S1.2", 3: "S1.2", 4: "S2.4", 5: "S3.3", 6: "S3.5"}
found = {}
for sid, stage, n, f, ch in steps:
    for grp, single in re.findall(r'\bfix:\s*(?:\[([^\]]*)\]|(\d+))', ch):
        for x in ([y.strip() for y in grp.split(",") if y.strip()] if grp else [single]):
            found[int(x)] = sid
for fid, want in EXPECT.items():
    got = found.get(fid)
    if got != want:
        problems.append(f"resolution {fid} should be on {want}, found on {got}")

machines = sum(ch.count("<FileMachine") for _, _, _, _, ch in steps)
predicts = sum(1 for _, _, _, _, ch in steps if 'kind: "predict"' in ch)

print(f"steps: {len(steps)}   stages: {sorted(by_stage)}")
print("per stage:", {k: len(v) for k, v in sorted(by_stage.items())})
print(f"predict checks: {predicts} of {len(steps)}")
print(f"FileMachine figures: {machines}")
print()
if problems:
    print(f"{len(problems)} PROBLEM(S):")
    for x in problems: print("  -", x)
    sys.exit(1)
print("All structural checks passed.")
