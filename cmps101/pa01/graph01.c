#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include "intList.h"
#include "edge.h"


static inline IntList *init_edges(int size) {
    IntList *vertices = malloc(sizeof(IntList) * (size + 1));
    int i = 1;
    for (i; i <= size; i++) vertices[i] = intNil;
    return vertices;
}


static inline IntList *load_to_IntList(FILE *inbuf, int *numberP, int *m) {
    int num = 0;
    char linebuf[1024];
    char *line = fgets(linebuf, 1024, inbuf);
    int edgeCount = edge_parse_size(line);
    *numberP = edgeCount;
    IntList *adjVertices = init_edges(edgeCount);
    line = fgets(linebuf, 1024, inbuf);
    while (line == linebuf) {
        Edge e = edge_parse(line);
        adjVertices[edge_from(e)] = intCons(edge_to(e), adjVertices[edge_from(e)]);
        num++;
        free(e);
        line = fgets(linebuf, 1024, inbuf);
    }
    *m = num;
    free(line);
    return adjVertices;
}

static inline char *intList_toString(IntList lst) {
    char *c = malloc(sizeof(char) * 128);
    if (lst == intNil)
        strcpy(c, "[]\n");
    else {
        strcpy(c, "[");
        do {
            char src[8];
            sprintf(src, "%d", intFirst(lst));
            strcat(c, src);
            if (intRest(lst) != intNil) {
                char *blank = " ";
                strcat(c, blank);
                lst = intRest(lst);
            }
            else break;
        } while (1);
        strcat(c, "]\n");
    }
    return c;
}

int main(int argc, char **argv) {
    int m, n;

    if (argc == 1) {
        printf("Usage: ./graph01 input.data\n");
        return 0;
    }
    char *infile = argv[1];

    FILE *fileP = fopen(infile, "r");
    if (fileP == NULL) {
        printf("Cannot found the file named [%s]!\n", infile);
        exit(1);
    }
    printf("Opened %s for input.\n", infile);

    IntList *adjVertices = load_to_IntList(fileP, &n, &m);
    fclose(fileP);
    printf("n = %d\n", n);
    printf("m = %d\n", m);


    for (int i = 1; i <= n; i++) {
        char *buff = intList_toString(adjVertices[i]);
        printf("%d \t %s", i, buff);
        free(buff);
    }
    return 0;
}

