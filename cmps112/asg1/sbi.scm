#!/afs/cats.ucsc.edu/courses/cmps112-wm/usr/racket/bin/mzscheme -qr
; #lang scheme 
;; $Id: sbi.scm,v 1.3 2016-09-23 18:23:20-07 - - $
;;
;; NAME
;;    sbi.scm - silly basic interpreter
;;
;; SYNOPSIS
;;    sbi.scm filename.sbir
;;
;; DESCRIPTION
;;    The file mentioned in argv[1] is read and assumed to be an SBIR
;;    program, which is the executed.  Currently it is only printed.
;;

(define *stderr* (current-error-port))

(define *run-file*
    (let-values
        (((dirpath basepath root?)
            (split-path (find-system-path 'run-file))))
        (path->string basepath))
)

(define (die list)
    (for-each (lambda (item) (display item *stderr*)) list)
    (newline *stderr*)
    (exit 1)
)

(define (usage-exit)
    (die `("Usage: " ,*run-file* " filename"))
)

(define (readlist-from-inputfile filename)
    (let ((inputfile (open-input-file filename)))
         (if (not (input-port? inputfile))
             (die `(,*run-file* ": " ,filename ": open failed"))
             (let ((program (read inputfile)))
                  (close-input-port inputfile)
                         program))))

(define (write-program-by-line filename program)
    (printf "==================================================~n")
    (printf "~a: ~s~n" *run-file* filename)
    (printf "==================================================~n")
    (printf "(~n")
    (map (lambda (line) (printf "~s~n" line)) program)
    (printf ")~n"))

(define (main arglist)
    (if (or (null? arglist) (not (null? (cdr arglist))))
        (usage-exit)
        (let* ((sbprogfile (car arglist))
               (program (readlist-from-inputfile sbprogfile)))
              ;(write-program-by-line sbprogfile program)
              (run-program program)
              )))


;; func table
(define *func-table* (make-hash))
(define (func-get key) (hash-ref *func-table* key))
(define (func-put! key value) (hash-set! *func-table* key value))
(define (func-has? key) (hash-has-key? *func-table* key))


;; label table
(define *label-table* (make-hash))
(define (label-get key) (hash-ref *label-table* key))
(define (label-put! key value) (hash-set! *label-table* key value))
(define (label-has? key) (hash-has-key? *label-table* key))

;; var table
(define *var-table* (make-hash))
(define (var-get key) (hash-ref *var-table* key))
(define (var-put! key value) (hash-set! *var-table* key value))
(define (var-has? key) (hash-has-key? *var-table* key))

; helper functions 
(define (typeof? expr)
    (cond
        ((boolean?   expr) "boolean")
        ((number?    expr) "number")
        ((symbol?    expr) "symbol")
        ((string?    expr) "string")
        ((list?      expr) "list")
        ((pair?      expr) "pair")
        ((procedure? expr) "procedure")
        ((char?      expr) "char")
        ((complex?   expr) "complex")
        ((integer?   expr) "integer")
        ((path?      expr) "path")
        ((rational?  expr) "rational")
        ((real?      expr) "real")
        ((vector?    expr) "vector")
        (else "undefined")
    )
)
(define (println printable) (display printable) (newline))
(define (print-table table) (hash-for-each table (lambda (key value) (printf "~s : ~s = ~s~n" key (typeof? value) value))))

(for-each (lambda (pair) (var-put! (car pair) (cadr pair)))
    `(
        (log10_2 0.301029995663981195213738894724493026768189881)
        (sqrt_2  1.414213562373095048801688724209698078569671875)
        (e       2.718281828459045235360287471352662497757247093)
        (pi      3.141592653589793238462643383279502884197169399)
    )
)
; setup built-in funcs
(let ([div (lambda (x y) (floor (/ x y)))]
    [quot (lambda (x y) (truncate (/ x y)))])
    (for-each
        (lambda (pair)
                (func-put! (car pair) (cadr pair))
        )
        `(
            (div     ,div)
            (log10   ,(lambda (x) (if (zero? x) +nan.0 (/ (log x) (log 10.0)))))
            (mod     ,(lambda (x y) (- x (* (div x y) y))))
            (quot    ,quot)
            (rem     ,(lambda (x y) (- x (* (quot x y) y))))
            (+       ,+)
            (-       ,-)
            (*       ,*)
            (/       ,(lambda (x y) (if (zero? y) (cond ((positive? x) +inf.0) ((negative? x) -inf.0) ((zero? x) +nan.0)) (/ x y))))
            (<       ,<)
            (>       ,>)
            (<=      ,<=)
            (>=      ,>=)
            (<>      ,(lambda (x y) (not (= x y))))
            (=       ,=)
            (^       ,expt)
            (ceil    ,ceiling)
            (exp     ,exp)
            (floor   ,floor)
            (log     ,(lambda (x) (if (zero? x) +nan.0 (log x))))
            (sqrt    ,sqrt)
            (abs     ,abs)
            (acos    ,acos)
            (asin    ,asin)
            (atan    ,atan)
            (round   ,round)
            (cos     ,cos)
            (sin     ,sin)
            (tan     ,tan)
            (trunc   ,truncate)
        )
    )
)

(define (slist-set list index value)
    (define llen (length list))
        (define (inner ls len) (
            if (< len llen)
            (if (= len index) (cons value (inner ls (+ len 1))) 
                (cons (list-ref list len) (inner ls (+ len 1))))
            ls
        ))
    (inner `() 0)
)

; predicates 
(define (sunop? expression) (or (eqv? expression `+) (eqv? expression `-))) ; Unop → ‘+’|‘−’
(define (sbinop? expression) (or (sunop? expression) (eqv? expression `*) (eqv? expression `/) (eqv? expression `%) (eqv? expression `^))) ; Binop → Unop | ‘*’|‘/’|‘%’|‘^’
(define (srepol? expression) (or (eqv? expression `=) 
    (eqv? expression `<) (eqv? expression `>) (eqv? expression `<>) 
        (eqv? expression `>=) (eqv? expression `<=) )) ; Relop → ‘=’|‘<’|‘>’|‘<>’|‘>=’|‘<=’
(define (sconstant? const) (number? const)) ; Constants are numbers.
(define (svaraiable? var)  (symbol? var))
(define (slabel? label) (label-has? label))
(define (sarray? array) (and (list? array) (= (length array) 2) (svaraiable? (car array)) (sexpression? (cadr array)) )) ; Array → ‘(’ Variable Expression ‘)’
(define (smemory? memory) (or (svaraiable? memory) (sarray? memory))) ; Memory → Array | Variable
(define (sfunction? func) (hash-has-key? *func-table* func))
(define (sexpression? expression) (if (list? expression)
    (or 
        (and (sbinop? (car expression)) (= 2 (length (cdr expression))) 
            (sexpression? (cadr expression)) (sexpression? (caddr expression)) )  ; Expression → ‘(’ Binop Expression Expression ‘)’            
        (and (sunop? (car expression)) (= 1 (length (cdr expression))) 
            (sexpression? (cadr expression)) ) ; Expression → ‘(’ Unop Expression ‘)’
        (and (sfunction? (car expression)) (= 1 (length (cdr expression))) 
            (sexpression? (cadr expression)) ) ; Expression → ‘(’ Function Expression ‘)’
        (sarray? expression)
        ; (smemory? expression) ; Expression → Memory
    )
    (or 
        (sconstant? expression) ; Expression → Constant
        (svaraiable? expression) 
        ; (smemory? expression) ; Expression → Memory
    )
))

(define (sprintable? printable) (or (string? printable) (sexpression? printable))) ; Printable → String | Expression    
(define (sifcondition? expression) (and (srepol? (car expression)) (sexpression? (cadr expression)) (sexpression? (caddr expression)) ))
(define (all? func ls) (foldl (lambda (a b) (and b (func a)) ) "#t" ls))

(define (makelist n) (if (= n 0) (list 0) (cons 0 (makelist (- n 1))))) 

; runtime 
(define (sdim! line array) (var-put! (car array) (makelist (eval! line (cadr array)))) (+ line 1) )
(define (slet! line mem expr) (cond 
            ((svaraiable? mem) (var-put! mem (eval! line expr) ))
            ((sarray? mem) (let ([array (var-get (car mem))] [index (eval! line (cadr mem))])
                (if (list? array) (var-put! (car mem) (slist-set array index (eval! line expr))) 
                    (die `(,line ": cannot set non exist array named: " ,(car mem) )) )))
            (else (die `(,line ": Illegal let statement!")) )
        )
    (+ line 1) )
(define (sgoto line label) (label-get label) )
(define (scondition? line cond)  
    (let ([repol (car cond)] [expr (cadr cond)] [exprB (caddr cond)]) 
        ((func-get repol) (eval! line expr) (eval! line exprB)) ))
(define (sif line cond label) (if (scondition? line cond) (label-get label) (+ line 1) ))
(define (sprint line printables) (for-each 
    (lambda (p) (display (if (string? p) p (eval! line p)))) printables) 
        (newline) (+ line 1) )
(define (sinput? val) (or (number? val) 
    (and (list? val) 
        (not (findf (lambda (e) (not (number? e))) val)) )))
(define (validate-input line val) (if (sinput? val) 
    val 
    (die `(,line ": Input has to be a number or number array!" ,val)) ))
(define (sinput! line memories) (if (< (length memories) 1)
    (die `(,line ": Illegal input statement! " ,memories))
    (var-put! `inputcount (foldl (lambda (mem cum) (define val (read)) (cond 
        ((eof-object? val) -1)
        ((svaraiable? mem) (begin (var-put! mem (validate-input line val)) (+ cum 1)))
        ((sarray? mem) 
            (begin (let ([array (var-get (car mem))] [index (eval!! line (cadr mem))]) 
                (if (list? array) 
                    (var-put! (car mem) (slist-set array index (validate-input line val))) 
                    (die `(,line ": cannot set non exist array named: " ,(car mem) )) 
                )
            )
            (+ cum 1))
        )
        (else (begin (println "Error during input function") -1)))) 0 memories) )
    )
    (+ line 1))

(define (preprocess! program) (for-each (lambda (line) (if (symbol? (cadr line)) (label-put! (cadr line) (car line)) `())) 
    (filter (lambda (line) (> (length line) 1)) program)
))

(define (eval! line expr) 
        (cond 
    ((sconstant? expr) expr)
    ((svaraiable? expr) (if (var-has? expr) (var-get expr) (die `(,line ": Variable not found named: " expr) )) )
    ((list? expr) (cond 
        ((and (sbinop? (car expr)) (= 2 (length (cdr expr))) ) 
            ((func-get (car expr)) (eval! line (cadr expr)) (eval! line (caddr expr)) ))
        ((and (sunop? (car expr)) (= 1 (length (cdr expr)))) ((func-get (car expr)) (eval! line (cadr expr)) ))
        ((and (sfunction? (car expr)) (= 1 (length (cdr expr)))) ((func-get (car expr)) (eval! line (cadr expr)) ))
        ((sarray? expr) (list-ref (var-get (car expr)) (eval! line (cadr expr)) )) 
        (else (die `(,line ": Illegal expression: " ,expr)))
    ))
))

(define (extract-statement state) (if (or (< (length state) 2) 
    (and (= (length state) 2) (symbol? (cadr state))) ) `() (if (symbol? (cadr state)) 
        (caddr state) (cadr state) )))
(define (eval-program! line program)
    (if (and (< (- line 1) (length program)))
        (let ([statement (extract-statement (list-ref program (- line 1)))]) (eval-program! (cond 
            ( (null? statement) (+ line 1) )
            ( (eqv? (car statement) `dim) (if (sarray? (cadr statement)) 
                (sdim! line (cadr statement)) 
                (die `(,line ": dim's argument has to be a array!")) ) )
            ( (eqv? (car statement) `let) (if (and (smemory? (cadr statement)) (sexpression? (caddr statement)) )
                (slet! line (cadr statement) (caddr statement) )
                (die `(,line ": let's arguments have to be a varaiable and an expression. " ,statement)) ) )
            ( (eqv? (car statement) `goto) (if (slabel? (cadr statement))
                (sgoto line (cadr statement))
                (die `(,line ": goto's argument has to be a label!"))) )
            ( (eqv? (car statement) `if) (if (and (list? (cadr statement)) 
                    (sifcondition? (cadr statement)) (slabel? (caddr statement)) )
                (sif line (cadr statement) (caddr statement))
                (die `(,line ": if has to be with (repol expression expression) label: " ,
                    (list (list? (cadr statement)) (sifcondition? (cadr statement)) (slabel? (caddr statement))) ))) )
            ( (eqv? (car statement) `print) (if (or (null? (cdr statement)) (all? sprintable? (cdr statement)) )
                (sprint line (cdr statement))
                (die `(,line ": print's argument has to be a printable! " ,statement)) ) )
            ( (eqv? (car statement) `input) (if (and (smemory? (cadr statement)) (all? smemory? (cddr statement)) )
                (sinput! line (cdr statement))
                (die `(,line ": input's argument has to be one memory and varlength of memories!"))) )
            ( else (die `(,line ": illegal statement! " ,statement)) )
            ) program)
        )
        (void)
    )
)

(define (run-program program)
    (preprocess! program)
    (eval-program! 1 program)
)

(main (vector->list (current-command-line-arguments)))
