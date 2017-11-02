//
// Created by CIJhn on 10/20/2016.
//

#ifndef EDGE_H
#define EDGE_H

typedef struct edge *Edge;

/**
 * return the weight of the edge
 * */
double edge_weight(Edge edge);

/**
 * return the target of the edge
 * */
int edge_from(Edge edge);

/**
 * return the source of the edge
 * */
int edge_to(Edge edge);

Edge edge_copy(Edge edge);

/**
 * constructor
 * create a new empty edge
 * */
Edge edge_empty(void);

/**
 * create a edge with source and target
 * */
Edge edge_create(int from, int to);

/**
 * create a edge with source, target and weight
 * */
Edge edge_create_with_weight(int from, int to, double weight);

/**
 * parse an edge from a line
 * */
Edge edge_parse(char *line);

/**
 * parse the size of the edge from file header
 * */
int edge_parse_size(char *line);

#endif //MAXHEAP_EDGE_H
