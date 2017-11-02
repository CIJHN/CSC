//
// Created by Hongze Xu on 10/11/2016.
//

#include <iostream>
#include "Heap.h"


Heap::~Heap() {
    delete[](array);
}

Heap::Heap(Heap &heap) : Nel(heap.Nel), MaxSize(heap.MaxSize) {
    array = (int *) calloc((size_t) (MaxSize + 1), sizeof(int));
    memcpy(array, heap.array, heap.MaxSize * sizeof(int));
}

Heap &Heap::operator+(Heap &heap) {
    int min = heap.Nel + this->Nel;
    if (min > this->Nel + heap.Nel) {
        Heap *h = new Heap(min + 1);
        memcpy(h, this->array, sizeof(int) * this->Nel);
        for (int i = 1; i <= heap.Nel; ++i)
            h->insert(heap.array[i]);
        return *h;
    }
    Heap *copy = new Heap(*this);
    for (int i = 1; i <= heap.Nel; ++i)
        copy->insert(heap.array[i]);

    return *copy;
}

Heap &Heap::operator+(int item) {
    if (this->Nel + 1 == this->MaxSize) {
        int max = this->MaxSize + this->Nel;
        Heap *h = new Heap(max);
        memcpy(h->array, this->array, this->Nel * sizeof(int));
        h->insert(item);
        return *h;
    }
    Heap &copy = *new Heap(*this);
    copy.insert(item);
    return copy;
}

int Heap::operator[](int item) {
    if (item > Nel + 1 || item <= 0) {
        std::cout << "heap size exceeded" << std::endl;
        return -1;
    }
//    cout << "try to [] item ";
//    cout << item << endl;
//    cout << *this << endl;
//    cout << Nel << endl;
    Heap *copy = new Heap(*this);
    int r = -1;
    for (int i = 0; i < item; ++i)
        copy->delMax(r);
//    cout << endl;

    delete copy;
    return r;
}

void Heap::adjust(int a[], int i, int n) {
    int j = 2 * i, item = a[i];
    while (j <= n) {
        if (j < n && (a[j] < a[j + 1])) j++;
// Compare left and right child
// and let j be the larger child
        if (item >= a[j]) break;
        a[j / 2] = a[j];
        j *= 2;
    }
    a[j / 2] = item;
}

Heap::Heap(int size) : MaxSize(size) {
    array = (int *) calloc((size_t) (size + 1), sizeof(int));
    Nel = 0;
}

bool Heap::insert(int item) {
    int i = ++Nel;
    if (i == MaxSize) {
        std::cout << "heap size exceeded" << std::endl;
        return false;
    }
    while ((i > 1) && (array[i / 2] < item)) {
        array[i] = array[i / 2];
        i /= 2;
    }
    array[i] = item;
    return true;
}

bool Heap::delMax(int &item) {
    if (!Nel) {
        std::cout << "heap is empty" << std::endl;
        return false;
    }
    item = array[1];
    array[1] = array[Nel--];
    adjust(array, 1, Nel);
    return true;
}

Heap &Heap::operator=(Heap &heap) {
    return *new Heap(heap);
}

Heap &Heap::operator+=(Heap &heap) {
    if (heap.Nel + this->Nel > this->MaxSize) {
        int *arr = (int *) realloc(this->array, sizeof(int) * (heap.Nel + this->Nel));
        if (arr == NULL) {
            cout << "Memory error!" << endl;
            return *this;
        }
    }
    for (int i = 1; i <= heap.Nel; ++i)
        insert(heap.array[i]);
    return *this;
}

ostream &operator<<(ostream &stream, Heap &heap) {
    for (int i = 1; i <= heap.Nel; ++i)
        stream << std::to_string(heap.array[i]) + " ";
    return stream;
}

Heap &Heap::operator+=(int item) {
    insert(item);
    return *this;
}
