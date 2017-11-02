//
// Created by CIJhn on 11/3/2016.
//

#include <stdlib.h>
#include <string.h>
#include "listHandler.h"
#include "intList.h"
#include "stdio.h"

struct _list_graph {
    IntList *_lst;
    int _size;
    unsigned char _undir;
};

struct _list_itr {//using a wrapper since this struct will be delete after used
    IntList _cur;
};

static inline IntList *list_build_elements(int size) {
    IntList *vertices = malloc(sizeof(IntList) * (size + 1));
    int i = 1;
    for (i; i <= size; i++) vertices[i] = intNil;
    return vertices;
}

static inline unsigned char _list_nonexist(IntList lst, int to) {
    if (lst == intNil) return 1;
    while (intRest(lst) != intNil) {
        if (intFirst(lst) == to)
            return 0;
        lst = intRest(lst);
    }
    return 1;
}

Graph _list_construct(int size, unsigned char undirected) {
    struct _list_graph *graph = malloc(sizeof(struct _list_graph));
    graph->_size = size;
    graph->_undir = undirected;
    graph->_lst = list_build_elements(size);
    return graph;
}


int _list_g_size(Graph self) {
    struct _list_graph *graph = self;
    return graph->_size;
}

unsigned char _list_und(Graph self) {
    struct _list_graph *graph = self;
    return graph->_undir;
}

void list_add_edge(Graph self, Edge e) {
    struct _list_graph *graph = self;
    IntList *vertices = graph->_lst;
    int from = edge_from(e), to = edge_to(e);
    if (graph->_undir) {
        if (_list_nonexist(vertices[from], to))
            vertices[from] = intCons(to, vertices[from]);
        if (_list_nonexist(vertices[to], from))
            vertices[to] = intCons(from, vertices[to]);
    } else
        vertices[from] = intCons(to, vertices[from]);
}

char *list_to_string(Graph self) {
    struct _list_graph *graph = self;
    int idx = 1;
    int checkSum = 0;
    for (idx; idx < graph->_size + 1; ++idx) {
        IntList lst = graph->_lst[idx];
        if (lst == intNil) {
            checkSum += 10;
        } else {
            int count = 0;
            while (intRest(lst) != intNil) {
                ++count;
                lst = intRest(lst);
            }
            checkSum += (count * 2 + 10);
        }
    }
    char *c = calloc(checkSum, sizeof(char));
    idx = 1;
    for (idx; idx < graph->_size + 1; ++idx) {
        IntList lst = graph->_lst[idx];
        if (lst == intNil) {
            sprintf(c, "%s%d\t%s", c, idx, "[]\n");
        } else {
            sprintf(c, "%s%d\t%s", c, idx, "[");
            while (1) {
                if (intRest(lst) == intNil) {
                    sprintf(c, "%s%d]\n", c, intFirst(lst));
                    break;
                } else
                    sprintf(c, "%s%d ", c, intFirst(lst));
                lst = intRest(lst);
            }
        }
    }
    return c;
}

Graph _list_tranp(Graph self) {
    struct _list_graph *graph = self;

    IntList *list = graph->_lst;
    Graph newGraph = _list_construct(graph->_size, graph->_undir);

    if (graph->_undir) {
        struct _list_graph *g = newGraph;
        int i = 1;
        for (i; i <= graph->_size; ++i) {
            g->_lst[i] = list[i];//since the list is immutable(no manipulate func),
            //I don't need to make a deep copy -- just copy the pointer
        }

        return newGraph;
    }

    for (int from = 1; from <= graph->_size; ++from) {
        IntList lst = list[from];
        if (lst != NULL) {
            do {
                int to = intFirst(lst);
                list_add_edge(newGraph, edge_create(to, from));
                lst = intRest(lst);
                if (lst == intNil) break;
            } while (1);
        }
    }
    return newGraph;
}

VertexIterator _list_get_vertex_itr(Graph self, int idx) {
    struct _list_graph *graph = self;
    if (idx >= graph->_size + 1) {
        printf("get iterator function excess the graph size! size[%d], required[%d]", graph->_size, idx);
        return NULL;
    }
    struct _list_itr *itr = malloc(sizeof(struct _list_itr));
    itr->_cur = graph->_lst[idx];
    if (itr->_cur == intNil)
        return NULL;
    return itr;
}

void _list_next_vertex(VertexIterator itrr) {
    struct _list_itr *itr = itrr;
    itr->_cur = intRest(itr->_cur);
}

int _list_current_vertex(VertexIterator itrr) {
    struct _list_itr *itr = itrr;
    return intFirst(itr->_cur);
}

unsigned char _list_has_next(VertexIterator itrr) {
    struct _list_itr *itr = itrr;
    if (intRest(itr->_cur) != intNil)
        return 1;
    return 0;
}

GraphHandler listGraphHandler() {
    GraphHandler handler = {_list_construct, _list_g_size, _list_und, list_add_edge, list_to_string,
                            _list_tranp, _list_get_vertex_itr,
                            _list_next_vertex,
                            _list_current_vertex, _list_has_next};
    return handler;
}
