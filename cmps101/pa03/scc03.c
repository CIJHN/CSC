#include <stdio.h>
#include <stdlib.h>
#include "edge.h"
#include "intVec.h"
#include <string.h>

#include "graphHandler.h"
#include "vecHandler.h"

#include "dfsTrace1.h"
#include "listHandler.h"

void *load(FILE *inbuf, int *n, int *m, GraphHandler handler, unsigned char undirected) {
    int num = 0;
    char linebuf[1024];
    char *line;

    line = fgets(linebuf, 1024, inbuf);
    int edgeSize = edge_parse_size(line);
    *n = edgeSize;

    void *elements = handler.build(edgeSize + 1);
    line = fgets(linebuf, 1024, inbuf);
    while (line == linebuf) {
        Edge e = edge_parse(line);
        handler.add(e, elements, undirected);
        num++;
        free(e);
        line = fgets(linebuf, 1024, inbuf);
    }
    *m = num;
    free(line);
    return elements;
}

void print_graph(Graph graph, GraphHandler handler, int n, int m) {
    printf("n = %d\n", n);
    printf("m = %d\n", m);
    for (int i = 1; i <= n; i++)
        printf("%d \t %s", i, handler.to_string(graph, i));
    printf("\n");
}

void print_result(TraceResult r) {
    printf("V\tcolor\tdTimes\tfTimes\tparent\n");
    for (int i = 1; i <= dfs_size(r); ++i) {
        printf("%d\t%c\t%d\t%d\t%d\n", i, dfs_color(r, i), dfs_discover_time(r, i), dfs_finish_time(r, i),
               dfs_parent(r, i));
    }

}

void print_result_2(TraceResult r) {
    printf("V\tcolor\tdTimes\tfTimes\tparent\tdfstRoot2\n");
    for (int i = 1; i <= dfs_size(r); ++i) {
        printf("%d\t%c\t%d\t%d\t%d\t%d\n", i, dfs_color(r, i), dfs_discover_time(r, i), dfs_finish_time(r, i),
               dfs_parent(r, i), dfs_root(r, i));
    }
}

void findSCCs(IntVec *vertices, GraphHandler handler, int numberOfVertices, int m, unsigned char undirected) {
    printf("start to findSCC\n");
    TraceResult result = dfs_trace_phase_1(vertices, numberOfVertices);
    print_result(result);
    printf("FSTK:");
    for (int i = 1; i <= dfs_size(result); ++i)
        printf("\t%d", dfs_order(result, i));
    printf("\n");

    Graph transposed = handler.transpose(vertices, numberOfVertices,undirected);
    print_graph(transposed, handler, numberOfVertices, m);

    TraceResult result2 = def_trace_phase_2(transposed, result);

    print_result_2(result2);
}

typedef enum container_type {
    Vec, List, UNKNOWN
} ContainerType;

int main(int argc, char **argv) {
    int m, n;

    if (argc < 3 || argc > 4) {
        printf("Usage: ./scc03 input.data -[V/L]\n");
        return 0;
    }

    unsigned char undirected = 0;
    ContainerType containerType = UNKNOWN;

    char *infile = argv[argc - 1];

    FILE *fileP = fopen(infile, "r");

    if (fileP == NULL) {
        printf("There are no file named %s!\n", infile);
        exit(1);
    }

    printf("Opened %s for input.\n", infile);

    char *flag;
    int i;
    for (i = 1; i < argc - 1; ++i) {
        flag = argv[i];
        if (strcmp(flag, "-V") == 0) {
            if (containerType != UNKNOWN) {
                printf("duplicate flag %s!\n", flag);
                exit(1);
            } else containerType = Vec;
        } else if (strcmp(flag, "-L") == 0) {
            if (containerType != UNKNOWN) {
                printf("duplicate flag %s!\n", flag);
                exit(1);
            } else containerType = List;
        } else if (strcmp(flag, "-u")) {
            undirected = 1;
        }
    }
    GraphHandler handler;
    if (containerType == Vec) {
        handler = vec_create_element_handler();
    } else if (containerType == List) {
        handler = list_create_element_handler();
    } else {
        printf("unknown container type %s!\n", flag);
        exit(1);
    }

    Graph graph = load(fileP, &n, &m, handler, undirected);

    print_graph(graph, handler, n, m);

    IntVec *vec = (IntVec *) graph; //This is not generic since we don't need it now. I don't have much time to finish the operation for intList
    findSCCs(vec, handler, n, m, undirected);

    fclose(fileP);
    return 0;
}
