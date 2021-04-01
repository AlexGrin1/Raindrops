const playButton = document.getElementById("play");
const howToPlay = document.getElementById("howToPlay");
const started = document.getElementById("startedBlock");
const control = document.querySelector(".control");

const screenControl = document.querySelector(".screen_panel_control");
const panelButtons = document.querySelector(".buttons_panel_control");

const deleteButton = document.getElementById("delete");
const clearButton = document.getElementById("clear");
const enterButton = document.getElementById("enter");
function startGame() {
  started.classList.add("hidden");
  control.classList.remove("hidden");
}

playButton.addEventListener("click", startGame);

panelButtons.addEventListener("click", (event) => {
  if (
    event.target !== deleteButton &&
    event.target !== clearButton &&
    event.target !== enterButton
  ) {
    screenControl.textContent += event.target.textContent;
  }
});
