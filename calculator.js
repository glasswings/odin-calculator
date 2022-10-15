/*  Part of Glasswings' Shuntyard Calculator, Copyright 2022 by Glasswings
    You can redistribute, host, and/or modify it under the GNU Affero General Public License
    which should be hosted alongside it and its source code, but you can also get a copy
    of the license or later versions from https://www.gnu.org/licenses/ */

/**
 * A stack of calculator operations
 *
 * Each calculator operation has a
 *
 * - display string
 * - partially applied function
 */
var calculatorStack = [];

function debugStack() {
    console.log("Stack:");
    for (const op of calculatorStack) {
        console.log(op.display);
    }
}

debugStack();
