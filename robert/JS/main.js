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
  gameContent: document.querySelector(".game-content-two"),
};

let duration = 10;
let currentBid = 0;
let playerWallet = 100;
let playerOwned = [];

let index = 0;

function generateNewNumber() {
  index = Math.floor(Math.random() * normalAuctionItems.length);
}

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
  if (normalAuctionItems.length === 0) {
    endSequence();
  }
  updateWalletDisplay();
  generateNewNumber();
  updateItemDisplay();
  DOMSelectors.bidButton.style.display = "inline-block";

  countdown();
}

function endSequence() {
  DOMSelectors.gameContent.innerHTML = `<div class="end">
  <u><h1>-end of auction-</h1></u>
  <div class="flex flex-row flex-wrap justify-around items-center">
    <div class="bg-[#e7e0e6] ">
      <b><h2>final balance: ${playerWallet}</h2></b>
    </div>
  </div>
</div>`;
}

//call this in countdown every second that it's triggered?
async function audienceBid() {
  const item = normalAuctionItems[index];

  let bidChance = Math.floor(Math.random() * 100 + 1);

  if (bidChance <= item.bidEagerness) {
    console.log("bid increased");
    item.bidEagerness -= 5;
    console.log(`item.bidEagerness: ${item.bidEagerness}`);
    increaseBid(false);
  }
}

function increaseBid(bidBelongsToPlayer) {
  const playerBidIncreaseAmt = parseFloat(DOMSelectors.bidInput.value);

  if (bidBelongsToPlayer === true) {
    if (playerBidIncreaseAmt + currentBid > playerWallet) {
      alert("you don't have enough money in your wallet!");
      return;
    }
    if (
      !DOMSelectors.bidInput.value ||
      isNaN(playerBidIncreaseAmt) ||
      playerBidIncreaseAmt <= 0
    ) {
      alert("that isnt a valid value");
      return;
    }
  }

  const item = normalAuctionItems[index];

  if (duration <= 3) {
    duration += 1;
  }

  let randomPlayer = Math.floor(Math.random() * defaultBidders.length);
  let randomNumber = parseFloat(Math.random().toFixed(2) * item.multiplier);

  if (
    bidBelongsToPlayer === true &&
    playerBidIncreaseAmt > 0 &&
    isNaN(playerBidIncreaseAmt) === false
  ) {
    currentBid += playerBidIncreaseAmt;
    DOMSelectors.bidInput.value = ``;
    DOMSelectors.bidLog.insertAdjacentHTML(
      "afterbegin",
      `<p class="belongs-to-player">you have increased the bid by $${playerBidIncreaseAmt.toFixed(
        2
      )}!</p> <br>`
    );
  } else {
    currentBid += randomNumber;
    DOMSelectors.bidLog.insertAdjacentHTML(
      "afterbegin",
      `<p>${
        defaultBidders[randomPlayer]
      } increased by the bid by $${randomNumber.toFixed(2)}!</p> <br>`
    );
  }
  updateBidDisplay(currentBid);
}

async function countdown() {
  while (duration > 0) {
    updateCountdownDisplay();
    audienceBid();
    await wait(500);
    audienceBid();
    await wait(500);
    duration--;
  }

  DOMSelectors.bidButton.style.display = "none";
  DOMSelectors.timerArea.innerHTML = `<h3>times up</h3>`;
  await wait(2000);

  //update player wallet
  updateWalletDisplay();

  //determine if the player owns the item
  let latestBidLog = DOMSelectors.bidLog.querySelector("p:first-of-type");
  console.log(`latest bid log: ${latestBidLog}`);
  if (latestBidLog && latestBidLog.classList.contains("belongs-to-player")) {
    playerWallet -= currentBid;
    pushItemToInventory();
  }

  updateWalletDisplay();
  //reset rest of everything for another round
  duration = 10;
  DOMSelectors.bidLog.innerHTML = ``;
  currentBid = 0;
  updateBidDisplay(currentBid);
  normalAuctionItems.splice(index, 1);
  newItem();
}

function pushItemToInventory() {
  const item = normalAuctionItems[index];
  playerWallet += item.value;

  if (item) {
    // Add the item to the inventory array
    playerOwned.push(item);
    playerOwned[playerOwned.length - 1].soldPrice = currentBid;

    DOMSelectors.playerInventory.insertAdjacentHTML(
      "beforeend",
      `
      <div class="inventory-item bg-slate-300">
        <b><h2>${item.name}</h2></b>
        <h3>${item.description}</h3>
        <p>you paid $${item.soldPrice.toFixed(2)}</p>
        <p>and it was worth $${item.value.toFixed(2)}</p>
        <p>which means you earned ${(
          100 -
          (item.soldPrice / item.value) * 100
        ).toFixed(2)}% of the original price</p>
        ${item.soldPrice > item.value ? "<p> (that's not good)</p>" : ""}
      </div>
      `
    );
  } else {
    alert("no more items!");
  }
}

function updateBidDisplay(currentBid) {
  DOMSelectors.currentBidDisplay.innerHTML = `<h3>$${currentBid.toFixed(
    2
  )}</h3>`;
}

function updateWalletDisplay() {
  DOMSelectors.walletDisplay.innerHTML = `<h3>wallet balance: $${playerWallet.toFixed(
    2
  )}</h3>`;
}

function updateCountdownDisplay() {
  DOMSelectors.timerArea.innerHTML = `<h3>time remaining: ${duration}s</h3>`;
}

function updateItemDisplay() {
  const item = normalAuctionItems[index];
  if (item) {
    DOMSelectors.leftSide.innerHTML = `
          <div class="item-info">
            <b><h2>${item.name}</h2></b>
            <h4>${item.description}</h4>
    `;
  } else {
    DOMSelectors.leftSide.innerHTML = `<h2>no item found.</h2>`;
  }
}
