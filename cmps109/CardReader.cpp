//
// Created by Hongze Xu on 10/11/2016.
//

#include <cstdlib>
#include "CardReader.h"

static inline bool validate(int &id) {
    return id >= 0 && id < TOTAL_SEAT;
}

bool CardReader::checkIn(int id) {
    if (!validate(id))
        return false;
    if (!isOccupied(id)) {
        content[id] = true;
        ++count;
        return true;
    }
    return false;
}

CardReader::CardReader() {
    content = (bool *) calloc(TOTAL_SEAT, sizeof(bool));
    count = 0;
}

CardReader::~CardReader() {
    delete[] content;
}

int CardReader::getCurrentStudentCount() {
    return count;
}

bool CardReader::isOccupied(int id) {
    return content[id];
}

int CardReader::getAvailableSeat() {
    return TOTAL_SEAT - count;
}

bool CardReader::checkOut(int id) {
    if (!validate(id))
        return false;
    if (isOccupied(id)) {
        content[id] = false;
        --count;
        return true;
    }
    return false;
}

