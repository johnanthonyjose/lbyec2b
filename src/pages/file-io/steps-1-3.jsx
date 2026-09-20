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
   slashes, knowing which folder the program runs in — are taught before the
   first byte is written rather than after the first hour is lost. Its last
   step opens two files at once, because a program with an input and an output
   is the ordinary case and every later program on this page is one.

   Stage 3 is built around the write buffer, which is the one thing in these
   three stages that cannot be seen in the source at all. It gets the
   FileMachine for that reason and for no other.

   The prose is written short on purpose: one idea per sentence, concrete
   before abstract, and one analogy per concept — a ticket for the FILE*, a
   buffer that is emptied for the write buffer — dropped as soon as it has
   done its work. Corrections to the older course handout are student-facing
   noise, so they live in the `why` folds and in resolutions.jsx, never in a
   step body.

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
   they are all still in the buffer, and the buffer strip under the file is
   what says so. The counts are the ones measured on the real file — 12 bytes
   from the fprintf, 14 from the fputs, 1 from the fputc. */
const writeTrace = [
  {
    call: 'fp = fopen("test.txt", "w");',
    pos: 0,
    buffered: "",
    note: "Nothing has been written yet. But test.txt already exists, and it is already empty. \"w\" truncated it as it opened, before any write call ran."
  },
  {
    call: 'fprintf(fp, "hello no. %i\\n", 1);',
    pos: 12,
    buffered: "hello no. 1\\n",
    note: "Twelve bytes issued: eleven characters and the newline. They are in memory. The file on disk is still zero bytes long."
  },
  {
    call: 'fputs("where is no. 2", fp);',
    pos: 26,
    buffered: "hello no. 1\\nwhere is no. 2",
    note: "Fourteen more bytes, and still nothing on disk. A program that crashed here would leave you an empty file. It would report no error at all. One that ends normally is flushed for it by exit."
  },
  {
    call: "fputc('?', fp);",
    pos: 27,
    buffered: "hello no. 1\\nwhere is no. 2?",
    note: "One more byte. The buffer now holds all 27 bytes the program means to write. The file still holds none of them."
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
        It asks for a number. It prints the number back. Then it ends. Every
        program you have written in this course so far has that shape.
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
        caption="The whole program. Compile it with: gcc -Wall -o forget forget.c"
      />
    ),
    check: {
      kind: "predict",
      question: "Run it once and give it a number. Now run it a second time. What will the second run print?",
      options: [
        {
          id: "remembers",
          label: "The number from the first run",
          note: "The number was on the screen a second ago. So it feels as though the program still has it. It does not. No line in forget.c put that number anywhere outside the run."
        },
        {
          id: "asks-again",
          label: "It asks for a number again, and knows nothing about the first run",
          correct: true,
          note: "Correct. The second run is a new process with new memory. n sits at a fresh address holding whatever was last left there. The first run's value is not available to it at all."
        },
        {
          id: "zero",
          label: "Zero, because n is reset",
          note: "Right answer, wrong reason. Nothing resets n. An uninitialized local variable holds whatever bytes were at that address. The point is not that the value became zero. It is that no value survives."
        }
      ]
    }
  },
  {
    id: "S1.2",
    stage: 1, n: 2,
    title: "Name what happened",
    action: <>Read the short paragraphs below, then say the reason in one sentence of your own.</>,
    body: (
      <>
        <p className="aw-p">
          The variable <code className="aw-code">n</code> lived in main memory.
          That is the working store the processor reads and writes directly. The
          memory belonged to the <strong>process</strong>, which is your program
          while it is running. When <code className="aw-code">main</code>{" "}
          returned, the process ended. The operating system took back every byte
          it held, including the bytes holding your number.
        </p>
        <p className="aw-p">
          This is not a fault. It is the arrangement that lets one machine run a
          thousand programs a day. But it means that anything a program is to
          keep must go somewhere the process does not own. That somewhere is a{" "}
          <strong>file</strong>: a named sequence of bytes on a storage device.
          The device is <strong>secondary storage</strong> — a hard disk or a
          flash drive — rather than memory. That is the physical difference.
          Memory belongs to the process. The disk does not. A file outlives the
          program that wrote it, and it survives the machine being switched off.
        </p>
        <p className="aw-p">
          A file holds any kind of data. Text. Audio. Video. Images. One file
          can hold a combination of them.
        </p>
        <p className="aw-p">
          File I/O is how you put bytes into a file and get them back out. There
          are two reasons to reach for it:
        </p>
        <ul className="aw-p">
          <li>You want to keep data after the computer is switched off.</li>
          <li>There is not enough memory to hold the data at all.</li>
        </ul>
        <p className="aw-p">
          This week the reason is the first one.
        </p>
      </>
    ),
    why: {
      label: "Where does the number actually go?",
      body: <>The memory is not wiped. The operating system marks those pages as free. The next process that asks gets them, along with whatever your run left there. Nothing reads it back, because nothing knows it is there. A file has a name, so something can ask for it later.</>
    },
    check: {
      kind: "self",
      question: "Without looking back, can you say in one sentence why the second run lost your number?",
      ok: {
        label: "Yes — the process ended and its memory went with it",
        note: "That is the sentence. The next four stages are all ways of putting bytes somewhere that sentence does not apply to."
      },
      alt: {
        label: "Not quite yet",
        note: <>Read the second paragraph again, then look at the program beside it. No line in <code className="aw-code">forget.c</code> names a place outside the program. Storage with no name cannot be asked for later. Memory belonging to a process that has ended cannot be asked for at all.</>
      }
    }
  },
  {
    id: "S1.3",
    stage: 1, n: 3,
    title: "Open a program in a text editor",
    action: <>Open a compiled program in Notepad, TextEdit or VS Code. Do not run it. Just look.</>,
    body: (
      <>
        <p className="aw-p">
          On Windows, find a <code className="aw-code">.exe</code>. The{" "}
          <code className="aw-code">forget.exe</code> you just compiled will do.
          Open it with Notepad rather than running it. On a Mac, open the
          compiled <code className="aw-code">forget</code> file itself, the one
          with no extension. It is worth the thirty seconds.
        </p>
        <p className="aw-p">
          What you get is mostly unreadable. Runs of accented letters, blank
          squares, long stretches of nothing. The editor has not failed. It did
          what it always does: it drew the character each byte stands for. Those
          bytes were never meant to stand for characters.
        </p>
        <p className="aw-p">
          That is the whole distinction. In a <strong>text file</strong>, every
          byte is a character. The characters are organized into{" "}
          <strong>lines</strong>, and you can read them yourself in any editor.
          That is what <strong>human-readable</strong> means. In a{" "}
          <strong>binary file</strong>, a byte can mean anything at all. The
          application that wrote the file decides what. Machine instructions in
          an executable. Samples in an audio file. Pixels in an image. The bytes
          are the same kind of thing in both cases. Only the intended reading
          differs, and the file does not carry that reading inside it.
        </p>
        <p className="aw-p">
          Text files are not only <code className="aw-code">.txt</code> files. An
          HTML page is a text file. So is an XML file. Notepad shows you all
          three, and all three are characters in lines.
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
          note: "Opening alone is harmless. Saving is not. Notepad writes back what it is showing, and it cannot show bytes it had no character for. What it writes back is not what it read."
        },
        {
          id: "broken",
          label: "It is damaged and will probably refuse to run",
          correct: true,
          note: "Correct, and this is why the exercise is to look rather than to save. Every byte the editor could not represent is written back as a substitute. The machine instructions are now different instructions. Look, close without saving, and keep a copy of anything you care about."
        },
        {
          id: "slower",
          label: "It runs, but slower or with odd output",
          note: "A reasonable guess, but damaged machine code is rarely graceful. The operating system checks the structure of an executable before running it. The usual result is a refusal to start."
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
          <strong>convention</strong>: a promise by whoever named the file about
          what is inside it. It is not enforced and it is not checked. Plenty of
          files do not follow it.
        </p>
        <p className="aw-p">
          This matters to a program that is about to open one.{" "}
          <code className="aw-code">fopen</code> does not look inside a file. It
          does not care what the file is called. It hands you the bytes. Read a{" "}
          <code className="aw-code">.txt</code> that is really a spreadsheet with{" "}
          <code className="aw-code">fgets</code> and you get rubbish. Nothing
          reports an error, because nothing went wrong as far as C is concerned.
          Your program is the only thing that knows what the bytes were supposed
          to mean.
        </p>
        <p className="aw-p">
          Everything from this point on is <strong>text files only</strong>.
          Every program in this handout opens a file in text mode. Each one
          reads and writes characters, and treats a line as the unit. Binary
          files are not difficult, but they are not this week.
        </p>
      </>
    ),
    why: {
      label: "Then how does anything know what a file is?",
      body: <>Mostly by looking inside. Many formats start with a few fixed bytes, called a <em>magic number</em>. A PNG starts with 0x89 then the letters PNG. A PDF starts with %PDF. Editors read those bytes and treat the extension as a guess. Your program can define the format it expects and reject the rest.</>
    },
    check: {
      kind: "self",
      question: "Could you explain to a classmate what a file is, and how text differs from binary?",
      ok: {
        label: "Yes — a named sequence of bytes, read as characters or not",
        note: "That is stage 1. You have the problem and you have the vocabulary. Stage 2 opens a file."
      },
      alt: {
        label: "I could name them but not explain the difference",
        note: <>Go back to what Notepad did with the executable. It performed exactly one operation: draw the character for each byte. That operation is what defines a text file. A binary file is one where it produces nonsense, because the bytes were meant for something else.</>
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
          You already include <code className="aw-code">stdio.h</code> for{" "}
          <code className="aw-code">printf</code>. Files use the same header.
          There is nothing new to add.
        </p>
        <p className="aw-p">
          Your program cannot hold a file. It holds a <strong>ticket</strong> to
          one. <code className="aw-code">FILE *fp;</code> is that ticket.
        </p>
        <ul className="aw-p">
          <li><code className="aw-code">fopen</code> gives you one.</li>
          <li>Every read and every write needs you to show it.</li>
          <li><code className="aw-code">fclose</code> hands it back.</li>
        </ul>
        <p className="aw-p">
          You never look inside <code className="aw-code">fp</code>. You never
          change what it points at. You just carry it.
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
      body: <>The bookkeeping belongs to the library. Its size differs between compilers and may change. A copy would be broken private state, not a second handle. One pointer means one authoritative record per open file. An older handout named <code className="aw-code">stdlib.h</code> for the file functions. It is <code className="aw-code">stdio.h</code>, for reading and writing alike.</>
    },
    check: {
      kind: "self",
      question: "Does your file so far contain the stdio.h include and the FILE * declaration?",
      ok: {
        label: "Yes, and it compiles",
        note: "A program that declares a pointer and does nothing with it is legal, and does nothing. The next step gives it something to point at."
      },
      alt: {
        label: "The compiler complains about FILE",
        note: <>An "unknown type name FILE" means <code className="aw-code">stdio.h</code> is missing or misspelled. Check the angle brackets and the spelling: <code className="aw-code">stdio</code>, not <code className="aw-code">studio</code>. That typo is the one this course sees most often.</>
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
          <code className="aw-code">fopen</code> takes a file name and a mode,
          and gives you the ticket. <code className="aw-code">"r"</code> means
          read-only, and it never creates anything. If{" "}
          <code className="aw-code">test.txt</code> is not there,{" "}
          <code className="aw-code">fopen</code> fails. You have not written{" "}
          <code className="aw-code">test.txt</code> yet. That is deliberate: this
          program is meant to fail first.
        </p>
        <p className="aw-p">
          A bare name like <code className="aw-code">"test.txt"</code> does not
          mean "beside my source file". It means "in the{" "}
          <strong>working directory</strong>", the folder the program was
          launched from. Build in one folder and run from another. The name is
          then looked for somewhere you are not looking. Your editor may run
          the program from the project root while the source sits in a
          subfolder. This is the commonest reason an{" "}
          <code className="aw-code">fopen</code> fails in this course.
        </p>
        <p className="aw-p">
          You can put a path in front of the name. There are two kinds.
        </p>
        <ul className="aw-p">
          <li>
            An <strong>absolute path</strong> names the file from the top of the
            drive. <code className="aw-code">"c:/temp/test1.txt"</code> is
            test1.txt in the temp folder on drive C. It means the same file
            wherever the program was launched from.
          </li>
          <li>
            A <strong>relative path</strong> starts from the working directory.{" "}
            <code className="aw-code">"test.txt"</code> is one. So is{" "}
            <code className="aw-code">"../test2.txt"</code>. The two dots mean
            the <strong>parent directory</strong>, one folder up from the
            working one.
          </li>
        </ul>
        <p className="aw-p">
          Use forward slashes in either kind. Windows accepts them. The same
          source then runs unchanged on a Mac. Two minutes on the panel below
          can save you an hour later.
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
      body: <>In C source a backslash starts an escape sequence. The compiler resolves it before your program runs. <code className="aw-code">\t</code> is not a backslash and a t. It is one tab. So <code className="aw-code">fopen</code> receives <code className="aw-code">c:</code>, tab, <code className="aw-code">emp</code>, tab, <code className="aw-code">est1.txt</code>. Forward slashes avoid this. Doubling each backslash works too.</>
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
          note: "That is what the line looks like, which is why the fault hides so well. But the compiler processes escape sequences first. What is typed and what is passed are two different strings here."
        },
        {
          id: "fourteen",
          label: "Fourteen, because each backslash pair collapsed to one character",
          correct: true,
          note: <>Correct. <code className="aw-code">\t</code> collapses to a tab. <code className="aw-code">\d</code> collapses to a plain <code className="aw-code">d</code>, with a compiler warning you probably did not see. What reaches <code className="aw-code">fopen</code> is <code className="aw-code">c:</code>, a tab, then <code className="aw-code">empdata.txt</code>. Sixteen typed, fourteen passed, and no such file anywhere.</>
        },
        {
          id: "error",
          label: "None — it would not compile",
          note: <>An unknown escape such as <code className="aw-code">\d</code> is a warning, not an error. The program compiles and it runs. That is precisely the difficulty: nothing stops you, and the failure arrives later and in silence.</>
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
          It does not crash. It prints nothing. The program carries on with a
          pointer that refers to nothing. Every read or write through that
          pointer is undefined behavior. On most machines that means a crash
          several lines away from the real fault.
        </p>
        <p className="aw-p">
          <code className="aw-code">perror</code> prints your message, then a
          colon, then the reason the operating system recorded.{" "}
          <code className="aw-code">No such file or directory</code>.{" "}
          <code className="aw-code">Permission denied</code>. That second half is
          the whole value of it. It is the difference between knowing the open
          failed and knowing why. It costs you one line.
        </p>
        <p className="aw-p">
          Every <code className="aw-code">fopen</code> you write this term gets
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
          note: <>This is what you would get without <code className="aw-code">perror</code>. The <code className="aw-code">return 1</code> does end the run. But <code className="aw-code">perror</code> has already printed by then.</>
        },
        {
          id: "perror-line",
          label: "Could not open test.txt: No such file or directory",
          correct: true,
          note: "Correct, and that is the exact line: your message, a colon, and the operating system's reason. Exit status 1. The program is working as intended. The file genuinely is not there yet."
        },
        {
          id: "opened",
          label: "test.txt opened for reading.",
          note: <>Only once <code className="aw-code">test.txt</code> exists. Mode <code className="aw-code">"r"</code> never creates a file. On a first run in an empty folder there is nothing for it to open.</>
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
          <code className="aw-code">fclose</code> releases the handle. For a file
          opened for writing it also flushes what is still in memory. Stage 3 is
          about that second job. Here the first one matters. An operating system
          allows a process a limited number of open files. A program that opens
          in a loop without closing runs out.
        </p>
        <p className="aw-p">
          Run it now. You will see the first output below. Come back after stage
          3, once <code className="aw-code">test.txt</code> exists, and run it
          again for the second. The failure is the one you will meet first, and
          it is the point of the program.
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
      body: <>The value <code className="aw-code">main</code> returns is the program's exit status. The shell keeps it. Zero means the run succeeded. Anything else means it did not. Nothing here inspects it. But your program will soon be one step of a pipeline. A truthful status tells the next step whether to run.</>
    },
    difficulty: "The program runs, prints nothing, and exits normally",
    fix: 3,
    check: {
      kind: "self",
      question: "Did you see the perror line, with a reason after the colon?",
      ok: {
        label: "Yes — it told me the file does not exist",
        note: "That is the habit this stage exists to install. Your program now fails loudly. Every remaining failure this week will have a message attached to it."
      },
      alt: {
        label: "It ran and printed nothing at all",
        note: <>Silence with a zero exit status means neither branch printed. Check that the <code className="aw-code">printf</code> sits outside the <code className="aw-code">if</code> block. Check that nothing returns before it. The resolution above is a procedure for finding where the silence begins.</>
      }
    }
  },
  {
    id: "S2.5",
    stage: 2, n: 5,
    title: "Open two files at once",
    action: <>Read <code className="aw-code">10-twofiles.c</code> below rather than running it. Count the pointers, the checks and the closes.</>,
    body: (
      <>
        <p className="aw-p">
          Almost every useful program has an input and an output. That is two
          files open at the same time. Your machine problem will have both. So
          will your project.
        </p>
        <p className="aw-p">
          <code className="aw-code">10-twofiles.c</code> reads{" "}
          <code className="aw-code">cars.txt</code> and writes{" "}
          <code className="aw-code">plates.txt</code>. The loop in the middle
          uses reading calls you meet in stage 4. Ignore it for now. Look only
          at the pointers, the checks and the closes.
        </p>
        <ul className="aw-p">
          <li>
            Each open file needs its own pointer. Two names on one line is still
            two separate tickets.
          </li>
          <li>
            Check both opens. Either one can fail on its own, for its own
            reason.
          </li>
          <li>Two files open means two files to close.</li>
        </ul>
        <p className="aw-p">
          Look at the second check closely. By then{" "}
          <code className="aw-code">cars.txt</code> is already open. So that
          branch closes the input before it returns. One open that failed is no
          reason to abandon one that worked.
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
      body: <>Here you could skip it. Ending the process closes every stream anyway. But <code className="aw-code">main</code> is the one place that is true. Move this code into a function of its own. The function returns while the program carries on. Then the file stays open and nothing tells you. Closing on every path is the habit that keeps working after the code moves.</>
    },
    check: {
      kind: "predict",
      question: "cars.txt opens. plates.txt then fails, so the program prints its perror line and returns 1. You delete the fclose(fpIn) from that branch. What goes wrong?",
      options: [
        {
          id: "nothing-visible",
          label: "Nothing you can see — the process ends and the file is released with it",
          correct: true,
          note: <>Correct, and it is the reason the habit is hard to learn. The exit cleans up after you. But this code soon becomes a function rather than a <code className="aw-code">main</code>. A function that returns cleans up nothing.</>
        },
        {
          id: "locked",
          label: "cars.txt stays locked until you restart the machine",
          note: "Reasonable, but no. An open file is bookkeeping inside a process. When the process ends, the operating system drops that bookkeeping. No file outlives it in a locked state."
        },
        {
          id: "crash",
          label: "The program crashes on the return",
          note: <>Nothing crashes. <code className="aw-code">fpIn</code> is a valid pointer to an open file and it is simply never used again. A leak is quiet by nature. Close on the failing path anyway.</>
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
          Mode <code className="aw-code">"w"</code> creates the file if it is
          missing. If the file exists, <code className="aw-code">"w"</code>{" "}
          <strong>truncates it to zero bytes</strong>. That happens at the moment
          of opening. It happens before a single character is written, and
          whether or not you go on to write anything. Whatever was in the file is
          gone at that point.
        </p>
        <p className="aw-p">
          So a write program that crashes halfway through leaves an empty file
          rather than a partial one. And re-running a write program destroys what
          the previous run produced. Keep one copy of any data you care about
          outside the folder your program writes into.
        </p>
        <p className="aw-p">
          The NULL check is here too. Opening for writing fails less often than
          opening for reading. It still fails: a folder that does not exist, a
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
      question: "A program opens an existing 5,000-byte file with \"w\". It crashes before writing anything. How large is the file now?",
      options: [
        {
          id: "five-thousand",
          label: "5,000 bytes — nothing was written, so nothing changed",
          note: "The reasonable reading, and the reason this loses people their data. Truncation is not something the write calls do. It is something the open does, and it had already happened when the crash came."
        },
        {
          id: "zero",
          label: "Zero bytes",
          correct: true,
          note: <>Correct. <code className="aw-code">"w"</code> empties the file as part of opening it. The file is now zero bytes. The previous contents are not recoverable from it.</>
        },
        {
          id: "partial",
          label: "Somewhere in between, depending on how far it got",
          note: "That would be right if writing overwrote byte by byte from the start. It is a fair guess, but not what happens. The length goes to zero at the open, then grows from there."
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
          argument. Reach for it whenever a value has to be formatted. Here it
          writes twelve bytes: eleven characters and the{" "}
          <code className="aw-code">\n</code> that ends the first line.
        </p>
        <p className="aw-p">
          <code className="aw-code">fputs</code> writes a string exactly as
          given. Watch the argument order. It is the reverse of{" "}
          <code className="aw-code">fprintf</code>:{" "}
          <strong>the string first, the file second</strong>. Getting it the
          wrong way round is only a <strong>warning</strong> on most compilers,{" "}
          <code className="aw-code">incompatible pointer types</code>. The
          program still builds and still runs. By the time it crashes, the{" "}
          <code className="aw-code">"w"</code> open has already emptied your
          file. Treat that warning as fatal. Compile with{" "}
          <code className="aw-code">-Wall</code> and read it.{" "}
          <code className="aw-code">fputs</code> adds no newline of its own, so
          the next write continues on the same line.
        </p>
        <p className="aw-p">
          <code className="aw-code">fputc</code> writes one character.{" "}
          <strong>Single quotes.</strong>{" "}
          <code className="aw-code">'?'</code> is a character.{" "}
          <code className="aw-code">"?"</code> is a string, which is a different
          type and the wrong one.
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
          note: <>One call is not one line. Only <code className="aw-code">fprintf</code> wrote a <code className="aw-code">\n</code> here. The other two added characters to the line that <code className="aw-code">\n</code> started.</>
        },
        {
          id: "two",
          label: "Two, and the second one is unfinished",
          correct: true,
          note: <>Correct. The <code className="aw-code">\n</code> in the <code className="aw-code">fprintf</code> ends line one. <code className="aw-code">fputs</code> and <code className="aw-code">fputc</code> then build line two: <code className="aw-code">where is no. 2?</code>. It has no newline after it, so anything written next continues on that same line. The append step has to allow for that.</>
        },
        {
          id: "one",
          label: "One long line, because only fprintf ends with a newline",
          note: <>The <code className="aw-code">\n</code> is genuinely there. A newline is an ordinary byte that ends the line before it. So there are two lines. The second is simply not terminated.</>
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
          Mode <code className="aw-code">"a"</code> is append. It creates the
          file if it is missing, exactly as{" "}
          <code className="aw-code">"w"</code> does. But if the file exists, it
          leaves the contents alone and starts writing at the end. Nothing
          already stored is lost. That one letter decides whether a log
          accumulates or only ever holds the last run.
        </p>
        <p className="aw-p">
          Look at the leading <code className="aw-code">\n</code> in the string.{" "}
          <code className="aw-code">02-write.c</code> left the file ending in{" "}
          <code className="aw-code">?</code> with no line break. Without that{" "}
          <code className="aw-code">\n</code> the two lines would run together as{" "}
          <code className="aw-code">where is no. 2?How about no. 3?</code>. When
          you append, you append to whatever the last program left behind. You
          have to know what that was.
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
        note: <>Then <code className="aw-code">02-write</code> and <code className="aw-code">03-append</code> have both run, in that order, in the same folder. That file is 44 bytes. Stage 4 reads every one of them.</>
      },
      alt: {
        label: "I see fewer lines, or the text is run together",
        note: <>Two lines with <code className="aw-code">no. 2?How</code> joined means the leading <code className="aw-code">\n</code> is missing from the append string. One line, or an empty file, means <code className="aw-code">03-append.c</code> was opened with <code className="aw-code">"w"</code> rather than <code className="aw-code">"a"</code>. Check the mode letter, then run <code className="aw-code">02-write</code> again to rebuild the file.</>
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
          <strong>write buffer</strong> in memory. The buffer is written out when
          it fills, or when the stream is closed. This is a speed measure. A disk
          is far happier to receive one block of bytes than 27 separate one-byte
          requests.
        </p>
        <p className="aw-p">
          It is also invisible. Every call in the figure returns successfully.
          Nothing reports an error. Until the last frame, the file on disk holds
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
          caption="02-write.c, one call at a time. The upper strip is what the program has issued. The buffer strip below it is where those bytes actually are until the last call."
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
          That is 44 bytes. There is no byte at offset 44. The file ends with no
          trailing newline, and stage 4 depends on that.
        </p>
      </>
    ),
    why: {
      label: "What if I need to see the file before the program ends?",
      body: <><code className="aw-code">fflush(fp)</code> writes the buffer out without closing the stream. It helps when debugging a long loop. The program may not reach its <code className="aw-code">fclose</code> for minutes. If the loop is the bug, it never will. It is not a substitute for <code className="aw-code">fclose</code>, which also releases the handle.</>
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
          note: <>Correct, and the reason is worth knowing, because the usual answer here is wrong. Returning from <code className="aw-code">main</code> calls <code className="aw-code">exit</code>. <code className="aw-code">exit</code> is required to flush and close every stream still open. So the buffer is written out for you. What <code className="aw-code">fclose</code> gives you is the <em>guarantee</em>. It happens where you put it. It does not wait for the end of a program that may never get there.</>
        },
        {
          id: "empty",
          label: "A test.txt that exists and is empty",
          note: <>The reading everyone has. It is right about the mechanism and wrong about this program. The bytes really are sitting in the buffer. They really would be lost, but only if the program ends <strong>abnormally</strong>. Put a crash before the end of <code className="aw-code">main</code>. Then you get the empty file you expected.</>
        },
        {
          id: "error",
          label: "An error message, or a crash on exit",
          note: "Nothing reports anything. That is the property worth carrying forward. When file output goes missing, it goes missing silently. The only evidence is a file that is not what you expected."
        }
      ]
    }
  }
];
