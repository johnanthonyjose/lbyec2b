#include <stdio.h>

int main(void) {

    //A FILE pointer is the handle the program holds on to.
    //It does not contain the file. It refers to the file.
    FILE *fp;

    //"r" means read-only. fopen returns NULL if it fails,
    //most often because test.txt is not in the folder the
    //program was launched from. Run 02-write.c first.
    fp = fopen("test.txt", "r");

    //Never skip this check. A NULL fp used later is a crash.
    //perror prints our message plus the real reason from
    //the operating system, e.g. "No such file or directory".
    if (fp == NULL) {
        perror("Could not open test.txt");
        return 1;   //non-zero tells the shell the run failed
    }

    printf("test.txt opened for reading.\n");

    //Every successful fopen needs a matching fclose.
    fclose(fp);

    return 0;
}
