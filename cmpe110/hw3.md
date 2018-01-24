## Question 1. Cache Mapping and Overhead (24 Points)

In this problem, we will explore the different cache mapping schemes, and analyse how they
impact hardware design choices. You are to design a 256-KByte byte addressable cache, with
16-word cachelines, with 4-Byte word size. The size of the address is 32-bits. Using these
values, you are to design the following.

### Question 1.A Direct Mapped (8 Points)

Assume the cache is Direct Mapped. Using the information given to you, calculate the number of bits used for the offset, index, and tag, and fill the table below. Calculate the tag overhead, using 1 bit for Valid, and the number of bits you calculated for the tag.

| Field  | Size(bits) |
| ------ | ---------- |
| Offset | 6          |
| Index  | 12         |
| Tag    | 14         |

### Question 1.B Fully-Associative (8 Points)

Assume the cache is fully-associative. Using the information given to you, calculate the number of bits used for the offset, index, and tag, and fill the table below. Calculate the tag overhead, using 1 bit for Valid, and the number of bits you calculated for the tag.

| Field  | Size(bits) |
| ------ | ---------- |
| Offset | 6          |
| Index  | 0          |
| Tag    | 26         |

### Question 1.C 4-Way Set-Associative (8 Points)

Assume the cache is 4-way set-associative. Using the information given to you, calculate the number of bits used for the offset, index, and tag, and fill the table below. Calculate the tag overhead, using 1 bit for Valid, and the number of bits you calculated for the tag.

| Field  | Size(bits) |
| ------ | ---------- |
| Offset | 6          |
| Index  | 10         |
| Tag    | 16         |


## Question 2. Cache Misses and Latency (24 Points)

| Address | Instruction      | Iteration 1 | Iteration 2 | Index |
| ------- | ---------------- | ----------- | ----------- | ----- |
|         | loop:            |             |             |       |
| 0x108   | addiu r1, r1, -1 | compulsory  |             | 0     |
| 0x11c   | addiu r2, r2, 1  | compulsory  | conflict    | 1     |
| 0x110   | j foo            | conflict    | conflict    | 1     |
|         | foo:             |             |             |       |
| 0x218   | addiu r6, r6, 1  | conflict    | conflict    | 1     |
| 0x21c   | bne r1, r0, loop | conflict    | conflict    | 1     |

Conflict happends 7 times, compulsory happens 2 times, capacity happens 0 times. 

## Question 2.B Latency (10 Points)

The cache will continually access the index 0 and 1. It's a thrashing on index 1. After the first iteration, it will continually conflict. Therefore, for 32 iterations, it will `31 * 4 + 3 = 127` conflict misses and `2` compulsory misses. It will take `(127 + 2) * 6 + 31 * 1 = 774 + 31 = 805` cycles. 

The miss rate for 32 iterations is `(5 + 31 * 4) / (32 * 5) = 0.80625`

The average instruction cache access latency is `805 / (32 * 5) = 5.03125` 

## Question 3.A Ideal System (8 Points)

Time for A: 1 / 3 * 1.5 = 0.5

Time for B: 2 / 4 = 0.5

Speedup = 1

## Question 3.B Full system (8 Points) 

CPI A = 1 + (250 * 0.03 + 15) * (0.03 * 0.7 + 0.09 * 0.3) = 2.08

CPI B = 2 + (300 * 0.04 + 12) * (0.02 * 0.7 + 0.05 * 0.3) = 2.696

Time for A: 2.08 / 3 * 1.5 = 1.04

Time for B: 2.696 / 4 = 0.674

Speedup = 1.543



