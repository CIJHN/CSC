//
// Created by CIJhn on 11/3/2016.
//

#include <stdlib.h>
#include "vecHandler.h"
#include "intVec.h"
#include <stdio.h>

Graph vec_build_elements(int size) {
    IntVec *vertices = malloc(sizeof(IntVec) * (size + 1));
    int i = 1;
    for (i; i <= size; i++) vertices[i] = NULL;
    return vertices;
}

void vec_add_edge(Edge e, Graph elements) {
    IntVec *vertices = (IntVec *) elements;
    IntVec vec = vertices[edge_from(e)] == NULL ? intMakeEmptyVec() : vertices[edge_from(e)];
    intVecPush(vec, edge_to(e));
    vertices[edge_from(e)] = vec;
}

char *vec_to_string(Graph elements, int idx) {
    IntVec vec = ((IntVec *) elements)[idx];
    char *c = malloc(sizeof(char) * 16);
    if (vec == NULL)
        c = "[]\n";
    else if (intSize(vec) == 3) {
        sprintf(c, "[%d %d %d]\n", intData(vec, 2), intData(vec, 1), intData(vec, 0));
    } else if (intSize(vec) == 2) {
        sprintf(c, "[%d %d]\n", intData(vec, 1), intData(vec, 0));
    } else
        sprintf(c, "[%d]\n", intData(vec, 0));
    return c;
}

Graph vec_transpose(Graph graph, int size) {
    IntVec *vertices = (IntVec *) graph;
    IntVec *newVertices = (IntVec *) vec_build_elements(size);
    for (int from = 1; from <= size; ++from) {
        IntVec vec = vertices[from];
        if (vec != NULL)
            for (int j = 0; j < intSize(vec); ++j) {
                int to = intData(vec, j);
                vec_add_edge(edge_create(to, from), newVertices);
            }
    }
    return newVertices;
}

GraphHandler vec_create_element_handler() {
    GraphHandler result = {vec_build_elements, vec_add_edge, vec_to_string, vec_transpose};
    return result;
}
