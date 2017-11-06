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

### Polymorphism

Universal polymorphism are **parametric polymorphism** and **inclusion(subtyping) polymorphism**.

Parametric polymorphism is basically the java generic and c++ template. 

The inclusion polymorphism is the hierarchy structure in java and c++ 

These polymorphsm brings us:

- Parametric: the ablity to define the class for certain types that adapts with same operations/functions/methods set.
- Inclusion: the ability to define the different classes and use them with a same interfaces.

Parametric(java):

    List<String> list = new ArrayList<>();
    list.add("a");
    List<Integer> intList = new ArrayList<>();
    intList.add(1);
    // here the same method shared with the different generic-type

Inclusion(java):

    class Worker {
        public void work() { /*do some work*/ }
    }

    class Programmer extends Worker {
        @Override
        public void work() { /* do coding stuff */ }
    }

    class Manager extends Worker {
        @Override
        public void work() { /* do managing stuff */ }
    }

    List<Worker> allWorkersInCompany = new ArrayList<>();
    allWorkersInCompany.add(new Manager());
    allWorkersInCompany.add(new Programmer());
    allWorkersInCompany.add(new Programmer());
    for (Worker w : allWorkersInCompany) {
        w.work(); // all workers, whatever programmer or manager, are called work with same interface
    }

Two other polymorphsm:

- Coercion: implicit type conversion between several types
- Overloading: a single identifier denotes several functions/methods

Coercion (java): 

    1 + "1" // int + string -> string
    1 + 0.1f // int + float -> float

Overloading(c++):

    class Matrix2X2 {
        // overload the + operator
    }

    auto a = Matrix2X2(2, 2, 3, 3);
    auto b = Matrix2X2(1, 1, 3, 3);
    auto c = a + b; // c == Matrix2X2(3, 3, 6, 6);
    auto d = 1 + 1; // d == 2
    // here + operator perform two function with different type

## Common functional operations and implementations

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

### reverse

Scheme:

```(scheme)
(define (reverse ls)
    (define (reversee ls accum)
        (if (null? ls)
            accum
            (reversee (cdr ls) (cons (car ls) accum) )
        )
    )
    (reversee ls `())
)
```

OCaml:

```(ocaml)
let reverse ls = 
    let rec reversee ls accum = 
    match (ls) with 
    | [] -> accum
    | car::cdr ->
        reversee cdr (car :: accum)
    in reversee ls []
```

### map

Scheme:

```(scheme)
(define (map func list)
    (define (mapp func list accum)
        (if (null? list) 
            accum
            (mapp func (cdr list) (cons (func (car list)) accum) )
        )
    )
    (reverse (mapp func list `()))
)
```

```(scheme)
(define (map func list)
    (reverse (fold_left 
        (lambda (ls val) (cons (func val) ls)) 
        `() 
        list)
    )
)
```

OCaml:

```(ocaml)
let map func ls = 
    let rec mapp func ls accum = 
        match (ls) with
        | [] -> accum
        | car::cdr ->
            mapp func cdr ((func car) :: accum)
    in List.rev (mapp func ls [])
```

```(ocaml)
let map func ls = 
    List.rev (List.fold_left 
        (fun prev v -> ((func v) :: prev)) [] ls)
```

### filter


## Useful Links

[TypingQuadrant](http://wiki.c2.com/?TypingQuadrant), 

[History of Programming Languages](https://quizlet.com/161736404/ics-history-of-programming-languages-flash-cards/),

[Beta Reduction](https://wiki.haskell.org/Beta_reduction), [OCaml and Java](http://wanwenli.com/programming/2013/12/27/Type-Systems.html), 

[Polymorphism](https://www.javaworld.com/article/2075223/core-java/reveal-the-magic-behind-subtype-polymorphism.html),

[Universal Polymorphism](https://en.wikibooks.org/wiki/Introduction_to_Programming_Languages/Universal_Polymorphism)

[OCaml Subtyping and Inclusion Polymorphism](https://caml.inria.fr/pub/docs/oreilly-book/html/book-ora144.html)