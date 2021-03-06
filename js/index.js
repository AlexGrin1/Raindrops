const playButton = document.getElementById("play");
const howToPlay = document.getElementById("howToPlay");
const started = document.getElementById("startedBlock");
const control = document.querySelector(".control");
const gameArea = document.querySelector(".game");
const score = document.getElementById("score");
const gameOverWindow = document.getElementById("game_over_window");
const finalScore = document.querySelector(".final_score span");
const bestResult = document.querySelector(
  ".final_score:nth-last-child(2) span"
);

const tryAgain = document.querySelector(".try_again");
const starIcon = document.querySelectorAll("img");
const screenControl = document.querySelector(".screen_panel_control");
const panelButtons = document.querySelector(".buttons_panel_control");
const deleteButton = document.getElementById("delete");
const clearButton = document.getElementById("clear");
const enterButton = document.getElementById("enter");
const fullScreenButton = document.getElementById("scren-mode");
const container = document.querySelector(".container");
const operators = ["+", "-", "*", "/"];
let intervalDrops;
let intervalBossDrops;
let health = 3;
let points = 10;
let maxNumber = 5;
let intervalTrackPosition;
let timeoutCreateBubble;

function soundPlay(link, time = 800) {
  const audio = document.createElement("audio");
  audio.setAttribute("autoplay", "true");
  audio.innerHTML = link;
  document.body.appendChild(audio);
  setTimeout(() => {
    audio.parentNode.removeChild(audio);
  }, time);
}

function autoModeGame(event) {
  const intervalAutoModeGame = setInterval(iterationAutoGame, 6000);
  startGame("auto");
  document.removeEventListener("keydown", (event) => {});
  function iterationAutoGame() {
    const bubble = document.querySelector(".bubble");
    setTimeout(() => {
      screenControl.textContent = bubble.dataset.result;
    }, 3000);
    setTimeout(() => {
      enterButton.classList.add("scale_enter");
      bubble.classList.add("correct_answer");
      screenControl.textContent = null;
      setTimeout(() => {
        enterButton.classList.remove("scale_enter");
        countAndScaleScore();
      }, 800);
    }, 4000);
    setTimeout(() => {
      screenControl.textContent = null;
    }, 5000);
  }
  iterationAutoGame();
  setTimeout(() => {
    clearInterval(intervalAutoModeGame);
    clearInterval(timeoutCreateBubble);
    // clearInterval(timeoutCreateBossBubble);
    stopGame();
  }, 23900);
}

function startGame(event) {
  intervalDrops = 5500;
  points = 10;
  maxNumber = 5;
  score.textContent = 0;
  started.classList.add("hidden");
  control.classList.remove("hidden");
  intervalTrackPosition = setInterval(trackPositionOfTop, 500);
  makeGameIteration();
  if (event !== "auto") {
    intervalBossDrops = setInterval(
      createBossBubble,
      randomNumber(25000, 15000)
    );
    document.addEventListener("keydown", listenerKeydown);
    panelButtons.addEventListener("click", lestenerMouseEvent);
  }
}

function stopGame() {
  clearInterval(intervalTrackPosition);
  soundPlay("<source src='./media/final.mp3'>", 6000);
  gameArea.querySelectorAll(".bubble").forEach((el) => el.remove());
  starIcon.forEach((el) => {
    el.classList.remove("star_icon");
  });
  started.classList.remove("hidden");
  control.classList.add("hidden");
  document.removeEventListener("keydown", listenerKeydown);
  panelButtons.removeEventListener("click", lestenerMouseEvent);
}
const LEVELS = {
  EASY: "EASY",
  LOW: "LOW",
  MEDIUM: "MEDIUM",
  HARD: "HARD",
};
const LEVEL_SETTINGS = {
  [LEVELS.EASY]: {
    time: 10,
    color: "lime",
    max: 5,
    name: "EASY",
  },
  [LEVELS.LOW]: {
    time: 8,
    color: "green",
    max: 7,
    name: "LOW",
  },
  [LEVELS.MEDIUM]: {
    time: 6,
    color: "orange",
    max: 9,
    name: "MEDIUM",
  },
  [LEVELS.HARD]: {
    time: 4,
    color: "red",
    max: 12,
    name: "HARD",
  },
};
function changeLevel({ color, name, time, max }) {
  const allBubble = document.querySelectorAll(".bubble");
  const infoLevel = document.querySelector(".level");
  const infoMaxNumber = document.querySelector(".difficulty_expression span");
  document.documentElement.style.setProperty(
    "--animation-duration",
    `${time}s`
  );
  infoLevel.style.backgroundColor = color;
  infoLevel.textContent = name;
  maxNumber = max;
  infoMaxNumber.textContent = maxNumber;
}

function makeGameIteration() {
  if (health > 0) {
    createBubble();

    if (score.textContent < 50) {
      changeLevel(LEVEL_SETTINGS[LEVELS.EASY]);
    }
    if (score.textContent > 50 && score.textContent <= 150) {
      changeLevel(LEVEL_SETTINGS[LEVELS.LOW]);
    }
    if (score.textContent > 150 && score.textContent <= 300) {
      changeLevel(LEVEL_SETTINGS[LEVELS.MEDIUM]);
    }
    if (score.textContent > 300) {
      changeLevel(LEVEL_SETTINGS[LEVELS.HARD]);
    }
  }
}
function countAndScaleScore() {
  const bubble = document.querySelector(".bubble");
  bubble.remove();
  score.textContent = +score.textContent + points;
  points++;
  score.classList.add("scale_score");
  setTimeout(() => {
    score.classList.remove("scale_score");
  }, 500);
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
  if (
    firstBubble &&
    firstBubble.getBoundingClientRect().top >=
      document.documentElement.clientHeight - 200
  ) {
    firstBubble.remove();
    fail();
  }
  if (health < 1) {
    gameOver();
  }
}
function gameOver() {
  clearInterval(timeoutCreateBubble);
  clearInterval(intervalBossDrops);
  finalScore.textContent = score.textContent;
  gameOverWindow.classList.add("modal_window");
  playButton.removeEventListener("click", startGame);
  howToPlay.removeEventListener("click", autoModeGame);
  stopGame();
  tryAgain.addEventListener("click", () => {
    playButton.addEventListener("click", startGame);
    howToPlay.addEventListener("click", autoModeGame);
    gameOverWindow.classList.remove("modal_window");
    health = 3;
  });
  if (
    localStorage.getItem("bestResult") < score.textContent ||
    localStorage.getItem("bestResult") === null
  ) {
    localStorage.setItem("bestResult", score.textContent);
    bestResult.textContent = score.textContent;
  }
  if (localStorage.getItem("bestResult") >= score.textContent) {
    bestResult.textContent = localStorage.getItem("bestResult");
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
  timeoutCreateBubble = setTimeout(makeGameIteration, intervalDrops);
}
function createBossBubble() {
  const bubble = document.createElement("div");
  const [text, result] = getRandomExpression(maxNumber);
  bubble.textContent = text;
  bubble.dataset.result = result;
  bubble.style.left = `${randomNumber(10, 90)}%`;
  bubble.className = "bubble boss_bubble";
  gameArea.append(bubble);
}

function fail() {
  intervalDrops -= 100;
  soundPlay("<source src='./media/not.mp3'>");
  const bubble = document.querySelector(".bubble");
  if (bubble !== null) {
    bubble.classList.add("bad_answer");
  }
  starIcon[health - 1].classList.add("bad_answer");
  setTimeout(() => {
    if (bubble !== null) {
      bubble.classList.remove("bad_answer");
    }
    starIcon[health - 1].classList.remove("bad_answer");
    starIcon[health - 1].classList.add("star_icon");
    health -= 1;
  }, 200);

  screenControl.textContent = null;
}

function enterEvent(event, condition, eventCondition) {
  const bubble = document.querySelector(".bubble");
  const bossBubble = document.querySelector(".boss_bubble");
  if (
    bossBubble !== null &&
    event.key === "Enter" &&
    screenControl.textContent === bossBubble.dataset.result
  ) {
    soundPlay("<source src='./media/ok.mp3'>", 1000);
    bossBubble.classList.add("correct_answer");
    screenControl.textContent = null;
    gameArea.querySelectorAll(".bubble").forEach((el) => {
      setTimeout(() => {
        el.classList.add("correct_answer");
      }, 200);
      setTimeout(() => {
        countAndScaleScore();
      }, 800);
    });
    return;
  }
  if (eventCondition) {
    intervalDrops -= 100;
    if (condition) {
      soundPlay("<source src='./media/ok.mp3'>", 1000);
      bubble.classList.add("correct_answer");
      screenControl.textContent = null;
      setTimeout(() => {
        countAndScaleScore();
      }, 800);
    } else {
      fail();
    }
  }
}
function lestenerMouseEvent(event) {
  const bubble = document.querySelector(".bubble");
  if (event.target.className === "control_buttons number") {
    screenControl.textContent += event.target.textContent;
  }
  enterEvent(
    event,
    screenControl.textContent === bubble.dataset.result,
    event.target.id === "enter"
  );
  if (event.target.id === "clear") {
    screenControl.textContent = null;
  }
  if (event.target.id === "delete") {
    screenControl.textContent = screenControl.textContent.slice(0, -1);
  }
}
function listenerKeydown(event) {
  const bubble = document.querySelector(".bubble");
  const valid = event.key.match(/^[0-9,Delete,Backspace,Enter]/g) !== null;
  const esc = event.key.match(/^[Escape]/g) !== null;
  if (valid && bubble !== null) {
    if (event.key.match(/^[0-9]/g) !== null) {
      screenControl.textContent += event.key;
    }
    enterEvent(
      event,
      screenControl.textContent === bubble.dataset.result,
      event.key === "Enter" && screenControl.textContent !== ""
    );
    if (event.key.match(/^[Delete]/g)) {
      screenControl.textContent = null;
    }
    if (event.key.match(/^[Backspace]/g)) {
      screenControl.textContent = screenControl.textContent.slice(0, -1);
    }
  }
  if (esc) {
    fullScreenButton.style.display = "block";
  }
}

container.querySelectorAll("button").forEach((e) => {
  e.addEventListener("click", () => {
    soundPlay("<source src='./media/click.mp3'>", 1000);
  });
});
let fullMode = false;
fullScreenButton.addEventListener("click", () => {
  if (fullMode === false) {
    document.body.requestFullscreen();
    fullMode = true;
  } else {
    document.webkitCancelFullScreen();
    fullMode = false;
  }
});

playButton.addEventListener("click", startGame);

howToPlay.addEventListener("click", autoModeGame);
