const playButton = document.getElementById("play");
const howToPlay = document.getElementById("howToPlay");
const started = document.getElementById("startedBlock");
const control = document.querySelector(".control");
const gameArea = document.querySelector(".game");
const score = document.getElementById("score");
const gameOverWindow = document.getElementById("game_over_window");
const finalScore = document.querySelector(".final_score span");
const bestResult = document.querySelector(".final_score:nth-last-child(2) span");

const tryAgain = document.querySelector(".try_again");
const starIcon = document.querySelectorAll("img");
const screenControl = document.querySelector(".screen_panel_control");
const panelButtons = document.querySelector(".buttons_panel_control");
const deleteButton = document.getElementById("delete");
const clearButton = document.getElementById("clear");
const enterButton = document.getElementById("enter");
const operators = ["+", "-", "*", "/"];
let intervalDrops;
let health = 3;
let points = 10;
let maxNumber = 5;

function startGame() {
  intervalDrops = 5500;
  points = 10;
  maxNumber = 5;
  score.textContent = 0;
  started.classList.add("hidden");
  control.classList.remove("hidden");
  setInterval(trackPositionOfTop, 500);
  makeGameIteration();
}
function stopGame() {
  gameArea.querySelectorAll(".bubble").forEach((el) => el.remove());
  starIcon.forEach((el) => {
    el.classList.remove("star_icon");
  });
  started.classList.remove("hidden");
  control.classList.add("hidden");
}

function changeLevel(color, name, time, max) {
  const allBubble = document.querySelectorAll(".bubble");
  const infoLevel = document.querySelector(".level");
  const infoMaxNumber = document.querySelector(".difficulty_expression span");
  // allBubble.forEach((el) => {
  //   el.style.setProperty("--animation-duration", `${time}s`);
  // });
  document.documentElement.style.setProperty("--animation-duration", `${time}s`);
  infoLevel.style.backgroundColor = color;
  infoLevel.textContent = name;
  maxNumber = max;
  infoMaxNumber.textContent = maxNumber;
}

function makeGameIteration() {
  if (health > 0) {
    createBubble();
    if (score.textContent < 50) {
      changeLevel("Lime", "EASY", "10", 5);
    }
    if (score.textContent > 50 && score.textContent <= 150) {
      changeLevel("green", "LOW", "8", 7);
    }
    if (score.textContent > 150 && score.textContent <= 300) {
      changeLevel("orange", "MEDIUM", "6", 9);
    }
    if (score.textContent > 300) {
      changeLevel("red", "HARD", "4", maxNumber + 1);
    }
  }
}

function randomOperator() {
  return operators[randomNumber(0, 4)];
}

function randomNumber(max, min = 1) {
  return Math.floor(Math.random() * (max - min) + min);
}
function getRandomExpression(max, min = 0) {
  const currentOperator = randomOperator();
  let firstNumber = randomNumber(max);
  let secondNumber = randomNumber(max);
  let result;
  if (currentOperator === "-") {
    secondNumber = randomNumber(min, firstNumber);
    result = firstNumber - secondNumber;
  }
  if (currentOperator === "/") {
    result = randomNumber(max);
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
    fail();
  }
  if (health < 1) {
    finalScore.textContent = score.textContent;
    gameOverWindow.classList.add("modal_window");
    stopGame();
    tryAgain.addEventListener("click", () => {
      gameOverWindow.classList.remove("modal_window");
      health = 3;
    });
    if (localStorage.getItem("bestResult") < score.textContent || localStorage.getItem("bestResult") === null) {
      localStorage.setItem("bestResult", score.textContent);
      bestResult.textContent = score.textContent;
    }
    if (localStorage.getItem("bestResult") >= score.textContent) {
      bestResult.textContent = localStorage.getItem("bestResult");
    }
  }
}

function createBubble() {
  const bubble = document.createElement("div");
  const [text, result] = getRandomExpression(maxNumber);
  bubble.textContent = text;
  bubble.dataset.result = result;
  bubble.style.left = `${randomNumber(10, 90)}%`;
  bubble.className = "bubble";
  gameArea.append(bubble);
  setTimeout(makeGameIteration, intervalDrops);
}

function fail() {
  const bubble = document.querySelector(".bubble");
  bubble.classList.add("bad_answer");
  starIcon[health - 1].classList.add("bad_answer");
  setTimeout(() => {
    bubble.classList.remove("bad_answer");
    starIcon[health - 1].classList.remove("bad_answer");
    starIcon[health - 1].classList.add("star_icon");
    health -= 1;
  }, 200);
  screenControl.textContent = null;
}

playButton.addEventListener("click", startGame);

function enterEvent(event, condition, eventCondition) {
  const bubble = document.querySelector(".bubble");
  if (eventCondition) {
    intervalDrops -= 100;
    if (condition) {
      bubble.classList.add("correct_answer");
      screenControl.textContent = null;
      setTimeout(() => {
        bubble.remove();
        score.textContent = +score.textContent + points;
        points++;
        score.classList.add("scale_score");
        setTimeout(() => {
          score.classList.remove("scale_score");
        }, 500);
      }, 800);
    } else {
      fail();
    }
  }
  if (event.target.id === "clear") {
    screenControl.textContent = null;
  }
  if (event.target.id === "delete") {
    screenControl.textContent = screenControl.textContent.slice(0, -1);
  }
}

panelButtons.addEventListener("click", (event) => {
  const bubble = document.querySelector(".bubble");
  if (event.target.className === "control_buttons number") {
    screenControl.textContent += event.target.textContent;
  }
  enterEvent(event, screenControl.textContent === bubble.dataset.result, event.target.id === "enter");
});

document.addEventListener("keydown", (event) => {
  const bubble = document.querySelector(".bubble");
  const valid = event.key.match(/^[0-9,Delete,Backspace,Enter]/g) !== null;
  if (valid) {
    if (event.key.match(/^[0-9]/g) !== null) {
      screenControl.textContent += event.key;
    }
    enterEvent(
      event,
      screenControl.textContent === bubble.dataset.result,
      event.key === "Enter" && screenControl.textContent !== ""
    );
  }
});
