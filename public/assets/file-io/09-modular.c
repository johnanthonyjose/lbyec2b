#include <stdio.h>
#include <string.h>

//Reads one line and removes the newline fgets leaves on it.
//Returns 1 if a line was read, 0 at the end of the file.
int readField(FILE *fp, char *out, int size) {

    if (fgets(out, size, fp) == NULL) {
        return 0;               //nothing left to read
    }

    int n = (int) strlen(out);
    if (n > 0 && out[n - 1] == '\n') {
        out[n - 1] = '\0';
    }

    return 1;
}

//Reads the four lines that make up one car.
//Returns 1 only if ALL four were there, so a file that ends
//half way through a record does not produce a half car.
int readCar(FILE *fp, char *make, char *model,
            char *year, char *plate) {

    if (!readField(fp, make, 40))  return 0;
    if (!readField(fp, model, 40)) return 0;
    if (!readField(fp, year, 40))  return 0;
    if (!readField(fp, plate, 40)) return 0;

    return 1;
}

int main(void) {

    FILE *fp;
    char make[40], model[40], year[40], plate[40];

    fp = fopen("cars.txt", "r");

    if (fp == NULL) {
        perror("Could not open cars.txt");
        return 1;
    }

    printf("%-12s %-16s %-6s %-10s\n",
           "MAKE", "MODEL", "YEAR", "PLATE");

    //main now says WHAT happens, once per car. How a record is
    //read is readCar's business, and how a field is read is
    //readField's. Each can be fixed without touching the others.
    while (readCar(fp, make, model, year, plate)) {
        printf("%-12s %-16s %-6s %-10s\n",
               make, model, year, plate);
    }

    fclose(fp);

    return 0;
}
