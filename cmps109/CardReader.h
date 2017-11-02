//
// Created by Hongze Xu on 10/11/2016.
//

#ifndef CPRACTICE_CARDREADER_H
#define CPRACTICE_CARDREADER_H

const static int TOTAL_SEAT = 256;

class CardReader {

private:
    unsigned char count;
    bool *content;

public:
    /**
     * The public constructor
     */
    CardReader();

    /**
     * Check in a student by seat id.
     *
     * @param The id of seat queried.
     * @return If this check in action successed.
     * Fail may caused by the seat was already been taken, or the id excess the range of seats id, which should be [0-256).
     */
    bool checkIn(int id);

    /**
     * Check out a student by seat id.
     *
     * @param the id of the seat that used to be occupied,
     * @return If this check out action successed.
     * Fail may caused by that the seat is not taken by anyone before, or the id excess the range of seats id, which should be [0-256).
     */
    bool checkOut(int id);

    /**
     * Determine if a specific seat is occupied.
     *
     * @return The id of seat needed to be checked.
     */
    bool isOccupied(int id);

    /**
     * Get the the number of seats remained currently.
     *
     * @return The number of seats remained.
     */
    int getAvailableSeat();

    /**
     * Get the count of students currently in class.
     *
     * @return the count of students.
     */
    int getCurrentStudentCount();

    ~CardReader();
};


#endif //CPRACTICE_CARDREADER_H
