#include <stdlib.h>
#include "intList.h"

const IntList intNil = NULL;
struct IntListNode {
    int value;
    struct IntListNode *next;
};

int intFirst(IntList oldL) { return oldL->value; }

IntList intRest(IntList lst) { return lst->next; }

IntList intCons(int newElement, IntList oldList) {
    IntList lst = (IntList) malloc(sizeof(struct IntListNode));
    lst->value = newElement;
    lst->next = oldList;
    return lst;
}