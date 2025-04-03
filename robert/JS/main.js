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

DOMSelectors.bidButton.addEventListener("click", () => {
  const playerBidIncreaseAmt = parseFloat(DOMSelectors.bidInput.value);
  if (!isNaN(playerBidIncreaseAmt) && playerBidIncreaseAmt > 0) {
    increaseBid(true, playerBidIncreaseAmt);
  } else {
    alert("that isn't a valid bid amount");
  }
});

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

newItem();
function newItem() {
  if (normalAuctionItems.length === 0) {
    endSequence();
  }

  updateWalletDisplay();
  index = Math.floor(Math.random() * normalAuctionItems.length);
  updateItemDisplay();
  DOMSelectors.bidButton.style.display = "inline-block";

  countdownAndReset();
}

async function countdownAndReset() {
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

  updateWalletDisplay();

  let latestBidLog = DOMSelectors.bidLog.querySelector("p:first-of-type");
  console.log(`latest bid log: ${latestBidLog}`);
  if (latestBidLog && latestBidLog.classList.contains("belongs-to-player")) {
    playerWallet -= currentBid;
    pushItemToInventory();
  }
  updateWalletDisplay();

  duration = 10;
  DOMSelectors.bidLog.innerHTML = ``;
  DOMSelectors.bidInput.value = ``;
  currentBid = 0;
  updateBidDisplay(currentBid);
  normalAuctionItems.splice(index, 1);
  newItem();
}

function endSequence() {
  DOMSelectors.gameContent.innerHTML = `<div class="end">
  <u><h1>-end of auction-</h1></u>
  <div class="flex flex-row flex-wrap justify-around items-center">
    <div class="bg-[#e7e0e6] ">
      <b><h2>final balance: </h2></b>
      <h2>${playerWallet.toFixed(2)}</h2>
    </div>
  </div>
</div>`;
}

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

function increaseBid(bidBelongsToPlayer, playerBidIncreaseAmt) {
  if (bidBelongsToPlayer) {
    if (playerBidIncreaseAmt + currentBid > playerWallet) {
      alert("You don't have enough money in your wallet!");
      return;
    }
    if (
      !playerBidIncreaseAmt ||
      isNaN(playerBidIncreaseAmt) ||
      playerBidIncreaseAmt <= 0
    ) {
      alert("That isn't a valid value");
      return;
    }
    currentBid += playerBidIncreaseAmt;
    DOMSelectors.bidLog.insertAdjacentHTML(
      "afterbegin",
      `<p class="belongs-to-player">You have increased the bid by $${playerBidIncreaseAmt.toFixed(
        2
      )}!</p><br>`
    );

    DOMSelectors.bidInput.value = ``;
  } else {
    const item = normalAuctionItems[index];
    const maxIterations = Math.floor(Math.random() * 2 + 1);
    for (let i = 0; i < maxIterations; i++) {
      let randomPlayer = Math.floor(Math.random() * defaultBidders.length);
      let randomNumber = parseFloat(Math.random().toFixed(2) * item.multiplier);
      currentBid += randomNumber;

      DOMSelectors.bidLog.insertAdjacentHTML(
        "afterbegin",
        `<p>${
          defaultBidders[randomPlayer]
        } increased the bid by $${randomNumber.toFixed(2)}!</p><br>`
      );
    }
  }

  if (duration <= 3) {
    duration += 1;
  }

  updateBidDisplay(currentBid);
}

function pushItemToInventory() {
  const item = normalAuctionItems[index];
  playerWallet += item.value;

  if (item) {
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
        ${item.soldPrice > item.value ? "<p>(that's not good)</p>" : ""}
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
