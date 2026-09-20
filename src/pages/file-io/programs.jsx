import React from "react";

/* The sample programs, in one place.

   The readiness panel offers them as downloads and the reference section lists
   them as an index, and those two lists drifting apart is exactly the failure
   the original document shipped with: it named files01 through files06, and
   six of them were links to a host that stopped answering, with no code on the
   page at all. One list, used twice.

   Every program here was authored for this handout and verified: it compiles
   under clang -std=c11 -Wall -Wextra -pedantic at zero warnings, every fopen
   is checked for NULL, and every output quoted anywhere on the page is its
   real stdout. The originals are not recoverable — workshopj.com resolves but
   no longer responds. */

export const ASSETS = "assets/file-io";   // relative: vite sets base to "./"

export const programs = [
  { file: "01-open.c", stage: 2,
    note: "Opens a file, and fails out loud when it cannot" },
  { file: "02-write.c", stage: 3,
    note: "Writes the first two lines of test.txt" },
  { file: "03-append.c", stage: 3,
    note: "Adds a third line without destroying the first two" },
  { file: "04-readchar.c", stage: 4,
    note: "Reads one character at a time" },
  { file: "05-readascii.c", stage: 4,
    note: "The same, printed as the numbers actually stored" },
  { file: "06-readline.c", stage: 4,
    note: "Reads one line at a time" },
  { file: "07-fields.c", stage: 5,
    note: "One record over four lines, printed as a table" },
  { file: "08-csv.c", stage: 5,
    note: "The same table, read from a comma-delimited file" },
  { file: "09-modular.c", stage: 5,
    note: "07-fields.c with the reading moved into functions" },
  { file: "10-twofiles.c", stage: 2,
    note: "An input and an output open at the same time" }
];

export const dataFiles = [
  { file: "cars.txt", note: "Data: one field per line" },
  { file: "cars.csv", note: "Data: the same records, comma-delimited" }
];

/* Written by the reader in stage 3, which is why it is not offered as a
   download anywhere. Stage 4 then reads back the bytes they wrote. */
export const TEST_TXT_IS_WRITTEN_NOT_DOWNLOADED = true;
