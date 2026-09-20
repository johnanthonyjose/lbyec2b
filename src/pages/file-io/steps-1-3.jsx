import React from "react";
import { CodeBlock, Terminal } from "./CodeBlock.jsx";
import { FileMachine } from "../../components/FileMachine.jsx";

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
   stages that cannot be seen in the source at all. It gets the FileMachine for
   that reason and for no other, and S3.4 names the three buffering policies and
   the system-call cost that motivates all of them.

   The register is academic professional: mechanism before procedure, technical
   vocabulary defined where it is first used, and no analogies. Corrections to
   the older course handout are student-facing noise, so they live in the `why`
   folds and in resolutions.jsx, never in a step body.

   forget.c is seventeen lines and is therefore shown whole, in one block.
   01-open.c, 02-write.c, 03-append.c and 10-twofiles.c are long enough to be
   split, and they are split at step boundaries so that each fragment arrives
   with the reason it exists.

   Every byte count, every stream position and every line of terminal output
   below is transcribed from the verified program set. Nothing here was
   calculated by hand. */

/* The 27 bytes 02-write.c leaves on disk. Stage 3's write trace is drawn
   against exactly these, so the figure and the byte table cannot drift apart.
   03-append.c then takes the same file from 27 bytes to 44. */
const AFTER_WRITE = "hello no. 1\nwhere is no. 2?";

/* One frame per call in 02-write.c. `pos` is how many bytes the program has
   issued, which is not the same as how many bytes are on disk: until fclose
   they are all still in the stream's buffer, and the buffer strip under the
   file is what says so. The counts are the ones measured on the real file —
   12 bytes from the fprintf, 14 from the fputs, 1 from the fputc. */
const writeTrace = [
  {
    call: 'fp = fopen("test.txt", "w");',
    pos: 0,
    buffered: "",
    note: "Nothing has been written, and yet test.txt already exists and is already empty. The \"w\" mode truncated it during the open, before any write call was reached."
  },
  {
    call: 'fprintf(fp, "hello no. %i\\n", 1);',
    pos: 12,
    buffered: "hello no. 1\\n",
    note: "Twelve bytes issued: eleven characters and the newline that terminates the line. They are in the stream's buffer, in memory. The file on disk is still zero bytes long."
  },
  {
    call: 'fputs("where is no. 2", fp);',
    pos: 26,
    buffered: "hello no. 1\\nwhere is no. 2",
    note: "Fourteen further bytes, and still nothing on disk. A program that crashed at this point would leave an empty file and report no error whatever. One that terminates normally has its streams flushed for it by exit."
  },
  {
    call: "fputc('?', fp);",
    pos: 27,
    buffered: "hello no. 1\\nwhere is no. 2?",
    note: "One more byte. The buffer now holds all 27 bytes the program intends to write, and the file on disk holds none of them."
  },
  {
    call: "fclose(fp);",
    pos: 27,
    closed: true,
    note: "fclose flushes the buffer to the file and then releases the stream. This single call is the difference between a 27-byte test.txt and an empty one."
  }
];

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
        <code className="aw-code">main</code>. Every program you have written in
        this course so far has had that same shape: read input, compute, produce
        output, terminate. Nothing in it records anything outside the memory the
        running program was given.
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
          note: "The value was on your screen a moment ago, so it is tempting to assume the program still holds it. It does not. No statement in forget.c places that integer anywhere outside the run that read it."
        },
        {
          id: "asks-again",
          label: "It asks for a number again, and knows nothing about the first run",
          correct: true,
          note: "Correct. The second run is a distinct process with an address space of its own. The variable n occupies a fresh address holding whatever bytes were last left there, and the first run's value is not reachable from it at all."
        },
        {
          id: "zero",
          label: "Zero, because n is reset",
          note: "The right answer for the wrong reason. Nothing resets n, and an uninitialized local variable holds whatever bytes already occupied its storage. The point is not that the value became zero, but that no value survived the process at all."
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
          the working store the processor addresses directly. That memory formed
          part of the <strong>address space</strong> of the{" "}
          <strong>process</strong>, which is your program as the operating system
          runs it. When <code className="aw-code">main</code> returned, the
          process terminated, and the operating system reclaimed every byte of
          that address space, including the bytes holding your integer.
        </p>
        <p className="aw-p">
          This is not a defect. It is the arrangement that allows one machine to
          run a thousand programs a day without their interfering with one
          another. It does mean that anything a program must keep has to be
          placed outside the process entirely. That destination is a{" "}
          <strong>file</strong>: a named sequence of bytes held on a storage
          device.
        </p>
        <p className="aw-p">
          The device belongs to <strong>secondary storage</strong> — a hard disk
          or a flash drive — which sits below main memory in the storage
          hierarchy. Secondary storage is slower to reach by several orders of
          magnitude, is very much larger, and retains its contents when power is
          removed. Main memory is fast, comparatively small, and volatile, and a
          process holds it only for the duration of its own run. A file therefore
          outlives the program that wrote it, and it survives the machine being
          switched off.
        </p>
        <p className="aw-p">
          A file may hold data of any kind: text, audio, video, images, or a
          combination of them within the one file.
        </p>
        <p className="aw-p">
          File input and output is the means by which a program places bytes into
          a file and retrieves them afterwards. Two situations call for it:
        </p>
        <ul className="aw-p">
          <li>
            The data has to outlive the process that produced it, or the machine
            being switched off.
          </li>
          <li>
            The data is too large to hold in main memory in its entirety.
          </li>
        </ul>
        <p className="aw-p">
          This week the first of the two is the one that concerns us.
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
          On Windows, locate an <code className="aw-code">.exe</code>; the{" "}
          <code className="aw-code">forget.exe</code> you have just compiled will
          serve. Open it in Notepad rather than running it. On macOS, open the
          compiled <code className="aw-code">forget</code> file itself, the one
          carrying no extension. The thirty seconds are worth spending.
        </p>
        <p className="aw-p">
          Most of what appears is unreadable: runs of accented letters, empty
          squares, long stretches of apparent nothing. The editor has not
          malfunctioned. It performed the single operation it always performs,
          which is to display the character that each byte denotes under its text
          encoding. Those bytes were never intended to denote characters.
        </p>
        <p className="aw-p">
          That is the whole of the distinction, and it is a distinction about
          interpretation rather than about the bytes themselves. A file is a
          sequence of bytes and nothing more; <strong>text</strong> and{" "}
          <strong>binary</strong> are two contracts under which a program may
          read that sequence. Under the text contract each byte, or each short
          group of bytes, denotes a character, and the characters are organized
          into <strong>lines</strong> separated by a newline. Any reader can
          therefore recover the content in any editor, which is what{" "}
          <strong>human-readable</strong> means.
        </p>
        <p className="aw-p">
          Under the binary contract a byte denotes whatever the writing
          application decided it would denote: a machine instruction in an
          executable, a sample in an audio file, a component of a pixel in an
          image. One and the same byte sequence answers to either contract, and
          nothing stored inside the file records which of them was intended.
        </p>
        <p className="aw-p">
          Text files are not confined to those named{" "}
          <code className="aw-code">.txt</code>. An HTML page is a text file, and
          so is an XML document. Notepad displays all three, because all three
          are characters organized into lines.
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
          note: "Opening alone is harmless; saving is not. Notepad writes back what it is displaying, and it cannot display bytes for which its encoding provides no character. What it writes back is therefore not what it read."
        },
        {
          id: "broken",
          label: "It is damaged and will probably refuse to run",
          correct: true,
          note: "Correct, and this is why the exercise is to look rather than to save. Every byte the editor could not represent is written back as a substitute character, so the machine instructions become different instructions. Look, close without saving, and keep a copy of anything you value."
        },
        {
          id: "slower",
          label: "It runs, but slower or with odd output",
          note: "A reasonable guess, but corrupted machine code is rarely graceful. The operating system validates the structure of an executable before transferring control to it, and the usual outcome is a refusal to start."
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
          It is still your text. Nothing about the file has changed except the
          three letters after the dot. A filename extension is a{" "}
          <strong>convention</strong>: a claim by whoever named the file about
          the contract under which its bytes are meant to be read. No part of the
          operating system enforces that claim, and nothing verifies it against
          the contents.
        </p>
        <p className="aw-p">
          This matters to a program that is about to open one.{" "}
          <code className="aw-code">fopen</code> inspects neither the name nor the
          contents. It establishes access to the byte sequence and leaves the
          interpretation entirely to you. Read a{" "}
          <code className="aw-code">.txt</code> that is in fact a spreadsheet
          with <code className="aw-code">fgets</code> and you obtain nonsense,
          and no error is reported, because nothing has gone wrong as far as the
          library is concerned. Your program is the only party that knows which
          contract the bytes were written under.
        </p>
        <p className="aw-p">
          Everything from this point onward concerns{" "}
          <strong>text files only</strong>. Every program in this handout opens
          its file in text mode, reads and writes characters, and treats the line
          as its unit of work. Binary files are not difficult, but they are not
          this week's subject.
        </p>
      </>
    ),
    why: {
      label: "Then how does anything know what a file is?",
      body: <>Principally by inspecting the contents. Many formats begin with a short fixed byte sequence called a <em>magic number</em>: a PNG opens with 0x89 followed by the letters PNG, and a PDF opens with %PDF. Editors read those bytes and treat the extension as no more than a hint. Your own programs can define the format they expect and reject anything that does not match it.</>
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
        note: <>Return to what Notepad did with the executable. It carried out exactly one operation: display the character that each byte denotes. That operation is the text contract. A binary file is one for which the same operation yields nonsense, because its bytes were written to be read under a different contract entirely.</>
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
    action: <>Start a new file called <code className="aw-code">01-open.c</code> with the include and the declaration below.</>,
    body: (
      <>
        <p className="aw-p">
          You already include <code className="aw-code">stdio.h</code> for{" "}
          <code className="aw-code">printf</code>, and file access uses that same
          header. There is nothing new to add.
        </p>
        <p className="aw-p">
          The C standard library models every file as a <strong>stream</strong>:
          an ordered sequence of bytes, together with the state required to
          traverse it. That state — the current <strong>position</strong>, the{" "}
          <strong>buffering mode</strong>, and the end-of-file and error{" "}
          <strong>indicators</strong> — is held in an object of type{" "}
          <code className="aw-code">FILE</code>, declared in{" "}
          <code className="aw-code">stdio.h</code>.
        </p>
        <p className="aw-p">
          You never manipulate that object directly.{" "}
          <code className="aw-code">fopen</code> constructs one and returns a{" "}
          <code className="aw-code">FILE *</code> referring to it; every
          subsequent operation takes that pointer, and{" "}
          <code className="aw-code">fclose</code> releases it. The library owns
          the object, and its layout is{" "}
          <strong>implementation-defined</strong>, meaning each compiler is free
          to choose it. That is why the interface hands you a pointer rather than
          a value.
        </p>
        <ul className="aw-p">
          <li>
            <code className="aw-code">fopen</code> constructs the{" "}
            <code className="aw-code">FILE</code> object and yields the pointer
            to it.
          </li>
          <li>
            Every read and every write takes that pointer as an argument.
          </li>
          <li>
            <code className="aw-code">fclose</code> releases the object and
            leaves the pointer no longer usable.
          </li>
        </ul>
        <p className="aw-p">
          You have been using streams since your first program.{" "}
          <code className="aw-code">printf(...)</code> is defined as{" "}
          <code className="aw-code">fprintf(stdout, ...)</code>, and{" "}
          <code className="aw-code">scanf</code> reads from{" "}
          <code className="aw-code">stdin</code>. The runtime opens{" "}
          <code className="aw-code">stdin</code>,{" "}
          <code className="aw-code">stdout</code> and{" "}
          <code className="aw-code">stderr</code> as{" "}
          <code className="aw-code">FILE *</code> streams before{" "}
          <code className="aw-code">main</code> is entered, which is why they
          need no opening of yours. Opening a file of your own simply adds a
          fourth stream beside those three.
        </p>
      </>
    ),
    media: (
      <CodeBlock
        file="01-open.c"
        from={1}
        lines={[
          "#include <stdio.h>",
          "",
          "int main(void) {",
          "",
          "    //A FILE pointer is the handle the program holds on to.",
          "    //It does not contain the file. It refers to the file."
        ]}
      />
    ),
    why: {
      label: "Why a pointer, and not a variable of type FILE?",
      body: <>Because the bookkeeping belongs to the library rather than to you. The size and layout of <code className="aw-code">FILE</code> are implementation-defined and differ between compilers, so copying one would produce an unsynchronized duplicate of private state rather than a second handle on the same stream. A pointer guarantees one authoritative record per open stream. An older handout named <code className="aw-code">stdlib.h</code> for the file functions; the correct header is <code className="aw-code">stdio.h</code>, for reading and writing alike.</>
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
        note: <>An "unknown type name FILE" means that <code className="aw-code">stdio.h</code> is missing or misspelled, since the type is declared nowhere else. Check the angle brackets and the spelling: <code className="aw-code">stdio</code>, not <code className="aw-code">studio</code>. That typo is the one this course encounters most often.</>
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
          <strong>mode</strong> string, and returns the stream. The mode{" "}
          <code className="aw-code">"r"</code> opens an existing file for reading
          only and creates nothing, so the call fails if{" "}
          <code className="aw-code">test.txt</code> is absent. You have not
          written <code className="aw-code">test.txt</code> yet, and that is
          deliberate: this program is meant to fail first.
        </p>
        <p className="aw-p">
          A mode may carry a trailing <code className="aw-code">b</code>, as in{" "}
          <code className="aw-code">"rb"</code>, which requests a binary stream
          instead of a text one. The two are identical on POSIX systems such as
          macOS and Linux. On Windows a text stream translates between the single
          newline your program writes and the two-byte line ending stored on
          disk, which is why identical data can occupy a different number of
          bytes on the two platforms. Every mode in this handout is a text mode.
        </p>
        <p className="aw-p">
          A bare name such as <code className="aw-code">"test.txt"</code> does not
          mean "beside my source file". It is resolved against the{" "}
          <strong>working directory</strong>, which is an attribute of the
          process, inherited from whatever launched it. Build in one directory
          and launch the program from another, and the name is resolved somewhere
          you are not looking. Your editor may launch the program from the
          project root while the source sits in a subdirectory, and this is the
          most frequent cause of a failed{" "}
          <code className="aw-code">fopen</code> in this course.
        </p>
        <p className="aw-p">
          A path may precede the name, and paths are of two kinds.
        </p>
        <ul className="aw-p">
          <li>
            An <strong>absolute path</strong> names the file from the root of the
            drive. <code className="aw-code">"c:/temp/test1.txt"</code> denotes
            test1.txt in the temp folder on drive C, and it denotes the same file
            regardless of where the process was launched from.
          </li>
          <li>
            A <strong>relative path</strong> is resolved from the working
            directory. <code className="aw-code">"test.txt"</code> is one, and so
            is <code className="aw-code">"../test2.txt"</code>, in which the two
            dots denote the <strong>parent directory</strong>, one level above
            the working one.
          </li>
        </ul>
        <p className="aw-p">
          Use forward slashes in either kind. Windows accepts them throughout its
          file interfaces, and the same source then runs unchanged on macOS. Two
          minutes spent on the panel below can save you an hour later.
        </p>
      </>
    ),
    media: (
      <CodeBlock
        file="01-open.c"
        from={7}
        lines={[
          "    FILE *fp;",
          "",
          "    //\"r\" means read-only. fopen returns NULL if it fails,",
          "    //most often because test.txt is not in the folder the",
          "    //program was launched from. Run 02-write.c first.",
          '    fp = fopen("test.txt", "r");'
        ]}
        focus={[5]}
      />
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
          note: "That is what the line looks like on the screen, which is why the fault conceals itself so well. The compiler resolves escape sequences first, so what was typed and what is passed are two different strings here."
        },
        {
          id: "fourteen",
          label: "Fourteen, because each backslash pair collapsed to one character",
          correct: true,
          note: <>Correct. <code className="aw-code">\t</code> collapses to a tab, and <code className="aw-code">\d</code> collapses to a plain <code className="aw-code">d</code>, with a compiler warning that was probably never read. What reaches <code className="aw-code">fopen</code> is <code className="aw-code">c:</code>, a tab, then <code className="aw-code">empdata.txt</code>: sixteen characters typed, fourteen passed, and no such file anywhere on the drive.</>
        },
        {
          id: "error",
          label: "None — it would not compile",
          note: <>An unrecognized escape such as <code className="aw-code">\d</code> is a warning rather than an error, so the program compiles and runs. That is precisely the difficulty here: nothing stops you, and the failure arrives later and in silence.</>
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
          library variable recording the most recent error condition. The call
          does not crash and prints nothing of its own, so execution continues
          with a pointer that refers to no stream at all.
        </p>
        <p className="aw-p">
          Passing that null pointer to{" "}
          <code className="aw-code">fprintf</code>,{" "}
          <code className="aw-code">fgets</code> or{" "}
          <code className="aw-code">fclose</code> is{" "}
          <strong>undefined behavior</strong>: those functions dereference the
          pointer to reach the <code className="aw-code">FILE</code> object, and
          the standard imposes no requirement whatever on what follows. On most
          machines the result is a crash several lines away from the actual
          fault.
        </p>
        <p className="aw-p">
          <code className="aw-code">perror</code> renders{" "}
          <code className="aw-code">errno</code> into a diagnostic. It writes your
          message, then a colon, then the text the implementation associates with
          the current error:{" "}
          <code className="aw-code">No such file or directory</code>, or{" "}
          <code className="aw-code">Permission denied</code>. That second half is
          the entire value of the call, because it is the difference between
          knowing that the open failed and knowing why. It costs you one line.
        </p>
        <p className="aw-p">
          Every <code className="aw-code">fopen</code> you write this term earns
          these four lines.
        </p>
      </>
    ),
    media: (
      <CodeBlock
        file="01-open.c"
        from={14}
        lines={[
          "    //Never skip this check. A NULL fp used later is a crash.",
          "    //perror prints our message plus the real reason from",
          "    //the operating system, e.g. \"No such file or directory\".",
          "    if (fp == NULL) {",
          '        perror("Could not open test.txt");',
          "        return 1;   //non-zero tells the shell the run failed",
          "    }",
          "",
          '    printf("test.txt opened for reading.\\n");'
        ]}
        focus={[3, 4]}
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
          note: <>This is what you would obtain without <code className="aw-code">perror</code>, and the <code className="aw-code">return 1</code> does indeed end the run. But <code className="aw-code">perror</code> has already written its diagnostic by the time that statement is reached.</>
        },
        {
          id: "perror-line",
          label: "Could not open test.txt: No such file or directory",
          correct: true,
          note: "Correct, and that is the exact line: your message, a colon, and the reason recorded by the operating system. The exit status is 1, and the program is behaving as intended, because the file genuinely is not there yet."
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
          order. It flushes any output still held for the stream, it releases the{" "}
          <code className="aw-code">FILE</code> object and the operating system
          resources beneath it, and it leaves the pointer no longer usable for
          anything. Stage 3 concerns the first of the three; here the second is
          what matters.
        </p>
        <p className="aw-p">
          An operating system permits a process a bounded number of open streams,
          so a program that opens in a loop without closing will exhaust that
          allowance and see its next <code className="aw-code">fopen</code> fail.
        </p>
        <p className="aw-p">
          Run the program now and you will see the first of the two outputs
          below. Return after stage 3, once{" "}
          <code className="aw-code">test.txt</code> exists, and run it again for
          the second. The failure is the case you will meet first, and it is the
          point of the program.
        </p>
      </>
    ),
    media: (
      <>
        <CodeBlock
          file="01-open.c"
          from={24}
          lines={[
            "    //Every successful fopen needs a matching fclose.",
            "    fclose(fp);",
            "",
            "    return 0;",
            "}"
          ]}
        />
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
      body: <>The value <code className="aw-code">main</code> returns is the program's <strong>exit status</strong>, which the shell retains and any calling process can read. Zero conventionally means the run succeeded, and any other value means it did not. Nothing inspects the status here. But your program will soon be one stage of a pipeline, and a truthful status is what tells the next stage whether to run at all.</>
    },
    difficulty: "The program runs, prints nothing, and exits normally",
    fix: 3,
    check: {
      kind: "self",
      question: "Did you see the perror line, with a reason after the colon?",
      ok: {
        label: "Yes — it told me the file does not exist",
        note: "That is the habit this stage exists to install. Your program now fails audibly, and every remaining failure this week will arrive with a message attached to it."
      },
      alt: {
        label: "It ran and printed nothing at all",
        note: <>Silence together with a zero exit status means that neither branch printed anything. Check that the <code className="aw-code">printf</code> sits outside the <code className="aw-code">if</code> block, and that nothing returns before it is reached. The resolution above is a procedure for locating where the silence begins.</>
      }
    }
  },
  {
    id: "S2.5",
    stage: 2, n: 5,
    title: "Open two streams at once",
    action: <>Read <code className="aw-code">10-twofiles.c</code> below rather than running it. Count the pointers, the checks and the closes.</>,
    body: (
      <>
        <p className="aw-p">
          Almost every useful program has an input and an output, which means two
          streams open at the same time. Your machine problem will have both, and
          so will your project.
        </p>
        <p className="aw-p">
          Nothing restricts a program to a single stream. Each{" "}
          <code className="aw-code">fopen</code> constructs a separate{" "}
          <code className="aw-code">FILE</code> object, and each of those objects
          carries its own position, its own buffer, and its own end-of-file and
          error indicators. Advancing through one stream therefore moves nothing
          in the other, and the three standard streams remain open alongside them
          throughout.
        </p>
        <p className="aw-p">
          <code className="aw-code">10-twofiles.c</code> reads{" "}
          <code className="aw-code">cars.txt</code> and writes{" "}
          <code className="aw-code">plates.txt</code>. The loop in the middle uses
          the reading calls introduced in stage 4, so disregard it for now and
          attend only to the pointers, the checks and the closes.
        </p>
        <ul className="aw-p">
          <li>
            Each open stream needs a pointer of its own. Two declarators on one
            line still declare two independent handles.
          </li>
          <li>
            Check both opens, since either can fail on its own and for a reason
            of its own.
          </li>
          <li>Two streams open means two streams to close.</li>
        </ul>
        <p className="aw-p">
          Examine the second check closely. By the time it runs,{" "}
          <code className="aw-code">cars.txt</code> is already open, so that
          branch closes the input stream before it returns. One open that failed
          is no reason to abandon one that succeeded.
        </p>
      </>
    ),
    media: (
      <>
        <CodeBlock
          file="10-twofiles.c"
          from={9}
          lines={[
            "    FILE *fpIn, *fpOut;",
            "    char line[120];",
            "    int cars = 0;"
          ]}
          focus={[0]}
        />
        <CodeBlock
          file="10-twofiles.c"
          from={15}
          lines={[
            '    fpIn = fopen("cars.txt", "r");',
            "",
            "    if (fpIn == NULL) {",
            '        perror("Could not open cars.txt for reading");',
            "        return 1;",
            "    }"
          ]}
          focus={[0]}
        />
        <CodeBlock
          file="10-twofiles.c"
          from={22}
          lines={[
            '    fpOut = fopen("plates.txt", "w");',
            "",
            "    if (fpOut == NULL) {",
            '        perror("Could not open plates.txt for writing");',
            "        fclose(fpIn);           //the input is open; close it",
            "        return 1;",
            "    }"
          ]}
          focus={[4]}
        />
        <CodeBlock
          file="10-twofiles.c"
          from={45}
          lines={[
            "    //Two files open means two files to close.",
            "    fclose(fpIn);",
            "    fclose(fpOut);"
          ]}
          focus={[1, 2]}
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
      body: <>In this program you could omit it, because terminating the process closes every stream it holds. But <code className="aw-code">main</code> is the one place where that argument holds. Move this code into a function of its own, and the function returns while the program carries on, so the stream stays open and nothing tells you. Closing on every path is the habit that continues to work once the code moves.</>
    },
    check: {
      kind: "predict",
      question: "cars.txt opens. plates.txt then fails, so the program prints its perror line and returns 1. You delete the fclose(fpIn) from that branch. What goes wrong?",
      options: [
        {
          id: "nothing-visible",
          label: "Nothing you can see — the process ends and the file is released with it",
          correct: true,
          note: <>Correct, and that is exactly why the habit is difficult to acquire: termination cleans up after you. But this code soon becomes a function rather than a <code className="aw-code">main</code>, and a function that returns cleans up nothing at all.</>
        },
        {
          id: "locked",
          label: "cars.txt stays locked until you restart the machine",
          note: "Reasonable, but no. An open stream is bookkeeping held inside a process, and when the process terminates the operating system discards that bookkeeping. No file outlives it in a locked state."
        },
        {
          id: "crash",
          label: "The program crashes on the return",
          note: <>Nothing crashes. <code className="aw-code">fpIn</code> remains a valid pointer to an open stream, and it is simply never used again. A leak is quiet by its nature, so close on the failing path regardless.</>
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
          not exist. If the file does exist,{" "}
          <code className="aw-code">"w"</code>{" "}
          <strong>truncates it to zero bytes</strong>, and the{" "}
          <strong>truncation</strong> is part of the open itself. It occurs
          before a single character is written, and whether or not you go on to
          write anything at all. Whatever the file held is gone from that moment.
        </p>
        <p className="aw-p">
          A write program that fails halfway therefore leaves an empty file
          rather than a partial one, and re-running a write program destroys what
          the previous run produced. Keep one copy of any data you value outside
          the directory your program writes into.
        </p>
        <p className="aw-p">
          The null check belongs here as well. Opening for writing fails less
          often than opening for reading, but it does still fail: a directory
          that does not exist, a file held open by another application, a
          read-only volume.
        </p>
      </>
    ),
    media: (
      <CodeBlock
        file="02-write.c"
        from={5}
        lines={[
          "    FILE *fp;",
          "",
          "    //\"w\" creates test.txt if it is missing, and TRUNCATES it",
          "    //to zero bytes if it already exists. Anything that was in",
          "    //the file before this line is gone. Use \"a\" to keep it.",
          '    fp = fopen("test.txt", "w");'
        ]}
        focus={[5]}
      />
    ),
    check: {
      kind: "predict",
      question: "A program opens an existing 5,000-byte file with \"w\". It crashes before writing anything. How large is the file now?",
      options: [
        {
          id: "five-thousand",
          label: "5,000 bytes — nothing was written, so nothing changed",
          note: "The reasonable reading, and the one that costs people their data. Truncation is not something the write calls perform; it is something the open performs, and it had already happened when the crash came."
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
          note: "That would be right if writing overwrote the existing bytes one at a time from the start. It is a fair guess, but not what happens: the length drops to zero at the open, and grows from there."
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
          argument, and it is the call to reach for whenever a value has to be
          formatted. Here it writes twelve bytes: eleven characters and the{" "}
          <code className="aw-code">\n</code> that terminates the first line.
        </p>
        <p className="aw-p">
          <code className="aw-code">fputs</code> writes a string exactly as
          given, and its argument order is the reverse of{" "}
          <code className="aw-code">fprintf</code>'s:{" "}
          <strong>the string first, the stream second</strong>. Supplying them
          the other way round is only a <strong>warning</strong> on most
          compilers, <code className="aw-code">incompatible pointer types</code>,
          so the program builds and runs regardless. By the time it crashes, the{" "}
          <code className="aw-code">"w"</code> open has already emptied your file.
          Treat that warning as fatal: compile with{" "}
          <code className="aw-code">-Wall</code> and read what it tells you.{" "}
          <code className="aw-code">fputs</code> appends no newline of its own,
          so the next write continues on the same line.
        </p>
        <p className="aw-p">
          <code className="aw-code">fputc</code> writes a single character, and
          the quotation marks decide the type.{" "}
          <code className="aw-code">'?'</code> is a character constant, which is
          what the function expects. <code className="aw-code">"?"</code> is a
          string literal, which is a different type and the wrong one.
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
          note: <>One call is not one line. Only the <code className="aw-code">fprintf</code> wrote a <code className="aw-code">\n</code> here, and the other two appended characters to the line that newline had already begun.</>
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
          note: <>The <code className="aw-code">\n</code> is genuinely present, and a newline is an ordinary byte that terminates the line preceding it. There are therefore two lines, of which the second is simply unterminated.</>
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
          Mode <code className="aw-code">"a"</code> is append. It creates the file
          when the file is missing, exactly as{" "}
          <code className="aw-code">"w"</code> does. When the file exists,
          however, it preserves the contents and positions every write at the
          end, so nothing already stored is lost. That one letter decides whether
          a log accumulates across runs or holds only the most recent one.
        </p>
        <p className="aw-p">
          Note the leading <code className="aw-code">\n</code> in the string.{" "}
          <code className="aw-code">02-write.c</code> left the file ending in{" "}
          <code className="aw-code">?</code> with no line terminator, so without
          that <code className="aw-code">\n</code> the two lines would run
          together as{" "}
          <code className="aw-code">where is no. 2?How about no. 3?</code>. When
          you append, you append to whatever the previous program left behind,
          and you are obliged to know what that was.
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
        note: <>Two lines with <code className="aw-code">no. 2?How</code> joined means the leading <code className="aw-code">\n</code> is missing from the appended string. A single line, or an empty file, means <code className="aw-code">03-append.c</code> was opened with <code className="aw-code">"w"</code> rather than <code className="aw-code">"a"</code>. Check the mode letter, then run <code className="aw-code">02-write</code> again to rebuild the file.</>
      }
    }
  },
  {
    id: "S3.4",
    stage: 3, n: 4,
    title: "Buffering, and why fclose is not optional",
    action: <>Step through the five calls of <code className="aw-code">02-write.c</code> below, watching the buffer rather than the file.</>,
    body: (
      <>
        <p className="aw-p">
          A write call does not reach the disk. It deposits bytes into a{" "}
          <strong>buffer</strong>, a region of memory the library maintains for
          the stream, and the library hands that buffer to the operating system
          later. It works this way because each hand-off is a{" "}
          <strong>system call</strong>, a transition into the kernel that costs
          far more than the copying itself. One system call per byte would make
          output slower by orders of magnitude, so the library batches the bytes
          instead.
        </p>
        <p className="aw-p">
          The standard defines three buffering policies. A{" "}
          <strong>fully buffered</strong> stream is transferred only when its
          buffer fills. A <strong>line buffered</strong> stream is transferred
          whenever a newline is written. An <strong>unbuffered</strong> stream is
          transferred immediately, which is why{" "}
          <code className="aw-code">stderr</code> is unbuffered and its
          diagnostics survive a crash.
        </p>
        <p className="aw-p">
          <code className="aw-code">stdout</code> is typically line buffered when
          it is connected to a terminal, and fully buffered when it is redirected
          into a file. That is why the output of a redirected program can arrive
          in an order that surprises you, with the diagnostics appearing well
          before the ordinary output they described.{" "}
          <code className="aw-code">setvbuf</code> sets the policy for a stream
          explicitly, and it must be called before any other operation on that
          stream.
        </p>
        <p className="aw-p">
          The buffer is also invisible. Every call in the figure below returns
          successfully, and none reports an error, yet until the final frame the
          file on disk holds none of what the program has written. Step through
          the calls and watch the two strips disagree.
        </p>
      </>
    ),
    media: (
      <>
        <FileMachine
          file={{ name: "test.txt", content: AFTER_WRITE }}
          trace={writeTrace}
          caption="02-write.c, one call at a time. The upper strip is what the program has issued. The buffer strip beneath it is where those bytes actually reside until the final call."
        />
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
          That is 44 bytes in total, and there is no byte at offset 44. The file
          ends with no trailing newline, and stage 4 depends on that.
        </p>
      </>
    ),
    why: {
      label: "What if I need to see the file before the program ends?",
      body: <><code className="aw-code">fflush(fp)</code> transfers the buffer to the file without closing the stream, which helps when you are debugging a long loop. The program may not reach its <code className="aw-code">fclose</code> for several minutes, and if the loop is itself the bug it will never reach it at all. <code className="aw-code">fflush</code> is not a substitute for <code className="aw-code">fclose</code>, which also releases the stream.</>
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
          note: <>Correct, and the reason is worth knowing, because the usual answer here is the wrong one. Returning from <code className="aw-code">main</code> calls <code className="aw-code">exit</code>, and <code className="aw-code">exit</code> is required to flush and close every stream still open, so the buffer is transferred for you. What <code className="aw-code">fclose</code> provides is the <em>guarantee</em>: it happens where you placed it, rather than waiting on the end of a program that may never arrive there.</>
        },
        {
          id: "empty",
          label: "A test.txt that exists and is empty",
          note: <>The reading almost everyone arrives at, and it is right about the mechanism while being wrong about this program. The bytes really are sitting in the buffer, and they really would be lost, but only if the program terminated <strong>abnormally</strong>. Place a crash before the end of <code className="aw-code">main</code> and you will get the empty file you expected.</>
        },
        {
          id: "error",
          label: "An error message, or a crash on exit",
          note: "Nothing reports anything at all, and that is the property worth carrying forward. When file output goes missing it goes missing silently, and the only evidence is a file that is not what you expected."
        }
      ]
    }
  }
];
