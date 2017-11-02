//
// Created by CIJhn on 11/3/2016.
//

#ifndef SCC03_ELEMENTSHANDLER_H
#define SCC03_ELEMENTSHANDLER_H

#include "edge.h"

typedef void *Graph;

typedef Graph(*build_edges)(int size);

typedef void (*_add_edge)(Edge e, Graph graph, unsigned char undirected);

typedef char *(*_graph_to_string)(Graph graph, int index);

typedef Graph(*_graph_transpose)(Graph graph, int size, unsigned char undirected);

typedef struct graph_handler {
    build_edges build;
    _add_edge add;
    _graph_to_string to_string;
    _graph_transpose transpose;
} GraphHandler;

#endif //SCC03_ELEMENTSHANDLER_H
