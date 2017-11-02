### Regular Language and Regular operation:
A language is called a regular language if some finite automaton recognizes it.

Let A and B be languages. We define the regular operations union,
concatenation, and star as follows:
- Union: A ∪ B = {x| x ∈ A or x ∈ B}.
- Concatenation: A ◦ B = {xy| x ∈ A and y ∈ B}.
- Star: A∗ = {x1x2 . . . xk| k ≥ 0 and each xi ∈ A}.

Addtionally, regular language is closed under:
- Difference
- Intersection
- Complement

To prove the language is regular, we can:
- Design DFA
- Design NFA
- Design ε-NFA
- Use closure properties 

#### Kleene's Therorem 
Kleene's Therorem states about that the language donated by regular expression and donated by DFA are SAME family of language.

### Regular Expression:
Say that R is a regular expression if R is 

1. a for some a in the alphabet Σ, 
2. ε, 
3. ∅, 
4. (R1 ∪ R2), where R1 and R2 are regular expressions, 
5. (R1 ◦ R2), where R1 and R2 are regular expressions, or 
6. (R1∗), where R1 is a regular expression. In items 1 and 2, the regular expressions a and 	

### Pumping Lemma for Regular Language
Let L be a regular language. Then there exists an integer p ≥ 1 depending only on L such that every string w in L of length at least p (p is called the "pumping length"[4]) can be written as w = xyz (i.e., w can be divided into three substrings), satisfying the following conditions:

1. |y| ≥ 1,
2. |xy| ≤ p, and
3. xynz ∈ L for all n ≥ 0.

### Finite automaton
A finite automaton is a 5-tuple (Q, Σ, δ, q0, F), where
1. Q is a finite set called the states,
2. Σ is a finite set called the alphabet,
3. δ : Q × Σ−→Q is the transition function,
4. q0 ∈ Q is the start state, and
5. F ⊆ Q is the set of accept states.


### Nondeterministic finite automaton
A nondeterministic finite automaton is a 5-tuple (Q, Σ, δ, q0, F),
where
1. Q is a finite set of states,
2. Σ is a finite alphabet,
3. δ : Q × Σε−→P(Q) is the transition function,
4. q0 ∈ Q is the start state, and
5. F ⊆ Q is the set of accept states.


### Extended transition function
δ* recursively as follows:
1. For any q ϵ Q, δ*(q, є) = q
1. For any q ϵ Q and a ϵ Σ, δ*(q, ya) = δ(δ*(q,y), a)


### Subset construction

Require 2^Q states for new DFA.

Proof that NFA has no greater power than DFA.
They are equivilent 

Used for covert NFA to DFA

### Context Free Grammar and Context Free Language
A context-free grammar is a 4-tuple (V, Σ, R, S), where
1. V is a finite set called the variables,
2. Σ is a finite set, disjoint from V , called the terminals,
3. R is a finite set of rules, with each rule being a variable and a string of variables and terminals, and
4. S ∈ V is the start variable.

**The collection of languages associated with context-free grammars are called
the context-free languages.**

### Pumping Lemma for Context Free Language
If a language L is context-free, then there exists some integer p ≥ 1 (called a "pumping length") such that every string s in L that has a length of p or more symbols (i.e. with |s| ≥ p) can be written as
`s = uvwxy`
with substrings u, v, w, x and y, such that

1. |vwx| ≤ p,
2. |vx| ≥ 1, and
3. uvnwxny ∈ L for all n ≥ 0.


### Turning machine
A Turing machine is a 7-tuple, (Q, Σ, Γ, δ, q0, qaccept, qreject), where
Q, Σ, Γ are all finite sets and
1. Q is the set of states,
2. Σ is the input alphabet not containing the blank symbol ,
3. Γ is the tape alphabet, where ∈ Γ and Σ ⊆ Γ,
4. δ : Q × Γ−→Q × Γ × {L, R} is the transition function,
5. q0 ∈ Q is the start state,
6. qaccept ∈ Q is the accept state, and
7. qreject ∈ Q is the reject state, where qreject != qaccept.
