let rec oddlen ls = 
  match ls with 
  | [] -> false
  | [_] -> true
  | _::_::cdr -> oddlen cdr;;

let rec evenlen ls = 
  match ls with 
  | [] -> true
  | [a] -> false
  | _::_::cdr -> evenlen ls;;

let zip a b = 
  match a, b with
  | [], [] -> []
  | a, [] -> []
  | [], b -> []
  | carA::cdrA, carB::cdrB ->
      (carA, carB) :: (zip cdrA cdrB);;

let rec unzip ls = 
  match ls with 
  | [] -> ([], [])
  | (a, b) :: cdr -> let (c, d) = unzip cdr in (a::c, b::d)
  

let rec zip a b = 
  match a, b with
  | [], b -> []
  | a, [] -> []
  | cara::cdra, carb::cdrb -> 
    (cara, carb) :: (zip cdra cdrb);;

let rec map f ls =
  match ls with 
  | [] -> []
  | car::cdr ->
    (f car) :: (map f cdr);;
  
