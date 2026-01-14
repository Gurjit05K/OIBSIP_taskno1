document.addEventListener('DOMContentLoaded', function() {
    // Calculator state
    let currentOperand = '0';
    let previousOperand = '';
    let operation = undefined;
    let resetCurrentOperand = false;
    
    // DOM Elements
    const currentOperandElement = document.querySelector('.current-operand');
    const previousOperandElement = document.querySelector('.previous-operand');
    const numberButtons = document.querySelectorAll('.btn.number');
    const operatorButtons = document.querySelectorAll('.btn.operator');
    const equalsButton = document.querySelector('.btn.equals');
    const clearButton = document.querySelector('[data-action="clear"]');
    const backspaceButton = document.querySelector('[data-action="backspace"]');
    const decimalButton = document.querySelector('[data-action="decimal"]');
    const darkModeToggle = document.getElementById('dark-mode-toggle');
    
    // Update display
    function updateDisplay() {
        currentOperandElement.textContent = currentOperand;
        
        if (operation != null) {
            previousOperandElement.textContent = `${previousOperand} ${getOperationSymbol(operation)}`;
        } else {
            previousOperandElement.textContent = previousOperand;
        }
    }
    
    // Get operation symbol for display
    function getOperationSymbol(op) {
        switch(op) {
            case 'add': return '+';
            case 'subtract': return '-';
            case 'multiply': return '×';
            case 'divide': return '÷';
            default: return '';
        }
    }
    
    // Append number
    function appendNumber(number) {
        if (currentOperand === '0' || resetCurrentOperand) {
            currentOperand = number;
            resetCurrentOperand = false;
        } else {
            currentOperand += number;
        }
    }
    
    // Choose operation
    function chooseOperation(op) {
        if (currentOperand === '') return;
        
        if (previousOperand !== '') {
            calculate();
        }
        
        operation = op;
        previousOperand = currentOperand;
        resetCurrentOperand = true;
    }
    
    // Calculate
    function calculate() {
        let computation;
        const prev = parseFloat(previousOperand);
        const current = parseFloat(currentOperand);
        
        if (isNaN(prev) || isNaN(current)) return;
        
        switch(operation) {
            case 'add':
                computation = prev + current;
                break;
            case 'subtract':
                computation = prev - current;
                break;
            case 'multiply':
                computation = prev * current;
                break;
            case 'divide':
                if (current === 0) {
                    alert("Cannot divide by zero!");
                    clear();
                    return;
                }
                computation = prev / current;
                break;
            default:
                return;
        }
        
        // Round to avoid floating point precision issues
        currentOperand = Math.round(computation * 100000000) / 100000000;
        operation = undefined;
        previousOperand = '';
        resetCurrentOperand = true;
    }
    
    // Clear calculator
    function clear() {
        currentOperand = '0';
        previousOperand = '';
        operation = undefined;
    }
    
    // Delete last digit
    function deleteLastDigit() {
        if (currentOperand.length === 1) {
            currentOperand = '0';
        } else {
            currentOperand = currentOperand.slice(0, -1);
        }
    }
    
    // Add decimal point
    function addDecimal() {
        if (resetCurrentOperand) {
            currentOperand = '0.';
            resetCurrentOperand = false;
            return;
        }
        
        if (currentOperand.includes('.')) return;
        
        currentOperand += '.';
    }
    
    
    // Event Listeners for number buttons
    numberButtons.forEach(button => {
        button.addEventListener('click', () => {
            appendNumber(button.getAttribute('data-number'));
            updateDisplay();
        });
    });
    
    // Event Listeners for operator buttons
    operatorButtons.forEach(button => {
        button.addEventListener('click', () => {
            const action = button.getAttribute('data-action');
            
            switch(action) {
                case 'add':
                case 'subtract':
                case 'multiply':
                case 'divide':
                    chooseOperation(action);
                    break;
                case 'clear':
                    clear();
                    break;
                case 'backspace':
                    deleteLastDigit();
                    break;
            }
            
            updateDisplay();
        });
    });
    
    // Event Listener for equals button
    equalsButton.addEventListener('click', () => {
        calculate();
        updateDisplay();
    });
    
    // Event Listener for decimal button
    decimalButton.addEventListener('click', () => {
        addDecimal();
        updateDisplay();
    });
    
    // Keyboard support
    document.addEventListener('keydown', event => {
        // Prevent default behavior for calculator keys
        if (event.key.match(/[0-9\.\+\-\*\/=]|Enter|Backspace|Delete|Escape/)) {
            event.preventDefault();
        }
        
        switch(event.key) {
            case '0':
            case '1':
            case '2':
            case '3':
            case '4':
            case '5':
            case '6':
            case '7':
            case '8':
            case '9':
                appendNumber(event.key);
                updateDisplay();
                break;
            case '+':
                chooseOperation('add');
                updateDisplay();
                break;
            case '-':
                chooseOperation('subtract');
                updateDisplay();
                break;
            case '*':
                chooseOperation('multiply');
                updateDisplay();
                break;
            case '/':
                chooseOperation('divide');
                updateDisplay();
                break;
            case '.':
                addDecimal();
                updateDisplay();
                break;
            case '=':
            case 'Enter':
                calculate();
                updateDisplay();
                break;
            case 'Backspace':
                deleteLastDigit();
                updateDisplay();
                break;
            case 'Escape':
            case 'Delete':
                clear();
                updateDisplay();
                break;
        }
    });
    
    // Initialize display
    updateDisplay();
    
    // Add animation to buttons on click
    const allButtons = document.querySelectorAll('.btn');
    allButtons.forEach(button => {
        button.addEventListener('click', function() {
            this.classList.add('clicked');
            setTimeout(() => {
                this.classList.remove('clicked');
            }, 200);
        });
    });
});