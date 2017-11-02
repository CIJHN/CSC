CC = gcc
CFLAGS = -g -Wall -O0 -std=c99 -D_SVID_SOURCE

SRC = $(wildcard *.c)
HEADER = $(wildcard *.h)
OBJ = $(patsubst %.c,%.o,$(SRC))

EXE = scc03

$(EXE): $(OBJ)
	$(CC) $(CFLAGS) -o $(EXE) $(OBJ)

$(OBJ): $(SRC)
	$(CC) $(CFLAGS) -c $(SRC)

clean:
	rm $(OBJ)
	rm $(EXE)

testBase:
	./$(EXE) -V test1.in

testLVBase:
	./$(EXE) -V test1.in
	./$(EXE) -L test1.in

testUBase:
	./$(EXE) -V -u test1.in

testLUBase:
	./$(EXE) -L -u test1.in

test:
	./$(EXE) -V test.in

testU:
	./$(EXE) -V -u test.in

testLU:
	./$(EXE) -L -u test.in

testLVU:
	./$(EXE) -L test.in
	./$(EXE) -V test.in


	
.PHONY: clean testBase testLVBase testUBase testLUBase test testU testLU testLVU