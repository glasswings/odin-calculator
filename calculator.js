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
        if (prec == -1 && oldOp.prec == 0) {
            n = oldOp.op(n);
            break;
        } else if (oldOp.prec >= prec) {
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
 * Define a binary operation function
 * 
 * @param symbol    short debugging symbol
 * @param prec      precedence code
 * @param binOp     operation in the form of a twice-applied arrow function
 * @returns         a function that takes the first argument and pushes the
 *                  operation to the stack
 */
function defBinOp(symbol, prec, binOp) {
    return function(n) {
        n = popOps(prec, n);
        const display = `${n} ${symbol}`;
        calculatorStack.push({display, prec, op: binOp(n)});
        debugStack();
    }
}

/**
 * Push an addition operation onto the stack
 *
 * @param n The number entered before the addition
 */
const pushPlus =    defBinOp('+', 1, (n) => (m) => n + m);
const pushMinus =   defBinOp('-', 1, (n) => (m) => n - m);
const pushTimes =   defBinOp('*', 2, (n) => (m) => n * m);
const pushDiv =     defBinOp('/', 2, (n) => (m) => n / m);

/**
 * Define a unary operation function
 *
 * @param symbol    short debugging symbol
 * @param unaOp     operation
 * @returns         a function that pushes the operation to the stack
 */
function defUnaOp(symbol, unaOp) {
    return function() {
        calculatorStack.push({display: symbol, prec: 0, op: unaOp});
        debugStack();
    }
}

/**
 * Push an opening paren onto the stack
 */
const pushParen =   defUnaOp('(',     (n) => n);

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
