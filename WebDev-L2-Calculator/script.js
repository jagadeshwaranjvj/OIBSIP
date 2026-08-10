let currentInput = '0';
let previousInput = '';
let selectedOperator = null;
let isResetNext = false;


const currentDisplay = document.getElementById('current-operand');
const previousDisplay = document.getElementById('previous-operand');
const buttons = document.querySelectorAll('.buttons button');


function updateDisplay() {
    currentDisplay.innerText = currentInput;
    if (selectedOperator !== null) {
        previousDisplay.innerText = `${previousInput} ${selectedOperator}`;
    } else {
        previousDisplay.innerText = previousInput;
    }
}


function compute() {
    let result;
    const prev = parseFloat(previousInput);
    const current = parseFloat(currentInput);

    if (isNaN(prev) || isNaN(current)) return;

    switch (selectedOperator) {
        case '+':
            result = prev + current;
            break;
        case '-':
            result = prev - current;
            break;
        case '×':
            result = prev * current;
            break;
        case '÷':
            if (current === 0) {
                currentInput = 'Error: Division by 0';
                selectedOperator = null;
                previousInput = '';
                isResetNext = true;
                updateDisplay();
                return;
            }
            result = prev / current;
            break;
        default:
            return;
    }


    currentInput = Math.round(result * 1e10) / 1e10 + '';
    selectedOperator = null;
    previousInput = '';
    isResetNext = true;
}


function appendNumber(number) {
    if (currentInput === 'Error: Division by 0') {
        currentInput = '';
    }

    if (isResetNext) {
        currentInput = '';
        isResetNext = false;
    }

    if (number === '.' && currentInput.includes('.')) return;
    if (currentInput === '0' && number !== '.') {
        currentInput = number;
    } else {
        currentInput += number;
    }
}


function chooseOperator(operator) {
    if (currentInput === 'Error: Division by 0') return;

    if (previousInput !== '' && selectedOperator !== null && !isResetNext) {
        compute();
    }

    selectedOperator = operator;
    previousInput = currentInput;
    isResetNext = true;
}


function clear() {
    currentInput = '0';
    previousInput = '';
    selectedOperator = null;
    isResetNext = false;
}


function deleteDigit() {
    if (isResetNext || currentInput === 'Error: Division by 0') {
        clear();
        return;
    }
    if (currentInput.length === 1 || (currentInput.length === 2 && currentInput.startsWith('-'))) {
        currentInput = '0';
    } else {
        currentInput = currentInput.slice(0, -1);
    }
}


buttons.forEach(button => {
    button.addEventListener('click', () => {
        if (button.hasAttribute('data-number')) {
            appendNumber(button.innerText);
        } else if (button.hasAttribute('data-operator')) {
            chooseOperator(button.getAttribute('data-operator'));
        } else if (button.getAttribute('data-action') === 'clear') {
            clear();
        } else if (button.getAttribute('data-action') === 'delete') {
            deleteDigit();
        } else if (button.getAttribute('data-action') === 'equals') {
            compute();
        }
        updateDisplay();
    });
});