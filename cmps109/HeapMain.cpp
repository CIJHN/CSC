//
// Created by CIJhn on 10/20/2016.
//
#include <assert.h>
#include <iostream>
#include "Heap.h"

using namespace std;

int main() {
    Heap &heap = *new Heap(64);

    //test += num
    heap += 3;
    cout << heap << endl;//test print
    assert(heap[1] == 3); //test find max

    //test copy
    Heap &copy = *new Heap(heap);
    assert(heap[1] == 3);

    //test + num
    Heap &addUp = heap + 5;
    assert(addUp[1] == 5);

    //test + heap
    Heap &sum = heap + copy;
    assert(sum[1] == 3 && sum[2] == 3);

    //test += heap
    heap += addUp;
    assert(heap[1] == 5);

    //test =
    Heap &eq = heap;
    assert(eq[1] == heap[1]);
    return 0;
}