document.addEventListener('DOMContentLoaded', () => {
    const startGameButton = document.getElementById('start-game-button');
    const welcomeView = document.getElementById('welcome-view');
    const difficultyView = document.getElementById('difficulty-view');
    const btnIntermediario = document.getElementById('btn-intermediario');
    const btnDificil = document.getElementById('btn-dificil');

    //* Verifica se a URL pede para mostrar a tela de dificuldade
    const urlParams = new URLSearchParams(window.location.search);
    const view = urlParams.get('view');

    if (view === 'difficulty') {
        welcomeView.classList.add('hidden');
        difficultyView.classList.remove('hidden');
    } else {
        welcomeView.classList.remove('hidden');
        difficultyView.classList.add('hidden');
    }

    //* Evento do botão "Iniciar o jogo!"
    startGameButton.addEventListener('click', (e) => {
        e.preventDefault();
        welcomeView.classList.add('hidden');
        difficultyView.classList.remove('hidden');
    });

    //* Função para iniciar o jogo
    const handleStartGame = (difficulty) => {
        console.log(`Dificuldade escolhida: ${difficulty}`);
        localStorage.setItem('gameDifficulty', difficulty);
        window.location.href = '/page/game.html';
    };

    //* Adiciona eventos aos botões de dificuldade
    if (btnIntermediario) {
        btnIntermediario.addEventListener('click', () => handleStartGame('intermediario'));
    }
    
    if (btnDificil) {
        btnDificil.addEventListener('click', () => handleStartGame('dificil'));
    }
});