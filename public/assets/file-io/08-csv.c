#include <stdio.h>

//Reads one data item from fp into out, stopping at the next
//comma, at the end of the line or at the end of the file.
//
//The comma and the \n are consumed but never stored, so the
//caller receives the item on its own, already terminated.
//
//Returns the number of characters stored, or -1 when the file
//had nothing left at all. That -1 is the only reliable signal
//that the records have run out, because a real item can be
//empty and so can legitimately have a length of 0.
int getDelimitedItem(FILE *fp, char *out, int size) {

    int c;
    int n = 0;      //characters stored so far

    //int, not char: fgetc must be able to return EOF as well as
    //all 256 byte values, and char has no room for both.
    c = fgetc(fp);

    if (c == EOF) {
        out[0] = '\0';
        return -1;
    }

    while (c != EOF && c != ',' && c != '\n') {

        //A file saved on Windows ends its lines with \r\n. The
        //\r is dropped here so the last item on a line does not
        //come back with an invisible character glued to it.
        if (c != '\r') {

            //size - 1 leaves room for the \0. Anything longer
            //than the buffer is read past but not stored, so
            //the item is truncated instead of corrupting memory.
            if (n < size - 1) {
                out[n] = (char) c;
                n = n + 1;
            }
        }

        c = fgetc(fp);
    }

    //Every C string has to be closed off by hand.
    out[n] = '\0';

    return n;
}

int main(void) {

    FILE *fp;
    char make[40], model[40], year[40], plate[40];
    char header[120];
    int n;      //length of the first item of the record
    int y;

    fp = fopen("cars.csv", "r");

    if (fp == NULL) {
        perror("Could not open cars.csv");
        return 1;
    }

    //The first line names the columns. It is read and discarded
    //so the loop below only ever sees real cars.
    if (fgets(header, 120, fp) == NULL) {
        printf("cars.csv is empty.\n");
        fclose(fp);
        return 1;
    }

    printf("%-12s %-16s %6s %-10s\n",
           "MAKE", "MODEL", "YEAR", "PLATE");

    //One pass of this loop is one car. The first call decides
    //whether there is a record at all; the other three then
    //complete it. A file that ends with a newline and one that
    //ends without a newline both stop here in the same way.
    while ((n = getDelimitedItem(fp, make, 40)) >= 0) {

        //A file often ends with one more \n than it needs. That
        //spare line arrives here as an item of length 0. It is
        //not a car, so the loop goes round and reads again.
        if (n == 0) {
            continue;
        }

        getDelimitedItem(fp, model, 40);
        getDelimitedItem(fp, year, 40);
        getDelimitedItem(fp, plate, 40);

        //Everything read from a text file arrives as characters.
        //sscanf reads a number out of a string the way scanf
        //reads one from the keyboard. It returns how many items
        //it converted, so 1 here means the year really was
        //numeric. Checking that is what stops a typo in the file
        //from printing an undefined value.
        if (sscanf(year, "%i", &y) != 1) {
            printf("Skipping %s %s: year '%s' is not a number\n",
                   make, model, year);
            continue;
        }

        printf("%-12s %-16s %6i %-10s\n",
               make, model, y, plate);
    }

    fclose(fp);

    return 0;
}
