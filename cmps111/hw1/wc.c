#include <stdio.h>

int main(int argc, char** argv) {
    if (argc != 2) {
        printf("Usage: wc <filename>\n");
        return 0;
    }
    char* fileName = argv[1];
    FILE* file = fopen(fileName, "r");

    int cCount = 0, wCount = 0, lineCount = 0;
    char inblank = 1;
    char c;
    while ((c = fgetc(file)) != EOF) {
        ++cCount;
        switch (c) {
            case ' ':
            inblank = 1;
            break;
            case '\n':
            ++lineCount;
            break;
            default:
            if (inblank) {
                ++wCount;
                inblank = 0;
            }
            break;
        }
    }
    printf("%d %d %d\n", cCount, wCount, lineCount);
    fclose(file);
    return 0;
}