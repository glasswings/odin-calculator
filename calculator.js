/*  Part of Glasswings' Shuntyard Calculator, Copyright 2022 by Glasswings
    You can redistribute, host, and/or modify it under the GNU Affero General Public License
    which should be hosted alongside it and its source code, but you can also get a copy
    of the license or later versions from https://www.gnu.org/licenses/ */

//MOCK
function formatNumber(a, b) {
    return "" + a;
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

var calculatorStack_new = calcStack();

function debugStack() {
    console.log(calculatorStack_new.debugStack());
    renderRegister();
}

/* * *
 * Register display
 * * */

const registerModeEmpty = {
    render: function() {
        if (calculatorStack_new.empty()) {
            return "ready";
        } else {
            return calculatorStack_new.top();
        }
    },
};

const registerModeResult = (v) => ({
    value: v,
    render: function() {
        if (calculatorStack_new.empty()) {
            return `= ${v}`;
        } else {
            return `..) = ${v}`
        }
    },
});

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
        const result = calculatorStack_new.popExec(registerMode.value);
        setRegModeResult(result);
    }
});
