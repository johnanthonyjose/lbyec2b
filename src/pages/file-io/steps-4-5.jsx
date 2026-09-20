import React from "react";
import { CodeBlock, Terminal } from "./CodeBlock.jsx";
import { FileMachine } from "../../components/FileMachine.jsx";

/* Stages 4 and 5 of the File I/O handout.

   Stage 4 is where this handout stops resembling the document it replaces.
   Everything before it could be checked by looking: the mode letter is in the
   source, the file either appeared on disk or it did not. Reading cannot be
   checked by looking, because what a read returns depends on the stream
   position, and the stream position is not written anywhere the reader can
   see. The old document noticed this once — "this program illustrates how to
   do read operations but also shows how difficult it can be to control what to
   read" — and then carried on as though it had not. Three steps here carry a
   FileMachine trace instead, so the cursor is on the screen while the sentence
   about it is being read.

   The prose carries one image for that cursor and one only: a finger on the
   page, introduced in S4.1 and used unchanged to the end of S4.4. Every trace
   note, caption and option note in stage 4 is written to that image. A second
   image for the same idea — a bookmark, a tape head, a playhead — costs the
   reader a translation on every sentence, so none appears here. Stage 5 has
   the picture already and stops naming it.

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
          Reading needs a place to read from. C keeps one finger on the page for
          you. It starts on the first byte of the file.
        </p>
        <p className="aw-p">
          <code className="aw-code">fgetc</code> hands back the byte under the
          finger. Then it slides the finger one byte along. Forty-four calls
          read the whole file.
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
          caption="The one line in this program worth arguing about."
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
          caption="The read sits inside the condition. Step S4.3 is about why."
        />
        <FileMachine
          file={TEST_TXT}
          caption="The first six calls of 04-readchar.c. The bar is the finger. Tinted bytes are already read."
          trace={[
            { call: "c = fgetc(fp)", pos: 1, vars: { c: "104 ('h')" }, note: "One call, one byte. The finger was on byte 0. It is on byte 1 now." },
            { call: "c = fgetc(fp)", pos: 2, vars: { c: "101 ('e')" } },
            { call: "c = fgetc(fp)", pos: 3, vars: { c: "108 ('l')" } },
            { call: "c = fgetc(fp)", pos: 4, vars: { c: "108 ('l')" } },
            { call: "c = fgetc(fp)", pos: 5, vars: { c: "111 ('o')" } },
            { call: "c = fgetc(fp)", pos: 6, vars: { c: "32 (space)" }, note: "The space between 'hello' and 'no.' is a byte. It costs a call like any other." }
          ]}
        />
        <Terminal>{`hello no. 1
where is no. 2?
How about no. 3?`}</Terminal>
      </>
    ),
    why: {
      label: "Why is there no blank line after the output?",
      body: <>The last byte of <code className="aw-code">test.txt</code> is the question mark of <code className="aw-code">How about no. 3?</code>. No newline follows it. So the shell prompt returns on the same line as the text. The program is not at fault. The file really does end there.</>
    },
    check: {
      kind: "predict",
      question: "You change int c; to char c;, recompile, and run it on test.txt. It still prints all 44 characters. Is the declaration a matter of taste?",
      options: [
        {
          id: "taste",
          label: "Yes — it read the file correctly, so either type works",
          note: <>This is what you will see, and it is why the bug is so expensive. <code className="aw-code">test.txt</code> is plain English. Every byte in it is below 128. Nothing in this file can be mistaken for <code className="aw-code">EOF</code>. The declaration is not doing nothing. It has nothing to do yet.</>
        },
        {
          id: "data",
          label: "No — it works on this file and can fail on another",
          correct: true,
          note: <>Correct. <code className="aw-code">fgetc</code> returns one of 257 values: every byte, plus <code className="aw-code">EOF</code>. A <code className="aw-code">char</code> has room for 256. Where <code className="aw-code">char</code> is signed, a byte of 255 arrives as <code className="aw-code">-1</code>. The loop then ends in the middle of the file. Try it on any file that is not plain text. Where <code className="aw-code">char</code> is unsigned, nothing can ever equal <code className="aw-code">EOF</code>. That loop never ends at all. Your compiler decides which of the two you get.</>
        },
        {
          id: "rejected",
          label: "No — the compiler should have rejected it",
          note: <>It will not. Assigning an <code className="aw-code">int</code> to a <code className="aw-code">char</code> is legal C. Where <code className="aw-code">char</code> is unsigned you may get a <code className="aw-code">tautological-constant-out-of-range-compare</code> warning. Where it is signed, as on most machines you will use, you get nothing at all.</>
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
        It is the same loop. The only change is <code className="aw-code">%i</code>{" "}
        instead of <code className="aw-code">%c</code>. Each character now prints
        as the number stored on disk, not as the shape it draws.
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
          caption="Display only. It breaks the row of numbers wherever the file breaks a line."
        />
        <Terminal>{`104 101 108 108 111 32 110 111 46 32 49 10 
119 104 101 114 101 32 105 115 32 110 111 46 32 50 63 10 
72 111 119 32 97 98 111 117 116 32 110 111 46 32 51 63 -1`}</Terminal>
        <p className="aw-p">
          Two numbers there are worth stopping on.
        </p>
        <ul className="aw-p">
          <li>
            The <code className="aw-code">10</code> at the end of the first two
            rows is the line break. It is one ordinary character, at offset 11
            and at offset 27. It holds a position and costs a call like every
            other byte. There is no third <code className="aw-code">10</code>,
            because the file has no third line break.
          </li>
          <li>
            The <code className="aw-code">-1</code> at the very end is different
            in kind. It is <code className="aw-code">EOF</code>, printed by a{" "}
            <code className="aw-code">printf</code> of its own after the loop has
            finished. It was never in the file.
          </li>
        </ul>
        <FileMachine
          file={TEST_TXT}
          caption="Calls 10 to 13 of the same loop, where the finger crosses the first line break. The pilcrow is the newline byte."
          trace={[
            { call: "c = fgetc(fp)", pos: 10, vars: { c: "32 (space)" }, note: "Call 10. The finger is on byte 10. The next byte to read is the '1' of 'no. 1'." },
            { call: "c = fgetc(fp)", pos: 11, vars: { c: "49 ('1')" }, note: "Call 11. The last visible character of line one is consumed. The finger is on 11 and the line is not over." },
            { call: "c = fgetc(fp)", pos: 12, vars: { c: "10 ('\\n')" }, note: "Call 12. This is the newline. It returned 10 and moved the finger by one, like anything else. Only now is line one finished." },
            { call: "c = fgetc(fp)", pos: 13, vars: { c: "119 ('w')" }, note: "Call 13. The first byte of line two. Nothing was skipped between the lines. There was nothing there to skip." }
          ]}
        />
      </>
    ),
    check: {
      kind: "predict",
      question: "The first row of that output ends in 10. What is the 10?",
      options: [
        {
          id: "count",
          label: "The number of characters on that line",
          note: <>A fair guess, since it sits at the end of the row. But the first line is <code className="aw-code">hello no. 1</code>. That is eleven characters, twelve with its line break. Ten counts nothing here.</>
        },
        {
          id: "byte",
          label: "The line terminator: one ordinary byte, stored in the file like any other",
          correct: true,
          note: <>Decimal 10 is the newline character. It sits at offset 11 in <code className="aw-code">test.txt</code>. It is returned by an <code className="aw-code">fgetc</code> call of its own, and it moves the finger by one. The gap you see between lines in an editor is this byte being drawn.</>
        },
        {
          id: "added",
          label: "A marker printf adds when it reaches the end of a line",
          note: <>The program does print a line break of its own there. That is the <code className="aw-code">if (c == '\n')</code> above. But the <code className="aw-code">10</code> itself came from the file. <code className="aw-code">printf</code> printed what <code className="aw-code">fgetc</code> returned, and it returned 10 because 10 was the next byte on disk.</>
        }
      ]
    }
  },
  {
    id: "S4.3",
    stage: 4, n: 3,
    title: "Loop on the read, not on feof",
    action: <>Check every read loop you have written so far and make sure the read itself is the condition.</>,
    body: (
      <p className="aw-p">
        Both programs above share one shape. The call that reads is written
        inside the <code className="aw-code">while</code> condition. The loop
        continues only while that call succeeded. That is not a matter of style.
        It is the only shape that stops in the right place.
      </p>
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
          caption="The correct shape. The value the loop tests is the value the read returned."
        />
        <p className="aw-p">
          The tempting alternative reads better in English and is wrong. The
          end-of-file flag is not a look-ahead. It is set only{" "}
          <em>after</em> a read has been attempted and has failed.
        </p>
        <p className="aw-p">
          So on the last pass the flag is still clear. The loop enters the body,
          reads, and gets nothing. The previous line is still sitting in{" "}
          <code className="aw-code">line</code>, and the body prints it a second
          time.
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
          caption="Not from any of the shipped programs. It is here to be recognized and removed."
        />
        <p className="aw-p">
          The same shape fits every read function.
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
          Each of those asks the read whether it worked. The broken version asks
          the stream, afterwards, whether it should have.
        </p>
      </>
    ),
    why: {
      label: "Is feof ever the right thing to call?",
      body: <>Yes, after the loop rather than in it. A finished loop does not say why it finished. <code className="aw-code">feof(fp)</code> answers half of that: the file ran out. <code className="aw-code">ferror(fp)</code> answers the other half: something went wrong. That difference matters as soon as you read a file you did not write.</>
    },
    difficulty: "The last record is printed twice, or one line of rubbish follows the output",
    fix: 5,
    check: {
      kind: "predict",
      question: "A file holds three lines and ends with a newline. It is read with while (!feof(fp)), and each pass prints the line it read. How many lines are printed?",
      options: [
        {
          id: "three",
          label: "Three — one for each line in the file",
          note: <>This is what the code appears to say, which is why the fault survives review. The third <code className="aw-code">fgets</code> stopped at that final newline, not at the end of the file. So the flag is <em>still clear</em> afterwards and the loop goes round once more. A file with no newline on its last line does print three — <code className="aw-code">test.txt</code> is one of those. There the last read hits the end of the file and sets the flag. The bug is real either way. It just hides on some files.</>
        },
        {
          id: "four",
          label: "Four — the third line is printed twice",
          correct: true,
          note: <>The fourth pass attempts a read and that read fails. <code className="aw-code">line</code> still holds the third line from the pass before. The body cannot tell, so it prints it again. With numbers instead of lines, the duplicate is harder still to spot.</>
        },
        {
          id: "none",
          label: "None — feof is true from the start, so the loop never runs",
          note: <>Not quite. The flag starts clear on a file that opened successfully, so the loop does run. If your loop genuinely never entered, the cause is elsewhere. It is usually a failed <code className="aw-code">fopen</code> that was not checked.</>
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
          <code className="aw-code">fgets</code> reads until it meets a newline,
          or until the buffer is full. Whichever comes first.
        </p>
        <p className="aw-p">
          The surprise is what it does with that newline: it{" "}
          <strong>keeps it</strong>. The line break is copied into your buffer
          along with the text. That is why the lengths below are 12 and 16, not
          11 and 15.
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
          caption="Four calls to fgets on a 44-byte file. Three return a line. The fourth returns NULL."
          trace={[
            {
              call: "fgets(line, 100, fp)",
              pos: 12,
              vars: { line: "\"hello no. 1\\n\"", "strlen(line)": "12" },
              note: "Twelve bytes: eleven of text, plus the newline that fgets kept. The finger rests on 12, the 'w' of line two."
            },
            {
              call: "fgets(line, 100, fp)",
              pos: 28,
              vars: { line: "\"where is no. 2?\\n\"", "strlen(line)": "16" },
              note: "Sixteen bytes, the last of them the newline at offset 27. The finger has moved past it, to 28. line was overwritten, not appended to."
            },
            {
              call: "fgets(line, 100, fp)",
              pos: 44,
              vars: { line: "\"How about no. 3?\"", "strlen(line)": "16" },
              note: "Sixteen again, for a different reason. This line carries no newline. fgets stopped because the file stopped."
            },
            {
              call: "fgets(line, 100, fp)",
              pos: 44,
              eof: true,
              vars: { returned: "NULL" },
              note: "Nothing left to read. NULL comes back, line is untouched, the finger does not move. This is the call that ends the loop."
            }
          ]}
        />
        <Terminal>{`[12] hello no. 1
[16] where is no. 2?
[16] How about no. 3?`}</Terminal>
        <p className="aw-p">
          The program prints one extra newline of its own after the loop. The
          last line of the file carries none. Without it the shell prompt would
          land in the middle of the last row.
        </p>
      </>
    ),
    why: {
      label: "Why 100, and what if a line is longer than that?",
      body: <>The 100 is the size of the buffer. <code className="aw-code">fgets</code> never writes past it: 99 characters at most, plus the closing <code className="aw-code">\0</code>. A longer line is not lost. It is split, and the next call returns the rest without a newline in front. <code className="aw-code">gets()</code> could not be told a size, so C11 removed it.</>
    },
    check: {
      kind: "predict",
      question: "The second fgets has just returned \"where is no. 2?\\n\". Where is the stream position now?",
      options: [
        {
          id: "sixteen",
          label: "16 — the length of the line that was just read",
          note: <>Sixteen is the right length. But the position is not a length. It counts from the start of the file, not from the start of the line. The first call had already consumed twelve bytes. 12 + 16 is 28.</>
        },
        {
          id: "twentyseven",
          label: "27 — on the newline at the end of that line",
          note: <>The most tempting of the three. The newline really does live at offset 27. But <code className="aw-code">fgets</code> consumed it. It is in your buffer, which is why <code className="aw-code">strlen</code> reported 16. Your finger never rests on a byte it has already read. Read bytes are behind the finger, never under it.</>
        },
        {
          id: "twentyeight",
          label: "28 — on the 'H' of the third line",
          correct: true,
          note: <>Bytes 12 to 27 are consumed, the newline last of all. The finger rests on 28. That is the first byte of <code className="aw-code">How about no. 3?</code>, and it is exactly what the next call returns.</>
        }
      ]
    }
  },
  {
    id: "S4.5",
    stage: 4, n: 5,
    title: "Why the handout stops using fscanf",
    action: <>Read this one before you reach for <code className="aw-code">fscanf</code> in your machine problem.</>,
    body: (
      <p className="aw-p">
        <code className="aw-code">fscanf</code> is{" "}
        <code className="aw-code">scanf</code> with a file as its first argument.
        It is the natural thing to try next. It reads by conversion rather than
        by line. It leaves the finger wherever the last conversion stopped, and
        that is rarely where you assumed.
      </p>
    ),
    media: (
      <>
        <p className="aw-p">
          A <code className="aw-code">%s</code> reads one whitespace-delimited
          word. Take the line <code className="aw-code">Montero Sport</code>. One{" "}
          <code className="aw-code">%s</code> returns{" "}
          <code className="aw-code">Montero</code>. The space, the word{" "}
          <code className="aw-code">Sport</code> and the newline are all still in
          the stream. The next call meets them and is not expecting them. Every
          field of <code className="aw-code">cars.csv</code> that contains a
          space breaks this way.
        </p>
        <p className="aw-p">
          A <code className="aw-code">%i</code> is worse. Put it against a
          character that cannot begin a number. It converts nothing and consumes
          nothing. The offending characters are still there when the next call
          arrives, and it meets them again. One bad line becomes an endless loop
          of identical failures rather than one error.
        </p>
        <p className="aw-p">
          Neither event announces itself. <code className="aw-code">fscanf</code>{" "}
          reports through its return value: how many conversions succeeded.
          Written as{" "}
          <code className="aw-code">{"if (fscanf(fp, \"%s %i\", name, &qty) != 2)"}</code>{" "}
          the failure is visible. Written without that test it is invisible, and
          the variables keep whatever they held before.
        </p>
        <p className="aw-p">
          The cure is not a better format string. It is a{" "}
          <strong>delimiter</strong>: a character chosen in advance to mark where
          one field ends. Then the program never has to guess. Stage 5 reads a
          line at a time. It splits that line on the delimiter, then converts the
          pieces with <code className="aw-code">sscanf</code>. A malformed line
          costs you that line, not the rest of the file.
        </p>
      </>
    ),
    difficulty: "fscanf stopped in the middle of a line, or read nothing",
    fix: 6,
    check: {
      kind: "predict",
      question: "A file line reads Montero Sport. Your program calls fscanf(fp, \"%s\", model) once. What is in model afterwards, and where is the stream?",
      options: [
        {
          id: "whole",
          label: "model holds \"Montero Sport\"; the stream is at the start of the next line",
          note: <>This is what <code className="aw-code">%s</code> looks like it means, and it is why the fault is so common. But <code className="aw-code">%s</code> is defined to stop at the first whitespace. The space after <code className="aw-code">Montero</code> is whitespace.</>
        },
        {
          id: "word",
          label: "model holds \"Montero\"; \" Sport\" and the newline are still unread",
          correct: true,
          note: <>Correct, and note that the space was not consumed either. The next call meets a space, then <code className="aw-code">Sport</code>, then a newline. It is expecting none of the three. Printing what you read, right after you read it, finds this in one run.</>
        },
        {
          id: "nothing",
          label: "fscanf returns 0 and model is left untouched",
          note: <>That is how <code className="aw-code">%i</code> fails against a non-numeric character. <code className="aw-code">%s</code> against ordinary text succeeds. The difficulty is that it succeeds at something smaller than you wanted.</>
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
      <p className="aw-p">
        A delimiter is a character agreed in advance to mean "one data item
        stops here". It can be a short run of characters instead. It carries no
        data of its own. It has one requirement: it must never appear inside the
        data it separates. If it can, the program cannot tell a separator from a
        value.
      </p>
    ),
    media: (
      <>
        <p className="aw-p">
          The two files hold the same four cars. In{" "}
          <code className="aw-code">cars.txt</code> the delimiter is the{" "}
          <strong>end-of-line character</strong>. One field per line, four lines
          per car. You already know that byte: it is the one worth 10 from stage
          4. Here it is doing real work.
        </p>
        <Terminal label="cars.txt — the first car">{`Toyota
Corolla
1995
TVX-111`}</Terminal>
        <p className="aw-p">
          In <code className="aw-code">cars.csv</code> the delimiter is the{" "}
          <strong>comma</strong>, and a whole record fits on one line. The first
          line names the columns rather than describing a car.
        </p>
        <Terminal label="cars.csv — the header and the first car">{`make,model,year,plate
Toyota,Corolla,1995,TVX-111`}</Terminal>
        <p className="aw-p">
          The comma is convenient. It is not safe in general. A field that
          contains a comma gets split in the wrong place. Nothing complains. An address does it. So does a name written surname-first, or
          a price written in some locales.
        </p>
        <p className="aw-p">
          Any character that cannot appear in your data will serve instead. That
          is why files in the wild sometimes use a tab or a semicolon instead.
          Some use a run such as <code className="aw-code">:|:</code> that nobody
          types by accident. The comma is used here because the rest of the world
          uses it. None of these four cars contains one either.
        </p>
      </>
    ),
    why: {
      label: "Where does this go after Week 3?",
      body: <>The pipeline you are about to build is a delimited file. Records are read one at a time and printed as a table. That is the shape of the CSV work you do in MATLAB in Week 7. It is the shape again of the team project you are measured on in Week 13. Writing it once by hand is the point.</>
    },
    check: {
      kind: "self",
      question: "Do both files open in your editor, holding the same four cars in two different arrangements?",
      ok: {
        label: "Yes, I can see both",
        note: "Keep them in the same folder as your programs. The next two steps read them by bare relative name."
      },
      alt: {
        label: "One of them will not open, or looks like one long line",
        note: <>A file that appears as one long line is an editor problem. That editor does not understand the line endings. Try VS Code rather than Notepad. If a download is missing entirely, fetch it again. Every remaining step in this stage needs both files beside the program.</>
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
        One car is four consecutive lines. So one pass of the loop is four calls
        to <code className="aw-code">fgets</code>. The{" "}
        <code className="aw-code">&amp;&amp;</code> between them matters. C stops
        evaluating at the first call that returns{" "}
        <code className="aw-code">NULL</code>. A file that ends part-way through
        a record ends the loop instead of printing half a car.
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
          caption="Four reads, one record, and the loop shape from step S4.3 four times over."
        />
        <p className="aw-p">
          All four buffers now end in a newline, because that is what{" "}
          <code className="aw-code">fgets</code> does. Left in place, each field
          would carry a line break into the middle of a table row. One car would
          print across four lines. So each field goes through{" "}
          <code className="aw-code">stripNewline</code> first.
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
          caption="Overwriting the newline with \\0 ends the string one character earlier. The n > 0 test keeps it safe on an empty string. The '\\n' test keeps it safe on a last line that has none."
        />
        <Terminal>{`MAKE         MODEL            YEAR   PLATE     
Toyota       Corolla          1995   TVX-111   
Toyota       Vios             2014   TJJ-100   
Mitsubishi   Montero Sport    2018   JJT-001   
Honda        Civic            2021   HCV-221   `}</Terminal>
        <p className="aw-p">
          Look at what <code className="aw-code">Montero Sport</code> proves. The
          field contains a space and still arrives whole. The delimiter is the
          line break, not whitespace. A single{" "}
          <code className="aw-code">%s</code> would have returned{" "}
          <code className="aw-code">Montero</code> and left the rest behind.
        </p>
        <p className="aw-p">
          Note too that the year is still text here. Printed as{" "}
          <code className="aw-code">%-6s</code> it looks right. But it could not
          be compared or averaged.
        </p>
      </>
    ),
    check: {
      kind: "predict",
      question: "Suppose the four stripNewline calls were deleted and nothing else changed. What would the table look like?",
      options: [
        {
          id: "identical",
          label: "Identical — printf ignores a trailing newline in a %s field",
          note: <><code className="aw-code">printf</code> ignores nothing. It prints the bytes it is given, and a newline among them prints as a newline. The padding in <code className="aw-code">%-12s</code> is added after those bytes, not instead of them.</>
        },
        {
          id: "spread",
          label: "Each field would be followed by a line break, so one car would occupy four lines",
          correct: true,
          note: <>Exactly that. The columns would be wrong as well. <code className="aw-code">%-12s</code> counts the newline as one of its twelve characters. So the spacing after each field falls one short.</>
        },
        {
          id: "crash",
          label: "The program would crash on the first row",
          note: <>Nothing here is unsafe. The strings are still properly terminated and no buffer is overrun. This is a formatting fault, not a memory fault. That is precisely why it survives long enough to reach a submission.</>
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
        With a comma as the delimiter, four fields share one line.{" "}
        <code className="aw-code">fgets</code> can no longer do the separating
        for you. One function does it instead. It reads a single item. It stops at
        the next comma, the end of the line, or the end of the file.
        Everything else in the program is built on it.
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
          caption="out is where the item is written. size is how much room out has. The function is told both and assumes neither."
        />
        <p className="aw-p">
          The first character is read on its own, before the loop. That lets the
          function tell apart two things that look alike: a file with nothing
          left in it, and an item that is genuinely empty.
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
          caption="-1 means the file had nothing left. It is deliberately not 0, which will mean an item of no characters."
        />
        <p className="aw-p">
          Past that check there is something to read. Now the loop runs until the
          item ends. Three things can end it, and they are the three things that
          may legitimately follow an item: another field, the end of the row, or
          the end of the file.
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
          The comma and the newline are read but never stored. That is the whole
          trick. The caller gets the item on its own. The stream is left ready for
          the next one. The <code className="aw-code">\r</code> is dropped as it
          goes past, not trimmed later. So a file written on Windows behaves like
          one written on a Mac.
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
          caption="size - 1 leaves room for the \\0. An over-long item is read past but not stored. It is truncated rather than overrunning the buffer the caller gave you."
        />
        <p className="aw-p">
          One line is still missing. Every trip round the loop has to fetch the
          next character.
        </p>
        <CodeBlock
          file="08-csv.c"
          from={43}
          lines={[
            "        c = fgetc(fp);",
            "    }"
          ]}
          caption="Without this line the loop would test the same c forever."
        />
        <p className="aw-p">
          Once the loop ends, the item is sitting in{" "}
          <code className="aw-code">out</code>. It is not a string yet.
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
          caption="The return value is the length of the item. That is what lets the caller recognize a blank line."
        />
      </>
    ),
    why: {
      label: "Why not return the item itself?",
      body: <>A C function cannot safely return a string it created inside itself. That storage is gone the moment the function ends. Passing in <code className="aw-code">out</code> and <code className="aw-code">size</code> leaves the caller owning the memory. It is the same arrangement <code className="aw-code">fgets</code> uses, and it frees the return value to carry the length.</>
    },
    check: {
      kind: "predict",
      question: "getDelimitedItem can return -1 and it can return 0. What does a return of 0 mean?",
      options: [
        {
          id: "eof",
          label: "The file has run out",
          note: <>That is <code className="aw-code">-1</code>. It comes only from the early check before the loop. That is the one case where no character at all was available. Keeping the two apart is the reason that check exists.</>
        },
        {
          id: "empty",
          label: "There was something to read, but the item had no characters in it",
          correct: true,
          note: <>Most often a blank line at the end of the file. The delimiter arrived at once, so nothing was stored. <code className="aw-code">main</code> treats a first item of length 0 as "not a car" and goes round again. That is why a stray trailing newline produces no spurious row.</>
        },
        {
          id: "toolong",
          label: "The item was longer than the buffer could hold",
          note: <>An over-long item returns the number of characters that fitted, which is <code className="aw-code">size - 1</code>, not 0. It is truncated quietly. Worth knowing, and worth sizing your buffers for.</>
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
        The header line is read first and thrown away. The loop below then only
        ever sees real cars. If that first read returns{" "}
        <code className="aw-code">NULL</code> the file was empty. That is worth
        saying out loud rather than reporting as zero cars.
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
          One pass of the loop is one car. The first call decides whether there
          is a record at all. The other three then complete it. Both stop here the same way: a file that ends with a newline,
          and a file that does not.
        </p>
        <CodeBlock
          file="08-csv.c"
          from={82}
          focus={[0]}
          lines={[
            "    while ((n = getDelimitedItem(fp, make, 40)) >= 0) {"
          ]}
          caption="The read is the condition again — the same shape as every loop in stage 4."
        />
        <CodeBlock
          file="08-csv.c"
          from={87}
          lines={[
            "        if (n == 0) {",
            "            continue;",
            "        }"
          ]}
          caption="A blank line is not a car. Go round and read again."
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
          All four fields are text, the year included. Everything read from a
          text file arrives as characters.{" "}
          <code className="aw-code">sscanf</code> converts one of them. It reads
          a number out of a string, the way{" "}
          <code className="aw-code">scanf</code> reads one from the keyboard.
          Like <code className="aw-code">fscanf</code>, it returns how many
          conversions succeeded. A return of 1 is the program confirming that the
          year really was numeric.
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
          caption="Checking the return value is what stops a typo in the data file from printing an undefined value."
        />
        <CodeBlock
          file="08-csv.c"
          from={107}
          focus={[0]}
          lines={[
            "        printf(\"%-12s %-16s %6i %-10s\\n\",",
            "               make, model, y, plate);"
          ]}
          caption="%6i, not %-6s. The year is a real int now, so it prints right-aligned like a number."
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
      question: "Somebody edits cars.csv and types nineteen where the first car's year should be. What does the program print?",
      options: [
        {
          id: "rubbish",
          label: "A row for that car with a meaningless number in the year column",
          note: <>That is what happens when the return value is not checked. <code className="aw-code">sscanf</code> converts nothing. <code className="aw-code">y</code> keeps whatever it held before. On the first pass that is nothing in particular. The row is printed anyway. It is the behavior this <code className="aw-code">if</code> exists to prevent.</>
        },
        {
          id: "skip",
          label: "A line saying it is skipping that car, and then the rest of the table as normal",
          correct: true,
          note: <>The conversion fails and <code className="aw-code">sscanf</code> returns 0. The message is printed, and <code className="aw-code">continue</code> moves on to the next record. One bad line costs one line.</>
        },
        {
          id: "stops",
          label: "Nothing more — the program stops at that record",
          note: <>A reasonable fear. It is what <code className="aw-code">fscanf</code> would do. <code className="aw-code">fscanf</code> leaves the offending characters in the stream, and the next call meets them again. <code className="aw-code">sscanf</code> works on a string that has already been read, so the stream has moved on regardless.</>
        }
      ]
    }
  },
  {
    id: "S5.5",
    stage: 5, n: 5,
    title: "Add a car of your own",
    action: <>Open <code className="aw-code">cars.csv</code> and add a fifth line in the same shape as the others. Save it and run <code className="aw-code">08-csv.c</code> again.</>,
    body: (
      <p className="aw-p">
        Four fields, three commas. No spaces around the commas unless you want
        them in the data. Nothing needs recompiling. The data lives in the file
        and the program reads whatever is there. That separation is the point of
        the whole handout.
      </p>
    ),
    media: (
      <>
        <p className="aw-p">
          While the file is open, try the other two experiments as well. Put a
          word where a year should be. Watch the record be skipped by name
          rather than printed as rubbish. That is the{" "}
          <code className="aw-code">sscanf</code> check from the previous step
          doing its job.
        </p>
        <Terminal label="A year that is not a number">{`MAKE         MODEL              YEAR PLATE     
Skipping Toyota Corolla: year 'nineteen' is not a number
Honda        Civic              2021 HCV-221   `}</Terminal>
        <p className="aw-p">
          Then leave a blank line at the end of the file. No extra row should
          appear. That is the item of length 0 from step S5.3 being recognized
          and stepped over.
        </p>
        <p className="aw-p">
          You now have a program that turns a data file into a table. Five parts
          did it.
        </p>
        <ul className="aw-p">
          <li>A file on disk.</li>
          <li>A delimiter.</li>
          <li>Records read one at a time into variables.</li>
          <li>A number converted, and the conversion checked.</li>
          <li>Output lined up in columns.</li>
        </ul>
        <p className="aw-p">
          That is the shape of every data-handling task ahead of you. You have
          now written it once by hand.
        </p>
      </>
    ),
    check: {
      kind: "self",
      question: "Does your own car appear in the table, in the right columns?",
      ok: {
        label: "Yes, five rows now",
        note: "Then the program is reading data rather than repeating something you compiled into it. Keep cars.csv and 08-csv.c — the machine problem starts from this pair."
      },
      alt: {
        label: "It is missing, or the columns are out of line",
        note: <>Count the commas first: four fields need exactly three. A missing comma joins two fields into one and shifts everything after it. If the row is absent entirely, check that you saved the file. Check also that your car sits on a line of its own. If the last line had no newline, your car runs straight on to the end of the Honda.</>
      }
    }
  }
];
