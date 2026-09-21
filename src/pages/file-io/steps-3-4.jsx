import React from "react";
import { CodeBlock, Terminal } from "./CodeBlock.jsx";
import { FileMachine } from "../../components/FileMachine.jsx";
import { LoopCompare } from "../../components/explorable/LoopCompare.jsx";
import { ParseWalker } from "../../components/explorable/ParseWalker.jsx";
import { CodeWalk } from "../../components/explorable/CodeWalk.jsx";

/* Stages 4 and 5 of the File I/O handout.

   Stage 4 is where this handout stops resembling the document it replaces.
   Everything before it could be checked by looking: the mode letter is in the
   source, the file either appeared on disk or it did not. Reading cannot be
   checked by looking, because what a read returns depends on the file position
   indicator, and that indicator is state inside the FILE object rather than
   anything written in the source. The old document noticed this once — "this
   program illustrates how to do read operations but also shows how difficult
   it can be to control what to read" — and then carried on as though it had
   not. Three steps here carry a FileMachine trace instead, so the position is
   on the screen while the sentence about it is being read.

   The prose names that state by its standard term, the file position
   indicator, and does not substitute a folksy image for it. An earlier draft
   did, and the image was removed rather than softened, because it invited the
   reader to treat the position as something the programmer maintains by hand
   rather than as a field the library advances on every successful read.

   Four further steps carry an explorable rather than a trace. S3.3 runs both
   read loops side by side under LoopCompare, and S4.3 walks getDelimitedItem
   character by character under ParseWalker. S4.4 and S4.6 then use the
   generalised CodeWalk: S4.4 follows main's loop over cars.csv, which is the
   sequel to S4.3 in that four calls there assemble one record here, and S4.6
   follows the call nesting of 09-modular.c, which is the one thing a set of
   static excerpts of three functions cannot show. In every case the figure is
   the explanation and the prose around it was deleted rather than shortened:
   what remains is only what a figure cannot show, which is why the library is
   shaped the way it is and what the standard does and does not guarantee.

   Every `pos` below is transcribed from the ftell() tables in PROGRAMS.md. No
   position here was calculated by hand, and none may be. If a trace and a
   compiler ever disagree, the compiler is right and this file is wrong.

   The programs of stage 4 run to thirty lines and more, and no two consecutive
   excerpts of one program are contiguous in its source, so nothing here is
   shown whole and nothing here can be merged: a merged block would number its
   own lines wrongly. Where a CodeWalk now renders those same lines with the
   executing statement marked, the standalone excerpt was the same code printed
   twice and has been removed; anything its caption carried that the animation
   does not was folded into the figure's caption.

   Stage 4 has no resolutions attached. By that point the reader has a working
   picture of the position and of EOF, and the remaining failures are ordinary
   ones — a field in the wrong column, a year that is not a number — which the
   step's own checkpoint can carry. */

/* The 44 bytes of test.txt, exactly as 02-write.c and 03-append.c leave them.
   Note the absence of a trailing newline: it is why the third fgets returns a
   line of length 16 with no line break of its own, and why 06-readline.c has
   to print one itself. */
const TEST_TXT = {
  name: "test.txt",
  content: "hello no. 1\nwhere is no. 2?\nHow about no. 3?"
};

export const steps34 = [
  /* ─────────────────────────────────────────────────────────────────────────
     Stage 3 — Reading it back
     ───────────────────────────────────────────────────────────────────────── */
  {
    id: "S3.1",
    stage: 3, n: 1,
    title: "Read one character at a time",
    action: <>Download <code className="aw-code">04-readchar.c</code>, put it beside your <code className="aw-code">test.txt</code>, compile it and run it.</>,
    body: (
      <p className="aw-p">
        Every stream carries a <strong>file position indicator</strong>: the
        offset, in bytes from the start of the file, at which the next operation
        will take place. It is state held inside the{" "}
        <code className="aw-code">FILE</code> object, not a variable you
        declare, and <code className="aw-code">ftell</code> reports it.{" "}
        <code className="aw-code">fgetc</code> returns the byte at that offset
        as an <code className="aw-code">int</code>, never a{" "}
        <code className="aw-code">char</code>, because it must also return{" "}
        <code className="aw-code">EOF</code>: a <strong>sentinel</strong>,
        negative and distinct from all 256 byte values. The standard does not
        fix whether plain <code className="aw-code">char</code> is signed, so
        the failure that follows from declaring one is implementation-defined.
      </p>
    ),
    media: (
      <>
        <CodeBlock
          file="04-readchar.c"
          from={7}
          focus={[4]}
          lines={[
            "    //c MUST be an int, never a char. fgetc returns every one of",
            "    //the 256 possible byte values plus a 257th value, EOF, which",
            "    //is negative. A char has no room left for that extra value,",
            "    //so a char loop either never ends or ends on real data.",
            "    int c;"
          ]}
        />
        <CodeBlock
          file="04-readchar.c"
          from={23}
          focus={[0]}
          lines={[
            "    while ((c = fgetc(fp)) != EOF) {",
            "        putchar(c);",
            "    }"
          ]}
          caption="The read is performed inside the loop condition. Step S3.3 shows why."
        />
        <FileMachine
          file={TEST_TXT}
          caption="The first six calls of 04-readchar.c. The bar marks the file position indicator."
          trace={[
            { call: "c = fgetc(fp)", pos: 1, vars: { c: "104 ('h')" }, note: "One call consumes one byte. The indicator stood at offset 0 before the call and stands at offset 1 after it." },
            { call: "c = fgetc(fp)", pos: 2, vars: { c: "101 ('e')" } },
            { call: "c = fgetc(fp)", pos: 3, vars: { c: "108 ('l')" } },
            { call: "c = fgetc(fp)", pos: 4, vars: { c: "108 ('l')" } },
            { call: "c = fgetc(fp)", pos: 5, vars: { c: "111 ('o')" } },
            { call: "c = fgetc(fp)", pos: 6, vars: { c: "32 (space)" }, note: "The space between 'hello' and 'no.' is a stored byte with the value 32, so it costs one call and one offset like any other." }
          ]}
        />
        <Terminal>{`hello no. 1
where is no. 2?
How about no. 3?`}</Terminal>
      </>
    ),
    why: {
      label: "Why is there no blank line after the output?",
      body: <>The last byte of <code className="aw-code">test.txt</code> is the question mark of <code className="aw-code">How about no. 3?</code>, and no line terminator follows it. A terminal begins a new row only when it is sent one, so the shell prompt resumes on the same row as the final line of output. The program is reporting the file faithfully; the file itself simply ends without a newline.</>
    },
    check: {
      kind: "predict",
      question: "You replace int c; with char c;, recompile, and run the program on test.txt. All 44 characters are printed as before. Is the choice of type therefore a matter of style?",
      options: [
        {
          id: "taste",
          label: "Yes — the file was read correctly, so either type serves",
          note: <>This is what you will observe on this compiler and this file, and it is precisely why the defect is expensive. <code className="aw-code">test.txt</code> holds plain English, so every byte in it is below 128 and none can be confused with the sentinel. The declaration is not idle; it simply has nothing to do until the data stops being plain text.</>
        },
        {
          id: "data",
          label: "No — it happens to work on this file and can fail on another",
          correct: true,
          note: <>Correct. <code className="aw-code">fgetc</code> returns one of 257 distinct values: each of the 256 byte values, plus the sentinel <code className="aw-code">EOF</code>. A <code className="aw-code">char</code> can encode only 256 of them, so one of two failures follows. Where plain <code className="aw-code">char</code> is signed, a data byte of 255 is converted to <code className="aw-code">-1</code> and terminates the loop in the middle of the file. Any file that is not plain text will demonstrate this. Where it is unsigned, no value the conversion can produce is negative, so the comparison never succeeds and the loop does not terminate at all. The choice between the two is made by your implementation, not by your program.</>
        },
        {
          id: "rejected",
          label: "No — the compiler ought to have rejected the declaration",
          note: <>It will not, because assigning an <code className="aw-code">int</code> to a <code className="aw-code">char</code> is a legal implicit conversion in C. Where plain <code className="aw-code">char</code> is unsigned, a compiler may issue a <code className="aw-code">tautological-constant-out-of-range-compare</code> diagnostic for the comparison. Where it is signed, as on most machines you will use this term, the translation is silent.</>
        }
      ]
    }
  },
  {
    id: "S3.2",
    stage: 3, n: 2,
    title: "The newline is a byte",
    action: <>Run <code className="aw-code">05-readascii.c</code> against the same <code className="aw-code">test.txt</code> and compare its output with the one above.</>,
    body: (
      <p className="aw-p">
        The loop is the one you have just run, with{" "}
        <code className="aw-code">%i</code> in place of{" "}
        <code className="aw-code">%c</code>. Each byte is printed as the integer
        stored on disk rather than as the glyph a terminal draws for it, which
        is the evidence for a claim otherwise easy to doubt: a line break is an
        ordinary byte.
      </p>
    ),
    media: (
      <>
        <CodeBlock
          file="05-readascii.c"
          from={18}
          focus={[1]}
          lines={[
            "    while ((c = fgetc(fp)) != EOF) {",
            "        printf(\"%i \", c);"
          ]}
        />
        <CodeBlock
          file="05-readascii.c"
          from={24}
          lines={[
            "        if (c == '\\n') {",
            "            printf(\"\\n\");",
            "        }"
          ]}
          caption="Presentation only: the row of numbers is broken wherever the file itself carries a line terminator."
        />
        <Terminal>{`104 101 108 108 111 32 110 111 46 32 49 10 
119 104 101 114 101 32 105 115 32 110 111 46 32 50 63 10 
72 111 119 32 97 98 111 117 116 32 110 111 46 32 51 63 -1`}</Terminal>
        <p className="aw-p">
          The <code className="aw-code">10</code> closing the first two rows is
          the line terminator. The <code className="aw-code">-1</code> is not a
          byte of the file at all: it is <code className="aw-code">EOF</code>,
          printed after the loop.
        </p>
        <FileMachine
          file={TEST_TXT}
          caption="Calls 10 to 13 of the same loop, across the first line terminator."
          trace={[
            { call: "c = fgetc(fp)", pos: 10, vars: { c: "32 (space)" }, note: "Call 10 returns the space and leaves the indicator at offset 10, where the '1' of 'no. 1' is stored." },
            { call: "c = fgetc(fp)", pos: 11, vars: { c: "49 ('1')" }, note: "Call 11 consumes the last visible character of line one. The indicator reaches offset 11, and the line is not yet complete." },
            { call: "c = fgetc(fp)", pos: 12, vars: { c: "10 ('\\n')" }, note: "Call 12 returns the line terminator itself, the value 10, and advances the indicator by one like any other read. Only now is line one complete." },
            { call: "c = fgetc(fp)", pos: 13, vars: { c: "119 ('w')" }, note: "Call 13 returns the first byte of line two. Nothing was skipped between the lines, because there was nothing between them to skip." }
          ]}
        />
      </>
    ),
    check: {
      kind: "predict",
      question: "The first row of that output ends in 10. What does that 10 represent?",
      options: [
        {
          id: "count",
          label: "A count of the characters on that line",
          note: <>A reasonable inference from its position at the end of the row, but the arithmetic does not support it. The first line is <code className="aw-code">hello no. 1</code>, which is eleven characters, or twelve once its terminator is counted. Ten is a count of nothing in this file.</>
        },
        {
          id: "byte",
          label: "The line terminator: one ordinary byte, stored in the file like any other",
          correct: true,
          note: <>Decimal 10 is the newline character, and in <code className="aw-code">test.txt</code> it is stored at offset 11. It is returned by an <code className="aw-code">fgetc</code> call of its own and advances the file position indicator by one, exactly as a letter would. What an editor shows you as a gap between two lines is this byte being rendered.</>
        },
        {
          id: "added",
          label: "A marker that printf adds on reaching the end of a line",
          note: <>The program does emit a line break of its own at that point, in the <code className="aw-code">if (c == '\n')</code> shown above, so the confusion is understandable. The <code className="aw-code">10</code> itself, however, originated in the file. <code className="aw-code">printf</code> reported the value <code className="aw-code">fgetc</code> returned, and it returned 10 because 10 was the next byte on disk.</>
        }
      ]
    }
  },
  {
    id: "S3.3",
    stage: 3, n: 3,
    title: "Loop on the read, not on feof",
    action: <>Review every read loop you have written so far and confirm that the read itself, rather than <code className="aw-code">feof</code>, supplies the condition.</>,
    body: (
      <>
        <p className="aw-p">
          Alongside the file position indicator, the{" "}
          <code className="aw-code">FILE</code> object holds two further pieces
          of state: an <strong>end-of-file indicator</strong> and an{" "}
          <strong>error indicator</strong>.{" "}
          <code className="aw-code">feof</code> and{" "}
          <code className="aw-code">ferror</code> report them. Both are set as a{" "}
          <em>side effect</em> of an operation already attempted and already
          failed; neither looks ahead to what the next call would do. That
          mechanism, not the duplicate line it produces, is the fault below.
          Both functions belong <em>after</em> a loop, where they distinguish
          exhaustion from failure, and never as its condition.
        </p>
      </>
    ),
    media: (
      <>
        <CodeBlock
          file="06-readline.c"
          from={23}
          focus={[0]}
          lines={[
            "    while (fgets(line, 100, fp) != NULL) {",
            "        printf(\"[%i] %s\", (int) strlen(line), line);",
            "    }"
          ]}
          caption="The correct arrangement: the value the loop tests is the value the read returned."
        />
        <CodeBlock
          from={1}
          focus={[0]}
          lines={[
            "while (!feof(fp)) {",
            "    fgets(line, 100, fp);",
            "    printf(\"[%i] %s\", (int) strlen(line), line);",
            "}"
          ]}
          caption="Reads more naturally as English, and is wrong. It is here so you can recognize it in your own code."
        />
        <LoopCompare />
        <p className="aw-p">
          As the figure notes, the duplicate needs a file ending in a newline.
          On one like <code className="aw-code">test.txt</code>, whose last line
          carries none, the third read sets the indicator itself and the defect
          hides.
        </p>
      </>
    ),
    why: {
      label: "Is feof ever the right function to call?",
      body: <>Yes, but after the loop rather than within it. A loop that has terminated does not by itself record why it terminated, and the two possible reasons call for different responses. <code className="aw-code">feof(fp)</code> reports that the stream was exhausted, which is the ordinary outcome; <code className="aw-code">ferror(fp)</code> reports that an operation failed, which is not. That distinction becomes important the moment you read a file you did not produce yourself.</>
    },
    difficulty: "The last record is printed twice, or one line of rubbish follows the output",
    fix: 5,
    check: {
      kind: "predict",
      question: "A file holds three lines and ends with a newline. It is read with while (!feof(fp)), and each pass prints the line it has just read. How many lines appear?",
      options: [
        {
          id: "three",
          label: "Three — one for each line in the file",
          note: <>This is what the code appears to say, which is why the fault regularly survives review. The third <code className="aw-code">fgets</code> stopped at that final newline rather than at the end of the stream, so the end-of-file indicator remains clear and the loop executes once more. A file whose last line carries no terminator does print three, and <code className="aw-code">test.txt</code> is such a file, because there the third read reaches the end and sets the indicator. The defect is present in both cases; it is merely concealed by some data.</>
        },
        {
          id: "four",
          label: "Four — the third line is printed twice",
          correct: true,
          note: <>The fourth pass attempts a read, and that read fails and sets the end-of-file indicator. <code className="aw-code">line</code> still holds the third line from the preceding pass, and the body has no means of detecting the failure, so the record is printed twice. Where the records are numeric rather than textual, the duplicate is considerably harder to notice.</>
        },
        {
          id: "none",
          label: "None — feof is true from the outset, so the loop never runs",
          note: <>Not so: both indicators are clear on a stream that has opened successfully, so the loop does execute. If a loop of yours genuinely never entered its body, the cause lies elsewhere, and it is most often an <code className="aw-code">fopen</code> that failed and was never checked.</>
        }
      ]
    }
  },
  {
    id: "S3.4",
    stage: 3, n: 4,
    title: "Read a line at a time with fgets",
    action: <>Run <code className="aw-code">06-readline.c</code>, then step through the trace below before reading the output.</>,
    body: (
      <p className="aw-p">
        <code className="aw-code">fgets(buf, size, fp)</code> copies bytes into{" "}
        <code className="aw-code">buf</code> and stops on the first of three
        conditions: a newline, <code className="aw-code">size - 1</code>{" "}
        characters stored, or an exhausted stream. It then writes a closing{" "}
        <code className="aw-code">\0</code> and returns{" "}
        <code className="aw-code">buf</code>, or{" "}
        <code className="aw-code">NULL</code> if nothing was read. In the first
        case the newline is <strong>retained</strong>, which is why every field
        read this way must be stripped before it is printed in a column.
      </p>
    ),
    media: (
      <>
        <CodeBlock
          file="06-readline.c"
          from={20}
          focus={[3]}
          lines={[
            "    //fgets stops at the \\n and KEEPS it in the buffer, so the",
            "    //length below counts it. It returns NULL when there is no",
            "    //line left, which is what ends the loop.",
            "    while (fgets(line, 100, fp) != NULL) {",
            "        printf(\"[%i] %s\", (int) strlen(line), line);",
            "    }"
          ]}
        />
        <FileMachine
          file={TEST_TXT}
          caption="Four calls to fgets on the 44 bytes of test.txt."
          trace={[
            {
              call: "fgets(line, 100, fp)",
              pos: 12,
              vars: { line: "\"hello no. 1\\n\"", "strlen(line)": "12" },
              note: "Twelve bytes are stored: eleven of text, plus the newline that fgets retained. The indicator now stands at offset 12, the 'w' of line two."
            },
            {
              call: "fgets(line, 100, fp)",
              pos: 28,
              vars: { line: "\"where is no. 2?\\n\"", "strlen(line)": "16" },
              note: "Sixteen bytes, the last of them the newline stored at offset 27, so the indicator advances past it to 28. Note that line was overwritten rather than appended to."
            },
            {
              call: "fgets(line, 100, fp)",
              pos: 44,
              vars: { line: "\"How about no. 3?\"", "strlen(line)": "16" },
              note: "Sixteen again, but for a different reason. This line carries no terminator, so fgets stopped on the third of its conditions: the stream was exhausted."
            },
            {
              call: "fgets(line, 100, fp)",
              pos: 44,
              eof: true,
              vars: { returned: "NULL" },
              note: "No characters remain, so NULL is returned, line is left untouched and the indicator does not move. This failed call also sets the end-of-file indicator, and it is the call that terminates the loop."
            }
          ]}
        />
        <Terminal>{`[12] hello no. 1
[16] where is no. 2?
[16] How about no. 3?`}</Terminal>
      </>
    ),
    why: {
      label: "Why 100, and what happens to a line longer than that?",
      body: <>The 100 is the size of the buffer, and <code className="aw-code">fgets</code> is defined never to write beyond it: at most 99 characters, plus the closing <code className="aw-code">\0</code>. A longer line is not lost but split, and the following call returns the remainder with no newline preceding it. The older <code className="aw-code">gets</code> accepted no size argument and so could not offer that guarantee, which is why C11 removed it from the language.</>
    },
    check: {
      kind: "predict",
      question: "The second fgets has just returned \"where is no. 2?\\n\". What does ftell now report for the file position indicator?",
      options: [
        {
          id: "sixteen",
          label: "16 — the length of the line that was just read",
          note: <>Sixteen is indeed the length of that line, but a position is not a length. The indicator is an offset measured from the start of the file, not from the start of the current line. The first call had already consumed twelve bytes, and 12 + 16 is 28.</>
        },
        {
          id: "twentyseven",
          label: "27 — at the newline that ends that line",
          note: <>The most plausible of the three distractors. The newline does occupy offset 27, but <code className="aw-code">fgets</code> consumed it and copied it into your buffer, which is precisely why <code className="aw-code">strlen</code> reported 16. The indicator identifies the next byte to be read, so it never rests on a byte that has already been consumed.</>
        },
        {
          id: "twentyeight",
          label: "28 — at the 'H' of the third line",
          correct: true,
          note: <>Bytes 12 through 27 have been consumed, the newline last of all, so the indicator advances to 28. That offset holds the first byte of <code className="aw-code">How about no. 3?</code>, which is exactly what the next call returns.</>
        }
      ]
    }
  },
  {
    id: "S3.5",
    stage: 3, n: 5,
    title: "Why the handout stops using fscanf",
    action: <>Read this step before you reach for <code className="aw-code">fscanf</code> in your machine problem, since it explains why the remaining programs avoid it.</>,
    body: (
      <p className="aw-p">
        <code className="aw-code">fscanf</code> is{" "}
        <code className="aw-code">scanf</code> with a stream as its first
        argument. Its format string is a sequence of{" "}
        <strong>directives</strong> matched against the input one after another,
        and one that fails to match ends the call, leaving the file position
        indicator wherever the failed conversion stopped rather than at a record
        boundary.
      </p>
    ),
    media: (
      <>
        <p className="aw-p">
          Two failures follow. <code className="aw-code">%s</code> stops at the
          first whitespace, so a field containing a space is assigned only as
          far as that space. Worse, <code className="aw-code">%i</code> matched
          against a character that cannot begin an integer consumes nothing, so
          one malformed line becomes a loop that never advances.
        </p>
        <p className="aw-p">
          Neither announces itself, because{" "}
          <code className="aw-code">fscanf</code> reports through its return
          value: the number of items successfully{" "}
          <strong>assigned</strong>, which may be fewer than the specifiers you
          wrote. Written as{" "}
          <code className="aw-code">{"if (fscanf(fp, \"%s %i\", name, &qty) != 2)"}</code>,
          a partial match is caught at once. The remedy, though, is a{" "}
          <strong>delimiter</strong>.
        </p>
      </>
    ),
    difficulty: "fscanf stopped in the middle of a line, or read nothing",
    fix: 6,
    check: {
      kind: "predict",
      question: "A line of the file reads Montero Sport. Your program calls fscanf(fp, \"%s\", model) once. What does model hold afterwards, and where is the file position indicator?",
      options: [
        {
          id: "whole",
          label: "model holds \"Montero Sport\", and the indicator is at the start of the next line",
          note: <>This is what <code className="aw-code">%s</code> appears to mean, which is why the misreading is so common. The specifier is defined to match a run of non-whitespace characters and to stop at the first whitespace it meets, and the space following <code className="aw-code">Montero</code> is whitespace.</>
        },
        {
          id: "word",
          label: "model holds \"Montero\", and \" Sport\" and the newline are still unread",
          correct: true,
          note: <>Correct, and observe that the delimiting space was not consumed either. The next call therefore meets a space, then <code className="aw-code">Sport</code>, then a newline, and it is expecting none of the three. Printing each field immediately after reading it exposes this in a single run.</>
        },
        {
          id: "nothing",
          label: "fscanf returns 0 and model is left untouched",
          note: <>That is the behavior of <code className="aw-code">%i</code> when matched against a character that cannot begin an integer. Against ordinary text, <code className="aw-code">%s</code> succeeds and returns 1. The difficulty is that it succeeds at a smaller task than the one you intended.</>
        }
      ]
    }
  },

  /* ─────────────────────────────────────────────────────────────────────────
     Stage 4 — Data worth reading
     ───────────────────────────────────────────────────────────────────────── */
  {
    id: "S4.1",
    stage: 4, n: 1,
    title: "What a delimiter is",
    action: <>Download <code className="aw-code">cars.txt</code> and <code className="aw-code">cars.csv</code> and open both in a text editor.</>,
    body: (
      <>
        <p className="aw-p">
          A stream is an undifferentiated sequence of bytes: it contains no
          fields and no records. Those a program imposes by convention, and the
          convention is a <strong>delimiter</strong>, a character agreed in
          advance to mark where a data item ends. A <strong>field</strong> lies
          between two delimiters; a <strong>record</strong> is a group of
          fields.
        </p>
      </>
    ),
    media: (
      <>
        <p className="aw-p">
          The two files hold the same four cars under two conventions. In{" "}
          <code className="aw-code">cars.txt</code> the delimiter is the{" "}
          <strong>line terminator</strong>; in{" "}
          <code className="aw-code">cars.csv</code> it is the{" "}
          <strong>comma</strong>.
        </p>
        <Terminal label="cars.txt — the first car">{`Toyota
Corolla
1995
TVX-111`}</Terminal>
        <p className="aw-p">
          A record now occupies one line, and the first of them is a{" "}
          <strong>header</strong>, which a program must read past.
        </p>
        <Terminal label="cars.csv — the header and the first car">{`make,model,year,plate
Toyota,Corolla,1995,TVX-111`}</Terminal>
        <p className="aw-p">
          Any <strong>in-band</strong> delimiter — one drawn from the same
          alphabet as the data — can occur inside a field, dividing the record
          in the wrong place with no diagnostic. The remedy is quoting: RFC 4180
          allows a CSV field to be enclosed in double quotes, within which a
          comma is ordinary text. The programs here implement no quoting rule
          and will mis-parse one.
        </p>
      </>
    ),
    why: {
      label: "Where does this lead after Week 3?",
      body: <>What you are about to build is a small data pipeline: a delimited file read record by record, converted, and presented as a table. The same structure recurs in MATLAB in Week 7, and again in the Week 13 team project, where the data is larger and the parsing is done for you. Writing it once by hand is what makes the library version legible later.</>
    },
    check: {
      kind: "self",
      question: "Do both files open in your editor, holding the same four records under two different delimiting conventions?",
      ok: {
        label: "Yes, both are open",
        note: "Keep them in the same folder as your programs, since the next two steps open them by bare relative name."
      },
      alt: {
        label: "One of them will not open, or appears as a single long line",
        note: <>A file that appears as one long line is an editor limitation rather than a fault in the data. Notepad recognizes only the Windows line ending, so a file terminated with bare newlines is displayed unbroken; VS Code handles both conventions. If a download is missing altogether, fetch it again, because every remaining step in this stage requires both files beside the program.</>
      }
    }
  },
  {
    id: "S4.2",
    stage: 4, n: 2,
    title: "End-of-line as the delimiter",
    action: <>Compile and run <code className="aw-code">07-fields.c</code> in the folder that holds <code className="aw-code">cars.txt</code>.</>,
    body: (
      <p className="aw-p">
        A record here is four consecutive lines, so one iteration is four calls
        to <code className="aw-code">fgets</code>. The{" "}
        <code className="aw-code">&amp;&amp;</code> operators between them do
        real work: C guarantees short-circuit evaluation, so the first call
        returning <code className="aw-code">NULL</code> prevents the rest from
        being made, and a file ending part-way through a record terminates the
        loop rather than printing leftovers.
      </p>
    ),
    media: (
      <>
        <CodeBlock
          file="07-fields.c"
          from={36}
          focus={[0]}
          lines={[
            "    while (fgets(make,  40, fp) != NULL &&",
            "           fgets(model, 40, fp) != NULL &&",
            "           fgets(year,  40, fp) != NULL &&",
            "           fgets(plate, 40, fp) != NULL) {"
          ]}
          caption="Four reads for one record, applying the condition of step S3.3 four times over."
        />
        <CodeBlock
          file="07-fields.c"
          from={41}
          lines={[
            "        stripNewline(make);",
            "        stripNewline(model);",
            "        stripNewline(year);",
            "        stripNewline(plate);"
          ]}
        />
        <CodeBlock
          file="07-fields.c"
          from={7}
          focus={[2]}
          lines={[
            "void stripNewline(char *s) {",
            "    int n = (int) strlen(s);",
            "    if (n > 0 && s[n - 1] == '\\n') {",
            "        s[n - 1] = '\\0';",
            "    }",
            "}"
          ]}
          caption="Overwriting the newline with \\0 terminates the string one character earlier. The n > 0 test guards against indexing before the start of an empty string."
        />
        <Terminal>{`MAKE         MODEL            YEAR   PLATE     
Toyota       Corolla          1995   TVX-111   
Toyota       Vios             2014   TJJ-100   
Mitsubishi   Montero Sport    2018   JJT-001   
Honda        Civic            2021   HCV-221   `}</Terminal>
        <p className="aw-p">
          <code className="aw-code">Montero Sport</code> is the value of an
          explicit delimiter: the space falls inside a field and the field
          arrives intact. The year is still a string of digits; step S4.4
          converts it.
        </p>
      </>
    ),
    check: {
      kind: "predict",
      question: "Suppose the four stripNewline calls were deleted and nothing else were changed. What would the table look like?",
      options: [
        {
          id: "identical",
          label: "Identical — printf ignores a trailing newline in a %s field",
          note: <><code className="aw-code">printf</code> discards nothing. It writes the bytes of the argument it is given, and a newline among them is written as a newline. The padding implied by <code className="aw-code">%-12s</code> is added after those bytes rather than in place of them.</>
        },
        {
          id: "spread",
          label: "Each field would be followed by a line break, so one record would occupy four lines",
          correct: true,
          note: <>Precisely, and the column widths would be wrong as well. <code className="aw-code">%-12s</code> counts the retained newline as one of its twelve characters, so the padding emitted after each field falls one short of what the layout requires.</>
        },
        {
          id: "crash",
          label: "The program would crash on the first row",
          note: <>Nothing in this change is unsafe: the strings remain properly terminated and no buffer is overrun. The result is a formatting defect rather than a memory defect, which is precisely why it survives long enough to appear in a submission.</>
        }
      ]
    }
  },
  {
    id: "S4.3",
    stage: 4, n: 3,
    title: "Splitting a line on commas",
    action: <>Open <code className="aw-code">08-csv.c</code> and read <code className="aw-code">getDelimitedItem</code> line by line alongside this step.</>,
    body: (
      <p className="aw-p">
        With the comma as the delimiter, four fields share a single line, so{" "}
        <code className="aw-code">fgets</code> can no longer separate them on
        your behalf. <code className="aw-code">getDelimitedItem</code> reads
        exactly one field and stops at a comma, the end of the record, or the
        end of the stream. Run the figure first, then read the code against it.
      </p>
    ),
    media: (
      <>
        <ParseWalker caption="The whole of getDelimitedItem, with the executing line marked as the cursor advances. out is the buffer the caller supplies and size is its capacity. Two branches never light up on this input. Line 32 discards a carriage return, which a file written on Windows will contain. Line 37 stops storing once n reaches size - 1, so an over-long field is truncated rather than allowed to run past the end of the buffer." />
        <p className="aw-p">
          The first character is read ahead of the loop so that two situations
          which look alike can be told apart: an exhausted stream, and a field
          that is legitimately empty. The first returns{" "}
          <code className="aw-code">-1</code>, the second{" "}
          <code className="aw-code">0</code>.
        </p>
        <p className="aw-p">
          Line 43 is the statement most often left out. Without it the loop
          tests the same value of <code className="aw-code">c</code>{" "}
          indefinitely and the program appears to hang.
        </p>
      </>
    ),
    why: {
      label: "Why not return the field itself?",
      body: <>A C function cannot safely return a pointer to an array declared within it, because that storage has a lifetime ending when the function returns; using the pointer afterwards is undefined behavior. Passing <code className="aw-code">out</code> and <code className="aw-code">size</code> as parameters leaves ownership of the memory with the caller, who knows how long it must live. This is the same convention <code className="aw-code">fgets</code> follows, and it leaves the return value free to report the length.</>
    },
    check: {
      kind: "predict",
      question: "getDelimitedItem may return -1, and it may return 0. What does a return of 0 report?",
      options: [
        {
          id: "eof",
          label: "That the stream has been exhausted",
          note: <>That condition is reported by <code className="aw-code">-1</code>, and it can arise only from the check placed before the loop, which is the one point at which no character at all was available. Keeping the two outcomes distinct is the entire purpose of that early check.</>
        },
        {
          id: "empty",
          label: "That a character was available, but the field contained none",
          correct: true,
          note: <>Most commonly this is a blank line at the end of the file: a delimiter arrived immediately, so no character was stored. <code className="aw-code">main</code> treats a first field of length 0 as an absent record and continues to the next iteration. That is why a stray trailing newline produces no spurious row in the table.</>
        },
        {
          id: "toolong",
          label: "That the field was longer than the buffer could hold",
          note: <>An over-long field returns the number of characters actually stored, which is <code className="aw-code">size - 1</code> rather than 0. The excess is consumed and discarded, so the truncation is silent, and that is a reason to size your buffers against the data you expect.</>
        }
      ]
    }
  },
  {
    id: "S4.4",
    stage: 4, n: 4,
    title: "One record per pass, and a year that is really a number",
    action: <>Compile and run <code className="aw-code">08-csv.c</code> in the folder that holds <code className="aw-code">cars.csv</code>.</>,
    body: (
      <p className="aw-p">
        The header line is read before the loop and discarded, and that read is
        checked: if it returns <code className="aw-code">NULL</code> the file
        held nothing at all, which is worth reporting rather than presenting as
        a table of zero cars.
      </p>
    ),
    media: (
      <>
        <CodeWalk
          title="One pass of the loop, and then the next"
          notice="Watch line 82: the value that call returns is what decides whether there is a record at all."
          caption="Step S4.3 followed one call to getDelimitedItem producing one field; here four of them assemble a record and one row is printed. sscanf applies the directive matching of fscanf to a string already in memory and likewise returns the number of items assigned, so that count, not the value left in y, reports whether the field was numeric. The year prints under %6i rather than %-6s because by then it is an int, right-aligned as numeric columns conventionally are."
          file="08-csv.c"
          source={[
            { n: 55, src: "    char make[40], model[40], year[40], plate[40];" },
            { n: 56, src: "    char header[120];" },
            { n: 57, src: "    int n;      //length of the first item of the record" },
            { n: 58, src: "    int y;" },
            { n: 69, src: "    if (fgets(header, 120, fp) == NULL) {" },
            { n: 70, src: "        printf(\"cars.csv is empty.\\n\");" },
            { n: 71, src: "        fclose(fp);" },
            { n: 72, src: "        return 1;" },
            { n: 73, src: "    }" },
            { n: 75, src: "    printf(\"%-12s %-16s %6s %-10s\\n\"," },
            { n: 76, src: "           \"MAKE\", \"MODEL\", \"YEAR\", \"PLATE\");" },
            { n: 82, src: "    while ((n = getDelimitedItem(fp, make, 40)) >= 0) {" },
            { n: 87, src: "        if (n == 0) {" },
            { n: 88, src: "            continue;" },
            { n: 89, src: "        }" },
            { n: 91, src: "        getDelimitedItem(fp, model, 40);" },
            { n: 92, src: "        getDelimitedItem(fp, year, 40);" },
            { n: 93, src: "        getDelimitedItem(fp, plate, 40);" },
            { n: 101, src: "        if (sscanf(year, \"%i\", &y) != 1) {" },
            { n: 102, src: "            printf(\"Skipping %s %s: year '%s' is not a number\\n\"," },
            { n: 103, src: "                   make, model, year);" },
            { n: 104, src: "            continue;" },
            { n: 105, src: "        }" },
            { n: 107, src: "        printf(\"%-12s %-16s %6i %-10s\\n\"," },
            { n: 108, src: "               make, model, y, plate);" },
            { n: 109, src: "    }" }
          ]}
          tracks={[
            {
              id: "clean",
              label: "cars.csv as supplied",
              frames: [
                {
                  lines: [69],
                  explain: "fgets copied the header line into header and returned a non-null pointer, so the empty-file branch is skipped.",
                  vars: { header: "\"make,model,year,plate\\n\"" },
                  note: "The column names are read only so that the loop below never meets them.",
                  out: []
                },
                {
                  lines: [75, 76],
                  explain: "The column headings are printed once, before any record has been read.",
                  out: ["MAKE         MODEL              YEAR PLATE     "]
                },
                {
                  lines: [82],
                  explain: "The first call filled make and returned 6, the number of characters stored, so the condition holds and a record begins.",
                  vars: { n: "6", make: "\"Toyota\"" },
                  note: "This one return value decides whether there is a record at all. The other three calls are not attempted unless it is at least 0.",
                  out: ["MAKE         MODEL              YEAR PLATE     "]
                },
                {
                  lines: [87],
                  explain: "n is 6 rather than 0, so a character was stored and this is a car rather than a blank line.",
                  vars: { n: "6" },
                  out: ["MAKE         MODEL              YEAR PLATE     "]
                },
                {
                  lines: [91, 92, 93],
                  explain: "Three further calls complete the record, each resuming at the position the previous call left.",
                  vars: { model: "\"Corolla\"", year: "\"1995\"", plate: "\"TVX-111\"" },
                  note: "year holds four digit characters, not a number. Nothing so far has converted it.",
                  out: ["MAKE         MODEL              YEAR PLATE     "]
                },
                {
                  lines: [101],
                  explain: "sscanf converted one item out of year, so the count equals 1 and the diagnostic branch is skipped.",
                  vars: { year: "\"1995\"", sscanf: "returns 1", y: "1995" },
                  note: "The return value, not the value in y, is what reports success: a failed conversion assigns nothing and leaves y as it was.",
                  out: ["MAKE         MODEL              YEAR PLATE     "]
                },
                {
                  lines: [107, 108],
                  explain: "printf emits the first row, with y under %6i and the three text fields left-aligned.",
                  vars: { y: "1995" },
                  out: [
                    "MAKE         MODEL              YEAR PLATE     ",
                    "Toyota       Corolla            1995 TVX-111   "
                  ]
                },
                {
                  lines: [82],
                  explain: "The loop goes round. The next call returned 6 again, this time holding the second record's make.",
                  vars: { n: "6", make: "\"Toyota\"" },
                  out: [
                    "MAKE         MODEL              YEAR PLATE     ",
                    "Toyota       Corolla            1995 TVX-111   "
                  ]
                },
                {
                  lines: [87],
                  explain: "Again not a blank line, so the remaining three fields of the second record are read.",
                  vars: { n: "6" },
                  out: [
                    "MAKE         MODEL              YEAR PLATE     ",
                    "Toyota       Corolla            1995 TVX-111   "
                  ]
                },
                {
                  lines: [91, 92, 93],
                  explain: "The file position carried over from the previous call, so these three fields are the rest of the third line of the file.",
                  vars: { model: "\"Vios\"", year: "\"2014\"", plate: "\"TJJ-100\"" },
                  out: [
                    "MAKE         MODEL              YEAR PLATE     ",
                    "Toyota       Corolla            1995 TVX-111   "
                  ]
                },
                {
                  lines: [101],
                  explain: "One item converted again, so the check against 1 passes and y holds the second year.",
                  vars: { sscanf: "returns 1", y: "2014" },
                  out: [
                    "MAKE         MODEL              YEAR PLATE     ",
                    "Toyota       Corolla            1995 TVX-111   "
                  ]
                },
                {
                  lines: [107, 108],
                  explain: "The second row is printed, and the loop returns to line 82 for a third time.",
                  vars: { y: "2014" },
                  out: [
                    "MAKE         MODEL              YEAR PLATE     ",
                    "Toyota       Corolla            1995 TVX-111   ",
                    "Toyota       Vios               2014 TJJ-100   "
                  ]
                },
                {
                  lines: [82],
                  explain: "Third pass. make now holds ten characters, and the statements between here and the printf run exactly as before.",
                  vars: { n: "10", make: "\"Mitsubishi\"" },
                  out: [
                    "MAKE         MODEL              YEAR PLATE     ",
                    "Toyota       Corolla            1995 TVX-111   ",
                    "Toyota       Vios               2014 TJJ-100   "
                  ]
                },
                {
                  lines: [107, 108],
                  explain: "The third row is printed. Montero Sport keeps its space, because only a comma ends a field here.",
                  vars: { model: "\"Montero Sport\"", y: "2018" },
                  out: [
                    "MAKE         MODEL              YEAR PLATE     ",
                    "Toyota       Corolla            1995 TVX-111   ",
                    "Toyota       Vios               2014 TJJ-100   ",
                    "Mitsubishi   Montero Sport      2018 JJT-001   "
                  ]
                },
                {
                  lines: [82],
                  explain: "Fourth pass, and nothing in the loop knows how many records are left to read.",
                  vars: { n: "5", make: "\"Honda\"" },
                  out: [
                    "MAKE         MODEL              YEAR PLATE     ",
                    "Toyota       Corolla            1995 TVX-111   ",
                    "Toyota       Vios               2014 TJJ-100   ",
                    "Mitsubishi   Montero Sport      2018 JJT-001   "
                  ]
                },
                {
                  lines: [107, 108],
                  explain: "The fourth row is printed, and the file position indicator now stands at the end of cars.csv.",
                  vars: { y: "2021" },
                  out: [
                    "MAKE         MODEL              YEAR PLATE     ",
                    "Toyota       Corolla            1995 TVX-111   ",
                    "Toyota       Vios               2014 TJJ-100   ",
                    "Mitsubishi   Montero Sport      2018 JJT-001   ",
                    "Honda        Civic              2021 HCV-221   "
                  ]
                },
                {
                  lines: [82],
                  explain: "The fifth call found nothing left to read and returned -1, so the condition is false and the loop ends.",
                  vars: { n: "-1", make: "\"\"" },
                  note: "A field of length 0 would have been a blank line and would have gone round again. Only -1 ends the loop.",
                  out: [
                    "MAKE         MODEL              YEAR PLATE     ",
                    "Toyota       Corolla            1995 TVX-111   ",
                    "Toyota       Vios               2014 TJJ-100   ",
                    "Mitsubishi   Montero Sport      2018 JJT-001   ",
                    "Honda        Civic              2021 HCV-221   "
                  ]
                }
              ]
            },
            {
              id: "typo",
              label: "A year typed as nineteen",
              frames: [
                {
                  lines: [75, 76],
                  explain: "The headings are printed before any record is read, so they appear whatever the data turns out to hold.",
                  out: ["MAKE         MODEL              YEAR PLATE     "]
                },
                {
                  lines: [91, 92, 93],
                  explain: "The first record is assembled as before, but year now holds the word typed where the digits belong.",
                  vars: { make: "\"Toyota\"", model: "\"Corolla\"", year: "\"nineteen\"", plate: "\"TVX-111\"" },
                  out: ["MAKE         MODEL              YEAR PLATE     "]
                },
                {
                  lines: [101],
                  explain: "The %i directive matched nothing, so sscanf assigned nothing, returned 0, and the check against 1 fails.",
                  vars: { year: "\"nineteen\"", sscanf: "returns 0", y: "never assigned" },
                  note: "Printing y here would print whatever the storage happened to hold, which is the defect the check exists to prevent.",
                  out: ["MAKE         MODEL              YEAR PLATE     "]
                },
                {
                  lines: [102, 103],
                  explain: "The record is named in a diagnostic rather than printed as a row, so the reader knows which line to repair.",
                  out: [
                    "MAKE         MODEL              YEAR PLATE     ",
                    "Skipping Toyota Corolla: year 'nineteen' is not a number"
                  ]
                },
                {
                  lines: [104],
                  explain: "continue abandons the rest of the iteration, and the loop reads the next record from where this one ended.",
                  out: [
                    "MAKE         MODEL              YEAR PLATE     ",
                    "Skipping Toyota Corolla: year 'nineteen' is not a number"
                  ]
                },
                {
                  lines: [107, 108],
                  explain: "The second record's year converted, so it prints normally. One malformed line cost exactly one line of output.",
                  vars: { make: "\"Toyota\"", model: "\"Vios\"", y: "2014" },
                  out: [
                    "MAKE         MODEL              YEAR PLATE     ",
                    "Skipping Toyota Corolla: year 'nineteen' is not a number",
                    "Toyota       Vios               2014 TJJ-100   "
                  ]
                },
                {
                  lines: [107, 108],
                  explain: "The third record is unaffected by the typo in the first, because each pass converts its own year.",
                  vars: { make: "\"Mitsubishi\"", y: "2018" },
                  out: [
                    "MAKE         MODEL              YEAR PLATE     ",
                    "Skipping Toyota Corolla: year 'nineteen' is not a number",
                    "Toyota       Vios               2014 TJJ-100   ",
                    "Mitsubishi   Montero Sport      2018 JJT-001   "
                  ]
                },
                {
                  lines: [107, 108],
                  explain: "The fourth row is printed, leaving a table of three cars and one named refusal.",
                  vars: { make: "\"Honda\"", y: "2021" },
                  out: [
                    "MAKE         MODEL              YEAR PLATE     ",
                    "Skipping Toyota Corolla: year 'nineteen' is not a number",
                    "Toyota       Vios               2014 TJJ-100   ",
                    "Mitsubishi   Montero Sport      2018 JJT-001   ",
                    "Honda        Civic              2021 HCV-221   "
                  ]
                },
                {
                  lines: [82],
                  explain: "The next call returned -1 and the loop ends, exactly as it does on a file with no typo in it.",
                  vars: { n: "-1" },
                  out: [
                    "MAKE         MODEL              YEAR PLATE     ",
                    "Skipping Toyota Corolla: year 'nineteen' is not a number",
                    "Toyota       Vios               2014 TJJ-100   ",
                    "Mitsubishi   Montero Sport      2018 JJT-001   ",
                    "Honda        Civic              2021 HCV-221   "
                  ]
                }
              ]
            }
          ]}
        />
        <Terminal>{`MAKE         MODEL              YEAR PLATE     
Toyota       Corolla            1995 TVX-111   
Toyota       Vios               2014 TJJ-100   
Mitsubishi   Montero Sport      2018 JJT-001   
Honda        Civic              2021 HCV-221   `}</Terminal>
      </>
    ),
    check: {
      kind: "predict",
      question: "Somebody edits cars.csv and types nineteen where the first record's year should be. What does the program print?",
      options: [
        {
          id: "rubbish",
          label: "A row for that car carrying a meaningless number in the year column",
          note: <>That is the outcome when the return value is not examined. <code className="aw-code">sscanf</code> converts nothing and assigns nothing, so <code className="aw-code">y</code> retains whatever it held previously, which on the first iteration is indeterminate. The row is nonetheless printed, and this is exactly the behavior the <code className="aw-code">if</code> exists to prevent.</>
        },
        {
          id: "skip",
          label: "A line reporting that the car has been skipped, followed by the rest of the table",
          correct: true,
          note: <>The <code className="aw-code">%i</code> directive fails to match, so no assignment is made and <code className="aw-code">sscanf</code> returns 0. The diagnostic is printed and <code className="aw-code">continue</code> proceeds to the next record, so one malformed line costs exactly one line of output.</>
        },
        {
          id: "stops",
          label: "Nothing further — the program halts at that record",
          note: <>A reasonable expectation, and it is what <code className="aw-code">fscanf</code> would produce, since a failed conversion leaves the offending characters unread and the next call encounters them again. <code className="aw-code">sscanf</code> operates on a string that has already been extracted from the stream, so the file position indicator has advanced past the record regardless of whether the conversion succeeded.</>
        }
      ]
    }
  },
  {
    id: "S4.5",
    stage: 4, n: 5,
    title: "Add a car of your own",
    action: <>Open <code className="aw-code">cars.csv</code>, add a fifth record in the same form as the four already there, save the file and run <code className="aw-code">08-csv.c</code> again.</>,
    body: (
      <p className="aw-p">
        Four fields require exactly three commas, and leave no spaces around
        them unless you intend those spaces to be data. Nothing needs
        recompiling: the program reads whatever the file contains.
      </p>
    ),
    media: (
      <>
        <p className="aw-p">
          Then two experiments. Put a word where a year belongs, and the record
          is named and skipped.
        </p>
        <Terminal label="A year that is not a number">{`MAKE         MODEL              YEAR PLATE     
Skipping Toyota Corolla: year 'nineteen' is not a number
Toyota       Vios               2014 TJJ-100   
Mitsubishi   Montero Sport      2018 JJT-001   
Honda        Civic              2021 HCV-221   `}</Terminal>
        <p className="aw-p">
          Then leave a blank line at the end and confirm that no extra row
          appears: that is the field of length 0 from step S4.3 being stepped
          over. A file on disk, a delimiter fixed by convention, records read
          one at a time, a checked conversion, aligned output — that is the
          structure of essentially every data task ahead of you.
        </p>
      </>
    ),
    check: {
      kind: "self",
      question: "Does your own record appear in the table, aligned with the columns above it?",
      ok: {
        label: "Yes, the table now holds five rows",
        note: "The program is therefore reading data rather than reproducing values compiled into it. Keep cars.csv and 08-csv.c together, since the machine problem begins from this pair."
      },
      alt: {
        label: "It is missing, or the columns are misaligned",
        note: <>Count the commas first, since four fields require exactly three: a missing comma merges two fields and displaces everything after it. If the row is absent altogether, confirm that the file was saved, and confirm that your record begins on a line of its own. Where the previous last line carried no terminator, your record is appended to the Honda rather than following it.</>
      }
    }
  },
  {
    id: "S4.6",
    stage: 4, n: 6,
    title: "Separate reading, record assembly and presentation",
    action: <>Compile and run <code className="aw-code">09-modular.c</code> beside <code className="aw-code">cars.txt</code>, then compare its output with the one from step S4.2.</>,
    body: (
      <p className="aw-p">
        <code className="aw-code">09-modular.c</code> performs the task of{" "}
        <code className="aw-code">07-fields.c</code> with two functions
        interposed between <code className="aw-code">main</code> and the stream,
        and the two emit identical bytes: the structure has changed and the
        behavior has not, which is what <strong>refactoring</strong> denotes.
        What it buys is a <strong>separation of concerns</strong> — reading a
        field, assembling a record and presenting a row are tangled together in
        the first program and named separately in the second.
      </p>
    ),
    media: (
      <>
        <CodeWalk
          title="Who calls whom, and what each one is for"
          notice="Watch the stack: main asks for a record, readCar asks for four fields, and control returns back up."
          caption="readField carries the first responsibility and nothing else, returning 1 when a field was obtained and 0 once the stream is exhausted: the four NULL tests of 07-fields.c expressed once, with the body of stripNewline inside the only function that needs it. readCar carries the second, and its early return on line 26 is the part worth carrying forward, since a file may end part-way through a record: the fields that arrived are genuine data, but the record they would form is not."
          file="09-modular.c"
          outputLabel="Output, byte for byte the output of 07-fields.c"
          source={[
            { n: 6, src: "int readField(FILE *fp, char *out, int size) {" },
            { n: 8, src: "    if (fgets(out, size, fp) == NULL) {" },
            { n: 9, src: "        return 0;               //nothing left to read" },
            { n: 10, src: "    }" },
            { n: 12, src: "    int n = (int) strlen(out);" },
            { n: 13, src: "    if (n > 0 && out[n - 1] == '\\n') {" },
            { n: 14, src: "        out[n - 1] = '\\0';" },
            { n: 15, src: "    }" },
            { n: 17, src: "    return 1;" },
            { n: 18, src: "}" },
            { n: 23, src: "int readCar(FILE *fp, char *make, char *model," },
            { n: 24, src: "            char *year, char *plate) {" },
            { n: 26, src: "    if (!readField(fp, make, 40))  return 0;" },
            { n: 27, src: "    if (!readField(fp, model, 40)) return 0;" },
            { n: 28, src: "    if (!readField(fp, year, 40))  return 0;" },
            { n: 29, src: "    if (!readField(fp, plate, 40)) return 0;" },
            { n: 31, src: "    return 1;" },
            { n: 32, src: "}" },
            { n: 46, src: "    printf(\"%-12s %-16s %-6s %-10s\\n\"," },
            { n: 47, src: "           \"MAKE\", \"MODEL\", \"YEAR\", \"PLATE\");" },
            { n: 52, src: "    while (readCar(fp, make, model, year, plate)) {" },
            { n: 53, src: "        printf(\"%-12s %-16s %-6s %-10s\\n\"," },
            { n: 54, src: "               make, model, year, plate);" },
            { n: 55, src: "    }" }
          ]}
          tracks={[
            {
              id: "cars",
              label: "cars.txt, sixteen lines",
              frames: [
                {
                  lines: [46, 47],
                  explain: "main prints the column headings once, before any record has been requested.",
                  vars: { stack: "main" },
                  note: "Presentation is main's responsibility, and after the refactoring it is the only one main keeps.",
                  out: ["MAKE         MODEL            YEAR   PLATE     "]
                },
                {
                  lines: [52],
                  explain: "The loop condition is a call: main asks readCar whether one more complete record was available.",
                  vars: { stack: "main to readCar" },
                  note: "main now says what happens once per car. How a record is read is no longer its business.",
                  out: ["MAKE         MODEL            YEAR   PLATE     "]
                },
                {
                  lines: [26],
                  explain: "readCar begins the record by calling readField for the first of its four fields.",
                  vars: { stack: "main to readCar to readField", field: "make" },
                  note: "Record assembly is readCar's responsibility: four fields, in order, and nothing else.",
                  out: ["MAKE         MODEL            YEAR   PLATE     "]
                },
                {
                  lines: [8],
                  explain: "fgets stored one line and returned non-null, so readField does not take its early exit.",
                  vars: { stack: "main to readCar to readField", out: "\"Toyota\\n\"" },
                  note: "Line 8 is readField's responsibility: obtaining one line, and reporting whether there was one.",
                  out: ["MAKE         MODEL            YEAR   PLATE     "]
                },
                {
                  lines: [12, 13, 14],
                  explain: "strlen found seven characters and the last of them a newline, so it is overwritten with the terminator.",
                  vars: { stack: "main to readCar to readField", n: "7", out: "\"Toyota\"" },
                  out: ["MAKE         MODEL            YEAR   PLATE     "]
                },
                {
                  lines: [17],
                  explain: "readField returns 1, and control goes back up to line 26, which finds the field present.",
                  vars: { stack: "main to readCar", make: "\"Toyota\"" },
                  out: ["MAKE         MODEL            YEAR   PLATE     "]
                },
                {
                  lines: [27, 28, 29],
                  explain: "The same descent runs three more times, so model, year and plate are filled by three further calls.",
                  vars: { stack: "main to readCar", model: "\"Corolla\"", year: "\"1995\"", plate: "\"TVX-111\"" },
                  out: ["MAKE         MODEL            YEAR   PLATE     "]
                },
                {
                  lines: [31],
                  explain: "All four fields were present, so readCar returns 1 and control returns to the condition on line 52.",
                  vars: { stack: "main" },
                  out: ["MAKE         MODEL            YEAR   PLATE     "]
                },
                {
                  lines: [53, 54],
                  explain: "main prints the row. It has opened no buffer of its own, tested no stream and stripped no newline.",
                  vars: { stack: "main" },
                  out: [
                    "MAKE         MODEL            YEAR   PLATE     ",
                    "Toyota       Corolla          1995   TVX-111   "
                  ]
                },
                {
                  lines: [52],
                  explain: "The condition is evaluated again, and the same five calls run beneath it for the second record.",
                  vars: { stack: "main to readCar" },
                  out: [
                    "MAKE         MODEL            YEAR   PLATE     ",
                    "Toyota       Corolla          1995   TVX-111   "
                  ]
                },
                {
                  lines: [53, 54],
                  explain: "The second row is printed from the four buffers readCar has just refilled.",
                  vars: { stack: "main", make: "\"Toyota\"", model: "\"Vios\"" },
                  out: [
                    "MAKE         MODEL            YEAR   PLATE     ",
                    "Toyota       Corolla          1995   TVX-111   ",
                    "Toyota       Vios             2014   TJJ-100   "
                  ]
                },
                {
                  lines: [52],
                  explain: "Third record. The nesting beneath this line is identical every time, and only the contents of the buffers differ.",
                  vars: { stack: "main to readCar" },
                  out: [
                    "MAKE         MODEL            YEAR   PLATE     ",
                    "Toyota       Corolla          1995   TVX-111   ",
                    "Toyota       Vios             2014   TJJ-100   "
                  ]
                },
                {
                  lines: [53, 54],
                  explain: "Montero Sport arrives whole: the delimiter here is the line terminator, so a space is ordinary data.",
                  vars: { stack: "main", model: "\"Montero Sport\"" },
                  out: [
                    "MAKE         MODEL            YEAR   PLATE     ",
                    "Toyota       Corolla          1995   TVX-111   ",
                    "Toyota       Vios             2014   TJJ-100   ",
                    "Mitsubishi   Montero Sport    2018   JJT-001   "
                  ]
                },
                {
                  lines: [52],
                  explain: "Fourth record, read by the same four calls into the same four buffers.",
                  vars: { stack: "main to readCar" },
                  out: [
                    "MAKE         MODEL            YEAR   PLATE     ",
                    "Toyota       Corolla          1995   TVX-111   ",
                    "Toyota       Vios             2014   TJJ-100   ",
                    "Mitsubishi   Montero Sport    2018   JJT-001   "
                  ]
                },
                {
                  lines: [53, 54],
                  explain: "The fourth row is printed, and all sixteen lines of cars.txt have now been consumed.",
                  vars: { stack: "main", make: "\"Honda\"", model: "\"Civic\"" },
                  out: [
                    "MAKE         MODEL            YEAR   PLATE     ",
                    "Toyota       Corolla          1995   TVX-111   ",
                    "Toyota       Vios             2014   TJJ-100   ",
                    "Mitsubishi   Montero Sport    2018   JJT-001   ",
                    "Honda        Civic            2021   HCV-221   "
                  ]
                },
                {
                  lines: [26],
                  explain: "A fifth record is attempted, so readCar descends once more and asks readField for a make.",
                  vars: { stack: "main to readCar to readField", field: "make" },
                  out: [
                    "MAKE         MODEL            YEAR   PLATE     ",
                    "Toyota       Corolla          1995   TVX-111   ",
                    "Toyota       Vios             2014   TJJ-100   ",
                    "Mitsubishi   Montero Sport    2018   JJT-001   ",
                    "Honda        Civic            2021   HCV-221   "
                  ]
                },
                {
                  lines: [8],
                  explain: "fgets found nothing left to read and returned NULL, which is the one failure readField has to report.",
                  vars: { stack: "main to readCar to readField" },
                  out: [
                    "MAKE         MODEL            YEAR   PLATE     ",
                    "Toyota       Corolla          1995   TVX-111   ",
                    "Toyota       Vios             2014   TJJ-100   ",
                    "Mitsubishi   Montero Sport    2018   JJT-001   ",
                    "Honda        Civic            2021   HCV-221   "
                  ]
                },
                {
                  lines: [9],
                  explain: "readField returns 0 and control rises one level, back into the guard on line 26.",
                  vars: { stack: "main to readCar" },
                  out: [
                    "MAKE         MODEL            YEAR   PLATE     ",
                    "Toyota       Corolla          1995   TVX-111   ",
                    "Toyota       Vios             2014   TJJ-100   ",
                    "Mitsubishi   Montero Sport    2018   JJT-001   ",
                    "Honda        Civic            2021   HCV-221   "
                  ]
                },
                {
                  lines: [26],
                  explain: "The first guard fails, so readCar returns 0 without attempting model, year or plate.",
                  vars: { stack: "main" },
                  note: "Half a record never reaches main, because readCar is the level that knows what a whole record is.",
                  out: [
                    "MAKE         MODEL            YEAR   PLATE     ",
                    "Toyota       Corolla          1995   TVX-111   ",
                    "Toyota       Vios             2014   TJJ-100   ",
                    "Mitsubishi   Montero Sport    2018   JJT-001   ",
                    "Honda        Civic            2021   HCV-221   "
                  ]
                },
                {
                  lines: [52],
                  explain: "The condition is false and the loop ends, leaving the table 07-fields.c printed in step S4.2.",
                  vars: { stack: "main" },
                  note: "Three functions instead of one, three levels of call instead of none, and not one byte of output changed.",
                  out: [
                    "MAKE         MODEL            YEAR   PLATE     ",
                    "Toyota       Corolla          1995   TVX-111   ",
                    "Toyota       Vios             2014   TJJ-100   ",
                    "Mitsubishi   Montero Sport    2018   JJT-001   ",
                    "Honda        Civic            2021   HCV-221   "
                  ]
                }
              ]
            }
          ]}
        />
        <Terminal label="09-modular.c — identical to the output of 07-fields.c">{`MAKE         MODEL            YEAR   PLATE     
Toyota       Corolla          1995   TVX-111   
Toyota       Vios             2014   TJJ-100   
Mitsubishi   Montero Sport    2018   JJT-001   
Honda        Civic            2021   HCV-221   `}</Terminal>
        <p className="aw-p">
          The same division reappears in Week 7 and in the Week 13 team
          project: a function is the smallest unit of work a team can allocate,
          test in isolation and then integrate.
        </p>
        <p className="aw-p">
          That concludes the handout: a stream opened, bytes written and held
          by the library until the stream was closed, those bytes read back with
          the position in view, and a delimited file turned into a table.
        </p>
      </>
    ),
    check: {
      kind: "predict",
      question: "You move the reading into readField and readCar and change nothing else. What changes in the output?",
      options: [
        {
          id: "columns",
          label: "The rows are the same, but the columns align differently",
          note: <>The format string was relocated rather than altered. It remains <code className="aw-code">%-12s %-16s %-6s %-10s</code>, evaluated in <code className="aw-code">main</code> once per record, and nothing in the layout depends on where the reading is performed.</>
        },
        {
          id: "nothing",
          label: "Nothing — the output is identical, byte for byte",
          correct: true,
          note: <>Correct, and that identity is exactly what qualifies the change as a refactoring. Run both programs and compare the tables to confirm it for yourself. The benefit is not visible on screen: it is that <code className="aw-code">readField</code> can now be corrected or replaced without <code className="aw-code">main</code> being read, and written by somebody else entirely.</>
        },
        {
          id: "perline",
          label: "Each field prints on a line of its own, since readField is called four times",
          note: <><code className="aw-code">readField</code> reads and prints nothing whatever, which is the separation of concerns the exercise is demonstrating. The only <code className="aw-code">printf</code> within the loop remains in <code className="aw-code">main</code>, and it is still evaluated once per record.</>
        }
      ]
    }
  }
];
