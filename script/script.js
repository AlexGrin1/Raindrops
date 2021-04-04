const playButton = document.getElementById("play");
const howToPlay = document.getElementById("howToPlay");
const started = document.getElementById("startedBlock");
const control = document.querySelector(".control");
const gameArea = document.querySelector(".game");
const score = document.getElementById("score");

const screenControl = document.querySelector(".screen_panel_control");
const panelButtons = document.querySelector(".buttons_panel_control");

const deleteButton = document.getElementById("delete");
const clearButton = document.getElementById("clear");
const enterButton = document.getElementById("enter");
const bubble = document.querySelector("bubble");

function startGame() {
  started.classList.add("hidden");
  control.classList.remove("hidden");
  createBubble();
  console.log(document.querySelector(".bubble").getBoundingClientRect().top);
  if (document.querySelector(".bubble").getBoundingClientRect().top >= document.documentElement.clientHeight - 200) {
    document.querySelector(".bubble").remove();
  }
}

const operators = ["+", "-", "*", "/"];

function randomNumber(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}

function randomOperator(max) {
  return operators[randomNumber(0, max)];
}

function createBubble() {
  const newEl = document.createElement("div");
  newEl.className = "bubble";
  newEl.textContent = `${randomNumber(0, 10)} ${randomOperator(4)} ${randomNumber(0, 10)}`;
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
    if (+screenControl.textContent === eval(document.querySelector(".bubble").textContent)) {
      document.querySelector(".bubble").classList.add("correct_answer");
      screenControl.textContent = null;
      setTimeout(() => {
        document.querySelector(".bubble").remove();
        score.textContent = +score.textContent + +10;
        score.style.animation = "scale 0.5s";
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
