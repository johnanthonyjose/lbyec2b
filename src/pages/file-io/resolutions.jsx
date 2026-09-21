import React from "react";

/* The panels behind an "anticipated difficulty" banner on the File I/O
   handout.

   The same rule applies here as on the assignment workflow: a difficulty with
   one cause and a one-sentence fix belongs inline in the step's own
   checkpoint, where the reader already is. A modal is for the handful that
   genuinely branch — where the right action depends on which of several things
   happened — and it earns its interruption there.

   All six below branch. Every one of them is a failure that has a habit of
   consuming a whole bench of the Week 3 lab, and all six share an unhelpful
   property: the program does not crash. It compiles, runs, returns zero and
   produces nothing, or produces something subtly wrong. A reader with no
   procedure for telling the causes apart will try random edits for an hour, so
   each `steps` list is written to be a discrimination procedure first and a
   repair second.

   `returnTo` is a {stage, step} pair because a resolution can send a reader
   back across a stage boundary — the path error, for instance, is discovered
   in stage 2 but produces its symptom again in stage 3. */

export const resolutions = [
  {
    id: 1,
    returnTo: { stage: 1, step: 2 },
    title: "fopen returned NULL",
    cause:
      "A NULL return means the file was not opened, and nothing you do with that FILE* afterwards will work. It is not one fault but four, and they need different repairs: the file does not exist and the mode was \"r\"; the name you passed is not the name on disk; the program is looking in a different folder from the one you are looking at; or the file is locked or read-only because another program holds it open.",
    steps: [
      <>Call <code className="aw-code">perror("fopen")</code> immediately after the NULL check. It prints the reason the C library recorded — <code className="aw-code">No such file or directory</code>, <code className="aw-code">Permission denied</code> — and that one line decides which of the causes below applies.</>,
      <>If it reports that the file does not exist and you intended to read one, confirm the file is genuinely there. Mode <code className="aw-code">"r"</code> never creates a file; only <code className="aw-code">"w"</code> and <code className="aw-code">"a"</code> do.</>,
      <>Check the name character by character against the folder listing. In Windows Explorer, turn on <strong>File name extensions</strong> in the View ribbon: with extensions hidden, a file shown as <code className="aw-code">test1.txt</code> is very often <code className="aw-code">test1.txt.txt</code> on disk, and the program is right to say it cannot find it.</>,
      <>Establish where the program is actually running. Print the working directory once at the top of <code className="aw-code">main</code> — on Windows <code className="aw-code">system("cd")</code>, elsewhere <code className="aw-code">system("pwd")</code> — or simply write to a file with a bare name and see where it appears. The folder open in your editor is not necessarily the folder the program runs in.</>,
      <>If the reason is a permissions error, close the file in Excel, Notepad or whatever else has it open, then run again. A file open elsewhere can refuse to be opened for writing.</>,
      <>Once you know which cause it was, fix that one thing and run again. Keep the NULL check in the program permanently — it costs three lines and it is the only reason you were able to tell these four cases apart at all.</>
    ]
  },
  {
    id: 2,
    returnTo: { stage: 1, step: 2 },
    title: "A Windows path with backslashes silently fails",
    cause:
      "In C source, a backslash inside a string begins an escape sequence. Written as \"c:\\temp\\test1.txt\", neither backslash survives: both are \\t, which is one tab character, so the path handed to fopen is c: TAB emp TAB est1.txt — fifteen characters, nothing like the path on your screen. The trap is that \\t is a perfectly valid escape, so the compiler has nothing to complain about and says nothing. fopen returns NULL, and with no NULL check the program does nothing and exits normally.",
    steps: [
      <>Read your path string as the compiler reads it. In <code className="aw-code">"c:\temp\test1.txt"</code> the characters actually sent to <code className="aw-code">fopen</code> are <code className="aw-code">c:</code>, a tab, <code className="aw-code">emp</code>, a tab, <code className="aw-code">est1.txt</code>. No such file can exist.</>,
      <>Do not expect the compiler to catch this. You are warned only when the letter after the backslash is not a valid escape — <code className="aw-code">\d</code> in <code className="aw-code">"c:\data"</code> gives <code className="aw-code">unknown escape sequence</code> — and you get nothing at all for <code className="aw-code">\t</code>, <code className="aw-code">\n</code>, <code className="aw-code">\r</code>, <code className="aw-code">\b</code>, <code className="aw-code">\f</code>, <code className="aw-code">\v</code>, <code className="aw-code">\a</code> or <code className="aw-code">\0</code>. A clean build does not clear you of this fault.</>,
      <>Fix it the simple way: use forward slashes. <code className="aw-code">"c:/temp/test1.txt"</code> works on Windows — the C runtime accepts it — and the same source then also compiles and runs unchanged on a Mac or on Linux.</>,
      <>If you must keep backslashes, double every one of them: <code className="aw-code">"c:\\temp\\test1.txt"</code>. Each <code className="aw-code">\\</code> is one backslash in the resulting string.</>,
      <>Prefer a bare relative name, such as <code className="aw-code">"test1.txt"</code>, while you are learning. It avoids escapes entirely and keeps the file beside your program, which is where it is easiest to find.</>,
      <>Be aware that the older course handout for this topic contained exactly this error: it printed single-backslash Windows paths in its examples. Any code copied from it will fail in this way, and the failure will be silent.</>
    ]
  },
  {
    id: 3,
    returnTo: { stage: 1, step: 2 },
    title: "The program runs, prints nothing, and exits normally",
    cause:
      "An exit status of zero means the program did what you told it to do. Silence means what you told it to do produced no output. File I/O is unusual among the things you have written so far in that almost every one of its failures looks like this rather than like a crash, so the first task is to narrow down where the silence begins.",
    steps: [
      <>Decide first whether you got no output at all or partial output. No output at all points at the open or at a loop that never ran. Output that stops part-way points at the stream position or at the end of the file.</>,
      <>Put a <code className="aw-code">printf</code> immediately after <code className="aw-code">fopen</code> reporting whether <code className="aw-code">fp</code> is NULL. If it is, stop here and work through <em>fopen returned NULL</em> instead.</>,
      <>Put a second <code className="aw-code">printf</code> inside the read loop, before anything else in the body. If it never prints, the loop never entered: the condition was false on the first test, usually because the stream was already at end-of-file or because the read failed straight away.</>,
      <>If the program writes rather than reads, check that <code className="aw-code">fclose(fp)</code> is present and is <em>reached</em>. Output is held in a buffer and reaches the disk when the buffer fills, when the file is closed, or when the program exits normally. It is the program that does not get that far — one that crashes, or loops forever, or returns early from an error branch — that leaves the file empty even though every <code className="aw-code">fprintf</code> succeeded.</>,
      <>Open the file yourself, in a text editor, after the run. Seeing what is on disk separates "it never wrote" from "it wrote, and the reading is what is wrong".</>
    ]
  },
  {
    id: 4,
    returnTo: { stage: 2, step: 4 },
    title: "The file is empty, or my data has vanished",
    cause:
      "Two different faults produce an empty file, and they look identical from outside. Mode \"w\" truncates the file to zero length the moment it is opened, before a single character is written, so re-running a write program destroys whatever the previous run produced. Separately, everything you write goes first into a buffer in memory. Returning normally from main flushes that buffer for you, so a missing fclose alone usually does no harm — but a program that crashes, hangs or is stopped before it gets there loses whatever the buffer was holding, and the file stays empty even though every write succeeded.",
    steps: [
      <>Look at the mode letter. <code className="aw-code">fopen(name, "w")</code> empties an existing file at the point of opening. If you meant to add to what is there, the mode is <code className="aw-code">"a"</code>.</>,
      <>Ask whether the file was empty before your program ran or after. Run the program once, look at the file, then run it a second time and look again. If a second run empties it, truncation by <code className="aw-code">"w"</code> is the cause.</>,
      <>Confirm that <code className="aw-code">fclose(fp)</code> is reached on every path out of the function, including the early <code className="aw-code">return</code> you may have added for an error. A missing <code className="aw-code">fclose</code> is the other cause, but only when the program fails to end normally — check for a crash, an infinite loop, or an early <code className="aw-code">return</code> before the writing is done.</>,
      <>Understand why the two look alike. Writing does not go straight to disk: it goes to a buffer, and the buffer is written when it fills, when the stream is closed, or when the program exits normally. Truncation happens immediately, buffering delays the writing, and between them the file can be empty at almost any moment you choose to look at it.</>,
      <>If you need to see output on disk before the program ends — while debugging a long loop, for instance — call <code className="aw-code">fflush(fp)</code>. It writes the buffer out without closing the stream.</>,
      <>Keep one irreplaceable copy of any data file outside the folder your program writes into. A truncating program is a fast way to lose the sample data you spent the lab session typing.</>
    ]
  },
  {
    id: 5,
    returnTo: { stage: 3, step: 3 },
    title: "The read loop runs one time too many",
    cause:
      "The last record appears twice, or a line of rubbish follows the real output. This is the signature of looping on feof. The end-of-file flag is not a look-ahead: it is set only after a read has already been attempted and failed. So the loop tests the flag, finds it clear, enters the body and reads — and on the final pass that read fails, leaving the previous values still in your variables, which the body then processes for a second time.",
    steps: [
      <>Look for <code className="aw-code">while (!feof(fp))</code>. If it is there, this is your fault, however sensible it reads in English.</>,
      <>Trace the final pass by hand. The last successful read consumes the last record; the flag is still clear, so the loop runs once more; that read fails; the variables still hold the previous record; the body prints it again.</>,
      <>Replace the condition with the result of the read itself. Instead of <code className="aw-code">while (!feof(fp)) &#123; fgets(line, 100, fp); … &#125;</code> write <code className="aw-code">while (fgets(line, 100, fp) != NULL) &#123; … &#125;</code>.</>,
      <>Use the same shape with the other read functions. <code className="aw-code">while ((c = fgetc(fp)) != EOF)</code> for a character at a time, with <code className="aw-code">c</code> declared <code className="aw-code">int</code>; <code className="aw-code">while (fscanf(fp, "%i", &amp;n) == 1)</code> for a value at a time.</>,
      <>Keep <code className="aw-code">feof</code> for what it is actually good for: asking, after a loop has ended, whether it ended because the file ran out or because something failed. <code className="aw-code">ferror(fp)</code> answers the second half of that question.</>
    ]
  },
  {
    id: 6,
    returnTo: { stage: 3, step: 5 },
    title: "fscanf stopped in the middle of a line, or read nothing",
    cause:
      "fscanf reads by conversion, not by line, and it leaves the stream wherever the last conversion stopped. A %s stops at the first whitespace and does not consume it, so the rest of the line, including the newline, is still waiting for the next call. A %i that meets a character which cannot begin a number consumes nothing at all and stops immediately, and because it returns a count of successful conversions rather than crashing, an unchecked return value hides the whole event.",
    steps: [
      <>Check the return value of every <code className="aw-code">fscanf</code>. It returns how many conversions succeeded, so <code className="aw-code">if (fscanf(fp, "%s %i", name, &amp;qty) != 2)</code> is the only way to learn that one of them did not.</>,
      <>Remember that <code className="aw-code">%s</code> reads one whitespace-delimited word. Reading <code className="aw-code">Toyota Vios</code> with a single <code className="aw-code">%s</code> gives you <code className="aw-code">Toyota</code> and leaves <code className="aw-code">Vios</code> for the next call, which is rarely what the next call expects.</>,
      <>When a conversion fails, understand that the offending characters are still in the stream. The next call meets the same characters and fails in the same way, which is why one bad line can turn into an endless loop of failures rather than one error.</>,
      <>Print what you read immediately after reading it, before using it. Seeing <code className="aw-code">Toyota</code> where you expected <code className="aw-code">Toyota Vios</code> identifies the fault in one run.</>,
      <>Read a whole line with <code className="aw-code">fgets</code> and then pick it apart with <code className="aw-code">sscanf</code>. The stream then advances exactly one line per read whatever the line contains, and a malformed line costs you that line rather than the rest of the file.</>,
      <>This is the reason the handout stops using bare <code className="aw-code">fscanf</code> after this stage. Real data files are delimited — the fields in <code className="aw-code">cars.csv</code> are separated by commas and contain spaces — and whitespace-delimited conversion cannot describe them. Stage 4 reads a line at a time and splits on the delimiter instead.</>
    ]
  }
];

export const resolutionById = Object.fromEntries(resolutions.map((r) => [r.id, r]));
