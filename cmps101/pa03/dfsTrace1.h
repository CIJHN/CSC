//
// Created by CIJhn on 11/3/2016.
//

#ifndef MAXHEAP_DFSTRACE1_H
#define MAXHEAP_DFSTRACE1_H

#include "intVec.h"

typedef struct trace_result *TraceResult;

TraceResult dfs_trace_phase_1(IntVec *vertices, int numberOfVertices);

TraceResult def_trace_phase_2(IntVec *transposed, TraceResult result);

/**
 * return the size of the trace result
 * */
int dfs_size(TraceResult result);

/**
 * return the color of the trace result for a vertex
 * */
char dfs_color(TraceResult result, int vertex);

/**
 * return the parent of the trace result for a vertex
 * */
int dfs_parent(TraceResult result, int vertex);

/**
 * return the discovered time of the trace result for a vertex
 * */
int dfs_discover_time(TraceResult result, int vertex);

/**
 * return the finish time of the trace result for a vertex
 * */
int dfs_finish_time(TraceResult result, int vertex);

/**
 * return the global of the trace result
 * */
int dfs_global_time(TraceResult result);

/**
 * return the order of the trace result for a vertex
 * */
int dfs_order(TraceResult result, int vertex);

/**
 * return the root of the trace result for a vertex
 * */
int dfs_root(TraceResult result, int vertex);

#endif //MAXHEAP_DFSTRACE1_H
