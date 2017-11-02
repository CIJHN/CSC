//
// Created by CIJhn on 10/20/2016.
//

#ifndef EDGE_H
#define EDGE_H

typedef struct edge *Edge;

double edge_weight(Edge edge);

int edge_from(Edge edge);

int edge_to(Edge edge);

Edge edge_copy(Edge edge);

Edge edge_empty(void);

Edge edge_create(int from, int to);

Edge edge_create_with_weight(int from, int to, double weight);

Edge edge_parse(char *line);

int edge_parse_size(char *line);

#endif //MAXHEAP_EDGE_H
