#include <stdio.h>

int main(void) {

    FILE *fp;

    //"a" is append. The write position starts at the END of the
    //existing file, so nothing already stored is lost. Compare
    //with "w" in 02-write.c, which would empty the file first.
    fp = fopen("test.txt", "a");

    if (fp == NULL) {
        perror("Could not open test.txt for appending");
        return 1;
    }

    //02-write.c left the file ending in '?' with no line break.
    //This leading \n therefore finishes line 2 before line 3
    //begins. Without it the two lines would run together.
    fputs("\nHow about no. 3?", fp);

    fclose(fp);

    printf("Appended a third line to test.txt.\n");

    return 0;
}
