/*
    Name: Ville Peltonen
    Date created: 1/11/2020
    Most recent revision: 2/8/2020
*/

const add = function(...num) {
    // add function
    total = num.reduce((sum, item) => sum += item, 0);
    var totalRounded = roundToFiveNum(total);
    return totalRounded;
}

const sub = function(a, ...num) {
    // subtraction function
    total = num.reduce((diff, item) => diff -= item, a);
    var totalRounded = roundToFiveNum(total);
    return totalRounded;
}

const mult = function(...num) {
    // multiplication function
    total = num.reduce((sumMult, item) => sumMult *= item, 1);
    var totalRounded = roundToFiveNum(total);
    return totalRounded;
}

const divi = function(a, ...num) {
    // division function
    total = num.reduce((diffDivi, item) => diffDivi /= item, a);
    var totalRounded = roundToFiveNum(total);
    return totalRounded;
}

const operate = function(b, num1, num2) {
    // operation function, calls on add, subtract, multiply or divide functions
    switch(b) {
        case "+":
            return add(num1, num2);
            break;
        case "-":
            return sub(num1, num2);
            break;
        case "*":
            return mult(num1, num2);
            break;
        case "/":
            return divi(num1, num2);
            break;
    }; 
}

const roundToFiveNum = function(x) {
    // rounding function, rounds to five decimal places
    return +(Math.round(x + "e+5") + "e-5");
}

const display = document.body.querySelector('#display'); // display
const equal = document.body.querySelector('#equal'); // equal button
const clear = document.body.querySelector('#clear'); // clear button

var input = []; // array to store all input
var result = 0; // final result sent to display
var equalLast = 0; // check to see if "equals" has been clicked before next button click. 0 is NO, 1 is YES. 
var errorSpan = document.createElement('span'); // span element for display, used during error event (i.e. NaN) 
var errorCount = 0; //check to see if error event has occurred before next button click. 0 is NO, 1 is YES.

/* regular expressions */
const regex = /\D/;
const regexTwo = /\D$/;
const regexThree = /\D/g;
const regexFour = /^\D/;
const regexFive = /\w/;

function replaceNaN() {
    // function to replace NaN with error message
    display.textContent = "";
    display.appendChild(errorSpan);
    errorSpan.textContent = "!Error!";
    errorSpan.classList.add('animation');
    errorCount = 1;
};

/* calculator interactions */
document.querySelectorAll('.grid-item').forEach(item =>
    // sfx for button click
    item.addEventListener('click', function(e) {
        const audio = document.querySelector('#button-push');
        audio.currentTime = 0; // rewinds audio to start
        audio.play();
    })
);

document.querySelectorAll('.number').forEach(item =>
    // loops through all number buttons and listens for clicks
    item.addEventListener('click', function(e) {
        if (errorCount === 1) {
            // if error present, nothing happens
        } else {
            // number pushed to input array, added to display
            if (equalLast === 1) {
                // if equal last clicked, starting from scratch
                equalLast = 0;
                display.textContent = "";
                input = [];
            };
            input.push(e.target.textContent);
            display.textContent += input[input.length - 1];
        };
    })
);

document.querySelectorAll('.operator').forEach(item =>
    // loops through all operator buttons and listens for clicks
    item.addEventListener('click', function(e) {
        if (errorCount === 1) {
            // if error present, nothing happens
        } else {
            equalLast = 0;
            if (input.length < 1 && e.target.textContent !== "-") {
                // if input empty, nothing happens (exception is for minus sign to create negative numbers)
            } else {
                var num1 = input.join(''); // input array converted to string
                if ((regex.test(num1) && !regexTwo.test(num1) && !regexFour.test(num1) &&
                    num1.match(regexThree).length === 1) || (regex.test(num1) && 
                    !regexTwo.test(num1) && num1.match(regexThree).length > 1)) {
                        // checks for pre-existing operator in string. If found, operation performed before current operator added
                        // limits string to two numbers and an operator. Allows for consecutive operations without clicking equal button
                        var splitter = 0; // operator used in operation function
                        var splitterArr = num1.match(regexThree); // matches all operators in string
                    if (splitterArr.length > 1) {
                        // if negative number present (1st operator), uses 2nd operator
                        splitter = splitterArr[1];
                    } else {
                        // if only one operator present, uses that
                        splitter = splitterArr[0];
                    };
                    if (splitterArr[0] === "-" && splitterArr[1] === "-" ) {
                        // if both operators are minus signs, 1st operator removed temporarily
                        var remainder = num1.slice(0, 1); 
                        num1 = num1.slice(1); 
                    };
                    var num1Arr = num1.split(splitter);
                    var [a] = splitter;
                    var b = parseInt(num1Arr[0]);
                    var c = parseInt(num1Arr[1]);
                    if (remainder) {
                        // removed minus sign re-added to 1st number
                        b = remainder + b;
                    }
                    num1 = operate(a, b, c);
                } else if (regexTwo.test(num1)) {
                    // if operator clicked twice in succession, erases first instance
                    num1 = num1.slice(0, num1.length - 1);
                };
                    if (isNaN(num1)) {
                        // if NaN is result, returns error message
                        replaceNaN();
                    } else {
                        input = [];
                        input.push(num1);
                        input.push(e.target.textContent);
                        display.textContent = num1 + " " + e.target.textContent + " ";
                    };
            };
        };
    })
);

equal.addEventListener('click', function(e) {
    // when equal button clicked
    if (input.indexOf("+") === -1 && input.indexOf("-") === -1 &&
        input.indexOf("/") === -1 && input.indexOf("*") === -1) {
        result = display.textContent;
        equalLast = 1;
        // if no operator is clicked, result is current input
    } else if (regex.test(input[input.length - 1])) {
        // if operator is last button clicked, result is current input
        result = display.textContent;
    } else {
        const [a, b, ...c] = input;
        var num1 = parseInt(a);
        var num2Pre = c.join('');
        var num2 = parseInt(num2Pre);
        result = operate(b, num1, num2);
        if (isNaN(result)) {
            // if NaN is result, returns error message
            replaceNaN();
        } else {
            display.textContent = result;
            equalLast = 1;
        };
    };
});

clear.addEventListener('click', function(e) {
    // when clear button clicked
    display.textContent = "";
    input = [];
    errorCount = 0;
});


/* Drag functions */
var dragItem = document.querySelector('#container');
var container = document.querySelector('#outer-container');

var active = false;
var currentX;
var currentY;
var initialX;
var initialY;
var xOffset = 0;
var yOffset = 0;

container.addEventListener("mousedown", dragStart, false);
container.addEventListener("mouseup", dragEnd, false);
container.addEventListener("mousemove", drag, false);

function dragStart(e) {
    initialX = e.clientX - xOffset;
    initialY = e.clientY - yOffset;

    if (e.target === dragItem) {
        active = true;
    }
}

function drag(e) {
    if (active) {
        e.preventDefault();
        currentX = e.clientX - initialX;
        currentY = e.clientY - initialY;

        xOffset = currentX;
        yOffset = currentY;

        setTranslate(currentX, currentY, dragItem);
    }
}

function setTranslate(xPos, yPos, el) {
    el.style.transform = "translate3d(" + xPos + "px, " + yPos + "px, 0)";
}

function dragEnd(e) {
    initialX = currentX;
    initialY = currentY;

    active = false;
}


/* welcome message script */
const okButton = document.getElementById('ok');
const noThanks = document.getElementById('no-thanks');
const jumbotron = document.getElementById('jumbotron-container');

okButton.addEventListener('click', function(e) {
    jumbotron.classList.add('disappear');
    dragItem.classList.add('grid-container');
    dragItem.classList.remove('disappear');
});

noThanks.addEventListener('click', function(e) {
   jumbotron.classList.add('disappear');
});

