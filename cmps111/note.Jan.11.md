## OS

abstract layer for hardware providing user an easy interface.

head(toggle by accurator) -> sector(about 4k modern) -> track(sync by cylinder) -> platt -> disk

system call handle by os for safety, and easy to handle.


a process:
    running program counter in its address space
    address range (base & limit),
    states (prog counter, registers, stack pointer),
    children,

Layered OS:
    divide the os into multi-layers
    outer can only access inner by some specific gate
    (really similar with networking layer...)

Microkernels:
    only the notion of process in kernel
    provide the process communication
    all other things (mem mang, device driv, process mang, filesys) go to user mode

Virtual machine:
    wrap all state data of computer into managed folder/file

There is a single process created by OS managing all the other process

file system:

inter-process communication by PIPE:

