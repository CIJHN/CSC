cmake_minimum_required(VERSION 3.6)

project(pa04)

set(CMAKE_CXX_FLAGS "${CMAKE_CXX_FLAGS} -std=c99")
set(SOURCE_FILES edge.c edge.h greedy04.c
        minPQ.h minPQ.c loadWgtGraph.h edgeVec.c edgeVec.h loadWgtGraph.c)
add_executable(pa04 ${SOURCE_FILES})