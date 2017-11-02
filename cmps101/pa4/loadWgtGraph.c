//
// Created by CIJhn on 12/7/2016.
//

#include "loadWgtGraph.h"
#include "edge.h"

EdgeVec *load(FILE *inbuf, int *n, int *m, unsigned char undirect) {
    int num = 0;
    char linebuf[1024];
    char *line;
    line = fgets(linebuf, 1024, inbuf);
    int edgeSize = edge_parse_size(line);
    *n = edgeSize;
    EdgeVec *vertices = malloc(sizeof(EdgeVec) * (edgeSize + 1));
    int i = 1;
    for (i; i <= edgeSize; i++) vertices[i] = edgeMakeEmptyVec();

    line = fgets(linebuf, 1024, inbuf);
    while (line == linebuf) {
        Edge e = edge_parse(line);

        //from
        EdgeVec edgeVec = vertices[edge_from(e)];
        EdgeInfo info = {edge_to(e), edge_weight(e)};
        edgeVecPush(edgeVec, info);
        vertices[edge_from(e)] = edgeVec;

        //to
        if (undirect) {
            edgeVec = vertices[edge_to(e)];
            EdgeInfo rev = {edge_from(e), edge_weight(e)};
            edgeVecPush(edgeVec, rev);
            vertices[edge_to(e)] = edgeVec;
        }

        num++;
        free(e);
        line = fgets(linebuf, 1024, inbuf);
    }
    *m = num;
    free(line);
    return vertices;
}
