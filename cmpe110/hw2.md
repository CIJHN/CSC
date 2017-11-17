## Question 1

| Processor    | Cycle Time | Max Clock Frequency | Latency of Instruction (ps) | Throughtput (inst/s) |
| ------------ | ---------- | ------------------- | --------------------------- | -------------------- |
| Baseline     | 900        | 1/900               | 4000                        | 1/40 * 10^10         |
| Fast ALU     | 600        | 1/600               | 4000                        | 1/40 * 10^10         |
| Fast Decoder | 900        | 1/900               | 3200                        | 1/32 * 10^10         |

To get a fast CPU, which Latency of Instruction less or equal to 1500ps. 

Latency of Instruction =  8 * slowest instruction latency 

and 

    1500ps = 8 * slowest instruction latency 
    slowest instruction latency  = 187.5ps

Therefore, all the stages except Write Back (150ps) stage, need to have speedup:

For Fetch, 600 / 187.5 = 3.2

For Decode, 500 / 187.5 = 2.333

For Execution, 900 / 187.5 = 4.8

For Memory, 200 / 187.5 = 1.07


## Question 2A

|                       | 1   | 2   | 3   | 4   | 5   | 6   | 7   | 8   | 9   | 10  | 11  | 12  | 13  | 14  | 15  | 16  | 17  | 18  | 19  | 20  | 21  | 22  | 23  | 24  | 25  | 26  |
| --------------------- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| xor r0, r0, r0        | F   | D   | X   | M   | W   |
| mv r1, #3             |     | F   | D   | X   | M   | W   |
| mv r4, #4             |     |     | F   | D   | X   | M   | W   |
| loop: addi r3, r3, #1 |     |     |     | F   | D   | X   | M   | W   |
| addi r0, r0, #1       |     |     |     |     | F   | D   | X   | M   | W   |
| bne r0, r1, Loop      |     |     |     |     |     | F   | D   | D   | X   | M   | W   |
| loop: addi r3, r3, #1 |     |     |     |     |     |     |     |     |     | F   | D   | X   | M   | W   |
| addi r0, r0, #1       |     |     |     |     |     |     |     |     |     |     | F   | D   | X   | M   | W   |
| bne r0, r1, Loop      |     |     |     |     |     |     |     |     |     |     |     | F   | D   | D   | X   | M   | W   |
| loop: addi r3, r3, #1 |     |     |     |     |     |     |     |     |     |     |     |     |     |     |     | F   | D   | X   | M   | W   |
| addi r0, r0, #1       |     |     |     |     |     |     |     |     |     |     |     |     |     |     |     |     | F   | D   | X   | M   | W   |
| bne r0, r1, Loop      |     |     |     |     |     |     |     |     |     |     |     |     |     |     |     |     |     | F   | D   | D   | X   | M   | W   |
| addi r4, r4, #1       |     |     |     |     |     |     |     |     |     |     |     |     |     |     |     |     |     |     |     |     |     | F   | D   | X   | M   | W   |

26 cycles

## Question 2B

|                       | 1   | 2   | 3   | 4   | 5   | 6   | 7   | 8   | 9   | 10  | 11  | 12  | 13  | 14  | 15  | 16  | 17  | 18  | 19  | 20  | 21  | 22  | 23  | 24  | 25  | 26  |
| --------------------- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| xor r0, r0, r0        | F   | D   | X   | M   | W   |
| mv r1, #3             |     | F   | D   | X   | M   | W   |
| mv r4, #4             |     |     | F   | D   | X   | M   | W   |
| loop: addi r3, r3, #1 |     |     |     | F   | D   | X   | M   | W   |
| addi r0, r0, #1       |     |     |     |     | F   | D   | X   | M   | W   |
| bne r0, r1, Loop      |     |     |     |     |     | F   | D   | D   | X   | M   | W   |
| loop: addi r3, r3, #1 |     |     |     |     |     |     |     | F   | D   | X   | M   | W   |
| addi r0, r0, #1       |     |     |     |     |     |     |     |     | F   | D   | X   | M   | W   |
| bne r0, r1, Loop      |     |     |     |     |     |     |     |     |     | F   | D   | D   | X   | M   | W   |
| loop: addi r3, r3, #1 |     |     |     |     |     |     |     |     |     |     |     | F   | D   | X   | M   | W   |
| addi r0, r0, #1       |     |     |     |     |     |     |     |     |     |     |     |     | F   | D   | X   | M   | W   |
| bne r0, r1, Loop      |     |     |     |     |     |     |     |     |     |     |     |     |     | F   | D   | D   | X   | M   | W   |
| addi r4, r4, #1       |     |     |     |     |     |     |     |     |     |     |     |     |     |     |     | F   | D   | X   | M   | W   |

20 cycles

## Quesion 2C


|                       | 1   | 2   | 3   | 4   | 5   | 6   | 7   | 8   | 9   | 10  | 11  | 12  | 13  | 14  | 15  | 16  | 17  | 18  | 19  | 20  | 21  | 22  | 23  | 24  | 25  | 26  |
| --------------------- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| xor r0, r0, r0        | F   | D   | X   | M   | W   |
| mv r1, #3             |     | F   | D   | X   | M   | W   |
| mv r4, #4             |     |     | F   | D   | X   | M   | W   |
| loop: addi r3, r3, #1 |     |     |     | F   | D   | X   | M   | W   |
| addi r0, r0, #1       |     |     |     |     | F   | D   | X   | M   | W   |
| bne r0, r1, Loop      |     |     |     |     |     | F   | F   | D   | X   | M   | W   |
| loop: addi r3, r3, #1 |     |     |     |     |     |     |     | F   | D   | X   | M   | W   |
| addi r0, r0, #1       |     |     |     |     |     |     |     |     | F   | D   | X   | M   | W   |
| bne r0, r1, Loop      |     |     |     |     |     |     |     |     |     | F   | F   | D   | X   | M   | W   |
| loop: addi r3, r3, #1 |     |     |     |     |     |     |     |     |     |     |     | F   | D   | X   | M   | W   |
| addi r0, r0, #1       |     |     |     |     |     |     |     |     |     |     |     |     | F   | D   | X   | M   | W   |
| bne r0, r1, Loop      |     |     |     |     |     |     |     |     |     |     |     |     |     | F   | F   | D   | X   | M   | W   |
| addi r4, r4, #1       |     |     |     |     |     |     |     |     |     |     |     |     |     |     |     | F   | D   | X   | M   | W   |

CPI is about 1.53
## Question 3A

|                                | 1   | 2   | 3   | 4   | 5   | 6   | 7   | 8   | 9   | 10  | 11  | 12  | 13  | 14  | 15  | 16  | 17  | 18  | 19  | 20  | 21  | 22  | 23  | 24  | 25  | 26  | 27  | 28  | 29  | 30  | 31  | 32  | 33  |
| ------------------------------ | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| xor **r0**, r0, r0             | F   | D   | X   | M   | W   |     |     |     |     |     |     |     |     |     |     |     |     |     |     |
| addiu r1, **r0**, 16           |     | F   | D   | D   | X   | M   | W   |     |     |     |     |     |     |     |     |     |     |     |     |
| j L1                           |     |     |     | F   | D   | X   | M   | W   |     |     |     |     |     |     |     |     |     |     |     |
| L1: bne r0, r1, -8             |     |     |     |     | F   | D   | X   | M   | W   |     |     |     |     |     |     |     |     |     |     |
| loop: lw **r3**, 0(r2)         |     |     |     |     |     |     |     | F   | D   | X   | M   | W   |     |     |     |     |     |     |     |     |     |
| mul *r4*, **r3**, **r3**       |     |     |     |     |     |     |     |     | F   | D   | D   | D   | X0  | X1  | X2  | M   | W   |     |     |     |     |
| mul **r3**, *r4*, r3           |     |     |     |     |     |     |     |     |     |     |     | F   | D   | D   | D   | D   | X0  | X1  | X2  | M   | W   |     |     |     |
| add *r3*, **r3**, r0           |     |     |     |     |     |     |     |     |     |     |     |     |     |     |     |     | F   | D   | D   | D   | X   | M   | W   |     |     |     |
| div r3, *r3*, r1               |     |     |     |     |     |     |     |     |     |     |     |     |     |     |     |     |     |     |     | F   | D   | D   | X0  | X0  | X0  | X0  | X0  | M   | W   |     |     |     |
| addiu r0, r0, 2                |     |     |     |     |     |     |     |     |     |     |     |     |     |     |     |     |     |     |     |     |     | F   | D   | D   | D   | D   | D   | X   | M   | W   |     |     |
| sw r3, 0(r2)                   |     |     |     |     |     |     |     |     |     |     |     |     |     |     |     |     |     |     |     |     |     |     |     |     |     |     | F   | D   | X   | M   | W   |     |
| addiu r2, r2, 4                |     |     |     |     |     |     |     |     |     |     |     |     |     |     |     |     |     |     |     |     |     |     |     |     |     |     |     | F   | D   | X   | M   | W   |
| next loop (L1: bne r0, r1, -8) |     |     |     |     |     |     |     |     |     |     |     |     |     |     |     |     |     |     |     |     |     |     |     |     |     |     |     |     | F   | D   | X   | M   | W   |


Next loop starts at 29th cycle. From the `loop: lw **r3**, 0(r2)` to next `L1: bne r0, r1, -8`. It runs 8 instructions, and the loop runs for 8 times. The total number of instructions is 64 + 4 = 68.

The # of cycles for loops increments from 9th cycle `(33 - 9) * 8 = 192 `. The total # of cycles is `192 + 9 = 201`

The CPI is `201/68 = 2.9556`

## Question 3B

|                                | 1   | 2   | 3   | 4   | 5   | 6   | 7   | 8   | 9   | 10  | 11  | 12  | 13  | 14  | 15  | 16  | 17  | 18  | 19  | 20  | 21  | 22  | 23  | 24  | 25  | 26  | 27  | 28  |
| ------------------------------ | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| xor **r0**, r0, r0             | F   | D   | X   | M   | W   |     |     |     |     |     |     |     |     |     |     |     |     |     |     |
| addiu r1, **r0**, 16           |     | F   | D   | X   | M   | W   |     |     |     |     |     |     |     |     |     |     |     |     |
| j L1                           |     |     | F   | D   | X   | M   | W   |     |     |     |     |     |     |     |     |     |     |     |
| L1: bne r0, r1, -8             |     |     |     | F   | D   | X   | M   | W   |     |     |     |     |     |     |     |     |     |     |
| loop: lw **r3**, 0(r2)         |     |     |     |     |     |     | F   | D   | X   | M   | W   |     |     |     |     |     |     |     |     |     |
| mul *r4*, **r3**, **r3**       |     |     |     |     |     |     |     | F   | D   | D   | X0  | X1  | X2  | M   | W   |     |     |     |     |     |
| mul **r3**, *r4*, r3           |     |     |     |     |     |     |     |     |     | F   | D   | D   | D   | X0  | X1  | X2  | M   | W   |     |     |     |
| add *r3*, **r3**, r0           |     |     |     |     |     |     |     |     |     |     |     |     | F   | D   | D   | D   | X   | M   | W   |     |     |     |
| div r3, *r3*, r1               |     |     |     |     |     |     |     |     |     |     |     |     |     |     |     | F   | D   | X0  | X0  | X0  | X0  | X0  | M   | W   |     |     |     |
| addiu r0, r0, 2                |     |     |     |     |     |     |     |     |     |     |     |     |     |     |     |     | F   | D   | D   | D   | D   | D   | X   | M   | W   |     |     |
| sw r3, 0(r2)                   |     |     |     |     |     |     |     |     |     |     |     |     |     |     |     |     |     |     |     |     |     | F   | D   | X   | M   | W   |     |
| addiu r2, r2, 4                |     |     |     |     |     |     |     |     |     |     |     |     |     |     |     |     |     |     |     |     |     |     | F   | D   | X   | M   | W   |
| next loop (L1: bne r0, r1, -8) |     |     |     |     |     |     |     |     |     |     |     |     |     |     |     |     |     |     |     |     |     |     |     | F   | D   | X   | M   | W   |


Next loop starts at 24th cycle. From the `loop: lw **r3**, 0(r2)` to next `L1: bne r0, r1, -8`. It runs 8 instructions, and the loop runs for 8 times. The total number of instructions is 64 + 4 = 68.

The # of cycles for loops increments from 8th cycle `(28 - 8) * 8 = 160 `. The total # of cycles is `160 + 9 = 169`

The CPI is `169/68 = 2.485`

## Question 3C

The control hazard will happen after the line `L1: bne r0, r1, -8`. We could use the predictor to solve this.


## Question 4A


|                                | 1   | 2   | 3   | 4   | 5   | 6   | 7   | 8   | 9   | 10  | 11  | 12  | 13  | 14  | 15  | 16  | 17  | 18  | 19  | 20  | 21  | 22  | 23  | 24  | 25  | 26  | 27  | 28  | 29  | 30  | 31  | 32  | 33  |
| ------------------------------ | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| xor **r0**, r0, r0             | F   | D   | X   | M   | W   |     |     |     |     |     |     |     |     |     |     |     |     |     |     |
| addiu r1, **r0**, 16           |     | F   | D   | /   | X   | M   | W   |     |     |     |     |     |     |     |     |     |     |     |     |
| j L1                           |     |     | F   | D   | /   | X   | M   | W   |     |     |     |     |     |     |     |     |     |     |     |
| L1: bne r0, r1, -8             |     |     |     | F   | D   | /   | X   | M   | W   |     |     |     |     |     |     |     |     |     |     |
| loop: lw **r3**, 0(r2)         |     |     |     |     |     |     |     | F   | D   | X   | M   | W   |     |     |     |     |     |     |     |     |     |
| mul *r4*, **r3**, **r3**       |     |     |     |     |     |     |     |     | F   | D   | /   | /   | X0  | X1  | X2  | M   | W   |     |     |     |     |
| mul **r3**, *r4*, r3           |     |     |     |     |     |     |     |     |     | F   | D   | /   | /   | /   | /   | /   | X0  | X1  | X2  | M   | W   |     |     |     |
| add *r3*, **r3**, r0           |     |     |     |     |     |     |     |     |     |     | F   | D   | /   | /   | /   | /   | /   | /   | /   | /   | X   | M   | W   |     |     |     |
| div r3, *r3*, r1               |     |     |     |     |     |     |     |     |     |     |     | F   | D   | /   | /   | /   | /   | /   | /   | /   | /   | /   | X0  | X0  | X0  | X0  | X0  | M   | W   |     |     |     |
| addiu r0, r0, 2                |     |     |     |     |     |     |     |     |     |     |     |     | F   | D   | X   | M   | //  | //  | //  | //  | //  | //  | //  | //  | //  | //  | //  | //  | //  | W   |     |     |
| sw r3, 0(r2)                   |     |     |     |     |     |     |     |     |     |     |     |     |     | F   | D   | X   | M   | //  | //  | //  | //  | //  | //  | //  | //  | //  | //  | //  | //  | //  | W   |     |
| addiu r2, r2, 4                |     |     |     |     |     |     |     |     |     |     |     |     |     |     | F   | D   | X   | M   | //  | //  | //  | //  | //  | //  | //  | //  | //  | //  | //  | //  | //  | W   |
| next loop (L1: bne r0, r1, -8) |     |     |     |     |     |     |     |     |     |     |     |     |     |     |     | F   | D   | X   | M   | //  | //  | //  | //  | //  | //  | //  | //  | //  | //  | //  | //  | //  | W   |

