#include <stdio.h>
#include <stdlib.h>
#include "intList.h"
#include "edge.h"
#include "intVec.h"
#include <string.h>

IntList *load_intList(FILE *inbuf, int *n, int *m) {
    int num = 0;
    char linebuf[1024];
    char *line;
    line = fgets(linebuf, 1024, inbuf);

    int edgeSize = edge_parse_size(line);
    *n = edgeSize;
    IntList *vertices = malloc(sizeof(IntList) * (edgeSize + 1));
    int i = 1;
    for (i; i <= edgeSize; i++) vertices[i] = intNil;

    line = fgets(linebuf, 1024, inbuf);
    while (line == linebuf) {
        Edge e = edge_parse(line);
        if (edge_weight(e) != 0)
            vertices[edge_from(e)] = intCons((int) edge_weight(e), intCons(edge_to(e), vertices[edge_from(e)]));
        else
            vertices[edge_from(e)] = intCons(edge_to(e), vertices[edge_from(e)]);
        num++;
        free(e);
        line = fgets(linebuf, 1024, inbuf);
    }
    *m = num;

    free(line);
    return vertices;
}

IntVec *load_intVec(FILE *inbuf, int *n, int *m) {
    int num = 0;
    char linebuf[1024];
    char *line;
    line = fgets(linebuf, 1024, inbuf);

    int edgeSize = edge_parse_size(line);
    *n = edgeSize;
    IntVec *vertices = malloc(sizeof(IntVec) * (edgeSize + 1));
    int i = 1;
    for (i; i <= edgeSize; i++) vertices[i] = NULL;

    line = fgets(linebuf, 1024, inbuf);
    while (line == linebuf) {
        Edge e = edge_parse(line);
        IntVec vec = vertices[edge_from(e)] == NULL ? intMakeEmptyVec() : vertices[edge_from(e)];
        intVecPush(vec, edge_to(e));
        vertices[edge_from(e)] = vec;
        num++;
        free(e);
        line = fgets(linebuf, 1024, inbuf);
    }
    *m = num;

    free(line);
    return vertices;
}

char *to_string_list(IntList lst) {
    char *c = malloc(sizeof(char) * 16);
    if (lst == intNil)
        c = "null\n";
    else if (intRest(lst))
        if (intRest(intRest(lst)))
            sprintf(c, "[%d %d %d]\n", intFirst(lst), intFirst(intRest(lst)), intFirst(intRest(intRest(lst))));
        else
            sprintf(c, "[%d %d]\n", intFirst(lst), intFirst(intRest(lst)));
    else sprintf(c, "[%d]\n", intFirst(lst));
    return c;
}

char *to_string_vec(IntVec vec) {
    char *c = malloc(sizeof(char) * 16);
    if (vec == NULL)
        c = "null\n";
    else if (intSize(vec) == 3) {
        sprintf(c, "[%d %d %d]\n", intData(vec, 2), intData(vec, 1), intData(vec, 0));
    } else if (intSize(vec) == 2) {
        sprintf(c, "[%d %d]\n", intData(vec, 1), intData(vec, 0));
    } else
        sprintf(c, "[%d]\n", intData(vec, 0));
    return c;
}

int main(int argc, char **argv) {
    int m, n;

    if (argc != 3) {
        printf("Usage: ./graph02 input.data -[V/L]\n");
        return 0;
    }

    char *infile = argv[1];
    char *flag = argv[2];

    FILE *fileP = fopen(infile, "r");

    if (fileP == NULL) {
        printf("There are no file named %s!\n", infile);
        exit(1);
    }

    printf("Opened %s for input.\n", infile);

    if (strcmp(flag, "-V") == 0) {
        IntVec *vec = load_intVec(fileP, &n, &m);
        printf("n = %d\n", n);
        printf("m = %d\n", m);
        for (int i = 1; i <= n; i++)
            printf("%d \t %s", i, to_string_vec(vec[i]));
    } else if (strcmp(flag, "-L") == 0) {
        IntList *list = load_intList(fileP, &n, &m);
        printf("n = %d\n", n);
        printf("m = %d\n", m);
        for (int i = 1; i <= n; i++) {
            printf("%d \t %s", i, to_string_list(list[i]));
        }

    } else {
        printf("unknown flag %s!\n", flag);
        exit(1);
    }

    fclose(fileP);
    return 0;
}
