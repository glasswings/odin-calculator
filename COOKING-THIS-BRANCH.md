# Branch `register`

The register is the part of the calculator that handles input editing and
displaying results to the user. It has a couple modes.

## Modes

To start with, define three modes:

In EMPTY mode, display the top operation on the stack or `ready` if the stack is
empty.

In RESULT mode, display `) = N` if there are more operations on the stack or `=
N` if the stack is empty.

In INPUT mode, display the number currently being input. 

## TODO

- [X]   write a function to implement EMPTY mode, 

- [X]   write a function to implement RESULT mode plus debug functions to switch
        between it and EMPTY

- [X]   wire RESULT mode to the result (`) =`) button
- [X]   write a debug function to mock INPUT mode

- [X]   wire binary operations to buttons

- [ ]   implement clearing

- [ ]   implement real input

- [ ]   implement unary operations
