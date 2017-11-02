//
// Created by CIJhn on 12/7/2016.
//

#ifndef MAXHEAP_PRIM_H
#define MAXHEAP_PRIM_H

#include <stdio.h>
#include <stdlib.h>
#include "edgeVec.h"

/**
 * Load the file into edge vector
 * */
EdgeVec *load(FILE *inbuf, int *n, int *m, unsigned char undirected);

#endif //MAXHEAP_PRIM_H
