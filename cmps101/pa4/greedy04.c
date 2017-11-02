#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include "loadWgtGraph.h"

#include "minPQ.h"

/**
 * print the output for result
 * */
void printOutput(int size, int *parent, double *priority, int *status, char task) {
    int i;
    if (task == 'P')//distinguish the different
        printf("Prim's Minimum Spanning Tree\n");
    else
        printf("Dijkstra's Shortest Path\n");
    printf("Vertex\tPriority Status\tParent\n");
    for (i = 1; i < size + 1; i++) {
        if (status[i] != 'u')
            printf("%d\t%.2lf\t%c\t%d\n", i, priority[i], status[i], parent[i]);
        else
            printf("%d\t%s\t%c\t%d\n", i, "-", UNSEEN, -1);
    }
    printf("\n");
}

/**
 * update the fringe of the priority queue
 * */
void updateFringe(MinPQ pq, EdgeVec vecs, int v, char flag) {
    if (vecs == NULL)
        return;
    int vec;
    double weight;
    double newWeight = 0;
    if (flag == 'D')
        newWeight = getPriority(pq, v);
    //if we are applying the shortest path algorithm, we need to compare the weight(cost) to the new node
    for (int i = 0; i < edgeSize(vecs); ++i) {
        EdgeInfo edgeInfo = edgeData(vecs, i);
        vec = edgeInfo.to;
        weight = edgeInfo.wgt + newWeight;
        if (getStatus(pq, vec) == UNSEEN)
            insertPQ(pq, vec, weight, v);
        else if (getStatus(pq, vec) == FRINGE)
            if (weight < getPriority(pq, vec))
                decreaseKey(pq, vec, weight, v);
    }
}

/**
 * action of the algorithm
 * */
void algorithm(EdgeVec *vec, int n, int start, int *parent, double *priority, int *status, char flag) {
    MinPQ pq = createPQ(n, status, priority, parent);
    insertPQ(pq, start, 0, -1);
    int min;
    while (isEmptyPQ(pq) == 0) {
        printOutput(n, parent, priority, status, flag);
        min = getMin(pq);
        delMin(pq);
        updateFringe(pq, vec[min], min, flag);
    }
}

int main(int argc, char **argv) {
    int m, n;

    if (argc < 3) {
        printf("Usage: ./greedy04 <start vertex> -<P/D> input.txt\n");
        return 0;
    }

    unsigned char undirected = 0;
    int startVet = 0;
    char flag = '0';

    for (int i = 1; i < argc - 1; ++i) {
        char *arg = argv[i];
        if (arg[0] == '-') {
            if (strcmp(arg, "-u") == 0) {
                undirected = 1;
            } else if (strcmp(arg, "-P") == 0) {
                flag = 'P';
            } else if (strcmp(arg, "-D") == 0) {
                flag = 'D';
            }
        } else {
            if (startVet == 0) {
                startVet = atoi(arg);
            } else {
                printf("Assigning duplicated start vertex!\n");
                exit(1);
            }
        }
    }

    if (startVet == 0) {
        printf("Please assign the start vertex!");
        exit(1);
    }
    if (flag == '0') {
        printf("Please assign the algorithm by -P/D\n");
        exit(1);
    }

    char *infile = argv[argc - 1];
    FILE *fileP = fopen(infile, "r");

    if (fileP == NULL) {
        printf("There are no file named %s!\n", infile);
        exit(1);
    }

    EdgeVec *graph = load(fileP, &n, &m, undirected);

    int *parent = calloc(n + 1, sizeof(int));
    double *priority = calloc(n + 1, sizeof(double));;
    int *status = calloc(n + 1, sizeof(int));;

    algorithm(graph, n, startVet, parent, priority, status, flag);
    printOutput(n,parent,priority,status,flag);
    fclose(fileP);
    return 0;
}
