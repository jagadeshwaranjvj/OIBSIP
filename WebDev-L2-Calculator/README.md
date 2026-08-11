# vanilla JavaScript Calculator

A modern , responsive , browser-based calculator built using pure HTML,CSS, and JavaScript .
Designed with a clean UI , robust state-handling logic, and smooth interactive feedback-completely fee of 
external libraries or `eval()`.

## Feature Checklist
-Dual Display Area:=> Visualize current input alongside previous operand/active operations.
-Numeric Keypad:=> Buttons `0–9` with standard decimal point logic (prevents multiple decimals per number).
-Basic Arithmetic:=> Supports addition (`+`), subtraction (`−`), multiplication (`×`), and division (`÷`).
-Operator Chaining:=> Supports sequential calculations (e.g., `5 + 3 × 2`) dynamically updating state without needing a manual reset between operations.
-Division-by-Zero Safety:=> Gracefully handles `x ÷ 0` by outputting `Error: Division by 0` instead of breaking or showing `Infinity`.
-Clear (C) & Backspace (⌫):=> Fully clear calculations or erase individual digits dynamically.
-No `eval()`:=> Custom state machine and evaluation logic built using `switch` statements and strict data conversion (`parseFloat`).
-Modern CSS Grid Layout:=> Clean 4-column dynamic grid alignment with responsive styling and stateful color schemes.
-Event Listener Delegation:=> Modular, clean separation using standard JavaScript `addEventListener` and DOM data attributes (`data-*`) with zero inline `onclick` attributes.

## Tech Stack
-HTML5:=> Semantic markup structure.
-CSS3:=> Custom CSS variables, Flexbox centering, CSS Grid layout, and smooth UI transitions.
-JavaScript (ES6+):=> Pure Vanilla JS DOM manipulation and logic.

## Project Structure

```text
├── index.html    # Application structure and DOM elements
├── style.css     # Styling, CSS Grid layout, and theme variables
└── script.js    # Core state management and calculation logic
