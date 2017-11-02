//
// Created by CIJhn on 11/3/2016.
//

#include <stdlib.h>
#include "listHandler.h"
#include "intList.h"
#include "stdio.h"

Graph list_build_elements(int size, GraphType type) {


    IntList *vertices = malloc(sizeof(IntList) * (size + 1));
    int i = 1;
    for (i; i <= size; i++) vertices[i] = intNil;
    Graph graph = {
            vertices,size,type, list_add_edge,list_to_string,list_to_string
    };
    graph.size = size;
    graph.elements = vertices;
    graph.type = type;
    return graph;
}

void list_add_edge(Edge e, Graph graph) {
    IntList *vertices = (IntList *) graph.elements;
    if (edge_weight(e) != 0)
        vertices[edge_from(e)] = intCons((int) edge_weight(e), intCons(edge_to(e), vertices[edge_from(e)]));
    else
        vertices[edge_from(e)] = intCons(edge_to(e), vertices[edge_from(e)]);
}

char *list_to_string(void *elements, int idx) {
    IntList lst = ((IntList *) elements)[idx];
    char *c = malloc(sizeof(char) * 16);
    if (lst == intNil)
        c = "[]\n";
    else if (intRest(lst))
        if (intRest(intRest(lst)))
            sprintf(c, "[%d %d %d]\n", intFirst(lst), intFirst(intRest(lst)), intFirst(intRest(intRest(lst))));
        else
            sprintf(c, "[%d %d]\n", intFirst(lst), intFirst(intRest(lst)));
    else sprintf(c, "[%d]\n", intFirst(lst));
    return c;
}

GraphHandler list_create_element_handler() {
    GraphHandler result = {
            list_build_elements, list_add_edge, list_to_string
    };
//    result.to_string = list_to_string;
//    result.add = list_add_edge;
//    result.build = list_build_elements;
    return result;
}
