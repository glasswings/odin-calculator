# Branch shuntyard v2

Refactor shuntyard into an object. It should provide

- `empty()` - true if the stack is empty
- `top()` - view of the top operation
- `debugStack()` - debug view of the entire stack
- `pushOp()` - Push an operation onto the stack
- `popExec()` - Execute operations until reaching a paren or the beginning of the expression

And it probably needs

- `#popOps()`

## Notes

- Actually, no I'm not going to bother with `class`

## TODO

-  [X]  Add marker comments to guide future merge/rebase
-  [ ]  Leave existing interface, refactor that interface to call into the object.
    -  [X]  replace global variable with new temporary one
    -  [ ]  empty() top() debugStack()
    -  [ ]  ensure that they are used where appropriate
    -  [ ]  pushOp() _popOps() popExec()
    -  [ ]  remove new global variable
-  [ ]  Rebase so it doesn't depend on existing `register` branch 