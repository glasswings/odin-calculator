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
        let l = formatted.length;
        trimLoop:
        while (l > 1) {
            switch (formatted[l - 1]) {
            case '0':
                l--;
                continue trimLoop;
            case '.':
                l--;
                break trimLoop;
            default:
                break trimLoop;
            }
        }
        return formatted.substring(0, l);
    } else {
        // exponential notation
        return formatted = n.toExponential(nDigits);
    }
}

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
    /**
     * Pop operations off the stack
     *
     * @param prec  precedence code of the incoming operation
     * @param n     last number entered
     * @return      result of popped operations
     */
    _popOps: function(prec, n) {
        while (!this.empty()) {
            const oldOp = this._stack.pop();
            if (prec == -1 && oldOp.prec == 0) {
                n = oldOp.op(n);
                break;
            } else if (oldOp.prec >= prec) {
                n = oldOp.op(n);
                continue;
            } else {
                this._stack.push(oldOp);
                break;
            }
        }
        return n;
    },
    /**
     * Define a function that pushes a unary operation
     *
     * @returns         a function that takes no arguments
     *                  and pushes the operation to the stack.
     * @param display   string to display representing the operation
     * @param unaOp        (a) => ...
     */
    defUnaOp: function(symbol, unaOp) {
        const calc = this;
        return function() {
            calc._stack.push({display: symbol, prec: 0, op: unaOp});
        }
    },
    /**
     * Define a function that pushes a binary operation
     *
     * @returns         a function that takes the number before the operator
     *                  and pushes the operation to the stack.
     * @param display   string to display representing the operation
     * @param prec      precedence code:
     *                  1 - addition/subtraction
     *                  2 - multiplication/division
     * @param binOp        (a) => (b) => ...
     */
    defBinOp: function(symbol, prec, binOp) {
        const calc = this;
        return function(firstArg) {
            const a = calc._popOps(prec, firstArg);
            const display = `${formatNumber(a, 9)} ${symbol}`;
            calc._stack.push({display, prec, op: binOp(a)});
        }
    },
    /**
     * Cancel the topmost operation, if it exists.
     */
    popCancel: function() {
        this._stack.pop();
    },
    /**
     * Execute operations. Implements `)` or `=`
     *
     * @param arg The last number entered
     */
     popExec: function (arg) {
        return this._popOps(-1, arg);
    },
});

/* BRANCH shuntyard-v2 END */

function debugStack() {
    console.log(calculator_global.stack.debugStack());
    renderRegister();
}

/* * *
 * Register display
 * * */

const registerModeEmpty = () => ({
    render: function() {
        if (calculator_global.stack.empty()) {
            return "ready";
        } else {
            return calculator_global.stack.top();
        }
    },
    clear: function() {
        if (calculator_global.stack.empty())
            return;
        calculator_global.stack.popCancel();
        calculator_global.renderRegister();
    },
});

const registerModeResult = (v) => ({
    value: v,
    render: function() {
        if (calculator_global.stack.empty()) {
            return `= ${formatNumber(v, 12)}`;
        } else {
            return `..) = ${formatNumber(v, 9)}`
        }
    },
    clear: function() {
        calculator_global.setRegModeEmpty();
    }
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
            calculator_global.setRegModeEmpty();
        } else {
            calculator_global.setRegModeInput(this.text.substring(0, l - 1));
        }
    },
    pokeInput: function(input) {
        if (!isNaN(+(this.text + input)))
            calculator_global.setRegModeInput(this.text + input);
    },
})

var calculator_global = ({
    stack: calcStack(),
    registerMode: registerModeEmpty(),
    _screen: document.querySelector('.calculator .screen'),
    /**
     * Update the screen
     */
    renderRegister: function() {
        this._screen.innerText = this.registerMode.render();
    },
    /**
     * Set the empty register mode, nothing entered.
     *
     * In this mode the calculator displays the top operation or "ready"
     */
    setRegModeEmpty: function() {
        this.registerMode = registerModeEmpty();
        this.renderRegister();
    },
    /**
     * Set the result register mode, after the execute key has been pushed.
     *
     * @param v the result value that has been returned and which should be
     *          displayed
     */
    setRegModeResult: function(v) {
        this.registerMode = registerModeResult(v);
        this.renderRegister();
    },
    /**
     * Set the input register mode, in which input is stored as a string.
     *
     * @param s the input string so far.
     */
    setRegModeInput: function(s) {
        this.registerMode = registerModeInput(s);
        this.renderRegister();
    },
});

calculator_global.renderRegister();

function setInput(v) {
    calculator_global.setRegModeInput(v);
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
    if ("value" in calculator_global.registerMode) {
        const result = calculator_global.stack.popExec(calculator_global.registerMode.value);
        calculator_global.setRegModeResult(result);
    }
});

/**
 * clear key
 */
document.querySelector('.calculator [data-key="CLR"]')
    .addEventListener('click', (ev) =>
{
    calculator_global.registerMode.clear();
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
        if ("value" in calculator_global.registerMode) {
            binOp(calculator_global.registerMode.value);
            calculator_global.setRegModeEmpty();
        } else if (unaOp != null) {
            unaOp();
            calculator_global.setRegModeEmpty();
        }
    });
}

wireOperationKey('ADD', calculator_global.stack.defBinOp('+', 1, (a) => (b) => a + b), null);
wireOperationKey('SUB', calculator_global.stack.defBinOp('-', 1, (a) => (b) => a - b), null);
wireOperationKey('MUL', calculator_global.stack.defBinOp('*', 2, (a) => (b) => a * b),
                        calculator_global.stack.defUnaOp('sqrt(', (a) => Math.sqrt(a)));
wireOperationKey('DIV', calculator_global.stack.defBinOp('/', 2, (a) => (b) => a / b),
                        calculator_global.stack.defUnaOp('(', (a) => a));

function pushInputKey(label) {
    if (!("pokeInput" in calculator_global.registerMode))
        calculator_global.setRegModeInput('');
    calculator_global.registerMode.pokeInput(label);
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
