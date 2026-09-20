#include <stdio.h>
#include <string.h>

//A program usually has an input and an output, and they are
//two different files open at the same time. Each one needs
//its own FILE pointer. Nothing is shared between them.
int main(void) {

    FILE *fpIn, *fpOut;
    char line[120];
    int cars = 0;

    //Open the input for reading and the output for writing.
    //Check BOTH. Either can fail on its own.
    fpIn = fopen("cars.txt", "r");

    if (fpIn == NULL) {
        perror("Could not open cars.txt for reading");
        return 1;
    }

    fpOut = fopen("plates.txt", "w");

    if (fpOut == NULL) {
        perror("Could not open plates.txt for writing");
        fclose(fpIn);           //the input is open; close it
        return 1;
    }

    //Every fourth line of cars.txt is a plate number.
    while (fgets(line, 120, fpIn) != NULL) {

        int n = (int) strlen(line);
        if (n > 0 && line[n - 1] == '\n') {
            line[n - 1] = '\0';
        }

        cars = cars + 1;

        if (cars % 4 == 0) {
            fprintf(fpOut, "%s\n", line);
        }
    }

    //Two files open means two files to close.
    fclose(fpIn);
    fclose(fpOut);

    printf("Wrote %i plates to plates.txt\n", cars / 4);

    return 0;
}
