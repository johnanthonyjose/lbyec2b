#include <stdio.h>
#include <string.h>

int main(void) {

    FILE *fp;

    //One whole line has to fit here, including the \n and the
    //closing \0. fgets never writes past this size, which is
    //why it replaced gets(), a function C11 removed outright.
    char line[100];

    fp = fopen("test.txt", "r");

    if (fp == NULL) {
        perror("Could not open test.txt");
        return 1;
    }

    //fgets stops at the \n and KEEPS it in the buffer, so the
    //length below counts it. It returns NULL when there is no
    //line left, which is what ends the loop.
    while (fgets(line, 100, fp) != NULL) {
        printf("[%i] %s", (int) strlen(line), line);
    }

    //The final line of test.txt has no \n of its own, so add
    //one here to leave the terminal on a fresh line.
    printf("\n");

    fclose(fp);

    return 0;
}
