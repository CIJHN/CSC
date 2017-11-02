//
// Created by CIJhn on 11/3/2016.
//

#ifndef SCC03_ELEMENTSHANDLER_H
#define SCC03_ELEMENTSHANDLER_H

#include "edge.h"

typedef enum graphType GraphType;
typedef struct graph Graph;

typedef Graph(*build_edges)(int size, GraphType type);

typedef void (*_add_edge)(Edge e, Graph graph);

typedef char *(*_graph_to_string)(Graph graph, int index);

typedef char *(*_graph_to_string)(Graph graph);

typedef Graph(*_graph_transpose)(Graph graph, int size);

enum graphType { directed, undirected };

struct graph {
    void *elements;
    int size;
    GraphType type;
};

typedef
struct graph_handler {
    const build_edges build;
    const _add_edge add;
    const _graph_to_string toString;
    const _graph_to_string to_string;
    const _graph_transpose transpose;

} GraphHandler;

#endif //SCC03_ELEMENTSHANDLER_H
