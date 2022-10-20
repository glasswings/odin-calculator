/*  Part of Glasswings' Shuntyard Calculator, Copyright 2022 by Glasswings
    You can redistribute, host, and/or modify it under the GNU Affero General Public License
    which should be hosted alongside it and its source code, but you can also get a copy
    of the license or later versions from https://www.gnu.org/licenses/ */

/* * *
 * Utility
 * * */

/**
 * Format a number to a string, limiting the number of digits to the right of
 * the first
 *
 * @param n the number
 */
function formatNumber(n, nDigits) {
    const absN = Math.abs(n);
    const bigThreshold = 10 ** nDigits;
    const epsilon = 10 ** -20;
    if (absN < epsilon) {
        // underflow to 0
        return "0"
    } else if (1 / bigThreshold < absN && absN < bigThreshold) {
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
        return formatted = n.toExponential(nDigits - 4);
    }
}

const calcStack = () => ({
    _stack: [],
    _parenCount: 0,
    /**
     * True if the stack has a unary operation waiting
     */
    hasParen: function() {
        return this._parenCount != 0;
    },
    /**
     * True if the stack is empty
     */
    empty: function() {
        return !(0 in this._stack);
    },
    /**
     * Display string of the top operation, or null if there is none
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
                this._parenCount--;
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
     *                  and pushes the operation to the stack
     * @param display   string to display representing the operation
     * @param unaOp        (a) => ...
     */
    defUnaOp: function(symbol, unaOp) {
        const calc = this;
        return function() {
            calc._parenCount++;
            calc._stack.push({display: symbol, prec: 0, op: unaOp});
        }
    },
    /**
     * Define the minus variant of a unary operation
     *
     * @returns         a function that takes no arguments
     *                  and pushes the operation to the stack
     * @param display   string to display representing the operation
     * @param unaOp        (a) => ...
     */
    defUnaMinusOp: function(symbol, unaOp) {
        const calc = this;
        return function() {
            calc._stack.push({display: "-" + symbol, prec: 0, op: (a) => -unaOp(a) });
        }
    },
    /**
     * Define a function that pushes a binary operation
     *
     * @returns         a function that takes the number before the operator
     *                  and pushes the operation to the stack
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
     * Cancel the topmost operation, if it exists
     */
    popCancel: function() {
        const popped = this._stack.pop();
        if (popped && popped.prec == 0)
            this._parenCount--;
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

/* * *
 * Register display
 * * */

const registerModeEmpty = () => ({
    render: function(calc) {
        if (calc.stack.empty()) {
            return "ready";
        } else {
            return calc.stack.top();
        }
    },
    clear: function(calc) {
        if (calc.stack.empty())
            return;
        calc.stack.popCancel();
        calc.setButtons();
        calc.renderRegister();
    },
});

const registerModeMinus = () => ({
    isMinus: true,
    render: function(calc) {
        return "-";
    },
    clear: function(calc) {
        calc.setRegModeEmpty();
    },
    pokeInput: function(calc, input) {
        calc.setRegModeInput("-" + input);
    },
    pokeMinus: function(calc) {
        calc.setRegModeEmpty();
    }
});

const registerModeResult = (v) => ({
    value: v,
    render: function(calc) {
        if (calc.stack.empty()) {
            return `=${formatNumber(v, 11)}`;
        } else {
            return `)=${formatNumber(v, 11)}`
        }
    },
    clear: function(calc) {
        calc.setRegModeEmpty();
    }
});

const registerModeInput = (s) => ({
    value: +s,
    text: "" + s,
    render: function(calc) {
        if (this.text.length == 0)
            return '0';
        else
            return this.text
    },
    clear: function(calc) {
        const l = this.text.length;
        if (l <= 2 && this.text[0] == '-') {
            calc.setRegModeMinus();
        } else if (l <= 1) {
            calc.setRegModeEmpty();
        } else {
            calc.setRegModeInput(this.text.substring(0, l - 1));
        }
    },
    pokeInput: function(calc, input) {
        if (isNaN(+(this.text + input)))
            return;
        if (this.text.length >= 12)
            return;
        if (input === "0") {
            switch (this.text) {
            case "0":
            case "-0":
                return;
            }
        }
        calc.setRegModeInput(this.text + input);
    },
});

const calculator = (calcDiv) => ({
    stack: calcStack(),
    registerMode: registerModeEmpty(),
    _screen: calcDiv.querySelector('.screen'),
    /**
     * Update the screen
     */
    renderRegister: function() {
        this._screen.innerText = this.registerMode.render(this);
    },
    /**
     * Set operation button to display the correct legend
     */
    setButtons: function() {
        const visible = (p) => p ? 'inline' : 'none';
        const binary = this.hasValue();
        const paren = this.stack.hasParen();
        calcDiv.querySelectorAll('button span').forEach( (span) => {
            if (span.classList.contains('una'))
                span.style.display = visible(!binary);
            else if (span.classList.contains('bin'))
                span.style.display = visible(binary);
            else if (span.classList.contains('eq'))
                span.style.display = visible(!paren);
            else if (span.classList.contains('par'))
                span.style.display = visible(paren);
        });
    },
    /**
     * Set the empty register mode, nothing entered
     *
     * In this mode the calculator displays the top operation or "ready"
     */
    setRegModeEmpty: function() {
        this.registerMode = registerModeEmpty();
        this.setButtons();
        this.renderRegister();
    },
    /**
     * Set the result register mode, after the execute key has been pushed
     *
     * @param v the result value that has been returned and which should be
     *          displayed
     */
    setRegModeResult: function(v) {
        this.registerMode = registerModeResult(v);
        this.setButtons();
        this.renderRegister();
    },
    /**
     * Set the input register mode, in which input is stored as a string
     *
     * @param s the input string so far
     */
    setRegModeInput: function(s) {
        this.registerMode = registerModeInput(s);
        this.setButtons();
        this.renderRegister();
    },
    /**
     * Set the minus register mode, when "-" has been entered but there's no
     * numbers yet
     */
    setRegModeMinus: function() {
        this.registerMode = registerModeMinus();
        this.setButtons();
        this.renderRegister();
    },
    /**
     * True when there is a value in the register, meaning binary operations should be used
     */
    hasValue: function() {
        return "value" in this.registerMode;
    },
    /**
     * Poke a character of input into the calculator
     */
    pokeInput: function(ch) {
        if (!("pokeInput" in this.registerMode))
            this.setRegModeInput('');
        this.registerMode.pokeInput(this, ch);
    },
    defUnaOp: function(symbol, unaOp) {
        const calc = this;
        const stackOp = this.stack.defUnaOp(symbol, unaOp);
        const stackMinusOp = this.stack.defUnaMinusOp(symbol, unaOp);
        return function() {
            if (calc.registerMode.isMinus)
                stackMinusOp();
            else
                stackOp();
            calc.setRegModeEmpty();
        }
    },
    defBinOp: function(symbol, prec, binOp) {
        const calc = this;
        const stackOp = this.stack.defBinOp(symbol, prec, binOp);
        return function() {
            stackOp(calc.registerMode.value);
            calc.setRegModeEmpty();
        }
    },
});

/**
 * Push the minus button when it's not a binary operation
 */
function pokeMinus(calc) {
    if ('pokeMinus' in calc.registerMode)
        calc.registerMode.pokeMinus(calc);
    else
        calc.setRegModeMinus();
}

/**
 * Wire everything to the one calculator
 */
function wireCalculator(calcDiv) {
    const calc = calculator(calcDiv);
    calculator_global = calc;
    // Ops to be executed when there is no value in the register
    const opsNoValue = {
        CLR: () => calc.registerMode.clear(calc),
        MUL: calc.defUnaOp('sqrt(', (a) => Math.sqrt(a)),
        DIV: calc.defUnaOp('(', (a) => a),
        SUB: () => pokeMinus(calc),
    };
    // Ops to be executed when there is a value in the register
    const opsWithValue = {
        EXEC: function() {
            const result = calc.stack.popExec(calc.registerMode.value);
            calc.setRegModeResult(result);
        },
        ADD: calc.defBinOp('+', 1, (a) => (b) => a + b),
        SUB: calc.defBinOp('-', 1, (a) => (b) => a - b),
        MUL: calc.defBinOp('*', 2, (a) => (b) => a * b),
        DIV: calc.defBinOp('/', 2, (a) => (b) => a / b),
    };

    calcDiv.querySelectorAll('button').forEach((button) => {
        if ('data-key' in button.attributes) {
            const dataKey = button.attributes['data-key'].value;
            let listener;
            if (dataKey.length == 1) {
                listener = (ev) => calc.pokeInput(dataKey);
            } else {
                const opWithValue = opsWithValue[dataKey];
                const opWithoutValue = opsNoValue[dataKey];
                listener = (ev) => {
                    if (calc.hasValue() && opWithValue)
                        opWithValue();
                    else if (opWithoutValue)
                        opWithoutValue();
                };
            }
            button.addEventListener('click', listener);
        }
    });

    calc.renderRegister();
}
document.querySelectorAll('.calculator').forEach((calcDiv) => wireCalculator(calcDiv));
