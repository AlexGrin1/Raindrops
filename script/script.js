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
const bubble = document.querySelector("bubble");
const operators = ["+", "-", "*", "/"];

let firstNumber;
let secondNumber;
let currentOperator;

function startGame() {
  started.classList.add("hidden");
  control.classList.remove("hidden");
  waterLine.classList.remove("hidden");
  createBubble();
  setInterval(trackPositionOfTop, 500);
}

function randomNumber(max, min = 0) {
  let number1 = Math.floor(Math.random() * (max - min) + min);
  let number2 = Math.floor(Math.random() * (max - min) + min);
  return Math.floor(Math.random() * (max - min) + min);
}

function randomOperator(max) {
  let operator = operators[randomNumber(0, max)];
  if (operator === "-") {
  }
  return operator;
}

function trackPositionOfTop() {
  let firstBubble = document.querySelector(".bubble");
  console.log(firstBubble.getBoundingClientRect().top);
  if (
    firstBubble.getBoundingClientRect().top >=
    document.documentElement.clientHeight - 200
  ) {
    firstBubble.remove();
  }
}

function createBubble() {
  const newEl = document.createElement("div");
  newEl.className = "bubble";

  newEl.textContent = `${randomNumber(0, 10)} ${randomOperator(
    4
  )} ${randomNumber(0, 10)}`;
  newEl.style.left = `${randomNumber(10, 90)}%`;
  gameArea.append(newEl);
  setTimeout(startGame, 5000);
}

playButton.addEventListener("click", startGame);

panelButtons.addEventListener("click", (event) => {
  if (event.target.className === "controll_buttons number") {
    screenControl.textContent += event.target.textContent;
  }
  if (event.target.id === "enter") {
    if (
      +screenControl.textContent ===
      eval(document.querySelector(".bubble").textContent)
    ) {
      document.querySelector(".bubble").classList.add("correct_answer");
      screenControl.textContent = null;
      setTimeout(() => {
        document.querySelector(".bubble").remove();
        score.textContent = +score.textContent + +10;
        score.classList.add("scale_score");
        setTimeout(() => {
          score.classList.remove("scale_score");
        }, 500);
      }, 800);
    } else {
      document.querySelector(".bubble").classList.add("bad_answer");
      setTimeout(() => {
        document.querySelector(".bubble").classList.remove("bad_answer");
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
