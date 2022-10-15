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

/**
 * Push an addition operation onto the stack
 *
 * @param n The number entered before the addition
 */
function pushPlus(n) {
    while (0 in calculatorStack) {
        const oldOp = calculatorStack.pop();
        n = oldOp.op(n);
    }
    const display = `${n} +`;
    const op = (m) => n + m;
    calculatorStack.push({display, op});
    debugStack();
}

/**
 * Pop a paren or otherwise finish a calculation. Implements the `) =`
 * operation.
 * 
 * @param n The last number entered
 */
function popParen(n) {
    while (0 in calculatorStack) {
        const oldOp = calculatorStack.pop();
        n = oldOp.op(n);
    }
    console.log(`RESULT: ${n}`);
    return n;
}
