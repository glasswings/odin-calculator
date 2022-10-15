# Branch shuntyard

This branch develops shuntyard logic.

## TODO

- [X]   create shuntyard state

- [X]   implement `+` and `)=` 

        At this point, no input register state. Call a
        function that pushes `100 +` as a complete unit.

- [X]   implement `*`

- [X]   implement `(`

    NOTE: `(1 + 2) * 3 =` has to be fed into this layer as 
    `(` | `1 +` | `2 ) *` | `3 =`  The finished application will handle this
    interaction as an automatic pipe-forward |>

- [X]   implement `-` and `/`

- [ ]   implement `-(` and `squrt(`
