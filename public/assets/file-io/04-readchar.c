#include <stdio.h>

int main(void) {

    FILE *fp;

    //c MUST be an int, never a char. fgetc returns every one of
    //the 256 possible byte values plus a 257th value, EOF, which
    //is negative. A char has no room left for that extra value,
    //so a char loop either never ends or ends on real data.
    int c;

    fp = fopen("test.txt", "r");

    if (fp == NULL) {
        perror("Could not open test.txt");
        return 1;
    }

    //Each fgetc hands back the next single character and moves
    //the stream position forward by exactly one byte. The loop
    //stops when fgetc reports EOF instead of a character.
    while ((c = fgetc(fp)) != EOF) {
        putchar(c);
    }

    fclose(fp);

    return 0;
}
