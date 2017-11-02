//
// Created by CIJhn on 12/7/2016.
//

#include <stdlib.h>
#include "edgeVec.h"

struct EdgeVecNode {
    int current;
    EdgeInfo *store;
    int capacity;
};

struct EdgeInfoStruct edgeTop(EdgeVec myVec) {
    return myVec->store[myVec->current];
}

EdgeInfo edgeData(EdgeVec myVec, int i) {
    return myVec->store[i];
}

int edgeSize(EdgeVec myVec) {
    return myVec->current;
}

int edgeCapacity(EdgeVec myVec) {
    return myVec->capacity;
}

EdgeVec edgeMakeEmptyVec(void) {
    EdgeVec vec = calloc(1, sizeof(struct EdgeVecNode));
    vec->current = 0;
    vec->capacity = edgeInitCap;
    vec->store = calloc(edgeInitCap, sizeof(struct EdgeInfoStruct));
    return vec;
}

static inline int ensureCapacity(EdgeVec vec) {
    if (vec->current + 1 > vec->capacity) {
        int capacity = 2 * vec->capacity;
        struct EdgeInfoStruct *data = realloc(vec->store, capacity * sizeof(struct EdgeInfoStruct));
        if (data != NULL) {
            vec->store = data;
            vec->capacity = capacity;
            return 1;
        }
        return 0;
    }
    return 1;
}

void edgeVecPush(EdgeVec myVec, EdgeInfo newE) {
    if (ensureCapacity(myVec))
        myVec->store[myVec->current++] = newE;
}

void edgeVecPop(EdgeVec myVec) {
    if (edgeSize(myVec) != 0)
        myVec->current -= 1;
}
