CC = gcc
CFLAGS = -g -Wall -O0 -std=c99 -D_SVID_SOURCE

SRC = $(wildcard *.c)
HEADER = $(wildcard *.h)
OBJ = $(patsubst %.c,%.o,$(SRC))

EXE = greedy04

$(EXE): $(OBJ)
	$(CC) $(CFLAGS) -o $(EXE) $(OBJ)

$(OBJ): $(SRC)
	$(CC) $(CFLAGS) -c $(SRC)

clean:
	rm $(OBJ)
	rm $(EXE)

testMSTD:
	./$(EXE) -P -u 1 test.in

testMST:
	./$(EXE) -P 1 test.in

testSSPD:
	./$(EXE) -D -u 1 test.in

testSSP:
	./$(EXE) -D 1 test.in

	
.PHONY: clean testMSTD testMST testSSPD testSSP