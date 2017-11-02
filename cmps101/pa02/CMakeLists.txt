cmake_minimum_required(VERSION 3.6)

project(graph02)

set(CMAKE_CXX_FLAGS "${CMAKE_CXX_FLAGS} -std=c99")
set(SOURCE_FILES intVec.c intVec.h intList.c intList.h edge.c edge.h
        graphHandler.h listHandler.c intList.c vecHandler.c vecHandler.h graph02.c)
add_executable(graph02 ${SOURCE_FILES})