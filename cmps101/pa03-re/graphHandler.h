//
// Created by CIJhn on 11/3/2016.
//

//this file contains some my own abstractions for the graph manipulations

#ifndef SCC03_ELEMENTSHANDLER_H
#define SCC03_ELEMENTSHANDLER_H

#include "edge.h"

typedef void *Graph;
typedef void *VertexIterator;

//graph abstraction typedefs

typedef Graph(*_graph_constructor)(int size, unsigned char undirected);

typedef int (*_graph_size)(Graph self);

typedef unsigned char (*_undirected_graph)(Graph self);

typedef void (*_add_edge)(Graph self, Edge e);

typedef char *(*_graph_to_string)(Graph self);

typedef Graph(*_graph_transpose)(Graph self);

typedef VertexIterator (*_get_vertex_itr)(Graph self, int id);

//vertex abstraction typedefs

typedef void (*_next_vertex)(VertexIterator self);

typedef int (*_current_vertex)(VertexIterator self);

typedef unsigned char (*_has_next)(VertexIterator self);

//abstract graph containing some information
typedef struct _graph_handler {
    //construct the graph(construct func)
    _graph_constructor constructor;

    //size of the graph(access func)
    _graph_size size;
    //return is this graph is undirected(access func)
    _undirected_graph isUndirectedGraph;
    //add edge to the graph(manipulation func)
    _add_edge addEdge;
    //convert graph to string(access func no side effect)
    _graph_to_string toString;
    //produce an new transposed graph(construct func)
    _graph_transpose transpose;

    //return the iterator of the vertex(access func)
    _get_vertex_itr getVertexIterator;
    //take one step to next point(manipulation func)
    _next_vertex next;
    //return current vertex id(access func)
    _current_vertex currentVertex;
    //return if this vertex has next(access func)
    _has_next hasNext;
} GraphHandler;

#endif //SCC03_ELEMENTSHANDLER_H
