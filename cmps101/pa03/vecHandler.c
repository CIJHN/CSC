//
// Created by CIJhn on 11/3/2016.
//

#include <stdlib.h>
#include "vecHandler.h"
#include "intVec.h"
#include <stdio.h>
#include <string.h>

Graph vec_build_elements(int size) {
    IntVec *vertices = malloc(sizeof(IntVec) * (size + 1));
    int i = 1;
    for (i; i <= size; i++) vertices[i] = NULL;
    return vertices;
}

void vec_add_edge(Edge e, Graph elements, unsigned char undirected) {
    IntVec *vertices = (IntVec *) elements;
    IntVec vec = vertices[edge_from(e)] == NULL ? intMakeEmptyVec() : vertices[edge_from(e)];
    intVecPush(vec, edge_to(e));
    vertices[edge_from(e)] = vec;
    if (undirected) {
        vec = vertices[edge_to(e)] == NULL ? intMakeEmptyVec() : vertices[edge_to(e)];
        intVecPush(vec, edge_from(e));
        vertices[edge_to(e)] = vec;
    }
}

char *vec_to_string(Graph elements, int idx) {
    IntVec vec = ((IntVec *) elements)[idx];
    char *c = malloc(sizeof(char) * 16);
    if (vec == NULL) {
        strcpy(c, "[]\n");
    } else {
        int i = 0;
        int size = intSize(vec);
        char *blank = " ";
        strcpy(c, "[");

        for (i; i < size - 1; ++i) {
            char src[8];
            sprintf(src, "%d", intData(vec, i));
            strcat(c, src);
            strcat(c, blank);
        }
        char src[8];
        sprintf(src, "%d", intData(vec, i));
        strcat(c, src);
        strcat(c, "]\n");
    }
    return c;
}

Graph vec_transpose(Graph graph, int size, unsigned char undirected) {
    IntVec *vertices = (IntVec *) graph;
    IntVec *newVertices = (IntVec *) vec_build_elements(size);
    for (int from = 1; from <= size; ++from) {
        IntVec vec = vertices[from];
        if (vec != NULL)
            for (int j = 0; j < intSize(vec); ++j) {
                int to = intData(vec, j);
                vec_add_edge(edge_create(to, from), newVertices, undirected);
            }
    }
    return newVertices;
}

GraphHandler vec_create_element_handler() {
    GraphHandler result;
    result.build = vec_build_elements;
    result.add = vec_add_edge;
    result.to_string = vec_to_string;
    result.transpose = vec_transpose;
    return result;
}
