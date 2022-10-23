<!--
SPDX-FileCopyrightText: 2022 Glasswings

SPDX-License-Identifier: AGPL-3.0-or-later
-->

# Shuntyard Calculator

This is my version of the Odin Project Foundations course final project:
[Calculator](https://www.theodinproject.com/lessons/foundations-calculator).
I've made one large change to the requirements: I really wanted to implement
infix operations with precedence. So I used a variation of Dijkstra's Shunting
Yard algorithm, described in the first section below.

On top of that layer I wrote a state machine to handle the buttons and display
register. Each mode is an object whose methods handle state transitions,
describe in the second section below.

Graphic design is one of my weaker points, so rather than being too creative, I
took a look at the HP-70 design for inspiration and added vaporwave.

[My self-evaluation of what I've learned writing this](./LESSONS.md)

## The Shuntyard

The key idea is to divide the expression into tokens, simplify sub-expressions
as soon as possible, and keep a last-in-first-out list of tokens that can't be
simplified yet, which I call a `calcStack`. It's defined at lines 47-169. The
possible tokens are as follows (`N` is any number):

 -  `(`
 -  `-(`
 -  `s(` [square root]
 -  `-s(`
 -  `N +`
 -  `N -`
 -  `N *`
 -  `N /`
 -  `N )`  [close parentheses or end of expression]

Let's look at the example of `2 + 3 * 4 =`. It's tokenized as:

 - `2 +`
 - `3 *`
 - `4 )`

When the first two tokens have been entered there's not yet enough information
to begin evaluation. So a stack with `A + B *` on top must be considered fully
simplified. Once the `4 )` is added, it creates subexpressions that can be
simplified: `3 * 4 )` => `12 )` and `2 + 12 )` => `12) `. This last result
state is passed back to the register layer, so the shuntyard stack doesn't ever
hold onto an `N )` token.

Compare that to 2 * 3 + 4:

 - `2 *`
 - `3 +`
 - `4 )`

The sequence `2 * 3 +` can be simplified to `6 +`; or in other words, a stack
with `A * B +` on top is not fully simplified. The `+` operation should check
if it's being added on top of a `*` operation and if so simplify itself first.
This logic is handled by the `_popOps()` method. Every binary token that can go
on the stack first calls `_popOps()` to satisfy the precedence-stacking rules.

Unary operations can't be simplified until the closing `)` is entered. And the
`N )` token gets special handling in `popExec` because it needs to return a
result value.

The shuntyard stack layer only cares about putting operations in the correct
order, so it doesn't actually define addition, etc. That knowledge is passed
into `defUnaOp` or `defBinOp`.

## The Register-Calculator Layer

A calculator object has a `stack` property and a `registerMode` property. The
`registerMode` decides how to respond to various input events and what to
display on the screen.

Each of these behavior methods takes a `calc` parameter because the
`registerMode` is logically part of the calculator object and needs to mutate
it. I'm not sure if this is idiomatic JS or if it would be better to have a
`calc` property within the mode object, but I do know that would create an
object reference cycle that may be harder to garbage collect.

`defUnaOp` and `defBinOp` are redefined in the register layer (as calculator
methods). These method bodies read state from the register (input value,
presence of a leading `-`) and call down to the stack layer.

Finally the `wireCalculator()` free function assembles the whole thing. It's
passed a DOM `<div>` that contains the calculator UI, creates the `calculator`
object, and defines all the click handlers. This method body is also what says
"addition adds numbers," etc. using curried functions to do so.

#### Copyright

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
