//
// Created by CIJhn on 12/7/2016.
//

#include <stdlib.h>
#include <math.h>
#include "minPQ.h"

struct MinPQNode {
    int vertices;
    int size;
    int *status;
    double *priority;
    int *parent;
};

int isEmptyPQ(MinPQ pq) {
    return pq->size == 0;
}

int getMin(MinPQ pq) {
    int i;
    double min = INFINITY;
    int minID = -1;
    for (i = 1; i <= pq->vertices; i++)
        if (pq->status[i] == FRINGE)
            if (pq->priority[i] < min) {
                minID = i;
                min = pq->priority[i];
            }
    return minID;
}

int getStatus(MinPQ pq, int id) {
    return pq->status[id];
}

int getParent(MinPQ pq, int id) {
    return pq->parent[id];
}

double getPriority(MinPQ pq, int id) {
    return pq->priority[id];
}

void delMin(MinPQ pq) {
    int id = getMin(pq);
    pq->status[id] = INTREE;
    --pq->size;
}

void insertPQ(MinPQ pq, int id, double priority, int par) {
    pq->status[id] = FRINGE;
    pq->priority[id] = priority;
    pq->parent[id] = par;
    pq->size++;
}

void decreaseKey(MinPQ pq, int id, double priority, int par) {
    pq->priority[id] = priority;
    pq->parent[id] = par;
}

MinPQ createPQ(int n, int *status, double *priority, int *parent) {
    MinPQ queue = (MinPQ) calloc(1, sizeof(struct MinPQNode));
    queue->size = 0;
    queue->vertices = n;
    queue->status = status;
    queue->priority = priority;
    queue->parent = parent;
    int i;
    for (i = 1; i < n + 1; i++) {
        status[i] = UNSEEN;
        parent[i] = -1;
    }
    return queue;
}

