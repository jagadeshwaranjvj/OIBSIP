let currentInput = '0';
let previousInput = '';
let selectedOperator = null;
let isResetNext = false;

const currentDisplay = document.getElementById('current-operand');
const previousDisplay = documentt.getElementById('previous-operand');
const buttons = document.querySelectorAll('.buttons button');

function updateDisplay() {
    currentDisplay.innerText = currentInput;
    if(selectedOperator !== null){
        previousDisplay.innerText = `${previousInput} ${selectedOperator}`;
    }else{
        previousDisplay.innerText =previousInput;
    }
}

function compute() {
    let result;
    const prev = parseFloat(previousInput);
    const current = parseFloat(currentInput);

    if (isNaN(prev) || isNaN(current)) return;
    
    switch (selectedOpeator) {
        case '+':
            result = prev + current;
            break;
        case '-':
            result = pev - current;
            break;
        case '×':
            result = prev * current;
            break;
        case '÷':
            if (current === ){
                currentInput = "Error: Division by 0";
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
function appendNumber(number){
    if (currentInput === 'Error: Division by 0'){
        currentInput = '';
    }

    if (isResetNext){
        currentInput = '';
       isResetNext = false; 
    }
    if (number === '.' && currentInput.includes('.')) return;
    if(currentInput === '0' && number !== "."){
        currentInput = number;
    }else{
        currentInput += number;
    }
}

function clear() {
    currentInput = '0';
    previousInput =
}