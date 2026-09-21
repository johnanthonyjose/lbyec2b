import React from "react";
import { CodeBlock, Terminal } from "./CodeBlock.jsx";
import { BufferMachine } from "../../components/explorable/BufferMachine.jsx";
import { CodeWalk } from "../../components/explorable/CodeWalk.jsx";
import { ModeExplorer } from "../../components/explorable/ModeExplorer.jsx";

/* Stages 1 to 3 of the File I/O handout: the problem, the open, the write.

   The source document opened with an assertion — data in memory is lost when
   the computer is switched off — and then moved straight on to library names.
   An assertion is not a reason to learn anything, so stage 1 here produces no
   file at all. It spends its six minutes making the reader watch a program of
   their own forget a number they typed into it, because a reader who has seen
   that has a reason for everything that follows.

   Stage 2 carries more warnings than any other stage here, and deliberately
   so. Of the six anticipated difficulties this page carries, three belong to
   opening a file, and all three are silent: the program compiles, runs,
   returns zero and does nothing. Nothing else in the course behaves like that,
   so the habits that make it visible — the NULL check, perror, forward
   slashes, knowing which directory the process runs in — are taught before the
   first byte is written rather than after the first hour is lost. Its last
   step opens two files at once, because a program with an input and an output
   is the ordinary case and every later program on this page is one.

   Stage 2 is also where the stream model is taught, because S2.1 is where the
   reader first meets FILE. A stream is an ordered byte sequence plus the state
   required to traverse it; FILE is the object holding that state; fopen
   constructs it and its layout is implementation-defined, which is why the
   interface is a pointer. The reframing that carries the stage is that stdin,
   stdout and stderr are FILE * streams opened before main is entered, so the
   reader has been calling fprintf and fscanf since week one without being told.

   Stage 3 is built around buffering, which is the one thing in these three
   stages that cannot be seen in the source at all. S3.4 therefore hands the
   mechanism to BufferMachine, which animates the bytes accumulating while the
   file stays empty, the flush at fclose, the system-call count in both modes,
   and what an abnormal termination leaves behind. The prose beside it no longer
   narrates any of that. It keeps only what the figure cannot show: the names of
   the three buffering policies, and the fact that exit flushes every open
   stream, so a program returning from main writes its buffer with or without
   fclose and only abnormal termination loses it. That last point was wrong in
   an earlier draft of this page; it was checked against a compiler, and it is
   not to be restated as "a missing fclose empties the file".

   The register is academic professional: mechanism before procedure, technical
   vocabulary defined where it is first used, and no analogies. The figures
   carry the explanation and the prose serves them, so where a figure teaches a
   mechanism the paragraphs that taught it have been removed rather than
   shortened. Corrections to the older course handout are student-facing noise,
   so they live in the `why` folds and in resolutions.jsx, never in a step body.

   forget.c is seventeen lines and is therefore shown whole, in one block.
   01-open.c, 02-write.c, 03-append.c and 10-twofiles.c are long enough to be
   split, and they are split at step boundaries so that each fragment arrives
   with the reason it exists.

   Every byte count, every stream position and every line of terminal output
   below is transcribed from the verified program set. Nothing here was
   calculated by hand. */

export const steps13 = [
  /* ─────────────────────────────────────────────────────────────────────────
     Stage 1 — Why a program forgets
     ───────────────────────────────────────────────────────────────────────── */
  {
    id: "S1.1",
    stage: 1, n: 1,
    title: "Watch a program lose the value you gave it",
    action: <>Type the short program below into a file called <code className="aw-code">forget.c</code>, compile it, and run it twice.</>,
    body: (
      <p className="aw-p">
        The program reads an integer, prints it back, and returns from{" "}
        <code className="aw-code">main</code>. Nothing in it records anything
        outside the memory the running program was given.
      </p>
    ),
    media: (
      <CodeBlock
        file="forget.c"
        from={1}
        lines={[
          "#include <stdio.h>",
          "",
          "int main(void) {",
          "",
          "    //One variable. It lives in memory for exactly as",
          "    //long as main does, and not one instruction longer.",
          "    int n;",
          "",
          '    printf("Give me a number: ");',
          '    scanf("%i", &n);',
          "",
          '    printf("You gave me %i.\\n", n);',
          "",
          "    //Nothing here writes anything anywhere. When main",
          "    //returns there is no record of n outside this run.",
          "    return 0;",
          "}"
        ]}
        focus={[6]}
        caption="The complete program. Compile it with: gcc -Wall -o forget forget.c"
      />
    ),
    check: {
      kind: "predict",
      question: "Run it once and give it a number. Now run it a second time. What will the second run print?",
      options: [
        {
          id: "remembers",
          label: "The number from the first run",
          note: "It is tempting to assume the program still holds it. No statement in forget.c places that integer anywhere outside the run that read it."
        },
        {
          id: "asks-again",
          label: "It asks for a number again, and knows nothing about the first run",
          correct: true,
          note: "Correct. The second run is a distinct process with an address space of its own, and the first run's value is not reachable from it at all."
        },
        {
          id: "zero",
          label: "Zero, because n is reset",
          note: "The right answer for the wrong reason. An uninitialized local variable holds whatever bytes already occupied its storage. The point is not that the value became zero, but that no value survived the process."
        }
      ]
    }
  },
  {
    id: "S1.2",
    stage: 1, n: 2,
    title: "Name the mechanism",
    action: <>Read the paragraphs below, then state the reason for what you observed in one sentence of your own.</>,
    body: (
      <>
        <p className="aw-p">
          The variable <code className="aw-code">n</code> lived in main memory,
          part of the <strong>address space</strong> of the{" "}
          <strong>process</strong>, which is your program as the operating system
          runs it. When <code className="aw-code">main</code> returned the process
          terminated, and the operating system reclaimed that address space.
        </p>
        <p className="aw-p">
          What a program must keep therefore goes outside the process, into a{" "}
          <strong>file</strong>: a named sequence of bytes held on{" "}
          <strong>secondary storage</strong>, which is far larger than main
          memory, slower to reach by orders of magnitude, and retains its
          contents when power is removed.
        </p>
      </>
    ),
    why: {
      label: "Where does the number actually go?",
      body: <>The memory is not erased. The operating system marks those pages as available, and the next process to request memory receives them, along with whatever your run happened to leave there. Nothing ever reads that residue back, because nothing knows it is present. A file, by contrast, carries a name, and a name is precisely what allows something to ask for the bytes later.</>
    },
    check: {
      kind: "self",
      question: "Without looking back, can you say in one sentence why the second run lost your number?",
      ok: {
        label: "Yes — the process terminated and its address space went with it",
        note: "That is the sentence, and the four stages that follow are all methods of placing bytes somewhere that sentence does not apply to."
      },
      alt: {
        label: "Not quite yet",
        note: <>Read the second paragraph again, then look at the program beside it. No statement in <code className="aw-code">forget.c</code> names a location outside the process. Storage that carries no name cannot be asked for later, and memory belonging to a process that has terminated cannot be asked for at all.</>
      }
    }
  },
  {
    id: "S1.3",
    stage: 1, n: 3,
    title: "Open a compiled program in a text editor",
    action: <>Open a compiled program in Notepad, TextEdit or VS Code. Do not run it. Examine what the editor displays.</>,
    body: (
      <>
        <p className="aw-p">
          Most of what appears is unreadable. The editor displayed the character
          each byte denotes under its text encoding, and those bytes were never
          intended to denote characters.
        </p>
        <p className="aw-p">
          A file is a sequence of bytes and nothing more;{" "}
          <strong>text</strong> and <strong>binary</strong> are two contracts
          under which a program may read that sequence. Under the text contract
          each byte, or each short group of bytes, denotes a character, and the
          characters are organized into <strong>lines</strong> separated by a
          newline, which is what <strong>human-readable</strong> means. Under the
          binary contract a byte denotes whatever the writing application decided
          it would denote. Nothing stored inside the file records which contract
          was intended.
        </p>
      </>
    ),
    check: {
      kind: "predict",
      question: "You save that mess from Notepad, then try to run the program again. What happens?",
      options: [
        {
          id: "fine",
          label: "It runs as before — you only opened it, you did not change anything",
          note: "Opening alone is harmless; saving is not. Notepad writes back what it is displaying, and it cannot display bytes for which its encoding provides no character."
        },
        {
          id: "broken",
          label: "It is damaged and will probably refuse to run",
          correct: true,
          note: "Correct, and this is why the exercise is to look rather than to save. Every byte the editor could not represent is written back as a substitute character, so the machine instructions become different instructions."
        },
        {
          id: "slower",
          label: "It runs, but slower or with odd output",
          note: "Corrupted machine code is rarely graceful. The operating system validates the structure of an executable before transferring control to it, and the usual outcome is a refusal to start."
        }
      ]
    }
  },
  {
    id: "S1.4",
    stage: 1, n: 4,
    title: "Stop trusting the extension",
    action: <>Rename a copy of any text file you have to <code className="aw-code">something.png</code>, then open it in Notepad again.</>,
    body: (
      <>
        <p className="aw-p">
          It is still your text. A filename extension is a{" "}
          <strong>convention</strong>: a claim about the contract under which the
          bytes are meant to be read, which nothing enforces and nothing verifies
          against the contents. <code className="aw-code">fopen</code> inspects
          neither the name nor the contents either, so reading a file under the
          wrong contract reports no error. Everything from this point onward
          concerns <strong>text files only</strong>.
        </p>
      </>
    ),
    why: {
      label: "Then how does anything know what a file is?",
      body: <>Principally by inspecting the contents. Many formats begin with a short fixed byte sequence called a <em>magic number</em>: a PNG opens with 0x89 followed by the letters PNG, and a PDF opens with %PDF. Editors read those bytes and treat the extension as no more than a hint.</>
    },
    check: {
      kind: "self",
      question: "Could you explain to a classmate what a file is, and how text differs from binary?",
      ok: {
        label: "Yes — a named sequence of bytes, read under one contract or the other",
        note: "That is stage 1. You have the problem and you have the vocabulary for it. Stage 2 opens a file."
      },
      alt: {
        label: "I could name them but not explain the difference",
        note: <>Return to what Notepad did with the executable. It carried out exactly one operation: display the character that each byte denotes. That operation is the text contract, and a binary file is one for which it yields nonsense.</>
      }
    }
  },

  /* ─────────────────────────────────────────────────────────────────────────
     Stage 2 — Opening a file
     ───────────────────────────────────────────────────────────────────────── */
  {
    id: "S2.1",
    stage: 2, n: 1,
    title: "Streams, and the FILE object behind them",
    action: <>Start a new file called <code className="aw-code">01-open.c</code> with <code className="aw-code">#include &lt;stdio.h&gt;</code>, <code className="aw-code">int main(void)</code>, and the declaration <code className="aw-code">FILE *fp;</code> inside it.</>,
    body: (
      <>
        <p className="aw-p">
          File access needs no header beyond the{" "}
          <code className="aw-code">stdio.h</code> you already include. The
          library models every file as a <strong>stream</strong>: an ordered
          sequence of bytes together with the state required to traverse it — the{" "}
          <strong>position</strong>, the <strong>buffering mode</strong>, and the
          end-of-file and error <strong>indicators</strong> — held in a{" "}
          <code className="aw-code">FILE</code> object.
        </p>
        <p className="aw-p">
          You never manipulate that object directly.{" "}
          <code className="aw-code">fopen</code> constructs one and returns a{" "}
          <code className="aw-code">FILE *</code> referring to it, every
          subsequent operation takes that pointer, and{" "}
          <code className="aw-code">fclose</code> releases it. Its layout is{" "}
          <strong>implementation-defined</strong>, which is why the interface
          hands you a pointer rather than a value.
        </p>
        <p className="aw-p">
          You have been using streams since your first program:{" "}
          <code className="aw-code">printf(...)</code> is{" "}
          <code className="aw-code">fprintf(stdout, ...)</code>, and the runtime
          opens <code className="aw-code">stdin</code>,{" "}
          <code className="aw-code">stdout</code> and{" "}
          <code className="aw-code">stderr</code> before{" "}
          <code className="aw-code">main</code> is entered. Your own file is a
          fourth stream beside them.
        </p>
      </>
    ),
    why: {
      label: "Why a pointer, and not a variable of type FILE?",
      body: <>Because the bookkeeping belongs to the library rather than to you. Copying a <code className="aw-code">FILE</code> would produce an unsynchronized duplicate of private state rather than a second handle on the same stream, so a pointer guarantees one authoritative record per open stream. An older handout named <code className="aw-code">stdlib.h</code> for the file functions; the correct header is <code className="aw-code">stdio.h</code>, for reading and writing alike.</>
    },
    check: {
      kind: "self",
      question: "Does your file so far contain the stdio.h include and the FILE * declaration?",
      ok: {
        label: "Yes, and it compiles",
        note: "A program that declares a pointer and does nothing further with it is legal, and it does nothing. The next step gives that pointer a stream to refer to."
      },
      alt: {
        label: "The compiler complains about FILE",
        note: <>An "unknown type name FILE" means that <code className="aw-code">stdio.h</code> is missing or misspelled, since the type is declared nowhere else. Check the spelling: <code className="aw-code">stdio</code>, not <code className="aw-code">studio</code>.</>
      }
    }
  },
  {
    id: "S2.2",
    stage: 2, n: 2,
    title: "Name the file you want",
    action: <>Add the <code className="aw-code">fopen</code> call, using the bare name <code className="aw-code">"test.txt"</code> with no path in front of it.</>,
    body: (
      <>
        <p className="aw-p">
          <code className="aw-code">fopen</code> takes a file name and a{" "}
          <strong>mode</strong> string, and returns the stream.{" "}
          <code className="aw-code">"r"</code> opens an existing file for reading
          and creates nothing, so this program is meant to fail first. A trailing{" "}
          <code className="aw-code">b</code> requests a binary stream instead;
          every mode here is a text mode.
        </p>
        <p className="aw-p">
          A bare name such as <code className="aw-code">"test.txt"</code> is
          resolved against the directory the program runs from, not the one its
          source sits in. Paths, absolute and relative, are tabulated in the
          reference below.
        </p>
        <p className="aw-p">
          Whichever kind you write, use forward slashes. In C source a backslash
          begins an <strong>escape sequence</strong> that the compiler resolves
          before the program runs, so{" "}
          <code className="aw-code">"c:\temp\data.txt"</code> is not the path it
          appears to be: <code className="aw-code">\t</code> is one tab
          character, and what reaches <code className="aw-code">fopen</code> is a
          name no drive holds. Windows accepts forward slashes, and the same
          source then runs unchanged on macOS.
        </p>
      </>
    ),
    why: {
      label: "What is wrong with \"c:\\temp\\test1.txt\"?",
      body: <>In C source a backslash introduces an <strong>escape sequence</strong>, which the compiler resolves before your program ever runs. <code className="aw-code">\t</code> is not a backslash followed by a t; it is a single tab character. What <code className="aw-code">fopen</code> receives is therefore <code className="aw-code">c:</code>, a tab, <code className="aw-code">emp</code>, another tab, and <code className="aw-code">est1.txt</code>. Forward slashes avoid the problem entirely, and doubling each backslash also works.</>
    },
    difficulty: "A Windows path with backslashes silently fails",
    fix: 2,
    check: {
      kind: "predict",
      question: "A classmate writes fopen(\"c:\\temp\\data.txt\", \"r\") and the program prints nothing. How many characters does the string they passed actually contain?",
      options: [
        {
          id: "sixteen",
          label: "Sixteen — exactly what they typed",
          note: "That is what the line looks like on the screen, which is why the fault conceals itself. The compiler resolves escape sequences first, so what was typed and what is passed are different strings."
        },
        {
          id: "fourteen",
          label: "Fourteen, because each backslash pair collapsed to one character",
          correct: true,
          note: <>Correct. <code className="aw-code">\t</code> collapses to a tab and <code className="aw-code">\d</code> to a plain <code className="aw-code">d</code>. What reaches <code className="aw-code">fopen</code> is <code className="aw-code">c:</code>, a tab, then <code className="aw-code">empdata.txt</code>: sixteen characters typed, fourteen passed, and no such file on the drive.</>
        },
        {
          id: "error",
          label: "None — it would not compile",
          note: <>An unrecognized escape such as <code className="aw-code">\d</code> is a warning rather than an error, so the program compiles and runs. Nothing stops you, and the failure arrives later and in silence.</>
        }
      ]
    }
  },
  {
    id: "S2.3",
    stage: 2, n: 3,
    title: "Check for NULL, and report the reason",
    action: <>Add the NULL check with <code className="aw-code">perror</code> immediately after the <code className="aw-code">fopen</code>. Never leave a gap between them.</>,
    body: (
      <>
        <p className="aw-p">
          <code className="aw-code">fopen</code> reports failure by returning a
          null pointer and setting <code className="aw-code">errno</code>, the
          library variable recording the most recent error condition. It prints
          nothing of its own, so execution continues with a pointer that refers
          to no stream, and passing that pointer to any later call is{" "}
          <strong>undefined behavior</strong>: the standard imposes no
          requirement whatever on what follows.
        </p>
        <p className="aw-p">
          <code className="aw-code">perror</code> renders{" "}
          <code className="aw-code">errno</code> into a diagnostic: your message,
          a colon, then the implementation's text for the current error, such as{" "}
          <code className="aw-code">No such file or directory</code>. That second
          half is the difference between knowing that the open failed and knowing
          why.
        </p>
      </>
    ),
    media: (
      <CodeWalk
        title="One call, two outcomes"
        notice="Line 12 is identical in both runs. Watch what fp holds on line 17."
        caption={<>The whole of <code className="aw-code">01-open.c</code>, assembled across steps 1 to 4 of this stage and run twice from a real terminal: once in a directory with no <code className="aw-code">test.txt</code>, and once after stage 3 has written it. Comment lines are omitted from the source window; the line numbers are the file's own. Nothing at the call site distinguishes the two runs, which is precisely why the value in <code className="aw-code">fp</code> has to be tested rather than assumed.</>}
        file="01-open.c"
        source={[
          { n: 1, src: "#include <stdio.h>" },
          { n: 2, src: "" },
          { n: 3, src: "int main(void) {" },
          { n: 4, src: "" },
          { n: 7, src: "    FILE *fp;" },
          { n: 8, src: "" },
          { n: 12, src: '    fp = fopen("test.txt", "r");' },
          { n: 13, src: "" },
          { n: 17, src: "    if (fp == NULL) {" },
          { n: 18, src: '        perror("Could not open test.txt");' },
          { n: 19, src: "        return 1;   //non-zero tells the shell the run failed" },
          { n: 20, src: "    }" },
          { n: 21, src: "" },
          { n: 22, src: '    printf("test.txt opened for reading.\\n");' },
          { n: 23, src: "" },
          { n: 25, src: "    fclose(fp);" },
          { n: 26, src: "" },
          { n: 27, src: "    return 0;" },
          { n: 28, src: "}" }
        ]}
        tracks={[
          {
            id: "missing",
            label: "The file is missing",
            frames: [
              {
                lines: [7],
                explain: "The declaration reserves a handle. It refers to no stream yet, and its value is indeterminate.",
                vars: { fp: "indeterminate" }
              },
              {
                lines: [12],
                explain: "fopen found no test.txt in the working directory, so it returned a null pointer and set errno.",
                vars: { fp: "NULL", errno: "ENOENT" }
              },
              {
                lines: [17],
                explain: "The comparison is true, so control enters the block. This line is the only thing separating the two runs.",
                vars: { fp: "NULL", errno: "ENOENT" }
              },
              {
                lines: [18],
                explain: "perror writes the message, a colon, and the library's text for the current errno to the standard error stream.",
                vars: { fp: "NULL", errno: "ENOENT" },
                out: ["Could not open test.txt: No such file or directory"]
              },
              {
                lines: [19],
                explain: "main returns 1, so the shell records exit status 1 and no fclose is reached, there being no stream to close.",
                vars: { fp: "NULL" },
                note: "Delete lines 17 to 20 and this run would carry the null pointer into fclose. That is undefined behavior, not a diagnosed error: the standard imposes no requirement on what follows, so the failure may be a crash, silence, or anything else.",
                out: ["Could not open test.txt: No such file or directory"]
              }
            ]
          },
          {
            id: "present",
            label: "The file is there",
            frames: [
              {
                lines: [7],
                explain: "The same declaration, reserving the same handle. Nothing yet distinguishes this run from the other.",
                vars: { fp: "indeterminate" }
              },
              {
                lines: [12],
                explain: "The same call, with the same arguments. This time the file exists, so fopen constructed a FILE object and returned a pointer to it.",
                vars: { fp: "a FILE object" }
              },
              {
                lines: [17],
                explain: "The comparison is false, so the block is skipped. The value in fp, not the code, chose the branch.",
                vars: { fp: "a FILE object" }
              },
              {
                lines: [22],
                explain: "Execution resumes after the block and the message reaches the standard output stream.",
                vars: { fp: "a FILE object" },
                out: ["test.txt opened for reading."]
              },
              {
                lines: [25],
                explain: "fclose releases the FILE object and the resources beneath it, after which the pointer may no longer be used.",
                vars: { fp: "no longer usable" },
                out: ["test.txt opened for reading."]
              },
              {
                lines: [27],
                explain: "main returns 0, so the shell records exit status 0 and the run reports success.",
                out: ["test.txt opened for reading."]
              }
            ]
          }
        ]}
      />
    ),
    difficulty: "fopen returned NULL",
    fix: 1,
    check: {
      kind: "predict",
      question: "You compile and run this now, before writing test.txt. What appears?",
      options: [
        {
          id: "nothing",
          label: "Nothing — the program returns 1 and exits",
          note: <>The <code className="aw-code">return 1</code> does end the run, but <code className="aw-code">perror</code> has already written its diagnostic by the time that statement is reached.</>
        },
        {
          id: "perror-line",
          label: "Could not open test.txt: No such file or directory",
          correct: true,
          note: "Correct, and that is the exact line: your message, a colon, and the reason recorded by the operating system. The program is behaving as intended, because the file genuinely is not there yet."
        },
        {
          id: "opened",
          label: "test.txt opened for reading.",
          note: <>Only once <code className="aw-code">test.txt</code> exists. The mode <code className="aw-code">"r"</code> never creates a file, so on a first run in an empty directory there is nothing for it to open.</>
        }
      ]
    }
  },
  {
    id: "S2.4",
    stage: 2, n: 4,
    title: "Close the stream, and run it twice",
    action: <>Add <code className="aw-code">fclose(fp)</code> and <code className="aw-code">return 0</code>, compile, and run the program now — before <code className="aw-code">test.txt</code> exists.</>,
    body: (
      <>
        <p className="aw-p">
          <code className="aw-code">fclose</code> guarantees three things in
          order: it flushes any output still held for the stream, it releases the{" "}
          <code className="aw-code">FILE</code> object and the resources beneath
          it, and it leaves the pointer no longer usable. Stage 3 concerns the
          first; here the second matters, because a process may hold only a
          bounded number of open streams. Run the program now for the first of
          the two outputs below, and again after stage 3 for the second.
        </p>
      </>
    ),
    media: (
      <>
        <Terminal label="Run in a directory with no test.txt — exit status 1">
{`Could not open test.txt: No such file or directory`}
        </Terminal>
        <Terminal label="Run again after stage 3 has created it — exit status 0">
{`test.txt opened for reading.`}
        </Terminal>
      </>
    ),
    why: {
      label: "Why return 1 rather than 0?",
      body: <>The value <code className="aw-code">main</code> returns is the program's <strong>exit status</strong>, which the shell retains and any calling process can read. Zero conventionally means the run succeeded. Nothing inspects the status here, but your program will soon be one stage of a pipeline, and a truthful status is what tells the next stage whether to run.</>
    },
    difficulty: "The program runs, prints nothing, and exits normally",
    fix: 3,
    check: {
      kind: "self",
      question: "Did you see the perror line, with a reason after the colon?",
      ok: {
        label: "Yes — it told me the file does not exist",
        note: "That is the habit this stage exists to install. Your program now fails audibly."
      },
      alt: {
        label: "It ran and printed nothing at all",
        note: <>Silence together with a zero exit status means that neither branch printed anything. Check that the <code className="aw-code">printf</code> sits outside the <code className="aw-code">if</code> block, and that nothing returns before it is reached.</>
      }
    }
  },
  {
    id: "S2.5",
    stage: 2, n: 5,
    title: "Open two streams at once",
    action: <>Step through <code className="aw-code">10-twofiles.c</code> in the figure below rather than running it.</>,
    body: (
      <>
        <p className="aw-p">
          Almost every useful program has an input and an output, which means two
          streams open at once. Each <code className="aw-code">fopen</code>{" "}
          constructs a separate <code className="aw-code">FILE</code> object with
          its own position, buffer and indicators, and the figure below is where
          that separateness becomes visible rather than asserted. The loop uses
          stage 4's reading calls, which arrive later.
        </p>
      </>
    ),
    media: (
      <>
        <CodeWalk
          title="Two streams, two positions"
          notice="Two positions are shown side by side. Watch how rarely they move together."
          file="10-twofiles.c"
          caption={<>A real run of <code className="aw-code">10-twofiles.c</code> over the sixteen lines of <code className="aw-code">cars.txt</code>. The positions are the values <code className="aw-code">ftell</code> reported on each stream after every iteration, not estimates; comment lines are omitted from the source window and the line numbers are the file's own. Count the pointers, the checks and the closes as you go, and note what the second check does before it returns, since one open that failed is no reason to abandon one that succeeded.</>}
          source={[
            { n: 1, src: "#include <stdio.h>" },
            { n: 2, src: "#include <string.h>" },
            { n: 3, src: "" },
            { n: 7, src: "int main(void) {" },
            { n: 8, src: "" },
            { n: 9, src: "    FILE *fpIn, *fpOut;" },
            { n: 10, src: "    char line[120];" },
            { n: 11, src: "    int cars = 0;" },
            { n: 12, src: "" },
            { n: 15, src: '    fpIn = fopen("cars.txt", "r");' },
            { n: 16, src: "" },
            { n: 17, src: "    if (fpIn == NULL) {" },
            { n: 18, src: '        perror("Could not open cars.txt for reading");' },
            { n: 19, src: "        return 1;" },
            { n: 20, src: "    }" },
            { n: 21, src: "" },
            { n: 22, src: '    fpOut = fopen("plates.txt", "w");' },
            { n: 23, src: "" },
            { n: 24, src: "    if (fpOut == NULL) {" },
            { n: 25, src: '        perror("Could not open plates.txt for writing");' },
            { n: 26, src: "        fclose(fpIn);           //the input is open; close it" },
            { n: 27, src: "        return 1;" },
            { n: 28, src: "    }" },
            { n: 29, src: "" },
            { n: 31, src: "    while (fgets(line, 120, fpIn) != NULL) {" },
            { n: 32, src: "" },
            { n: 33, src: "        int n = (int) strlen(line);" },
            { n: 34, src: "        if (n > 0 && line[n - 1] == '\\n') {" },
            { n: 35, src: "            line[n - 1] = '\\0';" },
            { n: 36, src: "        }" },
            { n: 37, src: "" },
            { n: 38, src: "        cars = cars + 1;" },
            { n: 39, src: "" },
            { n: 40, src: "        if (cars % 4 == 0) {" },
            { n: 41, src: '            fprintf(fpOut, "%s\\n", line);' },
            { n: 42, src: "        }" },
            { n: 43, src: "    }" },
            { n: 44, src: "" },
            { n: 46, src: "    fclose(fpIn);" },
            { n: 47, src: "    fclose(fpOut);" },
            { n: 48, src: "" },
            { n: 49, src: '    printf("Wrote %i plates to plates.txt\\n", cars / 4);' },
            { n: 50, src: "" },
            { n: 51, src: "    return 0;" },
            { n: 52, src: "}" }
          ]}
          tracks={[
            {
              id: "run",
              label: "A run with both files available",
              frames: [
                {
                  lines: [15],
                  explain: "The first fopen constructed a FILE object for cars.txt. Its position starts at the beginning of the file.",
                  vars: { fpIn: "cars.txt, position 0", fpOut: "not yet opened", cars: 0 }
                },
                {
                  lines: [17],
                  explain: "The input opened, so the comparison is false and the block is skipped. Each open needs its own check.",
                  vars: { fpIn: "cars.txt, position 0", fpOut: "not yet opened", cars: 0 }
                },
                {
                  lines: [22],
                  explain: "The second fopen constructed a second FILE object. Mode w created plates.txt, or truncated it to nothing.",
                  vars: { fpIn: "cars.txt, position 0", fpOut: "plates.txt, position 0", cars: 0 }
                },
                {
                  lines: [24],
                  explain: "The output opened too, so this block is skipped as well and both handles are now valid.",
                  vars: { fpIn: "cars.txt, position 0", fpOut: "plates.txt, position 0", cars: 0 },
                  note: "Had this check failed, line 26 would close fpIn before returning. The input is already open at that point, and a function that gives up still owes the resources it acquired."
                },
                {
                  lines: [31],
                  explain: "The first fgets consumed the seven bytes of Toyota and its newline, advancing the input by exactly that much.",
                  vars: { fpIn: "cars.txt, position 7", fpOut: "plates.txt, position 0", cars: 0 }
                },
                {
                  lines: [38],
                  explain: "The counter records one line read. Neither position changed, because counting is not an operation on a stream.",
                  vars: { fpIn: "cars.txt, position 7", fpOut: "plates.txt, position 0", cars: 1 }
                },
                {
                  lines: [40],
                  explain: "One is not a multiple of four, so nothing is written and the output position stays where the open left it.",
                  vars: { fpIn: "cars.txt, position 7", fpOut: "plates.txt, position 0", cars: 1 }
                },
                {
                  lines: [31, 38],
                  explain: "Two more iterations read Corolla and 1995. The input has advanced three times; the output has not moved once.",
                  vars: { fpIn: "cars.txt, position 20", fpOut: "plates.txt, position 0", cars: 3 }
                },
                {
                  lines: [31],
                  explain: "The fourth fgets read the plate number TVX-111, advancing the input to byte 28 of 116.",
                  vars: { fpIn: "cars.txt, position 28", fpOut: "plates.txt, position 0", cars: 3 }
                },
                {
                  lines: [38, 40],
                  explain: "The counter reaches four, so this time the remainder is zero and the write below is taken.",
                  vars: { fpIn: "cars.txt, position 28", fpOut: "plates.txt, position 0", cars: 4 }
                },
                {
                  lines: [41],
                  explain: "fprintf issued eight bytes to the output, so its position moved to 8 while the input stayed at 28.",
                  vars: { fpIn: "cars.txt, position 28", fpOut: "plates.txt, position 8", cars: 4 }
                },
                {
                  lines: [41],
                  explain: "Twelve iterations later the last plate has been written, at the sixteenth line read and the fourth line written.",
                  vars: { fpIn: "cars.txt, position 116", fpOut: "plates.txt, position 32", cars: 16 }
                },
                {
                  lines: [31],
                  explain: "The next fgets found no bytes left and returned NULL, so the loop ended with the input at end of file.",
                  vars: { fpIn: "cars.txt, position 116", fpOut: "plates.txt, position 32", cars: 16 }
                },
                {
                  lines: [46],
                  explain: "The input is released. The output is untouched by this call, still open and still holding its own position.",
                  vars: { fpIn: "closed", fpOut: "plates.txt, position 32", cars: 16 }
                },
                {
                  lines: [47],
                  explain: "The output is flushed and released, leaving plates.txt on disk at the 32 bytes its position records.",
                  vars: { fpIn: "closed", fpOut: "closed", cars: 16 }
                },
                {
                  lines: [49],
                  explain: "Sixteen lines divided by four gives the count printed, after both streams have already been closed.",
                  vars: { cars: 16 },
                  out: ["Wrote 4 plates to plates.txt"],
                  note: "main then returns 0. Two opens, two checks and two closes, and no call on either stream ever affected the other."
                }
              ]
            }
          ]}
        />
        <Terminal label="Run once cars.txt exists — exit status 0">
{`Wrote 4 plates to plates.txt`}
        </Terminal>
        <Terminal label="plates.txt, written by the same run">
{`TVX-111
TJJ-100
JJT-001
HCV-221`}
        </Terminal>
      </>
    ),
    why: {
      label: "Why bother closing the input if the program is about to end?",
      body: <>In this program you could omit it, because terminating the process closes every stream it holds, and <code className="aw-code">main</code> is the one place where that argument holds. Move the code into a function and the function returns while the program carries on, so the stream stays open and nothing tells you.</>
    },
    check: {
      kind: "predict",
      question: "cars.txt opens. plates.txt then fails, so the program prints its perror line and returns 1. You delete the fclose(fpIn) from that branch. What goes wrong?",
      options: [
        {
          id: "nothing-visible",
          label: "Nothing you can see — the process ends and the file is released with it",
          correct: true,
          note: <>Correct, and that is why the habit is difficult to acquire: termination cleans up after you. But a function that returns cleans up nothing at all.</>
        },
        {
          id: "locked",
          label: "cars.txt stays locked until you restart the machine",
          note: "An open stream is bookkeeping held inside a process, and the operating system discards it when the process terminates. No file outlives it in a locked state."
        },
        {
          id: "crash",
          label: "The program crashes on the return",
          note: <>Nothing crashes. <code className="aw-code">fpIn</code> remains a valid pointer to an open stream and is simply never used again. A leak is quiet by its nature, so close on the failing path regardless.</>
        }
      ]
    }
  },

  /* ─────────────────────────────────────────────────────────────────────────
     Stage 3 — Writing to a file
     ───────────────────────────────────────────────────────────────────────── */
  {
    id: "S3.1",
    stage: 3, n: 1,
    title: "Open for writing, and know what that destroys",
    action: <>Start <code className="aw-code">02-write.c</code> with the same shape as before, but with mode <code className="aw-code">"w"</code>.</>,
    body: (
      <>
        <p className="aw-p">
          Mode <code className="aw-code">"w"</code> creates the file if it does
          not exist, and <strong>truncates</strong> it to zero bytes if it does.
          A write program that fails halfway therefore leaves an empty file
          rather than a partial one, so keep one copy of any data you value
          outside the directory your program writes into. The null check belongs
          here as well: opening for writing fails less often than opening for
          reading, but it still fails.
        </p>
      </>
    ),
    media: (
      <ModeExplorer caption="The same file, opened three ways. The mode is not only a permission, it also decides where the position starts and whether anything already in the file survives. Mode &quot;w&quot; is the destructive one, and it destroys at the open rather than at the first write." />
    ),
    check: {
      kind: "predict",
      question: "A program opens an existing 5,000-byte file with \"w\". It crashes before writing anything. How large is the file now?",
      options: [
        {
          id: "five-thousand",
          label: "5,000 bytes — nothing was written, so nothing changed",
          note: "The reading that costs people their data. Truncation is not something the write calls perform; it is something the open performs, and it had already happened when the crash came."
        },
        {
          id: "zero",
          label: "Zero bytes",
          correct: true,
          note: <>Correct. <code className="aw-code">"w"</code> empties the file as part of opening it, so the file is now zero bytes long and the previous contents are not recoverable from it.</>
        },
        {
          id: "partial",
          label: "Somewhere in between, depending on how far it got",
          note: "That would be right if writing overwrote the existing bytes one at a time from the start. The length drops to zero at the open, and grows from there."
        }
      ]
    }
  },
  {
    id: "S3.2",
    stage: 3, n: 2,
    title: "Write with fprintf, fputs and fputc",
    action: <>Add the three write calls below, in this order.</>,
    body: (
      <>
        <p className="aw-p">
          <code className="aw-code">fprintf</code> is{" "}
          <code className="aw-code">printf</code> with a stream as its first
          argument, and here it writes twelve bytes.{" "}
          <code className="aw-code">fputs</code> takes its arguments the other way
          round: <strong>the string first, the stream second</strong>. Supplying
          them reversed is only a <strong>warning</strong> on most compilers,{" "}
          <code className="aw-code">incompatible pointer types</code>, so the
          program still builds and runs. By the time it crashes, the{" "}
          <code className="aw-code">"w"</code> open has already emptied your
          file. Compile with <code className="aw-code">-Wall</code> and treat
          that warning as fatal.
        </p>
        <p className="aw-p">
          <code className="aw-code">fputc</code> writes a single character, and
          the quotation marks decide the type:{" "}
          <code className="aw-code">'?'</code> is the character constant the
          function expects, and <code className="aw-code">"?"</code> is a string
          literal, a different type and the wrong one.
        </p>
      </>
    ),
    media: (
      <>
        <CodeBlock
          file="02-write.c"
          from={17}
          lines={[
            "    //fprintf is printf with a file as its first argument.",
            "    //It is the one to use when a value has to be formatted.",
            "    //The \\n here is what makes this a complete first line.",
            '    fprintf(fp, "hello no. %i\\n", 1);'
          ]}
          focus={[3]}
        />
        <CodeBlock
          file="02-write.c"
          from={22}
          lines={[
            "    //fputs writes a string exactly as given. Note the argument",
            "    //order: the string first, the file second. It adds no \\n",
            "    //of its own, so the next write continues on the same line.",
            '    fputs("where is no. 2", fp);'
          ]}
          focus={[3]}
        />
        <CodeBlock
          file="02-write.c"
          from={27}
          lines={[
            "    //fputc writes one single character. Single quotes, not",
            "    //double quotes: '?' is a character, \"?\" is a string.",
            "    fputc('?', fp);"
          ]}
          focus={[2]}
        />
      </>
    ),
    check: {
      kind: "predict",
      question: "After these three calls, how many lines of text has the program produced?",
      options: [
        {
          id: "three",
          label: "Three — one per call",
          note: <>One call is not one line. Only the <code className="aw-code">fprintf</code> wrote a <code className="aw-code">\n</code>, and the other two appended to the line it had begun.</>
        },
        {
          id: "two",
          label: "Two, and the second one is unfinished",
          correct: true,
          note: <>Correct. The <code className="aw-code">\n</code> in the <code className="aw-code">fprintf</code> terminates line one, and <code className="aw-code">fputs</code> and <code className="aw-code">fputc</code> then build line two: <code className="aw-code">where is no. 2?</code>. No newline follows it, so anything written next continues on that same line. The append step has to allow for exactly that.</>
        },
        {
          id: "one",
          label: "One long line, because only fprintf ends with a newline",
          note: <>A newline is an ordinary byte that terminates the line preceding it. There are therefore two lines, of which the second is simply unterminated.</>
        }
      ]
    }
  },
  {
    id: "S3.3",
    stage: 3, n: 3,
    title: "Append instead of overwrite",
    action: <>Write <code className="aw-code">03-append.c</code> as a copy of <code className="aw-code">02-write.c</code> with mode <code className="aw-code">"a"</code> and a single <code className="aw-code">fputs</code>.</>,
    body: (
      <>
        <p className="aw-p">
          Mode <code className="aw-code">"a"</code> creates the file when it is
          missing, exactly as <code className="aw-code">"w"</code> does, but when
          the file exists it preserves the contents and positions every write at
          the end. That one letter decides whether a log accumulates across runs
          or holds only the most recent one. Note the leading{" "}
          <code className="aw-code">\n</code>: when you append, you append to
          whatever the previous program left behind.
        </p>
      </>
    ),
    media: (
      <>
        <CodeBlock
          file="03-append.c"
          from={7}
          lines={[
            "    //\"a\" is append. The write position starts at the END of the",
            "    //existing file, so nothing already stored is lost. Compare",
            "    //with \"w\" in 02-write.c, which would empty the file first.",
            '    fp = fopen("test.txt", "a");'
          ]}
          focus={[3]}
        />
        <CodeBlock
          file="03-append.c"
          from={17}
          lines={[
            "    //02-write.c left the file ending in '?' with no line break.",
            "    //This leading \\n therefore finishes line 2 before line 3",
            "    //begins. Without it the two lines would run together.",
            '    fputs("\\nHow about no. 3?", fp);'
          ]}
          focus={[3]}
        />
        <Terminal label="Running 02-write, then 03-append">
{`Wrote test.txt. Open it and look before going on.
Appended a third line to test.txt.`}
        </Terminal>
      </>
    ),
    check: {
      kind: "self",
      question: "Open test.txt in an editor. Does it hold three lines, the last one being How about no. 3?",
      ok: {
        label: "Yes, three lines",
        note: <>Then <code className="aw-code">02-write</code> and <code className="aw-code">03-append</code> have both run, in that order, in the same directory. That file is 44 bytes long, and stage 4 reads every one of them.</>
      },
      alt: {
        label: "I see fewer lines, or the text is run together",
        note: <>Two lines with <code className="aw-code">no. 2?How</code> joined means the leading <code className="aw-code">\n</code> is missing. A single line, or an empty file, means <code className="aw-code">03-append.c</code> was opened with <code className="aw-code">"w"</code> rather than <code className="aw-code">"a"</code>.</>
      }
    }
  },
  {
    id: "S3.4",
    stage: 3, n: 4,
    title: "Buffering, and why fclose is not optional",
    action: <>Step through <code className="aw-code">02-write.c</code> in the figure below, then run it again with each of the other two controls changed.</>,
    body: (
      <>
        <p className="aw-p">
          A write call does not reach the disk. It deposits bytes into a{" "}
          <strong>buffer</strong>, memory the library maintains for the stream,
          and hands that buffer to the operating system later in a{" "}
          <strong>system call</strong>, which costs far more than the copying
          itself. The standard defines three policies: a{" "}
          <strong>fully buffered</strong> stream is transferred when its buffer
          fills, a <strong>line buffered</strong> stream at each newline, and an{" "}
          <strong>unbuffered</strong> stream immediately, which is why{" "}
          <code className="aw-code">stderr</code> diagnostics survive a crash.
        </p>
        <p className="aw-p">
          What the figure cannot show is the program without{" "}
          <code className="aw-code">fclose</code> at all. Returning from{" "}
          <code className="aw-code">main</code> calls{" "}
          <code className="aw-code">exit</code>, which is required to flush and
          close every stream still open, so a program that terminates normally
          has its buffer transferred whether or not you wrote the call. Only{" "}
          <strong>abnormal</strong> termination loses it.{" "}
          <code className="aw-code">fclose</code> is the guarantee that the
          transfer happens where you put it.
        </p>
      </>
    ),
    media: (
      <>
        <BufferMachine caption="02-write.c, one call at a time, in both buffering modes and with both endings." />
        <p className="aw-p">
          Where each byte ends up. <code className="aw-code">02-write</code>{" "}
          leaves the first 27:
        </p>
        <ul className="aw-p">
          <li>bytes 0 to 10 — <code className="aw-code">hello no. 1</code></li>
          <li>byte 11 — the newline</li>
          <li>bytes 12 to 26 — <code className="aw-code">where is no. 2?</code></li>
        </ul>
        <p className="aw-p">
          <code className="aw-code">03-append</code> then adds 17 more:
        </p>
        <ul className="aw-p">
          <li>byte 27 — the newline</li>
          <li>bytes 28 to 43 — <code className="aw-code">How about no. 3?</code></li>
        </ul>
        <p className="aw-p">
          44 bytes in all, with no byte at offset 44: the file ends with no
          trailing newline, and stage 4 depends on that.
        </p>
      </>
    ),
    why: {
      label: "Controlling the buffer yourself",
      body: <><code className="aw-code">fflush(fp)</code> transfers the buffer to the file without closing the stream, which helps when you are debugging a long loop that may never reach its <code className="aw-code">fclose</code>. It is not a substitute for <code className="aw-code">fclose</code>, which also releases the stream. <code className="aw-code">setvbuf</code> selects the policy for a stream, and the standard requires it to be called before any other operation on that stream. The policy explains a common surprise: <code className="aw-code">stdout</code> is typically line buffered to a terminal but fully buffered when redirected to a file, so a program whose output looks correctly ordered on screen can produce a different order once redirected.</>
    },
    difficulty: "The file is empty, or my data has vanished",
    fix: 4,
    check: {
      kind: "predict",
      question: "Delete the fclose line from 02-write.c and recompile. Run it in a folder with no test.txt. What is on disk afterwards?",
      options: [
        {
          id: "full",
          label: "A complete 27-byte test.txt, exactly as before",
          correct: true,
          note: <>Correct, and the usual answer here is the wrong one. Returning from <code className="aw-code">main</code> calls <code className="aw-code">exit</code>, and <code className="aw-code">exit</code> is required to flush and close every stream still open, so the buffer is transferred for you. What <code className="aw-code">fclose</code> provides is the <em>guarantee</em>: it happens where you placed it.</>
        },
        {
          id: "empty",
          label: "A test.txt that exists and is empty",
          note: <>Right about the mechanism, wrong about this program. The bytes really are in the buffer, and they really would be lost, but only if the program terminated <strong>abnormally</strong>. Place a crash before the end of <code className="aw-code">main</code> and you will get the empty file you expected.</>
        },
        {
          id: "error",
          label: "An error message, or a crash on exit",
          note: "Nothing reports anything at all. When file output goes missing it goes missing silently, and the only evidence is a file that is not what you expected."
        }
      ]
    }
  }
];
