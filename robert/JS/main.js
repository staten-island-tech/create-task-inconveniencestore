import "../CSS/style.css";
import { normalAuctionItems } from "./items_for_sale.js";
import { defaultBidders } from "./bidders.js";

const DOMSelectors = {
  startButton: document.querySelector(".start-button"),
  timerArea: document.querySelector(".timer-area"),
  leftSide: document.querySelector(".left-side"),
  bidButton: document.querySelector(".bid-button"),
  bidLog: document.querySelector(".bid-log"),
  currentBidDisplay: document.querySelector(".current-bid-display"),
  bidInput: document.querySelector(".bid-input"),
};

let duration = 10;
let currentBid = 0;

DOMSelectors.bidButton.addEventListener("click", () => {
  console.log("click");
  increaseBid(true);
});

function wait(ms) {
  //when resolve is called, it counts as promise fulfilled
  return new Promise((resolve) => setTimeout(resolve, ms));
}

newItem();
function newItem() {
  //determine the item
  let randomNumber = Math.floor(Math.random() * normalAuctionItems.length);
  console.log(`random number: ${randomNumber}`);

  //update visual of the auction. it is that only
  updateItemDisplay(randomNumber);

  //start the game process:
  //start the timer,
  countdown(randomNumber);
  // make an async function for the audience, update current price bid display
  //side note: global variable for current amount of money?
}

function updateBidDisplay(currentBid) {
  DOMSelectors.currentBidDisplay.innerHTML = `<h3>$${currentBid}</h3>`;
}

//call this in countdown every second that it's triggered?
async function audienceBid(randomNumber) {
  const item = normalAuctionItems[randomNumber];

  console.log(`bid eagerness adjusted, current value: ${item.bidEagerness}`);
  let bidChance = Math.floor(Math.random() * 100 + 1);
  console.log(`bid chance: ${bidChance}`);

  if (bidChance <= item.bidEagerness) {
    console.log("bid increased");
    increaseBid(false);
  }
}

function increaseBid(bidBelongsToPlayer) {
  const playerBidIncreaseAmt = DOMSelectors.bidInput.value;
  DOMSelectors.bidInput.value = ``;
  //duration += 1;
  let randomNumber = Math.floor(Math.random() * defaultBidders.length);

  if (bidBelongsToPlayer === true) {
    DOMSelectors.bidLog.insertAdjacentHTML(
      "beforeend",
      `you have increased the bid by ${playerBidIncreaseAmt}! <br>`
    );
  } else {
    DOMSelectors.bidLog.insertAdjacentHTML(
      "beforeend",
      `${defaultBidders[randomNumber]} increased by the bid by $____! <br>`
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

  await wait(1000);
  reset();
}

function reset() {
  duration = 10;
  DOMSelectors.bidLog.innerHTML = ``;
  newItem();
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
