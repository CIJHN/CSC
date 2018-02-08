## Question 1. A

|                | Opcode | Dest. Register | Source Register 1 | Source Register 2 |
| -------------- | ------ | -------------- | ----------------- | ----------------- |
| Number of Bits | 3      | 3              | 3                 | 3                 |

Total 12 bits

## Question 1. B

|                | Opcode | Register 0 | Register 1 | Immediate |
| -------------- | ------ | -------------- | ----------------- | ----------------- |
| Number of Bits | 4      | 3              | 3                 | 3                 |

Total number of bits in ISA is 13 bits

## Question 2.A

The program have: `xor, mov, jmp, mul, add, ld, sub, st, bne` 9 types of instructions. It will finnaly execute 19 instructions if the program runs. There are 3 memory type instructions: `ld, st`. If will finally execute 4 memory instructions if the program run. The proportion of memory instructions is 4/19.

## Question 2.B

According to Amdahl’s Law: 

The overall speedup = `1 / ((1 - P) + (P / S))`

The P is 4/19 and the S = 20.

Therefore, the overall speedup = `1 / ((1 - (4/19)) + ((4/19) / 20))`
= `1 / ((15/19) + (4/380)) = 1.25`

## Question 2.C

Overall speedup = `1 / (1 - 4/19)` = `19 / 15` = `1.2666667`

## Question 3.A

CPI for processor A = `0.5 * 1 + 0.2 * 2 + 0.2 * 3 + 0.1 * 2 = 0.5 + 0.4 + 0.6 + 0.2 = 1.7`
CPI for processor B = `0.5 * 1 + 0.2 * 2 + 0.2 * 2 + 0.1 * 4 = 0.5 + 0.4 + 0.4 + 0.4 = 1.7`

## Question 3.B

The number of cycles to run program = `10 ^ 9` inst * `1.7` cycle/inst = `1.7 * (10 ^ 9)` cycles 

For A, 2GHz means the processor runs `2 * (10 ^ 9)` cycles/second. Then, it needs `1.7 / 2` = `0.85` seconds for this program.

For B, 3GHz means the processor runs `3 * (10 ^ 9)` cycles/second. Then, it needs `1.7 / 3` = `0.566667` seconds for this program.

Their CPI are the same, but their clock are different. The clock Frequncy of B is greater, so processor B is faster. Speedup = `3/2` = `1.5`

## Question 3.C

For processor A, making Load instructions faster is better. Before the speedup, the Load takes, `2 * 0.2` = `0.4`. After the speedup, the Load takes, `1 * 0.2` = `0.2`. The difference is `0.4 - 0.2` = `0.2`. If we improve the Branch, comparing speed before, `2 * 0.1` = `0.2`, and the speed after, `1 * 0.1` = `0.1`, the difference is `0.2 - 0.1` = `0.1`, which is less than `0.2`. Therefore, improving Load is better choise.

## Question 3.D

For both A and B, the CPI is `1.7` cycle/instruction and the IPC is `1 / 1.7` instruction/cycle.

For processor A, 2GHz means the processor runs 2 * (10 ^ 9) cycles/second. Therefore, one instruction per second is `2 * (10 ^ 9) / 1.7` IPS, and MIPS is `2 * (10 ^ 9) / 1.7 / (10 ^ 6)` = `1.176471 * (10 ^ 3)`

For processor B, 3GHz means the processor runs 3 * (10 ^ 9) cycles/second. Therefore, one instruction per second is `3 * (10 ^ 9) / 1.7` IPS, and MIPS is `3 * (10 ^ 9) / 1.7 / (10 ^ 6)` = `1.76471 * (10 ^ 3)`

## Question 3.E

Use Arthmetic:

Average Latency = `1/2 * (1.7 / 2 + 1.7 / 3)` = `85 / 120` = `17 / 24` = `0.7083`
