//
// Created by CIJhn on 10/14/2016.
//

#include "intVec.h"
#include <stdlib.h>

const int intInitCap = 4;

struct IntVecNode {
    int current;
    int *store;
    int capacity;
};

int intTop(IntVec myVec) {
    return myVec->store[myVec->current];
}

int intData(IntVec myVec, int i) {
    return myVec->store[i];
}

int intSize(IntVec myVec) {
    return myVec->current;
}

int intCapacity(IntVec myVec) {
    return myVec->capacity;
}

IntVec intMakeEmptyVec(void) {
    return intMakeEmptyVecN(intInitCap);
}

static inline int ensureCapacity(IntVec vec) {
    if (vec->current + 1 > vec->capacity) {
        int capacity = 2 * vec->capacity;
        int *data = realloc(vec->store, capacity * sizeof(int));
        if (data != NULL) {
            vec->store = data;
            vec->capacity = capacity;
            return 1;
        }
        return 0;
    }
    return 1;
}

void intVecPush(IntVec myVec, int newE) {
    if (ensureCapacity(myVec))
        myVec->store[myVec->current++] = newE;
}

void intVecPop(IntVec myVec) {
    if (intSize(myVec) != 0)
        myVec->current -= 1;
}

IntVec intMakeEmptyVecN(int np1) {
    IntVec vec = calloc(1, sizeof(struct IntVecNode));
    vec->current = 0;
    vec->capacity = np1;
    vec->store = calloc(np1, sizeof(int));
    return vec;
}
