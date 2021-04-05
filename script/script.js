const playButton = document.getElementById("play");
const howToPlay = document.getElementById("howToPlay");
const started = document.getElementById("startedBlock");
const control = document.querySelector(".control");
const gameArea = document.querySelector(".game");
const score = document.getElementById("score");
const waterLine = document.querySelector(".water_line");

const screenControl = document.querySelector(".screen_panel_control");
const panelButtons = document.querySelector(".buttons_panel_control");

const deleteButton = document.getElementById("delete");
const clearButton = document.getElementById("clear");
const enterButton = document.getElementById("enter");

const operators = ["+", "-", "*", "/"];

function startGame() {
  started.classList.add("hidden");
  control.classList.remove("hidden");
  waterLine.classList.remove("hidden");
  setInterval(trackPositionOfTop, 500);
  makeGameIteration();
}

function makeGameIteration() {
  createBubble();
}

function randomOperator() {
  return operators[randomNumber(0, 4)];
}

function randomNumber(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}
function getRandomExpression(min, max) {
  const currentOperator = randomOperator();
  let firstNumber = randomNumber(min, max);
  let secondNumber = randomNumber(min, max);
  let result;
  if (currentOperator === "-") {
    secondNumber = randomNumber(min, firstNumber);
    result = firstNumber - secondNumber;
  }
  if (currentOperator === "/") {
    result = randomNumber(min, max);
    firstNumber = secondNumber * result;
  }
  if (currentOperator === "+") {
    result = firstNumber + secondNumber;
  }
  if (currentOperator === "*") {
    result = firstNumber * secondNumber;
  }
  const text = `${firstNumber} ${currentOperator} ${secondNumber}`;

  return [text, result];
}

function trackPositionOfTop() {
  const firstBubble = document.querySelector(".bubble");
  if (firstBubble && firstBubble.getBoundingClientRect().top >= document.documentElement.clientHeight - 200) {
    firstBubble.remove();
  }
}

function createBubble() {
  const bubble = document.createElement("div");
  const [text, result] = getRandomExpression(1, 9);
  bubble.textContent = text;
  bubble.dataset.result = result;
  bubble.style.left = `${randomNumber(10, 90)}%`;
  bubble.className = "bubble";
  gameArea.append(bubble);
  setTimeout(makeGameIteration, 5000);
}

playButton.addEventListener("click", startGame);

panelButtons.addEventListener("click", (event) => {
  const bubble = document.querySelector(".bubble");
  if (event.target.className === "control_buttons number") {
    screenControl.textContent += event.target.textContent;
  }
  if (event.target.id === "enter") {
    if (screenControl.textContent === bubble.dataset.result) {
      bubble.classList.add("correct_answer");
      screenControl.textContent = null;
      setTimeout(() => {
        bubble.remove();
        score.textContent = +score.textContent + 10;
        score.classList.add("scale_score");
        setTimeout(() => {
          score.classList.remove("scale_score");
        }, 500);
      }, 800);
    } else {
      bubble.classList.add("bad_answer");
      setTimeout(() => {
        bubble.classList.remove("bad_answer");
      }, 200);
      screenControl.textContent = null;
    }
  }
  if (event.target.id === "clear") {
    screenControl.textContent = null;
  }
  if (event.target.id === "delete") {
    screenControl.textContent = screenControl.textContent.slice(0, -1);
  }
});
