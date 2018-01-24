father(X, Y) :- parents(X, _ Y).
mother(X, Y) :- parents(_, X, Y).


oddlen([_]).
oddlen([A,B|C]) :- oddlen(C).

evenlen([]).
evenlen([A,B|C]) :- evenlen(C).


gcd(A, A, C) :- C is A.
gcd(A, B, C) :- A > B, T.


ispath(A, B) :- arror(A, B).
ispath(A, B) :- arror(A, C), arror(C, B).

findpath(X, Y, [A, B]) :- arror(A, B).
findpath(X, Y, [A | Q]) :- arror(A, C), findpath(C, B, Q).

sum([], 0).
sum([A|B], C) :- sum(B, D), C is D + A.

len([], 0).
len([A|B], C) :- len(B, D), C is D + 1.

