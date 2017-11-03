(* $Id: bigint.ml,v 1.5 2014-11-11 15:06:24-08 - - $ *)

open Printf

module Bigint = struct

    type sign     = Pos | Neg
    type bigint   = Bigint of sign * int list
    let  radix    = 10
    let  radixlen =  1

    let car       = List.hd
    let cdr       = List.tl
    let map       = List.map
    let reverse   = List.rev
    let strcat    = String.concat
    let strlen    = String.length
    let strsub    = String.sub
    let zero      = Bigint (Pos, [])

    let charlist_of_string str = 
        let last = strlen str - 1
        in  let rec charlist pos result =
            if pos < 0
            then result
            else charlist (pos - 1) (str.[pos] :: result)
        in  charlist last []

    let bigint_of_string str =
        let len = strlen str
        in  let to_intlist first =
                let substr = strsub str first (len - first) in
                let digit char = int_of_char char - int_of_char '0' in
                map digit (reverse (charlist_of_string substr))
            in  if   len = 0
                then zero
                else if   str.[0] = '_'
                     then Bigint (Neg, to_intlist 1)
                     else Bigint (Pos, to_intlist 0)

    let string_of_bigint (Bigint (sign, value)) =
        match value with
        | []    -> "0"
        | value -> let reversed = reverse value
                   in  strcat ""
                       ((if sign = Pos then "" else "-") ::
                        (map string_of_int reversed))
    
    let clear_digit ls = 
        (* printf "clear_digit %s\n" (string_of_bigint (Bigint (Pos, ls))) ; *)
        let rec clear_ l = 
            (* printf "clear_ %s\n" (string_of_bigint (Bigint (Pos, l))) ; *)
            match (l) with
            | []  -> []
            | [0] -> []
            | car::cdr -> 
                let rem = clear_ cdr in 
                    match (car, rem) with 
                    | 0, [] -> []
                    | _ -> car :: rem
        in clear_ ls
            
        let rec compare' list1 list2 = match (list1, list2) with
        | [], []                 ->  0
        | list1, []              ->  1
        | [], list2              -> -1
        | car1::cdr1, car2::cdr2 -> 
            let retval = compare' cdr1 cdr2
            in if retval = 0 && car1 != car2
               then (if car1 > car2
                    then 1
                    else (if car1 < car2
                    then -1
                    else 0))
              else retval

    let cmp (Bigint (neg1, value1)) (Bigint (neg2, value2)) =
        if neg1 = neg2
        then compare' value1 value2
        else if neg1 = Neg
            then -1
            else 1


    let rec cmp' list1 list2 = 
        let rec cmp'' list1 list2 last1 last2 = match (list1, list2, last1, last2) with
            | [], [], last1, last2      -> last1 >= last2
            | list1, [], last1, last2   -> true
            | [], list2, last1, last2   -> false
            | car1::cdr1, car2::cdr2, last1, last2 ->
                cmp' cdr1 cdr2 car1 car2
        in cmp'' list1 list2 0 0
            
    let add' (list1: int list) (list2: int list) : int list =
        let rec add'' list1 list2 carry =  
            match (list1, list2, carry) with
            | list1, [], 0       -> list1
            | [], list2, 0       -> list2
            | list1, [], carry   -> add'' list1 [carry] 0
            | [], list2, carry   -> add'' [carry] list2 0
            | car1::cdr1, car2::cdr2, carry ->
                let sum = car1 + car2 + carry
                in  sum mod radix :: add'' cdr1 cdr2 (sum / radix)
        in add'' list1 list2 0

    let sub' (list1: int list) (list2: int list) : int list = 
        let rec sub'' list1 list2 carry = match (list1, list2, carry) with
        | list1, [], 0      -> list1
        | [], list2, 0      -> list2
        | list1, [], carry  -> sub'' list1 [carry] 0
        | [], list2, carry  -> sub'' [carry] list2 0
        | car1::cdr1, car2::cdr2, carry -> 
            let diff = car1 - car2 - carry
            in (diff + radix) mod radix :: sub'' cdr1 cdr2 (if diff < 0 then 1 else 0)
        in clear_digit (sub'' list1 list2 0)

    let add (Bigint (neg1, value1)) (Bigint (neg2, value2)) =
        match (neg1, neg2) with
            | Pos, Neg  -> if cmp' value1 value2 then Bigint (Pos, sub' value1 value2) else Bigint (Neg, sub' value2 value1)
            | Neg, Pos  -> if cmp' value1 value2 then Bigint (Neg, sub' value1 value2) else Bigint (Pos, sub' value2 value1)
            | _         -> Bigint (neg1, add' value1 value2)

    
    let sub (Bigint (neg1, value1)) (Bigint (neg2, value2)) =
        match (neg1, neg2) with 
        | Pos, Neg  -> Bigint (Pos, add' value1 value2) 
        | Neg, Pos  -> Bigint (Neg, add' value1 value2)
        | Pos, Pos  -> if cmp' value1 value2 then Bigint (Pos, sub' value1 value2) else Bigint (Neg, sub' value2 value1)
        | Neg, Neg  -> if cmp' value1 value2 then Bigint (Neg, sub' value1 value2) else Bigint (Pos, sub' value2 value1)
    
    let rec mulval' ls value carry = match (ls, value, carry) with
        | ls, 0, 0              -> [0]
        | [], value, 0          -> []
        | ls, 0, carry          -> [carry]
        | [], value, carry      -> [carry]
        | car::cdr, value, carry ->
            let product = car * value + carry
            in product mod radix :: mulval' cdr value (product / radix)
    
    let rec right_shift ls times = if times = 0 then ls else right_shift (0 :: ls) (times - 1)

    let rec mul' (list1: int list) (list2: int list): int list =
        let rec mul'' (list1: int list) (list2: int list) (carry: int list) (digit: int) : int list = match (list1, list2, carry) with
            | list1, [], []         -> list1
            | [], list2, []         -> list2
            | list1, [], carry   -> carry
            | [], list2, carry   -> carry
            | list1, car::cdr, [] ->
                (* printf "%s x %d + 0\n" (string_of_bigint (Bigint (Pos, list1))) car ; *)
                mul' list1 cdr (mulval' list1 car 0) (digit + 1)
            | list1, car::cdr, carry ->
                (* printf "%s x %d + %s\n" (string_of_bigint (Bigint (Pos, list1))) car (string_of_bigint (Bigint (Pos, carry))) ; *)
                let product = mulval' list1 car 0
                in mul' list1 cdr (add' (right_shift product digit) carry) (digit + 1)
        in mul'' list1 list2 [] 0
            
    let mul (Bigint (neg1, value1)) (Bigint (neg2, value2)) =
        Bigint ((if neg1 = neg2 then Pos else Neg), mul' value1 value2)

    (* divide the dividend with dividor, return the quot and remainder *)
    let divrem (dividend: int list) (dividor: int list): int list, int list= 
        let rec egydivrem (dividend: int list) (quot: int list) (accum: int list): int list, int list=
            if cmp' accum (sub' dividen accum) then quot, accums
            else 
                let quot', accum' = egydivrem dividend (add' quot quot) (add' accum accum)
                in let sum = add' accum accum' 
                in if cmp' sum dividend then quot', accum'
                else (add' quot' quot) sum
        in let quot, approx = egydivrem dividend 1 dividor
        in quot, sub' dividend approx

    let div (Bigint (neg1, value1)) (Bigint (neg2, value2)) =
        if cmp' value1 value2 then Bigint ((if neg1 = neg2 then Pos else Neg), 
            let quot, rem = divrem value1 value2 in quot)
        else Bigint ((if neg1 = neg2 then Pos else Neg), 
            let quot, rem = divrem value2 value1 in quot)

    let rem (Bigint (neg1, value1)) (Bigint (neg2, value2)) =
        if cmp' value1 value2 then Bigint ((if neg1 = neg2 then Pos else Neg), 
            let quot, rem = divrem value1 value2 in rem)
        else Bigint ((if neg1 = neg2 then Pos else Neg), 
            let quot, rem = divrem value2 value1 in rem)
        
    let even ls =
        match (ls) with
        | car::cdr -> 
            match (car) with 
            | (0|2|4|6|8) -> true
            | _ -> false
        | _ -> true
    
    let rec pow' (list1: int list) (list2: int list) (accum : int ) = match (list2) with 
        | list2 when (cmp' (list2 [1] ) -> accum
        | list2 when even list2 -> pow'(mul' list1 list1),(divrem list2 [2]),accum
        
        | list2 -> 
            pow' list1 (sub' list2 [1]) (mul' list1 accum)
    (* for x^n  n >0*)
     let pow (list1: int list) (list2: int list) (accum : int ) = match ( list1, list2, accum)with  
     | list1, [0], accum   -> 1
     | [0], list2, accum   -> 0
     | list1，list2, accum -> if (compare' list2 [0])= -1  then pow'([1],list1), (list2), [1]
        else pow' (list1, list2, [1])
    (*for n<=0  *)
end

