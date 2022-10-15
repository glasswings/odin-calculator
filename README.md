# Shuntyard Calculator

This implements a classic computer science algorithm--and cheekily ignores the
Odin Project requirements because this is a bit harder. As an extra feature, it
overloads the keypad to handle parentheses and square roots without needing more
buttons. Snazzy!

## The basic idea

Evaluate an operation as soon as all its arguments are available. Keep a stack
of operations that are waiting for their last argument. This means the stack can contain

 -  `(` unary identity
 -  `-(` unary negation
 -  `s(` unary positive square root
 -  `-s(` unary negative square root
 -  `N +` addition
 -  `N -` subtraction
 -  `N *` multiplication
 -  `N /` division

It also obeys the precedence stacking rules:

 -  unary operations can stack on anything
 -  addition and subtraction can only stack on unary ops
 -  multiplication and division can stack on unary or addition / subtraction

There's one more operation that can't go on the stack: `N )` This operation also
implements the enter/equals key.  When an operation can't go on the stack it
triggers an evaluation. Let's look at the example of `2 + 3 * 4 =`. It is scanned as

 - `2 +` (added to empty stack)
 - `3 *` (`*` stacks on `+`)
 - `4 )` (cannot stack, must evaluate)
 - evaluate: `2 +`, `3 *` | `4 )`
 - evaluate: `2 +` | `12 )`
 - `14 )` -> result is `14`

 Compare that to 2 * 3 + 4:

 - `2 *` (added to empty stack)
 - `3 +` (`+` cannot stack on `*`)
 - evaluate: `2 *` | `3 +`
 - `6 +` on stack -> continue reading
 - `4 )` (must evaluate)
 - evaluate: `6 +` | `4 )`
 - `10 )` -> result is `10`

## Keypad overloading

The keypad does different things depending on whether it's expecting a unary or
binary operation. The binary operations are `+` `-` `×` `÷` but the same buttons
are used for `|>` `-` `√(` and `(` respectively. The pipe triangle `|>` might not
be familiar to some readers: it copies the result of a calculation into the next
calculation.

(This operator is seen in some functional programming languages that I haven't
learned yet. If I understand correctly, in ML-family languages like OCaml and F#
instead of saying `f(x)` you can say either `f x` or `x |> f`)

The enter button displays `)` if there is a unary operation on the stack that it
would match and `=` if not. If a binary operation can be repeated it switches to
↫ until the user enters a number.

#### Copyright, distribution, and hosting

Glasswings' Shuntyard Calculator is copyright 2022 by Glasswings
<glasswings363@pm.me>

It is free software: you can redistribute it and/or modify it under the terms
of the GNU Affero General Public License as published by the Free Software
Foundation, either version 3 of the License, or (at your option) any later
version.

Glasswings' Shuntyard Calculator is distributed in the hope that it will be
useful, but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU Affero General
Public License for more details.

You should have received a copy of the GNU Affero General Public License along
with this software. If not, see <https://www.gnu.org/licenses/>.
