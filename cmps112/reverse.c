struct node {
    int value;
    node* link; 
};
typedef struct node node; 

node* reverse (node* head){
    node* current = head;
    node* nList = NULL;
    while (current != NULL) {
        node* next = current->link;
        current->link = nList;
        nList = current;
        current = next;
    }
    return nList;
}