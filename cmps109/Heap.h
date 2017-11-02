//
// Created by Hongze Xu on 10/11/2016.
//

#ifndef CPRACTICE_HEAP_H
#define CPRACTICE_HEAP_H

using namespace std;

class Heap {
private:
    int *array;
    int MaxSize, Nel;

    void adjust(int a[], int i, int n);

public:
    /**
     * Construct the Heap by the capacity.
     * @param size The capacity of the Heap.
     */
    Heap(int size);

    /**
     * Insert an item into the heap.
     * @param Item The item will be inserted into.
     * @return If this insert action successed.
     */
    bool insert(int item);

    /**
    * Delete an item into the heap.
    * @param Item The item will be deleted from heap.
    * @return If this delete action successed.
    */
    bool delMax(int &item);

    ~Heap();

    /**
    * Construct/copy a heap from another heap.
    * @param heap The original heap.
    */
    Heap(Heap &heap);

    /**
    * Assign a heap to another.
    * @param heap The original heap will be assigned.
    * @return The new heap.
    */
    Heap &operator=(Heap &heap);

    /**
    * Add up another heap and return the orignial heap.
    * @param heap The new heap.
    * @return The original heap.
    */
    Heap &operator+=(Heap &heap);

    /**
    * Add an new item into the heap and return the heap.
    * @param item The new item.
    * @return The original heap.
    */
    Heap &operator+=(int item);

    /**
    * Find the item-th laargest item in the heap
    * @param item The order of the largest item.
    * @return The target item.
    */
    int operator[](int item);

    /**
    * Create a new heap that contains old items from the old heap and the new item.
    * @param item The new item.
    * @return The new heap.
    */
    Heap &operator+(int item);

    /**
    * Create a new heap that contains old items from the old heaps.
    * @param heap The another heap.
    * @return The new heap.
    */
    Heap &operator+(Heap &heap);

    /**
    * Print the heap into ostream
    * @param stream The out stream will be print on.
    * @param heap The heap wanted to print.
    * @return The out stream.
    */
    friend ostream &operator<<(ostream &stream, Heap &heap);
};


#endif //CPRACTICE_HEAP_H
