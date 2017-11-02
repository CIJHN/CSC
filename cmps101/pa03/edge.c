//
// Created by CIJhn on 10/20/2016.
//
#include <stdlib.h>
#include <stdio.h>
#include <string.h>
#include "edge.h"

struct edge {
    int from, to;
    double weight;
};

Edge edge_empty(void) {
    return (Edge) calloc(1, sizeof(struct edge));
}

Edge edge_copy(Edge oldE) {
    Edge graph_edge = edge_empty();
    mempcpy(graph_edge, oldE, sizeof(Edge));
    return graph_edge;
}

int edge_from(Edge edge) {
    return edge->from;
}

int edge_to(Edge edge) {
    return edge->to;
}

double edge_weight(Edge edge) {
    return edge->weight;
}

Edge edge_parse(char *line) {
    Edge newE = edge_empty();
    int count = sscanf(line, "%d %d %lf", &(newE->from), &(newE->to), &(newE->weight));

    if (count < 2 || count > 3) {
        printf("Bad edge: %s", line);
        exit(1);
    }
    if (count == 2) newE->weight = 0.0;
    return newE;
}


int edge_parse_size(char *line) {
    int i;
    if (sscanf(line, "%d\n", &i) != 1) {
        printf("Bad line 1: %s", line);
        exit(1);
    }
    return atoi(line);
}

Edge edge_create(int from, int to) {
    Edge e = edge_empty();
    e->from = from;
    e->to = to;
    return e;
}

Edge edge_create_with_weight(int from, int to, double weight) {
    Edge e = edge_create(from, to);
    e->weight = weight;
    return e;
}
