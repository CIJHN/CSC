//
// Created by CIJhn on 11/3/2016.
//

#include <stdlib.h>
#include <string.h>
#include "listHandler.h"
#include "intList.h"
#include "stdio.h"

void *list_build_elements(int size) {
    IntList *vertices = malloc(sizeof(IntList) * (size + 1));
    int i = 1;
    for (i; i <= size; i++) vertices[i] = intNil;
    return vertices;
}

void list_add_edge(Edge e, void *elements, unsigned char undirected) {
    IntList *vertices = (IntList *) elements;
    vertices[edge_from(e)] = intCons(edge_to(e), vertices[edge_from(e)]);
    if (undirected) {
        vertices[edge_to(e)] = intCons(edge_from(e), vertices[edge_to(e)]);
    }
}

char *list_to_string(void *elements, int idx) {
    IntList lst = ((IntList *) elements)[idx];
    char *c = malloc(sizeof(char) * 16);
    if (lst == intNil) {
        strcpy(c, "[]\n");
    } else {
        strcpy(c, "[");
        do {
            char src[8];
            sprintf(src, "%d", intFirst(lst));
            strcat(c, src);
            if (intRest(lst) != intNil) {
                char *blank = " ";
                strcat(c, blank);
                lst = intRest(lst);
            } else break;
        } while (1);
        strcat(c, "]\n");
    }
    return c;
}

GraphHandler list_create_element_handler() {
    GraphHandler result;
    result.to_string = list_to_string;
    result.add = list_add_edge;
    result.build = list_build_elements;
    return result;
}
