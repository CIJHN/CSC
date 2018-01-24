Array extend [
    max [
        | ma |
        (self size = 0) ifTrue: [ ^ nil ].
        ma := self at: 1.
        2 to: self size do: [
            | :i |
            ((self at: i) > ma)
            ifTrue: [
                ma := (self at: i).
            ].
        ]
        ^ ma.
    ]
].

Object subclass: List [
    | _car _cdr | 
    class List >> new [
        ^ nil.
    ]

    class List >> car: ca cdr: cd [
        | result |
        result := super new.
        result car: ca cdr: cd.
        ^ result.
    ]

    car: ca cdr: cd [
        _car := ca.
        _cdr := cd.
    ]

    car [ ^ _car ]
    cdr [ ^ _cdr ]
].

Object subclass: Num [
    | _num |

    class Num >> new: n [
        | result |
        result := super new.
        result set: n.
        ^ result.
    ]

    set: n [
        _num := n.
    ]

    value [ ^ _num. ]
].

Object subclass: Mul [
    | _left _right |

    class Mul >> left: l right: r [
        | result |
        result := super new.
        result left: l right: r.
        ^ result.
    ]

    left: l right: r [
        _left := l.
        _right := r.
    ]

    value [
        ^ ((_left value) * (_right value)). 
    ]
].
