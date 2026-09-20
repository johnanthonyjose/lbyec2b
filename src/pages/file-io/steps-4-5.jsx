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

   Every `pos` below is transcribed from the ftell() tables in PROGRAMS.md. No
   position here was calculated by hand, and none may be. If a trace and a
   compiler ever disagree, the compiler is right and this file is wrong.

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
      <p className="aw-p">
        This is the smallest possible read. <code className="aw-code">fgetc</code>{" "}
        hands back the next single character and moves the stream position
        forward by exactly one byte. Forty-four calls read the whole file.
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
          caption="The declaration is the part of this program worth arguing about."
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
          caption="The read is inside the condition. Step S4.3 is about why."
        />
        <FileMachine
          file={TEST_TXT}
          caption="The first six calls of 04-readchar.c. The bar is the stream position; tinted bytes have already been consumed."
          trace={[
            { call: "c = fgetc(fp)", pos: 1, vars: { c: "104 ('h')" }, note: "One call, one byte. The position was 0 before this and is 1 now." },
            { call: "c = fgetc(fp)", pos: 2, vars: { c: "101 ('e')" } },
            { call: "c = fgetc(fp)", pos: 3, vars: { c: "108 ('l')" } },
            { call: "c = fgetc(fp)", pos: 4, vars: { c: "108 ('l')" } },
            { call: "c = fgetc(fp)", pos: 5, vars: { c: "111 ('o')" } },
            { call: "c = fgetc(fp)", pos: 6, vars: { c: "32 (space)" }, note: "The space between 'hello' and 'no.' is a byte, and it costs a call like any other." }
          ]}
        />
        <Terminal>{`hello no. 1
where is no. 2?
How about no. 3?`}</Terminal>
      </>
    ),
    why: {
      label: "Why is there no blank line after the output?",
      body: <>The last byte of <code className="aw-code">test.txt</code> is the question mark of <code className="aw-code">How about no. 3?</code>. There is no newline after it, so the shell prompt returns on the same line as the text. That is not a fault in the program; it is the file being reported honestly.</>
    },
    check: {
      kind: "predict",
      question: "Suppose you changed int c; to char c;, recompiled, and ran it on test.txt. It still prints all 44 characters correctly. Is the declaration therefore a matter of taste?",
      options: [
        {
          id: "taste",
          label: "Yes — it read the file correctly, so either type works",
          note: <>This is what you will observe, and it is the reason the bug is so expensive. It worked because <code className="aw-code">test.txt</code> is plain English: every byte in it is below 128, so nothing in this particular file can be mistaken for <code className="aw-code">EOF</code>. The declaration is not doing nothing — it simply has nothing to do yet.</>
        },
        {
          id: "data",
          label: "No — it works on this file and can fail on another",
          correct: true,
          note: <>Correct. <code className="aw-code">fgetc</code> returns one of 257 values: every byte, plus <code className="aw-code">EOF</code>. A <code className="aw-code">char</code> has room for 256. Where <code className="aw-code">char</code> is signed, a byte of 255 arrives as <code className="aw-code">-1</code> and ends the loop in the middle of the file — try it on any file that is not plain text. Where <code className="aw-code">char</code> is unsigned, nothing can ever equal <code className="aw-code">EOF</code> and the loop never ends at all. Which of the two you get is decided by your compiler, not by you.</>
        },
        {
          id: "rejected",
          label: "No — the compiler should have rejected it",
          note: <>It will not. Assigning an <code className="aw-code">int</code> to a <code className="aw-code">char</code> is legal C. Where <code className="aw-code">char</code> is unsigned you may get a <code className="aw-code">tautological-constant-out-of-range-compare</code> warning; where it is signed, as on most machines you will use, you get nothing at all.</>
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
        instead of <code className="aw-code">%c</code>, so each character is
        printed as the number actually stored on disk rather than as the shape
        it draws.
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
          caption="This is display only: it breaks the row of numbers wherever the file breaks a line."
        />
        <Terminal>{`104 101 108 108 111 32 110 111 46 32 49 10 
119 104 101 114 101 32 105 115 32 110 111 46 32 50 63 10 
72 111 119 32 97 98 111 117 116 32 110 111 46 32 51 63 -1`}</Terminal>
        <p className="aw-p">
          Two numbers in that output are worth stopping on. The{" "}
          <code className="aw-code">10</code> at the end of the first two rows is
          the line break — a single ordinary character, sitting in the file at
          offset 11 and at offset 27, occupying a position and costing a call
          like every other byte. There is no third{" "}
          <code className="aw-code">10</code>, because the file has no third line
          break. The <code className="aw-code">-1</code> at the very end is
          different in kind: it is <code className="aw-code">EOF</code>, printed
          by a <code className="aw-code">printf</code> of its own after the loop
          has finished. It was never in the file.
        </p>
        <FileMachine
          file={TEST_TXT}
          caption="Calls 10 to 13 of the same loop, where the position crosses the first line break. The pilcrow is the newline byte."
          trace={[
            { call: "c = fgetc(fp)", pos: 10, vars: { c: "32 (space)" }, note: "Call 10. The position is 10; the next byte to be read is the '1' of 'no. 1'." },
            { call: "c = fgetc(fp)", pos: 11, vars: { c: "49 ('1')" }, note: "Call 11. The last visible character of line one has been consumed. The position is 11 and the line is not over." },
            { call: "c = fgetc(fp)", pos: 12, vars: { c: "10 ('\\n')" }, note: "Call 12. This is the newline. It returned 10, it moved the position by one like anything else, and only now is line one finished." },
            { call: "c = fgetc(fp)", pos: 13, vars: { c: "119 ('w')" }, note: "Call 13. The first byte of line two. Nothing was skipped between the lines, because there was nothing there to skip." }
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
          note: <>A fair guess, since it sits at the end of the row. But the first line is <code className="aw-code">hello no. 1</code>, which is eleven characters, and twelve with its line break. Ten is not a count of anything here.</>
        },
        {
          id: "byte",
          label: "The line terminator: one ordinary byte, stored in the file like any other",
          correct: true,
          note: <>Decimal 10 is the newline character. It occupies offset 11 in <code className="aw-code">test.txt</code>, it is returned by an <code className="aw-code">fgetc</code> call of its own, and it advances the stream position by one. The gap you see between lines in an editor is this byte being drawn.</>
        },
        {
          id: "added",
          label: "A marker printf adds when it reaches the end of a line",
          note: <>The program does print a line break of its own at that point — that is the <code className="aw-code">if (c == '\n')</code> above — but the <code className="aw-code">10</code> itself came from the file. <code className="aw-code">printf</code> printed the value <code className="aw-code">fgetc</code> returned, and it returned 10 because 10 was the next byte on disk.</>
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
        Both programs above have the same shape: the call that reads is written
        inside the <code className="aw-code">while</code> condition, and the loop
        continues for as long as that call succeeded. That is not a stylistic
        preference. It is the only shape that stops at the right place.
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
          <em>after</em> a read has been attempted and has failed, so on the last
          pass the loop tests a flag that is still clear, enters the body, reads,
          and gets nothing — leaving the previous line still sitting in{" "}
          <code className="aw-code">line</code>, which the body then prints for a
          second time.
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
          caption="Not from any of the shipped programs. It is here to be recognised and removed."
        />
        <p className="aw-p">
          The same shape applies to every read function.{" "}
          <code className="aw-code">{"while ((c = fgetc(fp)) != EOF)"}</code> for
          a character at a time, with <code className="aw-code">c</code> declared{" "}
          <code className="aw-code">int</code>.{" "}
          <code className="aw-code">{"while (fgets(line, 100, fp) != NULL)"}</code>{" "}
          for a line at a time. In each case the loop asks the read whether it
          worked, rather than asking the stream, afterwards, whether it should
          have.
        </p>
      </>
    ),
    why: {
      label: "Is feof ever the right thing to call?",
      body: <>Yes, after the loop rather than in it. A loop that has ended tells you nothing about why it ended, and <code className="aw-code">feof(fp)</code> answers half of that question: the file ran out. <code className="aw-code">ferror(fp)</code> answers the other half: something went wrong. That distinction matters as soon as you are reading a file you did not write yourself.</>
    },
    difficulty: "The last record is printed twice, or one line of rubbish follows the output",
    fix: 5,
    check: {
      kind: "predict",
      question: "A file holds three lines and ends with a newline. It is read with while (!feof(fp)) and each pass prints the line it read. How many lines does the program print?",
      options: [
        {
          id: "three",
          label: "Three — one for each line in the file",
          note: <>This is what the code appears to say, which is exactly why the fault survives review. The third <code className="aw-code">fgets</code> stopped at that final newline rather than at the end of the file, so the flag is <em>still clear</em> afterwards and the loop goes round once more. Note that a file with no newline on its last line — <code className="aw-code">test.txt</code> is one — does print three, because there the last read hits the end of the file and sets the flag. The bug is real either way; it just hides on some files.</>
        },
        {
          id: "four",
          label: "Four — the third line is printed twice",
          correct: true,
          note: <>The fourth pass attempts a read, that read fails, and <code className="aw-code">line</code> still holds the third line from the pass before. The body has no way of knowing and prints it again. With numbers instead of lines the duplicate is even harder to spot.</>
        },
        {
          id: "none",
          label: "None — feof is true from the start, so the loop never runs",
          note: <>Not quite. The flag starts clear on a file that opened successfully, so the loop does run. If your loop genuinely never entered, the cause is elsewhere — usually a failed <code className="aw-code">fopen</code> that was not checked.</>
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
      <p className="aw-p">
        <code className="aw-code">fgets</code> reads until it meets a newline or
        fills the buffer, whichever comes first. The part that surprises people
        is what it does with the newline: it <strong>keeps it</strong>. The line
        break is copied into your buffer along with the text, which is why the
        lengths below are 12 and 16 rather than 11 and 15.
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
          caption="Four calls to fgets on a 44-byte file. Three of them return a line; the fourth returns NULL."
          trace={[
            {
              call: "fgets(line, 100, fp)",
              pos: 12,
              vars: { line: "\"hello no. 1\\n\"", "strlen(line)": "12" },
              note: "Twelve bytes: eleven of text and the newline, which fgets kept. The position is now 12, sitting on the 'w' of line two."
            },
            {
              call: "fgets(line, 100, fp)",
              pos: 28,
              vars: { line: "\"where is no. 2?\\n\"", "strlen(line)": "16" },
              note: "Sixteen bytes, ending at offset 27 — the second newline. The position is 28. The previous contents of line were overwritten, not appended to."
            },
            {
              call: "fgets(line, 100, fp)",
              pos: 44,
              vars: { line: "\"How about no. 3?\"", "strlen(line)": "16" },
              note: "Sixteen again, but for a different reason: this line has no newline of its own. fgets stopped because the file stopped."
            },
            {
              call: "fgets(line, 100, fp)",
              pos: 44,
              eof: true,
              vars: { returned: "NULL" },
              note: "Nothing left to read. NULL is returned, line is untouched and the position does not move. This is the call that ends the loop."
            }
          ]}
        />
        <Terminal>{`[12] hello no. 1
[16] where is no. 2?
[16] How about no. 3?`}</Terminal>
        <p className="aw-p">
          The program prints one extra newline of its own after the loop, because
          the last line of the file does not carry one. Without it the shell
          prompt would land in the middle of the last row.
        </p>
      </>
    ),
    why: {
      label: "Why 100, and what if a line is longer than that?",
      body: <>The 100 is the size of the buffer, and <code className="aw-code">fgets</code> never writes past it: it stores at most 99 characters and the closing <code className="aw-code">\0</code>. A longer line is not lost — it is split, and the next call continues where this one stopped, returning the remainder without a newline at the front of it. This size argument is the whole reason <code className="aw-code">fgets</code> replaced <code className="aw-code">gets()</code>, which had no way to be told how much room it had and was removed from the language in C11.</>
    },
    check: {
      kind: "predict",
      question: "The second fgets has just returned \"where is no. 2?\\n\". Where is the stream position now?",
      options: [
        {
          id: "sixteen",
          label: "16 — the length of the line that was just read",
          note: <>Sixteen is the right length, but the position is not a length. It counts from the start of the file, not from the start of the line, and twelve bytes had already been consumed by the first call. 12 + 16 is 28.</>
        },
        {
          id: "twentyseven",
          label: "27 — on the newline at the end of that line",
          note: <>The most tempting of the three, because the newline really does live at offset 27. But <code className="aw-code">fgets</code> consumed it: it is in your buffer, which is why <code className="aw-code">strlen</code> reported 16. A byte that has been read is behind the position, not under it.</>
        },
        {
          id: "twentyeight",
          label: "28 — on the 'H' of the third line",
          correct: true,
          note: <>Bytes 12 to 27 inclusive have been consumed, the last of them being the newline. The position is 28, which is the first byte of <code className="aw-code">How about no. 3?</code>, and that is exactly what the next call returns.</>
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
        <code className="aw-code">scanf</code> with a file as its first argument,
        and it is the natural thing to try next. It reads by conversion rather
        than by line, and it leaves the stream wherever the last conversion
        stopped — which is rarely where you assumed.
      </p>
    ),
    media: (
      <>
        <p className="aw-p">
          A <code className="aw-code">%s</code> reads one whitespace-delimited
          word. Given the line <code className="aw-code">Montero Sport</code>, a
          single <code className="aw-code">%s</code> returns{" "}
          <code className="aw-code">Montero</code> and leaves the space, the word{" "}
          <code className="aw-code">Sport</code> and the newline still in the
          stream, waiting for a call that is not expecting them. Every field of{" "}
          <code className="aw-code">cars.csv</code> that contains a space breaks
          this way.
        </p>
        <p className="aw-p">
          A <code className="aw-code">%i</code> that meets a character which
          cannot begin a number is worse. It converts nothing and consumes
          nothing, so the offending characters are still there when the next call
          arrives and meets them again. One bad line becomes an endless loop of
          identical failures rather than one error.
        </p>
        <p className="aw-p">
          Neither event announces itself, because{" "}
          <code className="aw-code">fscanf</code> reports by return value: it
          returns how many conversions succeeded. Written as{" "}
          <code className="aw-code">{"if (fscanf(fp, \"%s %i\", name, &qty) != 2)"}</code>{" "}
          the failure is visible. Written without the test it is invisible, and
          the variables simply keep whatever they held before.
        </p>
        <p className="aw-p">
          The answer is not a better format string. It is a{" "}
          <strong>delimiter</strong>: a character chosen in advance to mark where
          one field ends, so that the program is never guessing. Stage 5 reads a
          line at a time, splits it on the delimiter, and converts the pieces it
          needs with <code className="aw-code">sscanf</code> afterwards — at
          which point a malformed line costs you that line rather than the rest
          of the file.
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
          note: <>This is what <code className="aw-code">%s</code> looks like it means, and it is why the fault is so common. But <code className="aw-code">%s</code> is defined to stop at the first whitespace, and the space after <code className="aw-code">Montero</code> is whitespace.</>
        },
        {
          id: "word",
          label: "model holds \"Montero\"; \" Sport\" and the newline are still unread",
          correct: true,
          note: <>Correct, and note that the space was not consumed either. The next call meets a space, then <code className="aw-code">Sport</code>, then a newline — none of which the next call is expecting. Printing what you read immediately after reading it identifies this in one run.</>
        },
        {
          id: "nothing",
          label: "fscanf returns 0 and model is left untouched",
          note: <>That is the failure mode of <code className="aw-code">%i</code> against a non-numeric character, not of <code className="aw-code">%s</code>. A <code className="aw-code">%s</code> against ordinary text succeeds; the difficulty is that it succeeds at something smaller than you wanted.</>
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
        A delimiter is a character, or a short sequence of characters, agreed in
        advance to mean "one data item stops here". It carries no data of its
        own. Its only requirement is that it cannot occur inside the data it
        separates — because if it can, the program has no way to tell a
        separator from a value.
      </p>
    ),
    media: (
      <>
        <p className="aw-p">
          The two files hold the same four cars. In{" "}
          <code className="aw-code">cars.txt</code> the delimiter is the{" "}
          <strong>end-of-line character</strong>: one field per line, four lines
          per car. You already know that character — it is the byte worth 10 from
          stage 4, and it is doing real work here.
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
          The comma is convenient and it is not safe in general: a field that
          contains a comma — an address, a name written surname-first, a price
          written in some locales — will be split in the wrong place, and nothing
          will complain. Any character that cannot appear in your data will serve
          instead, which is why files in the wild are sometimes separated by a
          tab, a semicolon, or a sequence such as{" "}
          <code className="aw-code">:|:</code> that no one would type by accident.
          The comma is used here because it is what the rest of the world uses,
          and because none of these four cars contains one.
        </p>
      </>
    ),
    why: {
      label: "Where does this go after Week 3?",
      body: <>The pipeline you are about to build — a delimited data file, read record by record into variables, printed as a table — is the same shape as the CSV-to-figure work you do in MATLAB in Week 7, and the same shape again as the data handling your team project is measured on in Week 13. Writing it once by hand in C is the point: after this you will know what the MATLAB one-liner is doing for you.</>
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
        note: <>A file that appears as one long line is being shown by an editor that does not recognise the line endings; try it in VS Code rather than Notepad. If a download is missing entirely, fetch it again — every remaining step in this stage needs both files present beside the program.</>
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
        One car is four consecutive lines, so one pass of the loop is four calls
        to <code className="aw-code">fgets</code>. The{" "}
        <code className="aw-code">&amp;&amp;</code> between them matters: C stops
        evaluating at the first call that returns{" "}
        <code className="aw-code">NULL</code>, so a file that ends part-way
        through a record ends the loop rather than printing half a car.
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
          Every one of those four buffers now ends in a newline, because that is
          what <code className="aw-code">fgets</code> does. Left in place, each
          field would carry a line break into the middle of a table row, and one
          row would be printed across four lines. So each is passed through{" "}
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
          caption="Overwriting the newline with \\0 ends the string one character earlier. The test for n > 0 is what makes it safe on an empty string, and the test for '\\n' is what makes it safe on the last line of a file that has none."
        />
        <Terminal>{`MAKE         MODEL            YEAR   PLATE     
Toyota       Corolla          1995   TVX-111   
Toyota       Vios             2014   TJJ-100   
Mitsubishi   Montero Sport    2018   JJT-001   
Honda        Civic            2021   HCV-221   `}</Terminal>
        <p className="aw-p">
          Note what <code className="aw-code">Montero Sport</code> proves: the
          field contains a space and arrives intact, because the delimiter is the
          line break and not whitespace. A single{" "}
          <code className="aw-code">%s</code> would have returned{" "}
          <code className="aw-code">Montero</code> and left the rest behind. Note
          also that the year is still text here — printed as{" "}
          <code className="aw-code">%-6s</code> it looks right, but it could not
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
          note: <><code className="aw-code">printf</code> ignores nothing. It prints the bytes it is given, and a newline among them is printed as a newline. The padding in <code className="aw-code">%-12s</code> is added after those bytes, not instead of them.</>
        },
        {
          id: "spread",
          label: "Each field would be followed by a line break, so one car would occupy four lines",
          correct: true,
          note: <>Exactly that. The columns would also be wrong: <code className="aw-code">%-12s</code> counts the newline as one of the twelve characters it is padding out, so the spacing after each field would be one short as well.</>
        },
        {
          id: "crash",
          label: "The program would crash on the first row",
          note: <>Nothing here is unsafe — the strings are still properly terminated and no buffer is overrun. This is a formatting fault, not a memory fault, which is precisely why it survives long enough to reach a submission.</>
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
        With a comma as the delimiter there are four fields on one line, so{" "}
        <code className="aw-code">fgets</code> can no longer do the separating
        for you. This one function does it instead: it reads one item from the
        stream and stops at the next comma, at the end of the line, or at the end
        of the file. Everything else in the program is built on it.
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
          caption="out is where the item is written; size is how much room out has. The function is told both, and never assumes either."
        />
        <p className="aw-p">
          The first character is read before the loop, on its own, so the
          function can tell apart two things that look alike: a file with nothing
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
          caption="-1 means the file had nothing left. It is deliberately different from 0, which will mean an item of no characters."
        />
        <p className="aw-p">
          Then the loop itself. Three conditions end it, and they are the three
          things that can legitimately follow an item: another field, the end of
          the row, or the end of the file.
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
          The comma and the newline are read but never stored, which is the whole
          trick: the caller receives the item on its own and the stream is left
          ready for the next one. The{" "}
          <code className="aw-code">\r</code> is dropped rather than trimmed
          afterwards, so a file written on Windows behaves exactly like one
          written on a Mac.
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
          caption="size - 1 leaves room for the \\0. An over-long item is read past but not stored, so it is truncated instead of overrunning the buffer the caller gave you."
        />
        <CodeBlock
          file="08-csv.c"
          from={43}
          lines={[
            "        c = fgetc(fp);",
            "    }"
          ]}
          caption="The next character. Without this line the loop would test the same c forever."
        />
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
          caption="The return value is the length of the item, which is what lets the caller recognise a blank line."
        />
      </>
    ),
    why: {
      label: "Why not return the item itself?",
      body: <>Because a C function cannot safely return a string it created inside itself — the storage would be gone the moment the function ended. Passing in <code className="aw-code">out</code> and <code className="aw-code">size</code> leaves the caller owning the memory and the function merely filling it, which is the same arrangement <code className="aw-code">fgets</code> uses. The return value is then free to carry something else, and here it carries the length.</>
    },
    check: {
      kind: "predict",
      question: "getDelimitedItem can return -1 and it can return 0. What does a return of 0 mean?",
      options: [
        {
          id: "eof",
          label: "The file has run out",
          note: <>That is <code className="aw-code">-1</code>, and it is returned only from the early check before the loop — the one case where not a single character was available. Keeping the two apart is the reason that check exists.</>
        },
        {
          id: "empty",
          label: "There was something to read, but the item had no characters in it",
          correct: true,
          note: <>Most often a blank line at the end of the file: the delimiter arrived immediately, so nothing was stored. <code className="aw-code">main</code> treats a first item of length 0 as "not a car" and goes round again, which is why a stray trailing newline produces no spurious row.</>
        },
        {
          id: "toolong",
          label: "The item was longer than the buffer could hold",
          note: <>An over-long item returns the number of characters that fitted, which is <code className="aw-code">size - 1</code>, not 0. It is truncated quietly — worth knowing, and worth sizing your buffers for.</>
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
        The header line is read first and discarded, so the loop below only ever
        sees real cars. If that read returns{" "}
        <code className="aw-code">NULL</code> the file was empty, which is worth
        saying out loud rather than treating as zero cars.
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
          is a record at all; the other three then complete it. A file that ends
          with a newline and a file that ends without one both stop here in the
          same way.
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
          All four fields are now text, including the year, because everything
          read from a text file arrives as characters.{" "}
          <code className="aw-code">sscanf</code> converts one: it reads a number
          out of a string the way <code className="aw-code">scanf</code> reads one
          from the keyboard. Like <code className="aw-code">fscanf</code>, it
          returns how many conversions succeeded — so a return of 1 here is the
          program confirming that the year really was numeric.
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
          caption="%6i, not %-6s. The year is a real int now, so it is printed right-aligned like a number."
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
          note: <>That is what happens when the return value is not checked. <code className="aw-code">sscanf</code> converts nothing, <code className="aw-code">y</code> keeps whatever it held before — which on the first pass is nothing in particular — and the row is printed anyway. It is the behaviour this <code className="aw-code">if</code> exists to prevent.</>
        },
        {
          id: "skip",
          label: "A line saying it is skipping that car, and then the rest of the table as normal",
          correct: true,
          note: <>The conversion fails, <code className="aw-code">sscanf</code> returns 0, the message is printed and <code className="aw-code">continue</code> moves on to the next record. One bad line costs one line.</>
        },
        {
          id: "stops",
          label: "Nothing more — the program stops at that record",
          note: <>A reasonable fear, and it is what would happen with <code className="aw-code">fscanf</code>, which would leave the offending characters in the stream for the next call to meet again. <code className="aw-code">sscanf</code> works on a string that has already been read, so the stream has moved on regardless.</>
        }
      ]
    }
  },
  {
    id: "S5.5",
    stage: 5, n: 5,
    title: "Add a car of your own",
    action: <>Open <code className="aw-code">cars.csv</code>, add a fifth line in the same shape as the others, save it and run <code className="aw-code">08-csv.c</code> again.</>,
    body: (
      <p className="aw-p">
        Four fields, three commas, no spaces around the commas unless you want
        them in the data. Nothing in the program needs recompiling: the data
        lives in the file and the program reads whatever is there. That
        separation is the point of the whole handout.
      </p>
    ),
    media: (
      <>
        <p className="aw-p">
          While the file is open, try the other two experiments as well. Put a
          word where a year should be and watch the record be skipped by name
          rather than printed as rubbish — that is the{" "}
          <code className="aw-code">sscanf</code> check from the previous step
          doing its job.
        </p>
        <Terminal label="A year that is not a number">{`MAKE         MODEL              YEAR PLATE     
Skipping Toyota Corolla: year 'nineteen' is not a number
Honda        Civic              2021 HCV-221   `}</Terminal>
        <p className="aw-p">
          Then leave a blank line at the end of the file and confirm that no
          extra row appears. That is the item of length 0 from step S5.3 being
          recognised and stepped over.
        </p>
        <p className="aw-p">
          You now have a program that turns a data file into a table: a file on
          disk, a delimiter, records read one at a time into variables, a number
          converted and checked, and formatted output. That is the shape of every
          data-handling task ahead of you in this course, and you have written it
          once by hand.
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
        note: <>Count the commas first: four fields need exactly three. A missing comma joins two fields into one and shifts everything after it. If the row is absent entirely, check that you saved the file, and that the car is on a line of its own rather than appended to the last one — a file whose final line had no newline will otherwise run your car straight on to the end of the Honda.</>
      }
    }
  }
];
