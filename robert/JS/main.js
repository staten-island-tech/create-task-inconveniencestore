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
  walletDisplay: document.querySelector(".wallet-balance"),
  playerInventory: document.querySelector(".player-inventory"),
};

let duration = 10;
let currentBid = 0;
let playerWallet = 100;
let playerInventory = [];

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
  let index = Math.floor(Math.random() * normalAuctionItems.length);

  //update visual of the auction. it is that only
  updateItemDisplay(index);

  //start the game process:
  //start the timer,
  countdown(index);
  // make an async function for the audience, update current price bid display
  //side note: global variable for current amount of money?
}

//call this in countdown every second that it's triggered?
async function audienceBid(index) {
  const item = normalAuctionItems[index];

  let bidChance = Math.floor(Math.random() * 100 + 1);

  if (bidChance <= item.bidEagerness) {
    console.log("bid increased");
    item.bidEagerness -= 1;
    console.log(`item.bidEagerness: ${item.bidEagerness}`);
    increaseBid(false);
  }
}

function increaseBid(bidBelongsToPlayer) {
  const playerBidIncreaseAmt = parseFloat(DOMSelectors.bidInput.value);

  //duration += 1;
  let randomNumber = Math.floor(Math.random() * defaultBidders.length);

  if (
    bidBelongsToPlayer === true &&
    playerBidIncreaseAmt != 0 &&
    isNaN(playerBidIncreaseAmt) === false
  ) {
    currentBid += playerBidIncreaseAmt;
    DOMSelectors.bidInput.value = ``;
    DOMSelectors.bidLog.insertAdjacentHTML(
      "afterbegin",
      `<h4 class="belongs-to-player">you have increased the bid by ${playerBidIncreaseAmt}!</h4> <br>`
    );
  } else {
    currentBid += randomNumber;
    DOMSelectors.bidLog.insertAdjacentHTML(
      "afterbegin",
      `<h4>${defaultBidders[randomNumber]} increased by the bid by $${randomNumber}!</h4> <br>`
    );
  }

  updateBidDisplay(currentBid);
}

async function countdown(index) {
  while (duration > 0) {
    updateCountdownDisplay();
    audienceBid(index);
    await wait(500);
    audienceBid(index);
    await wait(500);
    duration--;
  }

  DOMSelectors.timerArea.innerHTML = `<h3>times up</h3>`;
  await wait(2000);

  //update player wallet
  updateWalletDisplay();

  //determine if the player owns the item
  let latestBidLog = DOMSelectors.bidLog.querySelector("h4:first-of-type");
  console.log(`latest bid log: ${latestBidLog}`);
  if (latestBidLog && latestBidLog.classList.contains("belongs-to-player")) {
    playerWallet -= currentBid;
    pushItemToInventory(index);
  }

  updateWalletDisplay();
  //reset rest of everything for another round
  duration = 10;
  DOMSelectors.bidLog.innerHTML = ``;
  currentBid = 0;
  updateBidDisplay(currentBid);
  newItem();
}

function pushItemToInventory(index) {
  const item = normalAuctionItems[index];

  if (item) {
    // Add the item to the inventory array
    playerInventory.push(item);

    DOMSelectors.playerInventory.insertAdjacentHTML(
      "beforeend",
      `
      <div class="inventory-item">
        <img src="${item.image}" alt="${item.name}" class="inventory-image">
        <h4>${item.name}</h4>
        <p>${item.description}</p>
      </div>
      `
    );
  }
}

function updateBidDisplay(currentBid) {
  DOMSelectors.currentBidDisplay.innerHTML = `<h3>$${currentBid}</h3>`;
}

function updateWalletDisplay() {
  DOMSelectors.walletDisplay.textContent = `$${playerWallet.toFixed(2)}`;
}

function updateCountdownDisplay() {
  DOMSelectors.timerArea.innerHTML = `<h3>time remaining: ${duration}s</h3>`;
}

function updateItemDisplay(index) {
  const item = normalAuctionItems[index];
  if (item) {
    DOMSelectors.leftSide.innerHTML = `
            <img src="${item.image}" alt="" class="m-auto">
          </div>
          
          <div class="item-info">
            <h3>${item.name}</h3>
            <p>${item.description}</p>
    `;
  } else {
    DOMSelectors.leftSide.innerHTML = `<p>no item found.</p>`;
  }
}
