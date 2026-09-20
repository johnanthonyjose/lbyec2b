#include <stdio.h>

int main(void) {

    FILE *fp;
    int c;

    fp = fopen("test.txt", "r");

    if (fp == NULL) {
        perror("Could not open test.txt");
        return 1;
    }

    //Same loop as 04-readchar.c. The only change is %i instead
    //of %c, so each character is shown as the number actually
    //stored on disk. 104 is 'h', 101 is 'e', and so on.
    while ((c = fgetc(fp)) != EOF) {
        printf("%i ", c);

        //10 is the line terminator. It is one ordinary character
        //in the file, not a gap between lines. Breaking the
        //display here lines the numbers up with the text lines.
        if (c == '\n') {
            printf("\n");
        }
    }

    //EOF is not a character in the file. It is the signal fgetc
    //returns once there is nothing left. On this system its
    //value is -1, which is why c has to be an int.
    printf("%i\n", EOF);

    fclose(fp);

    return 0;
}
