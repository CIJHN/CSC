//
// Created by CIJhn on 10/20/2016.
//

#ifndef EDGE_H
#define EDGE_H

typedef struct edge *Edge;

/**
* Return the weight of edge
* */
double edge_weight(Edge edge);

/**
 * Return the from vertex id for the edge
 * */
int edge_from(Edge edge);

/**
 * Return the to vertex id for the edge
 * */
int edge_to(Edge edge);

/**
 * Return an empty new edge
 * */
Edge edge_empty(void);

/**
 * Create an edge from two point
 * the new edge nEdge will have:
 * edge_from(nEdge)==from
 * edge_to(nEdge)==to
 * */
Edge edge_create(int from, int to);

/**
 * Create an edge from two point with weight
 * the new edge nEdge will have:
 * edge_from(nEdge)==from
 * edge_to(nEdge)==to
 * edge_weight(nEdge)==weight
 * */
Edge edge_create_with_weight(int from, int to, double weight);

/**
 * Parse the edge from line
 * */
Edge edge_parse(char *line);

/**
 * Parse the edge size from line
 * */
int edge_parse_size(char *line);

#endif //MAXHEAP_EDGE_H
