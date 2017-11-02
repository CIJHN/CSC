//
// Created by CIJhn on 11/3/2016.
//

#include <stddef.h>
#include <stdlib.h>
#include <stdio.h>
#include "dfsTrace1.h"

struct trace_result {
    int *descTime;
    int *finishTime;
    int *parent;
    int globalTime;
    int size;
    char *colors;
    IntVec stack;
    int *scc;
};


TraceResult _rp(int numberOfVertices) {
    size_t nofV = (size_t) numberOfVertices + 1;
    TraceResult result = (TraceResult) calloc(nofV, sizeof(struct trace_result));

    result->stack = intMakeEmptyVecN(numberOfVertices + 1);
    result->colors = (char *) calloc(nofV, sizeof(char));
    result->globalTime = 0;
    result->size = numberOfVertices;
    result->descTime = (int *) calloc(nofV, sizeof(int));
    result->finishTime = (int *) calloc(nofV, sizeof(int));
    result->parent = (int *) calloc(nofV, sizeof(int));
    result->stack = intMakeEmptyVecN(numberOfVertices + 1);
    result->scc = (int *) calloc(nofV, sizeof(int));

    int i;
    for (i = 0; i <= numberOfVertices; ++i)
        result->colors[i] = 'W';
    return result;
}

void dfs1(IntVec *vertices, int current, TraceResult result) {
    result->colors[current] = 'G';
    result->descTime[current] = ++result->globalTime;
    IntVec currentVec = vertices[current];
    int i;
    if (currentVec != NULL)
        for (i = intSize(currentVec) - 1; i >= 0; --i) {
            int connected = intData(currentVec, i);
            if (result->colors[connected] == 'W') {
                result->parent[connected] = current;
                dfs1(vertices, connected, result);
            }
        }
    result->finishTime[current] = ++result->globalTime;
    intVecPush(result->stack, current);
    result->colors[current] = 'B';
}

TraceResult dfs_trace_phase_1(IntVec *vertices, int numberOfVertices) {
    TraceResult result = _rp(numberOfVertices);
    int i;
    for (i = 1; i <= numberOfVertices; ++i) {
        if (result->colors[i] == 'W') {
            result->parent[i] = -1;
            dfs1(vertices, i, result);
        }
    }
    return result;
}

void dfsT(IntVec *vertices, int leader, int v, TraceResult result) {
    result->colors[v] = 'G';
    result->descTime[v] = ++result->globalTime;
    result->scc[leader] = v;
    IntVec currentVec = vertices[v];
    int i;
    if (currentVec != NULL)
        for (i = intSize(currentVec) - 1; i >= 0; --i) {
            int connected = intData(currentVec, i);
            if (result->colors[connected] == 'W') {
                result->parent[connected] = v;
                dfsT(vertices, leader, connected, result);
            }
        }
    result->finishTime[v] = ++result->globalTime;
    intVecPush(result->stack, v);
    result->colors[v] = 'B';
}

TraceResult def_trace_phase_2(IntVec *transposed, TraceResult result) {
    TraceResult nResult = _rp(result->size);
    IntVec finStack = result->stack;

    for (int i = intSize(finStack); i >= 0; --i) {
        int v = intData(result->stack, i);
        if (v == 0) continue;
        if (nResult->colors[v] == 'W') {
            nResult->parent[v] = -1;
            dfsT(transposed, v, v, nResult);
        }
    }
    return nResult;
}

int dfs_discover_time(TraceResult result, int vertex) {
    return result->descTime[vertex];
}

int dfs_finish_time(TraceResult result, int vertex) {
    return result->finishTime[vertex];
}

int dfs_global_time(TraceResult result) {
    return result->globalTime;
}

int dfs_parent(TraceResult result, int vertex) {
    return result->parent[vertex];
}

int dfs_size(TraceResult result) {
    return result->size;
}

char dfs_color(TraceResult result, int vertex) {
    return result->colors[vertex];
}

int dfs_order(TraceResult result, int vertex) {
    return intData(result->stack, vertex - 1);
}

int dfs_root(TraceResult result, int vertex) {
    return result->scc[vertex];
}

