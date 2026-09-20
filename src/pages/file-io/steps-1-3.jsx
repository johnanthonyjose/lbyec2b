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

   Stage 2 is the longest prose in the handout and is deliberately so. Of the
   six anticipated difficulties this page carries, three belong to opening a
   file, and all three are silent: the program compiles, runs, returns zero and
   does nothing. Nothing else in the course behaves like that, so the habits
   that make it visible — the NULL check, perror, forward slashes, knowing
   which folder the program runs in — are taught before the first byte is
   written rather than after the first hour is lost.

   Stage 3 is built around the write buffer, which is the one thing in these
   three stages that cannot be seen in the source at all. It gets the
   FileMachine for that reason and for no other.

   Every byte count, every stream position and every line of terminal output
   below is transcribed from the verified programme set. Nothing here was
   calculated by hand. */

/* The 27 bytes 02-write.c leaves on disk. Stage 3's write trace is drawn
   against exactly these, so the figure and the byte table cannot drift apart.
   03-append.c then takes the same file from 27 bytes to 44. */
const AFTER_WRITE = "hello no. 1\nwhere is no. 2?";

/* One frame per call in 02-write.c. `pos` is how many bytes the program has
   issued, which is not the same as how many bytes are on disk: until fclose
   they are all still in the buffer, and the buffer strip under the file is
   what says so. The counts are the ones measured on the real file — 12 bytes
   from the fprintf, 14 from the fputs, 1 from the fputc. */
const writeTrace = [
  {
    call: 'fp = fopen("test.txt", "w");',
    pos: 0,
    buffered: "",
    note: "Nothing has been written yet. But test.txt already exists and is already empty: \"w\" truncated it at the moment it opened, before any of the three write calls ran."
  },
  {
    call: 'fprintf(fp, "hello no. %i\\n", 1);',
    pos: 12,
    buffered: "hello no. 1\\n",
    note: "Twelve bytes have been issued — eleven characters and the newline. They are in memory. The file on disk is still zero bytes long."
  },
  {
    call: 'fputs("where is no. 2", fp);',
    pos: 26,
    buffered: "hello no. 1\\nwhere is no. 2",
    note: "Fourteen more bytes, and still nothing on disk. This is the moment that matters: a program that CRASHED here would leave you an empty file, having reported no error at all. One that ends normally is flushed for it by exit."
  },
  {
    call: "fputc('?', fp);",
    pos: 27,
    buffered: "hello no. 1\\nwhere is no. 2?",
    note: "One more byte. The buffer now holds all 27 bytes the program means to write, and the file still holds none of them."
  },
  {
    call: "fclose(fp);",
    pos: 27,
    closed: true,
    note: "fclose writes the buffer out and releases the file. This one call is the difference between a 27-byte test.txt and an empty one."
  }
];

export const steps13 = [
  /* ─────────────────────────────────────────────────────────────────────────
     Stage 1 — Why a program forgets
     ───────────────────────────────────────────────────────────────────────── */
  {
    id: "S1.1",
    stage: 1, n: 1,
    title: "Watch a program forget a number",
    action: <>Type this short program into a file called <code className="aw-code">forget.c</code>, compile it, and run it.</>,
    body: (
      <p className="aw-p">
        It asks for a number, prints the number back, and ends. Every program
        you have written in this course so far has had this shape.
      </p>
    ),
    media: (
      <>
        <CodeBlock
          file="forget.c"
          from={1}
          lines={[
            "#include <stdio.h>",
            "",
            "int main(void) {",
            "",
            "    //One variable. It lives in memory for exactly as",
            "    //long as main does, and not one instruction longer."
          ]}
        />
        <CodeBlock
          file="forget.c"
          from={7}
          lines={[
            "    int n;",
            "",
            '    printf("Give me a number: ");',
            '    scanf("%i", &n);',
            "",
            '    printf("You gave me %i.\\n", n);'
          ]}
          focus={[0]}
        />
        <CodeBlock
          file="forget.c"
          from={13}
          lines={[
            "",
            "    //Nothing here writes anything anywhere. When main",
            "    //returns there is no record of n outside this run.",
            "    return 0;",
            "}"
          ]}
          caption="The whole program. Compile it with: gcc -Wall -o forget forget.c"
        />
      </>
    ),
    check: {
      kind: "predict",
      question: "Run it once and give it a number. Now run it a second time, without typing a number. What will the second run print?",
      options: [
        {
          id: "remembers",
          label: "The number from the first run",
          note: "This is the reading the rest of the handout exists to correct, and it is a reasonable one: the number was on the screen a second ago, so it feels as though the program has it. It does not. Nothing in the source put it anywhere that outlives the run."
        },
        {
          id: "asks-again",
          label: "It asks for a number again, and knows nothing about the first run",
          correct: true,
          note: "Correct. The second run is a new process with new memory. n is a fresh variable at a fresh address holding whatever was last left there, and the first run's value is not available to it by any means."
        },
        {
          id: "zero",
          label: "Zero, because n is reset",
          note: "Close to the truth but for the wrong reason. n is not reset to anything — an uninitialised local variable holds whatever bytes happened to be at that address. The point is not that the value became zero; it is that there is no value to recover at all."
        }
      ]
    }
  },
  {
    id: "S1.2",
    stage: 1, n: 2,
    title: "Name what happened",
    action: <>Read the three sentences below, then say which of them your program broke.</>,
    body: (
      <>
        <p className="aw-p">
          The variable <code className="aw-code">n</code> lived in main memory,
          the working store the processor reads and writes directly. That memory
          belongs to the <strong>process</strong>, which is your program while it
          is running. When <code className="aw-code">main</code> returned, the
          process ended and the operating system reclaimed every byte it held —
          including the bytes holding your number — so that the next program
          could use them.
        </p>
        <p className="aw-p">
          This is not a fault. It is the arrangement that lets a machine with
          sixteen gigabytes of memory run a thousand programs a day. But it means
          that anything a program is to keep must be put somewhere the process
          does not own. That somewhere is a <strong>file</strong>: a named
          sequence of bytes on a storage device, which outlives the program that
          wrote it and survives the machine being switched off.
        </p>
        <p className="aw-p">
          File I/O is the set of operations for putting bytes into a file and
          getting them back out. It is also what you reach for when there is more
          data than will fit in memory at once — a recorded signal, a week of
          sensor readings — but this week the reason is the first one.
        </p>
      </>
    ),
    why: {
      label: "Where does the number actually go?",
      body: <>The memory is not wiped. The operating system marks the pages as free and hands them to whichever process asks next, which will find whatever your run left there. Nothing reads it back because nothing knows it is there or what it meant. A file is different in exactly that respect: it has a name, so something can ask for it later.</>
    },
    check: {
      kind: "self",
      question: "Can you say, in one sentence and without looking, why the second run did not have your number?",
      ok: {
        label: "Yes — the process ended and its memory went with it",
        note: "That is the sentence. Everything in the next four stages is a way of putting bytes somewhere that sentence does not apply to."
      },
      alt: {
        label: "Not quite yet",
        note: <>Read the second paragraph again and look at the program beside it. There is no line in <code className="aw-code">forget.c</code> that names a place outside the program. Storage that has no name cannot be asked for later, and memory belonging to a process that has ended cannot be asked for at all.</>
      }
    }
  },
  {
    id: "S1.3",
    stage: 1, n: 3,
    title: "Open a program in a text editor",
    action: <>Open an application binary in Notepad, TextEdit or VS Code and look at what comes up.</>,
    body: (
      <>
        <p className="aw-p">
          On Windows, find a <code className="aw-code">.exe</code> — the{" "}
          <code className="aw-code">forget.exe</code> you just compiled will do —
          and open it with Notepad rather than running it. On a Mac, open the
          compiled <code className="aw-code">forget</code> file itself, the one
          with no extension. It is the same exercise the previous version of this
          handout set, and it is worth the thirty seconds.
        </p>
        <p className="aw-p">
          What you get is mostly unreadable: runs of accented letters, blank
          squares, long stretches of nothing. The editor has not failed. It has
          done exactly what it always does — taken each byte and drawn the
          character that byte stands for — and the bytes were never meant to
          stand for characters.
        </p>
        <p className="aw-p">
          That is the whole distinction. A <strong>text file</strong> is bytes
          intended to be read as characters, organised into lines. A{" "}
          <strong>binary file</strong> is bytes intended to be read as whatever
          the program that wrote them decided: machine instructions in an
          executable, samples in an audio file, pixels in an image. The bytes are
          the same kind of thing in both cases. Only the intended interpretation
          differs, and the file does not carry that interpretation inside it.
        </p>
      </>
    ),
    check: {
      kind: "predict",
      question: "You save that mess from Notepad and then try to run the program again. What happens?",
      options: [
        {
          id: "fine",
          label: "It runs as before — you only opened it, you did not change anything",
          note: "Opening alone is harmless, but saving is not. Notepad writes back what it is showing, and it cannot show bytes it had no character for. What it writes back is not what it read."
        },
        {
          id: "broken",
          label: "It is damaged and will probably refuse to run",
          correct: true,
          note: "Correct, and this is why the exercise is to look rather than to save. Every byte the editor could not represent is written back as a substitute, so the machine instructions are now different instructions. Look, close without saving, and keep a copy of anything you care about."
        },
        {
          id: "slower",
          label: "It runs, but slower or with odd output",
          note: "A reasonable guess, but corruption of machine code is rarely graceful. The operating system checks the structure of an executable before running it, so the usual result is a refusal to start rather than strange behaviour."
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
          It is still your text. Nothing about the file changed except the three
          letters after the dot. A filename extension is a{" "}
          <strong>convention</strong>: a promise made by whoever named the file
          about what is inside it. It is not enforced, it is not checked, and
          plenty of files do not follow it.
        </p>
        <p className="aw-p">
          This matters to a program that is about to open one.{" "}
          <code className="aw-code">fopen</code> does not inspect what is inside a
          file and it does not care what it is called. It hands you the bytes.
          Reading a <code className="aw-code">.txt</code> that is really a
          spreadsheet with <code className="aw-code">fgets</code> will succeed and
          give you rubbish, and nothing will report an error, because nothing went
          wrong as far as C is concerned. Your program is the only thing that
          knows what the bytes were supposed to mean.
        </p>
        <p className="aw-p">
          Everything from this point on is <strong>text files only</strong>. Every
          program in this handout opens a file in text mode, reads and writes
          characters, and treats a line as the unit of organisation. Binary file
          handling exists and is not difficult, but it is not this week.
        </p>
      </>
    ),
    why: {
      label: "Then how does anything know what a file is?",
      body: <>Mostly by looking inside. Many formats begin with a few fixed bytes — a <em>magic number</em> — that identify them: a PNG starts with the byte 0x89 then the letters PNG, a PDF starts with %PDF. Operating systems and editors read those bytes and use the extension only as a first guess. A program of yours can do the same, but the far commoner engineering answer is to define the format you expect and refuse anything that does not match it.</>
    },
    check: {
      kind: "self",
      question: "Could you now explain to somebody in your section what a file is, and how a text file differs from a binary one?",
      ok: {
        label: "Yes — a named sequence of bytes, and the difference is how they are meant to be read",
        note: "That is stage 1. You have the problem and you have the vocabulary. Stage 2 opens one."
      },
      alt: {
        label: "I could name them but not explain the difference",
        note: <>Go back to what Notepad did with the executable. It performed exactly one operation — draw the character for each byte — and that operation is what a text file is defined by. A binary file is one where that operation produces nonsense because the bytes were meant for something else.</>
      }
    }
  },

  /* ─────────────────────────────────────────────────────────────────────────
     Stage 2 — Opening a file
     ───────────────────────────────────────────────────────────────────────── */
  {
    id: "S2.1",
    stage: 2, n: 1,
    title: "Declare a FILE pointer",
    action: <>Start a new file called <code className="aw-code">01-open.c</code> with the include and the declaration below.</>,
    body: (
      <>
        <p className="aw-p">
          Everything C offers for files is declared in{" "}
          <code className="aw-code">stdio.h</code> — the same header{" "}
          <code className="aw-code">printf</code> comes from. The previous version
          of this handout named <code className="aw-code">stdlib.h</code> for the
          writing functions. That is wrong, and it is the sort of wrong that
          produces an implicit-declaration warning you will not connect to
          anything. It is <code className="aw-code">stdio.h</code>, for reading and
          for writing alike.
        </p>
        <p className="aw-p">
          <code className="aw-code">FILE *fp;</code> declares a{" "}
          <strong>file pointer</strong>. It is a handle, not the file: a small
          piece of bookkeeping the C library owns, recording which file is open,
          in which mode, and where in it you have reached. You never look inside
          it and you never assign to what it points at. You get one from{" "}
          <code className="aw-code">fopen</code>, you pass it to every function
          that is to act on that file, and you give it back with{" "}
          <code className="aw-code">fclose</code>.
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
      body: <>Because the bookkeeping belongs to the library, not to you. Its size and contents differ between compilers and are allowed to change; a copy of one would not be a second handle on the same file but a broken duplicate of private state. Handing you a pointer keeps exactly one authoritative record per open file, which is also why <code className="aw-code">fclose</code> takes the pointer rather than anything else.</>
    },
    check: {
      kind: "self",
      question: "Does your file so far contain the stdio.h include and the FILE * declaration?",
      ok: {
        label: "Yes, and it compiles",
        note: "A program that declares a pointer and does nothing with it is legal and does nothing. The next step gives it something to point at."
      },
      alt: {
        label: "The compiler complains about FILE",
        note: <>An "unknown type name FILE" means <code className="aw-code">stdio.h</code> is missing or misspelt. Check the angle brackets and the spelling — <code className="aw-code">stdio</code>, not <code className="aw-code">studio</code>, which is the typo this course sees most often.</>
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
          <code className="aw-code">fopen</code> takes the name of a file and a
          mode, and returns a handle. <code className="aw-code">"r"</code> means
          read-only, and it never creates anything: if{" "}
          <code className="aw-code">test.txt</code> is not there,{" "}
          <code className="aw-code">fopen</code> fails. You have not written{" "}
          <code className="aw-code">test.txt</code> yet, which is deliberate — this
          program is meant to fail first.
        </p>
        <p className="aw-p">
          A bare name like <code className="aw-code">"test.txt"</code> does not
          mean "beside my source file". It means "in the{" "}
          <strong>working directory</strong>", the folder the program was launched
          from. If you build in one folder and run from another, or if your editor
          runs the program from the project root while the source sits in a
          subfolder, the name you passed is being looked for somewhere you are not
          looking. This is the single commonest reason an{" "}
          <code className="aw-code">fopen</code> in this course fails.
        </p>
        <p className="aw-p">
          If you do write a full path, use forward slashes:{" "}
          <code className="aw-code">"c:/temp/test1.txt"</code>. Windows accepts
          them and the same source then runs unchanged on a Mac. The reason is in
          the panel below, and it is worth two minutes now rather than an hour
          later.
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
      body: <>In C source a backslash begins an escape sequence, and the compiler resolves it before your program ever runs. <code className="aw-code">\t</code> is not a backslash and a t — it is one tab character. So that string arrives at <code className="aw-code">fopen</code> as <code className="aw-code">c:</code>, tab, <code className="aw-code">emp</code>, tab, <code className="aw-code">est1.txt</code>, which cannot name any file on any machine. The old handout printed paths in exactly this form. Forward slashes avoid the problem entirely; doubling each backslash — <code className="aw-code">"c:\\temp\\test1.txt"</code> — also works.</>
    },
    difficulty: "A Windows path with backslashes silently fails",
    fix: 2,
    check: {
      kind: "predict",
      question: "A classmate writes fopen(\"c:\\temp\\data.txt\", \"r\") and the program prints nothing at all. How many characters does the string they passed actually contain?",
      options: [
        {
          id: "sixteen",
          label: "Sixteen — exactly what they typed",
          note: "This is what the line looks like, and it is why the fault is so hard to see. But the compiler processes escape sequences first, so what is typed and what is passed are two different strings here."
        },
        {
          id: "fourteen",
          label: "Fourteen, because each backslash pair collapsed to one character",
          correct: true,
          note: <>Correct. <code className="aw-code">\t</code> and <code className="aw-code">\d</code> are each collapsed to a single character: the first to a tab, the second to a plain <code className="aw-code">d</code> with a compiler warning you probably did not see. What reaches <code className="aw-code">fopen</code> is <code className="aw-code">c:</code>, a tab, <code className="aw-code">empdata.txt</code> — sixteen typed, fourteen passed, and no file on earth by that name.</>
        },
        {
          id: "error",
          label: "None — it would not compile",
          note: <>An unknown escape such as <code className="aw-code">\d</code> is a warning, not an error, so the program compiles and runs. That is precisely the difficulty: nothing stops you, and the failure arrives later and silently.</>
        }
      ]
    }
  },
  {
    id: "S2.3",
    stage: 2, n: 3,
    title: "Check for NULL, and say so out loud",
    action: <>Add the NULL check with <code className="aw-code">perror</code> immediately after the <code className="aw-code">fopen</code>. Never leave a gap between them.</>,
    body: (
      <>
        <p className="aw-p">
          <code className="aw-code">fopen</code> returns{" "}
          <code className="aw-code">NULL</code> when it could not open the file.
          It does not crash, it does not print anything, and the program carries on
          with a handle that refers to nothing. Every read or write through that
          handle afterwards is undefined behaviour, which on most machines means a
          crash several lines away from the real fault.
        </p>
        <p className="aw-p">
          <code className="aw-code">perror</code> prints your message, then a
          colon, then the reason the operating system recorded:{" "}
          <code className="aw-code">No such file or directory</code>,{" "}
          <code className="aw-code">Permission denied</code>. That second half is
          the whole value of it. It is the difference between knowing the open
          failed and knowing why, and it costs you one line.
        </p>
        <p className="aw-p">
          The previous version of this handout contained six programs and checked{" "}
          <code className="aw-code">fopen</code> in none of them. Every{" "}
          <code className="aw-code">fopen</code> you write this term gets these
          four lines.
        </p>
      </>
    ),
    media: (
      <>
        <CodeBlock
          file="01-open.c"
          from={14}
          lines={[
            "    //Never skip this check. A NULL fp used later is a crash.",
            "    //perror prints our message plus the real reason from",
            "    //the operating system, e.g. \"No such file or directory\".",
            "    if (fp == NULL) {",
            '        perror("Could not open test.txt");',
            "        return 1;   //non-zero tells the shell the run failed"
          ]}
          focus={[3, 4]}
        />
        <CodeBlock
          file="01-open.c"
          from={20}
          lines={[
            "    }",
            "",
            '    printf("test.txt opened for reading.\\n");'
          ]}
        />
      </>
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
          note: <>This is what would have happened without <code className="aw-code">perror</code>, and it is what the old handout's programs did. The <code className="aw-code">return 1</code> does end the run, but <code className="aw-code">perror</code> has already printed by then.</>
        },
        {
          id: "perror-line",
          label: "Could not open test.txt: No such file or directory",
          correct: true,
          note: "Correct, and that is the exact line — your message, a colon, and the operating system's reason. Exit status 1. This is the program working as intended: the file genuinely is not there yet."
        },
        {
          id: "opened",
          label: "test.txt opened for reading.",
          note: <>Only once <code className="aw-code">test.txt</code> exists. Mode <code className="aw-code">"r"</code> never creates a file, so on a first run in an empty folder there is nothing for it to open.</>
        }
      ]
    }
  },
  {
    id: "S2.4",
    stage: 2, n: 4,
    title: "Close the file, and run it twice",
    action: <>Add <code className="aw-code">fclose(fp)</code> and <code className="aw-code">return 0</code>, compile, and run it now — before <code className="aw-code">test.txt</code> exists.</>,
    body: (
      <>
        <p className="aw-p">
          <code className="aw-code">fclose</code> releases the handle and, for a
          file opened for writing, flushes what is still in memory. Stage 3 is
          about that second job. Here it matters for the first: an operating
          system allows a process a limited number of open files, and a program
          that opens in a loop without closing runs out.
        </p>
        <p className="aw-p">
          Run it. You will see the first output below. Then come back after stage 3
          — once <code className="aw-code">test.txt</code> exists — and run it
          again to see the second. Both are worth seeing, because the failure is
          the one you will meet first and it is the point of the program.
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
        <Terminal label="Run in a folder with no test.txt — exit status 1">
{`Could not open test.txt: No such file or directory`}
        </Terminal>
        <Terminal label="Run again after stage 3 has created it — exit status 0">
{`test.txt opened for reading.`}
        </Terminal>
      </>
    ),
    why: {
      label: "Why return 1 rather than 0?",
      body: <>The value <code className="aw-code">main</code> returns is the program's exit status, and the shell keeps it. Zero means the run succeeded; anything else means it did not. Nothing in this handout inspects it, but the moment your program is one step of a pipeline — as it will be in the team project — a truthful exit status is how the step after it knows whether to run.</>
    },
    difficulty: "The program runs, prints nothing, and exits normally",
    fix: 3,
    check: {
      kind: "self",
      question: "Did you see the perror line, with a reason after the colon?",
      ok: {
        label: "Yes — it told me the file does not exist",
        note: "That is the habit this stage exists to install. Your program now fails loudly, which means every remaining failure this week will have a message attached to it. On to writing the file."
      },
      alt: {
        label: "It ran and printed nothing at all",
        note: <>Silence with a zero exit status means the NULL branch was not reached and the <code className="aw-code">printf</code> was not either — check that the <code className="aw-code">printf</code> is outside the <code className="aw-code">if</code> block and that nothing returns before it. The resolution above is a procedure for narrowing down where the silence begins.</>
      }
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
          Mode <code className="aw-code">"w"</code> creates the file if it is
          missing. If it is not missing, <code className="aw-code">"w"</code>{" "}
          <strong>truncates it to zero bytes</strong> at the moment of opening —
          before a single character is written, and whether or not your program
          goes on to write anything. Whatever was in the file is gone at that
          point.
        </p>
        <p className="aw-p">
          This is why a write program that crashes half way through can leave you
          with an empty file rather than a partial one, and why re-running a write
          program destroys what the previous run produced. Keep one copy of any
          data you care about outside the folder your program writes into.
        </p>
        <p className="aw-p">
          The NULL check is here too. Opening for writing fails less often than
          opening for reading, but it still fails: a folder that does not exist, a
          file open in Excel, a read-only disk.
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
      question: "A program opens an existing 5,000-byte file with \"w\", then crashes before writing anything. How large is the file afterwards?",
      options: [
        {
          id: "five-thousand",
          label: "5,000 bytes — nothing was written, so nothing changed",
          note: "The reasonable reading, and the reason this loses people their data. Truncation is not something the write calls do; it is something the open does, and it had already happened when the crash came."
        },
        {
          id: "zero",
          label: "Zero bytes",
          correct: true,
          note: <>Correct. <code className="aw-code">"w"</code> empties the file as part of opening it. The file is now zero bytes and the previous contents are not recoverable from it.</>
        },
        {
          id: "partial",
          label: "Somewhere in between, depending on how far it got",
          note: "That would be the behaviour if writing overwrote byte by byte from the start, which is a fair guess but not what happens. The length goes to zero at the open and grows from there."
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
          <code className="aw-code">printf</code> with a file as its first
          argument. It is the one to reach for whenever a value has to be
          formatted. Here it writes twelve bytes — eleven characters and the{" "}
          <code className="aw-code">\n</code> that makes this a complete first
          line.
        </p>
        <p className="aw-p">
          <code className="aw-code">fputs</code> writes a string exactly as given.
          Note the argument order, because it is the reverse of{" "}
          <code className="aw-code">fprintf</code>:{" "}
          <strong>the string first, the file second</strong>. Getting it the wrong
          way round is only a <strong>warning</strong> on most compilers —{" "}
          <code className="aw-code">incompatible pointer types</code> — so the
          program still builds and still runs. By the time it crashes, the{" "}
          <code className="aw-code">"w"</code> open has already emptied your file.
          Treat that warning as fatal: compile with{" "}
          <code className="aw-code">-Wall</code> and read it.{" "}
          <code className="aw-code">fputs</code> adds no newline of its own, so
          the next write continues on the same line.
        </p>
        <p className="aw-p">
          <code className="aw-code">fputc</code> writes one character.{" "}
          <strong>Single quotes.</strong>{" "}
          <code className="aw-code">'?'</code> is a character;{" "}
          <code className="aw-code">"?"</code> is a string, which is a different
          type and the wrong one. The previous version of this handout printed{" "}
          <code className="aw-code">fputc("?", fp)</code> in its example. It does
          not compile cleanly and it is not what you want.
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
          note: <>One call is not one line. Only <code className="aw-code">fprintf</code> wrote a <code className="aw-code">\n</code> here; the other two added characters to the line that <code className="aw-code">\n</code> started.</>
        },
        {
          id: "two",
          label: "Two, and the second one is unfinished",
          correct: true,
          note: <>Correct. The <code className="aw-code">\n</code> in the <code className="aw-code">fprintf</code> ends line one. <code className="aw-code">fputs</code> and <code className="aw-code">fputc</code> then build line two — <code className="aw-code">where is no. 2?</code> — which has no newline after it, so anything written next continues on that same line. Stage 3's append step has to allow for that.</>
        },
        {
          id: "one",
          label: "One long line, because only fprintf ends with a newline",
          note: <>The <code className="aw-code">\n</code> is genuinely there, and a newline is an ordinary byte in the middle of the file that ends the line before it. So there are two lines — the second is simply not terminated.</>
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
          if it is missing, exactly as{" "}
          <code className="aw-code">"w"</code> does, but if the file exists it
          leaves the contents alone and starts writing at the end. Nothing already
          stored is lost. That one letter is the whole difference between a log
          that accumulates and a log that only ever holds the last run.
        </p>
        <p className="aw-p">
          Look at the leading <code className="aw-code">\n</code> in the string.{" "}
          <code className="aw-code">02-write.c</code> left the file ending in{" "}
          <code className="aw-code">?</code> with no line break, so without it the
          two lines would run together as{" "}
          <code className="aw-code">where is no. 2?How about no. 3?</code>. When
          you append to a file, the state you are appending to is whatever the last
          program left behind, and you have to know what that was.
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
        note: <>Then <code className="aw-code">02-write</code> and <code className="aw-code">03-append</code> have both run, in that order, in the same folder. That file is 44 bytes and stage 4 reads every one of them.</>
      },
      alt: {
        label: "I see fewer lines, or the text is run together",
        note: <>Two lines with <code className="aw-code">no. 2?How</code> joined means the leading <code className="aw-code">\n</code> is missing from the append string. Only one line, or an empty file, means <code className="aw-code">03-append.c</code> was opened with <code className="aw-code">"w"</code> rather than <code className="aw-code">"a"</code> — check the mode letter, then run <code className="aw-code">02-write</code> again to rebuild the file.</>
      }
    }
  },
  {
    id: "S3.4",
    stage: 3, n: 4,
    title: "Why fclose is not optional",
    action: <>Step through the five calls of <code className="aw-code">02-write.c</code> below, watching the buffer rather than the file.</>,
    body: (
      <>
        <p className="aw-p">
          Writing does not go to disk. It goes into a{" "}
          <strong>write buffer</strong> in memory, and the buffer is written out
          when it fills or when the stream is closed. This is a speed measure: a
          disk is far happier to receive one block of bytes than 27 separate
          one-byte requests.
        </p>
        <p className="aw-p">
          It is also invisible. Every call in the figure returns successfully.
          Nothing reports an error. And until the last frame the file on disk holds
          none of what the program has written. Walk the calls and watch the two
          strips disagree.
        </p>
      </>
    ),
    media: (
      <>
        <FileMachine
          file={{ name: "test.txt", content: AFTER_WRITE }}
          trace={writeTrace}
          caption="02-write.c, one call at a time. The upper strip is what the program has issued; the buffer strip below it is where those bytes actually are until the last call."
        />
        <p className="aw-p">
          The 27 bytes of <code className="aw-code">test.txt</code> after{" "}
          <code className="aw-code">02-write</code>: bytes 0 to 10 are{" "}
          <code className="aw-code">hello no. 1</code>, byte 11 is the newline,
          bytes 12 to 26 are <code className="aw-code">where is no. 2?</code>.{" "}
          <code className="aw-code">03-append</code> then writes 17 more — a
          newline and <code className="aw-code">How about no. 3?</code> — at bytes
          27 to 43, giving 44 bytes in total. There is no byte at offset 44; the
          file ends without a trailing newline, and stage 4 depends on that.
        </p>
      </>
    ),
    why: {
      label: "What if I need to see the file before the program ends?",
      body: <><code className="aw-code">fflush(fp)</code> writes the buffer out without closing the stream. It is useful when debugging a long loop, where the program may not reach its <code className="aw-code">fclose</code> for several minutes — or at all, if it is the loop that is wrong. It is not a substitute for <code className="aw-code">fclose</code>, which also releases the handle.</>
    },
    difficulty: "The file is empty, or my data has vanished",
    fix: 4,
    check: {
      kind: "predict",
      question: "Delete the fclose line from 02-write.c, recompile, and run it in a folder with no test.txt. What do you find on disk afterwards?",
      options: [
        {
          id: "full",
          label: "A complete 27-byte test.txt, exactly as before",
          correct: true,
          note: <>Correct, and it is worth knowing why, because the usual answer to this question is wrong. Returning from <code className="aw-code">main</code> calls <code className="aw-code">exit</code>, and <code className="aw-code">exit</code> is required to flush and close every stream still open. So the buffer is written out for you here. What <code className="aw-code">fclose</code> gives you is the <em>guarantee</em>: it happens where you put it, rather than at the end of a program that may never get there.</>
        },
        {
          id: "empty",
          label: "A test.txt that exists and is empty",
          note: <>The reading everyone has, and it is right about the mechanism and wrong about this program. The bytes really are sitting in the buffer, and they really would be lost — but only if the program ends <strong>abnormally</strong>. Put an infinite loop or a crash before the end of <code className="aw-code">main</code> and you will get the empty file you expected here.</>
        },
        {
          id: "error",
          label: "An error message, or a crash on exit",
          note: "Nothing reports anything. That is the property worth carrying forward: when file output does go missing, it goes missing silently, and the only evidence is a file that is not what you expected."
        }
      ]
    }
  }
];
