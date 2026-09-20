import React from "react";
import { CodeBlock, Terminal } from "./CodeBlock.jsx";
import { FileMachine } from "../../components/FileMachine.jsx";

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
   rather than as a field the library advances on every successful read. Where
   a figure is needed, the FileMachine trace is the figure.

   Every `pos` below is transcribed from the ftell() tables in PROGRAMS.md. No
   position here was calculated by hand, and none may be. If a trace and a
   compiler ever disagree, the compiler is right and this file is wrong.

   The programs of stage 4 run to thirty lines and more, and no two consecutive
   excerpts of one program are contiguous in its source, so nothing here is
   shown whole and nothing here can be merged: a merged block would number its
   own lines wrongly. The six blocks of getDelimitedItem in S5.3 are split on
   purpose and carry connecting prose between them.

   Stage 5 has no resolutions attached. By that point the reader has a working
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

export const steps45 = [
  /* ─────────────────────────────────────────────────────────────────────────
     Stage 4 — Reading it back
     ───────────────────────────────────────────────────────────────────────── */
  {
    id: "S4.1",
    stage: 4, n: 1,
    title: "Read one character at a time",
    action: <>Download <code className="aw-code">04-readchar.c</code>, put it beside your <code className="aw-code">test.txt</code>, compile it and run it.</>,
    body: (
      <>
        <p className="aw-p">
          Every stream carries a <strong>file position indicator</strong>: the
          offset, counted in bytes from the start of the file, at which the next
          operation will take place. It is state held inside the{" "}
          <code className="aw-code">FILE</code> object, not a variable you
          declare. <code className="aw-code">fopen</code> sets it to zero for a
          stream opened in read mode, and every successful read advances it by
          the number of bytes that read consumed.
        </p>
        <p className="aw-p">
          Three functions address it directly.{" "}
          <code className="aw-code">ftell</code> reports its current value,{" "}
          <code className="aw-code">fseek</code> moves it to a chosen offset, and{" "}
          <code className="aw-code">rewind</code> returns it to zero. Every
          offset quoted in this handout was obtained by calling{" "}
          <code className="aw-code">ftell</code> on a real run, so the traces
          below can be reproduced rather than taken on trust.
        </p>
        <p className="aw-p">
          <code className="aw-code">fgetc</code> returns the byte at the current
          offset and advances the indicator by one, so forty-four calls consume
          the whole of <code className="aw-code">test.txt</code>. It returns that
          byte as an <code className="aw-code">int</code>, and the reason is{" "}
          <code className="aw-code">EOF</code>.{" "}
          <code className="aw-code">EOF</code> is a macro defined in{" "}
          <code className="aw-code">stdio.h</code> that expands to a negative
          integer constant, conventionally{" "}
          <code className="aw-code">-1</code>. It is a <strong>sentinel</strong>:
          a value returned in place of data to signal that no data remains. It
          is not a character, and no byte of the file ever equals it.
        </p>
        <p className="aw-p">
          That distinction is what the declaration below protects. A{" "}
          <code className="aw-code">char</code> can represent 256 distinct byte
          values and has no encoding left over for a 257th value that must
          differ from all of them. Store the result in a{" "}
          <code className="aw-code">char</code> and the comparison against{" "}
          <code className="aw-code">EOF</code> either can never succeed, or
          succeeds on ordinary data. Which of the two you get is
          implementation-defined, because the standard does not fix whether
          plain <code className="aw-code">char</code> is signed.
        </p>
      </>
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
          caption="The declaration that decides whether this loop can terminate correctly."
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
          caption="The read is performed inside the loop condition. Step S4.3 explains why that placement is the only correct one."
        />
        <FileMachine
          file={TEST_TXT}
          caption="The first six calls of 04-readchar.c. The bar marks the file position indicator; tinted bytes have already been consumed."
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
    id: "S4.2",
    stage: 4, n: 2,
    title: "The newline is a byte",
    action: <>Run <code className="aw-code">05-readascii.c</code> against the same <code className="aw-code">test.txt</code> and compare its output with the one above.</>,
    body: (
      <p className="aw-p">
        The loop is the one you have just run, with a single change of
        conversion specifier: <code className="aw-code">%i</code> in place of{" "}
        <code className="aw-code">%c</code>. Each byte is therefore printed as
        the integer value actually stored on disk, rather than as the glyph a
        terminal draws for it. The output is the evidence for a claim that is
        otherwise easy to doubt, namely that a line break is an ordinary byte.
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
          Two of those numbers repay close attention, and they belong to
          different categories.
        </p>
        <ul className="aw-p">
          <li>
            The <code className="aw-code">10</code> that closes each of the first
            two rows is the line terminator. It is an ordinary byte with the
            value 10, stored at offset 11 and again at offset 27, and it
            occupies a position and costs a call exactly like the letters around
            it. No third <code className="aw-code">10</code> appears, because the
            file carries no terminator after its last line.
          </li>
          <li>
            The <code className="aw-code">-1</code> at the very end is of another
            kind entirely. It is the value of{" "}
            <code className="aw-code">EOF</code>, returned once the stream is
            exhausted and printed by a{" "}
            <code className="aw-code">printf</code> placed after the loop. It is
            a sentinel reported by the library, and it is not a byte of the file.
          </li>
        </ul>
        <FileMachine
          file={TEST_TXT}
          caption="Calls 10 to 13 of the same loop, across the first line terminator. The pilcrow stands for the byte of value 10."
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
    id: "S4.3",
    stage: 4, n: 3,
    title: "Loop on the read, not on feof",
    action: <>Review every read loop you have written so far and confirm that the read itself, rather than <code className="aw-code">feof</code>, supplies the condition.</>,
    body: (
      <>
        <p className="aw-p">
          Both programs above share one structure: the call that reads is
          written inside the <code className="aw-code">while</code> condition, so
          the loop continues only while that call has succeeded. That is not a
          stylistic preference. It is the only arrangement that stops the loop
          at the right moment, and the reason lies in how the library reports
          the end of a stream.
        </p>
        <p className="aw-p">
          Alongside the file position indicator, the{" "}
          <code className="aw-code">FILE</code> object holds two further pieces
          of state: an <strong>end-of-file indicator</strong> and an{" "}
          <strong>error indicator</strong>.{" "}
          <code className="aw-code">feof</code> and{" "}
          <code className="aw-code">ferror</code> report them.
          Both are set as a <em>side effect</em> of an operation that has
          already been attempted and has failed; neither is a look-ahead into
          what the next call would do.
        </p>
        <p className="aw-p">
          That mechanism is the whole of the classic fault. Before the final
          read both indicators are clear, so a loop conditioned on{" "}
          <code className="aw-code">!feof(fp)</code> enters its body one more
          time than the data warrants. Both functions belong{" "}
          <em>after</em> a loop, where they distinguish exhaustion from failure;
          the condition of the loop is the result of the read.
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
        <p className="aw-p">
          The alternative below reads more naturally as English and is
          nonetheless wrong. On the final pass the end-of-file indicator has not
          yet been set, because no read has yet failed, so the loop enters its
          body once more and the read inside it returns nothing.
        </p>
        <p className="aw-p">
          The failed read leaves <code className="aw-code">line</code> holding
          whatever the previous successful call put there. The body has no way
          to detect this, because it never examines a return value, so it prints
          the preceding record a second time.
        </p>
        <CodeBlock
          from={1}
          focus={[0]}
          lines={[
            "while (!feof(fp)) {",
            "    fgets(line, 100, fp);",
            "    printf(\"[%i] %s\", (int) strlen(line), line);",
            "}"
          ]}
          caption="Taken from none of the shipped programs. It appears here so that you can recognize it in your own code and remove it."
        />
        <p className="aw-p">
          The same arrangement applies to every read function in the library,
          whatever value that function uses to report failure.
        </p>
        <ul className="aw-p">
          <li>
            One character at a time:{" "}
            <code className="aw-code">{"while ((c = fgetc(fp)) != EOF)"}</code>,
            with <code className="aw-code">c</code> declared{" "}
            <code className="aw-code">int</code>.
          </li>
          <li>
            One line at a time:{" "}
            <code className="aw-code">{"while (fgets(line, 100, fp) != NULL)"}</code>.
          </li>
        </ul>
        <p className="aw-p">
          Each of those conditions interrogates the read itself. The defective
          version interrogates an indicator that the read has not yet had the
          opportunity to set.
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
    id: "S4.4",
    stage: 4, n: 4,
    title: "Read a line at a time with fgets",
    action: <>Run <code className="aw-code">06-readline.c</code>, then step through the trace below before reading the output.</>,
    body: (
      <>
        <p className="aw-p">
          <code className="aw-code">fgets(buf, size, fp)</code> copies bytes from
          the stream into <code className="aw-code">buf</code> and stops on the
          first of three conditions. It stops when a newline has been read, when{" "}
          <code className="aw-code">size - 1</code> characters have been stored,
          or when the stream is exhausted. It then writes a closing{" "}
          <code className="aw-code">\0</code> and returns{" "}
          <code className="aw-code">buf</code>, or{" "}
          <code className="aw-code">NULL</code> if no characters were read at
          all.
        </p>
        <p className="aw-p">
          The point students most often miss is what happens to the newline in
          the first case: it is <strong>retained</strong>, copied into the buffer
          along with the text that preceded it. That is why the lengths reported
          below are 12 and 16 rather than 11 and 15, and why every field read
          this way must be stripped before it is printed in a column.
        </p>
      </>
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
          caption="Four calls to fgets on a 44-byte file. Three return a line; the fourth finds the stream exhausted and returns NULL."
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
        <p className="aw-p">
          After the loop the program emits one newline of its own, because the
          last line of the file carries none. Without it the shell prompt would
          resume in the middle of the final row of output.
        </p>
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
    id: "S4.5",
    stage: 4, n: 5,
    title: "Why the handout stops using fscanf",
    action: <>Read this step before you reach for <code className="aw-code">fscanf</code> in your machine problem, since it explains why the remaining programs avoid it.</>,
    body: (
      <p className="aw-p">
        <code className="aw-code">fscanf</code> is{" "}
        <code className="aw-code">scanf</code> with a stream as its first
        argument, and it is the natural function to reach for next. Its format
        string is a sequence of <strong>directives</strong>, matched against the
        input one after another. A directive is whitespace, or a literal
        character that must appear exactly, or a{" "}
        <strong>conversion specifier</strong> such as{" "}
        <code className="aw-code">%s</code> or{" "}
        <code className="aw-code">%i</code> that converts input and assigns it. A
        directive that fails to match ends the call, and the file position
        indicator is left wherever the failed conversion stopped rather than at
        a record boundary.
      </p>
    ),
    media: (
      <>
        <p className="aw-p">
          Consider <code className="aw-code">%s</code>, which is defined to read
          a single sequence of non-whitespace characters. Applied to the line{" "}
          <code className="aw-code">Montero Sport</code>, it converts and assigns{" "}
          <code className="aw-code">Montero</code> and stops there. The space,
          the word <code className="aw-code">Sport</code> and the newline all
          remain unread, and the next call encounters them while expecting the
          first character of a new field. Every field of{" "}
          <code className="aw-code">cars.csv</code> that contains a space fails
          in exactly this way.
        </p>
        <p className="aw-p">
          A numeric specifier fails more damagingly. Match{" "}
          <code className="aw-code">%i</code> against a character that cannot
          begin an integer and the directive fails: nothing is converted,
          nothing is assigned, and the offending characters are not consumed. The
          indicator has not moved, so the next call meets the same input and
          fails identically, and a single malformed line becomes a loop that
          never advances.
        </p>
        <p className="aw-p">
          Neither outcome announces itself, because{" "}
          <code className="aw-code">fscanf</code> reports through its return
          value: the number of input items successfully{" "}
          <strong>assigned</strong>, which may be fewer than the specifiers you
          wrote. Written as{" "}
          <code className="aw-code">{"if (fscanf(fp, \"%s %i\", name, &qty) != 2)"}</code>,
          a partial match is detected at once. Written without that comparison it
          is invisible, and the unassigned variables retain whatever values they
          held beforehand.
        </p>
        <p className="aw-p">
          The remedy is not a more elaborate format string. It is a{" "}
          <strong>delimiter</strong>: a character fixed by convention to mark
          where one field ends, so that field boundaries are read from the data
          rather than inferred. Stage 5 therefore reads a whole line, divides it
          at the delimiter, and converts the individual pieces with{" "}
          <code className="aw-code">sscanf</code>. Under that arrangement a
          malformed line costs you that line alone, not the remainder of the
          file.
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
     Stage 5 — Data worth reading
     ───────────────────────────────────────────────────────────────────────── */
  {
    id: "S5.1",
    stage: 5, n: 1,
    title: "What a delimiter is",
    action: <>Download <code className="aw-code">cars.txt</code> and <code className="aw-code">cars.csv</code> and open both in a text editor.</>,
    body: (
      <>
        <p className="aw-p">
          A stream is an undifferentiated sequence of bytes; it contains no
          fields and no records. Those are structures a program imposes on it by
          convention. That convention is a <strong>delimiter</strong>: a
          character, or a short sequence of characters, agreed in advance to
          mark where one data item ends. A <strong>field</strong> is the run
          of bytes between two delimiters, and a <strong>record</strong> is a
          group of fields that describes one thing.
        </p>
        <p className="aw-p">
          The delimiter carries no data of its own and is not stored as part of
          any field. It imposes one requirement on the data it separates: it
          must not occur inside a field. Where it can occur, the program has no
          way of distinguishing a separator from a value.
        </p>
      </>
    ),
    media: (
      <>
        <p className="aw-p">
          The two files hold the same four cars under two different conventions.
          In <code className="aw-code">cars.txt</code> the delimiter is the{" "}
          <strong>line terminator</strong>: one field per line, and four
          consecutive lines per record. That is the byte of value 10 you
          examined in stage 4, now carrying structural meaning rather than
          merely presentation.
        </p>
        <Terminal label="cars.txt — the first car">{`Toyota
Corolla
1995
TVX-111`}</Terminal>
        <p className="aw-p">
          In <code className="aw-code">cars.csv</code> the delimiter is the{" "}
          <strong>comma</strong>, so an entire record occupies a single line and
          the line terminator separates records rather than fields. The first
          line is a <strong>header</strong>: it names the columns instead of
          describing a car, and a program must therefore read past it.
        </p>
        <Terminal label="cars.csv — the header and the first car">{`make,model,year,plate
Toyota,Corolla,1995,TVX-111`}</Terminal>
        <p className="aw-p">
          The comma is convenient but it is not safe in general, and the
          weakness is not peculiar to commas. Any <strong>in-band</strong>{" "}
          delimiter — one drawn from the same alphabet as the data it separates
          — can occur inside a field. When it does, the record is divided in the
          wrong place, and no diagnostic of any kind is produced. Postal
          addresses
          contain commas, as do names written surname-first and prices written
          under several locale conventions.
        </p>
        <p className="aw-p">
          The general remedies are escaping and quoting, which mark an
          occurrence of the delimiter as data rather than as structure. The RFC
          4180 description of CSV specifies exactly such a rule: a field may be
          enclosed in double quotes, within which a comma is ordinary text. The
          programs in this handout implement no quoting rule and will therefore
          mis-parse a quoted field. Know that limit before you point one of them
          at data you did not write yourself.
        </p>
        <p className="aw-p">
          The alternative is to choose a delimiter that cannot occur in the
          data. That is why files in circulation are often separated by tabs or
          semicolons, and occasionally by a sequence such as{" "}
          <code className="aw-code">:|:</code> that nobody types by accident. The
          comma is used here because it is the convention the rest of the world
          reads, and because none of these four records contains one.
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
    id: "S5.2",
    stage: 5, n: 2,
    title: "End-of-line as the delimiter",
    action: <>Compile and run <code className="aw-code">07-fields.c</code> in the folder that holds <code className="aw-code">cars.txt</code>.</>,
    body: (
      <p className="aw-p">
        A record here is four consecutive lines, so one iteration of the loop is
        four calls to <code className="aw-code">fgets</code>. The{" "}
        <code className="aw-code">&amp;&amp;</code> operators between them are
        doing real work: C guarantees short-circuit evaluation, so the first
        call that returns <code className="aw-code">NULL</code> prevents the
        remaining calls from being made. A file that ends part-way through a
        record therefore terminates the loop rather than printing a record
        assembled from leftovers.
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
          caption="Four reads for one record, applying the loop condition of step S4.3 four times over."
        />
        <p className="aw-p">
          All four buffers now end in a newline, because{" "}
          <code className="aw-code">fgets</code> retains the terminator it
          stopped on. Left in place, each field would carry a line break into
          the middle of a table row, and a single record would be spread across
          four lines of output. Each field is therefore passed through{" "}
          <code className="aw-code">stripNewline</code> before it is printed.
        </p>
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
          caption="Overwriting the newline with \\0 terminates the string one character earlier. The n > 0 test guards against indexing before the start of an empty string, and the '\\n' test against truncating a final line that carries no terminator."
        />
        <Terminal>{`MAKE         MODEL            YEAR   PLATE     
Toyota       Corolla          1995   TVX-111   
Toyota       Vios             2014   TJJ-100   
Mitsubishi   Montero Sport    2018   JJT-001   
Honda        Civic            2021   HCV-221   `}</Terminal>
        <p className="aw-p">
          The row for <code className="aw-code">Montero Sport</code> demonstrates
          the value of an explicit delimiter. The field contains a space and
          nonetheless arrives intact, because the delimiter here is the line
          terminator and not whitespace in general. A single{" "}
          <code className="aw-code">%s</code> would have assigned{" "}
          <code className="aw-code">Montero</code> and abandoned the remainder,
          exactly as step S4.5 described.
        </p>
        <p className="aw-p">
          Note also that the year is still held as text. Formatted with{" "}
          <code className="aw-code">%-6s</code> it is displayed correctly, but it
          is a string of digits rather than a number, so it cannot be compared,
          averaged or sorted numerically. Step S5.4 converts it.
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
    id: "S5.3",
    stage: 5, n: 3,
    title: "Splitting a line on commas",
    action: <>Open <code className="aw-code">08-csv.c</code> and read <code className="aw-code">getDelimitedItem</code> line by line alongside this step.</>,
    body: (
      <p className="aw-p">
        With the comma as the delimiter, four fields share a single line, so{" "}
        <code className="aw-code">fgets</code> can no longer perform the
        separation on your behalf. That responsibility moves into one function,{" "}
        <code className="aw-code">getDelimitedItem</code>, which reads exactly
        one field. It stops at the first of three terminating conditions: a
        comma, the end of the record, or the end of the stream. Everything else
        in the program is built on that one primitive.
      </p>
    ),
    media: (
      <>
        <CodeBlock
          file="08-csv.c"
          from={13}
          focus={[0]}
          lines={[
            "int getDelimitedItem(FILE *fp, char *out, int size) {",
            "",
            "    int c;",
            "    int n = 0;      //characters stored so far"
          ]}
          caption="out is the buffer the item is written into, and size is the capacity of that buffer. The caller supplies both, so the function assumes neither."
        />
        <p className="aw-p">
          The first character is read on its own, ahead of the loop, so that the
          function can distinguish two situations which otherwise look alike: a
          stream with nothing left in it, and a field that is legitimately
          empty. The two require different responses from the caller, so they
          are reported by different return values.
        </p>
        <CodeBlock
          file="08-csv.c"
          from={20}
          focus={[4]}
          lines={[
            "    c = fgetc(fp);",
            "",
            "    if (c == EOF) {",
            "        out[0] = '\\0';",
            "        return -1;",
            "    }"
          ]}
          caption="A return of -1 reports that the stream was exhausted. It is deliberately distinct from 0, which will report a field of no characters."
        />
        <p className="aw-p">
          Beyond that check at least one character is available, and the loop
          now runs until the field ends. Its condition names the three
          terminating conditions explicitly, because each of them may
          legitimately follow a field and none of them is an error.
        </p>
        <CodeBlock
          file="08-csv.c"
          from={27}
          focus={[0]}
          lines={[
            "    while (c != EOF && c != ',' && c != '\\n') {",
            "",
            "        //A file saved on Windows ends its lines with \\r\\n. The",
            "        //\\r is dropped here so the last item on a line does not",
            "        //come back with an invisible character glued to it.",
            "        if (c != '\\r') {"
          ]}
        />
        <p className="aw-p">
          The delimiter is consumed but never stored, and that single decision
          is what makes the function composable. The caller receives the field
          alone, and the file position indicator is left at the first byte of
          the field that follows. The carriage return of a Windows line ending
          is discarded as it passes rather than trimmed afterwards, so a file
          saved under either convention yields identical fields.
        </p>
        <CodeBlock
          file="08-csv.c"
          from={37}
          focus={[0]}
          lines={[
            "            if (n < size - 1) {",
            "                out[n] = (char) c;",
            "                n = n + 1;",
            "            }",
            "        }"
          ]}
          caption="The size - 1 bound reserves room for the closing \\0. Characters beyond that bound are consumed but not stored, so an over-long field is truncated rather than overrunning the caller's buffer."
        />
        <p className="aw-p">
          One statement remains, and it is the one most often omitted: each
          iteration must fetch the next character, or the loop will test the
          same value indefinitely.
        </p>
        <CodeBlock
          file="08-csv.c"
          from={43}
          lines={[
            "        c = fgetc(fp);",
            "    }"
          ]}
          caption="Without this statement the loop would test the same value of c indefinitely, and the program would appear to hang."
        />
        <p className="aw-p">
          When the loop ends, the characters of the field are in{" "}
          <code className="aw-code">out</code>, but they do not yet constitute a
          string. A C string is a sequence of characters followed by a null
          character, and no library function supplies that for you here.
        </p>
        <CodeBlock
          file="08-csv.c"
          from={46}
          focus={[1]}
          lines={[
            "    //Every C string has to be closed off by hand.",
            "    out[n] = '\\0';",
            "",
            "    return n;"
          ]}
          caption="The return value is the length of the field, which is what allows the caller to recognize an empty field and distinguish it from an exhausted stream."
        />
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
    id: "S5.4",
    stage: 5, n: 4,
    title: "One record per pass, and a year that is really a number",
    action: <>Compile and run <code className="aw-code">08-csv.c</code> in the folder that holds <code className="aw-code">cars.csv</code>.</>,
    body: (
      <p className="aw-p">
        The header line is consumed first and discarded, so that the loop which
        follows encounters records only. If that first read returns{" "}
        <code className="aw-code">NULL</code>, the file held nothing at all, and
        that is a condition worth reporting explicitly rather than presenting as
        a table of zero cars.
      </p>
    ),
    media: (
      <>
        <CodeBlock
          file="08-csv.c"
          from={69}
          focus={[0]}
          lines={[
            "    if (fgets(header, 120, fp) == NULL) {",
            "        printf(\"cars.csv is empty.\\n\");",
            "        fclose(fp);",
            "        return 1;",
            "    }"
          ]}
        />
        <p className="aw-p">
          One iteration of the loop assembles one record. The first call decides
          whether a record is present at all, and the remaining three complete
          it once that question has been settled. A file terminated by a newline
          and a file without one both stop here by the same mechanism, because
          the condition tests a return value rather than an indicator.
        </p>
        <CodeBlock
          file="08-csv.c"
          from={82}
          focus={[0]}
          lines={[
            "    while ((n = getDelimitedItem(fp, make, 40)) >= 0) {"
          ]}
          caption="The read is once again the loop condition, following the rule established in step S4.3."
        />
        <CodeBlock
          file="08-csv.c"
          from={87}
          lines={[
            "        if (n == 0) {",
            "            continue;",
            "        }"
          ]}
          caption="An empty first field means a blank line rather than a record, so the iteration is abandoned and the next field is read."
        />
        <CodeBlock
          file="08-csv.c"
          from={91}
          lines={[
            "        getDelimitedItem(fp, model, 40);",
            "        getDelimitedItem(fp, year, 40);",
            "        getDelimitedItem(fp, plate, 40);"
          ]}
        />
        <p className="aw-p">
          All four fields are text at this point, the year included, because
          everything read from a text stream arrives as characters.{" "}
          <code className="aw-code">sscanf</code> performs the conversion: it
          applies the same directive matching as{" "}
          <code className="aw-code">fscanf</code>, but to a string already in
          memory rather than to a stream. Like{" "}
          <code className="aw-code">fscanf</code> it returns the number of items
          successfully assigned, and it is that count, not the value in{" "}
          <code className="aw-code">y</code>, which tells you whether the field
          was numeric. Checking the count is what distinguishes a parser from a
          guess.
        </p>
        <CodeBlock
          file="08-csv.c"
          from={101}
          focus={[0]}
          lines={[
            "        if (sscanf(year, \"%i\", &y) != 1) {",
            "            printf(\"Skipping %s %s: year '%s' is not a number\\n\",",
            "                   make, model, year);",
            "            continue;",
            "        }"
          ]}
          caption="Comparing the return value against 1 is what prevents a typographical error in the data file from printing an indeterminate value."
        />
        <CodeBlock
          file="08-csv.c"
          from={107}
          focus={[0]}
          lines={[
            "        printf(\"%-12s %-16s %6i %-10s\\n\",",
            "               make, model, y, plate);"
          ]}
          caption="%6i rather than %-6s: the year is now an int, so it is formatted right-aligned as numeric columns conventionally are."
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
    id: "S5.5",
    stage: 5, n: 5,
    title: "Add a car of your own",
    action: <>Open <code className="aw-code">cars.csv</code>, add a fifth record in the same form as the four already there, save the file and run <code className="aw-code">08-csv.c</code> again.</>,
    body: (
      <p className="aw-p">
        Four fields require exactly three commas, and you should leave no spaces
        around them unless you intend those spaces to form part of the data.
        Nothing needs recompiling, because the data resides in the file and the
        program reads whatever the file happens to contain. That separation
        between program and data is the point of the entire handout.
      </p>
    ),
    media: (
      <>
        <p className="aw-p">
          While the file is open, carry out the other two experiments as well.
          Put a word where a year belongs, and observe that the record is
          reported by name and skipped rather than printed with an indeterminate
          value. That is the <code className="aw-code">sscanf</code> return check
          from the previous step doing the work it was written for.
        </p>
        <Terminal label="A year that is not a number">{`MAKE         MODEL              YEAR PLATE     
Skipping Toyota Corolla: year 'nineteen' is not a number
Honda        Civic              2021 HCV-221   `}</Terminal>
        <p className="aw-p">
          Then leave a blank line at the end of the file, and confirm that no
          additional row appears. That is the field of length 0 from step S5.3
          being recognized and stepped over rather than treated as a record.
        </p>
        <p className="aw-p">
          You now have a program that converts a delimited data file into a
          formatted table, and it is built from five identifiable components.
        </p>
        <ul className="aw-p">
          <li>A file held on disk, outliving the process that wrote it.</li>
          <li>A delimiter, fixed by convention between writer and reader.</li>
          <li>Records read one at a time into variables of the right size.</li>
          <li>A numeric conversion whose return value is checked.</li>
          <li>Output formatted into aligned columns.</li>
        </ul>
        <p className="aw-p">
          That is the structure of essentially every data-handling task ahead of
          you, and you have now implemented it once without a library. One
          further change is worth making to it, and it forms the final step of
          this handout.
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
    id: "S5.6",
    stage: 5, n: 6,
    title: "Separate reading, record assembly and presentation",
    action: <>Compile and run <code className="aw-code">09-modular.c</code> beside <code className="aw-code">cars.txt</code>, then compare its output with the one from step S5.2.</>,
    body: (
      <>
        <p className="aw-p">
          <code className="aw-code">07-fields.c</code> works, and nothing in it
          is incorrect. <code className="aw-code">09-modular.c</code> performs
          the same task with two functions interposed between{" "}
          <code className="aw-code">main</code> and the stream, and the two
          programs emit identical bytes. That is the point of the exercise: the
          structure has changed and the behavior has not, which is what the term{" "}
          <strong>refactoring</strong> denotes.
        </p>
        <p className="aw-p">
          What the second version buys is a <strong>separation of
          concerns</strong>. Three distinct responsibilities are tangled
          together in the first program: reading and cleaning one field,
          assembling four fields into a record, and presenting a record as a row
          of a table. In the second each has a name, a boundary and a defined
          result, so each can be reasoned about without the other two in view.
        </p>
      </>
    ),
    media: (
      <>
        <p className="aw-p">
          <code className="aw-code">readField</code> carries the first
          responsibility and nothing else. It reads one line and removes the
          terminator that <code className="aw-code">fgets</code> retained,
          returning 1 when a field was obtained and 0 once the stream is
          exhausted. Its caller therefore never has to remember that fields
          arrive with a newline attached.
        </p>
        <CodeBlock
          file="09-modular.c"
          from={6}
          focus={[3]}
          lines={[
            "int readField(FILE *fp, char *out, int size) {",
            "",
            "    if (fgets(out, size, fp) == NULL) {",
            "        return 0;               //nothing left to read",
            "    }"
          ]}
          caption="The four NULL tests of 07-fields.c, now expressed once in the only function that reads."
        />
        <CodeBlock
          file="09-modular.c"
          from={12}
          focus={[2]}
          lines={[
            "    int n = (int) strlen(out);",
            "    if (n > 0 && out[n - 1] == '\\n') {",
            "        out[n - 1] = '\\0';",
            "    }",
            "",
            "    return 1;"
          ]}
          caption="The body of stripNewline from step S5.2, now located inside the only function that has any need of it."
        />
        <p className="aw-p">
          <code className="aw-code">readCar</code> carries the second
          responsibility, record assembly. It calls{" "}
          <code className="aw-code">readField</code> once per field and returns
          1 only when all four fields were present, so a record is either
          complete or not delivered at all.
        </p>
        <CodeBlock
          file="09-modular.c"
          from={23}
          lines={[
            "int readCar(FILE *fp, char *make, char *model,",
            "            char *year, char *plate) {"
          ]}
        />
        <CodeBlock
          file="09-modular.c"
          from={26}
          focus={[0]}
          lines={[
            "    if (!readField(fp, make, 40))  return 0;",
            "    if (!readField(fp, model, 40)) return 0;",
            "    if (!readField(fp, year, 40))  return 0;",
            "    if (!readField(fp, plate, 40)) return 0;",
            "",
            "    return 1;"
          ]}
          caption="Four fields, with an early return the moment any one of them proves to be absent."
        />
        <p className="aw-p">
          That guard is the part of the design worth carrying forward. A file
          may end part-way through a record, so that three fields arrive and the
          fourth does not. The three that arrived are genuine data, but the
          record they would form is not, and returning 0 ensures the caller
          never receives a partial record. The stray fields are discarded rather
          than printed alongside values left over from the preceding record.
        </p>
        <p className="aw-p">
          The third responsibility, presentation, is all that remains in{" "}
          <code className="aw-code">main</code>.
        </p>
        <CodeBlock
          file="09-modular.c"
          from={52}
          focus={[0]}
          lines={[
            "    while (readCar(fp, make, model, year, plate)) {",
            "        printf(\"%-12s %-16s %-6s %-10s\\n\",",
            "               make, model, year, plate);",
            "    }"
          ]}
          caption="The loop condition now asks a single question: was a further complete record available?"
        />
        <p className="aw-p">
          <code className="aw-code">main</code> now states what is to happen
          once per record and no longer states how a field is read or how a
          record is assembled. Each of the three pieces can be modified, tested
          or replaced without the other two being opened.
        </p>
        <Terminal label="09-modular.c — identical to the output of 07-fields.c">{`MAKE         MODEL            YEAR   PLATE     
Toyota       Corolla          1995   TVX-111   
Toyota       Vios             2014   TJJ-100   
Mitsubishi   Montero Sport    2018   JJT-001   
Honda        Civic            2021   HCV-221   `}</Terminal>
        <p className="aw-p">
          The same division reappears in Week 7, where MATLAB supplies the
          reading and you supply the assembly and the presentation, and again in
          the Week 13 team project. A function is the smallest unit of work a
          team can allocate to one person, test in isolation and then
          integrate. That is why the boundaries drawn here matter beyond this
          one program.
        </p>
        <p className="aw-p">
          That concludes the handout. You opened a stream and made the program
          report an open that had failed, then wrote bytes and learned where the
          library holds them until the stream is closed. You then read those
          bytes back while watching the file position indicator advance, and
          turned a delimited data file into a table. The reference at the foot
          of this page is the part worth keeping beside you.
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
