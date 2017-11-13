
(define (collatz n) 
    (define (even n) (= (remainder n) 0))
    (define (inner n accum)
        (if (<= n 1) (cons 1 accum)
            (if (even n) (inner (/ n 2) (cons n accum))
                (inner (+ 1 (* 3 n)) (cons n accum))
            )
        )
    )
    (reverse (inner n `()))
)


