const resultBox = document.querySelector("#result");
const expressionBox = document.querySelector("#expression");

const numberKeys = document.querySelectorAll("[data-number]");
const operatorKeys = document.querySelectorAll("[data-operator]");
const actionKeys = document.querySelectorAll("[data-action]");
const clearAllButton = document.querySelector("#clearAll");

let expression = "";
let justCalculated = false;

const operators = ["+", "-", "*", "/", "%"];

// Display

function updateDisplay() {
    const visibleExpression = expression
        .replace(/\*/g, " × ")
        .replace(/\//g, " ÷ ")
        .replace(/-/g, " − ")
        .replace(/\+/g, " + ")
        .replace(/%/g, " % ");

    expressionBox.textContent = visibleExpression || "\u00a0";
}

// Number handling

function addNumber(value) {

    if (justCalculated) {
        expression = "";
        justCalculated = false;
    }

    if (value === ".") {

        const parts = expression.split(/[+\-*/%]/);
        const currentNumber = parts[parts.length - 1];

        if (currentNumber.includes(".")) {
            return;
        }

        if (currentNumber === "") {
            expression += "0";
        }
    }

    expression += value;

    showExpressionResult();
}

// Operator handling

function addOperator(operator) {

    if (!expression) {
        return;
    }

    justCalculated = false;

    const lastCharacter = expression[expression.length - 1];

    if (operators.includes(lastCharacter)) {
        expression = expression.slice(0, -1) + operator;
    } else {
        expression += operator;
    }

    updateDisplay();
}

// Calculation

function calculate() {

    if (!expression) {
        return;
    }

    let prepared = expression;

    const lastCharacter = prepared[prepared.length - 1];

    if (operators.includes(lastCharacter)) {
        prepared = prepared.slice(0, -1);
    }

    if (!prepared) {
        return;
    }

    try {

        const tokens = tokenize(prepared);

        if (!tokens.length) {
            return;
        }

        const answer = evaluateTokens(tokens);

        if (!Number.isFinite(answer)) {
            throw new Error("Invalid calculation");
        }

        const formatted = formatNumber(answer);

        expressionBox.textContent = prepared
            .replace(/\*/g, " × ")
            .replace(/\//g, " ÷ ")
            .replace(/-/g, " − ")
            .replace(/\+/g, " + ")
            .replace(/%/g, " % ");

        resultBox.textContent = formatted;

        expression = formatted;
        justCalculated = true;

    } catch (error) {

        resultBox.textContent = "Error";
        expression = "";
        justCalculated = true;
    }
}

// Tokenizer

function tokenize(value) {

    const matches = value.match(
        /(?:\d+(?:\.\d*)?|\.\d+|[+\-*/%])/g
    );

    return matches || [];
}

// expression evaluator

function evaluateTokens(tokens) {

    let values = [];
    let operatorsFound = [];

    for (const token of tokens) {

        if (!Number.isNaN(Number(token))) {
            values.push(Number(token));
        } else {
            operatorsFound.push(token);
        }
    }

    if (values.length !== operatorsFound.length + 1) {
        throw new Error("Invalid expression");
    }

    // First resolve multiplication,
    //    division and percentage.

    let compactValues = [values[0]];
    let compactOperators = [];

    for (let i = 0; i < operatorsFound.length; i++) {

        const operator = operatorsFound[i];
        const nextValue = values[i + 1];

        if (operator === "*") {
            const previous =
                compactValues[compactValues.length - 1];

            compactValues[compactValues.length - 1] =
                previous * nextValue;

        } else if (operator === "/") {

            if (nextValue === 0) {
                throw new Error("Division by zero");
            }

            const previous =
                compactValues[compactValues.length - 1];

            compactValues[compactValues.length - 1] =
                previous / nextValue;

        } else if (operator === "%") {

            const previous =
                compactValues[compactValues.length - 1];

            compactValues[compactValues.length - 1] =
                previous % nextValue;

        } else {

            compactOperators.push(operator);
            compactValues.push(nextValue);
        }
    }

    // Resolve addition and subtraction

    let total = compactValues[0];

    for (let i = 0; i < compactOperators.length; i++) {

        const operator = compactOperators[i];
        const value = compactValues[i + 1];

        if (operator === "+") {
            total += value;
        }

        if (operator === "-") {
            total -= value;
        }
    }

    return total;
}

// Format numbers

function formatNumber(number) {

    if (Number.isInteger(number)) {
        return String(number);
    }

    return Number(number.toFixed(10)).toString();
}

// Show live expression

function showExpressionResult() {

    updateDisplay();

    const last = expression[expression.length - 1];

    if (operators.includes(last)) {
        resultBox.textContent = "0";
        return;
    }

    const numberMatch = expression.match(
        /(?:\d+(?:\.\d*)?|\.\d+)$/
    );

    resultBox.textContent =
        numberMatch ? numberMatch[0] : "0";
}

// Delete last character

function deleteLast() {

    if (justCalculated) {
        expression = "";
        justCalculated = false;
        resultBox.textContent = "0";
        updateDisplay();
        return;
    }

    expression = expression.slice(0, -1);

    showExpressionResult();
}

// Clear calculator

function clearCalculator() {

    expression = "";
    justCalculated = false;

    resultBox.textContent = "0";
    expressionBox.textContent = "\u00a0";
}

// Button events

numberKeys.forEach(button => {

    button.addEventListener("click", () => {
        addNumber(button.dataset.number);
    });

});

operatorKeys.forEach(button => {

    button.addEventListener("click", () => {
        addOperator(button.dataset.operator);
    });

});

actionKeys.forEach(button => {

    button.addEventListener("click", () => {

        const action = button.dataset.action;

        if (action === "clear") {
            clearCalculator();
        }

        if (action === "delete") {
            deleteLast();
        }

        if (action === "calculate") {
            calculate();
        }

    });

});

clearAllButton.addEventListener("click", clearCalculator);

//  Keyboard support

document.addEventListener("keydown", event => {

    const key = event.key;

    if (/^\d$/.test(key) || key === ".") {
        addNumber(key);
        return;
    }

    if (operators.includes(key)) {
        addOperator(key);
        return;
    }

    if (key === "Enter" || key === "=") {
        event.preventDefault();
        calculate();
        return;
    }

    if (key === "Backspace") {
        deleteLast();
        return;
    }

    if (key === "Escape" || key.toLowerCase() === "c") {
        clearCalculator();
    }

});