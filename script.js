document.addEventListener('DOMContentLoaded', function () {
    const display = document.getElementById('calculator-screen');
    const buttons = document.querySelectorAll(".calc-btn");
    const toggleBtn = document.getElementById('toggle-scientific');
    const scientificPanel = document.getElementById('scientific-panel');


    let currentValue = '';
    let degreeMode = true;
    let hiddenHistory = [];

    display.value = '0';

    function factorial(n) {
        return n <= 1 ? 1 : n * factorial(n - 1);
    }

    function evaluateResult() {
        try {
            let expression = display.value;

            // Replace constants first
            expression = expression
                .replace(/π/g, 'Math.PI*')

                .replace(/e/g, 'Math.E*');

            // Replace operators
            expression = expression.replace(/÷/g, '/').replace(/×/g, '*').replace(/%/g, '/100');
            expression = expression.replace(/x²/g, '**2').replace(/x\^y/g, '**');

            // Replace functions
            expression = expression.replace(/√/g, 'Math.sqrt');
            expression = expression.replace(/log/g, 'Math.log10');
            expression = expression.replace(/ln/g, 'Math.log');
            expression = expression.replace(/sin/g, 'Math.sin');
            expression = expression.replace(/cos/g, 'Math.cos');
            expression = expression.replace(/tan/g, 'Math.tan');
            expression = expression.replace(/n!/g, 'factorial');

            // Degree mode
            if (degreeMode) {
                expression = expression.replace(/Math\.sin\(([^)]+)\)/g, 'Math.sin(($1)*Math.PI/180)');
                expression = expression.replace(/Math\.cos\(([^)]+)\)/g, 'Math.cos(($1)*Math.PI/180)');
                expression = expression.replace(/Math\.tan\(([^)]+)\)/g, 'Math.tan(($1)*Math.PI/180)');
            }

            const result = eval(expression);

            display.value = result;

            addToHistory(currentValue, result);
            currentValue = '';

        } catch (err) {
            display.value = 'Error';
            currentValue = '';
        }
    }

    buttons.forEach(btn => {
        btn.addEventListener('click', () => {
            const value = btn.innerText;

            if (value === "AC") {
                currentValue = '';
                display.value = '0';
            } else if (value === "⌫") {
                currentValue = currentValue.slice(0, -1);
                display.value = currentValue || '0';
            } else if (value === "=") {
                evaluateResult();
            } else if (value === "DEG/RAD") {
                degreeMode = !degreeMode;
                btn.classList.toggle('btn-success');
            } else if (["sin", "cos", "tan", "log", "ln", "√"].includes(value)) {
                currentValue += value + "(";
                display.value = currentValue;
            } else if (value === "π") {
                currentValue += "π";
                display.value = currentValue;
            } else if (value === "e") {
                currentValue += "e";
                display.value = currentValue;
            } else if (value !== "Sci" && value !== "none-sci") {
                currentValue += value;
                display.value = currentValue;
            }
        });
    });

    toggleBtn.addEventListener('click', () => {
        scientificPanel.style.display = scientificPanel.style.display === "none" ? "block" : "none";
        toggleBtn.classList.toggle("btn-success");
    });

    function addToHistory(expression, result) {
        const historyBox = document.getElementById("history-box");
        const historyEntries = document.getElementById("history-entries");

        if (historyBox.style.display === "none") historyBox.style.display = "block";

        const entry = document.createElement("div");
        entry.textContent = `${expression} = ${result}`;

        if (historyEntries.childElementCount >= 5) {
            const lastEntry = historyEntries.lastElementChild;
            hiddenHistory.push(lastEntry.textContent);
            historyEntries.removeChild(lastEntry);
        }

        historyEntries.prepend(entry);
    }

    document.getElementById("clear-history").addEventListener("click", () => {
        document.getElementById("history-entries").innerHTML = "";
        hiddenHistory = [];
        document.getElementById("history-box").style.display = "none";
    });

    document.getElementById("show-hidden-history").addEventListener("click", () => {
        const hiddenBox = document.getElementById("hidden-history");
        const list = document.getElementById("hidden-history-list");

        if (hiddenBox.style.display === "none") {
            hiddenBox.style.display = "block";
            list.innerHTML = "";
            hiddenHistory.forEach(item => {
                const entry = document.createElement("div");
                entry.textContent = item;
                list.prepend(entry);
            });
        } else {
            hiddenBox.style.display = "none";
        }

        document.addEventListener('keydown', function (event) {
            const key = event.key;

            // Handle numbers
            if (!isNaN(key)) {
                currentValue += key;
                display.value = currentValue;
            }

            // Handle basic operators
            else if (['+', '-', '*', '/', '%', '.'].includes(key)) {
                currentValue += key;
                display.value = currentValue;
            }

            // Enter key to calculate
            else if (key === 'Enter') {
                evaluateResult();
            }

            // Backspace to delete last character
            else if (key === 'Backspace') {
                currentValue = currentValue.slice(0, -1);
                display.value = currentValue || '0';
            }

            // Clear with Escape
            else if (key === 'Escape') {
                currentValue = '';
                display.value = '0';
            }

            // Optional: map keyboard letters to functions (case-insensitive)
            else if (key.toLowerCase() === 's') {
                currentValue += 'sin(';
                display.value = currentValue;
            } else if (key.toLowerCase() === 'c') {
                currentValue += 'cos(';
                display.value = currentValue;
            } else if (key.toLowerCase() === 't') {
                currentValue += 'tan(';
                display.value = currentValue;
            } else if (key.toLowerCase() === 'l') {
                currentValue += 'ln(';
                display.value = currentValue;
            }
        });

    });
});
