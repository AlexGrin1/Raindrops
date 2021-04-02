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

function startGame() {
  started.classList.add("hidden");
  control.classList.remove("hidden");
  createBubble();
  answerControl();
}

function randomNumber(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}

function createBubble() {
  const operators = ["+", "-", "*", "/"];
  const newEl = document.createElement("div");
  newEl.className = "bubble";
  newEl.textContent = `${randomNumber(0, 10)} ${
    operators[randomNumber(0, 4)]
  } ${randomNumber(0, 10)}`; //randomAtLeft(0, 10);
  newEl.style.left = `${randomNumber(5, 95)}%`;
  gameArea.append(newEl);
  setTimeout(startGame, 5000);
}
function answerControl() {
  console.log(eval(document.querySelector(".bubble").textContent));
  console.log(screenControl.textContent);
  if (
    screenControl.textContent ===
    eval(document.querySelector(".bubble").textContent)
  ) {
    score.textContent += 10;
  }
}

playButton.addEventListener("click", startGame);

panelButtons.addEventListener("click", (event) => {
  if (
    event.target.id !== "delete" &&
    event.target.id !== "clear" &&
    event.target.id !== "enter"
  ) {
    screenControl.textContent += event.target.textContent;
  }
});
