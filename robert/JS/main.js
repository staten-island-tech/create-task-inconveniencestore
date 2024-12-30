import "../CSS/style.css";

const DOMSelectors = {
  startButton: document.querySelector(".start-button"),
  timerArea: document.querySelector(".timer-area"),
};

//DOMSelectors.startButton.addEventListener("click", initGame);

let duration = 10;

//function initGame() {}

function wait(ms) {
  //when resolve is called, it counts as promise fulfilled
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function updateCountdownDisplay() {
  DOMSelectors.timerArea.innerHTML = `<h3>time remaining: ${duration}s</h3>`;
}

async function countdown() {
  while (duration > 0) {
    updateCountdownDisplay();
    await wait(1000);
    duration--;
  }

  DOMSelectors.timerArea.innerHTML = `<h3>times up</h3>`;
}

countdown();
