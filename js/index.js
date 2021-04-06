const playButton = document.getElementById("play");
const howToPlay = document.getElementById("howToPlay");
const started = document.getElementById("startedBlock");
const control = document.querySelector(".control");
const gameArea = document.querySelector(".game");
const score = document.getElementById("score");
const waterLine = document.querySelector(".water_line");
const gameOverWindow = document.getElementById("game_over_window");
const finalScore = document.querySelector(".final_score span");
const bestResult = document.querySelector(".final_score:last-child span");
const tryAgain = document.querySelector(".try_again");

const screenControl = document.querySelector(".screen_panel_control");
const panelButtons = document.querySelector(".buttons_panel_control");

const deleteButton = document.getElementById("delete");
const clearButton = document.getElementById("clear");
const enterButton = document.getElementById("enter");
const operators = ["+", "-", "*", "/"];

let health = 3;

function startGame() {
  health = 3;
  started.classList.add("hidden");
  control.classList.remove("hidden");
  waterLine.classList.remove("hidden");
  setInterval(trackPositionOfTop, 500);
  makeGameIteration();
}
function stopGame() {
  gameArea.querySelectorAll(".bubble").forEach((el) => el.remove());
  started.classList.remove("hidden");
  control.classList.add("hidden");
  waterLine.classList.add("hidden");
}

function makeGameIteration() {
  if (health > 0) {
    createBubble();
  }
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
    health = health - 1;
    // if (
    //   localStorage.getItem("bestResult") < score.textContent ||
    //   localStorage.getItem("bestResult") === null
    // ) {
    //   localStorage.setItem("bestResult", score.textContent);
    //   bestResult.textContent = score.textContent;
    // }
    // if (localStorage.getItem("bestResult") >= score.textContent) {
    //   bestResult.textContent = localStorage.getItem("bestResult");
    // }
  }
  if (health < 1) {
    finalScore.textContent = score.textContent;
    gameOverWindow.classList.add("modal_window");
    stopGame();
    tryAgain.addEventListener("click", () => {
      gameOverWindow.classList.remove("modal_window");
      health = 3;
    });
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
  setTimeout(makeGameIteration, 2000);
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

document.addEventListener("keydown", (event) => {
  const bubble = document.querySelector(".bubble");
  // console.log(event.key);
  const valid = event.key.match(/^[0-9,Delete,Backspace,Enter]/g) !== null;

  if (valid) {
    if (event.key.match(/^[0-9]/g) !== null) {
      screenControl.textContent += event.key;
    }
    if (event.key === "Enter") {
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
        const starIcon = document.querySelector(".star_icon");
        bubble.classList.add("bad_answer");
        starIcon.classList.add("bad_answer");
        health -= 1;
        console.log(health);
        // starIcon.remove();
        setTimeout(() => {
          bubble.classList.remove("bad_answer");
          starIcon.classList.remove("bad_answer");
          starIcon.style.filter = "grayscale(100%)";
        }, 200);
        starIcon.classList.remove("star_icon");
        screenControl.textContent = null;
      }
    }
    if (event.key === "Delete") {
      screenControl.textContent = null;
    }
    if (event.key === "Backspace") {
      screenControl.textContent = screenControl.textContent.slice(0, -1);
    }
  }
});
