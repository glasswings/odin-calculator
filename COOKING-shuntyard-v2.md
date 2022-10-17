# Branch shuntyard v2

Refactor shuntyard into an object. It should provide

- `empty()` - true if the stack is empty
- `top()` - view of the top operation
- `debugStack()` - debug view of the entire stack
- `pushOp()` - Push an operation onto the stack
    - It makes sense to have separate methods for pushing unary and binary ops,
      because binary ops need to pop before they push while unary ops never do
      that.
- `popExec()` - Execute operations until reaching a paren or the beginning of the expression
- `popCancel()` - Cancel operation on the top of the stack.

And it probably needs

- `#popOps()`

## Notes

- Actually, no I'm not going to bother with `class`

## TODO

-  [X]  Add marker comments to guide future merge/rebase
-  [X]  Leave existing interface, refactor that interface to call into the object.
    -  [X]  replace global variable with new temporary one
    -  [X]  empty() top() debugStack()
    -  [X]  ensure that they are used where appropriate
    -  [X]  ~~pushOp()~~ def*Op() _popOps() popExec() popCancel()
    -  [-]  ~~remove new global variable~~
-  [X]  Rebase so it doesn't depend on existing `register` branch 