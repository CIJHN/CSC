
project(graph01)

set(CMAKE_CXX_FLAGS "${CMAKE_CXX_FLAGS} -std=c99")
set(SOURCE_FILES intList.c intList.h edge.c edge.h graph01.c)
add_executable(graph01 ${SOURCE_FILES})
