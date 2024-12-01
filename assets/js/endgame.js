document.getElementById('playerName').textContent = sessionStorage.getItem('player') || "Jogador";
document.getElementById('finalTime').textContent = sessionStorage.getItem('finalTime');
document.getElementById('finalAttempts').textContent = sessionStorage.getItem('finalAttempts');

document.getElementById('retryBtn').addEventListener('click', () => {
    sessionStorage.removeItem('finalTime');
    sessionStorage.removeItem('finalAttempts');
    sessionStorage.removeItem('matchedCards');

    window.location.href = "./game.html";
});