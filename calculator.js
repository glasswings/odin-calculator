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

/*  ***
    Precedence codes:

    1: + -
    2: * /

    *** */

/**
 * Pop operations off the stack
 *
 * @param prec  precedence code of the incoming operation
 * @param n     last number entered
 * @return      result of popped operations
 */
function popOps(prec, n) {
    while (0 in calculatorStack) {
        const oldOp = calculatorStack.pop();
        if (oldOp.prec >= prec) {
            n = oldOp.op(n);
            continue;
        } else {
            calculatorStack.push(oldOp);
            break;
        }
    }
    return n;
}

/**
 * Push an addition operation onto the stack
 *
 * @param n The number entered before the addition
 */
function pushPlus(n) {
    const prec = 1;
    n = popOps(prec, n);
    const display = `${n} +`;
    const op = (m) => n + m;
    calculatorStack.push({display, prec, op});
    debugStack();
}

/**
 * Push a multiplication operation onto the stack
 *
 * @param n The number entered before the multiplication
 */
function pushTimes(n) {
    const prec = 2;
    n = popOps(prec, n);
    const display = `${n} *`;
    const op = (m) => n * m;
    calculatorStack.push({display, prec, op});
    debugStack();
}

/**
 * Pop a paren or otherwise finish a calculation. Implements the `) =`
 * operation.
 * 
 * @param n The last number entered
 */
function popParen(n) {
    n = popOps(-1, n);
    console.log(`RESULT: ${n}`);
    return n;
}
