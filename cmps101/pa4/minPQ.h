/* minPQ.h (what is the purpose of this file? Replace this question with your comment.)
*/

#ifndef C101MinPQ
#define C101MinPQ
/* Multiple typedefs for the same type are an error in C. */

typedef struct MinPQNode *MinPQ;

#define UNSEEN ('u')
#define FRINGE ('f')
#define INTREE ('t')

/* ***************** Access functions */

/**
*/

/** isEmpty
*/
int isEmptyPQ(MinPQ pq);

/** getMin Precondition: the queue is not empty.
*/
int getMin(MinPQ pq);

/** getStatus return the status of the idth element
*/
int getStatus(MinPQ pq, int id);

/** getParent return the parent of the idth element
*/
int getParent(MinPQ pq, int id);

/** getPriority return the priority of the idth element
*/
double getPriority(MinPQ pq, int id);


/* ***************** Manipulation procedures */

/** delMin Precondition: The priority queue is not empty.
 * Postcondition: The minimum priority element in the queue will be deleted
*/
void delMin(MinPQ pq);

/** insertPQ Precondition: The id is not greater than the size of the queue.
 * Postcondition: The queue add a new element with id/priority/parent provided by parameter.
*/
void insertPQ(MinPQ pq, int id, double priority, int par);

/** decreaseKey Postcondition: Change the priority and parent of the element.
*/
void decreaseKey(MinPQ pq, int id, double priority, int par);


/* ***************** Constructors */

/** createPQ PostCondition: create a new priority queue with size n, status, priority and parent
*/
MinPQ createPQ(int n, int status[], double priority[], int parent[]);


#endif

