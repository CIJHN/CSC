/* edgeVec.h
 * (what is the overall purpose of this file? Replace question with your text)
 */

#ifndef C101EdgeVec
#define C101EdgeVec
/* Multiple typedefs for the same type are an error in C.
 * The above ifndef and define prevent multiple copies of code below.
 */

typedef struct EdgeVecNode *EdgeVec;

typedef struct EdgeInfoStruct {
    int to;
    double wgt;
} EdgeInfo;


/** edgeInitCap: initial capacity after edgeMakeEmptyVec() */
static const int edgeInitCap = 4;

/* Access functions
 */

/** edgeTop()
 *  The edge size is not 0
 */
EdgeInfo edgeTop(EdgeVec myVec);

/** edgeData()
 * precondition: 0 <= i < edgeSize(myVec).
 */
EdgeInfo edgeData(EdgeVec myVec, int i);

/** edgeSize()
 * precondition: myVec has been constructed.
 */
int edgeSize(EdgeVec myVec);

/** edgeCapacity()
 * precondition: myVec has been constructed.
 */
int edgeCapacity(EdgeVec myVec);

/* Constructors
 */

/** edgeMakeEmptyVec()
 * preconditions: none.
 * postconditions: Let /return be the value returned by edgeMakeEmptyVec().
 *    Then edgeCapacity(/return) == 4, edgeSize(/return) == 0).
 */
EdgeVec edgeMakeEmptyVec(void);


/* Manipulation Procedures
 */

/** edgeVecPush()
 * precondition: myVec has been constructed.
 * postconditions: Let /sz/ = edgeSize(myVec) before the call.
 *                 Let /cap/ = edgeCapacity(myVec) before the call.
 *    Then after the call, edgeSize(myVec) == /sz/+1,
 *        and edgeTop(myVec) == newE and edgeData(myVec, /sz/) == newE.
 *    Also, for all 0 <= i < /sz/: edgeData(myVec, i) is unchanged.
 *    Also, if (/sz/+1) > /cap/, then after the call,
 *        edgeCapacity(myVec) = 2 * /cap/.
 *    otherwise, edgeCapacity(myVec) is unchanged.
 */
void edgeVecPush(EdgeVec myVec, EdgeInfo newE);

/** edgeVecPop()
 * precondition: myVec has been constructed and edgeSize(myVec) > 0.
 * postconditions: Let /sz/ = edgeSize(myVec) before the call.
 *                 Let /cap/ = edgeCapacity(myVec) before the call.
 *    Then after the call, edgeSize(myVec) == /sz/-1,
 *        edgeTop(myVec) == edgeData(/sz/-2).
 *    Also, for all 0 <= i < /sz/-1: edgeData(myVec, i) is unchanged.
 *    Also, edgeCapacity(myVec) is unchanged.
 */
void edgeVecPop(EdgeVec myVec);


#endif

