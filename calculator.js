/*  Part of Glasswings' Shuntyard Calculator, Copyright 2022 by Glasswings
    You can redistribute, host, and/or modify it under the GNU Affero General Public License
    which should be hosted alongside it and its source code, but you can also get a copy
    of the license or later versions from https://www.gnu.org/licenses/ */

/* BRANCH shuntyard-v2 BEGIN */

const calcStack = () => ({
    _stack: [],
    /**
     * True if the stack is empty
     */
    empty: function() {
        return !(0 in this._stack);
    },
    /**
     * Display string of the top operation, or null if there is none.
     */
    top: function() {
        if (this.empty()) {
            return null;
        } else {
            const l = this._stack.length;
            return this._stack[l - 1].display;
        }
    },
    debugStack: function() {
        return `Stack:\n${this._stack.map((op) => op.display).join('\n')}`;;
    },
});

/* BRANCH shuntyard-v2 END */
