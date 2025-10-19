document.addEventListener('DOMContentLoaded', () => {

    const gameBoard = document.querySelector('.game-board');
    const historyLog = document.getElementById('history-log');
    const scoreElement = document.getElementById('score-counter');
    const timeElement = document.getElementById('time-counter');
    const btnAbandon = document.getElementById('btn-abandon');
    const btnRestart = document.getElementById('btn-restart');

    const difficulty = localStorage.getItem('gameDifficulty') || 'intermediario';
    //? console.log("Dificuldade Atual:", difficulty);

    let cards = []; //* Array de elementos DOM
    let cardData = []; //* Array de dados das cartas vindos da API
    let hasFlippedCard = false;
    let lockBoard = false;
    let firstCard, secondCard;
    let score = 0;
    let timer = 0;
    let timerInterval = null;
    let matchedPairs = 0;

    //* Funções do Histórico
    function addHistoryLog(message, type) {
        const logEntry = document.createElement('p');
        logEntry.textContent = message;
        logEntry.classList.add(`log-${type}`);
        historyLog.prepend(logEntry);
        //* Limita o número de entradas no log
        if (historyLog.children.length > 20) {
            historyLog.lastChild.remove();
        }
    }

    //* Funções do Jogo
    async function fetchCards() {
        try {
            //* Usa authFetch para requisição autenticada
            const response = await auth.authFetch('/api/game/cards');
            if (!response.ok) throw new Error('Falha ao carregar as cartas.');
            
            const fetchedCards = await response.json();
            //* Duplica as cartas vindas da API para formar pares
            cardData = [...fetchedCards, ...fetchedCards];

        } catch (error) {
            console.error(error);
            addHistoryLog('Erro ao carregar o jogo. Tente recomeçar.', 'lose');
            //* Trava o tabuleiro se as cartas não puderem ser carregadas
            lockBoard = true; 
        }
    }

    async function createBoard() {
        //* Reseta o estado
        gameBoard.innerHTML = '';
        cards = [];
        score = 0;
        timer = 0;
        matchedPairs = 0;
        scoreElement.textContent = score;
        timeElement.textContent = `${timer}s`;
        historyLog.innerHTML = '';
        resetBoard();
        lockBoard = true; //* Trava enquanto busca

        addHistoryLog('Buscando cartas...', 'info');
        await fetchCards();
        
        if (cardData.length === 0) {
                lockBoard = false; //* Destrava se falhou
                return; 
        }

        //* Embaralha os dados das cartas
        cardData.sort(() => 0.5 - Math.random());

        //* Cria e insere os elementos no DOM
        cardData.forEach(cardInfo => {
            const card = document.createElement('div');
            card.classList.add('memory-card');
            card.dataset.cardId = cardInfo.id; //* ID vindo do banco

            //* Caminho da Imagem
            const relativeImageUrl = '../' + cardInfo.image_url.substring(1);
            card.innerHTML = `
                <div class="card-front">
                    <img src="${relativeImageUrl}" alt="${cardInfo.name}" class="w-full h-full object-cover"> 
                </div>
                <div class="card-back">?</div>
            `;

            card.addEventListener('click', flipCard);
            gameBoard.appendChild(card);
            cards.push(card); //* Guarda a referência do elemento DOM
        });

        addHistoryLog('Cartas embaralhadas. Bom jogo!', 'info');
        lockBoard = false; //* Destrava após criar o tabuleiro
        startTimer();
    }

    function startTimer() {
        if (timerInterval) clearInterval(timerInterval);
        timerInterval = setInterval(() => {
            timer++;
            timeElement.textContent = `${timer}s`;
        }, 1000);
    }

    function stopTimer() {
        clearInterval(timerInterval);
    }

    function flipCard() {
        if (lockBoard) return;
        if (this === firstCard) return; 

        this.classList.add('is-flipped');

        if (!hasFlippedCard) {
            //* Primeiro clique
            hasFlippedCard = true;
            firstCard = this;
            return;
        }

        //* Segundo clique
        secondCard = this;
        lockBoard = true; //* Trava o tabuleiro para verificar
        checkForMatch();
    }

function checkForMatch() {
        let isMatch = firstCard.dataset.cardId === secondCard.dataset.cardId;

        if (isMatch) {
            score += 10;
            addHistoryLog('Par encontrado! +10 pontos', 'win');
            matchedPairs++;
            disableCards(); 
            
            if (matchedPairs === (cardData.length / 2)) {
                stopTimer();
                addHistoryLog(`Parabéns! Você venceu em ${timer}s!`, 'win');
                saveGameResult(); 
            } else {
                    resetBoard();
            }
        } else {
            //* Erro
            score = Math.max(0, score - 5); 
            addHistoryLog('Ops, não é um par. -5 pontos', 'lose');

            if (difficulty === 'dificil') {
                addHistoryLog('Embaralhando cartas restantes...', 'info'); 

                unflipCards(shuffleUnmatchedCards); 

            } else {
                    //* Modo normal: Apenas desvira após 1 segundo, sem callback
                    unflipCards(); 
            }
        }
        scoreElement.textContent = score;
    }

    function shuffleUnmatchedCards() {
        //* Trava o tabuleiro APENAS durante o embaralhamento visual
        lockBoard = true; 
        const unmatchedCardsElements = cards.filter(card => !card.classList.contains('is-matched'));

        unmatchedCardsElements.forEach((cardElement) => {
            cardElement.style.order = Math.floor(Math.random() * 100); 
        });

        setTimeout(() => {
             lockBoard = false; //* Destrava após o shuffle visual
             //? console.log("Shuffle visual concluído, tabuleiro destravado.");
        }, 100); //? 100ms deve ser suficiente
    }

    async function saveGameResult() {
        try {
            const currentDifficulty = localStorage.getItem('gameDifficulty') || 'intermediario';
            const stats = { score: score, time: timer, difficulty: currentDifficulty };
            
            await auth.authFetch('/api/game/save', { 
                method: 'POST', 
                body: JSON.stringify(stats) 
            });
            
            localStorage.setItem('endGameStats', JSON.stringify(stats));
            
            setTimeout(() => { 
                window.location.href = '/page/endgame.html';
            }, 1000);

        } catch (error) {
            console.error('Erro ao salvar o jogo:', error);
            addHistoryLog('Erro ao salvar sua pontuação.', 'lose');
            //* Salva no localStorage mesmo com erro no backend para mostrar na tela final
            const currentDifficulty = localStorage.getItem('gameDifficulty') || 'intermediario';
            const stats = { score: score, time: timer, difficulty: currentDifficulty };
            localStorage.setItem('endGameStats', JSON.stringify(stats)); 
            setTimeout(() => { 
                window.location.href = '/page/endgame.html';
            }, 1000);
        }
    }

    function disableCards() {
        firstCard.classList.add('is-matched');
        secondCard.classList.add('is-matched');
        firstCard.removeEventListener('click', flipCard);
        secondCard.removeEventListener('click', flipCard);
        //! Não resetar o board aqui, resetBoard é chamado em checkForMatch após disableCards
    }

    function unflipCards(callback) { 
        //* O tabuleiro já está travado por checkForMatch
        setTimeout(() => {
            //* Só desvira se a carta não for um par já encontrado
            if (firstCard && !firstCard.classList.contains('is-matched')) {
                firstCard.classList.remove('is-flipped');
            }
            if (secondCard && !secondCard.classList.contains('is-matched')) {
                secondCard.classList.remove('is-flipped');
            }
            
            //* Reseta as variáveis primeiro
            const wasLocked = lockBoard;
            resetBoard();
            
            //* Executa o callback (shuffle) SE ele foi passado e o tabuleiro ESTAVA travado
            if (callback && typeof callback === 'function' && wasLocked) { 
                callback();
            } 

        }, 1000); //* Tempo para ver a segunda carta antes de desvirar
    }

    //* Reseta as variáveis de estado e destrava o tabuleiro
    function resetBoard() {
        [hasFlippedCard, lockBoard] = [false, false]; 
        [firstCard, secondCard] = [null, null];
    }

    btnRestart.addEventListener('click', () => {
        window.location.href = '/page/inicio?view=difficulty';
    });
    btnAbandon.addEventListener('click', () => {
        if (confirm('Tem certeza que deseja abandonar a partida?')) {
            window.location.href = '/page/inicio.html';
        }
    });

    createBoard();
});