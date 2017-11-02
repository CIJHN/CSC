cmake_minimum_required(VERSION 3.6)

project(scc03-re)

set(CMAKE_CXX_FLAGS "${CMAKE_CXX_FLAGS} -std=c99")
set(SOURCE_FILES intVec.c intVec.h intList.c intList.h edge.c edge.h scc03.c dfsTrace1.c dfsTrace1.h vecHandler.c vecHandler.h graphHandler.h listHandler.c listHandler.h)
add_executable(scc03-re ${SOURCE_FILES})