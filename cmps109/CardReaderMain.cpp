//
// Created by CIJhn on 10/19/2016.
//

#include "CardReader.h"
#include <assert.h>

int main() {
    CardReader *reader = new CardReader();
    assert(reader != nullptr);//test construct

    const int totalSeat = reader->getAvailableSeat();
    assert(totalSeat == TOTAL_SEAT);//test total seat

    //test single student check in.
    reader->checkIn(0);
    assert(reader->getCurrentStudentCount() == 1);
    assert(reader->getAvailableSeat() == totalSeat - 1);
    assert(reader->isOccupied(0));

    //test seat collapses.
    assert(reader->checkIn(0));

    //test check in multiple students
    reader->checkIn(5);
    assert(reader->getCurrentStudentCount() == 2);
    assert(reader->getAvailableSeat() == totalSeat - 2);
    assert(reader->isOccupied(5));

    //test check out student.
    reader->checkOut(0);
    assert(reader->getCurrentStudentCount() == 1);
    assert(reader->getAvailableSeat() == totalSeat - 1);
    assert(!reader->isOccupied(0));

    //test illegal check in.
    assert(!reader->checkOut(2));
    assert(!reader->checkIn(-1));
    assert(!reader->checkIn(totalSeat));

    delete reader;
}
