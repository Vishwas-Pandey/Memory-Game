const board = document.getElementById("game-board");
const livesDisplay = document.getElementById("lives");
const scoreDisplay = document.getElementById("score");
const timerDisplay = document.getElementById("timer");

let lives = 3;
let score = 0;
let timeLeft = 120;
let firstCard = null;
let secondCard = null;
let lockBoard = false;

const images = [
  "assets/img1.png", "assets/img2.png", "assets/img3.png", "assets/img4.png",
  "assets/img5.png", "assets/img6.png", "assets/img7.png", "assets/img8.png"
];

let cards = [...images, ...images]; // Duplicate for pairs

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

function createBoard() {
  shuffle(cards);
  cards.forEach((imgSrc) => {
    const card = document.createElement("div");
    card.classList.add("card");
    card.dataset.image = imgSrc;

    card.innerHTML = `
      <div class="front"></div>
      <div class="back" style="background-image: url('${imgSrc}')"></div>
    `;

    card.addEventListener("click", flipCard);
    board.appendChild(card);
  });

  // Show all cards initially
  const allCards = document.querySelectorAll(".card");
  allCards.forEach(card => card.classList.add("flipped"));

  // Show 10-second countdown in preview bar
  let previewTime = 10;
  const previewTimer = document.getElementById("preview-timer");
  const previewBar = document.getElementById("preview-bar");

  const countdown = setInterval(() => {
    previewTime--;
    previewTimer.textContent = `Game starts in ${previewTime}...`;

    if (previewTime <= 0) {
      clearInterval(countdown);
      previewBar.style.display = "none";
      allCards.forEach(card => card.classList.remove("flipped"));
      startTimer();
    }
  }, 1000);
}


function flipCard() {
  if (lockBoard || this.classList.contains("flipped")) return;

  this.classList.add("flipped");

  if (!firstCard) {
    firstCard = this;
  } else {
    secondCard = this;
    lockBoard = true;

    const match = firstCard.dataset.image === secondCard.dataset.image;

    if (match) {
      score += 10;
      scoreDisplay.textContent = score;
      resetTurn();
    } else {
      lives--;
      livesDisplay.textContent = lives;

      setTimeout(() => {
        firstCard.classList.remove("flipped");
        secondCard.classList.remove("flipped");
        resetTurn();
      }, 1000);
    }

    if (lives === 0) endGame();
  }

  // Check for win
  if (document.querySelectorAll('.card.flipped').length === cards.length) {
    endGame(true);
  }
}

function resetTurn() {
  [firstCard, secondCard] = [null, null];
  lockBoard = false;
}

function startTimer() {
  const interval = setInterval(() => {
    timeLeft--;
    timerDisplay.textContent = timeLeft;

    if (timeLeft === 0) {
      clearInterval(interval);
      endGame();
    }
  }, 1000);
}

function endGame(won = false) {
  localStorage.setItem("finalScore", score);
  window.location.href = "end.html";
}

createBoard();

