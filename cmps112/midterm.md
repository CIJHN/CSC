# Midterm for CMPS112

This document contains the possible knowledge for cmps112 midterm.

## Commen Sense of Languages

### Languages

| Language   | Author                       | Features                                                     |
| ---------- | ---------------------------- | ------------------------------------------------------------ |
| Lisp       | McCarthy                     | dynamic-strong typed, functional                             |
| Scheme     | Steele and Sussman           | dynamic-strong typed, functional                             |
| λ-calculus | Alonzo Church                | mathematics form                                             |
| BASIC      | John Kemeny and Thomas Kurtz |                                                              |
| COBOL      |                              | designed for business data processing                        |
| OCaml      |                              | static-strong typed, functional, OO, static type inference   |
| Java       |                              | static-strong typed, OO                                      |
| C          |                              | static-weak typed                                            |
| C++        |                              | static-strong typed, OO, (someone think cpp is weak type...) |
| make       |                              | a ‘‘little’’ language. (not turning complete!)           |


Lisp and Scheme are standard `functional programming language` (of course). They are based on `λ-calculus`

### Evaluation in strong typed language:

1. Every expression has exactly one type.

2. When an expression is evaluated, exactly one of the following general things might happen :

    - it may evaluate to a value of the same type as the expression,
    - it may raise an exception,
    - it may not terminate,
    - it may exit.

### Beta Reduction

The procedure that evaluate (reduce) the expression with value:

    (lambda a -> a + b * a) (5)
reduce to

    (5 + b * 5)

### Go To Statement Considered Harmful

It was published on Com- munications of the ACM, Vol. 11, No. 3, March 1968 by **Edsger Dijkstra**.

~~I think this idea is really well-known...~~

## Common functional operations

### reduce (fold_left)

Scheme:
```(scheme)
(define (reduce func init ls) 
    (if (null? ls) init
        (reduce func (func init (car ls)) (cdr ls))
    )
)
```

OCaml:
```(ocaml)
let rec reduce func init ls = 
    match (ls) with 
    | [] -> init
    | car::cdr -> 
        reduce func (func init car) cdr
```

### map

### filter


## Useful Links

[TypingQuadrant](http://wiki.c2.com/?TypingQuadrant), [History of Programming Languages](https://quizlet.com/161736404/ics-history-of-programming-languages-flash-cards/),
[Beta Reduction](https://wiki.haskell.org/Beta_reduction), [OCaml and Java](http://wanwenli.com/programming/2013/12/27/Type-Systems.html)