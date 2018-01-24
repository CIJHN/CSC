## 1A

|     | Core | Request Type | C0 State | C1  State | C2  State | C3  State |
| --- | ---- | ------------ | -------- | --------- | --------- | --------- |
| 0   | 0    | Read x       | valid    | invalid   | invalid   | invalid   |
| 1   | 1    | Read x       | invalid  | valid     | invalid   | invalid   |
| 2   | 2    | Read x       | invalid  | invalid   | valid     | invalid   |
| 3   | 3    | Write x      | invalid  | invalid   | invalid   | valid     |
| 4   | 1    | Read x       | invalid  | valid     | invalid   | invalid   |

## 1B

|     | Core | Request Type | C0 State | C1  State | C2  State | C3  State |
| --- | ---- | ------------ | -------- | --------- | --------- | --------- |
| 0   | 0    | Read x       | shared   | invalid   | invalid   | invalid   |
| 1   | 1    | Read x       | shared   | shared    | invalid   | invalid   |
| 2   | 2    | Read x       | shared   | shared    | shared    | invalid   |
| 3   | 3    | Write x      | invalid  | invalid   | invalid   | modified  |
| 4   | 1    | Read x       | invalid  | shared    | invalid   | shared    |

## 1C

|     | Core | Request Type | C0 State  | C1  State | C2  State | C3  State |
| --- | ---- | ------------ | --------- | --------- | --------- | --------- |
| 0   | 0    | Read x       | exclusive | invalid   | invalid   | invalid   |
| 1   | 1    | Read x       | shared    | shared    | invalid   | invalid   |
| 2   | 2    | Read x       | shared    | shared    | shared    | invalid   |
| 3   | 3    | Write x      | invalid   | invalid   | invalid   | modified  |
| 4   | 1    | Read x       | invalid   | shared    | invalid   | shared    |


# 2. Cache Coherence with Memory Subsystem (28 Points)

Each of those cores has a private 32KB L1 Cache, with 64 byte cacheline size, is 2-way set-associative, and uses write back. All 4 cores share a 512KB L2 cache which has 64 byte cacheline size, and is 8-way set associative.

For L1 cache, there are 32KB cache, with 64 byte size, so the # of cachelines is (32 * 1024) / 64 = 512. Since it's 2-way associative, the # of set is 512 / 2 = 256. The 256 sets need 8 bits to represent. So, the `index` takes 8 bits. The `offset` takes 6 bits.

|     | Core | Request Type | Address                                      | C0 L1 State | C1 L1 State | C2 L1 State | C3 L1 State |
| --- | ---- | ------------ | -------------------------------------------- | ----------- | ----------- | ----------- | ----------- |
| 0   | 0    | Load         | 0x00ffabc0 (index: 10101111, offset: 000000) | E           | -           | -           | -           |
| 1   | 0    | Store        | 0x00ffabc8 (index: 10101111, offset: 001000) | M           | -           |
| 2   | 1    | Load         | 0x00ffabd4 (index: 10101111, offset: 010100) | S           | S           |
| 3   | 1    | Store        | 0x00ffabd8 (index: 10101111, offset: 011000) | I           | M           |
| 4   | 1    | Load         | 0x00afabc0 (index: 10101111, offset: 000000) |             | E           |
| 5   | 2    | Load         | 0x00afabc8 (index: 10101111, offset: 001000) |             | S           | S           |
| 6   | 1    | Load         | 0x00bfabf0 (index: 10101111, offset: 110000) |             | E           |             |             |
| 7   | 0    | Load         | 0x00ffabc0 (index: 10101111, offset: 000000) | S           | S           |


# 3

We have 16KB page size, which is `16384 = 2^14`. Therefore, the `page offset` takes 14 bits, remaining 26 bits for addressing. So, there are `2^26` pages entries.

The max size of addressable physical memory is `2^40 bits = 137.438953 gigabytes`.

For one-level page, there are `2^26` pages and the size of table is `2^26 * 4 bytes  = 2^28 bytes`. 

For two-levels page, we can evenly divide the page bits into 2 parts, each with 13 bits. 8GB takes 33 bits to address. So, exclusing the page offsets, there are `33 - 14 = 19` bits space for pages.

After the second level paging, we need `19 - 13 = 6` bits for fisrt level paging.

So the total of size of the table:

2^13 * 4 bytes + 2^19 * 4 = 532480 * 4 = 2129920 bytes


