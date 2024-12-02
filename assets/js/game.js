const cards = [
    { name: "i-forum-de-tecnologia-2014", img: "http://localhost:8080/FIT---memorygame/assets/images/game/1.jpeg" },
    { name: "era-dos-dados-2022", img: "http://localhost:8080/FIT---memorygame/assets/images/game/2.jpeg" },
    { name: "fit-on-a-tecnologia-expande-limites-2021-1", img: "http://localhost:8080/FIT---memorygame/assets/images/game/3.jpeg" },
    { name: "fit-2019-o-futuro-esta-por-ai", img: "http://localhost:8080/FIT---memorygame/assets/images/game/4.jpeg" },
    { name: "4-fit-2017", img: "http://localhost:8080/FIT---memorygame/assets/images/game/5.jpeg" },
    { name: "otimizacao-alem-das-fronteiras-2023", img: "http://localhost:8080/FIT---memorygame/assets/images/game/6.jpeg" },
    { name: "ii-forum-de-tecnologia-e-inovacao-2015", img: "http://localhost:8080/FIT---memorygame/assets/images/game/7.jpeg" },
    { name: "7-fit-2021.2", img: "http://localhost:8080/FIT---memorygame/assets/images/game/8.jpeg" },
    { name: "iii-forum-de-inovacao-e-tecnologia-2016", img: "http://localhost:8080/FIT---memorygame/assets/images/game/9.jpeg" },
    { name: "forum-de-inovacao-e-tecnologia-2018", img: "http://localhost:8080/FIT---memorygame/assets/images/game/10.jpeg" },
    { name: "fit-2k24-1", img: "http://localhost:8080/FIT---memorygame/assets/images/game/11.jpeg" },
    { name: "fit-2k24-2", img: "http://localhost:8080/FIT---memorygame/assets/images/game/12.jpeg" },
    { name: "fit-2k24-3", img: "http://localhost:8080/FIT---memorygame/assets/images/game/13.jpeg" },
    { name: "fit-2k24-4", img: "http://localhost:8080/FIT---memorygame/assets/images/game/14.jpeg" },
    { name: "fit-2k24-5", img: "http://localhost:8080/FIT---memorygame/assets/images/game/15.jpeg" },
];

const spanPlayer = document.querySelector('.player');
let attempts = 0;
let matchedCards = 0;
let timer;
let seconds = 0;

function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
}

function formatToHHMMSS(seconds) {
    const hours = String(Math.floor(seconds / 3600)).padStart(2, '0');
    const minutes = String(Math.floor((seconds % 3600) / 60)).padStart(2, '0');
    const secs = String(seconds % 60).padStart(2, '0');
    return `${hours}:${minutes}:${secs}`;
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

const gameCards = [...cards, ...cards];
shuffleArray(gameCards);

const gameContainer = document.querySelector('.memory-game');
const attemptsElement = document.getElementById('attempts');
const timerElement = document.getElementById('timer');

function initGame() {
    gameContainer.innerHTML = '';
    attempts = 0;
    matchedCards = 0;
    seconds = 0;
    clearInterval(timer);
    timer = setInterval(() => {
        seconds++;
        timerElement.textContent = `${seconds}s`;
    }, 1000);
    attemptsElement.textContent = attempts;

    gameCards.forEach(card => {
        const cardElement = document.createElement('div');
        cardElement.classList.add('card');
        cardElement.dataset.name = card.name;

        cardElement.innerHTML = `
            <div class="card-inner">
                <div class="card-front"></div>
                <div class="card-back" style="background-image: url(${card.img});"></div>
            </div>
        `;
        gameContainer.appendChild(cardElement);

        cardElement.addEventListener('click', handleCardClick);
    });
}

let firstCard = null;
let lockBoard = false;

function endGame() {
    clearInterval(timer);
    const formattedTime = formatTime(seconds);
    const bestTime = formatToHHMMSS(seconds);
    sessionStorage.setItem('finalTime', formattedTime);
    sessionStorage.setItem('finalAttempts', attempts);
    sessionStorage.setItem('matchedCards', matchedCards);

    const username = sessionStorage.getItem('player');

    fetch('http://localhost:3000/update-best-time', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, bestTime: seconds })
    })
        .then(response => response.json())
        .then(data => {
            console.log(data.message);
            window.location.href = "endgame.html";
        })
        .catch(error => {
            console.error("Erro ao atualizar o melhor tempo:", error);
            window.location.href = "endgame.html";
        });
}

function handleCardClick(e) {
    if (lockBoard) return;
    const clickedCard = e.currentTarget;

    if (clickedCard === firstCard) return;

    clickedCard.classList.add('flipped');

    if (!firstCard) {
        firstCard = clickedCard;
        return;
    }

    attempts++;
    attemptsElement.textContent = attempts;

    const isMatch = firstCard.dataset.name === clickedCard.dataset.name;

    if (isMatch) {
        matchedCards += 2;
        resetBoard();

        if (matchedCards === gameCards.length) {
            endGame();
        }
    } else {
        lockBoard = true;
        setTimeout(() => {
            firstCard.classList.remove('flipped');
            clickedCard.classList.remove('flipped');
            resetBoard();
        }, 1000);
    }
}

function resetBoard() {
    [firstCard, lockBoard] = [null, false];
}

window.onload = () => {
    const playerName = sessionStorage.getItem('player') || "Jogador";
    spanPlayer.innerHTML = playerName;
    initGame();
}

document.getElementById('exitButton').addEventListener('click', () => {
    sessionStorage.removeItem('finalTime');
    sessionStorage.removeItem('finalAttempts');
    sessionStorage.removeItem('matchedCards');
    sessionStorage.removeItem('player');

    window.location.href = '../index.html';
});

