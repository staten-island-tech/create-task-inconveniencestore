import "../CSS/style.css";
import { normalAuctionItems } from "./items_for_sale.js";
import { defaultBidders } from "./bidders.js";

const DOMSelectors = {
  startButton: document.querySelector(".start-button"),
  timerArea: document.querySelector(".timer-area"),
  //itemDisplay: document.querySelector(".item-display"),
  //itemInfo: document.querySelector(".item-info"),
  leftSide: document.querySelector(".left-side"),
  bidButton: document.querySelector(".bid-button"),
  bidLog: document.querySelector(".bid-log"),
};

//DOMSelectors.startButton.addEventListener("click", initGame);
let duration = 3;
let auctionRunning = false;
let bidBelongsToPlayer = false;
//add a variable for bid hesitance
DOMSelectors.bidButton.addEventListener("click", () => {
  console.log("click");
  increaseBid();
  bidBelongsToPlayer = true;
});
//countdown();
initGame();
function initGame() {
  auctionRunning = true;

  //generate random number from the index to determine item, store the index
  let randomNumber = Math.floor(Math.random() * normalAuctionItems.length);
  console.log(`random number: ${randomNumber}`);

  //update visual of the auction thingie
  updateItemDisplay(randomNumber);

  //wait a little bit and then start the game process:
  // start the timer,
  countdown(randomNumber);
  // make an async function for the audience, update current price bid display
  //side note: global variable for current amount of money?
}

function wait(ms) {
  //when resolve is called, it counts as promise fulfilled
  return new Promise((resolve) => setTimeout(resolve, ms));
}

//call this in countdown every second that it's triggered?
async function audienceBid(randomNumber) {
  const item = normalAuctionItems[randomNumber];
  let bidChance = Math.floor(Math.random() * 100 + 1);
  console.log(`bid chance: ${bidChance}`);

  if (bidChance <= item.bidEagerness) {
    console.log("bid increased");
    bidBelongsToPlayer = false;
    increaseBid();
  }
}

function increaseBid() {
  //duration += 3;

  let randomNumber = Math.floor(Math.random() * defaultBidders.length);

  if (bidBelongsToPlayer === true) {
    DOMSelectors.bidLog.insertAdjacentHTML(
      "beforeend",
      `you have increased the bid by ________!`
    );
  } else {
    DOMSelectors.bidLog.insertAdjacentHTML(
      "beforeend",
      `${defaultBidders[randomNumber]} increased by the bid by _____!`
    );
  }
}

async function countdown(randomNumber) {
  while (duration > 0) {
    updateCountdownDisplay();
    audienceBid(randomNumber);
    await wait(500);
    audienceBid(randomNumber);
    await wait(500);
    duration--;
  }

  DOMSelectors.timerArea.innerHTML = `<h3>times up</h3>`;
}

function updateCountdownDisplay() {
  DOMSelectors.timerArea.innerHTML = `<h3>time remaining: ${duration}s</h3>`;
}

function updateItemDisplay(index) {
  const item = normalAuctionItems[index];
  if (item) {
    DOMSelectors.leftSide.innerHTML = `
      <div class="item-display"> 
            <img src="${item.image}" alt="" class="m-auto">
          </div>
          
          <div class="item-info">
            <h3>${item.name}</h3>
            <p>${item.description}</p>
          </div>
    `;
  } else {
    DOMSelectors.leftSide.innerHTML = `<p>no item found.</p>`;
  }
}
//updateItemDisplay(0);
