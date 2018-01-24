(define (oddlen ls) 
    (cond (null? ls) #f
        (null? (cdr ls)) #t 
        (else (oddlen (cddr ls)))
    ))

