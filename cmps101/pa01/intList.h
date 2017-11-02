/* intList.h
 * (what is the overall purpose of this file? Replace question with your text)
 */

#ifndef C101IntList
#define C101IntList
/* Multiple typedefs for the same type are an error in C. */

typedef struct IntListNode * IntList;

/** intNil denotes the empty IntList */
extern const IntList intNil;

/* Access functions
 * (what are the preconditions? Replace question with your text)
 */

/** first
 * (what are the preconditions? Replace question with your text)
 */
int intFirst(IntList oldL);

/** rest
 * (what are the preconditions? Replace question with your text)
 */
IntList intRest(IntList oldL);

/* Constructors
 */

/** cons
 * (what are the preconditions and postconditions? Replace question with your text)
 */
IntList intCons(int newE, IntList oldL);

#endif

