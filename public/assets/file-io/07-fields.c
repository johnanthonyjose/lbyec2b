#include <stdio.h>
#include <string.h>

//fgets keeps the \n it stopped at. Left in place it would print
//a stray line break in the middle of a table row, so every line
//read from the file is passed through here first.
void stripNewline(char *s) {
    int n = (int) strlen(s);
    if (n > 0 && s[n - 1] == '\n') {
        s[n - 1] = '\0';
    }
}

int main(void) {

    FILE *fp;

    //One car is four consecutive lines. The end-of-line
    //character is doing the work of a delimiter: it is what
    //tells the program where one data item stops.
    char make[40], model[40], year[40], plate[40];

    fp = fopen("cars.txt", "r");

    if (fp == NULL) {
        perror("Could not open cars.txt");
        return 1;
    }

    printf("%-12s %-16s %-6s %-10s\n",
           "MAKE", "MODEL", "YEAR", "PLATE");

    //The condition reads all four lines of one record. C stops
    //at the first fgets that returns NULL, so a file that ends
    //mid-record simply ends the loop instead of printing junk.
    while (fgets(make,  40, fp) != NULL &&
           fgets(model, 40, fp) != NULL &&
           fgets(year,  40, fp) != NULL &&
           fgets(plate, 40, fp) != NULL) {

        stripNewline(make);
        stripNewline(model);
        stripNewline(year);
        stripNewline(plate);

        //The year is still text here. Printed as %-6s it looks
        //right, but it could not be compared or averaged.
        //08-csv.c converts it to a number with sscanf.
        printf("%-12s %-16s %-6s %-10s\n",
               make, model, year, plate);
    }

    fclose(fp);

    return 0;
}
