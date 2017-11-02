//
// Created by CIJhn on 11/3/2016.
//

#include <stdlib.h>
#include "vecHandler.h"
#include "intVec.h"
#include <stdio.h>
#include <string.h>

struct _vec_graph {
    int _size;
    unsigned char _undirected;
    IntVec *vecs;
};

struct _vec_itr {
    int _cur;
    IntVec vec;
};

//build the graph data structure in IntVec
static inline IntVec *vec_build_elements(int size) {
    IntVec *vertices = malloc(sizeof(IntVec) * (size + 1));
    int i = 1;//start from 1
    for (i; i <= size; i++) vertices[i] = NULL;
    return vertices;
}

//detect duplicated edge for undirected graph
static inline unsigned char _vec_nonexist(IntVec vec, int target) {
    int i = 0;
    for (i; i < intSize(vec); ++i)
        if (intData(vec, i) == target) return 0;
    return 1;
}

//make sure the target vertex is not null in data structure
static inline void _vec_validate(IntVec *vertices, int vertex) {
    if (vertices[vertex] == NULL) vertices[vertex] = intMakeEmptyVec();
}

Graph _vec_build_graph(int size, unsigned char undir) {
    struct _vec_graph *result = malloc(sizeof(struct _vec_graph));
    result->_size = size;
    result->_undirected = undir;
    result->vecs = vec_build_elements(size);
    return result;
}

int _vec_size(Graph graph) {
    struct _vec_graph *g = graph;
    return g->_size;
}

unsigned char _vec_undir(Graph graph) {
    struct _vec_graph *g = graph;
    return g->_undirected;
}

void vec_add_edge(Graph self, Edge e) {
    struct _vec_graph *graph = self;
    IntVec *vertices = graph->vecs;
    int from = edge_from(e), to = edge_to(e);
    _vec_validate(vertices, from);
    if (graph->_undirected) {
        IntVec vec = vertices[from];
        if (_vec_nonexist(vec, to))//should add edge from->to?
            intVecPush(vec, to);

        _vec_validate(vertices, to);
        vec = vertices[to];
        if (_vec_nonexist(vec, from))//should add edge to->from?
            intVecPush(vec, from);
    } else
        intVecPush(vertices[from], to);
}

char *vec_to_string(Graph self) {
    struct _vec_graph *graph = self;
    int checkSum = 0;

    int j = 1;
    for (j; j <= graph->_size; ++j) {
        IntVec vec = graph->vecs[j];
        if (vec == NULL) checkSum += 10;
        else checkSum += intSize(vec) * 2 + 10;
    }
    char *content = calloc(checkSum, sizeof(char *));

    j = 1;
    for (j; j <= graph->_size; ++j) {
        IntVec vec = graph->vecs[j];
        char *buff;
        if (vec == NULL) {
            buff = calloc(10, sizeof(char));
            sprintf(buff, "%d\t%s", j, "[]\n");
        } else {
            int sz = intSize(vec) * 2 + 10;
            buff = calloc(sz, sizeof(char));
            int size = intSize(vec);
            sprintf(buff, "%d\t[", j);
            int i = size - 1;
            for (i; i >= 1; --i) {
                sprintf(buff, "%s%d ", buff, intData(vec, i));
            }
            sprintf(buff, "%s%d]\n", buff, intData(vec, i));

        }
        sprintf(content, "%s%s", content, buff);
        free(buff);
    }
    return content;
}

Graph vec_transpose(Graph self) {
    struct _vec_graph *graph = self;
    Graph newGraph = _vec_build_graph(graph->_size, graph->_undirected);
    struct _vec_graph *nGraph = newGraph;

    if (graph->_undirected) {
        int i = 1;
        for (i; i <= graph->_size; ++i) {
            IntVec src = graph->vecs[i];
            if (src == NULL) continue;
            IntVec dest = nGraph->vecs[i];
            if (dest == NULL) dest = nGraph->vecs[i] = intMakeEmptyVec();
            int j = 0;
            for (j; j < intSize(src); ++j) {
                intVecPush(dest, intData(src, j));
            }
        }
        return newGraph;
    }
    for (int from = 1; from <= graph->_size; ++from) {
        IntVec vec = graph->vecs[from];
        if (vec != NULL)
            for (int j = 0; j < intSize(vec); ++j) {
                int to = intData(vec, j);
                vec_add_edge(newGraph, edge_create(to, from));
            }
    }
    return newGraph;
}

VertexIterator vec_get_itr(Graph self, int id) {
    struct _vec_graph *graph = self;
    if (id > graph->_size + 1) {//the data structure start from index 1
        printf("get iterator function excess the graph size! size[%d], required[%d]", graph->_size, id);
        return NULL;
    }
    struct _vec_itr *itr = malloc(sizeof(struct _vec_itr));
    itr->vec = graph->vecs[id];
    if (itr->vec == NULL) return NULL;
    itr->_cur = intSize(itr->vec) - 1;//start from end
    return itr;
}

void vec_next(VertexIterator itrr) {
    struct _vec_itr *itr = itrr;
    --itr->_cur;//decrease from end
}

int vec_current(VertexIterator itrr) {
    struct _vec_itr *itr = itrr;
    return intData(itr->vec, itr->_cur);
}

unsigned char vec_hasNext(VertexIterator itrr) {
    struct _vec_itr *itr = itrr;
    int next = itr->_cur - 1;
    if (next != -1)
        return 1;
    return 0;
}

GraphHandler vecGraphHandler() {
    GraphHandler handler = {_vec_build_graph, _vec_size, _vec_undir, vec_add_edge, vec_to_string, vec_transpose,
                            vec_get_itr,
                            vec_next, vec_current, vec_hasNext};
    return handler;
}
