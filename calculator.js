/*  Part of Glasswings' Shuntyard Calculator, Copyright 2022 by Glasswings
    You can redistribute, host, and/or modify it under the GNU Affero General Public License
    which should be hosted alongside it and its source code, but you can also get a copy
    of the license or later versions from https://www.gnu.org/licenses/ */

/* * *
 * Utility
 * * */

/**
 * Format a number to a string, limiting the number of digits to the right of
 * the first.
 *
 * @param n the number
 */
function formatNumber(n, nDigits) {
    const absN = Math.abs(n);
    const bigThreshold = 10 ** nDigits;
    if (1 / bigThreshold < absN && absN < bigThreshold) {
        // fixed notation
        const formatted = n.toFixed(nDigits).substring(0, nDigits + 2);
        const is0orDot = (c) => c == '0' || c == '.';
        let l = formatted.length;
        while (l > 1 && is0orDot(formatted[l-1])) l--;
        return formatted.substring(0, l);
    } else {
        // exponential notation
        return formatted = n.toExponential(nDigits);
    }
}

/* * *
 * Stack
 * * */

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
    renderRegister();
}

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
        const display = `${formatNumber(n, 9)} ${symbol}`;
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
const pushSqrt =    defUnaOp('sqrt(', (n) => Math.sqrt(n));
const pushAddInv=   defUnaOp('-(',    (n) => -n);

/**
 * Pop a paren or otherwise finish a calculation. Implements the `) =`
 * operation.
 * 
 * @param n The last number entered
 */
function popParen(n) {
    n = popOps(-1, n);
    debugStack();
    console.log(`RESULT: ${n}`);
    return n;
}

/* * *
 * Register display
 * * */

const registerModeEmpty = {
    render: function() {
        if (0 in calculatorStack) {
            return calculatorStack[calculatorStack.length - 1].display;
        } else {
            return "ready";
        }
    },
    clear: function() {
        if (0 in calculatorStack) {
            calculatorStack.pop();
            renderRegister();
        }
    },
};

const registerModeResult = (v) => ({
    value: v,
    render: function() {
        if (0 in calculatorStack) {
            return `..) = ${formatNumber(v, 9)}`
        } else {
            return `= ${formatNumber(v, 12)}`;
        }
    },
    clear: setRegModeEmpty,
});

const registerModeInput = (s) => ({
    value: +s,
    text: "" + s,
    render: function() {
        if (this.text.length == 0)
            return '0';
        else
            return this.text
    },
    clear: function() {
        const l = this.text.length;
        if (l <= 1) {
            setRegModeEmpty();
        } else {
            setRegModeInput(this.text.substring(0, l - 1));
        }
    },
    pokeInput: function(input) {
        if (!isNaN(+(this.text + input)))
            setRegModeInput(this.text + input);
    },
})

var registerMode = registerModeEmpty;

function renderRegister() {
    const screen = document.querySelector('.calculator .screen');
    screen.innerText = registerMode.render();
}

renderRegister();

function setRegModeEmpty() {
    registerMode = registerModeEmpty;
    renderRegister();
}

function setRegModeResult(v) {
    registerMode = registerModeResult(v);
    renderRegister();
}

function setRegModeInput(s) {
    registerMode = registerModeInput(s)
    renderRegister();
}

function setInput(v) {
    registerMode = registerModeInput(v);
    renderRegister();
}

/* * *
 * Key events
 * * */

/**
 * execute key
 */
document.querySelector('.calculator [data-key="EXEC"]')
    .addEventListener('click', (ev) =>
{
 if ("value" in registerMode) {
     const result = popParen(registerMode.value);
     setRegModeResult(result);
 }
});

/**
 * clear key
 */
document.querySelector('.calculator [data-key="CLR"]')
    .addEventListener('click', (ev) =>
{
    registerMode.clear();
});

/**
 * Register click listener to implement an operation key
 * @param dataKey   data-key attribute in the DOM
 * @param binOp     pushFoo function defined using `defBinOp`
 * @param unaOp     pushBar function defined using `defUnaOp` (or null)
 */
function wireOperationKey(dataKey, binOp, unaOp) {
    document.querySelector(`.calculator [data-key="${dataKey}"]`)
        .addEventListener('click', (ev) => 
    {
        if ("value" in registerMode) {
            binOp(registerMode.value);
            setRegModeEmpty();
        } else if (binOp != null) {
            unaOp();
            setRegModeEmpty();
        }
    });
}

wireOperationKey('ADD', pushPlus, null);
wireOperationKey('SUB', pushMinus, null);
wireOperationKey('MUL', pushTimes, pushSqrt);
wireOperationKey('DIV', pushDiv, pushParen);

function pushInputKey(label) {
    if (!("pokeInput" in registerMode))
        setRegModeInput('');
    registerMode.pokeInput(label);
}

document.querySelectorAll('.calculator button')
    .forEach((button) =>
{
    if (('data-key' in button.attributes)) {
        const dataKey = button.attributes['data-key'].value;
        if (dataKey.length == 1)
            button.addEventListener('click', (ev) => pushInputKey(dataKey));
    }
});
