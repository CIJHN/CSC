CC = gcc
CFLAGS = -g -Wall -O0 -std=c99 -D_SVID_SOURCE

SRC = $(wildcard *.c)
HEADER = $(wildcard *.h)
OBJ = $(patsubst %.c,%.o,$(SRC))

EXE = graph01

$(EXE): $(OBJ)
	$(CC) $(CFLAGS) -o $(EXE) $(OBJ)

$(OBJ): $(SRC)
	$(CC) $(CFLAGS) -c $(SRC)

clean:
	rm $(OBJ)
	rm $(EXE)

test:
	./$(EXE) test.in
	
.PHONY: clean test