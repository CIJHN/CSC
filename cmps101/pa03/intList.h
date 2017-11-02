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
 * access the content of the list without side effects(no post conditions)
 */

/** first
 * The oldL is not null.
 * return the value contained by this node.
 */
int intFirst(IntList oldL);

/** rest
 * The oldL is not null
 * return the node that this oldL pointing to.
 */
IntList intRest(IntList oldL);

/* Constructors
 */

/** cons
 * create an new IntList(assuming it called newL) with the value on node newE (intFirst(newL)==newE)
 * and pointing to oldL(intRest(newL)==oldL)
 */
IntList intCons(int newE, IntList oldL);

#endif

