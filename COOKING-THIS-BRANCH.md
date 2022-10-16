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

## Clearing

Clearing INPUT or RESULT mode goes to EMPTY
Clearing EMPTY removes the last operation from the stack

I... *think* that results in something useable - no actually I'd rather take the
value back out of a binary operation, but that will require a bit more bookkeeping.

## TODO

- [X]   write a function to implement EMPTY mode, 

- [X]   write a function to implement RESULT mode plus debug functions to switch
        between it and EMPTY

- [X]   wire RESULT mode to the result (`) =`) button
- [X]   write a debug function to mock INPUT mode

- [X]   wire binary operations to buttons

- [X]   implement clearing

- [X]   implement real input

- [X]   implement unary operations
        (parentheses and square root only)

later:

- [ ]   handle prefix `-` key

- [ ]   implement clearing so that clearing `1 +` from the top of the stack puts
        you back in INPUT mode

- [ ]   handle initial 0 better (try starting an input with 0)
- [ ]   limit width of input
- [ ]   ensure that even the widest numbers can't overflow the display
