#include <stdio.h>

int main(void) {

    FILE *fp;

    //"w" creates test.txt if it is missing, and TRUNCATES it
    //to zero bytes if it already exists. Anything that was in
    //the file before this line is gone. Use "a" to keep it.
    fp = fopen("test.txt", "w");

    if (fp == NULL) {
        perror("Could not open test.txt for writing");
        return 1;
    }

    //fprintf is printf with a file as its first argument.
    //It is the one to use when a value has to be formatted.
    //The \n here is what makes this a complete first line.
    fprintf(fp, "hello no. %i\n", 1);

    //fputs writes a string exactly as given. Note the argument
    //order: the string first, the file second. It adds no \n
    //of its own, so the next write continues on the same line.
    fputs("where is no. 2", fp);

    //fputc writes one single character. Single quotes, not
    //double quotes: '?' is a character, "?" is a string.
    fputc('?', fp);

    //fclose flushes the write buffer to disk and releases the
    //file. A program that ends without it can lose the last
    //few characters it thought it had written.
    fclose(fp);

    printf("Wrote test.txt. Open it and look before going on.\n");

    return 0;
}
