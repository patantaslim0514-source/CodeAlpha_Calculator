

const previousOperandElement = document.getElementById("previous-operand");
const currentOperandElement = document.getElementById("current-operand");
const keypad = document.querySelector(".keypad");

let currentValue = "0";
let previousValue = null;
let operator = null;
let shouldResetScreen = false;

// Update the calculator display
function updateDisplay() {
  currentOperandElement.textContent = currentValue;

  if (operator !== null && previousValue !== null) {
    const symbols = { "+": "+", "-": "−", "*": "×", "/": "÷" };
    previousOperandElement.textContent =
      `${previousValue} ${symbols[operator]}`;
  } else {
    previousOperandElement.textContent = "";
  }
}

// Enter a number
function appendNumber(number) {
  if (currentValue === "Error") clearAll();

  if (shouldResetScreen) {
    currentValue = number;
    shouldResetScreen = false;
  } else {
    if (currentValue === "0") {
      currentValue = number;
    } else if (currentValue.length < 16) {
      currentValue += number;
    }
  }

  updateDisplay();
}

// Add a decimal point
function appendDecimal() {
  if (currentValue === "Error") clearAll();

  if (shouldResetScreen) {
    currentValue = "0.";
    shouldResetScreen = false;
  } else if (!currentValue.includes(".")) {
    currentValue += ".";
  }

  updateDisplay();
}

// Format calculation results
function formatNumber(number) {
  if (!Number.isFinite(number)) return "Error";

  const rounded = Number(number.toPrecision(12));
  return String(rounded);
}

// Perform arithmetic
function calculate(a, b, op) {
  switch (op) {
    case "+":
      return a + b;
    case "-":
      return a - b;
    case "*":
      return a * b;
    case "/":
      return b === 0 ? NaN : a / b;
    default:
      return b;
  }
}

// Select an operator
function chooseOperator(nextOperator) {
  if (currentValue === "Error") return;

  if (operator !== null && !shouldResetScreen) {
    performCalculation();

    if (currentValue === "Error") return;
  }

  previousValue = currentValue;
  operator = nextOperator;
  shouldResetScreen = true;
  updateDisplay();
}

// Calculate the result
function performCalculation() {
  if (operator === null || previousValue === null) return;

  const first = Number(previousValue);
  const second = Number(currentValue);
  const result = calculate(first, second, operator);

  currentValue = formatNumber(result);
  previousValue = null;
  operator = null;
  shouldResetScreen = true;

  updateDisplay();
}

// Clear everything
function clearAll() {
  currentValue = "0";
  previousValue = null;
  operator = null;
  shouldResetScreen = false;
  updateDisplay();
}

// Delete the last digit
function deleteDigit() {
  if (currentValue === "Error") {
    clearAll();
    return;
  }

  if (shouldResetScreen) return;

  if (currentValue.length === 1 ||
      (currentValue.length === 2 && currentValue.startsWith("-"))) {
    currentValue = "0";
  } else {
    currentValue = currentValue.slice(0, -1);
  }

  updateDisplay();
}

// Change the sign
function toggleSign() {
  if (currentValue === "Error") return;

  if (shouldResetScreen) {
    shouldResetScreen = false;
  }

  if (Number(currentValue) !== 0) {
    currentValue = currentValue.startsWith("-")
      ? currentValue.slice(1)
      : "-" + currentValue;
  }

  updateDisplay();
}

// Calculate percentage
function calculatePercent() {
  if (currentValue === "Error") return;

  currentValue = formatNumber(Number(currentValue) / 100);
  shouldResetScreen = true;
  updateDisplay();
}

// Handle calculator button clicks
keypad.addEventListener("click", (event) => {
  const button = event.target.closest("button");
  if (!button) return;

  if (button.dataset.number !== undefined) {
    appendNumber(button.dataset.number);
    return;
  }

  if (button.dataset.operator) {
    chooseOperator(button.dataset.operator);
    return;
  }

  switch (button.dataset.action) {
    case "clear":
      clearAll();
      break;
    case "delete":
      deleteDigit();
      break;
    case "decimal":
      appendDecimal();
      break;
    case "equals":
      performCalculation();
      break;
    case "sign":
      toggleSign();
      break;
    case "percent":
      calculatePercent();
      break;
  }
});

// Keyboard support
document.addEventListener("keydown", (event) => {
  const key = event.key;

  if (/^[0-9]$/.test(key)) {
    appendNumber(key);
  } else if (key === ".") {
    appendDecimal();
  } else if (["+", "-", "*", "/"].includes(key)) {
    chooseOperator(key);
  } else if (key === "Enter" || key === "=") {
    event.preventDefault();
    performCalculation();
  } else if (key === "Backspace") {
    deleteDigit();
  } else if (key === "Escape") {
    clearAll();
  } else if (key === "%") {
    calculatePercent();
  }
});

updateDisplay();