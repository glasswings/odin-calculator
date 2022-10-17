# Branch shuntyard v2

Refactor shuntyard into an object. It should provide

- `empty()` - true if the stack is empty
- `top()` - view of the top operation
- `debugStack()` - debug view of the entire stack
- `pushOp()` - Push an operation onto the stack
- `popExec()` - Execute operations until reaching a paren or the beginning of the expression

And it probably needs

- `#popOps()`

-  [ ]  Add marker comments to guide future merge/rebase
-  [ ]  Leave existing interface, refactor that interface to call into the object.
-  [ ]  Rebase so it doesn't depend on existing `register` branch 