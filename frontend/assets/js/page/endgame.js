document.addEventListener('DOMContentLoaded', () => {
    const userNameEl = document.getElementById('user-name');
    const scoreEl = document.getElementById('final-score');
    const timeEl = document.getElementById('final-time');
    const difficultyEl = document.getElementById('final-difficulty');
    const btnPlayAgain = document.getElementById('btn-play-again');
    const btnExit = document.getElementById('btn-exit');

    //* 1. Carregar dados do usuário
    const user = auth.getUser(); //
    if (user && user.name) {
        userNameEl.textContent = user.name.split(' ')[0];
    }

    //* 2. Carregar estatísticas do jogo
    try {
        const stats = JSON.parse(localStorage.getItem('endGameStats'));
        
        if (stats) {
            scoreEl.textContent = stats.score;
            timeEl.textContent = `${stats.time}s`;
            difficultyEl.textContent = stats.difficulty;
        } else {
            //* Fallback se a página for aberta diretamente
            scoreEl.textContent = '0';
            timeEl.textContent = 'N/A';
            difficultyEl.textContent = 'N/A';
        }
    } catch (e) {
        console.error("Erro ao carregar estatísticas do jogo:", e);
    }

    //* 3. Limpar o localStorage para não recarregar
    localStorage.removeItem('endGameStats');

    //* 4. Adicionar eventos aos botões
    btnPlayAgain.addEventListener('click', (e) => {
        e.preventDefault();
        window.location.href = '/page/inicio.html?view=difficulty';
    });

    btnExit.addEventListener('click', (e) => {
        e.preventDefault();
        window.location.href = '/page/inicio.html';
    });
});